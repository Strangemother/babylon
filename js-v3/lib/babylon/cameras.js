// http://doc.babylonjs.com/tutorials/Cameras

class Camera extends BabylonObject {

    constructor({activate = false, scene=undefined, control=true, cache=true} = {}){
        super(...arguments)
        /* A Camera is activated by:
            Camera(true)
            Camera({activate: true})
            Camera(active=true)
            */
        if( activate
            || ( arguments.length == 1
                && arguments[0] == true )
            ) {
            console.info('Activate camera', this.id)
            this.activate(scene, control, cache)
        }
    }

    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.cameras */
        return 'cameras'
    }

    getOrCreate(cache=false) {

        let camera = this._babylon;
        if(camera == undefined) {
            camera = this.create({})
            if(cache == true) {
                this._babylon = camera
            }
        };
        return camera;
    }

    activate(scene, control=true, cache=true) {
        /* Activate the camera, implementing as the scene.activeCamera.
        If `control` is true (default), the camera will take control
        of the canvas.*/
        let app = Garden.instance();
        let camera = this.getOrCreate(cache)

        scene = scene || app.scene()
        scene.activeCamera = camera;

        if(control == true) {
            return this.attach(app, cache,camera);
        };

        return camera;
    }

    attach(app, cache=true, camera) {
        /* Attch this instance to the scene. If
        the bablyon instance does not exist, Garden.instance()
        is used. If the camera instance does not exist,
        this.create() is called.
        Returns attached camera.*/
        app = app || Garden.instance()
        camera = camera || this.getOrCreate(cache)
        camera.attachControl(app._canvas, true)

        return camera;
    }

}

class FreeCamera extends Camera {

    // FreeCamera >> You can move around the scene with mouse and cursor keys
    // Parameters : name, position, scene
    keys(){
        return [
            'position'
        ]
    }

    positionKey(options, scene) {
        return new BABYLON.Vector3(0, 0, -5)
    }

    _example(scene) {
        var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 1, -15), scene);
        return camera;
    }
}


class ArcRotateCamera extends Camera {

    // ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
    // Parameters : name, alpha, beta, radius, target, scene
    keys(){
        return [
            'alpha'
            , 'beta'
            , 'radius'
            , 'target'
        ]
    }

    propKeys(){
        return [
            'position'
        ]
    }

    positionProp(ov){
        return asVector(ov || [0,0,0])
    }

    alphaKey(ov){
        return ov == undefined ? -0.3: ov;
    }

    betaKey(ov){
        return ov == undefined ? 9: ov
    }

    radiusKey(ov) {
        return ov == undefined ? 7: ov
    }

    targetKey(ov) {
        return ov || new BABYLON.Vector3.Zero()
    }

    _example(scene) {
        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        return camera;
    }
}


class AnaglyphArcRotateCamera extends ArcRotateCamera {

    keys(){
        let keys = super.keys()
        keys.push('eyeSpace');
        return keys
    }

    eyeSpaceKey(){
        return 0.033;
    }

    _example(){
        // AnaglyphArcRotateCamera >> Analglyph 3D using filter-shifted ArcRotateCamera
        // Parameters : name, alpha, beta, radius, target (in Vector3), eyeSpace (in degrees), scene
        var camera = new BABYLON.AnaglyphArcRotateCamera(
            "aar_cam"
            , -Math.PI/2
            , Math.PI/4
            , 20
            , new BABYLON.Vector3.Zero()
            , 0.033
            , scene);
    }
}


class VirtualJoysticksCamera extends FreeCamera {

    _example(){
        // VirtualJoysticksCamera >> Move in your world with on-screen Virtual Joysticks
        // Parameters : name, position, scene
        var camera = new BABYLON.VirtualJoysticksCamera("VJ_camera", new BABYLON.Vector3(0, 1, -15), scene);
    }
}


class AnaglyphFreeCamera extends FreeCamera {
    keys(){
        let keys = super.keys()
        keys.push('eyeSpace');
        return keys
    }

    eyeSpaceKey(){
        return 0.033;
    }

    _example(){
        // AnaglyphFreeCamera >> Analglyph 3D using filter-shifted FreeCamera
        // Parameters : name, position (in Vector3), eyeSpace (in degrees), scene
        var camera = new BABYLON.AnaglyphFreeCamera("af_cam", new BABYLON.Vector3(0, 1, -15), 0.033, scene);
    }
}


class WebVRFreeCamera extends FreeCamera {

    _example(){
        // WebVRFreeCamera >> Move in your VR scene
        // Parameters : name, position, scene
        var camera = new BABYLON.WebVRFreeCamera("WVR", new BABYLON.Vector3(0, 1, -15), scene);
    }
}


class TouchCamera extends FreeCamera {

    // TouchCamera >> Move in your world with your touch-gesture device
    // Parameters : name, position, scene

    _example(scene) {
        var camera = new BABYLON.TouchCamera("TouchCamera", new BABYLON.Vector3(0, 1, -15), scene);
        return camera;
    }
}


class GamepadCamera extends FreeCamera {

    // GamepadCamera >> Move in your scene with gamepad controls
    // Parameters : name, position, scene

    _example(scene) {
        var camera = new BABYLON.GamepadCamera("Camera", new BABYLON.Vector3(0, 15, -45), scene);
        return camera;
    }
}


class DeviceOrientationCamera extends FreeCamera {

    // DeviceOrientationCamera >> Move in your scene with device orientation
    // Parameters : name, position, scene


    _example(scene) {
        var camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 1, -15), scene);
        return camera;
    }
}


class FollowCamera extends FreeCamera {

    // FollowCamera >> Follow a mesh through your scene
    // Parameters : name, position, scene

    _example(mesh, scene) {
        var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);
        camera.target = mesh; // target any mesh or object with a "position" Vector3
        return camera;
    }
}


Garden.register(
        Camera
        , FreeCamera
        , ArcRotateCamera
        , AnaglyphArcRotateCamera
        , VirtualJoysticksCamera
        , AnaglyphFreeCamera
        , WebVRFreeCamera
        , TouchCamera
        , GamepadCamera
        , DeviceOrientationCamera
        , FollowCamera
    )
