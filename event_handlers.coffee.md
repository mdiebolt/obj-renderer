Isolate all our user interactions to here. 
Eventually we'll remove this as the game takes control of the camera.
    
    raycaster = new THREE.Raycaster()
    projector = new THREE.Projector()
    raycastDirection = new THREE.Vector3()

    onWindowResize = ->
    	camera.aspect = window.innerWidth / window.innerHeight
    	camera.updateProjectionMatrix()

    	renderer.setSize window.innerWidth, window.innerHeight

    onClick = (e) ->
      debugger
    
Translate mouse coordinates into a number ranging from -1 to 1, 
where `x == -1 && y == -1` means top-left, 
and `x ==  1 && y ==  1` means bottom right

      raycastDirection.x = (e.clientX / window.innerWidth) * 2 - 1
      raycastDirection.y = -(e.clientY / window.innerHeight) * 2 + 1
      raycastDirection.z = 0.5
  
      ray = new THREE.Ray(camera.position, raycastDirection)
      intersects = ray.intersectObjects scene.children  

      [0...intersects.length].forEach (i) ->
      	intersection = intersects[i]
      	obj = intersection.object
  
      	obj.material.color.setRGB(1 - i / intersects.length, 0, 0)

    window.addEventListener "resize", onWindowResize, false
    window.addEventListener "click", onClick, false
