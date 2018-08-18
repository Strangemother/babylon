class NewDisplayObject {
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
    }

    create(config, scene=undefined) {
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
        let [name, meshConf] = this.createMeshOptions(conf)

        if(scene == undefined) {
            // Notice the 'undefined' - allowing 'null' as a property.
            scene = this.discoverScene(conf)
        }

        let mesh = this.createMesh(name, meshConf, scene)
        return mesh
    }

    discoverScene(config){
        /* Find the selected scene */

        // Pull from force cache
        if(this.scene) { return this.scene }
        if(config == undefined) { config = this.getConfig() }

        // given in initConfig?
        if( config.scene != undefined ) {
            return config.scene
        }

        if(config.app != undefined) {
            /* Garden app instance - extract renderer*/
            return config.app.getRenderer().scene
        }

        try{

            // Get the master App.
            let instances = Garden.instances()
            // Pick last
            let instance = instances[instances.length - 1]
            return instance.scene
        } catch {
            console.error(`Could not automatically discover a scene: \n`
                    + 'scene;config.scene;app[last renderer]scene\n... do not exist.' )
        }

    }

    createMesh(config, scene) {
        console.log('Build display object',config, scene)
    }

    defaultConfig(){
        /* A Base configuration for any diosplay object. */
        return {
            /* Allow the caching of generated key paramter values
            to ensure a DisplayObject generates its Mesh keys once as it's expensive.*/
            bake: true
        }
    }

    getConfig(additionalConfig) {
        /* Return a complete object of all options for this display object */
        let result = Object.assign(
                this.defaultConfig()
                , this.initConfig
                , this.createConfig
                , additionalConfig
            )

        return result
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
        /* The DisplayObjecy keys map the internal option values to
        the LIB Mesg display object for the scene. The configuration
        provides a like-for-like translation and some syntax sugar.

        The basic key set defines an array of strings.
        Each item within the list may be a string or a definition object
        */
       return []
    }

}


class TestCube extends NewDisplayObject {

    keys(){
        /*
            The DisplayObjecy keys map the internal option values to
            the LIB Mesg display object for the scene. The configuration
            provides a like-for-like translation and some syntax sugar.

            The basic key set defines an array of strings.
            Each item within the list may be a string or a definition object
        */
        return [
            //size    (number) size of each box side  1
            { key: 'size', required: true }
            //height  (number) height size, overwrites size property  size
            // mesh param, fallback values
            , ['height', 'size']
            //width   (number) width size, overwrites size property   size
            , { key: 'width', fallback: 'size'}
            //depth   (number) depth size, overwrites size property   size
            , { key: 'depth', alt: 'length', fallback: 'size'}
            //faceColors  (Color4[]) array of 6 Color4, one per box face  Color4(1, 1, 1, 1) for each side
            , { key: 'faceColors', type: Array, alt: ['colors'] }
            //faceUV  (Vector4[]) array of 6 Vector4, one per box face    UVs(0, 0, 1, 1) for each side
            , 'faceUV'
            //updatable   (boolean) true if the mesh is updatable false
            , { key: 'updatable', type: Boolean, alt: ['allowUpdate', 'update'],  default: true}
            //sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
        ]
    }
}

class DisplayObject {
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

