Particles
=========

A voxel particle system.

    module.exports = ->
      particleCount = 1800
      particles = new THREE.Geometry()
      pMaterial = new THREE.ParticleBasicMaterial
        color: 0xFFFFFF
        size: 20
      
      [0...particleCount].forEach (p) ->
        pX = Math.random() * 500 - 250
        pY = Math.random() * 500 - 250
        pZ = Math.random() * 500 - 250
        particle = new THREE.Vertex(new THREE.Vector3 pX, pY, pZ)
      
        # add it to the geometry
        particles.vertices.push particle
      
      
      particleSystem = new THREE.ParticleSystem particles, pMaterial
      
      scene.addChild particleSystem