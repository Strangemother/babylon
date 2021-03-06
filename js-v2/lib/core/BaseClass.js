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

var doneProxySymbol = Symbol('proxyComplete');


class BaseClass {
    __init__(){
        console.log('BaseClass:', this.constructor.name)
    }

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

        // console.log.apply(console, v)
    }
}


class Instance extends mix(BaseClass, LogMixin) {

    __init__(data){

        super.__init__()

        console.log('Instance constructor')
        this.classes = {};
        this._classes = {};
        this.targets = {};
        this._mutators = {};

        this.symbol = Symbol('Instance')

        if(data !== undefined) {
            for(var key in data) {
                this[key] = data[key]
            }
        }


        // dict of methods for peoxy bypass of this.
        this._overloadMap = {};
    }

    get instance() {
        return _instance
    }

    get _(){
        return this.proxyFunc('classes', this)
    }

    set _(oTarget) {
        this.applyClass(oTarget)
    };

    applyClass(oTarget, parent, key, decentChain) {
        this._last = oTarget;
        var name = oTarget.name;
        var target = this.targets[name]

        if(!target){
            this.targets[name] = doneProxySymbol;
            // console.info('Apply Instance definition:', oTarget.name)

            if(oTarget.prototype.__declare__) {
                var d = oTarget.prototype.__declare__.call(oTarget, oTarget);
                if(d && d.global === true) {
                    console.info('globalising:', oTarget.name)
                    window[oTarget.name] = oTarget;
                };
            }

            _instance.add(oTarget.name, oTarget, parent, key, decentChain)
        };

        return true;
    }

    makeMutator(MutatorClass, key, instance, name, scene, _id, config) {
        console.log( 'makeMutator', key, name, _id, config)
        var m = new MutatorClass()
        return m;
    }

    callMutator(pluginConfig, mutator, key, instance, name, scene, _id, config) {
        console.log( 'callMutator', key, name, _id, config)

        debugger;
        var r = mutator;

        if(r == undefined) r = config;
        return r;
    }

    callPlugins(instance, name, config) {
        // scene, _id

        var klass = instance.constructor;
        var klassName = klass.name;
        var keys = Object.keys(config);
        var pluginsConfig = config || {}, v;

        console.log('!! Calling plugins for', klassName, name);

        return pluginsConfig
    }

    xcallPlugins(instance, name, config) {

        return

        for (var i = keys.length - 1; i >= 0; i--) {
            var key = keys[i];
            if(key in I.classes.mutators) {
                var MutatorClass = I.classes.mutators[key];
                var mutator = this._mutators[key];

                console.log('found existing mutator - Instance:', mutator != undefined)
                if(mutator === undefined) {
                    console.log('making mutator:', key, klassName)
                    mutator = this.makeMutator(MutatorClass, key, instance, name, scene, _id, config)
                };

                pluginsConfig = this.callMutator(pluginsConfig, mutator, key, instance, name, scene, _id, config)
            }
        }

        debugger;

        for (var i = keys.length - 1; i >= 0; i--) {
            var key = keys[i];
            if(key in I.classes.mutators) {
                var mutator = this._mutators[key];

                if(mutator === undefined) {
                    console.log('making mutator:', key, klassName)
                    mutator = this._mutators[key] = new Proxy({
                        classes: I.classes.mutators
                        , key: key
                        , _classes: {}
                    }, {
                        get: function(target, key, prox){
                            debugger
                            if(!target._classes) {
                                for(var k in target.classes) {
                                    target._classes[k] = new target.classes[k]
                                }
                            }

                            for(var k in target._classes) {
                                v = target._classes[k][name](pluginsConfig, _id, scene, instance);
                            }
                            // new (this.classes.mutators[key]);
                        }
                    })
                };

                var f = mutator[name] || (mutator.classes) ? mutator.classes[key]: undefined
                if(f == undefined) {
                  console.log('undefined mutator', name, klassName)
                } else {
                  v = f[name](pluginsConfig, _id, scene, instance);
                }


                if(v !== undefined) {
                    pluginsConfig = v
                }
            }
        }

        return pluginsConfig
    }

