class IntroRig extends GameRig {

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
        var groundColor = this.config.groundColor;
        console.log(groundColor)

        var ground = BABYLON.Mesh.CreateGround("ground1", 20, 20, 1, scene);
        ground.materal = materials[groundColor](scene)
        return ground;
    }

}


class Mappings {

    static map(inputType, bindObject) {
        return Mappings._instance.map(inputType, bindObject)
    }

    static add(MappingsKlass) {
        return Mappings._instance.add(MappingsKlass)
    }

    constructor(){
        this.bound = []

        if(this.instances == undefined) {
            this.instances = {}
        };
        if(this.classes == undefined) {
            this.classes = []
        };

    }

    add(MappingsKlass) {

        this.classes.push(MappingsKlass);
        var c = this.bind(MappingsKlass)
        this.instances[c.type] = c;
        return c;
    }

    bind(MappingsKlass) {
        /* Start the mappings class*/
        var c = new MappingsKlass
        c.bind(this);
        return c;
    }

    map(inputType, bindObject) {
        if(this.bound[inputType] == undefined) {
            this.bound[inputType] = []
        };

        this.bound[inputType].push(bindObject)
    }
}

Mappings._instance = new Mappings


class KeyboardMappings {

    bind(mappings){
        /* bind the mapping to the events required.*/
    }

    call(event) {
        /* receive the event from the mappings watcher.*/
    }
}

class MainActor extends GameActor {

    itemType(scene) {
        return 'box';
    }

    run(scene) {
        super.run(scene);
        this.mappings()
    }

    mappings(){
        /* Return arguments to map to input controls.*/
        var keyboard = Mappings.map(Mappings.Keyboard, this);
    }

    key_UP(event) {
        this.log('up key move forward')
    }
}

class IntroLevel extends GameLevel {

    get name(){
        return 'intro'
    }

    set name(v){
        this._name = v
        return true;
    }

    init(name, scene){
        // this.interface = name;
        return super.init.apply(this, ['intro', scene]);
    }


    rig(){
        return Configure(IntroRig, {
            groundColor: 'red'
        })
    }

    register(){
        /* Register assets for future loadout and
        polyfilling default datas. */
        var floorData = matrix([
            0, 1, 0, 1, 1,
            1, 0, 1, 0, 1,
            0, 1, 1, 0, 1,
            0, 0, 1, 0, 1,
            0, 1, 1, 1, 0
        ], 5);

        // Apply the data to the inforamtion storage point.
        GameData.register('floor', this, floorData)
    }

    load(scene){
        /* load level data */
        console.log('load IntroLevel')
        this._floor = this.floor(scene)
        this._actor = this.actor(scene)
    }

    floor(scene){
        /* Create the floor, rendering the floor matrix
        from GameData */
        var floorMatrix = GameData.load('floor', this);
        // provide the caller to allow the floor matrix to
        // render using the defintiion object
        // floorMatrix.items = this.objects // .box.bind(this.objects)

        floorMatrix.item = this.objects.tree // .box.bind(this.objects)

        var f = new MatrixLayout(floorMatrix, scene, {
            distance: 10
        });
        return f;
    }

    actor(scene) {
        /* create an entity for the user to manipulate*/
        var a = (new MainActor(scene));
        return a;
    }

    start(scene) {
        /* called by the run() after scene rigging */
        this.log('starting intro scene');
        this._floor && this._floor.run(scene)
        this._actor && this._actor.run(scene)
        this._panel = this.inputPanel(scene)
        return scene
    }

    inputPanel(scene) {
        var p = new PadInputPanel({
            scene:scene
            , name:'padInput'
            , position: [50, 50]
        });

        p.draw();
        return p
    }
}

