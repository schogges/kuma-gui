<template>
  <template
    v-if="typeof provider !== 'undefined'"
  >
    <XTeleportTemplate
      v-if="props.notify && slots.default"
      :to="{ name: `${provider.uri}-${props.uri}` }"
    >
      <slot name="default" />
    </XTeleportTemplate>
    <XTeleportSlot
      v-else
      :name="`${provider.uri}-${props.uri}`"
    />
  </template>
</template>
<script lang="ts" setup>
import { inject, onBeforeUnmount, onMounted, watch } from 'vue'

import type { AlertAppearance } from '@kong/kongponents'
const provider = inject<{
  set(uri: string, obj: { variant: AlertAppearance } ): void
  delete(uri: string): void
  uri: string
}>('x-notification-hub')

const props = withDefaults(defineProps<{
  uri: string
  variant?: AlertAppearance
  notify?: boolean
}>(), {
  variant: 'warning',
  notify: false,
})

const slots = defineSlots()
watch(() => {
  return !!(props.notify && slots.default)
}, (bool) => {
  if(typeof provider !== 'undefined') {
    if(bool) {
      provider.set(props.uri, props)
    } else {
      provider.delete(props.uri)
    }
  }
})
if(props.notify && slots.default) {
  onMounted(() => {
    if(typeof provider !== 'undefined') {
      provider.set(props.uri, props)
    }
  })
}
onBeforeUnmount(() => {
  if(typeof provider !== 'undefined') {
    provider.delete(props.uri)
  }
})
</script>
