class DisplayObject {

    constructor(config, scene, addNow=false){
        this.initConfig = config

        // A list of meshes to store when generated
        this.$meshes = []
        // A Dictionary of assignments for named mesh
        this.$m = {}
        // the last mesh to apply?
        this.$mesh = undefined

        autoProperties.hook(this, config, scene)
        this.init.apply(this, arguments)
    }

    init(config, scene, addNow){
        /* ran after constructor setup by the engine to start
        api code. */

        if(config == undefined) {
            config = {}
        }

        if(scene != undefined)  {
            // Only add if existing; else allow open override.
            this.scene = scene
        }

        if(addNow == true) {
            /*
                let cube = new Cube({ name, size }, scene, true)

             */
            // Auto add
            this.addToScene(config, scene)
        }
    }

    addToScene(options, scene){
        /*
            addToScene(scene)
            addToScene(options, scene)
         */
        if(scene == undefined && options instanceof(LIB.Scene)) {
            // scene only
            scene = options
            options = undefined
        }
        // Return the last mesh applied to the scene.
        let [name, meshConfig] = this.create(options, scene)
        let mesh = this.applyMesh(name, meshConfig, scene)
        autoProperties.applyToMesh(this,mesh, meshConfig, scene)
        this.storeMesh(name, mesh)
    }

    applyMesh(name, meshConfig, scene) {
        /*
            Apply the mesh data to the scene. If the name, meshConfig and scene
            are undefined, the __name, __meshConfig and standard scene are attempted
            from the object instance.
            The returned mesh is stored into the $meshes list.
        */
        meshConfig = meshConfig || this.__meshConfig
        name = name || this.__name

        let mesh = this.createMesh(meshConfig, scene)

        // ;(function(){
        //     this.__meshConfig = undefined
        // }).apply(this);

        return mesh
    }

    storeMesh(name, mesh) {

        this.$meshes.push(mesh)
        this.$m[name] = mesh
        this.$mesh = mesh
    }

    create(options, scene){
        /*
         Build the internal lib options from the given options and _optional_ scene.

         As this may be expensive, the methods to cache and generate the library
         options are split from mesh implementation methods.
         Call 'create' early followed by 'applyMesh' or a standard 'addToScene'

         */
        let [name, meshConfig] = this.createLibOptions(options)
        this.__name = name
        this.__meshConfig = meshConfig
        return [name, meshConfig]
    }

    createLibOptions(config) {
        /* Generate an instance of the object mesh - to add to a scene.*/
        if(config == undefined) {
            config = {}
            if(this.createConfig != undefined)  {
                /* The create was called again without options, but this
                display object has previously stored 'create' config */
                config = this.createConfig
            }
        }

        let conf = this.getConfig(config)
        // let [name, meshConf]
        let [name, meshConfig] = this.createMeshOptions(conf)
        let propConfig = this.renderProps(conf, meshConfig)
        return [name, Object.assign(meshConfig,propConfig)]
    }

    getConfig(additionalConfig) {
        /* Return a complete object of all options for this display object */
        let result = Object.assign(
                this.defaultConfig()
                , this.initConfig
                , this.createConfig
                , this._props
                , additionalConfig
            )

        return result
    }

    configure(object) {
        this.initConfig = Object.assign(this.initConfig, object)
        for(let key in object) {
            // let f = autoProperties.propNames[key]
            autoProperties.applyProp(this, key, object[key])
        }
    }

    createMeshOptions(config) {
        /* Generate the options for the LIB mesh, utilizing the given config.*/
        if(config == undefined) {
            config = this.getConfig()
        }

        // Get and render the internal keys,
        // mapping config given values to produce a dict
        // for the mesh
        let meshOptions = this.produceMeshKeys(config)
        // Clean options?

        return meshOptions
    }

    adapterProcedure(){
        /* the callable unit to call with the extracted adapterName
        upon create().*/
        return  LIB
    }

