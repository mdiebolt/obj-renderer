Particles
=========

Emit voxel particles

Pick a random float between `-max / 2` and `max / 2`
    
    randomFloat = (max) ->
      Math.random() * max - max / 2

    randomVector3 = (max) ->
        x = randomFloat max
        y = randomFloat max
        z = randomFloat max

        new THREE.Vector3(x, y, z)

    addCube = (scene) ->
      geometry = new THREE.BoxGeometry(1, 1, 1)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff

      cube = new THREE.Mesh geometry, material
      position = randomVector3(500)
      
      cube.position.x = position.x
      cube.position.y = position.y
      cube.position.z = position.z

      scene.add cube
      
      cube

    createParticles = (opts={}) ->
      scene = opts.scene
      number = opts.number
    
      [0...number].map ->
        addCube(scene)

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