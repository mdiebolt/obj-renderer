Particles
=========

Emit voxel particles

Pick a random float between `-max / 2` and `max / 2`
    
    addCube = (scene, position) ->
      geometry = new THREE.BoxGeometry(1, 1, 1)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff

      cube = new THREE.Mesh geometry, material
      position = position
      
      cube.position.x = position.x + Math.random() * 5
      cube.position.y = position.y + Math.random() * 5
      cube.position.z = position.z + Math.random() * 5

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
    
      return {
        generate: (opts={}) ->
          particles = createParticles
            number: opts.number
            position: opts.position
            scene: scene
          
        update: (cb) ->
          particles?.forEach cb
      }