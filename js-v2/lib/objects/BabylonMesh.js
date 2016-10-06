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


I._ = class Box extends I.BabylonMutator {

    itemFunctionName(){
        /* return the name of the function from babylon*/
        return 'CreateBox'
    }
}
})()