    resolveChain(proxyChain, key, setValue) {

        let parent = proxyChain;
        let keys =  []

        while(parent != this) {
            keys.push(parent.key);
            parent = parent.parent;
        };

        parent = this;

        for (var i = keys.length - 1; i >= 0; i--) {
            var dkey = keys[i];
            if(parent[dkey] == undefined) {
                parent[dkey] = {}
                console.warn('cannot find key in instance:', dkey)
            }

            parent = parent[dkey]
        };

        var _keys = ([key].concat(keys)).reverse()
        if(setValue !== undefined && key != undefined) {
            if( isClass(setValue) ) {
                this.applyClass(setValue, parent, key, _keys)
            } else {
                parent[key] = setValue;
            }

        }

        return {}
    }

    proxyFunc(key, p){


        var self = this;
        var d = { parent: p, accessors: {}, key: key };

        return new Proxy(d, {
            set: function(t, k, v){
                if( IT.g(k).is('string') ){
                    self.resolveChain(t, k, v)
                }
                return true;
            }

            , get: function(t, k) {

                if( IT.g(k).is('string') ){
                    if(self[k] == undefined) {
                        // self[k] = {}
                        t.accessors = self[k]
                        return self.proxyFunc(k, t);
                    }
                } else  {
                    return self[k]
                }

            }
        });
    }

    add(key, Klass, parent, parentKey, decentChain){
        /* add a key of Klass to the instance*/
        parent = parent || this.instance;
        if(Klass === undefined) {
            Klass = key;
            key = Klass.name;
        }

        // debugger
        console.log('add', key);

        var proto = Klass.prototype;
        var f = proto && proto.__assets__;
        if(f !== undefined) {
            var assets = proto.__assets__.call(Klass);
            if(assets != undefined) {
                this.loadAssets(assets, Klass, key)
            }
        };

        if(proto.__instance__ !== undefined) {
            /* get any instance alterations */
            Object.assign(this, proto.__instance__() )
        };

        if(parentKey) {
            if(parentKey in parent == false) {
                parent[parentKey] = {};
            };

            parent = parent[parentKey]
        };

        parent[key] = Klass;

        // Add to list of available classes.
        if(_instance.classes[key] == undefined) {
            _instance.classes[key] = Klass
        } else {
            console.warn(`${key} exists as a class`)
        }

        Klass.__decentChain__ = decentChain;

        if(!this._accepters) {
            this._accepters = {};
        };

        if(proto.__overload__ !== undefined) {
            /* get any instance captures */
            var [name, accepterFunction] = proto.__overload__(Klass);
            this._overloadMap[name] = accepterFunction

        };

        return parent[key] == Klass;
    }

    loadAssets(assets, originator, name) {
        if(assetLoader != undefined) {
            console.log('Loading assets for:', name, assets)
            assetLoader.append(assets)
        }
    }

    proxy(){
        if(this._sharedProxy) return this._sharedProxy

        var handler = {
            set: function(target, name, value) {

                if(name == '_') {
                    console.log('set', name, value.name)
                } else {
                    console.log('!!? SET', name)
                }

                target[name] = value
                return true;
            }

            , get: function(target, name){

                if(name in target._overloadMap) {
                    return target._overloadMap[name]
                }

                if(!(name in target)) {
                    return target.classes[name]
                }

                return target[name]
            }
        };

        this._sharedProxy = new Proxy(this, handler);
        return this._sharedProxy
    }
}


class ProxyClass extends mix(BaseClass, LogMixin){

    __init__(){
        super.__init__()
        console.log('Executing proxy class:', this.constructor.name)
        if(arguments.length !== undefined) {
            return this.init.apply(this, arguments)
        }
    }

    __declare__(klass) {
        log('__declare__', this.name, klass.name)
    }

    __assets__() {
        /* return assets to load through the global assetLoader.
        return any valid type acceptable for assetLoader.require() */
        return undefined // []
    }

    init(){}
}


var _ProxyClass = new Proxy(ProxyClass, {
  get: function (oTarget, sKey) {
    console.log('ProxyClass', sKey)
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
