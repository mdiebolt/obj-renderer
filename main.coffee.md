Renderer
========

    require "./lib/obj_renderer"
    
    ParticleSystem = require "./particles"
    eventHandlers = require "./event_handlers"
    load = require "./loader"
    console.log eventHandlers.initialize()
    
    
    util = require "util"
    util.applyStylesheet(require("./style"))

    particles = []

    {Vector3} = THREE

    CUBE_SIZE = 10
    
    width = window.innerWidth
    height = window.innerHeight

    container = document.createElement "div"
    document.body.appendChild container
    
    window.renderer = new THREE.WebGLRenderer()    
    container.appendChild renderer.domElement    
    renderer.setSize width, height
    
    window.scene = new THREE.Scene()
    window.camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000)
    camera.position.z = 100
    
    init = ->
      addLights()

      generateGrid(10)

      load "bartender",
        position: new Vector3(0, 0, 0)

      load "robo_sheriff",
        position: new Vector3(10, 0, 0)

      load "cactus",
        position: new Vector3(20, 0, 0)

      load "arrow",
        position: new Vector3(30, 0, 0)

      load "beam_sword",
        position: new Vector3(40, 0, 0)

      load "branding_iron",
        position: new Vector3(50, 0, 0)

      load "character",
        position: new Vector3(60, 0, 0)

      load "gun",
        position: new Vector3(70, 0, 0)

      load "hoverboard",
        position: new Vector3(80, 0, 0)

      load "jetpack_bandit",
        position: new Vector3(90, 0, 0)

      particles = ParticleSystem()

      particles.generate
        number: 100
        position: new Vector3(0, 0, 0)

      eventHandlers.initialize()

    generateGrid = (size) ->
      [0...size].forEach (x) ->
        [0...size].forEach (z) ->
          addCube new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE)

    animate = ->
      requestAnimationFrame animate
      render()

    addLights = ->
      ambient = new THREE.AmbientLight 0x101030
      scene.add ambient

      directionalLight = new THREE.DirectionalLight 0xffeedd
      directionalLight.position.set 0, 0, 10
      scene.add directionalLight

    addCube = (position) ->
      geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff
        wireframe: true

      cube = new THREE.Mesh geometry, material
      cube.position.set position.x, position.y, position.z
      scene.add cube

    render = ->
      {x:mouseX, y:mouseY} = eventHandlers.mousePosition()
      
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
