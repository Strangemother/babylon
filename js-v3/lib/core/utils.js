var funcChain = function(def){
    /* Returns a function, providing a caller and function stacker.
    When data is passed to the funcChain all functions are called in order
    The result is the mutated result.

    chain = funcChain([])

    chain.add(func1)
    id = chain.add(func2)

    bool = chain.has(func1)
    bool = chain.has(id)

    chain.remove(id)
    chain.remove(func1)

    res = chain(data, 1, false)

    chain.clear()
    */
    var _f = function chainCaller(...args) {
        return _caller(...args)
    }

    var gId = function(){
        return ( (Math.random() + +(new Date) )).toString(14);
    }

    var has = function(f){
        return _f.functions.indexOf(f) > -1
    }

    var add = function(f){
        return _f.functions.push(f);
    }

    var remove = function(f) {
        if(_f.has(f)){
            return _f.functions.splice(_f.functions.indexOf(f), 1)
        }
        return false;
    }

    var clear = function(){
        _f.functions = [];
    }

    _f._id = gId()
    _f.default = def
    _f.functions = []
    _f.add = add
    _f.has = has
    _f.remove = remove
    _f.clear = clear;

    var _caller = function(...args){
        var res = _f.def;
        for (var i = 0; i < _f.functions.length; i++) {
            d = p.functions[i](res);
            if(d !== undefined) {
                res = d;
            }
        }

        return res;
    }


    return _f;
}


/* Util */
var isClass = function (e){
    /* Cheap check to determin if an entity is a class, over an
    object or instance of a class.*/
    var isf = this.isFunction(e)
        , hop = e.hasOwnProperty('prototype')
    if(isf && hop) {
        // is function and has protoype.
        // should be a class requiring new
        return true
    }

    return false;
}

var isFunction = function (e) {
    return IT.g(e).is(Function)
}

var isObject = function (e){
    return IT.g(e).is(Object);
}

var isBlank = function(stringly) {
    return !(
            stringly != ''
            && stringly != null
            && stringly != undefined
        )
}


function classChain(klass, namesOnly){
    /* return a list of classes for a given class chain.
    Provide second argument True to return names

        classChain(Stage, true)
        ["Stage", "DisplayObject", "Drawable", "DrawerEvents", "DrawBase", "Delegate"]
    */
    var v = klass
        , res = []
        ;

    while(!isBlank(v.name)) {
        res.push( (namesOnly === true? v.name: v) )
        v = Object.getPrototypeOf(v);
    }

    return res;
}


var chunkArray = function(data, size){
    var arrays = [];

    while (data.length > 0) {
        arrays.push(data.splice(0, size));
    };

    return arrays
}

var asDict = function(list, headers){
    /*
    convert the list into a diction using the header list
    (of the same length) to map each list item.*/
    var res = {};

    if(list.length == headers.length) {
        for (var i = 0; i < headers.length; i++) {
            res[headers[i]] = list[i];
        }
    } else {
        console.error('asDict match length false')
    }

    return res;
}


var mergeOnKey = function(key, ...arrays) {
    /* returns an array of arrays, resulting in
    the merged results of all arrays based on key */

    // Create dictionary of keys whilst
    // mergin objects.
    res = []
    var caches = {}
    for (var i = 0; i < arrays.length; i++) {
        var arr = arrays[i];

        if(caches[arr] === undefined){
            caches[arr] = {}
        }

        var c = caches[arr];

        for (var j = 0; j < arr.length; j++) {
            // iterate an array, caching keys
            var obj = arr[j];
            var v = obj[key];
            if(c[v] == undefined) {
                c[v] = [obj]
            } else{
                c[v].push(obj);
            }
        }
    }

    var cacheMerge = {}
    // convert the caches to flat objects;
    for(var ckey in caches) {
        // flatten
        for(var _key in caches[ckey]) {
            // _key is the requested
            // value of each objects
            // key lookup.

            if(cacheMerge[_key] == undefined) {
                cacheMerge[_key] = []
            }
            // Sub array of one cache object
            // key match list.

            // objects of key 'key'
            cacheMerge[_key] = cacheMerge[_key].concat(caches[ckey][_key])

        }

        res = res.concat(caches[ckey]);
    }

    var cacheRes = []
    /* cache merge is a result of all objects sorted by the given key*/
    for(var _key in cacheMerge) {
        var r = [{}];
        for (var i = 0; i < cacheMerge[_key].length; i++) {
            r.push(cacheMerge[_key][i])
        }

        var o = Object.assign.apply(Object, r);
        cacheRes.push(o)
    }

    return cacheRes;
    return res;
}

