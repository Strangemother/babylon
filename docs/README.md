# Garden for Bablyon.

Bablyon JS is a great 3D framework for the web. Here are some tools to utilize the base application will help with basic development.

Garden helps you write you babylon, performing all the boilerplate work:

```js
app = Garden.run({ canvasName: '#gameCanvas' })
app.children.addMany(Box, app.lights.HemisphericLight)
```


Completely written in ES6, It's designed to be thin and easy to understand. This allows you to utilize the raw functionality of Bablyon without another library layer.

The components provided allows quicker prototyping and removal of the boilerplate for any project.

Lets look at a basic scene:

```js
var main = function(){
    window.app = new Main(CONFIG);
}

class Main extends Garden {

    init(config){
        super.init(config)
        this.run({
            backgroundColor: [.2, .1, .1]
        })
    }
    start(){
        this.box = new Box({size: 3})
    }
}

;main();
```

This will run an entire BablyonJS scene, complete with Camera and Scene. The Canvas, Engine and other default options are ready for use or override.

## With Framework

Garden can help run your scene. The same ball on ground example with Garden tools:

```html
<canvas id='garden' />
```

```js
app = Garden.run({ size: [800, 600] })

ball = new Sphere({ position: [0, 0.5, 0]})
light = app.lights.HemisphericLight
ground = new Ground({width:6, height:6})
camera = new ArcRotateCamera(true)

app.children.addMany(ball, light, ground)
```


## No Framework

Use Garden like a toolshed, calling for BABYLON parts and writing your own code.

```js
let boxMesh = app.children.add(Box, { position: [1,1,1]})
boxMesh.position == BABYLON.Vector3
```

Copied from the BablyonJS tutorial, we can create a ground and sphere. Fetch BablyonJS `Scene` by calling `app.scene()`

_Ignoring Garden, using BABYLON:_
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

Use Garden to generate your babylon object. The `Box` class and `HemisphericLight` are `Garden` classes. `boxMesh` and `light` are BABYLON instances.

```js
let app = Garden.run(CONFIG);
let [boxMesh, light] = app.children.addMany(Box, app.lights.HemisphericLight);
let camera = new ArcRotateCamera(activate=true)
```

You don't need to some items, in this case the `camera` has a simple `activate` argument. There are other ways you can activate your camera. It's all designed to be as quick as possible.

```js
let otherCam = new app.lights.FreeCamera()
otherCam.activate()
// and switch!
camera.activate()
```

Other shortcuts are built into `Garden` instances. Lets play with a Box.

```js
let app = Garden.run(CONFIG);
// First we need a light.
light = app.children.add(app.lights.HemisphericLight);

let box = new Box()
let mesh = box.addToScene()
let material = box.color('red')
```

Notice when we use the Garden stuff; `Box`, `addToScene` and `color`, the return value is a BABYLON object.



### init

The init function runs after the base application is prepared. `BablyonInterface.run` starts the babylon engine.

You can write you code functionally or classy. Class bassed extension is my favorite in ES6 becuase of its cleaner dialect:

```js
class Main extends Garden {

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



