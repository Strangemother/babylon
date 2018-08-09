class RenderList extends RenderLoop {
    /* Extending the standard render loop counter for a list iterator */

    constructor(engine, config) {
        super(engine, config)
        this._renderers = []
    }

    renderFunction(loopFunction, config){
        /* override the existing renderloop function to add the 'scene; to'
        the given argument list. */
        let scene = this.scene
        let f = function renderListEngineRenderFunction() {
            // this.renderLoop
           loopFunction(scene, config)
        }

        return f;
    }


    renderLoop(scene, config) {
        /* The render loop performs the scene.render() and steps the super(),
        calling each method in the render list.*/
        scene.render()

        // Replace the existing functionality rather than perform a super call.
        this._renderLoopCounter += 1

        // iterate the internal layers for rendering. This is the input loop
        // for all user produced code. Every item in the list is a function.
        for (var i = 0; i < this._renderers.length; i++) {
            // any method given to `this.addRenderLayer`
            this._renderers[i](scene, i)
        };
    }

    addRenderLayer(func) {
        /* append an item to the renderers, to be called by the render loop.

            let rl = new RenderList

            rl.counter = 0
            rl.addRenderLoop(function(){
                rl.counter += 1
            })
        */
        this._renderers.push(func)
    }

    removeRenderLayer(func) {
        return this._renderers.splice(this._renderers.indexOf(func),1).length == 1
    }
}
