function Constructor(klass) {
  var propertyName
    , publicProperties = {}
    , privateProperties = {}

  for(propertyName in klass.prototype) {
    if(klass.prototype.hasOwnProperty(propertyName)) {
      if(typeof klass.prototype[propertyName] === "function") {
        klass.prototype[propertyName] = bindSelfArg(klass.prototype[propertyName], privateProperties)
      }
      if(propertyName.charAt(0) === "_") {
        privateProperties[propertyName.slice(1)] = klass.prototype[propertyName]
      } else {
        publicProperties[propertyName] = klass.prototype[propertyName]
        privateProperties[propertyName] = klass.prototype[propertyName]
      }
    }
  }

  publicProperties.monkeyRun = function(fn) {
    fn.apply(publicProperties, [privateProperties].concat([].slice.call(arguments)))
  }

  publicProperties.instanceMonkeyPatch = function(name, fn) {
    publicProperties[name] = function() {
      fn.apply(publicProperties, [privateProperties].concat([].slice.call(arguments)))
    }
  }

  return function() {
    var context = klass.apply(publicProperties, [privateProperties].concat([].slice.call(arguments)))
    return typeof context === "object" 
      ? context 
      : publicProperties
  }
}

function bindSelfArg(fn, bindTo) {
  return function() {
    return fn.apply(this, [bindTo].concat([].slice.call(arguments)))
  }
}
