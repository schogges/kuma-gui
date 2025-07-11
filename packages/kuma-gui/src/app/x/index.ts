import { KCard, KPop, KRadio, KLabel } from '@kong/kongponents'

import XAboutCard from './components/x-about-card/XAboutCard.vue'
import XAction from './components/x-action/XAction.vue'
import XActionGroup from './components/x-action-group/XActionGroup.vue'
import XAlert from './components/x-alert/XAlert.vue'
import XAnonymous from './components/x-anonymous/XAnonymous.vue'
import XBadge from './components/x-badge/XBadge.vue'
import XBreadcrumbs from './components/x-breadcrumbs/XBreadcrumbs.vue'
import XCheckBox from './components/x-checkbox/XCheckbox.vue'
import XCodeBlock from './components/x-code-block/XCodeBlock.vue'
import XCopyButton from './components/x-copy-button/XCopyButton.vue'
import XDisclosure from './components/x-disclosure/XDisclosure.vue'
import XDownload from './components/x-download/XDownload.vue'
import XEmptyState from './components/x-empty-state/XEmptyState.vue'
import XI18n from './components/x-i18n/XI18n.vue'
import XIcon from './components/x-icon/XIcon.vue'
import XInput from './components/x-input/XInput.vue'
import XInputSwitch from './components/x-input-switch/XInputSwitch.vue'
import XLayout from './components/x-layout/XLayout.vue'
import XModal from './components/x-modal/XModal.vue'
import XNotification from './components/x-notification/XNotification.vue'
import XNotificationHub from './components/x-notification/XNotificationHub.vue'
import XProgress from './components/x-progress/XProgress.vue'
import XPrompt from './components/x-prompt/XPrompt.vue'
import XProvider from './components/x-provider/XProvider.vue'
import XSearch from './components/x-search/XSearch.vue'
import XSelect from './components/x-select/XSelect.vue'
import XTabs from './components/x-tabs/XTabs.vue'
import XTeleportSlot from './components/x-teleport/XTeleportSlot.vue'
import XTeleportTemplate from './components/x-teleport/XTeleportTemplate.vue'
import XTooltip from './components/x-tooltip/XTooltip.vue'
import XWindow from './components/x-window/XWindow.vue'
import vStyle from './directives/style'
import type { Plugin } from 'vue'
export { default as XCopyButtonDebug } from './components/x-copy-button/XCopyButtonDebug.vue'

const components = [
  ['XAlert', XAlert],
  ['XCard', KCard],
  ['XLabel', KLabel],
  ['XPop', KPop],
  ['XRadio', KRadio],
  //
  ['XAction', XAction],
  ['XActionGroup', XActionGroup],
  ['XAnonymous', XAnonymous],
  ['XBadge', XBadge],
  ['XBreadcrumbs', XBreadcrumbs],
  ['XCopyButton', XCopyButton],
  ['XCodeBlock', XCodeBlock],
  ['XEmptyState', XEmptyState],
  ['XIcon', XIcon],
  ['XI18n', XI18n],
  ['XInput', XInput],
  ['XLayout', XLayout],
  ['XModal', XModal],
  ['XNotification', XNotification],
  ['XNotificationHub', XNotificationHub],
  ['XPrompt', XPrompt],
  ['XProvider', XProvider],
  ['XProgress', XProgress],
  ['XSelect', XSelect],
  ['XTabs', XTabs],
  ['XTeleportTemplate', XTeleportTemplate],
  ['XTeleportSlot', XTeleportSlot],
  ['XTooltip', XTooltip],
  ['XDisclosure', XDisclosure],
  ['XDownload', XDownload],
  ['XAboutCard', XAboutCard],
  ['XInputSwitch', XInputSwitch],
  ['XCheckbox', XCheckBox],
  ['XWindow', XWindow],
  ['XSearch', XSearch],
] as const

const directives = [
  ['style', vStyle()],
] as const

declare module 'vue' {
  export interface GlobalComponents {
    XCard: typeof KCard
    XLabel: typeof KLabel
    XPop: typeof KPop
    XRadio: typeof KRadio
    //
    XAlert: typeof XAlert
    XAnonymous: typeof XAnonymous
    XIcon: typeof XIcon
    XI18n: typeof XI18n
    XInput: typeof XInput
    XAction: typeof XAction
    XActionGroup: typeof XActionGroup
    XBadge: typeof XBadge
    XCopyButton: typeof XCopyButton
    XCodeBlock: typeof XCodeBlock
    XBreadcrumbs: typeof XBreadcrumbs
    XEmptyState: typeof XEmptyState
    XLayout: typeof XLayout
    XModal: typeof XModal
    XNotification: typeof XNotification
    XNotificationHub: typeof XNotificationHub
    XPrompt: typeof XPrompt
    XProvider: typeof XProvider
    XProgress: typeof XProgress
    XSelect: typeof XSelect
    XTabs: typeof XTabs
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XTooltip: typeof XTooltip
    XDisclosure: typeof XDisclosure
    XDownload: typeof XDownload
    XAboutCard: typeof XAboutCard
    XInputSwitch: typeof XInputSwitch
    XCheckbox: typeof XCheckBox
    XWindow: typeof XWindow
    XSearch: typeof XSearch
  }
}
const deps = {
  i18n: {
    t: (str: string, _values?: Record<string, string>, _options?: Record<string, unknown>) => str,
    locale: 'en-us',
  },
}
const plugin: Plugin = {
  install: (app, options: Partial<typeof deps> = {}) => {
    if(typeof options.i18n !== 'undefined') {
      deps.i18n = options.i18n
    }
    components.forEach(([name, item]) => {
      app.component(name, item)
    })
    directives.forEach(([name, item]) => {
      app.directive(name, item)
    })
  },
}
export default plugin
export const useI18n = () => deps.i18n
