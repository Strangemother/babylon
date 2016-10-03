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

        this.scene = scene;
        this._config = config || {};
        I._genNames[this.name()] = {};
    }

    addChild(o, scene) {
        /* Add this item or the given item to the scene.
        If an object is given, it's given to the scene as a
        chld of this object.
        */
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
        config = Object.assign(this.defaults(), config);
        var func = this.itemFunction(config, scene)
        var obj = func(name, config, scene);
        return obj;
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

})()
