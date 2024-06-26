<template>
  <RouteView
    v-slot="{ route, id }"
    name="zone-create-view"
    :attrs="{
      class: 'is-fullscreen',
    }"
  >
    <AppView
      :fullscreen="true"
      :breadcrumbs="[]"
    >
      <template #title>
        <h1>
          <RouteTitle
            :title="t('zones.routes.create.title')"
          />
        </h1>
      </template>

      <template #actions>
        <XDisclosure
          v-slot="{ expanded, toggle }"
        >
          <KButton
            appearance="tertiary"
            data-testid="exit-button"
            @click="() => {
              if(token === '' || isZoneConnected) {
                route.back({
                  name: 'zone-cp-list-view',
                })
              } else {
                toggle()
              }
            }"
          >
            {{ t('zones.form.exit') }}
          </KButton>
          <XTeleportTemplate
            :to="{ name: 'modal-layer' }"
          >
            <KModal
              :visible="expanded"
              :title="t('zones.form.confirm_modal.title')"
              data-testid="confirm-exit-modal"
              @cancel="toggle"
              @proceed="route.replace({ name: 'zone-cp-list-view' })"
            >
              {{ t('zones.form.confirm_modal.body') }}

              <template #footer-actions>
                <KButton
                  appearance="primary"
                  :to="{ name: 'zone-cp-list-view' }"
                  data-testid="confirm-exit-button"
                >
                  {{ t('zones.form.confirm_modal.action_button') }}
                </KButton>
              </template>
            </KModal>
          </XTeleportTemplate>
        </XDisclosure>
      </template>

      <div class="form-wrapper">
        <KAlert
          v-if="error !== null"
          appearance="danger"
          class="mb-4"
          data-testid="create-zone-error"
        >
          <template
            v-if="(error instanceof ApiError && [409, 500].includes(error.status))"
          >
            <p>{{ t(`zones.create.status_error.${error.status}.title`, { name: zoneNameWithError }) }}</p>

            <p>{{ t(`zones.create.status_error.${error.status}.description`) }}</p>
          </template>

          <template v-else-if="(error instanceof ApiError)">
            <p>{{ t('common.error_state.api_error', { status: error.status, title: error.detail }) }}</p>
          </template>

          <template v-else>
            <p>{{ t('common.error_state.default_error') }}</p>
          </template>
        </KAlert>

        <KCard class="form-card">
          <div class="form">
            <div class="form-header">
              <div>
                <h1 class="form-title">
                  <span class="text-gradient">{{ t('zones.form.title') }}</span>
                </h1>

                <p v-if="t('zones.form.description') !== ' '">
                  {{ t('zones.form.description') }}
                </p>
              </div>

              <div v-if="tm('zones.form.facts').length > 0">
                <ul class="fact-list">
                  <li
                    v-for="(fact, index) in tm('zones.form.facts')"
                    :key="index"
                    class="fact-list__item"
                  >
                    <CheckIcon
                      class="fact-list__icon"
                      :color="KUI_COLOR_TEXT_SUCCESS"
                    />

                    {{ fact }}
                  </li>
                </ul>
              </div>
            </div>

            <div class="form-section">
              <div class="form-section__header">
                <h2 class="form-section-title">
                  {{ t('zones.form.section.name.title') }}
                </h2>

                <p>{{ t('zones.form.section.name.description') }}</p>
              </div>

              <div class="form-section__content">
                <div>
                  <KLabel
                    :for="id"
                    required
                    :tooltip-attributes="{ placement: 'right'}"
                  >
                    {{ t('zones.form.nameLabel') }}

                    <template #tooltip>
                      {{ t('zones.form.name_tooltip') }}
                    </template>
                  </KLabel>

                  <KInput
                    :id="id"
                    v-model="name"
                    type="text"
                    name="zone-name"
                    data-testid="name-input"
                    :data-test-error-type="nameError !== null ? 'invalid-dns-name' : undefined"
                    :error="nameError !== null"
                    :error-message="nameError ?? undefined"
                    :disabled="zone !== null"
                    @blur="validateName(name)"
                  />
                </div>

                <KButton
                  appearance="primary"
                  class="mt-4"
                  :disabled="isCreateButtonDisabled"
                  data-testid="create-zone-button"
                  @click="createZone"
                >
                  <ProgressIcon
                    v-if="isChangingZone"
                    :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
                  />

                  <AddIcon v-else />

                  {{ t('zones.form.createZoneButtonLabel') }}
                </KButton>
              </div>
            </div>

            <template v-if="zone !== null">
              <div
                class="form-section"
                data-testid="connect-zone-instructions"
              >
                <div class="form-section__header">
                  <h2 class="form-section-title">
                    {{ t('zones.form.section.configuration.title') }}
                  </h2>

                  <p>{{ t('zones.form.section.configuration.description') }}</p>
                </div>

                <div class="form-section__content">
                  <div class="field-group-list">
                    <div class="field-group">
                      <span class="field-group-label">
                        {{ t('zones.form.environmentLabel') }} *
                      </span>

                      <div class="radio-button-group">
                        <KRadio
                          v-model="environment"
                          selected-value="universal"
                          name="zone-environment"
                          data-testid="environment-universal-radio-button"
                        >
                          {{ t('zones.form.universalLabel') }}
                        </KRadio>

                        <KRadio
                          v-model="environment"
                          selected-value="kubernetes"
                          name="zone-environment"
                          data-testid="environment-kubernetes-radio-button"
                        >
                          {{ t('zones.form.kubernetesLabel') }}
                        </KRadio>
                      </div>
                    </div>

                    <template v-if="environment === 'kubernetes'">
                      <div class="field-group">
                        <span class="field-group-label">
                          {{ t('zones.form.zoneIngressLabel') }} *
                        </span>

                        <div
                          class="radio-button-group"
                          data-testid="ingress-input-switch"
                        >
                          <KInputSwitch
                            v-model="zoneIngressEnabled"
                          >
                            <template #label>
                              {{ t('zones.form.zoneIngressEnabledLabel') }}
                            </template>
                          </KInputSwitch>
                        </div>
                      </div>

                      <div class="field-group">
                        <span class="field-group-label">
                          {{ t('zones.form.zoneEgressLabel') }} *
                        </span>

                        <div
                          class="radio-button-group"
                          data-testid="egress-input-switch"
                        >
                          <KInputSwitch
                            v-model="zoneEgressEnabled"
                          >
                            <template #label>
                              {{ t('zones.form.zoneEgressEnabledLabel') }}
                            </template>
                          </KInputSwitch>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div class="form-section">
                <div class="form-section__header">
                  <h2 class="form-section-title">
                    {{ t('zones.form.section.connect_zone.title') }}
                  </h2>

                  <p>{{ t('zones.form.section.connect_zone.description') }}</p>
                </div>

                <div class="form-section__content">
                  <DataSource
                    v-slot="{ data }: ControlPlaneAddressesSource"
                    src="/control-plane/addresses"
                  >
                    <template
                      v-if="(typeof data !== 'undefined')"
                    >
                      <ZoneCreateUniversalInstructions
                        v-if="environment === 'universal'"
                        :zone-name="name"
                        :token="token"
                        :global-kds-address="data.kds"
                      />

                      <ZoneCreateKubernetesInstructions
                        v-else
                        :zone-name="name"
                        :zone-ingress-enabled="zoneIngressEnabled"
                        :zone-egress-enabled="zoneEgressEnabled"
                        :token="token"
                        :base64-encoded-token="base64EncodedToken"
                        :global-kds-address="data.kds"
                      />
                    </template>
                  </DataSource>
                </div>
              </div>

              <div class="form-section">
                <DataSource
                  v-slot="{ data, error: scanError }: ZoneOverviewSource"
                  :src="`/zone-cps/online/${name}?no-cache=${now}`"
                  @change="success"
                >
                  <div class="form-section__header">
                    <h2 class="form-section-title">
                      {{ t('zones.form.section.scanner.title') }}
                    </h2>

                    <p>{{ t('zones.form.section.scanner.description') }}</p>
                  </div>

                  <div class="form-section__content">
                    <ErrorBlock
                      v-if="scanError"
                      :error="scanError"
                      appearance="danger"
                      data-testid="error"
                    />

                    <KEmptyState v-else>
                      <template #icon>
                        <ProgressIcon
                          v-if="data === undefined"
                          data-testid="waiting"
                          :color="KUI_COLOR_TEXT_NEUTRAL_WEAK"
                        />

                        <CheckCircleIcon
                          v-else
                          data-testid="connected"
                          :color="KUI_COLOR_TEXT_SUCCESS"
                        />
                      </template>

                      <template #title>
                        {{ data === undefined ? t('zones.form.scan.waitTitle') : t('zones.form.scan.completeTitle') }}
                      </template>

                      <template v-if="(typeof data !== 'undefined')">
                        <p>
                          {{ t('zones.form.scan.completeDescription', { name }) }}
                        </p>
                        <p class="mt-2">
                          <KButton
                            appearance="primary"
                            :to="{
                              name: 'zone-cp-detail-view',
                              params: {
                                zone: name,
                              },
                            }"
                          >
                            {{ t('zones.form.scan.completeButtonLabel', { name }) }}
                          </KButton>
                        </p>
                      </template>
                    </KEmptyState>
                  </div>
                </DataSource>
              </div>
            </template>
          </div>
        </KCard>
      </div>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { KUI_COLOR_TEXT_SUCCESS, KUI_COLOR_TEXT_NEUTRAL_WEAK } from '@kong/design-tokens'
