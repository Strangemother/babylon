class Contrib {

    setup(app, keys, configs, globalConfig){
        _itc = IT.g(configs)
        if(_itc.is('array')) {
            // Check of right length

        } else if(_itc.is('object')) {
            /* Do all the keys exist, else
            does the global exist
            raise error or merge respectivly */
        }

        for(let key of keys) {
            // let conf =
            if(this[key] != undefined) {
                app[key] = this[key](app, conf)
            }
        }
    }

    _mergeObjects() {
        /* merge objects left to right*/
        o = {}
        for (var i = 0; i < arguments.length; i++) {
               Object.assign(o, arguments[i]);
           }
        return o
    }
}


class Garden extends Base {

    static assignmentName(){
        return 'appClasses'
    }

    static targetObjectAssignment(kls, _instance){
        let n = kls.name;
        Garden[n] = Garden.switchFunc(n);
        Garden.apps = Garden.apps || [];
        Garden.apps.push(n)
        return null
    }

    static instance(){
        return _instance;
    }


    version(){
        return 0.2
    }

    static config(v) {
        if(v != undefined) {
            _instance._config = v;
            return this;
        };

        return _instance._config;
    }

    static reset(){
        simple_id_counter = 0
        complex_ids_counter = {
            defCounter: 0
        }
    }

    reset(name){
        /* Restart all config as if new; exluding babylon. */
        this.destroy()
        return Garden.run(name)
    }

    destroy(){
        super.destroy()
        this._ran = false;
        this._renderers = []
        Garden.reset()
    }

    static run(name, config, runConfig){
        if(config == undefined && IT.g(name).is('object')) {
            config = name;
            name = undefined;
        };

        config = config || Garden.config()

        name = name || config.appName;
        let klass = name;
        if( IT.g(name).is('string') ) {
            klass = _instance.appClasses[name]
        }


        let C = (klass || Garden);
        let app = new C(config);

        if(!app._ran) {
            //this.beginPatches(app, config, runConfig)
            app.run(runConfig)
        }

        return app;
    }

    beginPatches(app, config, runConfig) {
        /* Construct new pathces */
        let patches = this.patches
        if(patches == undefined) {
            return
        }

        for (var i = 0; i < patches.length; i++) {
            let PatchC = patches[i];
        }
    }

    static switch(name, destroy=true) {
        let gi = Garden.instance();
        return gi.reset(name);
    }

    switch(name, destroy) {
        return Garden.switch(name, destroy)
    }

    static switchFunc(n) {
        return (function(n){
            return function(){
                return Garden.switch(n)
            }
        })(n)
    }

    screenshot(width, height, camera){
        /* Create an image screenshot of the active engine.
        Optional values will match the engine if undefined.*/
        let engine = this._engine;
        if(width == undefined) width = engine.getRenderWidth();
        if(height == undefined) height = engine.getRenderHeight();
        if(camera == undefined) {
            camera = this._camera
            if(camera._babylon != undefined){
                camera = camera._babylon;
            }
        }
        let func = BABYLON.Tools.CreateScreenshotUsingRenderTarget;
        func(engine, camera, { width, height})
    }

    //getRunConfig(){
    //    /* merge patch config */
    //    if(this.patches) {
    //    }
    //}
}
