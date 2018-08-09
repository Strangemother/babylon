class GameLevel extends GameSceneObject {
    /* Paramaters for generating a scene and interface for the user to interact*/


    init(name, scene){
        this.register()
        this.objects = this.createObjects(scene)
        return super.init.apply(this, arguments)
    }

    createObjects(scene) {
        var o = new Objects(this, scene);
        return objectProxy(o)
    }

    run(scene) {
        /* run the level performing any operations of load then running scene.run*/
        this.log('running level', this.name);
        scene.run()
        this.load(scene);
        var _scene = this.rigScene(scene);
        this.label = this._presentlabel(_scene)
        return this.start(_scene);
    }

    _presentlabel(scene){
        /* Show the level screen value*/
        var l = new TextPanel2D({
            scene: scene
            , name: 'LevelLabel'
            , text: this.name
            , position: [0, 0]
        });

        l.draw();
        return l;
    }

    load(scene){
        /* Perform any interface asset loading such as level
        data.*/
    }

    start(scene){
        return scene;
    }

    rigScene(scene) {
        /* With the scene given, apply new rig and return a scene*/
        var Rig = this.rig()
        var r = new Rig(this)
        return r.rig(scene._scene);
    }

    rig(){
        /* Return the Rig class used to apply a Scene and its rigging
        properties to a level */
        return GameRig
    }
}
