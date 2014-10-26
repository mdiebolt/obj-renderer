Particles
=========

Emit voxel particles

    addCube = (position) ->
      geometry = new THREE.BoxGeometry(1, 1, 1)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff
        transparent: true

      cube = new THREE.Mesh geometry, material
      cube.position.set position.x, position.y, position.z

      scene.add cube

      cube

    createParticles = (opts={}) ->
      number = opts.number
      position = opts.position

      [0...number].map ->
        addCube(position)

    module.exports = (opts={}) ->
      particles = null

      generate: (opts={}) ->
        particles = createParticles
          number: opts.number
          position: opts.position

      update: (cb) ->
        particles?.forEach cb
