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
        let named = this.assignmentName();
        let _instance = Garden.instance();
        /* Register a component for later creation via MeshTool.make and .create*/
        let location = _instance[named] || {};
        let name, camelName, aName, inst, instName

        for(let item of items) {
            inst = item.assignmentReference ? item.assignmentReference(item): item;
            aName = item.assignmentName ? item.assignmentName(item): named;
            location = _instance[named] || location;
            name = item.name.toLowerCase();
            instName = inst.name || name;
            camelName = `${name.slice(0,1).toLowerCase()}${name.slice(1)}`

            location[instName] = inst;
            if(item.targetObjectAssignment) {
                let n = item.targetObjectAssignment(inst)
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
};


class BabylonInterface extends BabylonBase {

    shouldAttachCamera(){
        return true
    }

    runLoop(gameConfig, engine){
        /*Start the run loop initializing the basic scene and camera.*/
        this._scene = this.scene(gameConfig.name);
        this._camera = this.camera(this._scene, this._canvas);
        engine = engine || this._engine ||  this.engine(this._canvas);

        window.dispatchNativeEvent && dispatchNativeEvent('gamescenerun', this)

        return super.runLoop(this._scene, engine);
    }

    renderLoop(scene) {
        /* The render loop performs the scene.render() and steps the super(),
        calling each method in the render list.*/
        scene.render()
        return super.renderLoop(scene)
    }

    camera(scene, canvas){
        scene = scene || this._scene;
        canvas = canvas || this._canvas;

        // This creates and positions a free camera
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        //var camera = this.interface.cameras.getCamera(scene,  new BABYLON.Vector3(0, 5, -10), false)
        // var camera = new BABYLON.ArcRotateCamera("camera1", 0, Math.PI / 4, 0 , new BABYLON.Vector3(2, 6,-10), scene);
        //var camera = new BABYLON.GamepadCamera("Camera", new BABYLON.Vector3(0, 15, -45), scene);
        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());
        if(this.shouldAttachCamera()) {
            // attaches the camera to the canvas
            camera.attachControl(canvas, false);
        };

        return camera;
    }

    scene(name){
        if(this._scene == undefined) {
            this._scene = this.createScene(name);
            this._scene.clearColor = this.sceneColor();
        };

        return this._scene;
    }

    sceneColor(){
        /* Return a colour used for the scene referencing
        this.data.config.sceneColor */

        var [r,g,b] = this.clearColor
        var c = new BABYLON.Color3(r,g,b);
        return c
    }

    createScene(name){
        /* Initialize a new BABYLON scene referencing the
        canvas and engine. */
        let _canvas = this._canvas = this.canvas(name);
        let _engine = this._engine = this.engine(_canvas);

        // Now create a basic Babylon Scene object
        var scene = new BABYLON.Scene(_engine);
        return scene
    }

    canvas(name){
        let config = this.config()
        name = name || config.canvasName
        // Get the canvas element from our HTML below
        var canvas = document.querySelector(name);

        if(canvas == null) {
            console.warn('canvas name cannot be found:', name)
            return undefined
        }

        if(config.size == SIZE.FULL){
            canvas.classList.add('game-canvas');
        } else if(config.size !== undefined) {
            canvas.width = config.size[0]
            canvas.height = config.size[1]
        };

        return canvas;
    }

    engine(canvas){
        // Load the BABYLON 3D engine
        var engine = new BABYLON.Engine(canvas, true);

        // Watch for browser/canvas resize events
        window.addEventListener("resize", function () {
           engine.resize();
        });

        return engine;
    }

    static handleWarning(errorId, message) {
        let n = `${errorId}::${message}`;
        console.warn(n)
    }

    static handleError(errorId, message) {
        let n = `${errorId}::${message}`;

        throw new Error(n)
    }

}


class Base extends BabylonInterface {

    init(config){
        super.init(config)
        this.displayListManager = new DisplayListManager(this)
        this.children = this.displayListManager.childList() // new ChildList(this)
        this._renderers.push(this.startCaller.bind(this))
        if(_instance != undefined) {
            let keys = Object.keys(_instance);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                this[key] = _instance[key]
            }
        };

