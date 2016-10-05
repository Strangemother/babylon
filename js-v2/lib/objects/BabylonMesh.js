;(function(){

var I = INSTANCE;

I._ = class BabylonMesh extends I.ProxyClass {

    __declare__() {

    }

    __assets__() {
        //return ['foo.js']
    }

    __instance__() {
        return {
            _genNames: {}
        }
    }

    defaults(){
        return {
            size: 1
        }
    }

    init(scene, config) {
        if(arguments.length == 1){
            config = scene;
            scene = config.scene;
        };
        console.log(this.constructor.name)
        this.children = {}
        this.scene = scene;
        this._config = config || {};
        I._genNames[this.name()] = {};
    }

    addChild(o, scene) {
        /* Add this item or the given item to the scene.
        If an object is given, it's given to the scene as a
        chld of this object.
        */
        var name = this.name()
        if(o === undefined){
            o = {};
        } else {
            this.children[name] = o;
        }

        return this.addToScene(scene, o);
    }

    addToScene(scene, config, name) {
        return this.item = this.create(config, name, scene);;
    }

    get item() {
        return this._item
    }

    set item(v){
        this._item = v;
        return true;
    }

    create(config, name, scene) {
        name = name || config.name || this.generateName(config.type);
        config = Object.assign(this.defaults(), this._config, config);
        scene = scene || I.scene();

        var c = this.preConfig(config, name, scene)
        var func = this.itemFunction(c, scene);
        var obj = func(name, c, scene);
        c = this.postConfig(c, obj, name, scene)


        return obj;
    }

    preConfig(config, name, scene) {
        I.callPlugins(this, 'preConfig', scene, name, config);
        return config
    }


    postConfig(config, item, name, scene) {
        I.callPlugins(this, 'postConfig', scene, item, config);
        return config
    }


    itemFunction(options, scene){
        /*return the function used to create the mesh object.
        Given for optional use is options (or config) for your element.
        This is unused for the BabylonMesh class. */
        return BABYLON.MeshBuilder[this.itemFunctionName(options)].bind(BABYLON.MeshBuilder)
    }

    itemFunctionName(/*options, scene*/){
        /* return the name of the function from babylon*/
        return 'CreateMesh'
    }

    generateName(name) {
        name = name || 'item';

        if( (name in I._genNames) == false) {
            I._genNames[name] = 320;
        };

        var num = (I._genNames[name]++).toString(32);
        var res = `${name}_${num}`;
        return res;
    }

    name(v){
        if(v !== undefined){
            this._config.name = v;
        };

        return this._config.name || this._name || this.constructor.name
    }

    config(v){
        if(v !== undefined){
            return this._replaceConfig(v)
        };

        return this._config
    }

    _replaceConfig(v) {
        this._config = v;
        return this._config;
    }
}


I._ = class Box extends I.BabylonMesh {

    itemFunctionName(){
        /* return the name of the function from babylon*/
        return 'CreateBox'
    }
}


I._.mutators = class Mutator {

    name(){
        return 'Mutator'
    }

    preConfig(config, name, scene, instance){
        /* Alter the configuration before the babylon instance is
        created.
        this function will call mutate */
        var _config = config;

        if(config[this.name()] !== undefined) {
            _config = this.mutate(config, scene)
        }

        return _config;
    }

    postConfig(config, item, scene, instance) {
        /* Called after the bablyon item is created performing
        any tasks after creation.
        This function will call itemApply. */
        return this.itemApply(config, item, scene, instance)
    }

    activeProperty(item, key, setter, getter, config, instance){
        /* Create an attribute setting and getting a property from another
        object.
        When the value is appled to the parent object of this mutator, the
        change should perpetuate to the babyylon item instance.

        The item, intending to be the Bablyon instance will receive `key`.
        Optionally provide a setter and getter function., If the getter is undefined,
        the setter is used as both get and set of the attribute.*/

        // (item, key)
        // (item, key, config)
        // (item, key, setter, config)
        // (item, key, setter, getter, config, instance)
        let al = arguments.length;

        if(al==3) {
            config = setter;
            setter = undefined;
        } else if(al==4) {
            config = getter;
            getter = undefined
        }

        var conf = config // arguments[arguments.length-1]
        if(conf) {
            var v = conf[key];

            // Call if basic function
            if( IT.g(conf[key]).is('function') ) {
                v = conf[key](scene, conf);
            }

            item[key] = v;
        };

        var _setter = function(v){
            item[key] = v
        }

        var _getter = function(){
            return item[key]
        }

        // Apply a throughput getter setter
        var v = {
            get: function() {
                console.log('get', key, item.id);
                return (getter || setter || _getter)(undefined, this)
                // return this._props[key];

            }

            , set: function(newValue) {
                console.log('set', key, item.id);
                //this._props[key] = newValue
                (setter || _setter)(newValue, this);
            }
        }

        debugger;
        // Apply the thoughput on `this` the mutator (its parent)
        return Object.defineProperty(instance || this, key, v);
    }

    mutate(config, scene) {
        /* Alter the configuration object before it's applied to the
        babylon instance.
        return a mutated config object. */
        return config;
    }

    itemApply(config, item, scene, instance) {
        /* Alter the babylon `item` after the config has applied to the
        `item` instance and `mutate()` was called.
        Perform any post changes to your babylon `item`
        config: the config object given through the instance
        item:   bablyon item applied to the scene
        scene:  babylon scene for the object
        instance:  the library class instance managing the `item` */
    }
}


I._.mutators.material = class MaterialMutator extends I.Mutator {
    /* A MaterialMutator provides the provides the `material` key to
    Babylon instance*/
    name(){
        /* Return a name of the instance used as a key
        for the read write of the babylon and config object.*/
        return 'material'
    }

    mutate(config, scene) {
        /* Edit config options before the babylon call */
        let n = this.name()
        var v = config[n];

        if(IT.g(v).is('function')) {
            v = config[n](scene, config);
        };

        config[n] = v;
        return config;
    }

    itemApply(config, item, scene, instance){
        debugger;
        /* Apply any mutations to the babylon item created */
        item[this.name()] = config[this.name()]

    }
}


I._.mutators = class ActiveMutator extends I.Mutator {

    itemApply(config, item, scene, instance){
        /* Apply any mutations to the babylon item created */
        debugger
        this.itemApplyInit(config, item, scene, instance)
        // item, key, setter, getter, config, instance
        this.activeProperty(item, n, function(v, p){
            return self.setterGetter(v, item, p, this)
        }, undefined, config, instance)
    }

    itemApplyInit(config, item, scene, instance) {
        /* Called by `itemApply` to perform any changes to the babylon
        instance before the active property is applied to the `item`*/
        var n = this.name();
        item[n] = config[n];
    }

    setterGetter(value, item, parent, scope){
        /* Getter setter function performing the read write action
        on the `item` when calles*/
        if(v == undefined){ return item[this.name()] };
        item[this.name()] = value;
    }
}


I._.mutators.scaling = class ScaleMutator extends I.ActiveMutator {

    name(){
        debugger
        return this.constructor.__decentChain__[0]
    }

    scaleKey(config, item, scene, instance){
        return this._scaleKey || 'x'
    }

    itemApplyInit(config, item, scene, instance) {
        item.scaling[this.scaleKey(config, item, scene, instance)] = config[this.name()];
    }

    setterGetter(value, item, parent, scope){
        if(v == undefined){ return item.scaling[this.scaleKey(config, item, scene, instance)]};
        item.scaling[this.scaleKey(config, item, scene, instance)]= value;
    }
}


I.mutators.width = class WidthMutator extends I.ScaleMutator {

    scaleKey(){
        return 'x'
    }
}

I.mutators.height = function(){
    var v = new I.ScaleMutator()
    v._scaleKey = 'y';
    return v;
}


I._ = class BabylonMutator extends mix(I.BabylonMesh, I.Mutator) {

    defaults(){
        /* Applied as defaults and required keys */
        return  {}
    }

    itemApply(config, item, scene, instance) {
        var keys = Object.keys(this.defaults())

        // this._props = {};

        for (var i = keys.length - 1; i >= 0; i--) {
            var key = keys[i];

            if(key in config) {
                //this.activeProperty(item, key, config, instance);
                this.activeProperty(item, key, undefined, undefined, config, instance)
            }
        }
    }
}


I._ = class Light extends I.BabylonMutator {

    __init__() {
        var v = super.__init__.apply(this, arguments) || this
        Object.assign(this, this.defaults())
        // return this._proxy
    }

    defaults(){
        /* Applied as defaults and required keys */

        return  {
            //position: new BABYLON.Vector3(0, 2, -1)
            intensity: .1
        }
    }

    itemFunction(options, scene){
        /*return the function used to create the mesh object.
        Given for optional use is options (or config) for your element.
        This is unused for the BabylonMesh class. */
        //return BABYLON.MeshBuilder[this.itemFunctionName(options)].bind(BABYLON.MeshBuilder)

        var self = this;
        // Same function sig as the class inline arguments
        return function(name, position, scene){

            position = self.toVector(position) || options.position || self.defaultPosition(scene);
            name = name || options.name || self.generateName(config.type);
            scene = scene || I.scene();

            return new BABYLON[self.itemFunctionName(options)](name, position, scene);
        }
    }

    toVector(v) {
        if( IT.g(v).is('object') ) {
            if( v.position ) {
                return v.position;
            }

            if( Object.keys(v).length == 0 ) {
                return this.defaults().position
            }
        }
    }

    defaultPosition(scene){
        return new BABYLON.Vector3(0, 2, 0);
    }

    itemFunctionName(/*options, scene*/){
        /* return the name of the function from babylon*/
        return 'HemisphericLight'
    }
}

})()
