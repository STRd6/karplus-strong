context = new AudioContext

style = document.createElement 'style'
style.innerText = require "./style"
document.body.appendChild(style)

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

      y[n] = xn + (y[n] + y[(n + 1) % N]) / 2.02

      output[i] = y[n]

      n += 1
      n = 0 if n >= N

  node.connect(context.destination)
  setTimeout ->
    node.disconnect(context.destination)
  , 10000

document.addEventListener "mousedown", (e) ->
  frequency = (1 + e.pageX / document.body.clientWidth) * 220
  impulseDuration = (1 - e.pageY / document.body.clientHeight) * 0.025

  pluck(context, frequency, impulseDuration)
