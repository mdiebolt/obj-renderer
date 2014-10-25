Particles
=========

A voxel particle system.

    # picks a random float between -max/2 and max/2
    randomFloat = (max) ->
      Math.random() * max - max / 2

    createParticles = (count) ->
      particles = new THREE.Geometry()
    
      [0...count].forEach ->
        x = randomFloat(500)
        y = randomFloat(500)
        z = randomFloat(500)
        
        particle = new THREE.Vector3(x, y, z)
      
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
      