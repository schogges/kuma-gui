<template>
  <DataSource
    v-slot="{ data: me }: MeSource"
    src="/me"
  >
    <RouteView
      v-if="me"
      v-slot="{ route, t, can, uri }"
      name="mesh-external-service-list-view"
      :params="{
        page: 1,
        size: me.pageSize,
        mesh: '',
        service: '',
      }"
    >
      <AppView>
        <template #title>
          <XTeleportTemplate
            :to="{ name: 'service-list-tabs-view-title'}"
          >
            <h2>
              <RouteTitle
                :title="t(`services.routes.mesh-external-service-list-view.title`)"
              />
            </h2>
          </XTeleportTemplate>
        </template>
        <KCard>
          <DataLoader
            :src="uri(sources, '/meshes/:mesh/mesh-external-services', {
              mesh: route.params.mesh,
            },{
              page: route.params.page,
              size: route.params.size,
            })"
          >
            <template
              #loadable="{ data }"
            >
              <DataCollection
                type="services"
                :items="data?.items ?? [undefined]"
              >
                <AppCollection
                  data-testid="service-collection"
                  :headers="[
                    { label: 'Name', key: 'name' },
                    { label: 'Namespace', key: 'namespace' },
                    ...(can('use zones') ? [{ label: 'Zone', key: 'zone' }] : []),
                    { label: 'TLS', key: 'tls' },
                    { label: 'Addresses', key: 'addresses' },
                    { label: 'Port', key: 'port' },
                    { label: 'Details', key: 'details', hideLabel: true },
                  ]"
                  :page-number="route.params.page"
                  :page-size="route.params.size"
                  :total="data?.total"
                  :items="data?.items"
                  :is-selected-row="(item) => item.name === route.params.service"
                  @change="route.update"
                >
                  <template #name="{ row: item }">
                    <TextWithCopyButton
                      :text="item.name"
                    >
                      <XAction
                        data-action
                        :to="{
                          name: 'mesh-external-service-summary-view',
                          params: {
                            mesh: item.mesh,
                            service: item.id,
                          },
                          query: {
                            page: route.params.page,
                            size: route.params.size,
                          },
                        }"
                      >
                        {{ item.name }}
                      </XAction>
                    </TextWithCopyButton>
                  </template>
                  <template
                    #namespace="{ row: item }"
                  >
                    {{ item.namespace }}
                  </template>
                  <template #zone="{ row: item }">
                    <template v-if="item.labels && item.labels['kuma.io/origin'] === 'zone' && item.labels['kuma.io/zone']">
                      <RouterLink
                        v-if="item.labels['kuma.io/zone']"
                        :to="{
                          name: 'zone-cp-detail-view',
                          params: {
                            zone: item.labels['kuma.io/zone'],
                          },
                        }"
                      >
                        {{ item.labels['kuma.io/zone'] }}
                      </RouterLink>
                    </template>

                    <template v-else>
                      {{ t('common.detail.none') }}
                    </template>
                  </template>
                  <template #tls="{ row: item }">
                    <KBadge
                      appearance="neutral"
                    >
                      {{ item.spec.tls?.enabled ? 'Enabled' : 'Disabled' }}
                    </KBadge>
                  </template>
                  <template
                    #addresses="{ row: item }"
                  >
                    <KTruncate>
                      <span
                        v-for="address in item.status.addresses"
                        :key="address.hostname"
                      >
                        {{ address.hostname }}
                      </span>
                    </KTruncate>
                  </template>
                  <template
                    #port="{ row: item }"
                  >
                    <template
                      v-if="item.spec.match"
                    >
                      <KBadge
                        v-for="connection in [item.spec.match]"
                        :key="connection.port"
                        appearance="info"
                      >
                        {{ connection.port }}/{{ connection.protocol }}
                      </KBadge>
                    </template>
                  </template>

                  <template #details="{ row: item }">
                    <XAction
                      class="details-link"
                      data-testid="details-link"
                      :to="{
                        name: 'mesh-external-service-detail-view',
                        params: {
                          mesh: item.mesh,
                          service: item.id,
                        },
                      }"
                    >
                      {{ t('common.collection.details_link') }}

                      <ArrowRightIcon
                        decorative
                        :size="KUI_ICON_SIZE_30"
                      />
                    </XAction>
                  </template>
                </AppCollection>
                <RouterView
                  v-if="data?.items && route.params.service"
                  v-slot="child"
                >
                  <SummaryView
                    @close="route.replace({
                      name: 'mesh-external-service-list-view',
                      params: {
                        mesh: route.params.mesh,
                      },
                      query: {
                        page: route.params.page,
                        size: route.params.size,
                      },
                    })"
                  >
                    <component
                      :is="child.Component"
                      :items="data?.items"
                    />
                  </SummaryView>
                </RouterView>
              </DataCollection>
            </template>
          </DataLoader>
        </KCard>
      </AppView>
    </RouteView>
  </DataSource>
</template>

<script lang="ts" setup>
import { KUI_ICON_SIZE_30 } from '@kong/design-tokens'
import { ArrowRightIcon } from '@kong/icons'

import { sources } from '../sources'
import AppCollection from '@/app/application/components/app-collection/AppCollection.vue'
import SummaryView from '@/app/common/SummaryView.vue'
import TextWithCopyButton from '@/app/common/TextWithCopyButton.vue'
import type { MeSource } from '@/app/me/sources'
</script>
<style lang="scss" scoped>
.details-link {
  display: inline-flex;
  align-items: center;
  gap: $kui-space-20;
}
</style>
