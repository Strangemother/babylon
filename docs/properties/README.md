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

## Auto Properties

The function property assignment only occurs if the parameter exists within the instance configuration. For example; the `new Box({ color: 'red' })` will have the `color()` function. The `new Box()` will not have the function.

To ensure your property is created without the user specification, you change the location of the loading property. By default a `Property` class will exist in `Garden().instance().properties`.

Change the `targetObjectAssignment()` value to `autoProperties`.

```js
class ActionProperty extends BaseProperty {

    static targetObjectAssignment(classInstance, gInstance) {
        return 'autoProperties'
    }
}
```

### Creating an auto Propery

Let's build a `MaterialProperty`, Allowing the following:

```js
let box = new Box({ material: './assets/grid.jpg' })
box.addToScene()
box.material()
// Standard Material
box.material(new Texture)
box.material(new StandardTexture)
```

The material property should accept a `string`, `Garden.Texture` and `BABYLON.StandardTexture`. The `material` object property and the instance `.material()` function will call the AutoProperty we make.

#### Basic Structure

Define a class and register with Garden. Three core methods allow the creation:

```js
class MaterialProperty extends AutoProperty {
    key(){
        return 'material'
    }

    initProperty(item, obj, options){
        /* Init the property will generate the Color type before
        the instance is BABYLON created.
        setProperty applies the cached Color
        to the material. */
        let n = options[this.name]
        return [this.name, n]
    }

    getProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;

        if(!babylon) return undefined;
        return babylon[this.key()]
    }


    setProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        if(!babylon) return undefined;

        let m = value;
        if( IT.g(value).is('string') ){
            var mat = new Texture({ assetPath: value });
            let m = mat.asMaterial()
        };

        babylon[this.key()] = m
        return false;

    }
}
```


This example ensures the `action` property exists on evey Garden object.


#### Key

The key property names the value on the Garden instance. In this case we return the string `"material"`, creating `box.material()`

#### initProperty(item, obj, options)

The `initProperty` function calls immediately providing the Garden instance `item`, `obj`; a current set of generated values for the new BABYLON instance, and `options` given by the user.

Return the key you wish to use for the Garden instance and the initial value for your property.

```js
// ...snip initProperty
return ['material', 'myasset.jpg']
```

You'll change this to accept the users option (if any).

```js
class MaterialProperty extends AutoProperty {
    initProperty(item, obj, options){
        let n = options[this.name]
        return [this.name, n]
    }
}
```

The options may contain the "material" key

```js
new Box({}) // no material
new Box({ material: 'asset.jpg' }) // material
```

This will call before `setProperty` or `getProperty`. The BABYLON instance will not exist. Any value returned will override the user value (if any).

If you provide a value for the second argument; "./myAsset.jpg", your `setProperty` method will call.

If the second argument is `undefined`, the `setProperty` will not be called.

#### getProperty(instance, key, value, babylon)

The `getProperty` calls when a user accesses your AutoProperty instance. In the example `.material()`. If no value is given to the `material()` function `getProperty` is called.

Return any value for the user API, in most Garden cases, the true BABYLON reference is returned; for speed and ease.

For our example `MaterialProperty`, we can return the BABYLON instance `material` key

```js
class MaterialProperty extends AutoProperty {
    getProperty(instance, key, value, babylon) {
        babylon = babylon == undefined? instance._babylon: babylon;
        if(!babylon) return undefined;

        return babylon.material
    }
}
```

## Getter Setter Properties

A live property will provide a method or a getter setter property to your Garden instance. This help generate an API to drive your BABYLON object.

Creating a property bt default would generate a chain method:

```js
class ColorProperty extends BaseProperty {

}

box = new Box()
box.color('red')
```

This is some demo code of the _color_ function. To change this to a getter setter, apply the `gettersetter` function to your class.

Here is an example of the `wireframe` property:

```js
class WireframeProperty extends BaseProperty {
    getterSetter(){
        return true
    }
}

box = new Box();
box.wireframe
// false
box.wireframe = true
// true
```

TouYou can see in the getter setter example the `wireframe` property is not a function.
