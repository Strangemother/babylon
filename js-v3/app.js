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


class App extends Garden {
    init(config){

        config = config || {};
        config.backgroundColor = [.2, .2, .4];
        super.init(config);

        this.run();
    }

    start(){

        let b1 = new Sphere({
            color: 'red'
            , position: asVector(0, 1, 0)
        });

        let b2 = new Sphere({
            color: 'dodgerBlue'
            , position: asVector(0, 2, 0)
        });

        let b3 = new Sphere({
            color: 'gold'
            , position: asVector(0, 3, 0)
        });

        this.balls = [b1, b2, b3]
        this.children.addMany(b1, b2, b3)

        this._camera = new ArcRotateCamera();
        this.light = new HemisphericLight({ color: 'white' });

        this.sphere = new Sphere({ color: 'green' });
        this.children.addMany(this.sphere, this.light);
        this._camera.activate();
    }
}

class Sandbox extends Garden {
    init(config){
        config = config || {};
        config.backgroundColor = config.backgroundColor || this._baseColor()
        super.init(config)

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


class Animate extends Garden {
    start(){
        this.baseScene()
        this.animate1()
        this.animate2()
        this.animate3()
        this.animate4()
    }

    baseScene(){
        let skyLight = new app.lights.HemisphericLight;
        this.light = app.children.add(skyLight)
        skyLight.color('white')

        this.camera = new app.cameras.ArcRotateCamera(true)
    }


    animate1(){
        this.box = new Box({ color: 'red' })
        let mesh = this.mesh = this.box.addToScene()
        let anim = new Animation({ targetProperty: 'scaling.x' })
        let babylonAnim = anim.create()
        let keys = [{ frame: 0, value: 1}, { frame: 50, value: .2}, {frame: 100, value: 1}]
        babylonAnim.setKeys(keys);
        mesh.animations.push(babylonAnim);

        this.bAnim = babylonAnim;
        this.animScaleX = anim;
        this.animation = app.scene().beginAnimation(mesh, 0, 100, true)
    }

    animate2() {
        let box = this.box2 = new Box({ color: 'green', position: [1, 0, 0]})
        box.addToScene()

        let anim = new Animation({ targetProperty: 'scaling.y' })
        anim.frame(0, 1).frame(50, .2).frame(100, 1)

        this.animTwoAnim = box.animate(anim)

        this.animScaleY = anim;
        this.animTwo = anim;
    }

    animate3(){
        let box = this.box3 = new Box({ color: 'dodgerBlue', position: [2, 0, 0]})
        box.addToScene()

        let anim = new Animation({ targetProperty: 'scaling.z' })
        anim.frames([0, 1], [50, .2], [100, 1])
        this.animScaleZ = anim

        box.animate(anim)
        // Share animations
        box.animate(this.animTwo)
    }

    animate4(){
        /*
        Using all the previously made animations, stack all to the box.
        The ScaleX animation keys were not applied to the Garden instance -
        therefore we can create new ones */
        let box = this.box4 = new Box({ color: 'gold', position: [3, 0, 0]})
        box.addToScene()

        this.animScaleX.frames([0, 1], [30, .8], [50, .6] , [80, .3], [100, 1])
        this.animScaleZ.frames([0, 1], [23, .8], [70, .4] , [100, 1])

        box.animate(this.animScaleX)
        box.animate(this.animScaleY)
        box.animate(this.animScaleZ)
    }
}

Garden.register(Simple, Main, App, Sandbox, Animate);
