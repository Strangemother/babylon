class GameInterface extends CoreClass {

    init(name) {
        this.name = name
        this.game_data = new GameData(this.data)
        this.prepareApplication(this.data);
    }

    get config(){
        return this.data;
    }

    loadAssetObjects(config) {
        var res = [];

        for (var i = 0; i < config.assets.length; i++) {
            var asset = config.assets[i];
            res.push(new GameObject(asset))
        };

        return res
    }

    run(obj) {
        /* start the engine to boot the game */
        this.obj = this.prepareReference(obj);
        GameInterface._instance = this.obj;
        this.log('run', this.data.level)
        this._scene = new GameScene(this)
        this.level = this.prepareLevel(this._scene, this.data.level)
        this.level.run(this._scene)
    }

    prepareApplication(config) {
        this._colors = colors.addColors(config.colors);
        this._assets = this.loadAssetObjects(config);
        this.cameras = new Cameras(this)
    }

    prepareReference(obj) {
        this.position = new Position(this);
        if(obj != undefined) {
            var conf = Object.assign(this.config, obj)
        }
        return this;
    }

    prepareLevel(scene, name) {
        /* Given a scene and a name, generate a new level
        through reference of data.levels[name] */
        var LevelClass = this.data.levels[name];
        var level = new LevelClass(this, scene);
        return level;
    }

    get gameScene(){
        /* Return the instance of the library GameScene, containing an instance
        of the Bablyon Scene and components for the Scene. */
        return GameInterface._instance._scene
    }

    get camera() {
        /* Returns the active Bablyon camera set though the GameScene. */
        return GameInterface._instance.gameScene._camera
    }

    get scene(){
        /* return an instance of the current BABYLON scene */
        return GameInterface._instance.level.scene._scene
    }

    get objects(){
        /* return and instance of the current Objects class wrapping
        the BABYLON scene within the GameLevel */
        return GameInterface._instance.level.objects
    }

}