import { AddIcon, CheckIcon, ProgressIcon, CheckCircleIcon } from '@kong/icons'
import { computed, ref } from 'vue'

import ZoneCreateKubernetesInstructions from '../components/ZoneCreateKubernetesInstructions.vue'
import ZoneCreateUniversalInstructions from '../components/ZoneCreateUniversalInstructions.vue'
import { ZoneOverviewSource } from '../sources'
import ErrorBlock from '@/app/common/ErrorBlock.vue'
import { ControlPlaneAddressesSource } from '@/app/control-planes/sources'
import { ApiError } from '@/services/kuma-api/ApiError'
import { useI18n, useKumaApi } from '@/utilities'

const { t, tm } = useI18n()
const kumaApi = useKumaApi()

/**
 * https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#rfc-1035-label-names
 */
const NAME_REGEX = /^(?![-0-9])[a-z0-9-]{1,63}$/

const zone = ref<{ token: string } | null>(null)
const isChangingZone = ref(false)
const error = ref<Error | null>(null)
const frontendNameError = ref<string | null>(null)
const zoneNameWithError = ref('')

const isZoneConnected = ref(false)
const now = ref(new Date())

const name = ref('')
const environment = ref<'universal' | 'kubernetes'>('kubernetes')
const zoneIngressEnabled = ref(true)
const zoneEgressEnabled = ref(true)

