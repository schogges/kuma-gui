<template>
  <KSelect
    v-model="selected"
    :label="props.label"
    :items="items"
    @selected="emit('change', String($event.value))"
  >
    <template
      #selected-item-template="{ item }: any"
    >
      <slot
        v-if="slots.selected"
        :item="item.value as any"
        name="selected"
      />
      <slot
        v-else
        :item="item.value as any"
        :name="`${item?.value}-option`"
      />
    </template>
    <template #item-template="{ item }: any">
      <slot :name="`${item.value}-option`" />
    </template>
  </KSelect>
</template>
<script lang="ts" setup>
import { KSelect } from '@kong/kongponents'
import { computed, ref } from 'vue'

const emit = defineEmits<{
  (event: 'change', value: string): void
}>()
const props = withDefaults(defineProps<{
  label?: string
  selected?: string
}>(), {
  label: '',
  selected: '',
})

const slots = defineSlots()

const selected = ref(props.selected)

const items = computed(() => {
  const items = Object.keys(slots).reduce<
    {
      value: string
      label: string
    }[]
  >((prev, key) => {
    const pos = key.lastIndexOf('-option')
    if (pos !== -1) {
      const item = key.substring(0, pos)
      prev.push(
        {
          value: item,
          label: item,
        },
      )
    }
    return prev
  }, [])
  return items
})

</script>
<style lang="scss" scoped>
.k-select {
  flex-basis: 245px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: $kui-space-40;
}

.k-select :deep(.k-label) {
  // Removes the bottom margin as we’re aligning the label with the select in a horizontal layout.
  margin-bottom: 0 !important;
}
</style>
