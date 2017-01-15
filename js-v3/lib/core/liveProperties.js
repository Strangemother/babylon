class ColorProperty extends BaseProperty {
    key(){
        return 'color'
    }

    initProperty(item, obj, options){
        console.log('init color')
        return [this.name, colors[options[this.name]]()]
    }

    afterProperty(babylon, instance, key, properties){
        let scene = instance._app.scene()
        babylon.material = materials.color(scene, properties[key])
    }

}

Garden.register(ColorProperty)
