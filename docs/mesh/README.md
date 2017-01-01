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
b=new Box
b.addTo(app /*, {width: 3} */)
```

anything with a `children` manager can handle a new object.

All basic BABYLON types are extended in this manner. checkout `shapes.js` for the classes. You can find class instances in you main app `app.shapes`:

```
Box
Sphere
Cylinder
Plane
Ground
GroundFromHeightMap
TiledGround
Disc
Torus
TorusKnot
Polyhedron
IcoSphere
Decals
```
