# Examples

> Yummy the fun bits! Most examples will work in different styles. Remember Garden generates BABYLON objects. Consider it as a toolshed.

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

With your Garden app setup, you can apply a Garden class without any setup:

```js
boxMesh = app.children.add(Box)
```

Apply a configuration for your object through `add`

```js
sphereMesh = app.children.add(Sphere, { position: [1,1,1] })
```

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


### Light

You'll always need to light your Scene. A basic sky light:

```
this.box = new Box({ color: 'green' });
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


