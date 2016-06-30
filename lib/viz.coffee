module.exports = (analyser) ->
  bins = analyser.frequencyBinCount
  frequencyDomain = new Uint8Array(bins)
  timeDomain = new Uint8Array(bins)

  draw: (canvas) ->
    analyser.getByteFrequencyData(frequencyDomain)
    analyser.getByteTimeDomainData(timeDomain)

    width = canvas.width
    height = canvas.height
    ctx = canvas.getContext('2d')
    
    ratio = height / 256
    step = width / bins

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, width, height)

    -> # Render frequency domain
      ctx.fillStyle = "#0FF"
  
      ctx.beginPath()
      ctx.moveTo(0, height)
  
      # Draw waveforms or frequency spectrum
      Array::forEach.call frequencyDomain, (value, index) ->
        x = index * step
        y = ratio * (256 - value)
  
        ctx.lineTo x, y
  
      ctx.lineTo(width, height)
      ctx.fill()

    ctx.lineWidth = 2
    ctx.strokeStyle = "#FF0"

    Array::forEach.call timeDomain, (value, index) ->
      x = index * step
      y = ratio * (256 - value)

      if index is 0
        ctx.beginPath()
        ctx.moveTo x, y
      else
        ctx.lineTo x, y

    ctx.stroke()
