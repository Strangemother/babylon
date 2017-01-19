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

