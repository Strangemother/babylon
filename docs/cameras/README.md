# Cameras

The Camera class provides tools for generating BABYLON Camera types. It's designed to be quick. Lets dive in with a _near native_ BABYLON integration:

```js
let options = {
    alpha:1
    , beta:1
    , radius: 10
    , target: new BABYLON.Vector3(0, 0, 0)
};
let scene = app._scene;
let canvas = app._canvas;
let arcCam = new ArcRotateCamera(options);
let babylon = arcCam.create({});

scene.activeCamera = babylon;
b.attachControl(canvas, false);
```

The `ArcRotateCamera` class, generates and handles a real `Camera`, or in this case; `BABYLON.ArcRotateCamera`. The `arcCam.create()` returns the BABYLON camera, for us to play with naturally.
