class ScaleTestLevelRig extends GameRig {

    defaults(){
        return {
            groundColor: 'blue'
        }
    }

    sceneColor(){
        return colors.color3(.7)
    }

    scene(scene){
        super.scene(scene)
        //modifiers.fog(scene)
        return scene
    }

    lights(scene){
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        // Dim the light a small amount
        // light0.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = colors.white()
        light.intensity = 1;
    }

    ground(scene) {
        return undefined;
    }

}


class ScaleTestLevel extends GameLevel {

    get name(){
        return 'scaleTest'
    }

    set name(v){
        this._name = v
        return true;
    }

    init(name, scene){
        // this.interface = name;
        return super.init.apply(this, ['intro', scene]);
    }

    register(){
    }

    rig(){
        return ScaleTestLevelRig
    }

    load(scene){
        /* load level data */
        // this._floor = this.floor(scene)
        this._actor = this.actor(scene)
        this.scaling = new SuperScaler(scene)
        this.scaling.pointItem = this._actor._item
    }

    actor(scene) {
        /* create an entity for the user to manipulate*/
        var a = (new MainActor(scene));
        return a;
    }

    start(scene) {
        /* called by the run() after scene rigging */
        this.log('starting intro scene');
        this._actor && this._actor.run(scene);

        var sphere = this.objects.sphere();
        sphere.position.x = 3
        sphere.position.y = 3
        sphere.position.z = 3
        this.scaling.addItem(sphere)
        return scene;
    }
}


class SuperScaler {
    /* Super scale positions */

    constructor(scene, pointItem) {
        // relative position
        this.pointItem = pointItem;
        this.scene = scene;
        this.items = [];
        this._scales = {};
    }

    get position(){
        return this.pointItem.position
    }

    addItem(item) {
        /* provide a item with position<Vector3> and scale<Vector3> to
       add in the list of items to scale*/
       if(this.items.indexOf(item) == -1) {
            var scale = new SuperScale(item);
            this._scales[scale.id] = scale;
            item._scaler = scale.id;
            this.items.push(item);

            return scale
       }

       return this.scales[item._scaler]
    }


}

class SuperScale {

    constructor(item, x,y,z) {
        // Do not keep item for cheaper memory chaining.
        this.setScale(x || 1,y || 1,z || 1)
    }

    get id(){
        /* return a unique ID. Generate if required. */
        if(this._id == undefined) {
            this._id = Math.random().toString(32);
        }

        return this._id
    }

    setScale(x,y,z) {
        this._scale = new BABYLON.Vector3(x,y,z)
    }

    getScale(){
        return this._scale
    }
}
