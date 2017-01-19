var SIZE = {
    // CSS map to full width height
    FULL: 'full'
}


var NotImplementedError = function(message) {
    this.name = 'NotImplemented';
    this.message = message || "The reference call is not implemented";
    this.stack = (new Error(message)).stack;
}


NotImplementedError.prototype = Object.create(Error.prototype)
NotImplementedError.prototype.constructor = NotImplementedError;
NotImplementedError.throw = function(m){
    let e = new NotImplementedError(m);
    throw e;
    return e;
}


var _instance = {};


class BaseClass {
    /* Base app */
    constructor(...args){
        return this.init.apply(this, arguments)
    }

    init() {
        console.log('init called')
    }

    get _app() {
        /* Hook to the base app instance. For scene sharing*/
        return _instance
    }
}


class TargetObjectAssignmentRegister extends BaseClass {


    static make(type, options) {
        /* Genetate an instance*/

        if(arguments.length <= 1) {
            options = type;
            type = undefined;
        };

        // Options or default options
        options = options || {};
        // Given type or the options.type or DEFAULT
        type = (type || options.type).toLowerCase()

        if(options._type) {
            delete options.type;
        };

        let named = this.assignmentName()
        let location = Garden.instance()[named] || {};
        let item = location[type].make(location[type], options);
        Garden.instance()[named] = location
        return item;
    }

    static create(type, options, scene) {
        let item = this.make(type, options);
        // The given scene or the options scene
        scene = scene || (options != undefined? options.scene: undefined)

        if(scene == undefined) {
            let engine, canvas;
            [scene, engine, canvas] = item._app.babylonSet;
        };

        // Create new mesh
        let mesh = item.create(scene);
        // Add to display list.
        item._app.children.append(item, mesh, options)
        return item;
    }

    static register(...items){
        // let named = Garden.assignmentName();
        let _instance = Garden.instance();
        /* Register a component for later creation via MeshTool.make and .create*/
        let location = {};
        let name, camelName, aName, inst, instName

        for(let item of items) {
            inst = item.assignmentReference ? item.assignmentReference(item): item;
            aName = item.assignmentName ? item.assignmentName(item): 'named';
            location = _instance[aName] || location;
            name = item.name.toLowerCase();
            instName = inst.name || name;
            camelName = `${name.slice(0,1).toLowerCase()}${name.slice(1)}`

            if(location[instName] != undefined) {
                console.warn('Overwriting', instName, 'on', location)
            }

            location[instName] = inst;

            if(item.targetObjectAssignment) {
                let n = item.targetObjectAssignment(inst, _instance)
                if(n === undefined) {
                    console.warn('targetObjectAssignment name was undefined for', inst);
                }

                if(_instance[n] == undefined) {
                    _instance[n] = {}
                };

                _instance[n][instName] = inst;
            }

            _instance[aName] = location
        };

    }

    static assignmentName(){
        return 'named'
    }
}


class BabylonBase extends TargetObjectAssignmentRegister {

    init(config){
        log('BabylonBase init')
        this._renderers = []
        this.initConfig = config;
        this.clearColor = [.3, .3, .3]
        this._ran = false;
        this._stop = false;
    }

    stop(v){
        v = v === undefined? true: v;

        if(v != undefined){
            this._stop = v;
        }

        return this._stop;
    }

    config(v){
        if(v) return this.totalConfig[v];

        if(this.totalConfig == undefined && this._ran == false) {
            console.warn('run() method requires call');
            return Object.assign({}, this.initConfig || {}, this.runConfig || {});
        }
        return this.totalConfig;
    }

    getRunConfig(runConfig){
        return Object.assign({},this.initConfig || {}, runConfig);
    }

    run(engine, runConfig) {

        if(arguments.length == 1) {
            runConfig = engine;
            engine = undefined;
        };

        this.runConfig = runConfig || {};
        this.totalConfig = this.getRunConfig(this.runConfig);
        this.clearColor = this.config('backgroundColor') || this.clearColor
        return this.runLoop(this.runConfig, this._engine)
    }

    runLoop(config, engine) {
        return this._loop(config, engine)
    }

    _loop(config, engine) {
        engine = engine || this._engine;
        var self = this;
        this._ran = true;
        if(engine) {
            engine.runRenderLoop(function() {
               self.renderLoop(config)
            });
        } else {
            while(this._stop == false) {
                this.renderLoop(config);
            }
        }

        return true;
    }

    renderLoop(config) {

        for (var i = 0; i < this._renderers.length; i++) {
            this._renderers[i](config, i)
        }
    }
}


class BaseProperty extends BaseClass {
    /* Create a class loading into the base Garden or other target
    class
    Like MRO but live and import inheritence. */
    static assignmentName(item) {
        return 'properties'
    }

    static assignmentReference(klass) {
         return new klass;
    }

    get name(){
        return this.key();
    }

    key(){
        return this.constructor.name.slice(0, -'property'.length).toLowerCase();
    }

    setup(instance, scene, key, options) {
        let [_key, v] = this.instanceMethod(instance, scene, options)
        instance[_key] = v;
    }

    liveProperty(item, objReference, options){
        /* Called by the generateOptions function on first options
        detection.
        item: Class instance being generated by the generateOptions call
        objReference: The object being created for the new BABYLON object.
        options: Object configurations for the creating item BABYLON reference */
        return this.initProperty(item, objReference, options);
    }

    instanceMethod(item, scene, options) {
        /* Set a method on the instance if one is required. */
        let toSet, key, f;
        [toSet, key] = this.setInstanceMethod();

        if(!this.isTargetClass(item)) {
            // check for class.
            return
        };

        f = (function(propInst, key){

            return function(v){
                return propInst.propCall(this, key, v)
            };

        })(this, key)

        if(toSet) {
            return [key, f]
        }
    }

    propCall(instance, key, v, b){
        let ins = this.isTargetClass(instance)
        let pn = ins.name;
        let fn = 'getProperty'

        if(v !== undefined) {
            fn = 'setProperty'
        };

        let tn = `${pn}_${fn}`;
        if(this[tn] == undefined) {
            tn = fn;
        }

        return this[tn](instance, key, v, b);
    }

    isTargetClass(item) {
        /* REturns the first mathing class instance of*/
        for(let _type of this.instanceTypes()) {
            if(item instanceof _type) return _type;
        };
        return false;
    }

    instanceTypes() {
        return [BabylonObject]
    }

    setInstanceMethod(){
        return [true, this.key()]
    }

    initProperty(item, objReference, options) {
        /* First method called in a sequence for a loading property.
        Returned is the live instance value within the options.*/
        return [this.name, this.initValue(item, objReference, options)];
    }

    initValue(item, objReference, options){
        return options[this.name]
    }

    afterProperty(babylon, instance, key, properties){
        /* Called by assignLiveProperties immediately after the
        babylon execution. This method should assign values
        to the BABYLON instance. */
        this.propCall(instance, key, properties[key], babylon)
    }

    setProperty(instance, key, value, babylon) {
        /* Set the value to the instance, optionally recieving a babylon
        instance */
        babylon = babylon || instance._babylon;
        babylon[key] = value;
    }

    getProperty(instance, key, babylon){
        /* Get the key from the instance.
        By default this returns the value applied by `initProperty`*/
        // babylon = babylon || instance._babylon;
        babylon = babylon || instance._babylon;
        if(babylon[key] != undefined) { return babylon[key]; }
        return instance._properties[key]
    }
}
