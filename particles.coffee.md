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
      geometry = new THREE.BoxGeometry(2, 2, 2)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff

      cube = new THREE.Mesh geometry, material
      cube.position.x = position.x
      cube.position.y = position.y
      cube.position.z = position.z

      scene.add cube

    createParticles = (count, scene) ->
      [0...count].forEach ->
        addCube(scene)

    module.exports = (scene) ->
      createParticles 1800, scene
      