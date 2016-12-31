var main = function(){
    logger('Main')
    let v = new Main(CONFIG);
    window.app = v;
}

class Main extends Garden {

    init(config){
        super.init(config)
        log('Main.init')

        this.run({
            backgroundColor: [.2, .1, .1]
        })

        $('#run').click(this.runGame.bind(this));
        $('#run_tests').click(this.runTests.bind(this));
    }

    runTests() {
        Test.run()
    }

    start(scene) {}

    runGame() {
        this.makeLights()
        this.makeBox()
        let c = new ArcRotateCamera({alpha:1, beta:4, radius: 3, target: new BABYLON.Vector3(0, 0, 0)})
        // this.children.add(c)
        let r = c.create({})
        r.attachControl(app._canvas, true)
    }

    makeLights(){
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        let [scene, engine, canvas] = this._app.babylonSet
        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
    }

    makeBox(){
        /* A simple make box example */
        let b = new Box
        this.children.add(b)
    }

    _runGame(){
        var scene = this.scene();

        // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);

        // move the sphere upward 1/2 of its height
        this.sphere.position.y = 1;

        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        this.ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);
    }
}


var logger = function(name) {
    /* Setup the print logger */
    var logger = new PrintLogger(name, true);
    window.log = logger.log;
    var logView = logger.create({});

}

;main();
