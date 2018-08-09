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

    setup(){
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


var simple_id_counter = 0
var simpleID = function(optional='', counter=undefined){
    let id = counter || simple_id_counter++; // Math.random().toString(32).slice(2);
    let insert = optional != ''? '_': '';
    return `${optional}${insert}${id}`
}

var complex_ids_counter = {
    defCounter: 0
}

var complexID = function(optional='defCounter') {
    if(complex_ids_counter[optional] == undefined) {
        complex_ids_counter[optional] = 0
    }

    complex_ids_counter[optional]++;
    return simpleID(optional, complex_ids_counter[optional]);

}
