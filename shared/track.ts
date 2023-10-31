export const track = (event: string, msg: any) => {
  const finalMsg = typeof msg === 'string' ? msg : JSON.stringify(msg)
  const ua = navigator.userAgent
  const url = window.location.href
  const param = {
    event,
    msg: finalMsg,
    ua,
    url
  }
  navigator.sendBeacon(`/api/vercel/track?v=${JSON.stringify(param)}`)
}