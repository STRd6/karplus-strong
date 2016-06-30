style = document.createElement 'style'
style.innerText = require "./style"
document.body.appendChild(style)

canvas = require "./filled_canvas"

context = new AudioContext

Viz = require "./lib/viz"

masterGain = context.createGain()
masterGain.gain.value = 1
masterGain.connect(context.destination)

analyser = context.createAnalyser()
analyser.smoothingTimeConstant = 0

masterGain.connect(analyser)
analyser.connect context.destination

viz = Viz(analyser)

updateViz = ->
  viz.draw(canvas)
  requestAnimationFrame updateViz
requestAnimationFrame updateViz

# http://stackoverflow.com/a/14487961/68210
pluck = (context, frequency=220, impulseDuration=0.01) ->
  impulseSamples = impulseDuration * context.sampleRate

  node = context.createScriptProcessor(4096, 0, 1)
  N = Math.round(context.sampleRate / frequency)
  y = new Float32Array(N)
  n = 0

  node.onaudioprocess = (e) ->
    output = e.outputBuffer.getChannelData(0)
    output.forEach (_, i) ->
      impulseSamples -= 1
      xn = if impulseSamples >= 0
        2 * Math.random() - 1
      else 
        0

      y[n] = xn + (y[n] + y[(n + 1) % N]) / 2.004

      output[i] = y[n]

      n += 1
      n = 0 if n >= N

  node.connect(analyser)
  setTimeout ->
    node.disconnect(analyser)
  , 10000

document.addEventListener "mousedown", (e) ->
  octaves = 3
  frequency = (1 + octaves * e.pageX / document.body.clientWidth) * 220
  impulseDuration = (1 - e.pageY / document.body.clientHeight) * 0.0075 + 0.0005

  pluck(context, frequency, impulseDuration)
