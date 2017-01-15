class ColorProperty extends BaseProperty {
    key(){
        return 'color'
    }

    instanceTypes() {
        return [
            Shape
            , Light
            , BabylonObject
            ]
    }

    initProperty(item, obj, options){
        /* Init the property will generate the Color type before
        the instance is BABYLON created.
        setProperty applies the cached Color
        to the material. */
        return [this.name, colors[options[this.name]]()]
    }


    setProperty(instance, key, value, babylon) {
        return this.Shape_setProperty(instance, key, value, babylon)
    }

    Shape_setProperty(instance, key, value, babylon) {
        let scene = instance._app.scene()
        babylon = babylon == undefined? instance._babylon: babylon;
        let c = colors.get(value);
        instance._properties[key] = c
        return babylon.material = materials.color(scene, c)
    }

    Light_setProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        let c = colors.get(value)
        instance._properties[key] = c
        babylon.diffuse = c
        return c;
    }
}

class PositionProperty extends BaseProperty {


    setProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        babylon[this.key()] = value;
        return value;
    }

    getProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        return babylon[this.key()]
    }
}

class RotationProperty extends PositionProperty {}
class ScalingProperty extends PositionProperty {}

Garden.register(ColorProperty, PositionProperty, RotationProperty, ScalingProperty)
