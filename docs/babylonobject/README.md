# BabylonObject

The `BabylonObject` class drives much of the integration with `Garden` and BABYLON. It allows a quick abstraction to creating a BABLYON object. All basic elements such as the `Shape` and `Camera` start with a `BabylonObject`.

## Setup

The `create()` method generates a new BABYLON object. You define the object created by the `babylonCall(...args)` method. The `setup()` method creates any arguments required for the call

```
b = new BabylonObject({ foo: 2 })
args = b.setup(scene, {})
b.babylonCall(...args)
```

The bablon call function performs `BABYLON[name](...args)`.

Required keys for your BABLON call are made using an object. You can define the required keys using the `keys()` method:

```
class MyObject extends BablyonObject {
    keys(){
        return [
            'position'
            , 'vector'
        ]
    }

    vectorKey(){
        return BABYLON.Vector3.Zero()
    }
}
```

The _name_ and _scene_ are mandatory. There populated via the BabylonObject. The additional keys are requirements for your BABYLON object.

```js
o = new MyObject({ position: 1 })
```

The defined keys are mandatory and unpack in order for your babylon call:

```
args = b.setup({ position: 1, vector: 0})
b.babylonCall(...args)
```

Our assumed BABYLON object requires arguments [`name`, `position`, `vector`, `scene`]. You can define a default value for a key. In the example the `vector` key is omitted - calling `vectorKey()`.

If the key argument is missing and a default `[name]Key()` function is not defined, an error is raised.

## Altering the BABYLON call

The `babylonCall` method returns a newly created babylon instance. It's mapped to BABYLON namespace through a a standard reference.

You can change how BABYLON is called. In the `Shape` class, the BABYLON call is changed to access the `MeshBuilder`:

```
babylonCall(...args) {
    /* Produce a babylon object using the given args as
    parameters for the CreateXXX call.
    returned is a babylon instance. */

    this._babylonParams = args;
    let n = this.babylonFuncName(...args);
    return BABYLON.MeshBuilder[n](...args);
}
```

## API usage

You'll start with any base class you'll extend with Garden.

```js
class AutoTexture extends BabylonObject {
    static assignmentName(item) {
        return 'textures'
    }
}

Garden.register(AutoTexture)
```

This will stack your class and any extensions in `textures`. You can find it `Garden().instance().textures.AutoTexture`

The extension manages a BABYLON entity - such as a mesh or material. Nearly all Babylon items accept `name`, `options`, `scene` as arguments.

The `options` are inline arguments for your babylon call.

```js
new BABYLON[name](...args)
```

The name is default `"AutoTexture"` calling the `babylonFuncName()`

```js
class AutoTexture extends BabylonObject {
    babylonFuncName(...args) {
        /* Return the name of the function to execute on
        BABYLON[babylonFuncName] */

        return 'CubeTexture'
        // return this.type();
    }

    babylonFunc(){
        return BABYLON
    }
}
```

We've changed the `babylonFuncName` to `"CubeTexture"`, when we call `create()` function using these parameters

```js
let texture = new AutoTexture();
let babylon = texture.create()
```

This will call

```js
let babylon = new BABYLON['CubeTexture'](name, options, scene)
```

You'll need to change the inline arguments from [`name`, `options`, `scene`] to your custom arguments.

## Setting Keys

To change the `...args`, Apply `keys()` to your class, They become inline properties for your BABYLON call.

```js
class AutoTexture extends BabylonObject {
    keys(){
        return [
            'assetName'
            , 'assetPath'
        ]
    }

    assetPathKey(){
        return './assets/textures/'
    }
}
```

When instansiating your class, the `assetPath` is optional, as the `assetPathKey` can fill the missing option. The `name` is not optional

```js
let texture = new AutoTexture({ assetName: 'foo' })
let babylon = texture.create()
```

Using the above, we can generate a new Babylon item.

```js
new BABYLON["CubeTexture"](name, assetName, assetPath, scene)
```

You can add to `keys()`, applying more inline arguments to your BABYLON instance.

You can change the Babylon execution, allowing additional options in your class `keys()` and not for the inline arguments

### Change Babylon call

The `executeBabylon(babylonfunc, name, ..args)` method performs the call to make the BABYLON entity.

The `...args` are your `keys()` ordered inline. Change this call to perform your unique changes.

```js
class AutoTexture extends BabylonObject {
    executeBabylon(babylonFunc, name, assetName, assetPath, scene, ...args) {
        // new BABYLON["CubeTexture"](path, scene)
        let p = this.makePath(assetName, assetPath)
        return new babylonFunc[name](p, scene);
    }

    makePath(name, path){
        return `${name}${path}`
    }
}
```

In this example we've added `assetName`, `assetPath` and `scene` to the argument list. This is for readability. The values would exist in `...args` - in this example our remaining `...args` would be zero.

We've changed the babylon call to fix the complete path.

---

With a `Shape`, the `babylonFuncName()` call returns the `Shape.type()` - such as `Box`.

It's simple to see how BABYLON is integrated.

### Using your code

Your object is made to generate a babylon object using `MyObject.create()`. The BABYLON instance is not maintained by the `BabylonObject` class.

> The BabylonObject and all it's children are actually _factories_. Each `create()` call has **no** reference to your original class instance. You must add it as a child of the display list first. use `addToScene()` instead.

## Accessing Scene instance

There is more than one way to create and apply objects to the BABYLON scene. General style:

```js
let box = new Box()
let mesh = box.create()
```

The `box` does not have access to the `mesh`.

When using the child manager, you can gain access to the mesh. You change the standard `Garden().children.add`:

```js
let box = new Box
let mesh = app.children.add( box, { height: 3 } )
box._babylon == mesh
```

Alternatively, you can use to `addToScene()` method:

```js
let box = new Box
mesh = box.addToScene()
```
#### Why?

The `Box` class is a factory, generating a new box on `Box().create()` and returning a new BABYLON `Mesh`. When adding the `box` to the `children` of another instance requires `box._babylon` must exist, as `app.children.add` may happen at any time.

It's an accessor to the `Garden._displayList`. Items are not added to the `_displayList` by default.

---



You can access the referenced method the the _accessor_ `MyObject._bablyon` by connecting it to the __displayList_

### Using Scene Instance

A `BabylonObject` is connected to the _display list_ and returns the reference object though internal naming. This is to ensure the library is quick, and cross object referencing is mininimal.

If you wish to alter an existing BABYLON instance, you provide the relative methods on your class:

```js
class ActorBox extends BabylonObject {
    keys(){
        return ['position']
    }

    babylonCall(...args) {
        // build a box
        return BABYLON.MeshBuilder.CreateBox(...args)
    }

    get position(){
        let b = this._babylon;
        if(!b) Garden.handleError('missingBabylon', '_bablyon instance must exist')
        return b.position
    }

    set position(v){
        this._babylon.position = v
        return true;
    }
}

```


The `_babylon` variable does not exist when using the `create()` function - we can use the `addToScene()` function. Your box can maintain the position of your BABYLON instance:

```js
let b = new ActorBox({ position: BABYLON.Vector3.Zero() });
mesh = b.addToScene();
mesh.position.y= 10
// Now possible
b.position.x -= 10
```


