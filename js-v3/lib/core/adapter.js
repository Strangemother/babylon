
class BabylonObject extends ChildManager {
    /* Interface the babylon method caller with the defined shape parameters.
    It's encouraged to use the native BABYLON Mesh. */

    static targetObjectAssignment(cls){
        /* Return a plural of the type*/
        return `objects`;
    }

    static make(cls, options) {
        /* Make a new instance of this Class.
        This class, is actually the first given argument `cls`.*/
        let item = new cls(options);
        return item;
    }

    init(options, ...args){
        /* API hook to start your component. Such as an add to view.*/
        this._options = options || {};
        this._args = args;
    }

    keys(){
        /* Key options for this BABYLON type*/
        return []
    }

    create(options, scene, cache=false){
        /* Create the scene entity for babylon interface. Returned is the
        generated object for bablon*/
        options = options || {};

        if(scene == undefined) {
            if(options.scene) {
                scene = options.scene;
                delete options.scene;
            } else {
                scene = this._app.scene()
            }
        };

        let args = this.setup(scene, options, cache);
        // Return babylon instance
        return this.babylonCall(...args);
    }

    static create(options, scene, cache=false) {

        let c = new this;
        return c.create(options, scene, cache)
    }

    setup(scene, options, cache=true){
        /* Perform any initial setuup of your Shape, building out your
        entity variables or starting view listeners.

        If a cache exists in this._babylonParams this is returned.
        If this._babylonParams is undefined or `cache=False` `this.babylonParams`
        call is returned.

        Return the finished options set.*/

        // Cached by this.babylonCall
        let r = this._babylonParams;
        if( IT.g(r).is('object') ) {
            r = r[1]
        };
        if(cache == false) {
            r = undefined;
        }
        let rd = r != undefined ? r: {};
        let _opts = Object.assign({}, rd, this._options || {}, options);

        let props = this._app.properties
        for(let key in _opts) {
            if(props[key] != undefined) {
                props[key].setup(this, scene, key, _opts);
            }
        };

        for(let key in this._app.autoProperties) {
            props[key].setup(this, scene, key, _opts);
        };


        if(r === undefined || cache == false) {
            return this.babylonParams(scene, _opts)
        };

        return r
    }

    addTo(childBase, options) {
        /* Add this element to the child list of the given parent.
        of childBase.children does not exist an error is thrown */
        if(childBase.children) {
            return childBase.children.add(this, options)
        }
    }