var simple_id_counter = 0
var simpleID = function(optional='', counter=undefined){
    let id = counter || simple_id_counter++; // Math.random().toString(32).slice(2);
    let insert = optional != ''? '_': '';
    return `${optional}${insert}${id}`
}

var complex_ids_counter = {
    defCounter: 0
}

var complexID = function(optional='defCounter') {
    if(complex_ids_counter[optional] == undefined) {
        complex_ids_counter[optional] = 0
    }

    complex_ids_counter[optional]++;
    return simpleID(optional, complex_ids_counter[optional]);

}

var asVector = function(...args){
    /*
        Create a BABYLON Vector type using
        arguments:

            asVector(10)           => Vector2(10, 10)
            asVector([10])         => Vector2(10, 10)
            asVector(1, 2)         => Vector2(1, 2)
            asVector([1, 2])       => Vector2(1, 2)
            asVector(1, 2, 3)      => Vector3(1, 2, 3)
            asVector([1, 2, 3])    => Vector3(1, 2, 3)
            asVector(1, 2, 3, 4)   => Vector4(1, 2, 3, 4)
            asVector([1, 2, 3, 4]) => Vector4(1, 2, 3, 4)
            asVector(new Vector#())=> Vector#()
     */
    let B = BABYLON;
    let classes = [
        undefined
        , function(a){
            if(IT.g(a).is('number')) return asVector(a, a);
            if(a.constructor != undefined) {
                let al = [ "Vector2" ,"Vector3" ,"Vector4" ];
                if( al.indexOf(a.constructor.name) > -1){
                    return a;
                };
            };

            NotImplementedError.throw('asVector requires a Number or Vector# type');
        }
        , B.Vector2
        , B.Vector3
        , B.Vector4
    ];

    let a = args;
    if(args.length == 1 && Array.isArray(a[0])){
        a = args[0]
    };

    let v = new classes[a.length](...a);
    return v;
}


var asBabylon = function(item) {
    /* Return a bablyon item from the given reference. */
    if( item instanceof(BabylonObject)
        || item._babylon != undefined ) {
        return item._babylon;
    };

    return item;
}

