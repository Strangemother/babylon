SIZE = {
    // CSS map to full width height
    FULL: 'full'
}

class GameScene extends CoreClass {
    /* manages cameras, engine, camera other scene items. */

    init(){
        /* create the game instance, hooking to the data*/
        this.canvasName = this.data.config.canvasName;
        this._renderers = []
    }

    canvas(name){
        name = name || this.canvasName;
        // Get the canvas element from our HTML below
        var canvas = document.querySelector(name);

        if(this.data.config.size == SIZE.FULL){
            canvas.classList.add('game-canvas');
        } else if(this.data.config.size !== undefined) {
            canvas.width = this.data.config.size[0]
            canvas.height = this.data.config.size[1]
        };

        return canvas;
    }


    sceneColor(){
        /* Return a colour used for the scene referencing
        this.data.config.sceneColor */
        var [r,g,b] = this.data.config.sceneColor;
        var c = new BABYLON.Color3(r,g,b);
        return c
    }

    scene(name){
        /* Initialize a new BABYLON scene referencing the
        canvas and engine. */
        var _canvas = this._canvas = this.canvas(name);
        var _engine = this._engine = this.engine(_canvas);

        // Now create a basic Babylon Scene object
        var scene = new BABYLON.Scene(_engine);

        // Change the scene background color to green.
        scene.clearColor = this.sceneColor();
        return scene
    }

    canvas2D(scene, newCanvas=false) {

        if(newCanvas == false && this._canvas2D) {
            return this._canvas2D
        }

        var canvas = new BABYLON.WorldSpaceCanvas2D(scene, {
            id: "ScreenCanvas",
            backgroundFill: "#FFFFFFFF",
            backgroundRoundRadius: 10
        });

        if(newCanvas == false) {
            this._canvas2D = canvas
        }
        return canvas
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

    run(){
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
        //var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        var camera = this.interface.cameras.getCamera(scene,  new BABYLON.Vector3(0, 5, -10), false)
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
}

