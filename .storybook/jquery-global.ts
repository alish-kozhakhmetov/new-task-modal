/** Sets `window.jQuery` before MathQuill's IIFE is evaluated. */
import jQuery from 'jquery'

declare global {
  interface Window {
    jQuery: typeof jQuery
    $: typeof jQuery
  }
}

// globalThis is `window` in the browser; it also type-checks under the Node
// config, which reaches this file through tools/pilot/keys/candidates.test.ts
const host = globalThis as typeof globalThis & Pick<Window, 'jQuery' | '$'>
host.jQuery = jQuery
host.$ = jQuery
