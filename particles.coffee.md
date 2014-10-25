Particles
=========

Emit voxel particles

    # picks a random float between -max/2 and max/2
    randomFloat = (max) ->
      Math.random() * max - max / 2

    randomVector3 = (max) ->
        x = randomFloat max
        y = randomFloat max
        z = randomFloat max

        new THREE.Vector3(x, y, z)

    createParticles = (count) ->
      particles = new THREE.Geometry()

      [0...count].forEach ->
        particle = randomVector3(500)

        # add it to the geometry
        particles.vertices.push particle

      particles

    module.exports = (scene) ->
      material = new THREE.ParticleBasicMaterial
        color: 0xFFFFFF
        size: 20

      particles = createParticles 1800
      particleSystem = new THREE.ParticleSystem particles, material

      scene.add particleSystem

      particleSystem
