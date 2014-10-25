Renderer
========

    require "./lib/obj_renderer"

    camera =
    scene =
    renderer =
    container = null

    mouseX = mouseY = 0

    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2

    init = ->
      container = document.createElement "div"
      document.body.appendChild container

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)
      camera.position.z = 100

      scene = new THREE.Scene()

      ambient = new THREE.AmbientLight 0x101030
      scene.add ambient

      directionalLight = new THREE.DirectionalLight 0xffeedd 
      directionalLight.position.set 0, 0, 1 
      scene.add directionalLight 

      manager = new THREE.LoadingManager()
      manager.onProgress = (item, loaded, total) ->
      	console.log item, loaded, total 

      texture = new THREE.Texture()

      onProgress = (xhr) ->
        if  xhr.lengthComputable 
          percentComplete = xhr.loaded / xhr.total * 100
          console.log "#{Math.round(percentComplete, 2)}% downloaded" 

      onError = (xhr) ->
        console.error xhr

      loader = new THREE.ImageLoader(manager)
      loader.crossOrigin = true
      loader.load "https://s3.amazonaws.com/trinket/18894/bartender.png?doot2", (image) ->
        texture.image = image
        texture.needsUpdate = true

      loader = new THREE.OBJLoader(manager)
      loader.crossOrigin = true
      loader.load "https://s3.amazonaws.com/trinket/18894/bartender.obj?doot2", (object) ->
        object.traverse (child) ->
          if child instanceof THREE.Mesh
            child.material.map = texture

            object.position.y = 0
            scene.add object

        , onProgress
        , onError

      renderer = new THREE.WebGLRenderer()
      renderer.setSize window.innerWidth, window.innerHeight
      container.appendChild renderer.domElement

      document.addEventListener "mousemove", onDocumentMouseMove, false
      window.addEventListener "resize", onWindowResize, false

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

    render = ->
      camera.position.x += (mouseX - camera.position.x) * .05
      camera.position.y += (-mouseY - camera.position.y) * .05

      camera.lookAt scene.position

      renderer.render scene, camera

    init()
    animate()
