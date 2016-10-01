;(function(global){


var _instance = {
    classes: {}
}

var main = function(){
    _instance = new Instance(_instance);
    BaseClass.instance = _instance;

    _instance.add(BaseClass)
    _instance.add('ProxyClass', ProxyClass)

    global.INSTANCE = _instance.proxy();
    global.IAPP = _instance.InstanceCreator;
}

var mixHandler = function(...mixins){

    console.log('Mixing', mixins)
    for (var i = 0; i < mixins.length; i++) {
        if(mixins[i] == undefined) {

            console.warn('Mixin index', i, 'is undefined')
            return
        }
        var name = mixins[i].name

        if(_instance.classes[name] == undefined) {
            _instance.classes[name] = mixins[i]
        }
    }
}

mix.addHandler(mixHandler)


// ---------------------------------------------
//


class BaseClass {

    get instance(){
        return _instance;
    }
}


class LogMixin {

    log() {
        /*print to a renderer*/
        let n = this.constructor.name;
        let fn = `%c ${n} `
        var v = [fn, 'background: #DDD; color: #333'];
        for (var i = 0; i < arguments.length; i++) {
            v.push(arguments[i])
        }

        console.log.apply(console, v)
    }
}


class Instance extends mix(BaseClass, LogMixin) {

    constructor(data){

        super()
        this.classes = {};

        if(data !== undefined) {
            for(var key in data) {
                this[key] = data[key]
            }
        }
    }

    get instance() {
        return _instance
    }

    add(key, data){
        /* add a key of data to the instance*/
        if(data === undefined) {
            data = key;
            key = data.name;
        }

        // debugger
        this.log('add', key)
        this.instance[key] = data;
        return this.instance[key] == data;
    }

    proxy(){

        var handler = {
            get: function(target, name){
                if(!(name in target)) {
                    return target.classes[name]
                }

                return target[name]
            }
        };

        var p = new Proxy(this, handler);
        return p;
    }
}


class MetaClass extends Instance {

    constructor(){
        //super()
        super()
        console.log('ProxyClass Super', this.constructor.name)
        return this.init.apply(this, arguments)
    }

    static __declare__(klass) {
        log('__declare__', klass.name)
    }

    init() {}
}

var doneProxySymbol = Symbol('proxyComplete');

var ProxyClass = new Proxy(MetaClass, {
  get: function (oTarget, sKey) {
    if(!oTarget[doneProxySymbol]){
        oTarget[doneProxySymbol] = doneProxySymbol;
        console.log('!get', sKey, oTarget.name);
        oTarget.__declare__(oTarget)
        _instance.add(oTarget.name, oTarget)
    };

    return oTarget[sKey] || oTarget.getItem(sKey) || undefined;
  }/*,
  set: function (oTarget, sKey, vValue) {
    console.log('set')
    if (sKey in oTarget) { return false; }
    return oTarget.setItem(sKey, vValue);
  },
  deleteProperty: function (oTarget, sKey) {
    console.log('deleteProperty')
    if (sKey in oTarget) { return false; }
    return oTarget.removeItem(sKey);
  },
  enumerate: function (oTarget, sKey) {
    console.log('enumerate')
    return oTarget.keys();
  },
  ownKeys: function (oTarget, sKey) {
    console.log('ownKeys')
    return oTarget.keys();
  },
  has: function (oTarget, sKey) {
    console.log('has')
    return sKey in oTarget || oTarget.hasItem(sKey);
  },
  defineProperty: function (oTarget, sKey, oDesc) {
    console.log('defineProperty')
    if (oDesc && "value" in oDesc) { oTarget.setItem(sKey, oDesc.value); }
    return oTarget;
  },
  getOwnPropertyDescriptor: function (oTarget, sKey) {
    console.log('getOwnPropertyDescriptor')
    var vValue = oTarget.getItem(sKey);
    return vValue ? {
      value: vValue,
      writable: true,
      enumerable: true,
      configurable: false
    } : undefined;
  },*/
});

main()

})(window)
