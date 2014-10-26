Glow Material
=============

    module.exports = ->
      new THREE.ShaderMaterial 
        uniforms:  
          c:   
            type: "f"
            value: 1.0
          p:   
            type: "f"
            value: 1.4 
          glowColor: 
            type: "c"
            value: new THREE.Color(0xffff00)
          viewVector: 
            type: "v3"
            value: camera.position
        vertexShader: """
        
        """
        fragmentShader: """
        
        """
        side: THREE.FrontSide
        blending: THREE.AdditiveBlending
        transparent: true
    	