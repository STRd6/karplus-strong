(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

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
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
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
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
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
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
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

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2016 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "# karplus-strong\nPlucked string synthesis\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "context = new AudioContext\n\nstyle = document.createElement 'style'\nstyle.innerText = require \"./style\"\ndocument.body.appendChild(style)\n\n# http://stackoverflow.com/a/14487961/68210\npluck = (context, frequency=220, impulseDuration=0.01) ->\n  impulseSamples = impulseDuration * context.sampleRate\n\n  node = context.createScriptProcessor(4096, 0, 1)\n  N = Math.round(context.sampleRate / frequency)\n  y = new Float32Array(N)\n  n = 0\n\n  node.onaudioprocess = (e) ->\n    output = e.outputBuffer.getChannelData(0)\n    output.forEach (_, i) ->\n      impulseSamples -= 1\n      xn = if impulseSamples >= 0\n        2 * Math.random() - 1\n      else \n        0\n\n      y[n] = xn + (y[n] + y[(n + 1) % N]) / 2.02\n\n      output[i] = y[n]\n\n      n += 1\n      n = 0 if n >= N\n\n  node.connect(context.destination)\n  setTimeout ->\n    node.disconnect(context.destination)\n  , 10000\n\ndocument.addEventListener \"mousedown\", (e) ->\n  frequency = (1 + e.pageX / document.body.clientWidth) * 220\n  impulseDuration = (1 - e.pageY / document.body.clientHeight) * 0.025\n\n  pluck(context, frequency, impulseDuration)\n",
      "mode": "100644"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "body\n  height: 100%\n  margin: 0\n\nhtml\n  height: 100%\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var context, pluck, style;\n\n  context = new AudioContext;\n\n  style = document.createElement('style');\n\n  style.innerText = require(\"./style\");\n\n  document.body.appendChild(style);\n\n  pluck = function(context, frequency, impulseDuration) {\n    var N, impulseSamples, n, node, y;\n    if (frequency == null) {\n      frequency = 220;\n    }\n    if (impulseDuration == null) {\n      impulseDuration = 0.01;\n    }\n    impulseSamples = impulseDuration * context.sampleRate;\n    node = context.createScriptProcessor(4096, 0, 1);\n    N = Math.round(context.sampleRate / frequency);\n    y = new Float32Array(N);\n    n = 0;\n    node.onaudioprocess = function(e) {\n      var output;\n      output = e.outputBuffer.getChannelData(0);\n      return output.forEach(function(_, i) {\n        var xn;\n        impulseSamples -= 1;\n        xn = impulseSamples >= 0 ? 2 * Math.random() - 1 : 0;\n        y[n] = xn + (y[n] + y[(n + 1) % N]) / 2.02;\n        output[i] = y[n];\n        n += 1;\n        if (n >= N) {\n          return n = 0;\n        }\n      });\n    };\n    node.connect(context.destination);\n    return setTimeout(function() {\n      return node.disconnect(context.destination);\n    }, 10000);\n  };\n\n  document.addEventListener(\"mousedown\", function(e) {\n    var frequency, impulseDuration;\n    frequency = (1 + e.pageX / document.body.clientWidth) * 220;\n    impulseDuration = (1 - e.pageY / document.body.clientHeight) * 0.025;\n    return pluck(context, frequency, impulseDuration);\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"body {\\n  height: 100%;\\n  margin: 0;\\n}\\nhtml {\\n  height: 100%;\\n}\\n\";",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/karplus-strong",
    "homepage": null,
    "description": "Plucked string synthesis",
    "html_url": "https://github.com/STRd6/karplus-strong",
    "url": "https://api.github.com/repos/STRd6/karplus-strong",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});