    adapterName(){
        let n = this.constructor.name
        //console.warn(`${n}.adapterName() should be overriden by a parent class`)
        return n
    }

    getAdapterName() {
        /* Return the name of the mesh object for the engine.*/
        let n = this.adapterName()
        return n
    }

    createMesh(config, scene){
        /* Produce a mesh object of which displays on the scene.
        The options given should be mesh config ready. */
        if(scene == undefined) {
            // Notice the 'undefined' - allowing 'null' as a property.
            scene = this.discoverScene(config)
        }

        console.log('Build display object', config, scene)
        let libFunc = this.adapterProcedure()[this.getAdapterName()]
        return this.produceMesh(libFunc, name, config, scene)
    }

    produceMesh(libFunc, name, config, scene) {

        autoProperties.hookProduceMesh(this, libFunc, name, config, scene)
        let mesh
        if(this.hookProduceMesh) {
            mesh = this.hookProduceMesh(this, libFunc, name, config, scene)
        } else {
            mesh = new libFunc(name, config, scene)
        }

        autoProperties.hookMesh(this, mesh, config, scene)
        return mesh
    }

    discoverScene(config){
        /* Find the selected scene */

        // Pull from force cache
        if(this.scene != undefined) { return this.scene }
        if(config == undefined) { config = this.getConfig() }

        // given in initConfig?
        if( config.scene != undefined ) {
            return config.scene
        }

        if(config.app != undefined) {
            /* Garden app instance - extract renderer*/
            return config.app.getRenderer().scene
        }

        return Garden.getInstance().scene
    }

    defaultConfig(){
        /* A Base configuration for any diosplay object. */
        return {
            /* Allow the caching of generated key paramter values
            to ensure a DisplayObject generates its Mesh keys once as it's expensive.*/
            bake: true
        }
    }

    renderProps(config, meshConfig){
        /* given a config iterate and update and key value with a function or
        property within this instance
         */
        let propConfig = {}
        console.log('Rendering props')
        for(let name in config) {
            let val = config[name]
            if(this[name] != undefined) {
                let iVal = this[name]
                if(it(iVal).is('function')) {
                    console.log('Found mapping function', name)
                    iVal = this[name](iVal)
                }

                if(autoProperties[name] != undefined) {

                    if(iVal == undefined ){
                        iVal = autoProperties[name].getGetterFunction(this)()
                    }
                }

                propConfig[name] = iVal
            }
        }

        return propConfig
    }

    produceMeshKeys(config){
        /* Using the config create a mesh object using the generated keys
        with iteration*/
        let result = {}
        let genKeys = config.bake != false? this.getKeys(): this.generateKeys()
        // Loop the genKey definitions, mapping values from the config.
        // Return an object with the correct keys for the LIB mesh.
        for (var i = genKeys.length - 1; i >= 0; i--) {
            let entry = genKeys[i]
            let value = null;
            // default, key, alts, fallbacks
            let key = entry.key

            // {
            //     key: 'updatable'
            //     ,  'default': true
            //     , alt: ['allowUpdate', 'update']
            //     , fallback: ['size']
            //     , type: [Boolean, undefined]
            //     , required: false
            // }

            if(config[key] != undefined) {
                // Found by key match reference
                value = config[key]
            }

            // Check alternative keys left to right
            for (var i = 0; i < entry.alt.length; i++) {
                let altKey = entry.alt[i]
                if(config[altKey] != undefined){
                    // Found config by alternative value
                    value = config[altKey]
                }
            }

            // Check fallback keys left to right
            for (var i = 0; i < entry.fallback.length; i++) {
                let fallbackKey = entry.fallback[i]
                if(config[fallbackKey] != undefined){
                    // Found config by fallback value
                    value = config[fallbackKey]
                }
            }

            if(value === null) {
                // no change.

                if(entry.required == false) {
                    // null value is allowed.
                    result[key] = entry['default']
                } else {
                    // Value is required;
                    console.error(`Key "${key}" is required but does not exist`)
                }
            } else {
                // Ensure the given value matches a type in the 'type'
                if(entry.type === undefined) {
                    // No type applied - allow anything
                    result[key] = value
                }

                if(typeof(entry.type) == 'string') {
                    entry.type = [entry.type]
                }

                for(let typeVal in entry.type) {
                    if(typeVal === undefined) {
                        // The given type is allowed to be "undefined"
                        if(value === undefined) {
                            result[key] = value
                        }
                    }

                    if(typeof(value) == typeVal.name.toLowerCase()
                        || value instanceof(typeVal)) {
                        /* Match primitive class with value
                            typeof('apples') == String.name.toLowerCase()
                            [''] instanceof(Array)
                        */
                       result[key] = value
                    }
                }
            }
            //
            // ? Required
            // test type
            // add key to result
        }

        name = result.name != undefined? resut.name: simpleID(this._libMeshName())
        return [name, result]
    }

