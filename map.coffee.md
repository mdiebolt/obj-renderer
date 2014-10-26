Map
===

Generate a simple map, populating it with a cube floor and characters.

    CUBE_SIZE = 10
    
    addCube = (position) ->
      geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff
        wireframe: true

      cube = new THREE.Mesh geometry, material
      cube.position.set position.x, position.y, position.z
      scene.add cube

Create a basic floor of dimension `size`

    generateGrid = (size) ->
      [0...size].forEach (x) ->
        [0...size].forEach (z) ->
          addCube new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE)
          
      