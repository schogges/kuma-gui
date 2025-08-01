Feature: Dataplane details for built-in gateway

  Background:
    Given the CSS selectors
      | Alias             | Selector                                                           |
      | detail-view       | [data-testid='data-plane-detail-tabs-view']                        |
      | policies-view     | [data-testid='data-plane-policies-view']                           |
      | warnings          | [data-testid^='notification-data-planes.notifications.no-mtls']    |
      | details           | [data-testid='dataplane-details']                                  |
      | route-item        | [data-testid='builtin-gateway-dataplane-policies'] .accordion-item |
      | route-item-button | $route-item:nth-child(1) [data-testid='accordion-item-button']     |
    And the environment
      """
      KUMA_DATAPLANE_RUNTIME_UNIFIED_RESOURCE_NAMING_ENABLED: true
      """

  Scenario: Overview tab has expected content
    Given the environment
      """
      KUMA_SUBSCRIPTION_COUNT: 2
      KUMA_DATAPLANEINBOUND_COUNT: 0
      KUMA_MODE: global
      """
    And the URL "/meshes/default/dataplanes/dataplane-gateway_builtin-1/_overview" responds with
      """
      body:
        mesh: default
        dataplane:
          networking:
            address: 193.107.134.106
            gateway:
              type: BUILTIN
              tags:
                kuma.io/protocol: http
                kuma.io/zone: zone-1
            inbound: !!js/undefined
        dataplaneInsight:
          mTLS:
            certificateExpirationTime: 2023-10-31T00:00:00Z
            lastCertificateRegeneration: 2023-10-01T00:00:00Z
          subscriptions:
            - controlPlaneInstanceId: 'dpp-1-cp-instance-id'
              connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: 2021-02-17T07:33:36.412683Z
              version: !!js/undefined
            - controlPlaneInstanceId: 'dpp-1-cp-instance-id'
              connectTime: 2021-02-17T07:33:36.412683Z
              disconnectTime: !!js/undefined
              version:
                kumaDp:
                  version: 1.0.8
                  kumaCpCompatible: true
                envoy:
                  kumaDpCompatible: true
      """
    And the date is "2023-10-14T00:00:00Z"
    When I visit the "/meshes/default/data-planes/dataplane-gateway_builtin-1/overview" URL
    Then the page title contains "dataplane-gateway_builtin-1"
    And the "$detail-view" element contains "dataplane-gateway_builtin-1"
    And the "$details" element contains
      | Value                 |
      | Online                |
      |       193.107.134.106 |
      | kuma.io/protocol:http |
      | kuma.io/zone:zone-1   |
    And the "$warnings" element doesn't exists

  Scenario: Overview tab shows warning when no mTLS is set
    And the URL "/meshes/default/dataplanes/dataplane-gateway_builtin-1/_overview" responds with
      """
      body:
        dataplaneInsight:
          mTLS: !!js/undefined
      """
    When I visit the "/meshes/default/data-planes/dataplane-gateway_builtin-1/overview" URL
    Then the "$warnings" element exists
