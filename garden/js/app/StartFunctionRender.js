
class StartFunctionRender extends EngineMount {

    constructor(entity/*, owner, config*/){
        /* Init the start function renderer by applying the `startCaller` to the RenderList._renderers.*/
        let config = {}

        if(arguments.length == 2) {
            config = arguments[1]
        }

        if(arguments.length == 3) {
            let owner = arguments[1]
            config = arguments[2]
            if(config.owner != undefined) {
                console.warn('Two owner applications given', config.owner, owner )
            };

            config.owner = owner
        }

        super(entity, config)

        this._renderSceneFunction = this._renderScene

        if(config.name) {
            /* Notice the container test here. Not (config.xx == unndefined) -
            as we cant the user to apply any value including a nully. */
            this.name = config.name
        }

        if(config.render) {
            /* Notice the container test here. Not (config.xx == unndefined) -
            as we cant the user to apply any value including a nully. */
            this._renderSceneFunction = config.render
        } else {
            console.info('Using StartFunctionRender built in _renderSceneFunction => "_renderScene"\n'
                    + 'because the "config.render" function does not exist.')
        }

        this.config = config

        this.addRenderLayer(this.startCaller.bind(this))

        /* We've hooked the config renderer here - this should be _optionalised_ */
        this.addRenderLayer(this.render.bind(this))
    }

    startCaller(scene, index) {
        /* Call the `start` function and any patches then remove the function from the _render
        list.

        This method - given as a 'render' method for the render loop performs
        the Garden run integration, performing any first time (last options) scene integration,
        implementing any 3D functions waiting for a scene.

        The patches are appled and the api `start` method is called then deleted from the render loop.
        */

        // this._patchCall('$start', [scene, this])
        let r = this.start(scene, index);
        // this._patchCall('$afterStart', [scene])
        this._renderers.splice(index, 1)
        return r;
    }

    start(scene){
        /* Open API method for applying all user code without affecting the
        running engine. `start()` is automatically called as the first rendering
        method for the render loop. */
        console.log('StartFunctionRender.start!')
        scene.render()
    }

    render(scene, counter){
        /*
        The render() function given as a render layer to the `RenderList.addRenderLayer`,
        is called for every update. Supply a `render` function to the config
        for calling.
        If the `config.render` function does not exist, the `scene.render`
        is called automatically
         */

        //console.log('StartFunctionRender.render!')
        this._renderSceneFunction(scene, counter)

    }

    _renderScene(scene, counter) {
        /* call `scene.render` on the given scene.
        This function is used as a replacement for `config.render` if
        config.render does not exist. */
        scene.render()
    }
}