const token = computed(() => zone.value !== null && zone.value.token ? zone.value.token : '')
const base64EncodedToken = computed(() => token.value !== '' ? window.btoa(token.value) : '')

const isCreateButtonDisabled = computed(() => {
  return name.value === '' ||
    isChangingZone.value ||
    zone.value !== null
})

const nameError = computed(() => {
  // Reads client-side error
  if (frontendNameError.value !== null) {
    return frontendNameError.value
  }

  // Reads server-side error
  if (error.value instanceof ApiError) {
    const nameError = error.value.invalidParameters.find((param) => param.field === 'name')
    if (nameError !== undefined) {
      return nameError.reason
    }
  }

  return null
})

/**
 * Creates a Zone via request to the appropriate endpoint. Importantly, this returns a Zone object including a base64-encoded token which is needed for enabling the Zone in the subsequent steps of the Zone creation flow.
 */
async function createZone() {
  isChangingZone.value = true
  error.value = null
  zoneNameWithError.value = ''

  try {
    const isValidName = validateName(name.value)
    if (!isValidName) {
      return
    }

    zone.value = await kumaApi.createZone({ name: name.value })
  } catch (err) {
    if (err instanceof Error) {
      zoneNameWithError.value = name.value
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isChangingZone.value = false
  }
}

function validateName(name: string): boolean {
  const isValidName = NAME_REGEX.test(name)

  if (isValidName) {
    frontendNameError.value = null
  } else {
    frontendNameError.value = t('zones.create.invalidNameError')
  }

  return isValidName
}

function success() {
  isZoneConnected.value = true
}
</script>

<style lang="scss" scoped>
.radio-button-group {
  display: flex;
  flex-direction: column;
  gap: $kui-space-40;
}
</style>
