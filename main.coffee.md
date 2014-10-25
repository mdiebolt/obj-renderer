Renderer
========

    require "./lib/obj_renderer"
    ParticleSystem = require "./particles"
    particles = []

    {Vector3} = THREE

    CUBE_SIZE = 10

    camera =
    scene =
    renderer =
    container = null

    mouseX = mouseY = 0

    manager = new THREE.LoadingManager()
    manager.onProgress = (item, loaded, total) ->
      console.log item, loaded, total

    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2
    aspectRatio = window.innerWidth / window.innerHeight

    init = ->
      container = document.createElement "div"
      document.body.appendChild container

      camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 2000)
      camera.position.z = 100

      scene = new THREE.Scene()

      addLights scene

      generateGrid(10)

      texture = new THREE.Texture()

      loadPalette "bartender", texture
      loadObj "bartender", texture
      
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
      directionalLight.position.set 0, 0, 1
      scene.add directionalLight

    addCube = (scene, position) ->
      geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)
      material = new THREE.MeshBasicMaterial
        color: 0xfffff
        wireframe: true

      cube = new THREE.Mesh geometry, material
      cube.position.x = position.x
      cube.position.y = position.y
      cube.position.z = position.z

      scene.add cube

    loadPalette = (name, texture) ->
      loader = new THREE.ImageLoader(manager)
      loader.crossOrigin = true
      loader.load "https://s3.amazonaws.com/trinket/18894/#{name}.png?doot2", (image) ->
        texture.image = image
        texture.needsUpdate = true

    loadObj = (name, texture) ->
      onProgress = (xhr) ->
        if  xhr.lengthComputable
          percentComplete = xhr.loaded / xhr.total * 100
          console.log "#{Math.round(percentComplete, 2)}% downloaded"

      onError = (xhr) ->
        console.error xhr

      loader = new THREE.OBJLoader(manager)
      loader.crossOrigin = true
      loader.load "https://s3.amazonaws.com/trinket/18894/#{name}.obj?doot2", (object) ->
        object.traverse (child) ->
          if child instanceof THREE.Mesh
            child.material.map = texture

            object.position.y = 0
            scene.add object

        , onProgress
        , onError

    render = ->
      camera.position.x += (mouseX - camera.position.x) * .05
      camera.position.y += (-mouseY - camera.position.y) * .05

      camera.lookAt scene.position

      particles.update (p) ->
        p.age ||= 0
        p.age += 1
        
        scene.remove(p) if p.age > 120
        
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
