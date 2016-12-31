var NotImplementedError = function(message) {
    this.name = 'NotImplemented';
    this.message = message || "The reference call is not implemented";
    this.stack = (new Error(message)).stack;
}

NotImplementedError.prototype = Object.create(Error.prototype)
NotImplementedError.prototype.constructor = NotImplementedError;
NotImplementedError.throw = function(m){
    let e = new NotImplementedError(m);
    throw e;
    return e;
}

class BabylonObject extends ChildManager {
    /* Interface the babylon method caller with the defined shape parameters.
    It's encouraged to use the native BABYLON Mesh. */
    constructor(...args){
        /* Constructor  call init, expects super. */
        super()
        this.init.apply(this, arguments)
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

    get _app() {
        /* Hook to the base app instance. For scene sharing*/
        return _instance
    }

    create(options, scene){
        /* Create the scene entity for babylon interface. Returned is the
        generated object for bablon*/
        if(scene == undefined) {
            if(options.scene) {
                scene = options.scene;
                delete options.scene;
            } else {
                scene = this._app.scene()
            }
        };

        let args = this.setup(scene, options);
        // Return babylon instance
        return this.babylonCall(...args);
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
        let _opts = Object.assign({}, r || {}, this._options || {}, options);
        if(r === undefined || cache == false) {
            return this.babylonParams(scene, _opts)
        };
        return r
    }

    addTo(childBase, options) {
        /* Add this element to the child list of the given parent.
        of childBase.children does not exist an error is thrown */
        if(childBase.children) {
            childBase.children.add(this, options)
        }
    }

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides)
            ;

        return [name, options, scene]
    }

    generateOptions(overrides){
        /* Return an options object for the babylon interface instance using
        all the internal and external attributes required. Provide an object
        for final key override.
        Returned is an object ready for babylon */
        let o = {}, v, key;

        for(key of this.keys()) {
            v = this.getOptionKey(key);
            if(v !== undefined){
                o[key] = v;
            }
        }

        for(key in overrides) {
            o[key] = overrides[key]
        }

        return o
    }

    getOptionKey(key) {
        /* return the value for the given key, used when building the options
        for the babylon instance*/
        return this[key]
    }

    generateName(){
        /*Create a name for the babylon instance*/
        let r = Math.random().toString(32).slice(-5)
        let n = this.type().toLowerCase()
        return `${n}_${r}`
    }


    destroy(){
        /* Remove the item from the view and destroy its data. This
        should attempt a complete memory removal. */
        return NotImplementedError.throw('BabylonObject.destroy() not implemented')
    }

    type(v){
        if(v !== undefined) { this._type = v };
        return this._type || this.constructor.name;
    }

    static make(cls, options) {
        /* Make a new instance of this Class.
        This class, is actually the first given argument `cls`.*/
        let item = new cls(options);
        return item;
    }

    babylonCall(...args) {
        /* Produce a babylon object using the given args as
        parameters for the CreateXXX call.
        returned is a babylon instance. */
        this._babylonParams = args;
        let n = this.babylonFuncName(...args);
        return BABYLON[n](...args);
    }

    babylonFuncName(...args) {
        let n = this.babylonFuncNamePartial(...args);
        return `Create${n}`;
    }

    babylonFuncNamePartial(...args) {
        /* Return the partial name of the object to create a full
        babylon name Create[name]. Default: 'Mesh' */
        return this.type();
    }

}

class Shape extends BabylonObject {
    /* A Basic shape for an entity in the view. */


    destroy(){
        /* Remove the item from the view and destroy its data. This
        should attempt a complete memory removal. */
        return NotImplementedError.throw('Shape.destroy() not implemented')
    }

    babylonCall(...args) {
        /* Produce a babylon object using the given args as
        parameters for the CreateXXX call.
        returned is a babylon instance. */
        this._babylonParams = args;
        let n = this.babylonFuncName(...args);
        return BABYLON.MeshBuilder[n](...args);
    }

    babylonFuncNamePartial(...args) {
        /* Return the partial name of the object to create a full
        babylon name Create[name]. Default: 'this.type' */

        return this.type();
    }

    static targetObjectAssignment(cls){
        /* Return a plural of the type*/
        return `shapes`;
    }

}


class TargetObjectAssignmentRegister {


    static register(...items){
        /* Register a component for later creation via MeshTool.make and .create*/

        for(let item of items) {
            let name = item.name.toLowerCase();
            MeshTools.named[name] = item;
            if(item.targetObjectAssignment) {
                let n = item.targetObjectAssignment(item)
                if(_instance[n] == undefined) {
                    _instance[n] = {}
                };

                _instance[n][item.name] = item
            }
        }
    }
}


class MeshTools extends TargetObjectAssignmentRegister {


    static make(type, options) {
        /* Genetate a Shape instance*/
        if(arguments.length <= 1) {
            options = type;
            type = undefined;
        };

        // Options or default options
        options = options || {};
        // Given type or the options.type or DEFAULT
        type = type || options._type || MeshTools.MESH;

        if(options._type) {
            delete options._type;
        };

        let item = MeshTools.named[type].make(MeshTools.named[type], options);
        return item;
    }

    static create(type, options, scene) {
        let item = MeshTools.make(type, options);
        // The given scene or the options scene
        scene = scene || (options != undefined? options.scene: undefined)

        if(scene == undefined) {
            let engine, canvas;
            [scene, engine, canvas] = item._app.babylonSet;
        };

        // Create new mesh
        let mesh = item.create(scene);
        // Add to display list.
        item._app.children.append(item, mesh, options)
        return item;
    }
}

MeshTools.MESH = 'Mesh'
MeshTools.named = {}
