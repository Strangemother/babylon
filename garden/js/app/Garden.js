class Sibling extends StartFunctionRender {
    /* */
}


class App extends Sibling {
     /* API Exposed class for extending the
     Application and its host components */

}


;(function mountDetection(){

    class MountDetection extends Events {

        constructor(){
            super()
            this.$on('mounted', this._mountEventHandler)
            this.$on('Garden.constructor', this._gardenConstructorEventHandler)
        }

        _gardenConstructorEventHandler(event) {
            let data = event.detail.data
            Garden._applications[data.instance.id] = data.instance
        }

        _mountEventHandler(eventData){
            let data = eventData.detail.data

            let name = data.parent? data.parent.name: data.canvas.id
            console.log('Recording instance', name)
            Garden._instances[name] = data;
        }
    }

    let mountDetection = new MountDetection()

})();


class Garden extends Events {

    constructor(config){

        super()
        this._pluginRegister = Garden._pluginRegister
        this.getRenderer = this._getRendererWithWarning
        // Store of 'name' for the chosen $renderer.
        this._selectedRenderer = undefined
        this.$renderers = undefined
        this.sceneCameras = []

        this.$emit('Garden.constructor', {instance: this, config})
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

        if(config.allowConfigPoison != false) {
            // Allow the mutation of the config object.
            this.config = config;
        }

        this._hoistRenderers()
    }

    _hoistRenderers() {
        /*
            Start the internal Application rendering functions
            ready for engine mounting.
         */
        let conf = this.config
        let renderers = conf.apps
        console.log('_hoistRenderers')
        if(renderers == undefined && conf.app != undefined) {
            console.log('Found an app')
            renderers = [conf.app]
        }

        if(renderers == undefined || renderers.length == 0) {
            console.log('Using default pickup params.')
            let defApp = this._defaultApp(conf)
            if(conf.element != undefined) {
                /* Build renderer app -
                Collecting attributes from root conf */
                let app = {}
                for(let key in defApp) {
                    let value = defApp[key]
                    if(conf[key] != undefined) {
                        value = conf[key]
                    } else {
                        console.warn(`Key ${key} does not exist in the given config.`)
                    }
                    app[key] = value
                }
                defApp = app;
            }
            renderers = [defApp]
        }

        let started = []
        let $rNames = {}
        let RendererClass = this.getRendererClass()

        let pushApp = function(appD, key) {
            let name = appD.name == undefined? key: appD.name
            let app = new RendererClass(appD.element, {
                name: name
                , size: appD.size
                , sceneColor: appD.sceneColor
            })

            started.push(app)
            $rNames[name] = app
        }

        if(it(renderers).is('array')) {
            for (var i = 0; i < renderers.length; i++) {
                pushApp(renderers[i])
            }
        } else {
            for(let key in renderers) {
                pushApp(renderers[key], key)
            }
        }

        this.$renderers = started
        this.$r = $rNames

        for (var i = 0; i < started.length; i++) {
            let mounted = started[i].mount()
            if(mounted == false) {
                console.error('Cannot mount app', i)
            }
        }

        for (var i = 0; i < started.length; i++) {
            if(started[i]._mounted != true) {
                console.warn('Renderer', i, 'Did not mount. Skipping initialRig()')
                continue
            }

            this.initialRig(started[i])
        }

        console.log('Mounted', started.length)
        // Emit a mount event so any other global Garden instances may
        // capture new apps.
        this.$on('mounted', this._mountEventHandler)
    }

    _defaultApp(config) {
        if(config == undefined) {
            config = {}
        }

        return {
            element: config.element || undefined
            , name: 'main'
            , size: config.size || [800, 600]
            , sceneColor: config.sceneColor || 'lightBlue'
        }
    }

    _mountEventHandler(eventData){
        let data = eventData.detail.data
        let name = data.parent ? data.parent.name: undefined

        if(name == undefined) {
            name = data.canvas.id
        }

        console.log('Recording instance', name)
        Garden._instances[name] = data;
    }

    defaultConfig() {
        /* A default config to for the override config to extend.*/
        return {
            // apps: {
            //     size: [800, 600]
            //     , sceneColor: 'green'
            //     , name: 'Garden'
            // }
            sceneCameraAttach: true
            , id: Math.random().toString(32).slice(2)

        }
    }

