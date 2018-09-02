/*
The Auto Propties are a set of classes for auto loading instance properties
into a target DisplayObject or general LIB object.

For generic DisplayObject properties such as 'color' the creation definition
is abstracted from the LIB Mesh or Garden instance. This saves some memory and
provides a clean layer for extending.

A general auto property  applied a method or attribute to the DisplayObject instance
upon 'create'. The value can be assigned through a range of standard inheritence
strategies for compatability the general load methods:

    cube = new Cube({color: 'red'})
    cube.configure({color: 'red'})
    cube.create({color: 'red'})
    cube.addToScene({color: 'red'})
    cube.color = 'red'
 */

class AutoProperties {
    constructor(props=[]){
        this.props = []

        for (var i = 0; i < props.length; i++) {
            this.load(props[i])
        }

        this._propNames = {}
    }



    load(PropClass) {

        let propInst = new PropClass()
        this[propInst.key()] = propInst
        this.props.push(propInst)
    }

    hook(instance, initConfig, scene) {
        this.assignAutoProps.apply(this, arguments)
        this.assignInternalProps.apply(this, arguments)
    }

    hookProduceMesh(instance, libFunc, name, config, scene) {
        /* The instance is about to produce the required
        WEBGL LIB mesh with the given libFunc and additional
        properties.
        This is the last-stage for any configuration - therefore
        errors raise from here.*/
        debugger
    }

    hookMesh(instance, mesh, config, scene) {
        /* Given the instance and a mesh newly generated from the
        instance factory methods, hook the kets and internal
        properties for assignment. */
        // For each property assigned, perform
        // any early write such as a light 'specular'

        let mutants = instance._mutants
        let conf = instance.getConfig()
        for(let instanceKey in mutants) {
            let item = mutants[instanceKey]
            if(conf[instanceKey] != undefined) {
                console.log('Writing hookMesh', instanceKey, conf[instanceKey])
                mesh[item.libKey] = conf[instanceKey]
            }
        }

    }


    assignAutoProps(instance, initConfig, scene){
        /* Bridge the given display object instance with
        properties and attributes from the global assignment.
        The includes elements such as 'color' depending upon the
        keys() and other attributes */

        instance._props = {}
        let properties = {}

        for (var i = 0; i < this.props.length; i++) {
            /* Loop through each registered AutoProperty,
            building a definition of its 'object' and
            load into the Object. */

            let prop = this.props[i]
            let def = prop.getDefinition(instance, initConfig)

            // prop._getFunc = prop.getGetterFunction(instance, def)
            // prop._setFunc = prop.getSetterFunction(instance, def)
            properties[prop.key()] = def
            this._propNames[prop.key()] = [prop, def]
        }

        Object.defineProperties(instance, properties)
    }

    defaultInteralProp() {
        /* The definition of a single 'prop' object
        given through the API. The values assigned are
        defaulted and should be overriden by a given prop.
        */
        return {
            // option value though instance configurations construct, config, addTo...
            key: KEY_UNDEFINED
            // If undefined or not defaulted, should this property be
            // assigned to the lib mesh.
            // NOT IMPLEMENTED
            , forced: false
            // Fallback value
            , default: KEY_UNDEFINED
            // Mandatory with error
            // NOT IMPLEMENTED
            , required: false
            // is this an attribute or function on the instance
            // apply false for function, true for attribute
            , getterSetter: true
            // The value read/write to the LIB instance
            // leave undefined to match the given 'key'
            , libKey: KEY_UNDEFINED // 'specular'
            // The attribute or function name on the instance to access
            // the 'libKey' throughput.
            // Leave undefined to match the 'key'
            // Provide 'false' to _not_ apply a instance value - rather
            // the key is only given through the options and onto the LIB instance.
            , instanceKey: KEY_UNDEFINED // 'specular'
            // Allow the ability to edit the command before the LIB instance
            // is created. If false, an error will throw if this value is
            // changed before the LIB instance is created.
            // If true and the LIB instance is unavailable, the value is
            // cached until required.
            // NOT IMPLEMENTED
            , early: true
            // if compute is a function, the given getterSetter scope calls
            // 'compute()' on input values
            , compute: undefined
        }
    }

    assignInternalProps(instance, initConfig, scene) {
        /* Reading the instance.props(), create and configure
        mutation attributes for the instance.
        Utilize this objects prop cache if applicable. */
        instance._mutants = {}
        let properties = {}

        if(instance.props == undefined) {
            console.info('No props() to load')
            return
        }

        console.log('Assigning properties')
        let props = instance.props()
        let defaultProp = this.defaultInteralProp()

        let getSetFunc = function(value){
            let propKey = instance._mutants[this.libKey].propKey
            let $mesh = this.instance.$mesh
            // return value from lib mesh or apply a given value
            if($mesh == undefined) {
                // store until available
                let store = instance._mutants[this.libKey]
                if(value == undefined) {
                    return store.cache
                }

                console.info(`Store cache ${this.libKey}`)
                return store.cache = value
            }

            if(value === undefined) {
                return $mesh[propKey]
            }

            return $mesh[propKey] = value
        }

        let computedGetSetFunc = function(value){
            let propKey = instance._mutants[this.libKey].propKey
            let $mesh = this.instance.$mesh
            // return value from lib mesh or apply a given value
            if(value === undefined) {
                return $mesh[propKey]
            }

            return $mesh[propKey] = this.compute(value)
        }

        for (var i = props.length - 1; i >= 0; i--) {
            if(typeof(props[i]) == 'string') {
                props[i] = { key: props[i] }
            }

            let prop = Object.assign({}, defaultProp, props[i])
            let propKey = prop.key
            let instanceKey = prop.instanceKey
            let libKey = prop.libKey

            if(instanceKey == KEY_UNDEFINED) { instanceKey = propKey }
            if(libKey == KEY_UNDEFINED) { libKey = propKey }

            let boundScope = { instance, propKey, libKey, instanceKey }
            if(prop.computed != undefined ){
                boundScope.compute = prop.compute.bind(boundScope)
            }

            let def = {value: getSetFunc.bind(boundScope)}

            if(prop.getterSetter) {

                def = {
                    get: getSetFunc.bind(boundScope)
                    , set: getSetFunc.bind(boundScope)
                }
            }

            properties[instanceKey] = def
            instance._mutants[instanceKey] = {
                propKey, libKey, prop
            }
        }

        // loop for required
        for(let instKey in instance._mutants) {
            let prop = instance._mutants[instKey].prop
            if(prop.forced == true
                && instance.$mesh[instKey.libKey] == undefined) {
                instance.$mesh[instKey.libKey] = prop.default
            }
        }

        Object.defineProperties(instance, properties)

    }

