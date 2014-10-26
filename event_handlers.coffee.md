Event Handlers
==============

    raycaster = new THREE.Raycaster()
    projector = new THREE.Projector()
    raycastDirection = new THREE.Vector3()

    onWindowResize = ->
    	camera.aspect = window.innerWidth / window.innerHeight
    	camera.updateProjectionMatrix()

    	renderer.setSize window.innerWidth, window.innerHeight

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

      intersects = raycaster.intersectObjects scene.children, true

TODO: sort intersections by closest and stop after the first one

      intersects.forEach (intersection) ->
        scene.remove intersection.object

    window.addEventListener "resize", onWindowResize, false
    window.addEventListener "click", onClick, false
