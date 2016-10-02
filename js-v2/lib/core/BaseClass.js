;(function(global){


var _instance = {
    classes: {}
}

var main = function(){
    _instance = new Instance(_instance);
    BaseClass.instance = _instance;

    _instance.add(BaseClass)
    _instance.add('ProxyClass', _ProxyClass)

    global.INSTANCE = _instance.proxy();
    global.IAPP = _instance.InstanceCreator;
}

var mixHandler = function(...mixins){

    // console.log('Mixing', mixins)
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

var doneProxySymbol = Symbol('proxyComplete');


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
        this.targets = {}
        if(data !== undefined) {
            for(var key in data) {
                this[key] = data[key]
            }
        }
    }

    get instance() {
        return _instance
    }



    get _(){
        return this._last;
    }

    set _(oTarget) {
        this._last = oTarget;
        var name = oTarget.name;
        var target = this.targets[name]

        if(!target){
            this.targets[name] = doneProxySymbol;
            console.info('Apply Instance definition:', oTarget.name)

            var d = oTarget.prototype.__declare__.call(oTarget, oTarget);
            if(d && d.global === true) {
                console.info('globalising:', oTarget.name)
                window[oTarget.name] = oTarget;
            };

            _instance.add(oTarget.name, oTarget)
        };

        return true;
    };

    add(key, data){
        /* add a key of data to the instance*/
        if(data === undefined) {
            data = key;
            key = data.name;
        }

        // debugger
        this.log('add', key)
        var f = data.prototype && data.prototype.__assets__;
        if(f !== undefined) {
            var assets = data.prototype.__assets__.call(data);
            if(assets != undefined) {
                this.loadAssets(assets, data, key)
            }
        };

        this.instance[key] = data;
        return this.instance[key] == data;
    }

    loadAssets(assets, originator, name) {
        if(assetLoader != undefined) {
            console.log('Loading assets for:', name, assets)
            assetLoader.append(assets)
        }
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


class ProxyClass extends mix(BaseClass, LogMixin){

    constructor(){
        super()
        return this.init.apply(this, arguments)
    }

    __declare__(klass) {
        log('__declare__', this.name, klass.name)
    }

    __assets__() {
        /* return assets to load through the global assetLoader.
        return any valid type acceptable for assetLoader.require() */
        return undefined // []
    }
}


var _ProxyClass = new Proxy(ProxyClass, {
  get: function (oTarget, sKey) {
    return oTarget[sKey] || undefined;
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
