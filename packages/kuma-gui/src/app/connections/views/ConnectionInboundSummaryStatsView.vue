<template>
  <RouteView
    :params="{
      codeSearch: '',
      codeFilter: false,
      codeRegExp: false,
      mesh: '',
      proxy: '',
      proxyType: '',
      connection: '',
    }"
    :name="props.routeName"
    v-slot="{ route, uri }"
  >
    <RouteTitle
      :render="false"
      :title="`Stats`"
    />
    <AppView>
      <DataLoader
        :src="uri(sources, '/connections/stats/for/:proxyType/:name/:mesh/:socketAddress', {
          proxyType: ({ ingresses: 'zone-ingress', egresses: 'zone-egress'})[route.params.proxyType] ?? 'dataplane',
          name: route.params.proxy,
          mesh: route.params.mesh || '*',
          socketAddress: props.networking.inboundAddress,
        })"
        v-slot="{ data: stats, refresh }"
      >
        <DataCollection
          :items="stats.raw.split('\n')"
          :predicate="item => {
            return [
              `listener.${props.data.listenerAddress.length > 0 ? props.data.listenerAddress : route.params.connection}`,
              `cluster.${props.data.name}.`,
              `cluster.${props.data.clusterName}.`,
              `http.${props.data.name}.`,
              `http.${props.data.clusterName}.`,
              `tcp.${props.data.name}.`,
            ].some(prefix => item.startsWith(prefix)) && (!item.includes('.rds.') || item.includes(`_${props.data.port}`) || item.includes(`${props.data.servicePort}`))}"
          v-slot="{ items: lines }"
        >
          <XCodeBlock
            language="json"
            :code="lines.map(item => item.replace(`${props.data.listenerAddress.length > 0 ? props.data.listenerAddress : route.params.connection}.`, '').replace(`${props.data.name}.`, '').replace(`${props.data.clusterName}.`, '')).join('\n')"
            is-searchable
            :query="route.params.codeSearch"
            :is-filter-mode="route.params.codeFilter"
            :is-reg-exp-mode="route.params.codeRegExp"
            @query-change="route.update({ codeSearch: $event })"
            @filter-mode-change="route.update({ codeFilter: $event })"
            @reg-exp-mode-change="route.update({ codeRegExp: $event })"
          >
            <template #primary-actions>
              <XAction
                action="refresh"
                appearance="primary"
                @click="refresh"
              >
                Refresh
              </XAction>
            </template>
          </XCodeBlock>
        </DataCollection>
      </DataLoader>
    </AppView>
  </RouteView>
</template>
<script lang="ts" setup>
import { sources } from '../sources'
import type { DataplaneInbound, DataplaneNetworking } from '@/app/legacy-data-planes/data/'
import type { ZoneEgress } from '@/app/zone-egresses/data/'
import type { ZoneIngress } from '@/app/zone-ingresses/data/'


const props = defineProps<{
  data: DataplaneInbound
  networking: DataplaneNetworking | ZoneIngress['networking'] | ZoneEgress['networking']
  routeName: string
}>()
</script>
