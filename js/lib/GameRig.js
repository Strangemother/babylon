class GameRig extends CoreClass {
    /* Rigging operations to setup a scene with enviroment data
    such as lights, ground, assets */
    scene(scene) {
        /* The given scene GameScence contains the GameScene.Scene<BabylonScene>
        as a basic instance. The returned Scene will be the context for
        all level interfacing */
        scene.clearColor = this.sceneColor(scene)
        return scene
    }

    sceneColor(scene){
        return (new BABYLON.Color3(.96,.96,.96))
    }

    lights(scene){

    }

    ground(scene) {

    }

    cameras(scene){

    }

    rig(scene) {
        /* Perform alteration on the scene */
        var _s = this.scene(scene);
        this.ground(_s);
        this.lights(_s);
        this.cameras(_s);
        return _s;
    }

}
