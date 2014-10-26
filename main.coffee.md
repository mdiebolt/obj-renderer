Renderer
========

    require "./lib/obj_renderer"
    
    ParticleSystem = require "./particles"
    eventHandlers = require "./event_handlers"
    load = require "./loader"
    
    util = require "util"
    util.applyStylesheet(require("./style"))

    particles = []

    {Vector3} = THREE
    
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

      map.generateGrid(10)
      map.populateCharacters()

      particles = ParticleSystem()

      particles.generate
        number: 100
        position: new Vector3(0, 0, 0)

      eventHandlers.initialize()

    animate = ->
      requestAnimationFrame animate
      render()

    addLights = ->
      ambient = new THREE.AmbientLight 0x101030
      scene.add ambient

      directionalLight = new THREE.DirectionalLight 0xffeedd
      directionalLight.position.set 0, 0, 10
      scene.add directionalLight

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