    addToScene(options) {
        /* Add the element to the child list of the default app scene.
        This function uses the addTo(app) */
        return this.addTo(Garden.instance(), options)
    }

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides)
            , v, allowSet
            ;

        let a = [name];
        let keys = this.keys();
        let oKeys = Object.getOwnPropertyNames(options)
        for(let key of keys){

            if(oKeys.indexOf(key) > -1 ) {
                a.push(options[key]);
            } else {
                [allowSet, v] = this._babylonParamsMissingKey(key, keys, options, scene);
                if(allowSet == true) {
                    a.push(v);
                }
            }
        };

        if(a.length != keys.length + 1) {
            Garden.handleWarning(
                    'Camera.babylonParams.options'
                    , 'Given parameter length does not match API parameter length'
                )
        };

        let s = this.babylonSceneArg(scene);
        if(s) {
            a.push(scene);
        }

        return a
    }

    babylonSceneArg(scene){
        /* Given the scene, return an argument for the scen argument
        If you BABYLON instance does not require a Scene object
        as the last parameter, return false or undefined

        */
        return scene
    }

    _babylonParamsMissingKey(key, keys, options, scene) {
        /* Whilst populating the BABYLON instance parameters the `key` does
        not exist within `options`. */
        Garden.handleError(
                    'babylonParamsMissingKey'
                    , `Missing key "${key}"`
                )

        return [false, undefined]
    }

    generateOptions(overrides){
        /* Return an options object for the babylon interface instance using
        all the internal and external attributes required. Provide an object
        for final key override.
        Returned is an object ready for babylon */
        let o = {}, v, key, defined;

        for(key of this.keys()) {
            [defined, v] = this.getOptionKey(key);
            if(defined){
                o[key] = v;
            };
        };

        let _props = {};
        for(key in overrides) {
            v = this.getLiveProperty(key, o, overrides);
            if(v != undefined){
                _props[v[0]] = v[1];
            }
        };

        // TODO: remove this off this;
        this._properties = _props;
        return o;
    }

    getLiveProperty(key, o, overrides) {
        /* Return a call to the Property.liveProperty if it
        exists, else default to the override[key] */
        let properties = this._app.properties
        if(properties[key] != undefined) {
            let [_key, v] = properties[key].liveProperty(this, o, overrides)
            if(v !== null) {
                return [_key, v]
            }
        } else {
            o[key] = overrides[key]
        };
    }

    getOptionKey(key) {
        /* return the value for the given key, used when building the options
        for the babylon instance*/
        let n = `${key}Key`;
        if(this[n] != undefined) {
            return [true, this[n]()]
        };
        return [false, undefined]
    }

    generateName(){
        /*Create a name for the babylon instance*/
        let r = Math.random().toString(32).slice(-5);
        let n = this.type().toLowerCase();
        return `${n}_${r}`;
    }

    destroy(){
        /* Remove the item from the view and destroy its data. This
        should attempt a complete memory removal. */
        let n = self.constructor.name;

        let b = this._babylon;
        if(b) {
            b.dispose()
        };

        let displayInstance = this._app.displayListManager.remove(this);

        delete this._properties
        delete this._babylonParams

        return displayInstance;
    }

    type(v){
        if(v !== undefined) { this._type = v };
        return this._type || this.constructor.name;
    }

    babylonCall(...args) {
        /* Produce a babylon object using the given args as
        parameters for the CreateXXX call.
        returned is a babylon instance. */
        this._babylonParams = args;
        let n = this.babylonFuncName(...args);
        let b = this.executeBabylon(this.babylonFunc(), n, ...args);
        this.assignProperties(b, ...args)
        this.assignLiveProperties(b, ...args)
        return b;
    }

    propKeys(){
        return []
    }

    executeBabylon(babylonFunc, name, ...args) {
        return new babylonFunc[name](...args);
    }

    assignProperties(mesh, ...args) {
        /* Call properties assigned through the propKeys()
        assignement */
        let keys = this.propKeys()
            , prop
            ;

        for (var i = 0; i < keys.length; i++) {
            prop = keys[i];
            let pv =  this[`${prop}Prop`]();
            let pvs =  this[`${prop}PropSetter`];
            if(pvs != undefined) {
                pvs.call(this, mesh, prop, ...args)
            } else {
                mesh[prop] = pv

            }
        };
    }

    assignLiveProperties(mesh, ...args) {

        let properties = this._app.properties
        let _properties = this._properties
        for(let key in _properties) {
            properties[key].afterProperty(mesh, this, key, _properties)
        }
    }

    babylonFunc(){
        return BABYLON
    }

    babylonFuncName(...args) {
        /* Bablyon function builds XXXCamera. By default
        this is FreeCamera */
        /* Return the partial name of the object to create a full
        babylon name Create[name]. Default: 'Mesh' */
        return this.type();
        // let n = this.babylonFuncNamePartial(...args);
        // return n;
        // return `${n}`;
    }

    babylonFuncNamePartial(...args) {
    }

    actionManager() {
        /* Return an action manager. If undefined a new one is created.*/
        let b = this._babylon;

        if(b != undefined && b.actionManager == undefined) {
            let scene = this._app.scene();
            b.actionManager = new BABYLON.ActionManager(scene);
        }

        return b.actionManager;
    }

    animate(gAnim, { start=0, end=undefined,  loop=true, config={}} = {}) {

        let mesh = this._babylon
        let bAnim = gAnim.create()
        let scene = this._app.scene()
        let speedRatio
            , onAnimationEnd

        if(end == undefined) {
            // pick from highest frame in animation
            end = Math.max.apply(Math, gAnim.frames().map(x => x.frame))

        };

        mesh.animations.push(bAnim);

        let animatable = scene.beginAnimation(
            mesh
            , start
            , end
            , loop
            , speedRatio
            , onAnimationEnd
            , gAnim.animatable
            )

        gAnim.animatable = animatable
        return animatable;
    }
}


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
        let klass = name;
        if( IT.g(name).is('string') ) {
            klass = _instance.appClasses[name]
        }


        let C = (klass || Garden);
        let app = new C(config);

        app.run(runConfig)
        return app;
    }

    switch(name, destroy=true) {

    }
}

