

class ParticlesApp extends Garden {
    start(){
        this._light = new HemisphericLight({ color: 'white'});
        this._camera = new ArcRotateCamera({ activate:true });

        this.children.add(this._light);

        this.ps = new SprayParticles({ items: [new Box({size: 1})] })
        this.spsMesh = this.ps.create()

        this.box = new Box
        this.children.add(this.box)
    }

    asteroids(){
        this.ps = new AsteriodField({
            count: 2000
            , items: [new Sphere({ segments: 8, diameter: 1 })]
        })
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


Garden.register(
                Particles
                , ParticlesApp
                , ImmutableParticles
                );
