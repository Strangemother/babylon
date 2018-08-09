
class CameraVR extends Garden {

    init(config){
        config = config || {};
        config.backgroundColor = [.2, .2, .4];
        super.init(config);
        //this.run();
    }

    camera(scene, canvas){
        var camera = new BABYLON.WebVRFreeCamera("camera1"
            , new BABYLON.Vector3(0, 0, 0)
            , scene, false, { trackPosition: true });

        camera.deviceScaleFactor = 1;
        return camera;
    }

    start(){

        let scene = this._scene
        let canvas = this._canvas

        let camera = this._camera

        scene.onPointerDown = function () {
            scene.onPointerDown = undefined;
            camera.attachControl(canvas, true);
        }

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.7;

        var rightBox = BABYLON.Mesh.CreateBox("sphere1", 0.1, scene);
    }

    shouldAttachCamera(){
        return false
    }

    beforeRender(scene, eventState){}

}

Garden.register(
    CameraVR
)
