;(function(){

var I = INSTANCE;
var SIZE = {
    // CSS map to full width height
    FULL: 'full'
}

I._ = class BabylonBase extends I.ProxyClass {

    __assets__() {
        return ['{ T.root }/foo.js']
    }

    init(config){
        this._renderers = []
        this.log('config', config)
        this.initConfig = config;
        this._ran = false;
        this._stop = false;
    }

    stop(v){
        v = v === undefined? true: v;

        if(v){
            this._stop == v;
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

        this.runConfig = runConfig;
        this.totalConfig = this.getRunConfig(this.runConfig);

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

}


I._ = class BabylonInterface extends I.BabylonBase {

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
        if(this._scene == undefined){
            this._scene = this.createScene(name)
            this._scene.clearColor = this.sceneColor();
        }

        I.scene = this.scene.bind(this);
        return this._scene;
    }

    sceneColor(){
        /* Return a colour used for the scene referencing
        this.data.config.sceneColor */
        var [r,g,b] = [.3,.3,.3] // this.data.config.sceneColor;
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
}

})();
