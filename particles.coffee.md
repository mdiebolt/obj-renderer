Particles
=========

Emit voxel particles

    addCube = (scene, position) ->
      geometry = new THREE.BoxGeometry(1, 1, 1)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff
        transparent: true

      cube = new THREE.Mesh geometry, material
      cube.position.set position.x, position.y, position.z

      scene.add cube

      cube

    createParticles = (opts={}) ->
      scene = opts.scene
      number = opts.number
      position = opts.position

      [0...number].map ->
        addCube(scene, position)

    module.exports = (opts={}) ->
      scene = opts.scene
      particles = null

      generate: (opts={}) ->
        particles = createParticles
          number: opts.number
          position: opts.position
          scene: scene

      update: (cb) ->
        particles?.forEach cb