    _libMeshName() {
        return this.constructor.name
    }

    getKeys(){
        /* Return a finished bake of the generatedKeys(). */
        if(this._generatedKeys != undefined) {
            return this._generatedKeys
        }

        let genKeys = this.generateKeys()
        this._generatedKeys = genKeys
        return genKeys
    }

    generateKeys(){
        /* Generate a baked version of the keys ready for assignment.
        */

       // A list of unadulterated keys
       let rawKeys = this.keys()
       let keySet = []

       let entryOpts = {
                key: undefined
                , alt: []
                , fallback: []
                // any type.
                , type: undefined
                , default: undefined
                , required: false
            }

       for (var i = rawKeys.length - 1; i >= 0; i--) {
            let entry = rawKeys[i]

            if(typeof(entry) == 'string') {
                entry = {key: entry}
            }

            if(Array.isArray(entry)) {
                let _entry = {key: entry[0]}
                if(entry.length > 1) {
                    _entry.fallback = entry[1]
                }
                entry = _entry
            }

            // adopt iterable types
            for(let key of ['alt', 'fallback', 'type']) {
                // Every key in the entry is collected, corrected or defaulted
                if(entry[key] == undefined){
                    entry[key] = entryOpts[key]
                }

                if(typeof(entry[key]) == 'string') {
                    entry[key] = [entry[key]]
                }
            }

            // Flat types - copying the value without array detection
            for(let key of ['default', 'required']) {
                if(entry[key] == undefined){
                    entry[key] = entryOpts[key]
                }
            }

            keySet.push(entry)
       }

       return keySet
    }

    keys(){
        /* The DisplayObject keys map the internal option values to
        the LIB Mesg display object for the scene. The configuration
        provides a like-for-like translation and some syntax sugar.

        The basic key set defines an array of strings.
        Each item within the list may be a string or a definition object
        */
       console.warn('No keys() function.')
       return []
    }

    destroy(entity) {
        /* Destory one or more mesh instances, removing from the scene and
        marking the factory instance as deletable.
        if entity is undefined, the last internet mesh is deleted.
        If the entity is a string, the mesh at internal index is deleted.
        If instance is true - delete all meshes; flagging as 'destroy all'*/
        let standardDelete = function(mesh){
            // remove from list
            this.$meshes.splice(this.$meshes.indexOf(mesh), 1)
            // cycle last
            this.$mesh = this.$meshes[this.$meshes.length-1]
            // delete references
            delete this.$m[mesh.name]
            return true
        }.bind(this)

        if(entity === true) {
            // delete all
            for (var i = this.$meshes.length - 1; i >= 0; i--) {
                this.$meshes[i].dispose()
            }

            this.$meshes = []
            this.$m = {}
            this.$mesh = undefined
            return true
        }

        if(entity == undefined ) {
            let mesh = this.$mesh


            if(mesh) {
                // delete mesh - cycle internal last mesh as current mesh.
                mesh.dispose()
                return standardDelete(mesh)
            }

            let ml = this.$meshes.length
            if(ml > 0){
                // Put last in place of current.
                this.$mesh = this.$meshes[ml-1]
                return true
            }

            return this.$mesh != mesh
        }


        // delete mesh instance of name.
        if(typeof(entity) == 'string') {
            let mesh = this.$m[entity]

            if(mesh == undefined) {
                console.warn(`No mesh of name "${entity}"`)
                return false
            }

            if(mesh == this.$mesh) {
                return standardDelete(mesh)
            }
        }

        return false
    }

}


