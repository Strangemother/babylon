class QuickProperty extends BaseProperty {

    setProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        return this._set(instance, babylon, key, value)
    }

    getProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        return this._get(instance, babylon, key, value)
    }

    _get(instance, babylon, key, value) {
        return instance[key]._value;
    }

    _set(instance, babylon, key, value) {
        instance[key]._value = value;
    }

}

class AutoProperty extends BaseProperty {

    static targetObjectAssignment(classInstance, gInstance) {
        return 'autoProperties'
    }

}


class ColorProperty extends AutoProperty {
    key(){
        return 'color'
    }

    instanceTypes() {
        return [
            ParametricShape
            , Shape
            , Light
            , BabylonObject
            ]
    }

    initProperty(item, obj, options){
        /* Init the property will generate the Color type before
        the instance is BABYLON created.
        setProperty applies the cached Color
        to the material. */
        let n = options[this.name]
        return [this.name, colors.get(n)]
    }


    setProperty(instance, key, value, babylon) {
        return this.Shape_setProperty(instance, key, value, babylon)
    }

    ParametricShape_setProperty(instance, key, value, babylon) {
        let scene = instance._app.scene()
        babylon = babylon == undefined? instance._babylon: babylon;
        if(!babylon) return undefined;

        let c = colors.get(value);
        instance._properties[key] = c
        return babylon.color = colors.get(c, 3)
    }

    Shape_setProperty(instance, key, value, babylon) {
        let scene = instance._app.scene()
        babylon = babylon == undefined? instance._babylon: babylon;
        if(!babylon) return undefined;


        let c = colors.get(value);
        instance._properties[key] = c
        return babylon.material = materials.color(scene, c, value._gardenType)
    }

    Light_setProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        if(!babylon) return undefined;

        let c = colors.get(value)
        instance._properties[key] = c
        babylon.diffuse = c
        return c;
    }
}


class PositionProperty extends AutoProperty {

    arrayProp(){
        /* The position can accept on or more vars*/
        return true;
    }

    setProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        if(!babylon) return undefined;
        if(IT.g(value).is('array') && value.length == 1 && IT.g(value[0]).is('array')) {
            value = value[0]
        }
        let v = asVector(value);
        babylon[this.key()] = v;
        return v;
    }

    getProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;

        if(!babylon) return undefined;
        return babylon[this.key()]
    }
}


class RotationProperty extends PositionProperty {}


class ScalingProperty extends PositionProperty {}


class TriggerProperty extends AutoProperty {

    setProperty(instance, key, value, babylon) {
        /*Trigger function calles a register on the native
        object BABYLO N ofor instance._babylon */
        if( value instanceof(Trigger) ) {
            return value.action(instance)
        } else {
            NotImplementedError.throw('trigger() method accepts Trigger only')
        }
    }
}


class WireframeProperty extends QuickProperty {

    static targetObjectAssignment(classInstance, gInstance) {
        return 'autoProperties'
    }

    getterSetter(){
        return true
    }

    _get(instance, babylon, key, value) {
        if(!babylon) return false;
        return babylon.material ? babylon.material.wireframe: false;
    }

    _set(instance, babylon, key, value) {
        if(!babylon) return false;
        let mat = babylon.material || instance.color('white')
        mat.wireframe = value;
    }

}

class EdgeRenderingProperty extends QuickProperty {

    static targetObjectAssignment(classInstance, gInstance) {
        return 'autoProperties'
    }

    getterSetter(){
        return true
    }

    _get(instance, babylon, key, value) {
        if(!babylon) return false;
        return babylon.material ? babylon.material.wireframe: false;
    }

    _set(instance, babylon, key, value) {
        if(!babylon) return false;
        if(value === false || value == 0) {
            babylon.disableEdgesRendering()
            return value;
        }

        if(value === true) {
            value = .99574318
        }

        babylon.enableEdgesRendering(value)
        return value;
    }
}

Garden.register(ColorProperty
    , PositionProperty
    , RotationProperty
    , ScalingProperty
    , TriggerProperty
    , WireframeProperty
    , EdgeRenderingProperty
    )
