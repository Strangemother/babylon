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

All types are available in a function call `MeshTools.create` state function:

```js
MeshTools.create('box', { width: 3})
```

This uses the `Box` scene instance and `Box().create()`.
