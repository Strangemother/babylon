# Architecture

The source provides a layer of abstraction for BabylonJS. To understand how and why some the choices were made - I tried best to cover the important points of the code and explain the reasoning.

## Concept

You can consider `Garden` and it's integration method as an _Interface_, following a BDD style for a nice API. All the components provide hlpeful tools to build BABYLON instance objects.

The created `Garden` instances run in-parallel with the real `BABYLON` instance. You can consider the source as _boilerplate_ and you're encouraged to leave the API behind and use the real BABYLON instances.

### Why It's Developed

I really like BABLYON and enjoy sketching out small examples for myself. The BABYLON API is very expressive, allowing for a brilliant architecture. I find this a lot of code to copy/paste and tend to replicate the basic pattens.

After a few attempts, I have a number of very useful tools. I wrap it up - add some docs and store it in the cloud!

Now everyone can see how useful this is.

## Inside

The entire code base is designed for a working purpose. I don't want another library to learn - Babylon is just right for me - I just something I can use from protoype to prod without swapping out my own crud.

Using these components allows the generic adaptation of the start pattens. When I need more, I work with the (always expected) `_babylon` instance.

I don't want this to change - So I ensured everything I created, started with BABYLON first.

### Transparency

The `Garden` api does no replace `BABYLON`. All classes and instances drive a `BABYLON` instance, with a light adaptation to babylon.

In most cases the class is designed to generate and edit a running BABYLON instance. An example; the `Garden::Camera` creates a `BABYLON.FreeCamera` and attaches control using the standard BABYLON functions. Using a `Garden` instance saves a few keysrokes.

### Extendability

All classes given inherit from a core set of light adapting classes. These help to _hoist_ the classes into existence. Clever inheritence ensures a _short method chain_ to the real BABYLON instance.

This allows the ditching of `Garden` when required without hard refactor.

### Readability

The code within `Garden` is a teaching and thinking tool. Prototyping needs clarity, so each core class becomes its own documentation.

Using ES6 and _adapter pattern_ inheritence, a `Box` class looks like this:

```js

class Box extends Shape {
    /* A basic mesh object to help build BABYLON.Mesh components*/

    keys(){
        return [
                //size    (number) size of each box side  1
                'size'
                //height  (number) height size, overwrites size property  size
                , 'height'
                //width   (number) width size, overwrites size property   size
                , 'width'
                //depth   (number) depth size, overwrites size property   size
                , 'depth'
                //faceColors  (Color4[]) array of 6 Color4, one per box face  Color4(1, 1, 1, 1) for each side
                , 'faceColors'
                //faceUV  (Vector4[]) array of 6 Vector4, one per box face    UVs(0, 0, 1, 1) for each side
                , 'faceUV'
                //updatable   (boolean) true if the mesh is updatable false
                , 'updatable'
                //sideOrientation (number) side orientation   DEFAULTSIDE
                , 'sideOrientation'
        ]
    }
}
```

You're encouraged to read BABYLON js documentation to implement your box.

### Usability

To assist with your preference and code style, the `Base` class provides an API to the adapter. Providing options to the `Garden` instance will derive a final adaption when generating your BABYLON instance.

All these methods of configuration work:

```
b = new Box({width: 1});
mesh = b.create({ width: 3});
app.children.add(mesh)

app.children.add(new Cylinder, { width: 4 })

s = MeshTools.make('sphere', { width: 1})
```

There are additional options to altering a component state, all of which manage a real BABYLON instance.

