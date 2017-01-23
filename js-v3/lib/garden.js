
class Garden extends Base {

    static assignmentName(){
        return 'appClasses'
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

    switch(name, destroy=true) {

    }
}

