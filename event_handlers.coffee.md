Isolate all our user interactions to here. 
Eventually we'll remove this as the game takes control of the camera.

    halfWidth = window.innerWidth / 2
    halfHeight = window.innerHeight / 2
    mouseX = mouseY = 0

    onWindowResize = ->
    	camera.aspect = window.innerWidth / window.innerHeight
    	camera.updateProjectionMatrix()

    	renderer.setSize window.innerWidth, window.innerHeight

    window.addEventListener "resize", onWindowResize, false

