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


## Gettings started

The API version has this built in. The `Camera().activate(scene)` can perform all the required attaching:

```js
let arcCam = new ArcRotateCamera({
        alpha:1
        , beta:4
        , radius: 3
        , target: new BABYLON.Vector3(0, 0, 0)
    })

arcCam.activate(/* scene, control=true*/)
```

All configurations are optional

The `scene` is optional, as the default scene is found in your app instance. `Garden.instance().scene()`.

> If you're working with more than one instance, you should pass the `scene`, as the first scene is used by default.

You can run more than one camera, switching as needed.

```js
a = new GamepadCamera()
b = new ArcRotateCamera()

a.activate()
b.activate(control=false)
a.activate()
```

The `control` changes the input device to the cameras utilities. If `control=false` the `camera.attachCanvas` is not called.

Babylon does a perfect job of handling cameras and the view will smoothly transition to a camera.

The cameras extend and control real BABLYON types:
```
Camera
FreeCamera
ArcRotateCamera
AnaglyphArcRotateCamera
VirtualJoysticksCamera
AnaglyphFreeCamera
WebVRFreeCamera
TouchCamera
GamepadCamera
DeviceOrientationCamera
FollowCamera
```

