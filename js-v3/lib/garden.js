
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
            app.run(runConfig)
        }

        return app;
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
}
