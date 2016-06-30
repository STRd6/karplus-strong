canvas = document.createElement('canvas')
document.body.appendChild(canvas)

handleResize =  ->
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

handleResize()
window.addEventListener "resize", handleResize, false

module.exports = canvas
