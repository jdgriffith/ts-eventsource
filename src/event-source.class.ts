import { RetryDelayStrategy, defaultBackoff, defaultJitter } from './retry-delay'

import original from 'original'
import url from 'url'
import events from 'events'
import https from 'https'
import util from 'util'

export class EventSource {
  private readyState: string
  private config: any
  private reconnectInterval = 1000
  private discardTrailingNewLine: false
  private defaultHeaders = { 'Cache-Control': 'no-cache', Accept: 'text/event-stream' }

  getRequestOptions(url: string): any {}
}
