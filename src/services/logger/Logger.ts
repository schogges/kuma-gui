export const logEvents: Record<string, string> = {
  PAGINATION_PREVIOUS_BUTTON_CLICKED: 'pagination-previous-button-clicked',
  PAGINATION_NEXT_BUTTON_CLICKED: 'pagination-next-button-clicked',
  SIDEBAR_ITEM_CLICKED: 'sidebar-item-clicked',
  TABLE_REFRESH_BUTTON_CLICKED: 'table-refresh-button-clicked',
  TABS_TAB_CHANGE: 'tabs-tab-change',
  CREATE_DATA_PLANE_PROXY_CLICKED: 'create-data-plane-proxy-clicked',
}

type LogFunction = (message: string, messageContext?: object | undefined, error?: Error | undefined) => void

export default class Logger {
  setup() {
    // Currently, there is no setup code here. This could contain Datadog Logs setup code, for example.
  }

  log(...args: Parameters<LogFunction>) {
    this._log('log', ...args)
  }

  info(...args: Parameters<LogFunction>) {
    this._log('info', ...args)
  }

  warn(...args: Parameters<LogFunction>) {
    this._log('warn', ...args)
  }

  error(...args: Parameters<LogFunction>) {
    this._log('error', ...args)
  }

  protected _log(type: 'log' | 'info' | 'warn' | 'error', ...args: Parameters<LogFunction>) {
    console[type](...args)
  }
}