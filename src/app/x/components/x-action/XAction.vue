<template>
  <template
    v-if="Object.keys(props.to).length > 0"
  >
    <RouterLink
      :to="{
        ...props.to,
        query,
      }"
    >
      <slot name="default" />
    </RouterLink>
  </template>
  <template
    v-else-if="props.href.length > 0"
  >
    <a
      :href="props.href"
      class="type-docs"
      target="_blank"
      :rel="props.type !== 'docs' ? `noopener noreferrer` : ``"
    >
      <template
        v-if="props.type === 'docs'"
      >
        <XIcon
          name="docs"
        />
        <slot
          name="default"
        />

      </template>
      <slot
        v-else
        name="default"
      />
    </a>
  </template>
  <template
    v-else-if="props.for.length > 0"
  >
    <label :for="props.for">
      <slot name="default" />
    </label>
  </template>
  <template
    v-else
  >
    <button type="button">
      <slot name="default" />
    </button>
  </template>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import type { RouteLocationNamedRaw } from 'vue-router'
type BooleanLocationQueryValue = string | number | undefined | boolean
type BooleanLocationQueryRaw = Record<string | number, BooleanLocationQueryValue | BooleanLocationQueryValue[]>
type RouteLocationRawWithBooleanQuery = Omit<RouteLocationNamedRaw, 'query'> & {
  query?: BooleanLocationQueryRaw
}
const router = useRouter()

const props = withDefaults(defineProps<{
  type?: 'default' | 'docs' | 'create' | 'copy' | 'action'
  href?: string
  to?: RouteLocationRawWithBooleanQuery
  for?: string
  mount?: (to: RouteLocationNamedRaw) => void
}>(), {
  href: '',
  type: 'default',
  to: () => ({}),
  for: '',
  mount: undefined,
})
const query = computed(() => {
  return Object.entries(props.to.query ?? {}).reduce<Record<string, string | number | null | undefined>>((prev, [key, value]) => {
    switch (true) {
      case value === true:
        prev[key] = null
        break
      case value === false:
        prev[key] = undefined
        break
      default:
        prev[key] = value as string | number | undefined
    }
    return prev
  }, {})
})

watch(() => props.mount, (val) => {
  if (typeof val === 'function') {
    val({
      ...props.to,
      query: query.value,
    })
  }
}, { immediate: true })

watch(() => props.to, (val) => {
  try {
    router.resolve({
      ...val,
      query: query.value,
    })
  } catch (e) {
    if (e instanceof Error) {
      e.message = `${e.toString()}: ${JSON.stringify(val)}`
    }
    console.error(e)
  }
}, { immediate: true })
</script>
