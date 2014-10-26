Loader
======

Loads voxel models from .obj files

    manager = new THREE.LoadingManager()
    texture = new THREE.Texture()

Let us know how far along things are when loading a .obj model.

    onProgress = (xhr) ->
      if xhr.lengthComputable
        percentComplete = xhr.loaded / xhr.total * 100
        console.log "#{Math.round(percentComplete, 2)}% downloaded"

    onError = (xhr) ->
      console.error xhr

We're sharing the same palette across all of our models. 
Load up one from an arbitrary model we use. 

    do ->
      loader = new THREE.ImageLoader(manager)
      loader.crossOrigin = true

      loader.load "https://s3.amazonaws.com/distri-tactics/bartender.png?doot2", (image) ->
        texture.image = image
        texture.needsUpdate = true

    module.exports = (name, opts={}) ->
      position = opts.position

      loader = new THREE.OBJLoader(manager)
      loader.crossOrigin = true
      loader.load "https://s3.amazonaws.com/distri-tactics/#{name}.obj?doot2", (object) ->
        object.traverse (child) ->
          if child instanceof THREE.Mesh
            child.material.map = texture

            object.position.set position.x, position.y, position.z

            scene.add object

        , onProgress
        , onError