    config(){
        /* API method exposing the init configuration of the internal App
        instance, */

        // let apps = {
        //     app: {
        //         appClass: 'App'
        //         , element: 'renderCanvas'
        //         , size: [800, 600]
        //         , sceneColor: 'lightBlue'
        //     }

        //     , app2: {
        //         name: "app2"
        //         , element: 'otherCanvas'
        //         , size: [500, 400]
        //         , sceneColor: 'darkSlateBlue'
        //     }
        // }

        let apps = [
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

        let conf = {
            apps
        }

        return {}//conf
    }

    _createConfig(initConfig){
        /* Build an initial config object using the given
        initial config (from constructor), the internal this.config,
        and plugin configs and later the run config.*/
        let conf = this.config
        let updatedConfig

        if(it(conf).is('function')) {
            conf = this.config()
        }

        conf = Object.assign(this.defaultConfig(), conf, initConfig)

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

    initialRig(renderer, config){
        log('Initial Rig')

        if(renderer == undefined) {
            renderer = this.getRenderer()
        }

        if(config == undefined) {
            config = this.getConfig()
        }

        let camera = this.getSceneCamera(renderer, config)
        if(config.sceneCameraAttach) {
            camera.attachControl(renderer.canvas, true);
        } else {
            log('Did not attach scene camera control')
        }
    }

    getSceneCamera(renderer, config) {
        /* Get or create the sceneCamera. */
        if(renderer == undefined) {
            renderer = this.getRenderer()
        }

        if(renderer.sceneCamera != undefined) {
            return renderer.sceneCamera
        }

        if(config == undefined) {
            config = this.getConfig()
        }

        var camera = new LIB.ArcRotateCamera("Camera",
            Math.PI / 2, Math.PI / 2, 2,
            LIB.Vector3.Zero(), renderer.scene);

        renderer.sceneCamera = camera
        this.sceneCameras.push(camera)

        return camera
    }

    getRendererClass(){
        return StartFunctionRender
    }

    _getRendererWithWarning(){
        /* Get the current renderer for the application. */
        if(this.$renderers.length > 1) {
            console.warn('More than one renderer exists for this instance.\n'
                        + 'The last renderer will be selected by default.')
        }

        let renderer = this.$renderers[this.$renderers.length - 1]
        this._selectedRenderer = renderer.name

        if(this._selectedRenderer == undefined) {
            console.warn('Render app does not have a name.\n'
                        + 'Adding name "main" by default')
            this._selectedRenderer = 'main'
            renderer.name = this._selectedRenderer
        }

        this.getRenderer = this._getRenderer
        return renderer
    }

    _getRenderer(){
        return this.$r[this._selectedRenderer]
    }

    getConfig(){
        /* Return the current full configuration for the instance.
        This is not affected by config poison.*/
        let conf = this.config
        if(it(conf).is('function')) { conf = this.config() }
        return conf
    }

    init(){
        /* open hook for API access on constructor.*/
    }

    run(){
        /* First boot method of the entire rendering unit. All configurations
        are final. Attributtes for the engine are applied and `run` is performed. */
        console.log('Run')
    }

    start(){
        /* You application hook to start your scene objects in isolation
        to the standard scene setup flow.
        At this point, `init()`, and `created()` ran. The `run()` method
        called this `start()` function after the `initialRig()` is prepared.

            class MyApp {
                start(){
                    // Create it
                    let cube = new Cube()
                    console.log('New cube', cube)
                    // Show it
                    this.children.add(cube)
                    // Store it for later.
                    this.cube = cube
                }
            }

            (new MyApp).run()


        Calling `start()` instead of `run()` may not render the scene correctly.

        */
    }

    static instances() {
        /* REturn a list of open Garden instances*/
        return Object.values(Garden._instances)
    }

    static getInstance() {
        /* Return one active instance of a a Garden application,
        utilizing the count of instances and the default selected instance
        If a target instance cannot be discovered through manual
        mapping the last active instance is returned. */

        try{

            // Get the master App.
            let instances = Garden.instances()
            // Pick last
            let instance = instances[instances.length - 1]

            if(instance == undefined) {
                console.error('No Garden instances. ')
            }

            return instance
        } catch {
            console.error(`Could not automatically discover a scene: \n`
                    + 'scene;config.scene;app[last renderer]scene\n... do not exist.' )
        }
    }
}

Garden._instances = {}
Garden._applications = {}
Garden.staticInstatiate()
