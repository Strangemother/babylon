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



class BabylonInterface extends TargetObjectAssignmentRegister {

    init(config){
        log('BabylonBase init')
        this._renderers = []
        this.initConfig = config;
        this.clearColor = [.3, .3, .3]
        this._ran = false;
        this._stop = false;
    }

    shouldAttachCamera(){
        return true
    }

    runLoop(gameConfig, engine){
        /*Start the run loop initializing the basic scene and camera.*/
        this._scene = this.scene(gameConfig.name);
        this._camera = this.camera(this._scene, this._canvas);
        engine = engine || this._engine ||  this.engine(this._canvas);

        window.dispatchNativeEvent && dispatchNativeEvent('gamescenerun', this)

        return this._loop(this._scene, engine);
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

    renderLoop(scene) {
        /* The render loop performs the scene.render() and steps the super(),
        calling each method in the render list.*/
        scene.render()

        for (var i = 0; i < this._renderers.length; i++) {
            this._renderers[i](scene, i)
        };

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
        name = name || config.canvasName || this.canvasName()
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

    canvasName(){
        /* If the App specific named canvas exists
        else default to '#garden' */

        let n = this.constructor.name;
        if( document.getElementById(n) ){
            return `#${n}`
        };

        return '#garden'
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
        this._setupDisplayManager()
        this._inheritInstanceKeys(_instance)
        this._renderers.push(this.startCaller.bind(this))
    }

    _inheritInstanceKeys(_i) {
        _i = _i || _instance
        if(_i != undefined) {
            let keys = Object.keys(_i);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                this[key] = _i[key]
            }
            this._inheritedKeys = keys;
        };

        _instance = this;
    }

    _setupDisplayManager(){
        this.displayListManager = new DisplayListManager(this)
        this.children = this.displayListManager.childList() // new ChildList(this)
    }

    destroy(){
        this.displayListManager.destroy();
        delete this.children
        delete this.displayListManager

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

