import XAction from './components/x-action/XAction.vue'
import XBreadcrumbs from './components/x-breadcrumbs/XBreadcrumbs.vue'
import XCopyButton from './components/x-copy-button/XCopyButton.vue'
import XDisclosure from './components/x-disclosure/XDisclosure.vue'
import XIcon from './components/x-icon/XIcon.vue'
import XInput from './components/x-input/XInput.vue'
import XSelect from './components/x-select/XSelect.vue'
import XTabs from './components/x-tabs/XTabs.vue'
import XTeleportSlot from './components/x-teleport/XTeleportSlot.vue'
import XTeleportTemplate from './components/x-teleport/XTeleportTemplate.vue'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XIcon: typeof XIcon
    XInput: typeof XInput
    XAction: typeof XAction
    XCopyButton: typeof XCopyButton
    XBreadcrumbs: typeof XBreadcrumbs
    XSelect: typeof XSelect
    XTabs: typeof XTabs
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
    XDisclosure: typeof XDisclosure
  }
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('x.vue.components'),
      {
        service: () => {
          return [
            ['XAction', XAction],
            ['XBreadcrumbs', XBreadcrumbs],
            ['XCopyButton', XCopyButton],
            ['XIcon', XIcon],
            ['XInput', XInput],
            ['XSelect', XSelect],
            ['XTabs', XTabs],
            ['XTeleportTemplate', XTeleportTemplate],
            ['XTeleportSlot', XTeleportSlot],
            ['XDisclosure', XDisclosure],
          ]
        },
        labels: [
          app.components,
        ],
      },
    ],
  ]
}
