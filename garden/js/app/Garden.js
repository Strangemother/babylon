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

        this.addRenderLayer(this.startCaller.bind(this))
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

    start(){
        /* Open API method for applying all user code without affecting the
        running engine. `start()` is automatically called as the first rendering
        method for the render loop. */
        console.log('StartFunctionRender.start!')
    }

}

class Sibling extends StartFunctionRender {
    /* */
}


class App extends Sibling {
     /* API Exposed class for extending the Application and its host components*/

}

class Garden extends Events {

    constructor(config){

        super()
        console.log('Garden.constructor')
        this._pluginRegister = Garden._pluginRegister

        this._init(config)
        this.init(config)
    }


    _init(constructorConfig){
        /* An internal init method called by the constructor before the API
        init() method.*/
        let config = this._createConfig(constructorConfig)

        for (var i = 0; i < this._pluginRegister.length; i++) {
            this._pluginRegister[i].mount(this)
        }

        this.hoistApps()
    }

    hoistApps() {
        // Shit I cannie remember what this function was for... I should learn to
        // document my code better.
        // debugger
        this.$on('mounted', this.mountEvent)
    }

    mountEvent(eventData){
        let data = eventData.detail.data
        let name = data.parent.name

        if(name == undefined) {
            name = data.canvas.id
        }

        console.log('Recording instance', name)
        Garden._instances[name] = data;
    }

    config(){
        /* API method exposing the init configuration of the internal App
        instance, */

        let apps = {
            app: {
                appClass: 'App'
                , element: 'renderCanvas'
                , size: [800, 600]
                , sceneColor: 'lightBlue'
            }

            , app2: {
                name: "app2"
                , element: 'otherCanvas'
                , size: [500, 400]
                , sceneColor: 'darkSlateBlue'
            }
        }

        apps = [
            {
                name: "app"
                , element: 'renderCanvas'
                , size: [800, 600]
                , sceneColor: 'lightBlue'
            }

            , {
                name: "app2"
                , element: 'otherCanvas'
                , size: [500, 400]
                , sceneColor: 'darkSlateBlue'
            }
        ]

        return { apps }
    }

    _createConfig(initConfig){

        let conf = this.config
        let updatedConfig

        if(it(conf).is('function')) {
            conf = this.config()
        }

        conf = Object.assign({}, conf, initConfig)

        for (var i = 0; i < this._pluginRegister.length; i++) {
            updatedConfig = this._pluginRegister[i].setConfig(this, conf)
            if(updatedConfig != undefined) {
                Object.assign(conf, initConfig)
            }
        }

        return conf
    }

    static staticInstatiate(){
        log('staticInstatiate')
        this._pluginRegister = []
    }

    static plugin(_class) {
        /* Given a class, create and mount the instance as a garden extension*/
        let plugin = new _class()
        plugin.register && plugin.register(this)
        this._pluginRegister.push(plugin)
    }

    init(){
        /* open hook for API access on constructor.*/
    }

    run(){
        /* First boot method of the entire rendering unit. All configurations
        are final. Attributtes for the engine are applied and `run` is performed. */
    }

    static instances() {
        /* REturn a list of open Garden instances*/
        return Object.values(Garden._instances)
    }
}

Garden._instances = {}
Garden.staticInstatiate()
