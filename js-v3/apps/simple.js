class Simple extends Garden {
    init(config){
        config = config || {};
        config.backgroundColor = config.backgroundColor || [.2, .2, .4]
        super.init(config)
    }

    start(){
        this.box = new Box({ color: 'green' });
        this._light = new HemisphericLight();

        this.children.addMany(this.box, this._light);

        this._camera = new ArcRotateCamera({activate:true});
        // this._camera.activate()
    }
}


class ToonColors extends Garden {

    start(scene) {
        this.ball = new Sphere;
        this.box = new Box({
            position: [0, -3, 0]
            , color: colors.emissive('red')
        });

        this.knot = new TorusKnot({
            p: 1
            , q: 2
            , position: [0,3, 0]
        })

        this.knotMesh = this.knot.addToScene()
        this.ballMesh = this.children.add(this.ball)
        this.boxMesh = this.children.add(this.box)

        app.backgroundColor = colors.white()
        app.ball.color( colors.emissive('green') )
    }
}


class Main extends Garden {

    init(config){
        super.init(config)
        log('Main.init')
        this.backgroundColor = [.2, .1, .1]

    }

    runGame() {
        this.makeLights()
        this.makeBox()
        this.makeCamera()
    }

    makeCamera(){
        let options = {alpha:1, beta:1, radius: 10, target: new BABYLON.Vector3(0, 0, 0)};
        let c = new ArcRotateCamera(options)
        c.activate()
    }

    makeLights(){
        // create a basic light, aiming 0,1,0 - meaning, to the sky
        // let [scene, engine, canvas] = this._app.babylonSet
        // this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,1,0), scene);
        this.light = new HemisphericLight()
        this.light.addToScene()
    }

    makeBox(){
        /* A simple make box example */
        let b = new Box
        this.children.add(b)
    }
}

class SpinBox extends Garden {
    start(){
        this.backgroundColor = colors.white()
        this._camera = new ArcRotateCamera({
            activate:true
            , radius: 20
        });

        this.pointLight = new PointLight({
            position: [2, 7, 2]
            , intensity: .5
        })

        this.hemiLight = new HemisphericLight({
            intensity: .5
        })

        this.box = new Box({
            position: [0, 0, 0]
            , size:2
            , color: 'red'
        });

        this.children.addMany(this.hemiLight, this.pointLight, this.box)

    }
}


Garden.register(Simple
                , ToonColors
                , Main
                , SpinBox
                );
