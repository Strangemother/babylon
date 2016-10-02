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
    }

    run(gameConfig){
        this.runConfig = gameConfig;
        this.totalConfig = Object.assign({},this.initConfig || {}, gameConfig);

        this.log('Run', this.totalConfig);

        /*Start the run loop initializing the basic scene and camera.*/
        this._scene = this.scene();
        this._camera = this.camera(this._scene, this._canvas);
        window.dispatchNativeEvent && dispatchNativeEvent('gamescenerun', this)
        this.runLoop(this._engine, this._scene)
    }

    runLoop(engine, scene) {
        engine = engine || this._engine;
        this.init(engine, scene)
        var self = this;
        engine.runRenderLoop(function() {
           scene.render();
           self.renderLoop(scene)
        });
    }

    renderLoop(scene) {
        for (var i = 0; i < this._renderers.length; i++) {
            this._renderers[i](scene, i)
        }
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

    shouldAttachCamera(){
        return true
    }

    config(v){
        if(v) return this.totalConfig[v];
        return this.totalConfig;
    }

    scene(name){
        /* Initialize a new BABYLON scene referencing the
        canvas and engine. */
        var _canvas = this._canvas = this.canvas(name);
        var _engine = this._engine = this.engine(_canvas);

        // Now create a basic Babylon Scene object
        var scene = new BABYLON.Scene(_engine);
        return scene
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

    canvas(name){
        var config = this.config()
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
}


I._ = class BabylonInterface extends I.BabylonBase {

    __declare__() {
        return { global: true }
    }

    scene(name) {
        let scene = super.scene(name);
        scene.clearColor = this.sceneColor();
        return scene
    }

    sceneColor(){
        /* Return a colour used for the scene referencing
        this.data.config.sceneColor */
        var [r,g,b] = [.3,.3,.3] // this.data.config.sceneColor;
        var c = new BABYLON.Color3(r,g,b);
        return c
    }
}

})();
