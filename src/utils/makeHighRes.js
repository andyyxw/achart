/**
 * 适应高清屏幕
 */
function makeHighRes (canvas) {
  const ctx = canvas.getContext('2d')
  // Get the device pixel ratio, falling back to 1.
  const dpr = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio || 1
  // Get the size of the canvas in CSS pixels.
  const oldWidth = canvas.width
  const oldHeight = canvas.height
  // 根据dpr，扩大canvas画布的像素，使1个canvas像素和1个物理像素相等
  // 要设置canvas的画布大小，使用的是 canvas.width 和 canvas.height；
  // 要设置画布的实际渲染大小，使用的 style 属性或CSS设置的 width 和height，只是简单的对画布进行缩放。
  canvas.width = Math.round(oldWidth * dpr)
  canvas.height = Math.round(oldHeight * dpr)
  canvas.style.width = oldWidth + 'px'
  canvas.style.height = oldHeight + 'px'
  // 由于画布扩大，canvas的坐标系也跟着扩大，如果按照原先的坐标系绘图内容会缩小，所以需要将绘制比例放大
  ctx.scale(dpr, dpr)
  return ctx
}

export default makeHighRes
