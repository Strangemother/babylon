// http://doc.babylonjs.com/tutorials/Cameras

class Camera extends BabylonObject {

    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.cameras */
        return 'cameras'
    }

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides)
            , v
            ;

        let a = [name];
        let keys = this.keys();

        for(let key of keys){
            if(options[key]) {
                a.push(options[key]);
            } else {
                v = this._babylonParamsMissingKey(key, keys, options, scene);
                a.push(v);
            }
        };


        if(a.length != keys.length + 1) {
            Garden.handleWarning(
                    'Camera.babylonParams.options'
                    , 'Given parameter length does not match API parameter length'
                )
        };

        a.push(scene);

        return a
    }

    _babylonParamsMissingKey(key, keys, options, scene) {
        /* Whilst populating the BABYLON instance parameters the `key` does
        not exist within `options`. */
        let n = `${key}Key`;
        if(this[n] != undefined) {
            return this[n](options, scene)
        };

        Garden.handleError(
                    'Camera.babylonParamsMissingKey'
                    , `Missing key "${key}"`
                )
    }

    babylonFuncName(...args) {
        /* Bablyon function builds XXXCamera. By default
        this is FreeCamera */
        let n = this.shapeName(...args);
        return `${n}`;
    }

    babylonCall(...args) {
        /* Produce a babylon object using the given args as
        parameters for the CreateXXX call.
        returned is a babylon instance. */
        this._babylonParams = args;
        let n = this.babylonFuncName(...args);
        return new BABYLON[n](...args);
    }

    shapeName(...args) {
        /* Return the partial name of the BABYLON camera type.
        Default: 'free' */
        return this.type() || 'Free'
    }

    activate(scene, control=true, cache=true) {
        /* Activate the camera, implementing as the scene.activeCamera.
        If `control` is true (default), the camera will take control
        of the canvas.*/
        let app = Garden.instance();
        let camera = this._babylon;

        scene = scene || app.scene();
        if(camera == undefined) {
            camera = this.create({});
            if(cache == true) {
                this._babylon = camera;
            }
        };

        scene.activeCamera = camera;
        if(control == true) {
            return this.attach(app, cache);
        };

        return camera;
    }

    attach(app, cache=true) {
        /* Attch this instance to the scene. If
        the bablyon instance does not exist, Garden.instance()
        is used. If the camera instance does not exist,
        this.create() is called.
        Returns attached camera.*/
        app = app || Garden.instance()
        let camera = this._babylon;

        if(camera == undefined) {
            camera = this.create({})
            if(cache == true) {
                this._babylon = camera
            }
        };

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

    alphaKey(){
        return -0.3;
    }

    betaKey(){
        return 0.9;
    }

    radiusKey() {
        return 7
    }

    targetKey() {
        return new BABYLON.Vector3.Zero()
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











