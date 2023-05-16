<template>
  <div class="kcard-stack">
    <div class="kcard-border">
      <DataOverview
        :selected-entity-name="entity?.name"
        :page-size="PAGE_SIZE_DEFAULT"
        :is-loading="isLoading"
        :error="error"
        :empty-state="EMPTY_STATE"
        :table-data="tableData"
        :table-data-is-empty="tableData.data.length === 0"
        :next="nextUrl"
        :page-offset="pageOffset"
        @table-action="loadEntity"
        @load-data="loadData"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { RouteLocationNamedRaw, useRoute } from 'vue-router'

import DataOverview from '@/app/common/DataOverview.vue'
import { PAGE_SIZE_DEFAULT } from '@/constants'
import { MeshInsight, TableHeader } from '@/types/index.d'
import { useI18n, useKumaApi } from '@/utilities'
import { QueryParameter } from '@/utilities/QueryParameter'

type MeshTableRow = {
  entity: MeshInsight
  detailViewRoute: RouteLocationNamedRaw
  services: number
  dataPlaneProxies: number
}

const i18n = useI18n()
const kumaApi = useKumaApi()

const EMPTY_STATE = {
  title: i18n.t('meshes.list.emptyState.title'),
  message: i18n.t('meshes.list.emptyState.message'),
}

const route = useRoute()

const props = defineProps({
  selectedMeshName: {
    type: [String, null] as PropType<string | null>,
    required: false,
    default: null,
  },

  offset: {
    type: Number,
    required: false,
    default: 0,
  },
})

const isLoading = ref(true)
const error = ref<Error | null>(null)
const tableData = ref<{ headers: TableHeader[], data: MeshTableRow[] }>({
  headers: [
    { label: 'Name', key: 'entity' },
    { label: 'Services', key: 'services' },
    { label: 'Data Plane Proxies', key: 'dataPlaneProxies' },
  ],
  data: [],
})
const entity = ref<MeshInsight | null>(null)
const nextUrl = ref<string | null>(null)
const pageOffset = ref(props.offset)

watch(() => route.params.mesh, function () {
  // Don’t trigger a load when the user is navigating to another route.
  if (route.name !== 'mesh-list-view') {
    return
  }

  loadData(0)
})

start()

function start() {
  loadData(props.offset)
}

async function loadData(offset: number) {
  pageOffset.value = offset
  // Puts the offset parameter in the URL so it can be retrieved when the user reloads the page.
  QueryParameter.set('offset', offset > 0 ? offset : null)

  isLoading.value = true
  error.value = null

  const size = PAGE_SIZE_DEFAULT

  try {
    const { items, next } = await kumaApi.getAllMeshInsights({ size, offset })

    nextUrl.value = next
    tableData.value.data = transformToTableData(items ?? [])
    await loadEntity({ name: props.selectedMeshName ?? tableData.value.data[0]?.entity.name })
  } catch (err) {
    tableData.value.data = []
    entity.value = null

    if (err instanceof Error) {
      error.value = err
    } else {
      console.error(err)
    }
  } finally {
    isLoading.value = false
  }
}

function transformToTableData(meshInsights: MeshInsight[]): MeshTableRow[] {
  return meshInsights.map((entity) => {
    const { name, services: serviceTotals, dataplanes: dataPlaneProxyTotals } = entity
    const detailViewRoute: RouteLocationNamedRaw = {
      name: 'mesh-detail-view',
      params: {
        mesh: name,
      },
    }
    const services = serviceTotals.total ?? 0
    const dataPlaneProxies = dataPlaneProxyTotals.total ?? 0

    return {
      entity,
      detailViewRoute,
      services,
      dataPlaneProxies,
    }
  })
}

async function loadEntity({ name }: { name?: string | undefined }) {
  if (name === undefined) {
    entity.value = null
    QueryParameter.set('zone', null)
    return
  }

  try {
    entity.value = await kumaApi.getMeshInsights({ name })
    QueryParameter.set('zone', name)
  } catch (err) {
    console.error(err)
  }
}
</script>