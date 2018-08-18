# Animation

A Babylon animation is setup within the animation chain of an object.


### Babylon Example

To generate a `BABYLON.Animation` using BABYLON animation:

https://doc.babylonjs.com/tutorials/Animations

_// Basic Scene_
```js
let light = app.children.add(app.lights.HemisphericLight)
let camera = new app.cameras.ArcRotateCamera(activate=true)
let box = new Box({ color: 'red' })
let mesh = box.addToScene()
```

_// Build animation_

```js
let anim = new Animation({ targetProperty: 'scaling.x' })
let babylonAnim = anim.create()

let keys = [{ frame: 0, value: 1}, { frame: 50, value: .2}, {frame: 100, value: 1}]
babylonAnim.setKeys(keys);
```

_// Add the BABYLON animation to the `mesh`. Start the animation within the scene._

```js
mesh.animations.push(babylonAnim)
let animation = app.scene().beginAnimation(mesh, 0, 100, true)
```

---

Check on the animation using Garden caller. Every call will yield the updated result.

```js
box.scaling()
// Vector3 {x: 0.6636800000000003, y: 1, z: 1}
box.scaling()
// Vector3 {x: 0.7635247999999992, y: 1, z: 1}
```

### Garden Example

The can be applied using the Garden tooling

_// Basic Scene_
```js
let camera = new app.cameras.ArcRotateCamera(activate=true)
let box = new Box({ color: 'green' })
let [light, boxMesh] = app.children.addMany(app.lights.HemisphericLight, box)
```

_// Build animation_

```js
anim = new Animation({ targetProperty: 'scaling.x' })
anim.frame(0, 1).frame(50, .4).frame(100, 1)
box.animate(anim)
```

---

`animate()` makes and runs the Animation. It accepts a Garden Animation type. The `anim.frame()` appends an animation keyframe to the Animation keys.

#### Break down

You can break this down for more expressive work:

```js
gardenAnim = new Animation({ targetProperty: 'scaling.x' })
let keys = [
    { frame: 0, value: 1}
    , [50, .2]
    , [100, 1]
]
let frames = gardenAnim.frames(keys)
```

Apply _frames_ to your animation. the `{ frame: 0, value: 1}` object can also be an array of `[frame, value]`

Setting the animation, you apply it to a `mesh`, and start within the `scene`

Set an animation with a garden instance

```js
app = Garden.run(CONFIG)
box = new Box({ color: 'green' })
mesh = box.addToScene()

// scene.beginAnimation
babylonAnim = app.animate(box, gardenAnim)
// BABYLON.Animatable
babylonAnim.stop()
```


