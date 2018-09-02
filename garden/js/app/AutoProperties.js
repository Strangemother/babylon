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



        instance._props = {}
        let properties = {}
        for (var i = 0; i < this.props.length; i++) {

            let prop = this.props[i]
            let def = prop.getDefinition(instance, initConfig)

            // prop._getFunc = prop.getGetterFunction(instance, def)
            // prop._setFunc = prop.getSetterFunction(instance, def)
            properties[prop.key()] = def
            this._propNames[prop.key()] = [prop, def]
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
        let color = colors.get(value)
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
