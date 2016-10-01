class Cameras extends CoreClass {
    /* A rangew of cameras managed by a GameInterface.*/

    get camera(){
        /* get the current camera*/
    }

    cameras(){

    }

    newCamera(){
        /* Return a new camera */
    }

    position(){
        return (new BABYLON.Vector3(0, 5, -10))
    }

    findPosition(config) {
        var p = (position && position.position ) == true ? position.position: config;
        p = p || this.position()
        return p;
    }

    getCamera(scene, config, forceOverride) {
        /* return a camera configured.*/
        var type = 'freeCam';

        if(config.type !== undefined) {
            type = config.type;
            delete config.type;
        };

        var [_type, _p] = this.loadConfig(scene, config)
        if(_type !== undefined && forceOverride == false) {
            type = _type;
        };

        var p = config;

        if(_p !== undefined ){
            var c = config
            if(forceOverride == false) {
                p = _p
            }
        }

        var camera = this[type](scene,  p)
        return camera;
    }

    loadConfig(scene, config) {
        /* returns type, config/position from config.js */
        var c = this.data.config.camera;
        if(c == undefined) {
            return [undefined, undefined]
        }

        if( it(c).is('object') == false) {
            // single property config
            return [c, undefined]
        } else if( it(c).is('array') ) {
            return [c[0], c[1]]
        }else {
            //
            return [c.type, c]
        }
    }

    freeCam(scene, position){
        // FreeCamera >> You can move around the scene with mouse and cursor keys
        // Parameters : name, position, scene
        // var camera = new BABYLON.FreeCamera("camera1", position, scene);
        var p = this.findPosition(position);

        var camera = new BABYLON.FreeCamera("camera1"
            , p
            , scene);

        return camera;
    }

    arcRotateCam(scene, position) {
        // ArcRotateCamera >> Camera turning around a 3D point (here Vector zero) with mouse and cursor keys
        // Parameters : name, alpha, beta, radius, target, scene

        var p = this.findPosition(position);

        var camera = BABYLON.ArcRotateCamera("camera1"
                , 0
                , Math.PI / 4, 0
                , p
                , scene);

        return camera;
    }

    gamepadCam(scene, position) {
        // GamepadCamera >> Move in your scene with gamepad controls
        // Parameters : name, position, scene

        var p = this.findPosition(position);
        var camera = new BABYLON.GamepadCamera("Camera"
            , p
            , scene);
        return camera;

    }

    followCam(scene, name, config) {
        var c = new FollowCam();
        var camera = c.create(scene, name, config);
        camera.__lib = c;
        return camera;
    }
}

class GameCamera extends GameSceneObject {
    /* wraps a camera to apply cheap settings*/
    config() {
        /* return an object used as a configuration entity to override. */
        return {}
    }

    getConfig(config){
        return Object.assign(this.config(), config);
    }


    get camera(){
        this._camera || this.create(this.scene)
        return this._camera;
    }

    create(scene, config) {
        // FollowCamera >> Follow a mesh through your scene
        // Parameters : name, position, scene
        this.config = this.getConfig(config);
        var camera = this.getCamera(scene, this.config.position);
        if(camera == undefined) {
            console.warn('Undefined GameCamera GameCamera.getCamera')
        }
        // camera.target = myMeshObject; // target any mesh or object with a "position" Vector3
        this._camera =  this.configure(camera);
        this.scene = scene;
        return camera;

    }

    configure(camera, config) {

        for(var name in config) {
            camera[name] = config[name]
        };

        return camera;
    }

    getCamera(scene, position){}

    activate(){
        this.scene.activeCamera = this.camera
        return this.scene.activeCamera
    }
}

class FollowCam extends GameCamera {

    config() {
        /* return an object used as a configuration entity to override. */
        return {
            radius: 30 // how far from the object to follow
            ,heightOffset: 8 // how high above the object to place the camera
            ,rotationOffset: 180 // the viewing angle
            ,cameraAcceleration: 0.05 // how fast to move
            ,maxCameraSpeed: 20 // speed limit
        }
    }

    getCamera(scene, position){
        var p = position;

        var camera = new BABYLON.FollowCamera("FollowCam"
            , p
            , scene);

        return position;
    }

}
