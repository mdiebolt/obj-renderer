Particles
=========

A voxel particle system.

    module.exports = (scene) ->
      particleCount = 1800
      particles = new THREE.Geometry()
      material = new THREE.ParticleBasicMaterial
        color: 0xFFFFFF
        size: 20
      
      [0...particleCount].forEach ->
        x = Math.random() * 500 - 250
        y = Math.random() * 500 - 250
        z = Math.random() * 500 - 250
        
        particle = new THREE.Vector3(x, y, z)
      
        # add it to the geometry
        particles.vertices.push particle
      
      particleSystem = new THREE.ParticleSystem particles, material
      
      scene.addChild particleSystem
      