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
    "event_handlers.coffee.md": {
      "path": "event_handlers.coffee.md",
      "content": "Event Handlers\n==============\n\n    raycaster = new THREE.Raycaster()\n    projector = new THREE.Projector()\n    raycastDirection = new THREE.Vector3()\n\n    onWindowResize = ->\n    \tcamera.aspect = window.innerWidth / window.innerHeight\n    \tcamera.updateProjectionMatrix()\n\n    \trenderer.setSize window.innerWidth, window.innerHeight\n\n    onKeydown = (e) ->\n      e.preventDefault()\n      \n      switch e.keyCode\n        when 81 # q\n          camera.position.x -= 1\n        when 87 # w\n          camera.position.x += 1\n        when 65 # a\n          camera.position.y -= 1\n        when 83 # s\n          camera.position.y += 1\n        when 90 # z\n          camera.position.z -= 1\n        when 88 # x\n          camera.position.z += 1\n\n    onClick = (e) ->\n\nTranslate mouse coordinates into a number ranging from -1 to 1.\n`x == -1 && y == -1` is top left.\n`x ==  1 && y ==  1` is bottom right.\n\n      raycastDirection.x = (e.clientX / window.innerWidth) * 2 - 1\n      raycastDirection.y = -(e.clientY / window.innerHeight) * 2 + 1\n\nhttp://stackoverflow.com/questions/11036106/three-js-projector-and-ray-objects\nRenderers use Vector#project for translating 3D points to the 2D screen.\nVector#unproject is basically for doing the inverse, unprojecting 2D points into the 3D world.\nFor both methods you pass the camera you're viewing the scene through.\n\n      raycastDirection.unproject camera\n\nMove ray to the camera\n\n      raycastDirection.sub camera.position\n\n      raycaster.set camera.position, raycastDirection.normalize()\n\nTODO: restrict this to only selectable nodes such as characters\n\nNeed to pass the recursive flag for our .obj models\nhttp://stackoverflow.com/questions/22114224/three-js-raycasting-obj\n\n      intersects = raycaster.intersectObjects window.characters, true\n\nTODO: sort intersections by closest and stop after the first one\n\n      intersects.forEach (intersection) ->\n      \nWe're expecting to click on a .obj model. \nOur raycaster intersects the underlying Mesh. \nWe need to call `parent` to get the right object\n              \n        position = intersection.object.parent.position\n        \n        camera.position.set position.x, position.y + 100, position.z + 200\n        camera.lookAt intersection.object.parent.position\n\n    window.addEventListener \"resize\", onWindowResize, false\n    window.addEventListener \"click\", onClick, false\n    window.addEventListener \"keydown\", onKeydown, false\n",
      "mode": "100644",
      "type": "blob"
    },
    "globals.coffee.md": {
      "path": "globals.coffee.md",
      "content": "Globals\n=======\n\nPut all these gross guys in here.\n\n    window.renderer = new THREE.WebGLRenderer()\n    window.scene = new THREE.Scene()\n    window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)\n",
      "mode": "100644",
      "type": "blob"
    },
    "lib/obj_renderer.js": {
      "path": "lib/obj_renderer.js",
      "content": "/**\n * @author mrdoob / http://mrdoob.com/\n */\n\nTHREE.OBJLoader = function ( manager ) {\n\n  this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;\n\n};\n\nTHREE.OBJLoader.prototype = {\n\n\tconstructor: THREE.OBJLoader,\n\n\tload: function ( url, onLoad, onProgress, onError ) {\n\n\t\tvar scope = this;\n\n\t\tvar loader = new THREE.XHRLoader( scope.manager );\n\t\tloader.setCrossOrigin( this.crossOrigin );\n\t\tloader.load( url, function ( text ) {\n\n\t\t\tonLoad( scope.parse( text ) );\n\n\t\t}, onProgress, onError );\n\n\t},\n\n\tparse: function ( text ) {\n\n\t\tconsole.time( 'OBJLoader' );\n\n\t\tvar object, objects = [];\n\t\tvar geometry, material;\n\n\t\tfunction parseVertexIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseNormalIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseUVIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;\n\n\t\t}\n\n\t\tfunction addVertex( a, b, c ) {\n\n\t\t\tgeometry.vertices.push(\n\t\t\t\tvertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],\n\t\t\t\tvertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],\n\t\t\t\tvertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addNormal( a, b, c ) {\n\n\t\t\tgeometry.normals.push(\n\t\t\t\tnormals[ a ], normals[ a + 1 ], normals[ a + 2 ],\n\t\t\t\tnormals[ b ], normals[ b + 1 ], normals[ b + 2 ],\n\t\t\t\tnormals[ c ], normals[ c + 1 ], normals[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addUV( a, b, c ) {\n\n\t\t\tgeometry.uvs.push(\n\t\t\t\tuvs[ a ], uvs[ a + 1 ],\n\t\t\t\tuvs[ b ], uvs[ b + 1 ],\n\t\t\t\tuvs[ c ], uvs[ c + 1 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {\n\n\t\t\tvar ia = parseVertexIndex( a );\n\t\t\tvar ib = parseVertexIndex( b );\n\t\t\tvar ic = parseVertexIndex( c );\n\n\t\t\tif ( d === undefined ) {\n\n\t\t\t\taddVertex( ia, ib, ic );\n\n\t\t\t} else {\n\n\t\t\t\tvar id = parseVertexIndex( d );\n\n\t\t\t\taddVertex( ia, ib, id );\n\t\t\t\taddVertex( ib, ic, id );\n\n\t\t\t}\n\n\t\t\tif ( ua !== undefined ) {\n\n\t\t\t\tvar ia = parseUVIndex( ua );\n\t\t\t\tvar ib = parseUVIndex( ub );\n\t\t\t\tvar ic = parseUVIndex( uc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddUV( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseUVIndex( ud );\n\n\t\t\t\t\taddUV( ia, ib, id );\n\t\t\t\t\taddUV( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif ( na !== undefined ) {\n\n\t\t\t\tvar ia = parseNormalIndex( na );\n\t\t\t\tvar ib = parseNormalIndex( nb );\n\t\t\t\tvar ic = parseNormalIndex( nc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddNormal( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseNormalIndex( nd );\n\n\t\t\t\t\taddNormal( ia, ib, id );\n\t\t\t\t\taddNormal( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\t// create mesh if no objects in text\n\n\t\tif ( /^o /gm.test( text ) === false ) {\n\n\t\t\tgeometry = {\n\t\t\t\tvertices: [],\n\t\t\t\tnormals: [],\n\t\t\t\tuvs: []\n\t\t\t};\n\n\t\t\tmaterial = {\n\t\t\t\tname: ''\n\t\t\t};\n\n\t\t\tobject = {\n\t\t\t\tname: '',\n\t\t\t\tgeometry: geometry,\n\t\t\t\tmaterial: material\n\t\t\t};\n\n\t\t\tobjects.push( object );\n\n\t\t}\n\n\t\tvar vertices = [];\n\t\tvar normals = [];\n\t\tvar uvs = [];\n\n\t\t// v float float float\n\n\t\tvar vertex_pattern = /v( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vn float float float\n\n\t\tvar normal_pattern = /vn( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vt float float\n\n\t\tvar uv_pattern = /vt( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// f vertex vertex vertex ...\n\n\t\tvar face_pattern1 = /f( +-?\\d+)( +-?\\d+)( +-?\\d+)( +-?\\d+)?/;\n\n\t\t// f vertex/uv vertex/uv vertex/uv ...\n\n\t\tvar face_pattern2 = /f( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...\n\n\t\tvar face_pattern3 = /f( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex//normal vertex//normal vertex//normal ...\n\n\t\tvar face_pattern4 = /f( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))?/\n\n\t\t//\n\n\t\tvar lines = text.split( '\\n' );\n\n\t\tfor ( var i = 0; i < lines.length; i ++ ) {\n\n\t\t\tvar line = lines[ i ];\n\t\t\tline = line.trim();\n\n\t\t\tvar result;\n\n\t\t\tif ( line.length === 0 || line.charAt( 0 ) === '#' ) {\n\n\t\t\t\tcontinue;\n\n\t\t\t} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"v 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tvertices.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vn 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tnormals.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vt 0.1 0.2\", \"0.1\", \"0.2\"]\n\n\t\t\t\tuvs.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1 2 3\", \"1\", \"2\", \"3\", undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1 2/2 3/3\", \" 1/1\", \"1\", \"1\", \" 2/2\", \"2\", \"2\", \" 3/3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1/1 2/2/2 3/3/3\", \" 1/1/1\", \"1\", \"1\", \"1\", \" 2/2/2\", \"2\", \"2\", \"2\", \" 3/3/3\", \"3\", \"3\", \"3\", undefined, undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],\n\t\t\t\t\tresult[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],\n\t\t\t\t\tresult[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1//1 2//2 3//3\", \" 1//1\", \"1\", \"1\", \" 2//2\", \"2\", \"2\", \" 3//3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tundefined, undefined, undefined, undefined,\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( /^o /.test( line ) ) {\n\n\t\t\t\tgeometry = {\n\t\t\t\t\tvertices: [],\n\t\t\t\t\tnormals: [],\n\t\t\t\t\tuvs: []\n\t\t\t\t};\n\n\t\t\t\tmaterial = {\n\t\t\t\t\tname: ''\n\t\t\t\t};\n\n\t\t\t\tobject = {\n\t\t\t\t\tname: line.substring( 2 ).trim(),\n\t\t\t\t\tgeometry: geometry,\n\t\t\t\t\tmaterial: material\n\t\t\t\t};\n\n\t\t\t\tobjects.push( object )\n\n\t\t\t} else if ( /^g /.test( line ) ) {\n\n\t\t\t\t// group\n\n\t\t\t} else if ( /^usemtl /.test( line ) ) {\n\n\t\t\t\t// material\n\n\t\t\t\tmaterial.name = line.substring( 7 ).trim();\n\n\t\t\t} else if ( /^mtllib /.test( line ) ) {\n\n\t\t\t\t// mtl file\n\n\t\t\t} else if ( /^s /.test( line ) ) {\n\n\t\t\t\t// smooth shading\n\n\t\t\t} else {\n\n\t\t\t\t// console.log( \"THREE.OBJLoader: Unhandled line \" + line );\n\n\t\t\t}\n\n\t\t}\n\n\t\tvar container = new THREE.Object3D();\n\n\t\tfor ( var i = 0, l = objects.length; i < l; i ++ ) {\n\n\t\t\tvar object = objects[ i ];\n\t\t\tvar geometry = object.geometry;\n\n\t\t\tvar buffergeometry = new THREE.BufferGeometry();\n\n\t\t\tbuffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );\n\n\t\t\tif ( geometry.normals.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );\n\t\t\t}\n\n\t\t\tif ( geometry.uvs.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );\n\t\t\t}\n\n\t\t\tvar material = new THREE.MeshLambertMaterial();\n\t\t\tmaterial.name = object.material.name;\n\n\t\t\tvar mesh = new THREE.Mesh( buffergeometry, material );\n\t\t\tmesh.name = object.name;\n\n\t\t\tcontainer.add( mesh );\n\n\t\t}\n\n\t\tconsole.timeEnd( 'OBJLoader' );\n\n\t\treturn container;\n\n\t}\n\n};\n",
      "mode": "100644",
      "type": "blob"
    },
    "loader.coffee.md": {
      "path": "loader.coffee.md",
      "content": "Loader\n======\n\nLoads voxel models from .obj files\n\n    window.characters = []\n    manager = new THREE.LoadingManager()\n    texture = new THREE.Texture()\n\nBase path to our game's S3 bucket\n\n    BUCKET_PATH = \"https://s3.amazonaws.com/distri-tactics\"\n\nLet us know how far along things are when loading a .obj model.\n\n    onProgress = (xhr) ->\n      if xhr.lengthComputable\n        percentComplete = xhr.loaded / xhr.total * 100\n        console.log \"#{Math.round(percentComplete, 2)}% downloaded\"\n\n    onError = (xhr) ->\n      console.error xhr\n\nWe're sharing the same palette across all of our models.\nLoad up one from an arbitrary model we use.\n\n    do ->\n      loader = new THREE.ImageLoader(manager)\n      loader.crossOrigin = true\n\n      loader.load \"#{BUCKET_PATH}/bartender.png?doot2\", (image) ->\n        texture.image = image\n        texture.needsUpdate = true\n\nLoad a model by name, passing in an optional position.\n\n    module.exports = (name, opts={}) ->\n      position = opts.position\n\n      loader = new THREE.OBJLoader(manager)\n      loader.crossOrigin = true\n      loader.load \"#{BUCKET_PATH}/#{name}.obj?doot2\", (object) ->\n        object.traverse (child) ->\n          if child instanceof THREE.Mesh\n\nApply the color palette texture we loaded above\n\n            child.material.map = texture\n\n          object.position.set position.x, position.y, position.z\n          \nHAX: remove this global characters array. \nIt's used so that the raycaster doesn't have to traverse `scene.children`\n\n          window.characters.push object\n\n          scene.add object\n\n        , onProgress\n        , onError\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Renderer\n========\n\n    require \"./globals\"\n    require \"./lib/obj_renderer\"\n    require \"./event_handlers\"\n\n    ParticleSystem = require \"./particles\"\n\n    util = require \"util\"\n    util.applyStylesheet require(\"./style\")\n\n    map = require(\"./map\")()\n\n    particles = []\n\n    renderer.setSize window.innerWidth, window.innerHeight\n    document.body.appendChild renderer.domElement\n\n    camera.position.set(50, 100, 200)\n    camera.up = new THREE.Vector3(0, 1, 0)\n    camera.lookAt new THREE.Vector3(50, 0, 50)\n\nReturn 1 `probability` percent of the time.\nReturn -1 otherwise\n\n    randomSign = (probability) ->\n      if Math.random() <= probability\n        1\n      else\n        -1\n\n    init = ->\n      addLights()\n\n      map.generateGrid(10)\n      map.populateCharacters()\n\n      particles = ParticleSystem()\n\n      particles.generate\n        number: 100\n        position: new THREE.Vector3(0, 0, 0)\n\n    animate = ->\n      requestAnimationFrame animate\n      render()\n\n    addLights = ->\n      ambient = new THREE.AmbientLight 0x101030\n      scene.add ambient\n\n      directionalLight = new THREE.DirectionalLight 0xffffff\n      directionalLight.position.set 50, 100, 50\n      scene.add directionalLight\n\n    render = ->\n      particles.update (p) ->\n        p.age ||= 0\n        p.age += 1\n\n        p.material.opacity = p.material.opacity - 0.01\n        scene.remove(p) if p.age > 100\n\n        p.position.x += randomSign(0.5)\n        p.position.z += randomSign(0.5)\n\n      renderer.render scene, camera\n\n    init()\n    animate()\n",
      "mode": "100644",
      "type": "blob"
    },
    "map.coffee.md": {
      "path": "map.coffee.md",
      "content": "Map\n===\n\nGenerate a simple map, populating it with a cube floor and characters.\n\n    load = require \"./loader\"\n\n    {Vector3} = THREE\n\n    CUBE_SIZE = 10\n    \n    addCube = (position) ->\n      geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE)\n      material = new THREE.MeshBasicMaterial\n        color: 0xfffff\n        wireframe: true\n\n      cube = new THREE.Mesh geometry, material\n      cube.position.set position.x, position.y, position.z\n      scene.add cube\n\nCreate a basic floor of dimension `size`\n\n    module.exports = ->\n\n      generateGrid: (size) ->\n        [0...size].forEach (x) ->\n          [0...size].forEach (z) ->\n            addCube new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE)\n\n      populateCharacters: ->\n        load \"bartender\",\n          position: new Vector3(0, 0, 0)\n\n        load \"robo_sheriff\",\n          position: new Vector3(10, 0, 0)\n\n        load \"cactus\",\n          position: new Vector3(20, 0, 0)\n\n        load \"arrow\",\n          position: new Vector3(30, 0, 0)\n\n        load \"beam_sword\",\n          position: new Vector3(40, 0, 0)\n\n        load \"branding_iron\",\n          position: new Vector3(50, 0, 0)\n\n        load \"character\",\n          position: new Vector3(60, 0, 0)\n\n        load \"gun\",\n          position: new Vector3(70, 0, 0)\n\n        load \"hoverboard\",\n          position: new Vector3(80, 0, 0)\n\n        load \"jetpack_bandit\",\n          position: new Vector3(90, 0, 0)\n",
      "mode": "100644",
      "type": "blob"
    },
    "particles.coffee.md": {
      "path": "particles.coffee.md",
      "content": "Particles\n=========\n\nEmit voxel particles\n\n    addCube = (position) ->\n      geometry = new THREE.BoxGeometry(1, 1, 1)\n      material = new THREE.MeshBasicMaterial\n        color: 0xfffff\n        transparent: true\n\n      cube = new THREE.Mesh geometry, material\n      cube.position.set position.x, position.y, position.z\n\n      scene.add cube\n\n      cube\n\n    createParticles = (opts={}) ->\n      number = opts.number\n      position = opts.position\n\n      [0...number].map ->\n        addCube(position)\n\n    module.exports = (opts={}) ->\n      particles = null\n\n      generate: (opts={}) ->\n        particles = createParticles\n          number: opts.number\n          position: opts.position\n\n      update: (cb) ->\n        particles?.forEach cb\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.1.0\"\nremoteDependencies: [\n  \"https://cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min.js\"\n]\ndependencies:\n  util: \"distri/util:v0.1.0\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "html, body\n  height: 100%\n  overflow: hidden\n\nbody\n  margin: 0\n",
      "mode": "100644",
      "type": "blob"
    },
    "test/test.coffee": {
      "path": "test/test.coffee",
      "content": "require \"../main\"\n\ndescribe \"renderer\", ->\n  it \"should have THREE\", ->\n    assert THREE.OBJLoader\n",
      "mode": "100644",
      "type": "blob"
    },
    "glow_material.coffee.md": {
      "path": "glow_material.coffee.md",
      "content": "Glow Material\n=============\n\n    module.exports = ->\n      new THREE.ShaderMaterial \n        uniforms:  \n          c:   \n            type: \"f\"\n            value: 1.0\n          p:   \n            type: \"f\"\n            value: 1.4 \n          glowColor: \n            type: \"c\"\n            value: new THREE.Color(0xffff00)\n          viewVector: \n            type: \"v3\"\n            value: camera.position\n        vertexShader: \"\"\"\n          uniform vec3 viewVector;\n          uniform float c;\n          uniform float p;\n          varying float intensity;\n          void main() {\n            vec3 vNormal = normalize( normalMatrix * normal );\n            vec3 vNormel = normalize( normalMatrix * viewVector );\n          \t\n            intensity = pow( c - dot(vNormal, vNormel), p );\n          \t\n            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n          }        \n        \"\"\"\n        fragmentShader: \"\"\"\n          uniform vec3 glowColor;\n          \n          varying float intensity;\n          \n          void main() {\n            vec3 glow = glowColor * intensity;\n            gl_FragColor = vec4( glow, 1.0 );\n          }        \n        \"\"\"\n        side: THREE.FrontSide\n        blending: THREE.AdditiveBlending\n        transparent: true\n    \t",
      "mode": "100644"
    }
  },
  "distribution": {
    "event_handlers": {
      "path": "event_handlers",
      "content": "(function() {\n  var onClick, onKeydown, onWindowResize, projector, raycastDirection, raycaster;\n\n  raycaster = new THREE.Raycaster();\n\n  projector = new THREE.Projector();\n\n  raycastDirection = new THREE.Vector3();\n\n  onWindowResize = function() {\n    camera.aspect = window.innerWidth / window.innerHeight;\n    camera.updateProjectionMatrix();\n    return renderer.setSize(window.innerWidth, window.innerHeight);\n  };\n\n  onKeydown = function(e) {\n    e.preventDefault();\n    switch (e.keyCode) {\n      case 81:\n        return camera.position.x -= 1;\n      case 87:\n        return camera.position.x += 1;\n      case 65:\n        return camera.position.y -= 1;\n      case 83:\n        return camera.position.y += 1;\n      case 90:\n        return camera.position.z -= 1;\n      case 88:\n        return camera.position.z += 1;\n    }\n  };\n\n  onClick = function(e) {\n    var intersects;\n    raycastDirection.x = (e.clientX / window.innerWidth) * 2 - 1;\n    raycastDirection.y = -(e.clientY / window.innerHeight) * 2 + 1;\n    raycastDirection.unproject(camera);\n    raycastDirection.sub(camera.position);\n    raycaster.set(camera.position, raycastDirection.normalize());\n    intersects = raycaster.intersectObjects(window.characters, true);\n    return intersects.forEach(function(intersection) {\n      var position;\n      position = intersection.object.parent.position;\n      camera.position.set(position.x, position.y + 100, position.z + 200);\n      return camera.lookAt(intersection.object.parent.position);\n    });\n  };\n\n  window.addEventListener(\"resize\", onWindowResize, false);\n\n  window.addEventListener(\"click\", onClick, false);\n\n  window.addEventListener(\"keydown\", onKeydown, false);\n\n}).call(this);\n",
      "type": "blob"
    },
    "globals": {
      "path": "globals",
      "content": "(function() {\n  window.renderer = new THREE.WebGLRenderer();\n\n  window.scene = new THREE.Scene();\n\n  window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);\n\n}).call(this);\n",
      "type": "blob"
    },
    "lib/obj_renderer": {
      "path": "lib/obj_renderer",
      "content": "/**\n * @author mrdoob / http://mrdoob.com/\n */\n\nTHREE.OBJLoader = function ( manager ) {\n\n  this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;\n\n};\n\nTHREE.OBJLoader.prototype = {\n\n\tconstructor: THREE.OBJLoader,\n\n\tload: function ( url, onLoad, onProgress, onError ) {\n\n\t\tvar scope = this;\n\n\t\tvar loader = new THREE.XHRLoader( scope.manager );\n\t\tloader.setCrossOrigin( this.crossOrigin );\n\t\tloader.load( url, function ( text ) {\n\n\t\t\tonLoad( scope.parse( text ) );\n\n\t\t}, onProgress, onError );\n\n\t},\n\n\tparse: function ( text ) {\n\n\t\tconsole.time( 'OBJLoader' );\n\n\t\tvar object, objects = [];\n\t\tvar geometry, material;\n\n\t\tfunction parseVertexIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseNormalIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;\n\n\t\t}\n\n\t\tfunction parseUVIndex( value ) {\n\n\t\t\tvar index = parseInt( value );\n\n\t\t\treturn ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;\n\n\t\t}\n\n\t\tfunction addVertex( a, b, c ) {\n\n\t\t\tgeometry.vertices.push(\n\t\t\t\tvertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],\n\t\t\t\tvertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],\n\t\t\t\tvertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addNormal( a, b, c ) {\n\n\t\t\tgeometry.normals.push(\n\t\t\t\tnormals[ a ], normals[ a + 1 ], normals[ a + 2 ],\n\t\t\t\tnormals[ b ], normals[ b + 1 ], normals[ b + 2 ],\n\t\t\t\tnormals[ c ], normals[ c + 1 ], normals[ c + 2 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addUV( a, b, c ) {\n\n\t\t\tgeometry.uvs.push(\n\t\t\t\tuvs[ a ], uvs[ a + 1 ],\n\t\t\t\tuvs[ b ], uvs[ b + 1 ],\n\t\t\t\tuvs[ c ], uvs[ c + 1 ]\n\t\t\t);\n\n\t\t}\n\n\t\tfunction addFace( a, b, c, d,  ua, ub, uc, ud,  na, nb, nc, nd ) {\n\n\t\t\tvar ia = parseVertexIndex( a );\n\t\t\tvar ib = parseVertexIndex( b );\n\t\t\tvar ic = parseVertexIndex( c );\n\n\t\t\tif ( d === undefined ) {\n\n\t\t\t\taddVertex( ia, ib, ic );\n\n\t\t\t} else {\n\n\t\t\t\tvar id = parseVertexIndex( d );\n\n\t\t\t\taddVertex( ia, ib, id );\n\t\t\t\taddVertex( ib, ic, id );\n\n\t\t\t}\n\n\t\t\tif ( ua !== undefined ) {\n\n\t\t\t\tvar ia = parseUVIndex( ua );\n\t\t\t\tvar ib = parseUVIndex( ub );\n\t\t\t\tvar ic = parseUVIndex( uc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddUV( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseUVIndex( ud );\n\n\t\t\t\t\taddUV( ia, ib, id );\n\t\t\t\t\taddUV( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t\tif ( na !== undefined ) {\n\n\t\t\t\tvar ia = parseNormalIndex( na );\n\t\t\t\tvar ib = parseNormalIndex( nb );\n\t\t\t\tvar ic = parseNormalIndex( nc );\n\n\t\t\t\tif ( d === undefined ) {\n\n\t\t\t\t\taddNormal( ia, ib, ic );\n\n\t\t\t\t} else {\n\n\t\t\t\t\tvar id = parseNormalIndex( nd );\n\n\t\t\t\t\taddNormal( ia, ib, id );\n\t\t\t\t\taddNormal( ib, ic, id );\n\n\t\t\t\t}\n\n\t\t\t}\n\n\t\t}\n\n\t\t// create mesh if no objects in text\n\n\t\tif ( /^o /gm.test( text ) === false ) {\n\n\t\t\tgeometry = {\n\t\t\t\tvertices: [],\n\t\t\t\tnormals: [],\n\t\t\t\tuvs: []\n\t\t\t};\n\n\t\t\tmaterial = {\n\t\t\t\tname: ''\n\t\t\t};\n\n\t\t\tobject = {\n\t\t\t\tname: '',\n\t\t\t\tgeometry: geometry,\n\t\t\t\tmaterial: material\n\t\t\t};\n\n\t\t\tobjects.push( object );\n\n\t\t}\n\n\t\tvar vertices = [];\n\t\tvar normals = [];\n\t\tvar uvs = [];\n\n\t\t// v float float float\n\n\t\tvar vertex_pattern = /v( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vn float float float\n\n\t\tvar normal_pattern = /vn( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// vt float float\n\n\t\tvar uv_pattern = /vt( +[\\d|\\.|\\+|\\-|e|E]+)( +[\\d|\\.|\\+|\\-|e|E]+)/;\n\n\t\t// f vertex vertex vertex ...\n\n\t\tvar face_pattern1 = /f( +-?\\d+)( +-?\\d+)( +-?\\d+)( +-?\\d+)?/;\n\n\t\t// f vertex/uv vertex/uv vertex/uv ...\n\n\t\tvar face_pattern2 = /f( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...\n\n\t\tvar face_pattern3 = /f( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))( +(-?\\d+)\\/(-?\\d+)\\/(-?\\d+))?/;\n\n\t\t// f vertex//normal vertex//normal vertex//normal ...\n\n\t\tvar face_pattern4 = /f( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))( +(-?\\d+)\\/\\/(-?\\d+))?/\n\n\t\t//\n\n\t\tvar lines = text.split( '\\n' );\n\n\t\tfor ( var i = 0; i < lines.length; i ++ ) {\n\n\t\t\tvar line = lines[ i ];\n\t\t\tline = line.trim();\n\n\t\t\tvar result;\n\n\t\t\tif ( line.length === 0 || line.charAt( 0 ) === '#' ) {\n\n\t\t\t\tcontinue;\n\n\t\t\t} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"v 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tvertices.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vn 1.0 2.0 3.0\", \"1.0\", \"2.0\", \"3.0\"]\n\n\t\t\t\tnormals.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] ),\n\t\t\t\t\tparseFloat( result[ 3 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"vt 0.1 0.2\", \"0.1\", \"0.2\"]\n\n\t\t\t\tuvs.push(\n\t\t\t\t\tparseFloat( result[ 1 ] ),\n\t\t\t\t\tparseFloat( result[ 2 ] )\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1 2 3\", \"1\", \"2\", \"3\", undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1 2/2 3/3\", \" 1/1\", \"1\", \"1\", \" 2/2\", \"2\", \"2\", \" 3/3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1/1/1 2/2/2 3/3/3\", \" 1/1/1\", \"1\", \"1\", \"1\", \" 2/2/2\", \"2\", \"2\", \"2\", \" 3/3/3\", \"3\", \"3\", \"3\", undefined, undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],\n\t\t\t\t\tresult[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],\n\t\t\t\t\tresult[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]\n\t\t\t\t);\n\n\t\t\t} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {\n\n\t\t\t\t// [\"f 1//1 2//2 3//3\", \" 1//1\", \"1\", \"1\", \" 2//2\", \"2\", \"2\", \" 3//3\", \"3\", \"3\", undefined, undefined, undefined]\n\n\t\t\t\taddFace(\n\t\t\t\t\tresult[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],\n\t\t\t\t\tundefined, undefined, undefined, undefined,\n\t\t\t\t\tresult[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]\n\t\t\t\t);\n\n\t\t\t} else if ( /^o /.test( line ) ) {\n\n\t\t\t\tgeometry = {\n\t\t\t\t\tvertices: [],\n\t\t\t\t\tnormals: [],\n\t\t\t\t\tuvs: []\n\t\t\t\t};\n\n\t\t\t\tmaterial = {\n\t\t\t\t\tname: ''\n\t\t\t\t};\n\n\t\t\t\tobject = {\n\t\t\t\t\tname: line.substring( 2 ).trim(),\n\t\t\t\t\tgeometry: geometry,\n\t\t\t\t\tmaterial: material\n\t\t\t\t};\n\n\t\t\t\tobjects.push( object )\n\n\t\t\t} else if ( /^g /.test( line ) ) {\n\n\t\t\t\t// group\n\n\t\t\t} else if ( /^usemtl /.test( line ) ) {\n\n\t\t\t\t// material\n\n\t\t\t\tmaterial.name = line.substring( 7 ).trim();\n\n\t\t\t} else if ( /^mtllib /.test( line ) ) {\n\n\t\t\t\t// mtl file\n\n\t\t\t} else if ( /^s /.test( line ) ) {\n\n\t\t\t\t// smooth shading\n\n\t\t\t} else {\n\n\t\t\t\t// console.log( \"THREE.OBJLoader: Unhandled line \" + line );\n\n\t\t\t}\n\n\t\t}\n\n\t\tvar container = new THREE.Object3D();\n\n\t\tfor ( var i = 0, l = objects.length; i < l; i ++ ) {\n\n\t\t\tvar object = objects[ i ];\n\t\t\tvar geometry = object.geometry;\n\n\t\t\tvar buffergeometry = new THREE.BufferGeometry();\n\n\t\t\tbuffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );\n\n\t\t\tif ( geometry.normals.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );\n\t\t\t}\n\n\t\t\tif ( geometry.uvs.length > 0 ) {\n\t\t\t\tbuffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );\n\t\t\t}\n\n\t\t\tvar material = new THREE.MeshLambertMaterial();\n\t\t\tmaterial.name = object.material.name;\n\n\t\t\tvar mesh = new THREE.Mesh( buffergeometry, material );\n\t\t\tmesh.name = object.name;\n\n\t\t\tcontainer.add( mesh );\n\n\t\t}\n\n\t\tconsole.timeEnd( 'OBJLoader' );\n\n\t\treturn container;\n\n\t}\n\n};\n",
      "type": "blob"
    },
    "loader": {
      "path": "loader",
      "content": "(function() {\n  var BUCKET_PATH, manager, onError, onProgress, texture;\n\n  window.characters = [];\n\n  manager = new THREE.LoadingManager();\n\n  texture = new THREE.Texture();\n\n  BUCKET_PATH = \"https://s3.amazonaws.com/distri-tactics\";\n\n  onProgress = function(xhr) {\n    var percentComplete;\n    if (xhr.lengthComputable) {\n      percentComplete = xhr.loaded / xhr.total * 100;\n      return console.log(\"\" + (Math.round(percentComplete, 2)) + \"% downloaded\");\n    }\n  };\n\n  onError = function(xhr) {\n    return console.error(xhr);\n  };\n\n  (function() {\n    var loader;\n    loader = new THREE.ImageLoader(manager);\n    loader.crossOrigin = true;\n    return loader.load(\"\" + BUCKET_PATH + \"/bartender.png?doot2\", function(image) {\n      texture.image = image;\n      return texture.needsUpdate = true;\n    });\n  })();\n\n  module.exports = function(name, opts) {\n    var loader, position;\n    if (opts == null) {\n      opts = {};\n    }\n    position = opts.position;\n    loader = new THREE.OBJLoader(manager);\n    loader.crossOrigin = true;\n    return loader.load(\"\" + BUCKET_PATH + \"/\" + name + \".obj?doot2\", function(object) {\n      return object.traverse(function(child) {\n        if (child instanceof THREE.Mesh) {\n          child.material.map = texture;\n        }\n        object.position.set(position.x, position.y, position.z);\n        window.characters.push(object);\n        return scene.add(object);\n      }, onProgress, onError);\n    });\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var ParticleSystem, addLights, animate, init, map, particles, randomSign, render, util;\n\n  require(\"./globals\");\n\n  require(\"./lib/obj_renderer\");\n\n  require(\"./event_handlers\");\n\n  ParticleSystem = require(\"./particles\");\n\n  util = require(\"util\");\n\n  util.applyStylesheet(require(\"./style\"));\n\n  map = require(\"./map\")();\n\n  particles = [];\n\n  renderer.setSize(window.innerWidth, window.innerHeight);\n\n  document.body.appendChild(renderer.domElement);\n\n  camera.position.set(50, 100, 200);\n\n  camera.up = new THREE.Vector3(0, 1, 0);\n\n  camera.lookAt(new THREE.Vector3(50, 0, 50));\n\n  randomSign = function(probability) {\n    if (Math.random() <= probability) {\n      return 1;\n    } else {\n      return -1;\n    }\n  };\n\n  init = function() {\n    addLights();\n    map.generateGrid(10);\n    map.populateCharacters();\n    particles = ParticleSystem();\n    return particles.generate({\n      number: 100,\n      position: new THREE.Vector3(0, 0, 0)\n    });\n  };\n\n  animate = function() {\n    requestAnimationFrame(animate);\n    return render();\n  };\n\n  addLights = function() {\n    var ambient, directionalLight;\n    ambient = new THREE.AmbientLight(0x101030);\n    scene.add(ambient);\n    directionalLight = new THREE.DirectionalLight(0xffffff);\n    directionalLight.position.set(50, 100, 50);\n    return scene.add(directionalLight);\n  };\n\n  render = function() {\n    particles.update(function(p) {\n      p.age || (p.age = 0);\n      p.age += 1;\n      p.material.opacity = p.material.opacity - 0.01;\n      if (p.age > 100) {\n        scene.remove(p);\n      }\n      p.position.x += randomSign(0.5);\n      return p.position.z += randomSign(0.5);\n    });\n    return renderer.render(scene, camera);\n  };\n\n  init();\n\n  animate();\n\n}).call(this);\n",
      "type": "blob"
    },
    "map": {
      "path": "map",
      "content": "(function() {\n  var CUBE_SIZE, Vector3, addCube, load;\n\n  load = require(\"./loader\");\n\n  Vector3 = THREE.Vector3;\n\n  CUBE_SIZE = 10;\n\n  addCube = function(position) {\n    var cube, geometry, material;\n    geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);\n    material = new THREE.MeshBasicMaterial({\n      color: 0xfffff,\n      wireframe: true\n    });\n    cube = new THREE.Mesh(geometry, material);\n    cube.position.set(position.x, position.y, position.z);\n    return scene.add(cube);\n  };\n\n  module.exports = function() {\n    return {\n      generateGrid: function(size) {\n        var _i, _results;\n        return (function() {\n          _results = [];\n          for (var _i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--){ _results.push(_i); }\n          return _results;\n        }).apply(this).forEach(function(x) {\n          var _i, _results;\n          return (function() {\n            _results = [];\n            for (var _i = 0; 0 <= size ? _i < size : _i > size; 0 <= size ? _i++ : _i--){ _results.push(_i); }\n            return _results;\n          }).apply(this).forEach(function(z) {\n            return addCube(new Vector3(x * CUBE_SIZE, -5, z * CUBE_SIZE));\n          });\n        });\n      },\n      populateCharacters: function() {\n        load(\"bartender\", {\n          position: new Vector3(0, 0, 0)\n        });\n        load(\"robo_sheriff\", {\n          position: new Vector3(10, 0, 0)\n        });\n        load(\"cactus\", {\n          position: new Vector3(20, 0, 0)\n        });\n        load(\"arrow\", {\n          position: new Vector3(30, 0, 0)\n        });\n        load(\"beam_sword\", {\n          position: new Vector3(40, 0, 0)\n        });\n        load(\"branding_iron\", {\n          position: new Vector3(50, 0, 0)\n        });\n        load(\"character\", {\n          position: new Vector3(60, 0, 0)\n        });\n        load(\"gun\", {\n          position: new Vector3(70, 0, 0)\n        });\n        load(\"hoverboard\", {\n          position: new Vector3(80, 0, 0)\n        });\n        return load(\"jetpack_bandit\", {\n          position: new Vector3(90, 0, 0)\n        });\n      }\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "particles": {
      "path": "particles",
      "content": "(function() {\n  var addCube, createParticles;\n\n  addCube = function(position) {\n    var cube, geometry, material;\n    geometry = new THREE.BoxGeometry(1, 1, 1);\n    material = new THREE.MeshBasicMaterial({\n      color: 0xfffff,\n      transparent: true\n    });\n    cube = new THREE.Mesh(geometry, material);\n    cube.position.set(position.x, position.y, position.z);\n    scene.add(cube);\n    return cube;\n  };\n\n  createParticles = function(opts) {\n    var number, position, _i, _results;\n    if (opts == null) {\n      opts = {};\n    }\n    number = opts.number;\n    position = opts.position;\n    return (function() {\n      _results = [];\n      for (var _i = 0; 0 <= number ? _i < number : _i > number; 0 <= number ? _i++ : _i--){ _results.push(_i); }\n      return _results;\n    }).apply(this).map(function() {\n      return addCube(position);\n    });\n  };\n\n  module.exports = function(opts) {\n    var particles;\n    if (opts == null) {\n      opts = {};\n    }\n    particles = null;\n    return {\n      generate: function(opts) {\n        if (opts == null) {\n          opts = {};\n        }\n        return particles = createParticles({\n          number: opts.number,\n          position: opts.position\n        });\n      },\n      update: function(cb) {\n        return particles != null ? particles.forEach(cb) : void 0;\n      }\n    };\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.1.0\",\"remoteDependencies\":[\"https://cdnjs.cloudflare.com/ajax/libs/three.js/r69/three.min.js\"],\"dependencies\":{\"util\":\"distri/util:v0.1.0\"}};",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"html,\\nbody {\\n  height: 100%;\\n  overflow: hidden;\\n}\\n\\nbody {\\n  margin: 0;\\n}\";",
      "type": "blob"
    },
    "test/test": {
      "path": "test/test",
      "content": "(function() {\n  require(\"../main\");\n\n  describe(\"renderer\", function() {\n    return it(\"should have THREE\", function() {\n      return assert(THREE.OBJLoader);\n    });\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "glow_material": {
      "path": "glow_material",
      "content": "(function() {\n  module.exports = function() {\n    return new THREE.ShaderMaterial({\n      uniforms: {\n        c: {\n          type: \"f\",\n          value: 1.0\n        },\n        p: {\n          type: \"f\",\n          value: 1.4\n        },\n        glowColor: {\n          type: \"c\",\n          value: new THREE.Color(0xffff00)\n        },\n        viewVector: {\n          type: \"v3\",\n          value: camera.position\n        }\n      },\n      vertexShader: \"uniform vec3 viewVector;\\nuniform float c;\\nuniform float p;\\nvarying float intensity;\\nvoid main() {\\n  vec3 vNormal = normalize( normalMatrix * normal );\\n  vec3 vNormel = normalize( normalMatrix * viewVector );\\n\t\\n  intensity = pow( c - dot(vNormal, vNormel), p );\\n\t\\n  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\\n}        \",\n      fragmentShader: \"uniform vec3 glowColor;\\n\\nvarying float intensity;\\n\\nvoid main() {\\n  vec3 glow = glowColor * intensity;\\n  gl_FragColor = vec4( glow, 1.0 );\\n}        \",\n      side: THREE.FrontSide,\n      blending: THREE.AdditiveBlending,\n      transparent: true\n    });\n  };\n\n}).call(this);\n",
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
  "dependencies": {
    "util": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "mode": "100644",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "mode": "100644",
          "content": "util\n====\n\nSmall utility methods for JS\n",
          "type": "blob"
        },
        "main.coffee.md": {
          "path": "main.coffee.md",
          "mode": "100644",
          "content": "Util\n====\n\n    module.exports =\n      approach: (current, target, amount) ->\n        (target - current).clamp(-amount, amount) + current\n\nApply a stylesheet idempotently.\n\n      applyStylesheet: (style, id=\"primary\") ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n        styleNode.id = id\n\n        if previousStyleNode = document.head.querySelector(\"style##{id}\")\n          previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n        document.head.appendChild(styleNode)\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "mode": "100644",
          "content": "version: \"0.1.0\"\n",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    approach: function(current, target, amount) {\n      return (target - current).clamp(-amount, amount) + current;\n    },\n    applyStylesheet: function(style, id) {\n      var previousStyleNode, styleNode;\n      if (id == null) {\n        id = \"primary\";\n      }\n      styleNode = document.createElement(\"style\");\n      styleNode.innerHTML = style;\n      styleNode.id = id;\n      if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n        previousStyleNode.parentNode.removeChild(prevousStyleNode);\n      }\n      return document.head.appendChild(styleNode);\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.1.0\"};",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://strd6.github.io/editor/"
      },
      "version": "0.1.0",
      "entryPoint": "main",
      "repository": {
        "id": 18501018,
        "name": "util",
        "full_name": "distri/util",
        "owner": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "private": false,
        "html_url": "https://github.com/distri/util",
        "description": "Small utility methods for JS",
        "fork": false,
        "url": "https://api.github.com/repos/distri/util",
        "forks_url": "https://api.github.com/repos/distri/util/forks",
        "keys_url": "https://api.github.com/repos/distri/util/keys{/key_id}",
        "collaborators_url": "https://api.github.com/repos/distri/util/collaborators{/collaborator}",
        "teams_url": "https://api.github.com/repos/distri/util/teams",
        "hooks_url": "https://api.github.com/repos/distri/util/hooks",
        "issue_events_url": "https://api.github.com/repos/distri/util/issues/events{/number}",
        "events_url": "https://api.github.com/repos/distri/util/events",
        "assignees_url": "https://api.github.com/repos/distri/util/assignees{/user}",
        "branches_url": "https://api.github.com/repos/distri/util/branches{/branch}",
        "tags_url": "https://api.github.com/repos/distri/util/tags",
        "blobs_url": "https://api.github.com/repos/distri/util/git/blobs{/sha}",
        "git_tags_url": "https://api.github.com/repos/distri/util/git/tags{/sha}",
        "git_refs_url": "https://api.github.com/repos/distri/util/git/refs{/sha}",
        "trees_url": "https://api.github.com/repos/distri/util/git/trees{/sha}",
        "statuses_url": "https://api.github.com/repos/distri/util/statuses/{sha}",
        "languages_url": "https://api.github.com/repos/distri/util/languages",
        "stargazers_url": "https://api.github.com/repos/distri/util/stargazers",
        "contributors_url": "https://api.github.com/repos/distri/util/contributors",
        "subscribers_url": "https://api.github.com/repos/distri/util/subscribers",
        "subscription_url": "https://api.github.com/repos/distri/util/subscription",
        "commits_url": "https://api.github.com/repos/distri/util/commits{/sha}",
        "git_commits_url": "https://api.github.com/repos/distri/util/git/commits{/sha}",
        "comments_url": "https://api.github.com/repos/distri/util/comments{/number}",
        "issue_comment_url": "https://api.github.com/repos/distri/util/issues/comments/{number}",
        "contents_url": "https://api.github.com/repos/distri/util/contents/{+path}",
        "compare_url": "https://api.github.com/repos/distri/util/compare/{base}...{head}",
        "merges_url": "https://api.github.com/repos/distri/util/merges",
        "archive_url": "https://api.github.com/repos/distri/util/{archive_format}{/ref}",
        "downloads_url": "https://api.github.com/repos/distri/util/downloads",
        "issues_url": "https://api.github.com/repos/distri/util/issues{/number}",
        "pulls_url": "https://api.github.com/repos/distri/util/pulls{/number}",
        "milestones_url": "https://api.github.com/repos/distri/util/milestones{/number}",
        "notifications_url": "https://api.github.com/repos/distri/util/notifications{?since,all,participating}",
        "labels_url": "https://api.github.com/repos/distri/util/labels{/name}",
        "releases_url": "https://api.github.com/repos/distri/util/releases{/id}",
        "created_at": "2014-04-06T22:42:56Z",
        "updated_at": "2014-04-06T22:42:56Z",
        "pushed_at": "2014-04-06T22:42:56Z",
        "git_url": "git://github.com/distri/util.git",
        "ssh_url": "git@github.com:distri/util.git",
        "clone_url": "https://github.com/distri/util.git",
        "svn_url": "https://github.com/distri/util",
        "homepage": null,
        "size": 0,
        "stargazers_count": 0,
        "watchers_count": 0,
        "language": null,
        "has_issues": true,
        "has_downloads": true,
        "has_wiki": true,
        "forks_count": 0,
        "mirror_url": null,
        "open_issues_count": 0,
        "forks": 0,
        "open_issues": 0,
        "watchers": 0,
        "default_branch": "master",
        "master_branch": "master",
        "permissions": {
          "admin": true,
          "push": true,
          "pull": true
        },
        "organization": {
          "login": "distri",
          "id": 6005125,
          "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
          "gravatar_id": "192f3f168409e79c42107f081139d9f3",
          "url": "https://api.github.com/users/distri",
          "html_url": "https://github.com/distri",
          "followers_url": "https://api.github.com/users/distri/followers",
          "following_url": "https://api.github.com/users/distri/following{/other_user}",
          "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
          "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
          "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
          "organizations_url": "https://api.github.com/users/distri/orgs",
          "repos_url": "https://api.github.com/users/distri/repos",
          "events_url": "https://api.github.com/users/distri/events{/privacy}",
          "received_events_url": "https://api.github.com/users/distri/received_events",
          "type": "Organization",
          "site_admin": false
        },
        "network_count": 0,
        "subscribers_count": 2,
        "branch": "v0.1.0",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});