        _instance = this;
    }

    get babylonSet(){
        /* Return the triplet of babylon tools
        Scene, engine, canvas */
        return [this.scene(), this._engine, this._canvas]
    }

    startCaller(scene, index) {
        /* Call the `start` function and remove the function from the _render
        list. */
        let r = this.start(scene, index);
        this._renderers.splice(index, 1)
        return r;
    }

    start(scene, index) {
        /* Perform any first render operations*/
        log('Start run once.')
    }

    get backgroundColor(){
        /* return the clearColor from the main scene */
        return this.scene().clearColor
    }

    set backgroundColor(v){
        /* return the clearColor from the main scene */
        this.scene().clearColor = v;
        return true;
    }
}


class Garden extends Base {

    static instance(){
        return _instance;
    }

    version(){
        return 0.2
    }
}


class DisplayListManager {

    constructor(parent){
        /* Reference set of all children
        If the parent is not defined, the main _instance is used. */

        this._displaySets = {};
        this.parent = parent || _instance;
        // this.id = Math.random().toString(32).slice(2);
    }

    get(id){
        return this._displaySets[id]
    }

    set(id, v) {
        this._displaySets[id] = v;
    }

    childList() {
        let r = new ChildList(this.parent);
        this._displaySets[r.id] = [r, []];
        return r;
    }
}


class ChildList {
    /* A ChildList maintains a connection to a the _displayList,
    managing lists of display entities. */

    constructor(parent){
        this.parent = parent;
        this.name = {};
        this.id = Math.random().toString(32).slice(2);
    }

    get displayList() {
        /* Return the relative display list containing all children */
        return _instance.displayListManager.get(this.id)[1]
    }

    set displayList(v){
        /* return the relative display list for this childlist. */
        _instance.displayListManager.set(this.id, v)
    }

    /* A chainable read list for instances of information for the view.*/
    add(children, options) {
        /* Add an item to the list of children*/

        let items = children;
        if(!Array.isArray(children)) {
            items = [children];
        }

        let meshes=[], mesh;
        let [scene, engine, canvas] = this.parent._app.babylonSet;

        for(let item of items) {
            mesh = item.create(options, scene);
            this.append(item, mesh, options);
            meshes.push(mesh);
        };

        // User did not pass an array, therefore return one mesh.
        if(!Array.isArray(children)) return mesh;

        return meshes;
    }

    addMany(...children) {
        /* Calls add() for every item given */
        return this.add(children)
    }

    append(item, mesh, options) {

        let v = [item, mesh, options];
        // give item index and child list reference
        let index = -1 + this.displayList.push(v);

        item._displayListIndex = index;
        item._displayListName = this.id;

        // Add to master list
        // _displayList[item.id] = v
        return index;
    }
}


class ChildManager extends BaseClass {

    constructor(){
        super(...arguments)
        this.id = Math.random().toString(32).slice(2);
    }

    get _childList(){
        /* Reutrn the relative childList - the displayList controller*/
        return _instance.displayListManager.get(this._displayListName)[0]
    }

    get _displayList(){
        /* Return relative array displaylist */
        if(this._displayListName == undefined) return undefined;
        return _instance.displayListManager.get(this._displayListName)[1]
    }

    get _babylon() {
        if(this._babylon_node) return this._babylon_node
        if(this._displayListName == undefined) return undefined
        return this._displayList[this._displayListIndex][1]
    }

    set _babylon(babylonItem) {
        /* override the babylon instance with an internal value, omiting the
        displayList*/
        this._babylon_node = babylonItem
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

    liveProperty(item, objReference, options){
        /* Called by the generateOptions function on first options
        detection.
        item: Class instance being generated by the generateOptions call
        objReference: The object being created for the new BABYLON object.
        options: Object configurations for the creating item BABYLON reference */
        return this.initProperty(item, objReference, options);
    }

    initProperty(item, objReference, options) {
        /* First method called in a sequence for a loading property.
        Returned is the live instance value within the options.*/
        return options[this.name];
    }


    afterProperty(babylon, instance, key, properties){

    }
}

