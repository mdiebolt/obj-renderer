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
    
Translate mouse coordinates into a number ranging from -1 to 1, 
where `x == -1 && y == -1` means top-left, 
and `x ==  1 && y ==  1` means bottom right

      raycastDirection.x = (e.clientX / window.innerWidth) * 2 - 1
      raycastDirection.y = -(e.clientY / window.innerHeight) * 2 + 1
      raycastDirection.z = 0.5

http://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects
Renderers use Vector#project for translating 3D points to the 2D screen. 
Vector#unproject is basically for doing the inverse, unprojecting 2D points into the 3D world. 
For both methods you pass the camera you're viewing the scene through.  
  
      raycastDirection.unproject(camera)
      
Move ray to the camera

      raycastDirection.sub(camera.position)
      raycastDirection.normalize()
  
      raycaster.set camera.position, raycastDirection

TODO: restrict this to only selectable nodes such as characters
      
      intersects = raycaster.intersectObjects scene.children  

      intersects.forEach (intersection) ->        
        scene.remove intersection.object

    window.addEventListener "resize", onWindowResize, false
    window.addEventListener "click", onClick, false
