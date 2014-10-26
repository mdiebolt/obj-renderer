Event Handlers
==============

    glow = require("./glow_material")()

    raycaster = new THREE.Raycaster()
    projector = new THREE.Projector()
    raycastDirection = new THREE.Vector3()

    onWindowResize = ->
    	camera.aspect = window.innerWidth / window.innerHeight
    	camera.updateProjectionMatrix()

    	renderer.setSize window.innerWidth, window.innerHeight

    onKeydown = (e) ->
      e.preventDefault()
      
      switch e.keyCode
        when 81 # q
          camera.position.x -= 1
        when 87 # w
          camera.position.x += 1
        when 65 # a
          camera.position.y -= 1
        when 83 # s
          camera.position.y += 1
        when 90 # z
          camera.position.z -= 1
        when 88 # x
          camera.position.z += 1

    onClick = (e) ->

Translate mouse coordinates into a number ranging from -1 to 1.
`x == -1 && y == -1` is top left.
`x ==  1 && y ==  1` is bottom right.

      raycastDirection.x = (e.clientX / window.innerWidth) * 2 - 1
      raycastDirection.y = -(e.clientY / window.innerHeight) * 2 + 1

http://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects
Renderers use Vector#project for translating 3D points to the 2D screen.
Vector#unproject is basically for doing the inverse, unprojecting 2D points into the 3D world.
For both methods you pass the camera you're viewing the scene through.

      raycastDirection.unproject camera

Move ray to the camera

      raycastDirection.sub camera.position

      raycaster.set camera.position, raycastDirection.normalize()

TODO: restrict this to only selectable nodes such as characters

Need to pass the recursive flag for our .obj models
http://stackoverflow.com/questions/22114224/three-js-raycasting-obj

      intersects = raycaster.intersectObjects window.characters, true

TODO: sort intersections by closest and stop after the first one

      intersects.forEach (intersection) ->
      
We're expecting to click on a .obj model. 
Our raycaster intersects the underlying Mesh. 
We need to call `parent` to get the right object
              
        position = intersection.object.parent.position

        camera.position.set position.x, position.y + 100, position.z + 200
        camera.lookAt intersection.object.parent.position
                          
        glowMesh = new THREE.Mesh intersection.object.geometry, glow
                
        intersection.object.parent.add(glowMesh)
              
    window.addEventListener "resize", onWindowResize, false
    window.addEventListener "click", onClick, false
    window.addEventListener "keydown", onKeydown, false
