class BabylonInterface extends TargetObjectAssignmentRegister {

    init(config){
        log('BabylonBase init')
        this._renderers = []
        this.initConfig = config || this.initConfig;
        this.clearColor = [.3, .3, .3]
        this._ran = false;
        this._stop = false;
    }

    shouldAttachCamera(){
        return true
    }

    runLoop(gameConfig, engine){
        /*Start the run loop initializing the basic scene and camera.*/
        if(this._destroyed == true) {
            console.info('Detected rerun')
        }

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

        this._makeGlobal(this.totalConfig)
        return this.runLoop(this.runConfig, this._engine)
    }

    _makeGlobal(conf) {
        if(conf.globalName) {
            console.info('Creating global reference', conf.globalName)
            window[conf.globalName] = this
        }
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
