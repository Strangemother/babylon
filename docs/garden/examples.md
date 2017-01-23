# Examples

> Yummy the fun bits! Most examples will work in different styles. Remember Garden generates BABYLON objects. Consider Garden as a toolshed for BABYLON.

Any example needs the basics. A babylon setup out the box:

### Config

You main config component requires

```
window.app = Garden.run(CONFIG)
```

Or load it early and `run()` later

```
Garden.config(CONFIG)
var app = new Garden.run()
```

## Making an item

Through luck of the API, you can pick your flavour of setting up base items. Garden generally factory generates BABYLON items.


##### Garden class

With your Garden app setup, you can apply a Garden class without any setup:

```js
boxMesh = app.children.add(Box)
```

##### Garden class with config

Apply a configuration for your object through `add`

```js
sphereMesh = app.children.add(Sphere, { position: [1,1,1] })
```

With Garden options, you can take advantage of Garden loadouts, such as omiting a `new BABYLON.Vector3(1,1,1)` for an array `[1,1,1]`

##### Garden Instance

You'll notice `add()` always return a BABYLON `Mesh` instance. The Garden type lives in parallel

```js
tube = new app.shapes.Cylinder( { position: [1,2,3] })
mesh = app.children.add(tube)
```

Every Garden object has an `addToScene()`. This is a shortcut to `addTo(Garden().instance().scene())`

```js
tube = new app.shapes.Cylinder
mesh = tube.addToScene()
```

You can pick any BABYLON item from a Garden instance:

```js
mesh == tube._babylon
tube.babylon.position == tube.position()
```



### Light

You'll always need to light your Scene. A basic sky light:

```js
light = new app.lights.HemisphericLight
// HemisphericLight { id: "380rdbl3nt8"}
light.addToScene()
```

#### Box and Sphere

##### A Box to scene

Every Shape type has an `addToScene()`

```js
box = new Box({ color: 'green' })
box.addToScene()
```

##### A Sphere to children

But you can always add to the `children` of the application:
```js
ball = new Sphere({ color: 'pink' })
app.children.add(ball)
```

##### Many item to addMany

You can add many at once:

```js
ball1 = new Sphere({ color: 'red', position: [0,2,0] })
ball2 = new Sphere({ color: 'yellow', position: [0,1,0] })
ball3 = new Sphere({ color: 'green', position: [0,0,0] })

let [mesh1, mesh2, mesh3] = app.children.addMany(ball1, ball2, ball3)
```


#### Camera

You'll want to add a camera. The first argument `activate=true` is optional. You can create many cameras, and switch between them when required.

You do not need to add a camera to the scene.
```js
camera = new app.cameras.ArcRotateCamera(activate=true);
// active camera
freeCam = new FreeCamera();
freeCam.activate()
```

#### Ground

Make a ground:

```js
let g = new app.named.Ground;
// Ground
g.addToScene({ width: 6, height: 6 })
// GroundMesh
g.position(0,-.5,0)
// Vector3 {x: 0, y: -0.5, z: 0}
```

#### Box and Light

##### Basic

As basic elements:

```js
app.children.addMany(Box, app.lights.HemisphericLight)
```

##### Expanded with Color
To expand this, including a color:

```js
box = new Box({color: 'red'});
box.addToScene()
light = new app.lights.HemisphericLight()
light.addToScene({color: 'white' })
```

Change this to a light blue light bulb and a white box.

```js
box = new Box({color:'white'})
box.addToScene()

light = new app.lights.HemisphericLight()
light.addToScene()
light.color('lightBlue')
```

##### Garden items only

Another method to write the same code. We have a red light an a default white box.

```js
box = new Box()
light = new app.lights.HemisphericLight({ color: 'red' })
app.children.addMany(box, light)
```

#### Build a Sky Box

Using a `SkyBox` class

```js
b = new SkyBox({assetName: 'mountains'});
mesh = b.addToScene();
```

