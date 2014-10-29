Map
===

Generate a simple map, populating it with a cube floor and characters.

    load = require "./loader"

    {Vector3} = THREE

    CUBE_SIZE = 10

    addCube = (position) ->
      geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff
        wireframe: true

      cube = new THREE.Mesh geometry, material
      
      {x, y, z} = position
      cube.position.set x, y, z
      scene.add cube

    characterPositions =
      bartender: [0, 0, 0]
      robo_sheriff: [10, 0, 0]
      cactus: [20, 0, 0]
      arrow: [30, 0, 0]
      beam_sword: [40, 0, 0]
      branding_iron: [50, 0, 0]
      character: [60, 0, 0]
      gun: [70, 0, 0]
      hoverboard: [80, 0, 0]
      jetpack_bandit: [90, 0, 0]

    module.exports = ->

Create a basic floor of dimension `size`

      generateGrid: (size) ->
        [0...size].forEach (x) ->
          [0...size].forEach (z) ->
            addCube new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE)

      populateCharacters: ->
        for name, position of characterPositions
          [x, y, z] = position
          
          load name,
            position: new Vector3(x, y, y)
