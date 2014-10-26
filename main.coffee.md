Renderer
========

    require "./globals"
    require "./lib/obj_renderer"

    ParticleSystem = require "./particles"
    eventHandlers = require "./event_handlers"

    util = require "util"
    util.applyStylesheet(require("./style"))

    map = require("./map")()

    particles = []

    container = document.createElement "div"
    document.body.appendChild container

    container.appendChild renderer.domElement
    renderer.setSize window.innerWidth, window.innerHeight

    camera.position.z = 100

Return 1 if `probability` percent of the time.
Return -1 otherwise

    randomSign = (probability) ->
      if Math.random() <= probability
        1
      else
        -1

    init = ->
      addLights()

      map.generateGrid(10)
      map.populateCharacters()

      particles = ParticleSystem()

      particles.generate
        number: 100
        position: new THREE.Vector3(0, 0, 0)

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
    
      camera.position.x -= (-mouseX + camera.position.x) * .05
      camera.position.y -= (-mouseY + camera.position.y) * .05

      camera.lookAt scene.position

      particles.update (p) ->
        p.age ||= 0
        p.age += 1

        p.material.opacity = p.material.opacity - 0.01
        scene.remove(p) if p.age > 100
        
        p.position.x += randomSign(0.5)
        p.position.z += randomSign(0.5)

      renderer.render scene, camera

    init()
    animate()