class OldDisplayObject {
    /* base object for all visual elements. */

    constructor(config){
        this.initConfig = config
        this.init(config)
    }

    init(config){
        /* ran after constructor setup by the engine to start
        api code. */
        if(config == undefined) {
            config = {}
        }

        if(this.$app == undefined) {
            if(config.app != undefined) {
                // apply the given app as the chosen app.
                this.$app = config.app
            } else {
                let instances = Garden.instances()
                if(instances.length == 1){
                    // Pick the first available app from the open instances list.
                    this.$app = instances[0]
                } else {
                    console.warn('No default app for', this)
                }
            }
        }
    }

    keys(){
        /* Key options for this LIB type*/
        return []
    }

    create(options, scene){
        /* Create mesh instance object */
        console.log('Add', options)
        options = options || {};

        if(scene == undefined) {
            if(options.scene) {
                scene = options.scene;
                delete options.scene;
            } else {
                scene = this.$app.scene
            }
        };

        let args = this.setup(scene, options);
    }

    setup(scene, options){
        console.log('Setup. Produce the required params for the instance.')
        return []
    }

    created(instance){
    }

    addTo(childBase, options) {
        /* Add a new or internal instance to the given entity as a child.*/

        let inst = this._instance
        if(inst == undefined) {
            let inst = this.create(options)
        }
        return this;
    }

    addToScene(options){
        return this.addTo(this.$app, options)
    }

    children(){
         /* return a list of children for this display object */
    }

    _createUniqueName(){
        /*Create a name for the babylon instance*/
        let n = this.instanceName().toLowerCase();
        return simpleID(n)

        let r = Math.random().toString(32).slice(-5);
        return `${n}_${r}`;
    }

    instanceName(v){
        /* REturn the type of class as string this class
        represents.
        Default; name constuctorName.
        */
        if(v !== undefined) { this._instanceName = v };
        return this._instanceName || this.constructor.name;
    }

}


class _Shape extends DisplayObject {
    /* A Basic shape for an entity in the view. */

    adapterName() {
        /* Return the name of the mesh object for the engine.*/
        let n = super.adapterName();
        return `Create${n}`;
    }

    adapterCallable(){
        /* the callable unit to call with the extracted adaoterName
        upon create.*/
        return  LIB.MeshBuilder
    }

    executeAdatper(adapterCallable, name, ...args) {
        return adapterCallable[name](...args);
    }

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides)
            ;
        return [name, options, scene]
    }

    _babylonParamsMissingKey(){
        return [false, undefined]
    }

    dupe(name) {
        name = name || this.id;
        let i = new this.constructor
        i._babylon = new LIB.InstancedMesh(simpleID(name), this._babylon);
        /* return a new instance or _duplicate item_ instance*/
        return i;
    }

    update(options) {
        /* Call an update for an item flagged with option updateable=True.
         A mesh with updated paramters mutates the currentl _bablyon item*/
        let _options = Object.assign({ instance: this._babylon, null: true}, options);
        let scene = this._app._scene;
        let arr = this.babylonParams(
            scene,
            _options
        );

        //console.log(arr)
        let mesh = this._babylon;
        let pathArray = options.pathArray
        //arr = [
        //    null, pathArray, null, null, null, null, null, null, mesh
        //];

        this.adapterCallable()[this.adapterName()](scene, _options)
    }
}

