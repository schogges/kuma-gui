<template>
  <RouteView
    name="zone-ingress-xds-config-view"
    :params="{
      zoneIngress: '',
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      includeEds: false,
    }"
    v-slot="{ route, t, uri }"
  >
    <RouteTitle
      :render="false"
      :title="t('zone-ingresses.routes.item.navigation.zone-ingress-xds-config-view')"
    />
    <AppView>
      <KCard>
        <DataLoader
          :src="uri(sources, '/zone-ingresses/:name/xds/:endpoints', {
            name: route.params.zoneIngress,
            endpoints: String(route.params.includeEds),
          })"
          v-slot="{ data, refresh }"
        >
          <CodeBlock
            language="json"
            :code="JSON.stringify(data, null, 2)"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <KCheckbox
                v-model="route.params.includeEds"
                label="Include Endpoints"
              />
              <XAction
                action="refresh"
                appearance="primary"
                @click="refresh"
              >
                Refresh
              </XAction>
            </template>
          </CodeBlock>
        </DataLoader>
      </KCard>
    </AppView>
  </RouteView>
</template>

<script lang="ts" setup>
import { sources } from '../sources'
import CodeBlock from '@/app/common/code-block/CodeBlock.vue'
</script>
