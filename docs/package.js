(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "obj-renderer\n============\n\nThree js obj renderer\n",
      "mode": "100644",
      "type": "blob"
    },
    "lib/obj_renderer.js": {
      "path": "lib/obj_renderer.js",
      "content": "/**\n * @author mrdoob / http://mrdoob.com/\n */\n\nTHREE.OBJLoader = function ( manager ) {\n\n  this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;\n\n};\n\nTHREE.OBJLoader.prototype = {\n\n\tconstructor: THREE.OBJLoader,\n\n\tload: function ( url, onLoad, onProgress, onError ) {\n\n\t\tvar scope = this;\n\n\t\tvar loader = new THREE.XHRLoader( scope.manager );\n\t\tloader.setCrossOrigin( this.crossOrigin );\n\t\tloader.load( url, function ( text ) {\n\n\t\t\tonLoad( scope.parse( text ) );\n\n\t\t}, onProgress, onError );\n\n\t},\n\n\tparse: function ( text ) {\n\n\t\tconsole.time( 'OBJLoader' );\n\n\t\tvar object, objects = [];\n\t\tvar geometry, material;\n\n\t\tfunction parseVertexIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseNormalIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseUVIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;\n\n\t\t}\n\n\t\tfunction addVertex( a, b, c ) {\n\n\t\t\tgeometry.vertices.push(\n\t\t\t\tvertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],\n\t\t\t\tvertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],\n\t\t\t\tvertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addNormal( a, b, c ) {\n\n\t\t\tgeometry.normals.push(\n\t\t\t\tnormals[ a ], normals[ a + 1 ], normals[ a + 2 ],\n\t\t\t\tnormals[ b ], normals[ b + 1 ], normals[ b + 2 ],\n\t\t\t\tnormals[ c ], normals[ c + 1 ], normals[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addUV( a, b, c ) {\n\n\t\t\tgeometry.uvs.push(\n\t\t\t\tuvs[ a ], uvs[ a + 1 ],\n\t\t\t\tuvs[ b ], uvs[ b + 1 ],\n\t\t\t\tuvs[ c ], uvs[ c + 1 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {\n\n\t\t\tvar ia = parseVertexIndex( a );\n\t\t\tvar ib = parseVertexIndex( b );\n\t\t\tvar ic = parseVertexIndex( c );\n\n\t\t\tif ( d === undefined ) {\n\n\t\t\t\taddVertex( ia, ib, ic );\n\n\t\t\t} else {\n\n\t\t\t\tvar id = parseVertexIndex( d );\n\n\t\t\t\taddVertex( ia, ib, id );\n\t\t\t\taddVertex( ib, ic, id );\n\n\t\t\t}\n\n\t\t\tif ( ua !== undefined ) {\n\n\t\t\t\tvar ia = parseUVIndex( ua );\n\t\t\t\tvar ib = parseUVIndex( ub );\n\t\t\t\tvar ic = parseUVIndex( uc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddUV( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseUVIndex( ud );\n\n\t\t\t\t\taddUV( ia, ib, id );\n\t\t\t\t\taddUV( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif ( na !== undefined ) {\n\n\t\t\t\tvar ia = parseNormalIndex( na );\n\t\t\t\tvar ib = parseNormalIndex( nb );\n\t\t\t\tvar ic = parseNormalIndex( nc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddNormal( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseNormalIndex( nd );\n\n\t\t\t\t\taddNormal( ia, ib, id );\n\t\t\t\t\taddNormal( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\t// create mesh if no objects in text\n\n\t\tif ( /^o /gm.test( text ) === false ) {\n\n\t\t\tgeometry = {\n\t\t\t\tvertices: [],\n\t\t\t\tnormals: [],\n\t\t\t\tuvs: []\n\t\t\t};\n\n\t\t\tmaterial = {\n\t\t\t\tname: ''\n\t\t\t};\n\n\t\t\tobject = {\n\t\t\t\tname: '',\n\t\t\t\tgeometry: geometry,\n\t\t\t\tmaterial: material\n\t\t\t};\n\n\t\t\tobjects.push( object );\n\n\t\t}\n\n\t\tvar vertices = [];\n\t\tvar normals = [];\n\t\tvar uvs = [];\n\n\t\t// v float float float\n\n\t\tvar vertex_pattern = /v( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vn float float float\n\n\t\tvar normal_pattern = /vn( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vt float float\n\n\t\tvar uv_pattern = /vt( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// f vertex vertex vertex ...\n\n\t\tvar face_pattern1 = /f( +-?\\d+)( +-?\\d+)( +-?\\d+)( +-?\\d+)?/;\n\n\t\t// f vertex/uv vertex/uv vertex/uv ...\n\n\t\tvar face_pattern2 = /f( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...\n\n\t\tvar face_pattern3 = /f( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex//normal vertex//normal vertex//normal ...\n\n\t\tvar face_pattern4 = /f( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))?/\n\n\t\t//\n\n\t\tvar lines = text.split( '\\n' );\n\n\t\tfor ( var i = 0; i < lines.length; i ++ ) {\n\n\t\t\tvar line = lines[ i ];\n\t\t\tline = line.trim();\n\n\t\t\tvar result;\n\n\t\t\tif ( line.length === 0 || line.charAt( 0 ) === '#' ) {\n\n\t\t\t\tcontinue;\n\n\t\t\t} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"v 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tvertices.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vn 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tnormals.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vt 0.1 0.2\", \"0.1\", \"0.2\"]\n\n\t\t\t\tuvs.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1 2 3\", \"1\", \"2\", \"3\", undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1 2/2 3/3\", \" 1/1\", \"1\", \"1\", \" 2/2\", \"2\", \"2\", \" 3/3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1/1 2/2/2 3/3/3\", \" 1/1/1\", \"1\", \"1\", \"1\", \" 2/2/2\", \"2\", \"2\", \"2\", \" 3/3/3\", \"3\", \"3\", \"3\", undefined, undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],\n\t\t\t\t\tresult[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],\n\t\t\t\t\tresult[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1//1 2//2 3//3\", \" 1//1\", \"1\", \"1\", \" 2//2\", \"2\", \"2\", \" 3//3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tundefined, undefined, undefined, undefined,\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( /^o /.test( line ) ) {\n\n\t\t\t\tgeometry = {\n\t\t\t\t\tvertices: [],\n\t\t\t\t\tnormals: [],\n\t\t\t\t\tuvs: []\n\t\t\t\t};\n\n\t\t\t\tmaterial = {\n\t\t\t\t\tname: ''\n\t\t\t\t};\n\n\t\t\t\tobject = {\n\t\t\t\t\tname: line.substring( 2 ).trim(),\n\t\t\t\t\tgeometry: geometry,\n\t\t\t\t\tmaterial: material\n\t\t\t\t};\n\n\t\t\t\tobjects.push( object )\n\n\t\t\t} else if ( /^g /.test( line ) ) {\n\n\t\t\t\t// group\n\n\t\t\t} else if ( /^usemtl /.test( line ) ) {\n\n\t\t\t\t// material\n\n\t\t\t\tmaterial.name = line.substring( 7 ).trim();\n\n\t\t\t} else if ( /^mtllib /.test( line ) ) {\n\n\t\t\t\t// mtl file\n\n\t\t\t} else if ( /^s /.test( line ) ) {\n\n\t\t\t\t// smooth shading\n\n\t\t\t} else {\n\n\t\t\t\t// console.log( \"THREE.OBJLoader: Unhandled line \" + line );\n\n\t\t\t}\n\n\t\t}\n\n\t\tvar container = new THREE.Object3D();\n\n\t\tfor ( var i = 0, l = objects.length; i < l; i ++ ) {\n\n\t\t\tvar object = objects[ i ];\n\t\t\tvar geometry = object.geometry;\n\n\t\t\tvar buffergeometry = new THREE.BufferGeometry();\n\n\t\t\tbuffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );\n\n\t\t\tif ( geometry.normals.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );\n\t\t\t}\n\n\t\t\tif ( geometry.uvs.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );\n\t\t\t}\n\n\t\t\tvar material = new THREE.MeshLambertMaterial();\n\t\t\tmaterial.name = object.material.name;\n\n\t\t\tvar mesh = new THREE.Mesh( buffergeometry, material );\n\t\t\tmesh.name = object.name;\n\n\t\t\tcontainer.add( mesh );\n\n\t\t}\n\n\t\tconsole.timeEnd( 'OBJLoader' );\n\n\t\treturn container;\n\n\t}\n\n};\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Renderer\n========\n\n    require \"./lib/obj_renderer\"\n    ParticleSystem = require \"./particles\"\n\n    {Vector3} = THREE\n\n    CUBE_SIZE = 10\n\n    camera =\n    scene =\n    renderer =\n    container = null\n\n    mouseX = mouseY = 0\n\n    manager = new THREE.LoadingManager()\n    manager.onProgress = (item, loaded, total) ->\n      console.log item, loaded, total\n\n    windowHalfX = window.innerWidth / 2\n    windowHalfY = window.innerHeight / 2\n    aspectRatio = window.innerWidth / window.innerHeight\n\n    init = ->\n      container = document.createElement \"div\"\n      document.body.appendChild container\n\n      camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 2000)\n      camera.position.z = 100\n\n      scene = new THREE.Scene()\n\n      addLights scene\n\n      generateGrid(10)\n\n      texture = new THREE.Texture()\n\n      loadPalette \"bartender\", texture\n      loadObj \"bartender\", texture\n      ParticleSystem(scene)\n\n      renderer = new THREE.WebGLRenderer()\n      renderer.setSize window.innerWidth, window.innerHeight\n      container.appendChild renderer.domElement\n\n      document.addEventListener \"mousemove\", onDocumentMouseMove, false\n      window.addEventListener \"resize\", onWindowResize, false\n\n    generateGrid = (size) ->\n      [0...size].forEach (x) ->\n        [0...size].forEach (z) ->\n          addCube scene, new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE)\n\n    onWindowResize = ->\n    \twindowHalfX = window.innerWidth / 2\n    \twindowHalfY = window.innerHeight / 2\n\n    \tcamera.aspect = window.innerWidth / window.innerHeight\n    \tcamera.updateProjectionMatrix()\n\n    \trenderer.setSize window.innerWidth, window.innerHeight\n\n    onDocumentMouseMove = (event) ->\n      mouseX = (event.clientX - windowHalfX) / 2\n      mouseY = (event.clientY - windowHalfY) / 2\n\n    animate = ->\n      requestAnimationFrame animate\n      render()\n\n    addLights = (scene) ->\n      ambient = new THREE.AmbientLight 0x101030\n      scene.add ambient\n\n      directionalLight = new THREE.DirectionalLight 0xffeedd\n      directionalLight.position.set 0, 0, 1\n      scene.add directionalLight\n\n    addCube = (scene, position) ->\n      geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)\n      material = new THREE.MeshBasicMaterial\n        color: 0xfffff\n        wireframe: true\n\n      cube = new THREE.Mesh geometry, material\n      cube.position.x = position.x\n      cube.position.y = position.y\n      cube.position.z = position.z\n\n      scene.add cube\n\n    loadPalette = (name, texture) ->\n      loader = new THREE.ImageLoader(manager)\n      loader.crossOrigin = true\n      loader.load \"https://s3.amazonaws.com/trinket/18894/#{name}.png?doot2\", (image) ->\n        texture.image = image\n        texture.needsUpdate = true\n\n    loadObj = (name, texture) ->\n      onProgress = (xhr) ->\n        if  xhr.lengthComputable\n          percentComplete = xhr.loaded / xhr.total * 100\n          console.log \"#{Math.round(percentComplete, 2)}% downloaded\"\n\n      onError = (xhr) ->\n        console.error xhr\n\n      loader = new THREE.OBJLoader(manager)\n      loader.crossOrigin = true\n      loader.load \"https://s3.amazonaws.com/trinket/18894/#{name}.obj?doot2\", (object) ->\n        object.traverse (child) ->\n          if child instanceof THREE.Mesh\n            child.material.map = texture\n\n            object.position.y = 0\n            scene.add object\n\n        , onProgress\n        , onError\n\n    render = ->\n      camera.position.x += (mouseX - camera.position.x) * .05\n      camera.position.y += (-mouseY - camera.position.y) * .05\n\n      camera.lookAt scene.position\n\n      renderer.render scene, camera\n\n    init()\n    animate()\n",
      "mode": "100644",
      "type": "blob"
    },
    "particles.coffee.md": {
      "path": "particles.coffee.md",
      "content": "Particles\n=========\n\nEmit voxel particles\n\n    # picks a random float between -max/2 and max/2\n    randomFloat = (max) ->\n      Math.random() * max - max / 2\n\n    randomVector3 = (max) ->\n        x = randomFloat max\n        y = randomFloat max\n        z = randomFloat max\n\n        new THREE.Vector3(x, y, z)\n\n    createParticles = (count) ->\n      particles = new THREE.Geometry()\n\n      [0...count].forEach ->\n        particle = randomVector3(500)\n\n        # add it to the geometry\n        particles.vertices.push particle\n\n      particles\n\n    module.exports = (scene) ->\n      material = new THREE.ParticleBasicMaterial\n        color: 0xFFFFFF\n        size: 20\n\n      particles = createParticles 1800\n      particleSystem = new THREE.ParticleSystem particles, material\n\n      scene.add particleSystem\n\n      particleSystem\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min.js\"\n]\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/test.coffee": {
      "path": "test/test.coffee",
      "content": "require \"../main\"\n\ndescribe \"renderer\", ->\n  it \"should have THREE\", ->\n    assert THREE.OBJLoader\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "lib/obj_renderer": {
      "path": "lib/obj_renderer",
      "content": "/**\n * @author mrdoob / http://mrdoob.com/\n */\n\nTHREE.OBJLoader = function ( manager ) {\n\n  this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;\n\n};\n\nTHREE.OBJLoader.prototype = {\n\n\tconstructor: THREE.OBJLoader,\n\n\tload: function ( url, onLoad, onProgress, onError ) {\n\n\t\tvar scope = this;\n\n\t\tvar loader = new THREE.XHRLoader( scope.manager );\n\t\tloader.setCrossOrigin( this.crossOrigin );\n\t\tloader.load( url, function ( text ) {\n\n\t\t\tonLoad( scope.parse( text ) );\n\n\t\t}, onProgress, onError );\n\n\t},\n\n\tparse: function ( text ) {\n\n\t\tconsole.time( 'OBJLoader' );\n\n\t\tvar object, objects = [];\n\t\tvar geometry, material;\n\n\t\tfunction parseVertexIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseNormalIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseUVIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;\n\n\t\t}\n\n\t\tfunction addVertex( a, b, c ) {\n\n\t\t\tgeometry.vertices.push(\n\t\t\t\tvertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],\n\t\t\t\tvertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],\n\t\t\t\tvertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addNormal( a, b, c ) {\n\n\t\t\tgeometry.normals.push(\n\t\t\t\tnormals[ a ], normals[ a + 1 ], normals[ a + 2 ],\n\t\t\t\tnormals[ b ], normals[ b + 1 ], normals[ b + 2 ],\n\t\t\t\tnormals[ c ], normals[ c + 1 ], normals[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addUV( a, b, c ) {\n\n\t\t\tgeometry.uvs.push(\n\t\t\t\tuvs[ a ], uvs[ a + 1 ],\n\t\t\t\tuvs[ b ], uvs[ b + 1 ],\n\t\t\t\tuvs[ c ], uvs[ c + 1 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {\n\n\t\t\tvar ia = parseVertexIndex( a );\n\t\t\tvar ib = parseVertexIndex( b );\n\t\t\tvar ic = parseVertexIndex( c );\n\n\t\t\tif ( d === undefined ) {\n\n\t\t\t\taddVertex( ia, ib, ic );\n\n\t\t\t} else {\n\n\t\t\t\tvar id = parseVertexIndex( d );\n\n\t\t\t\taddVertex( ia, ib, id );\n\t\t\t\taddVertex( ib, ic, id );\n\n\t\t\t}\n\n\t\t\tif ( ua !== undefined ) {\n\n\t\t\t\tvar ia = parseUVIndex( ua );\n\t\t\t\tvar ib = parseUVIndex( ub );\n\t\t\t\tvar ic = parseUVIndex( uc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddUV( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseUVIndex( ud );\n\n\t\t\t\t\taddUV( ia, ib, id );\n\t\t\t\t\taddUV( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif ( na !== undefined ) {\n\n\t\t\t\tvar ia = parseNormalIndex( na );\n\t\t\t\tvar ib = parseNormalIndex( nb );\n\t\t\t\tvar ic = parseNormalIndex( nc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddNormal( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseNormalIndex( nd );\n\n\t\t\t\t\taddNormal( ia, ib, id );\n\t\t\t\t\taddNormal( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\t// create mesh if no objects in text\n\n\t\tif ( /^o /gm.test( text ) === false ) {\n\n\t\t\tgeometry = {\n\t\t\t\tvertices: [],\n\t\t\t\tnormals: [],\n\t\t\t\tuvs: []\n\t\t\t};\n\n\t\t\tmaterial = {\n\t\t\t\tname: ''\n\t\t\t};\n\n\t\t\tobject = {\n\t\t\t\tname: '',\n\t\t\t\tgeometry: geometry,\n\t\t\t\tmaterial: material\n\t\t\t};\n\n\t\t\tobjects.push( object );\n\n\t\t}\n\n\t\tvar vertices = [];\n\t\tvar normals = [];\n\t\tvar uvs = [];\n\n\t\t// v float float float\n\n\t\tvar vertex_pattern = /v( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vn float float float\n\n\t\tvar normal_pattern = /vn( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vt float float\n\n\t\tvar uv_pattern = /vt( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// f vertex vertex vertex ...\n\n\t\tvar face_pattern1 = /f( +-?\\d+)( +-?\\d+)( +-?\\d+)( +-?\\d+)?/;\n\n\t\t// f vertex/uv vertex/uv vertex/uv ...\n\n\t\tvar face_pattern2 = /f( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...\n\n\t\tvar face_pattern3 = /f( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex//normal vertex//normal vertex//normal ...\n\n\t\tvar face_pattern4 = /f( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))?/\n\n\t\t//\n\n\t\tvar lines = text.split( '\\n' );\n\n\t\tfor ( var i = 0; i < lines.length; i ++ ) {\n\n\t\t\tvar line = lines[ i ];\n\t\t\tline = line.trim();\n\n\t\t\tvar result;\n\n\t\t\tif ( line.length === 0 || line.charAt( 0 ) === '#' ) {\n\n\t\t\t\tcontinue;\n\n\t\t\t} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"v 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tvertices.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vn 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tnormals.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vt 0.1 0.2\", \"0.1\", \"0.2\"]\n\n\t\t\t\tuvs.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1 2 3\", \"1\", \"2\", \"3\", undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1 2/2 3/3\", \" 1/1\", \"1\", \"1\", \" 2/2\", \"2\", \"2\", \" 3/3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1/1 2/2/2 3/3/3\", \" 1/1/1\", \"1\", \"1\", \"1\", \" 2/2/2\", \"2\", \"2\", \"2\", \" 3/3/3\", \"3\", \"3\", \"3\", undefined, undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],\n\t\t\t\t\tresult[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],\n\t\t\t\t\tresult[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1//1 2//2 3//3\", \" 1//1\", \"1\", \"1\", \" 2//2\", \"2\", \"2\", \" 3//3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tundefined, undefined, undefined, undefined,\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( /^o /.test( line ) ) {\n\n\t\t\t\tgeometry = {\n\t\t\t\t\tvertices: [],\n\t\t\t\t\tnormals: [],\n\t\t\t\t\tuvs: []\n\t\t\t\t};\n\n\t\t\t\tmaterial = {\n\t\t\t\t\tname: ''\n\t\t\t\t};\n\n\t\t\t\tobject = {\n\t\t\t\t\tname: line.substring( 2 ).trim(),\n\t\t\t\t\tgeometry: geometry,\n\t\t\t\t\tmaterial: material\n\t\t\t\t};\n\n\t\t\t\tobjects.push( object )\n\n\t\t\t} else if ( /^g /.test( line ) ) {\n\n\t\t\t\t// group\n\n\t\t\t} else if ( /^usemtl /.test( line ) ) {\n\n\t\t\t\t// material\n\n\t\t\t\tmaterial.name = line.substring( 7 ).trim();\n\n\t\t\t} else if ( /^mtllib /.test( line ) ) {\n\n\t\t\t\t// mtl file\n\n\t\t\t} else if ( /^s /.test( line ) ) {\n\n\t\t\t\t// smooth shading\n\n\t\t\t} else {\n\n\t\t\t\t// console.log( \"THREE.OBJLoader: Unhandled line \" + line );\n\n\t\t\t}\n\n\t\t}\n\n\t\tvar container = new THREE.Object3D();\n\n\t\tfor ( var i = 0, l = objects.length; i < l; i ++ ) {\n\n\t\t\tvar object = objects[ i ];\n\t\t\tvar geometry = object.geometry;\n\n\t\t\tvar buffergeometry = new THREE.BufferGeometry();\n\n\t\t\tbuffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );\n\n\t\t\tif ( geometry.normals.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );\n\t\t\t}\n\n\t\t\tif ( geometry.uvs.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );\n\t\t\t}\n\n\t\t\tvar material = new THREE.MeshLambertMaterial();\n\t\t\tmaterial.name = object.material.name;\n\n\t\t\tvar mesh = new THREE.Mesh( buffergeometry, material );\n\t\t\tmesh.name = object.name;\n\n\t\t\tcontainer.add( mesh );\n\n\t\t}\n\n\t\tconsole.timeEnd( 'OBJLoader' );\n\n\t\treturn container;\n\n\t}\n\n};\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var CUBE_SIZE, ParticleSystem, Vector3, addCube, addLights, animate, aspectRatio, camera, container, generateGrid, init, loadObj, loadPalette, manager, mouseX, mouseY, onDocumentMouseMove, onWindowResize, render, renderer, scene, windowHalfX, windowHalfY;\n\n  require(\"./lib/obj_renderer\");\n\n  ParticleSystem = require(\"./particles\");\n\n  Vector3 = THREE.Vector3;\n\n  CUBE_SIZE = 10;\n\n  camera = scene = renderer = container = null;\n\n  mouseX = mouseY = 0;\n\n  manager = new THREE.LoadingManager();\n\n  manager.onProgress = function(item, loaded, total) {\n    return console.log(item, loaded, total);\n  };\n\n  windowHalfX = window.innerWidth / 2;\n\n  windowHalfY = window.innerHeight / 2;\n\n  aspectRatio = window.innerWidth / window.innerHeight;\n\n  init = function() {\n    var texture;\n    container = document.createElement(\"div\");\n    document.body.appendChild(container);\n    camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 2000);\n    camera.position.z = 100;\n    scene = new THREE.Scene();\n    addLights(scene);\n    generateGrid(10);\n    texture = new THREE.Texture();\n    loadPalette(\"bartender\", texture);\n    loadObj(\"bartender\", texture);\n    ParticleSystem(scene);\n    renderer = new THREE.WebGLRenderer();\n    renderer.setSize(window.innerWidth, window.innerHeight);\n    container.appendChild(renderer.domElement);\n    document.addEventListener(\"mousemove\", onDocumentMouseMove, false);\n    return window.addEventListener(\"resize\", onWindowResize, false);\n  };\n\n  generateGrid = function(size) {\n    var _i, _results;\n    return (function() {\n      _results = [];\n      for (var _i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--){ _results.push(_i); }\n      return _results;\n    }).apply(this).forEach(function(x) {\n      var _i, _results;\n      return (function() {\n        _results = [];\n        for (var _i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--){ _results.push(_i); }\n        return _results;\n      }).apply(this).forEach(function(z) {\n        return addCube(scene, new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE));\n      });\n    });\n  };\n\n  onWindowResize = function() {\n    windowHalfX = window.innerWidth / 2;\n    windowHalfY = window.innerHeight / 2;\n    camera.aspect = window.innerWidth / window.innerHeight;\n    camera.updateProjectionMatrix();\n    return renderer.setSize(window.innerWidth, window.innerHeight);\n  };\n\n  onDocumentMouseMove = function(event) {\n    mouseX = (event.clientX - windowHalfX) / 2;\n    return mouseY = (event.clientY - windowHalfY) / 2;\n  };\n\n  animate = function() {\n    requestAnimationFrame(animate);\n    return render();\n  };\n\n  addLights = function(scene) {\n    var ambient, directionalLight;\n    ambient = new THREE.AmbientLight(0x101030);\n    scene.add(ambient);\n    directionalLight = new THREE.DirectionalLight(0xffeedd);\n    directionalLight.position.set(0, 0, 1);\n    return scene.add(directionalLight);\n  };\n\n  addCube = function(scene, position) {\n    var cube, geometry, material;\n    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);\n    material = new THREE.MeshBasicMaterial({\n      color: 0xfffff,\n      wireframe: true\n    });\n    cube = new THREE.Mesh(geometry, material);\n    cube.position.x = position.x;\n    cube.position.y = position.y;\n    cube.position.z = position.z;\n    return scene.add(cube);\n  };\n\n  loadPalette = function(name, texture) {\n    var loader;\n    loader = new THREE.ImageLoader(manager);\n    loader.crossOrigin = true;\n    return loader.load(\"https://s3.amazonaws.com/trinket/18894/\" + name + \".png?doot2\", function(image) {\n      texture.image = image;\n      return texture.needsUpdate = true;\n    });\n  };\n\n  loadObj = function(name, texture) {\n    var loader, onError, onProgress;\n    onProgress = function(xhr) {\n      var percentComplete;\n      if (xhr.lengthComputable) {\n        percentComplete = xhr.loaded / xhr.total * 100;\n        return console.log(\"\" + (Math.round(percentComplete, 2)) + \"% downloaded\");\n      }\n    };\n    onError = function(xhr) {\n      return console.error(xhr);\n    };\n    loader = new THREE.OBJLoader(manager);\n    loader.crossOrigin = true;\n    return loader.load(\"https://s3.amazonaws.com/trinket/18894/\" + name + \".obj?doot2\", function(object) {\n      return object.traverse(function(child) {\n        if (child instanceof THREE.Mesh) {\n          child.material.map = texture;\n          object.position.y = 0;\n          return scene.add(object);\n        }\n      }, onProgress, onError);\n    });\n  };\n\n  render = function() {\n    camera.position.x += (mouseX - camera.position.x) * .05;\n    camera.position.y += (-mouseY - camera.position.y) * .05;\n    camera.lookAt(scene.position);\n    return renderer.render(scene, camera);\n  };\n\n  init();\n\n  animate();\n\n}).call(this);\n",
      "type": "blob"
    },
    "particles": {
      "path": "particles",
      "content": "(function() {\n  var createParticles, randomFloat, randomVector3;\n\n  randomFloat = function(max) {\n    return Math.random() * max - max / 2;\n  };\n\n  randomVector3 = function(max) {\n    var x, y, z;\n    x = randomFloat(max);\n    y = randomFloat(max);\n    z = randomFloat(max);\n    return new THREE.Vector3(x, y, z);\n  };\n\n  createParticles = function(count) {\n    var particles, _i, _results;\n    particles = new THREE.Geometry();\n    (function() {\n      _results = [];\n      for (var _i = 0; 0 <= count ? _i < count : _i > count; 0 <= count ? _i++ : _i--){ _results.push(_i); }\n      return _results;\n    }).apply(this).forEach(function() {\n      var particle;\n      particle = randomVector3(500);\n      return particles.vertices.push(particle);\n    });\n    return particles;\n  };\n\n  module.exports = function(scene) {\n    var material, particleSystem, particles;\n    material = new THREE.ParticleBasicMaterial({\n      color: 0xFFFFFF,\n      size: 20\n    });\n    particles = createParticles(1800);\n    particleSystem = new THREE.ParticleSystem(particles, material);\n    scene.add(particleSystem);\n    return particleSystem;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min.js\"]};",
      "type": "blob"
    },
    "test/test": {
      "path": "test/test",
      "content": "(function() {\n  require(\"../main\");\n\n  describe(\"renderer\", function() {\n    return it(\"should have THREE\", function() {\n      return assert(THREE.OBJLoader);\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.1.0",
  "entryPoint": "main",
  "remoteDependencies": [
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min.js"
  ],
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "mdiebolt/obj-renderer",
    "homepage": null,
    "description": "Three js obj renderer",
    "html_url": "https://github.com/mdiebolt/obj-renderer",
    "url": "https://api.github.com/repos/mdiebolt/obj-renderer",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});