    applyProp(instance, key, value) {
        if(this._propNames[key] == undefined) { return }
        this._propNames[key][0]._setFunc.call(instance, value)
    }

    applyToMesh(instance, meshInstance, config, scene) {
        for (var i = 0; i < this.props.length; i++) {
            this.props[i].applyToMesh(instance, config, meshInstance)
        }
    }
}

var KEY_UNDEFINED = '__undefined__'


class AutoProperty {

    isProperty(){
        return false
    }

    applyToMesh(instance, config, mesh) {
        this._setFunc.call(instance, config[this.key()], mesh)
    }

    key(){
        return this.constructor.name.slice(undefined, -8).toLowerCase()
    }

    getDefinition(instance, initConfig={}) {
        /* Return a function to apply to the given instance.  */

        // Fetch a instance specific 'get' function -
        // if the default name is missing, attempt the fall-back
        //
        // Specific get_
        let _f = this[`${instance.gardenType()}_get_hookFunction`]
        if(_f == undefined) {
            // unspecific hook
            _f = this[`${instance.gardenType()}_hookFunction`]
        }
        // Default back the inline handler.
        let f = _f == undefined ? this.hookFunction: _f
        let res = { value: f }
        let initValue = initConfig[this.key()]
        // produce getter setter.
        if(this.isProperty()) {
            let _s = this[`${instance.gardenType()}_set_hookFunction`]
            if(initValue != undefined) {
                (_s == undefined? f: _s).call(instance, initValue)
            }

            res = {
                get: f
                , set: _s == undefined? f: _s
            }

            this._getFunc = res['get']
            this._setFunc = res['set']
            return res
        }

        this._getFunc = this._setFunc = f
        return res
    }

    getGetterFunction(instance, definition){
        let def = definition == undefined? this.getDefinition(instance): definition
        if(def.value != undefined) {
            return def.value
        }

        return def.get
    }

    getSetterFunction(instance, definition){
        let def = definition == undefined? this.getDefinition(instance): definition
        if(def.set != undefined) {
            return def.set
        }
        return def.value
    }

    hookFunction(value, mwah){
        /* Caller function for the key on the instance. `this` is
         the given garden instance, not this property class instance.*/
    }
}


class ColorProperty extends AutoProperty {

    isProperty(){
        return true
    }

    hookFunction(value, mesh) {
        if(value == undefined) return undefined;
        let color = colors.get(value)
        let scene = this.scene? this.scene: undefined
        return materials.color(scene, color, value._gardenType)
    }

    Shape_hookFunction(value, mesh) {
        mesh = mesh == undefined? this.$mesh: mesh
        if(value == undefined) {
            //return autoProperties.color.Shape_get.apply(this, arguments)
            return this._props.color
        }

        let c = colors.get(value)
        this._props.color = c

        if(mesh != undefined){
            let scene = mesh._scene
            this._props.material = materials.color(scene, c, value._gardenType)
            mesh.material = this._props.material
        }

        return c
        //return autoProperties.color.Shape_set.apply(this, arguments)
    }
}


class MaterialProperty extends AutoProperty {

    isProperty(){
        return true
    }

    hookFunction(value, mesh) {
        mesh = mesh == undefined? this.$mesh: mesh

        if(value == undefined) {
            return this._props.material
        }

        let _material = value;

        if( typof(value) == 'string' ){
            var mat = new Texture({ assetPath: value })
            _material = mat.asMaterial()
        }

        this._props.material =  _material

        if(mesh != undefined) {
            mesh.material = _material
        }

        return _material
    }
}


class PositionProperty extends AutoProperty {

    isProperty(){
        return true
    }

    hookFunction(value, mesh) {
        return (value == undefined ? this.getProperty: this.setProperty)(value, mesh)
    }

    hookFunction(value, mesh) {
        mesh = mesh == undefined? this.$mesh: mesh

        if(value == undefined) {
            return this._props.position || ((mesh != undefined)? mesh.position: undefined)
        }

        if( IT.g(value).is('array') && value.length == 1
            && IT.g(value[0]).is('array')
            ) {
            value = value[0]
        }

        let v = asVector(value);
        this._props.position = v

        if(mesh != undefined) {
            mesh.position = v
        }

        return v
    }

}


var autoProperties = new AutoProperties([
    ColorProperty
    , MaterialProperty
    , PositionProperty
])
