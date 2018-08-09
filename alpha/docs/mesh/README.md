# Mesh

A Mesh mimics the interface of a BABLYON Mesh. When using a `Mesh` your using useful tools to generate and maintain a BABLYON Mesh.

Creating a basic box:

```js
app.children.add( new Box )
```

Options are applied when required, the merging occurs before `.create()`. The result used exists within `Mesh._bablyonArgs`:

```js
var i = new Box({ width: 4 });
app.children.add( i, { height: 3 } )
```

The result generates a box `width=4` `height=3`.

All types are available in a function call `Garden.create` state function:

```js
Garden.create('box', { width: 3})
```

This uses the `Box` scene instance and `Box().create()`.
Similarly, you can perform the same with `Box().addTo`:

```js
b = new Box
b.addTo(app /*, {width: 3} */)
```

anything with a `children` manager can handle a new object.

Destroying an object is one command. You can regenerate from the same parameters:

```js
b=new Box
b.addTo(app /*, {width: 3} */)
b.destroy()
b.addToScene()
```

All basic BABYLON types are extended in this manner. checkout `shapes.js` for the classes. You can find class instances in you main app `app.shapes`.


+ Box
+ Sphere
+ Cylinder
+ Plane
+ Ground
+ GroundFromHeightMap
+ TiledGround
+ Disc
+ Torus
+ TorusKnot
+ Polyhedron
+ IcoSphere
+ Decals


## Garden Instance

When working with a view item, it has two parts. the `Garden` instance and the `BABYLON` object it drives.

Garden is considered a tool to help prototype your BABYLON work - saving a few keystrokes. the Garden Library will not have everything you need; BABYLON will.

To help drive your BABYLON work, some methods are provided on your Garden instance. They're shortcuts for boring code. Lets look at some of the fun ones:


### color()

Add and change the colour of a BABYLON mesh.

```js
let box = new Box({ color: 'green' });
let mesh = box.addToScene();
let material = box.color('white')
let color = box.color();
```

The `color` method creates a new `StandardMaterial` with `Color4` diffuse and assign it to your mesh. When reassigning a new color, a new material is created with the new color.

A recall to `color()` returns the chained throughput value - the original `Color4`.

The color value can be any valid `Color` class or color string.

### wireframe

The wireframe property switches the wireframe value of the mesh material.

```js
let box = new Box({ color: 'green' });
let mesh = box.addToScene();
box.wireframe;
// false
box.wireframe = true;
// true;
```

The `wireframe` property calls the `color` method if a material does not exist, then flags the `wireframe` property of the material.
