# Developing

Garden is a thin client to BABYLON, proving a layer of abstraction for generating Babylon objects. Much of the Garden API calls Babylon methods using the same methods and properties you'd find in Babylon.

To ensure Garden is transparent the classes and _create_ functionality uses the es6 inheritence chain to understand how to generate BABYLON instances.

## Extending Garden

Nearly all of the Garden API lives in one class `BabylonObject`. Extending this as the base of your extension serves for much of your needs.

The tooling transparently drives the Babylon API. Calling a specific BABYLON method applies through the new class name you're creating


In this example, Lets _Garden_ the `BABYLON.Animation()` class.

```js
class Animation extends BabylonObject {
    static targetObjectAssignment(){
        /* Camera Animation are packaged into Garden.animates */
        return 'animates'
    }

}

Garden.register(Animation)
```

You can find this class:

```js
// You general scope, in the example case, the window
window.Animation

// Global instance
Garden.instance().animates.Animation
Garden.instance().named.Animation

// Standard instance
var app = new Garden()
app.animates.Animation
```

All classes extending `Animation` inherit `targetObjectAssignment()` therefore will exist within the same namespace `animates`. The same applies for almost everything in Garden.

The extension is nearly ready for BABYLON usage. All Garden generation starts with `BabylonObject.create()`

### Parameters

All BABYLON objects accept values on the constructor. In all cases this starts with a `name` and ends with the target `scene`

_BABYLON Call:_
```js
let boxMesh = BABYLON.
```

```js
a = new Animation
// Animation {_options: Object, _args: Array[0], id: "10bnsabp65"}
a.babylonParams()
// ["animation_g3m3b", undefined]
a.babylonParams('scene')
// ["animation_4acp8", "scene"]
```

Extend and alter the return of `babylonParams` to assign your object properties. In the example of `Shape` class; the `options` of any new Mesh is applied:

_Shape class snip:_
```js
class Shape extends BabylonObject {

    // ... snip

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides) ;
        return [name, options, scene]
    }
}
```

The `Animation` class needs `name`, `property`, `fps`, `type`, `behaviour`. We can extend our `babylonParams to return this instead:

```js
class Animation extends BabylonObject {
    static targetObjectAssignment(){
        return 'animates'
    }

    babylonSceneArg(scene){
        return false
    }

    keys(){
        return [
            'targetProperty'
            , 'framePerSecond'
            , 'dataType'
            , 'loopMode'
            , 'enableBlending'
        ]
    }
}
```

Garden maps Object to arguments:

```js
a = new Animation({ targetProperty: 'position.x' })
// Animation {_options: Object, _args: Array[0], id: "v67nnllf8kg"}
b=a.create()
// Animation {name: "animation_jfr08", targetProperty: "position.x", framePerSecond: 61, ...
```

Garden will utilize the `keys`, creating an ordered array for the `BABYLON.Animation` class. The BABYLON Animation class requires these arguments in order.

```js
a = new Animation({ targetProperty: 'position.x', loopMode: 1 })
```

### Keys

Provide default values for keys by applying an optional `[]Key()` function. This value is called if the property is not given through the configuration:

```js
class Animation extends BabylonObject {
    keys(){
        return [
            'targetProperty'
            , 'framePerSecond'
            , 'dataType'
            , 'loopMode'
            , 'enableBlending'
        ]
    }
}
```

The Animation class requires these parameters in order. Create the BABYLON instance

```js
let gAnimation = new Animation({ targetProperty: 'position', framePerSecond: 60 ... })
let bAnimation = gAnimation.create();
```

This calls `BABYLON.Animation` with ordered arguments:

```js
new BABYLON.Animation(name, targetProperty, framePerSecond, dataType, ...)
```

With no internal build-out, the BABYLON call is very cheap,

#### Optional Keys

the `targetKey` and `framePerSecond` are optional. If a `keys() => key` does not have a optional key function, Garden will raise an error if missing:


```js
    // ... Extend Animation
    targetPropertyKey(){
        console.log('targetProperty')
        return 'rotation.x'
    }

    framePerSecondKey(){
        return 61
    }
    // ...snip
```


```
a = new Animation({})
a.create()
// !Uncaught Error: babylonParamsMissingKey::Missing key "dataType"
```

Create a `[]Key()` method for every argument you need for your babylon.


#### Omit Scene

Nearly all BABYLON objects require `name`, `...` ,`scene`. The `keys()` and `generateOptions()` method will create arguments for your babylon call, adding additional arguments in `...`.

Some BABYLON objects do not accept the `scene` within the initial arguments, such as the `BABYLON.Animation`. In your class, add the `babylonSceneArg(scene)` method, returning a _falsy_

```js
class Animation extends BabylonObject
    babylonSceneArg(scene){
        return false
    }
}
```

When your BABYLON instance is created using `BabylonObject.create()`, the `Scene` parameter is not applied as the last argument.


