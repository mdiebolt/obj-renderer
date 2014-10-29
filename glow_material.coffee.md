Glow Material
=============

The Glow Pt. 2
This is a shader that you can apply to a mesh in order to make it glow.
In the future this could be parameterized by color and intensity to make it more robust.

    module.exports = ->
      new THREE.ShaderMaterial
        uniforms:
          c:
            type: "f"
            value: 1.0
            
Lowering p makes the object glow brighter
            
          p:
            type: "f"
            value: 0.7
            
Change the glob color here. It's defaulted to yellow
            
          glowColor:
            type: "c"
            value: new THREE.Color(0xffff00)
          viewVector:
            type: "v3"
            value: camera.position
        vertexShader: """
          uniform vec3 viewVector;
          uniform float c;
          uniform float p;
          varying float intensity;
          void main() {
            vec3 vNormal = normalize( normalMatrix * normal );
            vec3 vNormel = normalize( normalMatrix * viewVector );

            intensity = pow( c - dot(vNormal, vNormel), p );

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          }
        """
        fragmentShader: """
          uniform vec3 glowColor;

          varying float intensity;

          void main() {
            vec3 glow = glowColor * intensity;
            gl_FragColor = vec4( glow, 1.0 );
          }
        """
        side: THREE.FrontSide
        blending: THREE.AdditiveBlending
        transparent: true
