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


class Blank extends Garden {

    start(scene) {
        this.ball = new Sphere;
        this.mesh = this.children.add(this.ball)
    }
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


class Sandbox extends Garden {
    init(config){
        config = config || {};
        config.backgroundColor = config.backgroundColor || this._baseColor()
        super.init(config)

        /* This is not required when using many apps Garden.run()
        Therefore the second call will not occur automatically. */
        this.run()
    }

    _baseColor(){
         return [.2, .2, .4]
    }

    start(){
        this._sphere = new Sphere({ color: 'green' });
        this._camera = new ArcRotateCamera();
        this._light = new HemisphericLight();
        //this._shapes()
        this.children.addMany(this._sphere, this._light);

        this._camera.activate()
    }

    _shapes(){
        let shapes = app.shapes;
        let c = 0;
        for(let keyName in shapes) {
            c += 2;
            let shape = new shapes[keyName];
            try {
                let mesh = this.children.add(shape)
                mesh.position.x = c;
            } catch (e){
                console.warn('Did not make', keyName)
            }
        }
    }
}


class SpotlightApp extends Garden {

    start(){
        this.backgroundColor = colors.black()
        this._camera = new ArcRotateCamera({
            activate:true
            , radius: 20
        });

        this.hemiLight = new HemisphericLight({
            intensity: .4
        })

        this.spotLight = new SpotLight({
            position: asVector(0, 10, 0)
            , direction: asVector(0, -1, 0)
            , diffuse: 'white'
            , angle: 1
            , exponent: 40
        })


        this.ground = new Ground({
            color: 'mediumSeaGreen'
            , width: 20
            , height: 20
            , position: [0, 0, 0]
        })

        this.box = new Box({
            position: [0, 3, 0]
            , color: 'red'
        });

        this.spotLight.shadow(this.box).receiver(this.ground)
        this.children.addMany(this.spotLight, this.hemiLight, this.ground, this.box)

        let c = colors.emissive('white');
        console.log('C', c)
        this.cone = new Cylinder({
            position: this.spotLight.position()
            , color: c
        })

        this.cone.addToScene()

        let anim = new Animation({ targetProperty: 'rotation.y' })
        anim.frame(0, 0).frame(600, Math.PI*2)

        this.box.animate(anim)

    }
}


class ChildrenApp extends Garden {
    start(){
        this._light = new HemisphericLight({ color: 'white'});
        this._camera = new ArcRotateCamera({activate:true});
        this.children.add(this._light);

        this.box = new Box({ color: 'green', position:[0,-2,0]})
        this.box.addToScene()

        this.box2 = new Box({color: 'red', position:[0,-1,0]})
        this.box2.addToScene()


        this.box3 = new Box({color: 'lightBlue', position:[0,0,0]})
        this.box3.addToScene()

        this.box4 = new Box({color: 'orange', position:[0,1,0]})
        this.box4.addTo(this.box3)

        this.box5 = new Box({color: 'white', position:[0,2,0]})

        this.box4.children.add(this.box5)
    }

}


Garden.register(Simple
                , Blank
                , Main
                , Sandbox
                , ChildrenApp
                , SpotlightApp
                );
