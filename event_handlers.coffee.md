    halfWidth = window.innerWidth / 2
    halfHeight = window.innerHeight / 2
    mouseX = mouseY = 0

    onWindowResize = ->
    	camera.aspect = window.innerWidth / window.innerHeight
    	camera.updateProjectionMatrix()

    	renderer.setSize window.innerWidth, window.innerHeight

    onDocumentMouseMove = (e) ->
      mouseX = (e.clientX - halfWidth) / 2
      mouseY = (e.clientY - halfHeight) / 2
      
    module.exports = ->
      initialize: ->
        document.addEventListener "mousemove", onDocumentMouseMove, false
        window.addEventListener "resize", onWindowResize, false
        
      mousePosition: ->
        new Vector2(mouseX, mouseY)