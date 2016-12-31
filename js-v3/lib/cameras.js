// http://doc.babylonjs.com/tutorials/Cameras

class Camera extends Shape {

    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.cameras */
        return 'cameras'
    }

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides)
            ;

        let a = [name];
        let keys = this.keys();

        for(let key of keys){
            if(options[key]) {
                a.push(options[key])
            };
        };

        a.push(scene);

        if(a.length != keys.length + 1) {
            console.warn('Given parameter length does not match API parameter length')
        }

        // window.c = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene)

        return a
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

    activate(scene, control=true) {
        /* Activate the camera, implementing as the scene.activeCamera.
        If `control` is true (default), the camera will take control
        of the canvas.*/
        debugger;
        let camera = this._babylon;
        if(camera == undefined) {
            camera = this.create({})
        };

        scene.activeCamera = camera;
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

    _example(scene) {
        var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, new BABYLON.Vector3(0, 0, 0), scene);
        return camera;
    }
}

class TouchCamera extends Camera {

    // TouchCamera >> Move in your world with your touch-gesture device
    // Parameters : name, position, scene

    _example(scene) {
        var camera = new BABYLON.TouchCamera("TouchCamera", new BABYLON.Vector3(0, 1, -15), scene);
        return camera;
    }
}

class GamepadCamera extends Camera {

    // GamepadCamera >> Move in your scene with gamepad controls
    // Parameters : name, position, scene

    _example(scene) {
        var camera = new BABYLON.GamepadCamera("Camera", new BABYLON.Vector3(0, 15, -45), scene);
        return camera;
    }
}

class DeviceOrientationCamera extends Camera {

    // DeviceOrientationCamera >> Move in your scene with device orientation
    // Parameters : name, position, scene


    _example(scene) {
        var camera = new BABYLON.DeviceOrientationCamera("DevOr_camera", new BABYLON.Vector3(0, 1, -15), scene);
        return camera;
    }
}


class FollowCamera extends Camera {

    // FollowCamera >> Follow a mesh through your scene
    // Parameters : name, position, scene

    _example(mesh, scene) {
        var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 15, -45), scene);
        camera.target = mesh; // target any mesh or object with a "position" Vector3
        return camera;
    }
}











