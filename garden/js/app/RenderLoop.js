/* The RenderLoop provides a simple loop procedure on a given engine.

The `engine.runRenderLoop` method is expected to receive a function.
The function should run at the expected framerate calling `renderLoop` on every
iteration.

The `RenderLoop.renderLoop` msintains a `_renderLoopCounter<int>` - this is throw
away and exists for the purpose of testing.

To use, perform a `start` with the correct paramters for your loop.
The iterating function will receive the `config` object:

    let rl = new RenderLoop
    rl.start(config, canvas, engine)


This will give the `renderLoop` method as an anonymous function to the `engine.runRenderLoop`

    engine.runRenderLoop(()=>rl.renderLoop(config))

A bit odd, but it allows the engine to hook the initial render function.
All framwework 3D stuff is rendered from the `renderLoop` method - through the
engine runloop iteration.

    class MyLoop extends RenderLoop {

        init(){
            this.counter = 0000
        }

        renderLoop(){
            this.counter += 1
        }
    }

    let loop = new MyLoop
    loop.start(config, canvas, engine)
*/

var dispatchNativeEvent = function(name, data){
    var event = new CustomEvent(name, {
        detail: {
            data
            , name: name
        }
    });

    window.dispatchEvent(event)
};


class Events {
    $emit(name, data) {
        dispatchNativeEvent(name, data)
    }

    $on(name, handler) {
        window.addEventListener(name, handler)
    }

    $off(name, handler) {
        window.removeEventListener(name, handler)
    }
}

class RenderLoop extends Events {
    /* A thin render loop */

    constructor(canvas, config) {
        super()
        this.canvas = canvas
        this.config = config
    }

    startLoop(config, canvas, engine, scene){
        /* Localisse the given paramters and initialise the run loop.
        Used by parent class `EngineMount.mount`  */
        console.log("RenderLoop.start")
        this.config = config == undefined? this.config: config
        this.canvas = canvas == undefined? this.canvas: canvas
        this.engine = engine
        this.scene = scene
        this._stop = false
        return this._initloop(engine, config)
    }


    _initloop(engine, config) {
        /* perform any last initialisation for the loop
            this._initloop(config)
            this._initloop(engine, config)
         */

        if(arguments.length == 1) {
            config = engine;
            engine = undefined;
        };

        this.config = config;
        this.initLoop()
        return this._runLoop(this.config, this._engine)
    }

    initLoop() {}

    _runLoop(config, engine) {
        return this._loop(config, engine)
    }

    _loop(config, engine) {
        engine = engine || this.engine;
        this._renderLoopCounter = 0
        let loopFunc = this.renderLoop.bind(this);
        let renderFunction = this.renderFunction(loopFunc, config)
        if(engine) {
            return engine.runRenderLoop(renderFunction);
        } else {
            console.error('No engine given to _loop.')
        }
    }

    renderFunction(loopFunction, config){
        /* Generate and return the anonymous function given to the
        engine render loop iterator.
        The `loopFunction` is the reference method to call. Internally
        this would be the `this.renderLoop` method.

        This function will be called per frame (like 60fps).
        */
        let f = function renderLoopEngineRenderFunction() {
            // this.renderLoop
           loopFunc(config)
        }

        return f;
    }

    renderLoop() {
        /* registed function to repeatedly render the scene */
        this._renderLoopCounter += 1
    }

    stop(){
        this._stop = true
    }
}
