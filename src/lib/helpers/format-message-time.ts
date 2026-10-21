/**
 * Message time «16:18», 24-hour, whatever the browser locale.
 * `toLocaleTimeString().slice(0, 5)` gave «4:18:» on a 12-hour locale
 * («4:18:13 PM») — live on test, 21.10. Same options as the «Сегодня, 16:18»
 * date marker, so the two always agree.
 */
export const formatMessageTime = (sentAt: string | number | Date) =>
  new Date(sentAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
