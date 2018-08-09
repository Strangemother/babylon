# Colours, Materials, Texture

The `colors` module provides a layer of abstraction for generation standard `Color3` BABYLON classes.

## Colors

```js
let green = colors.green()
// Color3(0, 1, 0)
```

Adding a color to a mesh through the definition object:

```js
let ball = new Sphere({ color: 'green' });
ball.color('white')
```

## Materials

You can generate your own colors using `color.make`. Materials exist in the same format, allowing the generation of `StandardMaterial` types. To apply a color, you'll need a material:

```js
let blueMaterial = materials.blue()
// StandardMaterial...
```

The `materials.color()` function can generate a color on the fly. Using a material just like a normal BABYLON material:

```js
box = new Box;
mesh = app.children.add(box)
mesh.material = materials.color(app.scene(), 'red')
```

Using the object:

```js
var b = new Box({
    material: './assets/textures/glassbuilding.jpg'
});
b.material('./assets/textures/grid.jpg')
```

## Babylon

Applying the `mesh.material` is the BABYLON way. The Same is achieved using the object definition value:

```js
let box = new Box({color: 'red'});
```

You can change the colour after the babylon instance is on the scene:

```js
box.color('red')
// StandardMaterial::diffuseColor == Color4 {r: 1, g: 0, b: 0, a: 1}
```

Because this property generates the correct values for BABYLON, you will expect a mutated result from the same call. A _set_ will apply new babylon values, a _get_ returns the bablyon state values:

```js
let ball = new Sphere({color: 'blue'})
ball.addToScene()
// Mesh
ball.color()
// Color4 {r: 0, g: 0, b: 1, a: 1}
ball.color('yellow')
// StandardMaterial
ball.color()
// Color4 {r: 1, g: 1, b: 0, a: 1}
```

Any Garden `BabylonObject` can accept a color:

```js
let light = new Light({ color: 'white' });
let triangle = new TriangleLines({ color: "green" })
let box = new Box({ color: "red" })
```

### Texture

The `Texture` class loads an image. You can apply this to your BABYLON mesh

```js
sphere = new Sphere;
mesh = sphere.create(/*{ position: [0, 1, 0]}*/);
texture = new Texture({ assetName: '1.jpg' });
material = texture.addToMesh(mesh)
```

#### With Standard Materials

Apply `BABYLON.StandardMaterial`

```js
box = new Box({size: 100})
mesh = box.addToScene();

// Generate Standard Material
mat = materials.standard()
mat.backFaceCulling = false
mat.disableLighting = true

// Some Garden shortcuts
mat.diffuseColor = colors.black()
mat.specularColor = colors.black()

// Use a BABYLON material
p = './assets/textures/CubeTexture/mountains/'
mat.reflectionTexture = new BABYLON.CubeTexture(p, Garden.instance().scene())
mat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE

// Add Material
mesh.material = mat
```

Interestingly you can perform the same with the `SkyBox` class

```js
b = new SkyBox({assetName: 'mountains'})
mesh = b.addToScene();
```

## Wireframe

A BABYLON material has a `wireframe` property. A shortcut to `ball._babylon.material.wireframe`:

```
let ball = new Sphere({color: 'blue'})
ball.addToScene()
ball.wirefame = true
```

A new white material is applied to the BABYLON mesh if a material does not exist.
