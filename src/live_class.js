var Constructor = (function() {

  if (typeof Object.create !== 'function') {
    Object.create = function (o) {
      function F() {}
      F.prototype = o
      return new F()
    }
  }

  function Constructor(klass) {
    var proto = klass.prototype
    
    var propertyName
      , publicProto = {}
      , privateProto = {}

    function bindSelfArg(fn) {
      return function() {
        return fn.apply(publicProto, [privateProto].concat([].slice.call(arguments)))
      }
    } 

    for(propertyName in proto) {
      if(proto.hasOwnProperty(propertyName)) {
        if(typeof proto[propertyName] === "function") {
          proto[propertyName] = bindSelfArg(proto[propertyName], privateProto)
        }
        if(propertyName.charAt(0) === "_") {
          privateProto[propertyName.slice(1)] = proto[propertyName]
        } else {
          publicProto[propertyName] = proto[propertyName]
        }
      }
    }

    var constructor = function() {
      var publicProperties = Object.create(publicProto)  
      var privateProperties = Object.create(privateProto)

      publicProperties.monkeyRun = function(fn) {
        fn.apply(publicProperties, [privateProperties].concat([].slice.call(arguments)))
      }  

      publicProperties.monkeyPatch = function(name, fn) {
        publicProperties[name] = function() {
          fn.apply(publicProperties, [privateProperties].concat([].slice.call(arguments)))
        }
      } 

      var context = klass.apply(publicProperties, [privateProperties].concat([].slice.call(arguments)))

      return typeof context === "object" 
        ? context 
        : publicProperties
    }

    constructor.monkeyPatch = function(name, fn) {
      publicProto[name] = function() {
        fn.apply(publicProto, [privateProto].concat([].slice.call(arguments)))
      }
    } 
    return constructor
  }

  return Constructor
}())
