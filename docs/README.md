# Bablyon Interface.

Bablyon JS is a great 3D framework for the web. Here are some tools to utilize the base application will help with basic development.

Completely written in ES6, It's designed to be thin and easy to understand. This allows you to utilize the raw functionality of Bablyon without another library layer.

The components provided allows quicker prototyping and removal of the boilerplate for any project.

Lets look at a basic scene:

```js
var main = function(){
    logger('Main')
    let v = new Main(CONFIG);
    window.app = v;
}

class Main extends Base {

    init(config){
        super.init(config)
        log('Main.init')
        this.run({
            backgroundColor: [.2, .1, .1]
        })
    }
}

;main();
```

This will run an entire BablyonJS scene, complete with Camera and Scene. The Canvas, Engine and other default options are ready for use or override.

## No Framework

Copied from the BablyonJS tutorial, we can create a ground and sphere. Fetch BablyonJS `Scene` by calling `app.scene()`

```js
scene = app.scene()
var sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
sphere.position.y = 1;
var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
```

The Scene, Engine and Canvas are automatically created using default settings and configurations from your CONFIG object.

You'll need these outside the given source. ES6 is easy:

```js
let [scene, engine, canvas] = app.bablyonSet
```

Each exists within the `BablyonInterface` as `_scene`, `_engine` and `_canvas`:

```app
let app = new Main(CONFIG);
app._scene
app._engine
app._canvas
```

The `app` is an instance of `Base` extending the `BablyonInterface` class. A few methods exist to assist with boierplate run.

## Basic App

### init

The init function runs after the base application is prepared. `BablyonInterface.run` starts the babylon engine.

You can write you code functionally or classy. Class bassed extension is my favorite in ES6 becuase of its cleaner dialect:

```js
class Main extends Base {

    init(config){
        super.init(config)
        this.run({
            backgroundColor: [.2, .1, .1]
        })
    }

    start(scene) {
        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.position.y = 1;

        this.ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
    }
}

window.app = new Main(CONFIG);
```

The `init` function is called on a `new Main()`. We can call the `run` at any time - here we chose to call it immediately for ease. Providing an initial setup the application runs. The `start` function will call once.

We've plucked the BablyonJS _Getting Started_ tutorial code

### Mesh

Basic `Shape` classes help generate BABYLON objects for use within the scene. You can drive your application using the Mesh types, or use the build tools to shortcut the hard stuff.

#### Functional

A quick example of a box:

```js
let b = new Box({ width: 2 })
```

The initial options are optional. You can apply them later, when adding to the BABYLON scene:

```js
let b = new Box(/*{ width: 1 }*/)
let [scene, engine, canvas] = app.bablyonSet
let mesh = b.create(/*{ width: 2, height: 2 }, */scene)
```

The optional values can be applied on class instance `new Box({})` or the first argument of `Box.create({})`.

All BABLYON items require a `scene`. This is a mandatory argument and must be given to `Box.create(scene)` regardless of options.


Supplying options on class instansiation `new Box({})` and though the create function `Box.create({}, scene)` will merge the arguments for the BABLYON mesh. This includes any missing required arguments for any shape.

In this case, our example would produce a BABYLON option dictionary of:

``` js
{
    , width: 2
    , height: 2
    , depth: 1 // default
    // ...
}
```

#### Classy

When working with `children` of a `BabylonInterface` class, it gets easier:

```js
class Main extends Base {

    init(config){
        super.init(config)
        this.run({
            backgroundColor: [.2, .1, .1]
        })
    }

    runGame() {
        this.makeBox()
    }

    makeBox(){
        /* A simple make box example */
        let b = new Box
        this.children.add(b)
    }
```

In this case, the `options` and `scene` are optional. The `Box.create` function is called at the right time, inclusive of any mutating configurations of the parent.



