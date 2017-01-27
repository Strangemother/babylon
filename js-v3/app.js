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


class ShapeColumn extends Garden {
    start(){
        this._light = new HemisphericLight();
        this._camera = new ArcRotateCamera({activate:true});
        this.children.add(this._light);

        let t = new app.shapes.TriangleLines({ color: 'green' });
        let meshes = this.meshes = []

        let n = -Math.floor(colors.names.length/2), m;
        for(let c of colors.names) {
            m = t.create({
                color: c
                , position: [0, n++, 0]
                , rotation: [0, (n++)*.01, 0]
            })
            meshes.push(m)
        }
    }

    _destroyable(){
        return [
            this._camera
            , this._light
            , this.meshes
        ]
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

    _destroyable(){
        return [
            this._light
            , this._camera
            , this.children
            , this.box
            , this.box2
            , this.box3
            , this.box4
            , this.box5
        ]
    }
}


class Particles extends Garden {
    start(){
        this._light = new PointLight({ color: 'white', intensity: 1});
        this._camera = new ArcRotateCamera({
            activate:true
            , position: [0, 10, -50]
        });

        this.fact = 30;
        this.children.add(this._light);

        this.generate(this.options())
    }

    options(){
        return {};
    }

    generate(options){
        this.createParticleSystem(10000, options)
    }

    createParticleSystem(count=5000, options){
        let model = this.modelParticle()
        let scene = this.scene()
        let sps = this.particleSystem(model, count, scene, options)
        sps.initParticles = function(){
            for (var i = 0; i < sps.nbParticles; i++) {
                this.particleFunction(sps.particles[i])
            }
        }.bind(this);

        var c = 0
        sps.updateParticle = function (particle) {
            particle.rotation.x += particle.position.z / 100;
            particle.rotation.z += particle.position.x / 100;
            //let fact = 30
            if(c > colors.names.length-1) { c = 0}

            //particle.color = colors.get(colors.names[c++])
        }


        sps.initParticles()
        sps.setParticles()
        //sps.computeParticleColor = false
        sps.computeParticleTexture = false
        let cp = app._camera._babylon.position
        scene.registerBeforeRender(function() {
            app._light.position = cp;

            sps.mesh.rotation.y = -(cp.z/15) || 0
            sps.mesh.rotation.z = -(cp.y/15) || 0
            sps.setParticles();
        });
    }

    particleFunction(particle, index, s){
        let fact = this.fact;

        particle.position.x = (Math.random() - 0.5) * fact;
        particle.position.y = (Math.random() - 0.5) * fact;
        particle.position.z = (Math.random() - 0.5) * fact;

        particle.rotation.x = Math.random() * 3.15;
        particle.rotation.y = Math.random() * 3.15;
        particle.rotation.z = Math.random() * 1.5;
        particle.color = colors.make(
            particle.position.x / fact + 0.5
            , particle.position.y / fact + 0.5
            , particle.position.z / fact + 0.5
            )
    }

    modelParticle() {
        let d = new Disc({ tessellation: 3 })
        return d.create();
    }

    particleSystem(shape, count=10000, scene, options){
        let sps = new BABYLON.SolidParticleSystem('SPS', scene, options);
        sps.addShape(shape, count)

        let mesh = sps.buildMesh();
        shape.dispose()
        return sps
    }

}


class ImmutableParticles extends Garden {
    start(){
        this.backgroundColor = colors.black()
        this._light = new PointLight({
            diffuse: 'white',
            intensity: 2
        });

        this._camera = new ArcRotateCamera({
            activate:true
            , radius: 206
            , position: [0, 116, -200]
        });

        this.fact = 90;
        this.children.add(this._light);

        this.generate()
    }


    generate(){
        this.createParticleSystem(160000)
    }

    createParticleSystem(count){
        let model = this.modelParticle()
        let scene = this.scene()
        let sps = this.particleSystem(model, count, scene)
        sps.initParticles = function(){
            for (var i = 0; i < sps.nbParticles; i++) {
                this.particleFunction(sps.particles[i])
            }
        }.bind(this);

        var c = 0

        sps.initParticles()
        sps.setParticles()
        //sps.computeParticleColor = false
        sps.computeParticleTexture = false
        let cp =
        scene.registerBeforeRender(function() {
            app._light._babylon.position = app._camera._babylon.position;

            sps.mesh.rotation.x -= .0001
            sps.mesh.rotation.y += .0004
            sps.mesh.rotation.z += .0001
        });
    }

    particleFunction(particle, index, s){
        let fact = this.fact;

        particle.position.x = (Math.random() - 0.5) * fact;
        particle.position.y = (Math.random() - 0.5) * fact;
        particle.position.z = (Math.random() - 0.5) * fact;
        particle.rotation.x = Math.random() * 3.15;
        particle.rotation.y = Math.random() * 3.15;
        particle.rotation.z = Math.random() * 1.5;

        particle.color = colors.make(
            particle.position.x / fact + 0.5
            , particle.position.y / fact + 0.5
            , particle.position.z / fact + 0.5
            )
    }

    modelParticle() {
        let d = new Disc({ tessellation: 3
            , sideOrientation: BABYLON.Mesh.DOUBLESIDE
        })
        return d.create();
    }

    particleSystem(shape, count=10000, scene){
        let sps = new BABYLON.SolidParticleSystem('SPS', scene, {updatable: false});
        sps.addShape(shape, count, { positionFunction: this.particleFunction.bind(this)})

        let mesh = sps.buildMesh();
        shape.dispose()
        return sps
    }

}



Garden.register(Simple
                , Blank
                , Main
                , App
                , Sandbox
                , ChildrenApp
                , ShapeColumn
                , Particles
                , ImmutableParticles
                );
