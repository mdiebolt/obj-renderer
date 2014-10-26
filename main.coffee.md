Renderer
========

    require "./lib/obj_renderer"
    util = require "util"
    ParticleSystem = require "./particles"
    particles = []

    util.applyStylesheet(require("./style"))

    {Vector3} = THREE

    CUBE_SIZE = 10

    mouseX = mouseY = 0

    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2
    aspectRatio = window.innerWidth / window.innerHeight

    window.renderer = null
    window.scene = new THREE.Scene()
    window.camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 2000)
    camera.position.z = 100

    init = ->
      container = document.createElement "div"
      document.body.appendChild container

      addLights scene

      generateGrid(10)

      loadPalette "bartender", texture
      loadObj "bartender",
        texture: texture
        position: new Vector3(0, 0, 0)

      loadObj "robo_sheriff",
        texture: texture
        position: new Vector3(10, 0, 0)

      loadObj "cactus",
        texture: texture
        position: new Vector3(20, 0, 0)

      loadObj "arrow",
        texture: texture
        position: new Vector3(30, 0, 0)

      loadObj "beam_sword",
        texture: texture
        position: new Vector3(40, 0, 0)

      loadObj "branding_iron",
        texture: texture
        position: new Vector3(50, 0, 0)

      loadObj "character",
        texture: texture
        position: new Vector3(60, 0, 0)

      loadObj "gun",
        texture: texture
        position: new Vector3(70, 0, 0)

      loadObj "hoverboard",
        texture: texture
        position: new Vector3(80, 0, 0)

      loadObj "jetpack_bandit",
        texture: texture
        position: new Vector3(90, 0, 0)

      particles = ParticleSystem
        scene: scene

      particles.generate
        number: 100
        position: new Vector3(0, 0, 0)

      renderer = new THREE.WebGLRenderer()
      renderer.setSize window.innerWidth, window.innerHeight
      container.appendChild renderer.domElement

      document.addEventListener "mousemove", onDocumentMouseMove, false
      window.addEventListener "resize", onWindowResize, false

    generateGrid = (size) ->
      [0...size].forEach (x) ->
        [0...size].forEach (z) ->
          addCube scene, new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE)

    onWindowResize = ->
    	windowHalfX = window.innerWidth / 2
    	windowHalfY = window.innerHeight / 2

    	camera.aspect = window.innerWidth / window.innerHeight
    	camera.updateProjectionMatrix()

    	renderer.setSize window.innerWidth, window.innerHeight

    onDocumentMouseMove = (event) ->
      mouseX = (event.clientX - windowHalfX) / 2
      mouseY = (event.clientY - windowHalfY) / 2

    animate = ->
      requestAnimationFrame animate
      render()

    addLights = (scene) ->
      ambient = new THREE.AmbientLight 0x101030
      scene.add ambient

      directionalLight = new THREE.DirectionalLight 0xffeedd
      directionalLight.position.set 0, 0, 10
      scene.add directionalLight

    addCube = (scene, position) ->
      geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff
        wireframe: true

      cube = new THREE.Mesh geometry, material
      cube.position.set position.x, position.y, position.z
      scene.add cube

    render = ->
      camera.position.x += (mouseX - camera.position.x) * .05
      camera.position.y += (-mouseY - camera.position.y) * .05

      camera.lookAt scene.position
      
      particles.update (p) ->
        p.age ||= 0
        p.age += 1

        p.material.opacity = p.material.opacity - 0.01 
        scene.remove(p) if p.age > 100

        if Math.random() > 0.5
          x = 1
        else
          x = -1

        if Math.random() > 0.5
          z = 1
        else
          z = -1

        p.position.x += x * 1
        p.position.z += z * 1

      renderer.render scene, camera

    init()
    animate()
