import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatMessageTime } from './format-message-time'

describe('formatMessageTime', () => {
  afterEach(() => vi.restoreAllMocks())

  it('24-hour hours and minutes even on a 12-hour locale', () => {
    // A 12-hour locale (en-US), whatever the test machine is set to.
    vi.spyOn(Date.prototype, 'toLocaleTimeString').mockImplementation(function (
      this: Date,
      _l,
      options,
    ) {
      return new Intl.DateTimeFormat('en-US', options).format(this)
    })
    const t = formatMessageTime(new Date(2026, 9, 21, 16, 18, 13))
    expect(t).toMatch(/^16:18$/)
  })

  it('no trailing colon for a one-digit hour', () => {
    const t = formatMessageTime(new Date(2026, 9, 21, 4, 5, 9))
    expect(t).not.toMatch(/:$/)
    expect(t).toMatch(/^0?4:05$/)
  })
})
