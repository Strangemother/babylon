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
        [this._childID, this._refChildren] = new Children(this)
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

    fetchProps(){
        return true
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

        scene = scene || this._app.scene();

        if( IT.g(r).is('object') ) {
            r = r[1]
        };

        if(cache == false) {
            r = undefined;
        };

        let rd = r != undefined ? r: {};
        let _opts = Object.assign({}, rd, this._options || {}, options);

        this._assignProperties(_opts, scene);

        if(r === undefined || cache == false) {
            return this.babylonParams(scene, _opts);
        };

        return r
    }

    _assignProperties(_opts, scene) {

        let props = this._app.properties;
        for(let key in _opts) {
            if(props[key] != undefined) {
                props[key].setup(this, scene, key, _opts);
            }
        };

        for(let key in this._app.autoProperties) {
            props[key].setup(this, scene, key, _opts);
        };
    }

    addTo(childBase, options) {
        /* Add this element to the child list of the given parent.
        of childBase.children does not exist an error is thrown */
        if(childBase.children) {
            // this._refChildren.add(this, childBase, options)
            return childBase.children.add(this, options)
        } else {
            console.warn('children did not exist in', childBase)
        }
    }

    addToScene(options) {
        /* Add the element to the child list of the default app scene.
        This function uses the addTo(app) */
        return this.addTo(this._app, options)
    }

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides, scene)

        if(this.babylonArrayArgs()) {
            return this.babylonConvertOptions(name, options, scene)
        }

        return [name, options, scene];
    }

    babylonArrayArgs() {
        return true
    }

    babylonConvertOptions(name, options, scene){

        let v, allowSet;
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

    generateOptions(overrides, scene){
        /* Return an options object for the babylon interface instance using
        all the internal and external attributes required. Provide an object
        for final key override.
        Returned is an object ready for babylon */
        let o = {}, v, key, defined;

        for(key of this.keys()) {
            [defined, v] = this.getOptionKey(key, overrides, scene);
            if(defined){
                o[key] = v;
            };
        };

        let _props = {};
        for(key in overrides) {
            v = this.getLiveProperty(key, o, overrides, scene);
            if(v != undefined){
                _props[v[0]] = v[1];
            }
        };

        // TODO: remove this off this;
        this._properties = _props;
        return o;
    }

    getLiveProperty(key, o, overrides, scene) {
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

    getOptionKey(key, overrides, scene) {
        /* return the value for the given key, used when building the options
        for the babylon instance*/
        let n = `${key}Key`;
        if(this[n] != undefined) {
            return [true, this[n](overrides[key], overrides, scene)]
        };
        return [false, undefined]
    }

    generateName(){
        /*Create a name for the babylon instance*/
        let n = this.type().toLowerCase();
        return simpleID(n)

        let r = Math.random().toString(32).slice(-5);
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
        /* REturn the type of class as string this class
        represents.
        Default; name constuctorName.
        */
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
        return this.babylonExecuted(b, ...args)
    }

    babylonExecuted(babylon, ...args) {
        return babylon;
    }

    propKeys(){
        return []
    }

    executeBabylon(babylonFunc, name, ...args) {
        return new babylonFunc[name](...args);
    }

    assignProperties(mesh, ...args) {
        /* Call properties assigned through the propKeys()
        assignment

        loop all propKeys(). If the [key]Prop() function
        exists, the return replaces the input value.
        The value returned is applied to mesh[key] = propValue;

        If this.[key]PropSetter() function exists, this
        function is called instead of mesh[key] = value - expecting
        the function to apply the required value in another manner.
        */

        let keys = this.propKeys()
            , prop
            ;

        for (var i = 0; i < keys.length; i++) {
            prop = keys[i];
            let optionValue = this._options[prop];
            let f = this[`${prop}Prop`];
            if(f == undefined && optionValue != undefined) {
                f = function(x){ return x }
            }

            let pv = optionValue;

            if(f != undefined){
                pv =  f.call(this, optionValue, this._options, mesh);
            }

            let pvs =  this[`${prop}PropSetter`];
            if(pvs != undefined) {
                pvs.call(this, mesh, prop, pv || optionValue, ...args)
            } else {
                mesh[prop] = pv

            }
        };
    }

    assignLiveProperties(mesh, ...args) {
        /* Assign properties after the properties are defined.
        the Live properties will exist on the
        mesh. */
        let p = this._app.properties
            , _p = this._properties
            ;

        for(let key in _p) {
            p[key].afterProperty(mesh, this, key, _p)
        }
    }

    babylonFunc(){
        return BABYLON
    }

    babylonFuncName(...args) {
        /* Return the name of the function to execute on
        BABYLON[babylonFuncName] */

        return this.type();
    }

    get children(){
        /* A Child of an object defines in a list.
        All children exist in the parent children of the app
        each child is for BABYLON */
        return this._app.children
    }

    set children(v){
        // this._app.children = v;
        return false;
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