;(function(global){

    var log = global.log = log = function() {
        /*print to a renderer*/
        let n = this.constructor.name;
        let fn = `%c ${n} `
        var v = [fn, 'background: #DDD; color: #333'];
        for (var i = 0; i < arguments.length; i++) {
            v.push(arguments[i])
        }

        console.log.apply(console, v)
    }

    var mix = global.mix = function(Parent /*, ...mixins*/) {
        // Use slice as node 4 does not support param spread.
        for (var i = 0; i < mix._handlers.length; i++) {
            mix._handlers[i].apply(this, arguments)
        };

        return xmultiple.apply(window, arguments)
    };

    mix._handlers = []

    mix.ambigiousInherit = true;
    mix.rightInherit = true;
    mix.ambigiousInheritWarn = true;

    mix.addHandler = function(f){
        mix._handlers.push(f)
    }

    mix.removeHandler = function(f){
        var v = mix._handlers.splice( mix._handlers.indexOf(f), 1 )
        return v.length == 1;
    }


    var xmultiple = function xmultiple(...parents) {
        // For now, ensure homogeneous parents
        // That is, objects multi-inherit from objects, and classes multi-inherit from classes
        // In the future, might loosen this restriction, but for now, keeping it simple
        const isEveryParentObject = parents.every(parent => typeof(parent) === 'object');
        const isEveryParentClass = parents.every(parent => typeof(parent) === 'function');

        // Forward to more specialized functions depending on argument types
        if (isEveryParentObject) {
            return xmultipleObjects(parents);
        } else if (isEveryParentClass) {
            return xmultipleClasses(parents);
        } else {
            throw new TypeError('Either every parent should be an ordinary object or every parent should be a class.');
        }
    }

    /**
     * Creates a proxy that delegates to multiple other plain objects.
     *
     * @param {Array<Object>} parents The list of objects to delegate to.
     * @param {any=Object.create(null)} proxyTarget Object for the proxy to
     *     virtualize. Some characteristics of the proxy are verified against the
     *     target. For example, for the proxy to be considered constructible, the
     *     target must be constructible.
     * @return {Proxy}
     */
    var xmultipleObjects = function xmultipleObjects(parents, proxyTarget = Object.create(null)) {
        // Create proxy that traps property accesses and forwards to each parent, returning the first defined value we find
        const forwardingProxy = new Proxy(proxyTarget, {
            get: function (proxyTarget, propertyKey) {
                // The proxy target gets first dibs
                // So, for example, if the proxy target is constructible, this will find its prototype
                if (Object.prototype.hasOwnProperty.call(proxyTarget, propertyKey)) {
                    return proxyTarget[propertyKey];
                }

                // Check every parent for the property key
                // We might find more than one defined value if multiple parents have the same property
                const foundValues = parents.reduce(function(foundValues, parent) {
                    // It's important that we access the object property only once,
                    // because it might be a getter that causes side-effects
                    const currentValue = parent[propertyKey];
                    if (currentValue !== undefined) {
                        foundValues.push(currentValue);
                    }

                    return foundValues;
                }, []);

                // Just because we found multiple values doesn't necessarily mean there's a collision
                // If, for example, we inherit from three plain objects that each inherit from Object.prototype,
                // then we would find three references for the key "hasOwnProperty"
                // But that doesn't mean we have three different functions; it means we have three references to the *same* function
                // Thus, if every found value compares strictly equal, then don't treat it as a collision
                const firstValue = foundValues[0];
                const areFoundValuesSame = foundValues.every(value => value === firstValue);
                if (!areFoundValuesSame) {
                    if(mix.ambigiousInherit) {
                        if(mix.ambigiousInheritWarn) {
                            console.warn(`Inheriting ambigious property: ${propertyKey}`)
                        };
                        let v = mix.rightInherit? foundValues.length-1: 0;
                        return foundValues[v]
                    }
                    throw new Error(`Ambiguous property: ${propertyKey}.`);
                }

                return firstValue;
            }
        });

        return forwardingProxy;
    }

    /**
     * Creates a proxy that delegates to multiple other constructor functions and
     * their prototypes.
     *
     * @param {Array<ConstructorFunction>} parents The list of constructor functions
     *     to delegate to.
     * @return {Proxy}
     */
    var xmultipleClasses = function xmultipleClasses(parents) {
        // A dummy constructor because a class can only extend something constructible
        function ConstructibleProxyTarget() {
            console.log('xmultipleClasses ConstructibleProxyTarget:', this.constructor.name)
            return this.__init__.apply(this, arguments);
        }

        // Replace prototype with a forwarding proxy to parents' prototypes
        ConstructibleProxyTarget.prototype = xmultipleObjects(parents.map(parent => parent.prototype));
        ConstructibleProxyTarget.parents = parents
        // Forward static calls to parents
        const ClassForwardingProxy = xmultipleObjects(parents, ConstructibleProxyTarget);

        return ClassForwardingProxy;
    }
})(window);
