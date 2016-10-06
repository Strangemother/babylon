;(function(){

I._ = class Light extends I.BabylonMutator {

    __init__() {
        var v = super.__init__.apply(this, arguments) || this
        Object.assign(this, this.defaults())
        // return this._proxy
    }

    defaults(){
        /* Applied as defaults and required keys */

        return  {
            //position: new BABYLON.Vector3(0, 2, -1)
            intensity: .1
        }
    }

    itemFunction(options, scene){
        /*return the function used to create the mesh object.
        Given for optional use is options (or config) for your element.
        This is unused for the BabylonMesh class. */
        //return BABYLON.MeshBuilder[this.itemFunctionName(options)].bind(BABYLON.MeshBuilder)

        var self = this;
        // Same function sig as the class inline arguments
        return function(name, position, scene){

            position = self.toVector(position) || options.position || self.defaultPosition(scene);
            name = name || options.name || self.generateName(config.type);
            scene = scene || I.scene();

            return new BABYLON[self.itemFunctionName(options)](name, position, scene);
        }
    }

    toVector(v) {
        if( IT.g(v).is('object') ) {
            if( v.position ) {
                return v.position;
            }

            if( Object.keys(v).length == 0 ) {
                return this.defaults().position
            }
        }
    }

    defaultPosition(scene){
        return new BABYLON.Vector3(0, 2, 0);
    }

    itemFunctionName(/*options, scene*/){
        /* return the name of the function from babylon*/
        return 'HemisphericLight'
    }
}

})()
