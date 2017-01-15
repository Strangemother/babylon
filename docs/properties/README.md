# Properties

To extend BABYLON objects easily, you can build properties into your `BabylonObject` to assist in the API of your object. The class loader provides a cheap API for extending properties of an object.

Lets take a look at a basic property:

```js
let box = new Box({ color: 'green' })
box.color('red')
```

```js
let light = new SkyLight({ color: 'pink' })
light.color('white')
```

Under the hood, the API has called the babvlyon content correctly. The class supporting this is loaded in-parallel, providing a memory efficent and small coding footprint.

```js
class ColorProperty extends BaseProperty {
    key(){
        return 'color'
    }

    setProperty(instance, key, value, babylon) {

        let scene = instance._app.scene()
        babylon = babylon == undefined? instance._babylon: babylon;
        let c = colors.get(value);
        instance._properties[key] = c
        return babylon.material = materials.color(scene, c)
    }
}

Garden.register(ColorProperty)
```

With this in the code, all entities accept the `color()` functionality. We can extend this to run unique code on different class types. This ensures we can configure for different BABYLON types.

Convert the `setProperty` to class specific:

```js
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

    Shape_setProperty(instance, key, value, babylon) {
        let scene = instance._app.scene()
        babylon = babylon == undefined? instance._babylon: babylon;
        let c = colors.get(value);
        instance._properties[key] = c
        return babylon.material = materials.color(scene, c)
    }

    Light_setProperty(instance, key, value, babylon) {
        let c = colors.get(value)
        instance._properties[key] = c
        instance._babylon.diffuse = c
        return c;
    }

    setProperty(instance, key, value, babylon) {
        return this.Shape_setProperty(instance, key, value, babylon) {
    }
}
```


