class SprayParticlesApp extends Garden {
    start(){
        this._camera = new ArcRotateCamera({
            activate:true
            , alpha: -.6
            , beta: 1.07
            , radius: 130
        });

        this._light = new HemisphericLight({ color: 'white'});
        this.children.add(this._light);

        this.ground = new Ground({ width: 200, height: 200, color: 'royalBlue' })
        this.children.add(this.ground);

        this.ps = new ParticleSystem({ items: [new Box({size: 2})] })
        this.spp = new SprayParticlePositions;
        this.srp = SlowRotateParticlePositions
        this.ps.addUpdator(this.spp, this.srp)
        this.spsMesh = this.ps.create()

    }
}


class AsteroidFieldExample extends Garden {
    start(){
        this._camera = new ArcRotateCamera({
            activate:true
            , alpha: -.6
            , beta: 1.07
            , radius: 130
        });

        this._light = new HemisphericLight({ color: 'white'});
        this.children.add(this._light);
        this.af = new AsteriodField({
            count: 2000
            , items: [new Sphere({ segments: 8, diameter: 1 })]
        })

        this.afm = this.af.addToScene()
    }
}


class ParticlesSystem extends Garden {
    start(){
        this._light = new PointLight({ color: 'white', intensity: 1});
        this._camera = new ArcRotateCamera({
            activate:true
            , position: [0, 10, -50]
        });

        this.fact = 30;
        this.children.add(this._light);

        this.generate({})
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
        this._ov = scene.registerBeforeRender(this._beforeRender.bind(this));
        this.sps = sps;
    }

    _beforeRender() {
        //let cp = app._camera._babylon.position
        // app._light.position = cp;

        this.sps.mesh.rotation.y += .001;// -(cp.z/15) || 0
        this.sps.mesh.rotation.z += .001;// -(cp.y/15) || 0
        this.sps.setParticles();
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


class ParticlesImmutableSystem extends Garden {
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
        this.sps = sps;
        this._addObserve = this._app._scene.onBeforeRenderObservable.add(this._beforeRenderfunction.bind(this))
    }
    destroy(){
        if(this._addObserve){
            this._app._scene.onBeforeRenderObservable.remove(this._addObserve)
        }

        super.destroy()
    }

    _beforeRenderfunction() {
        app._light._babylon.position = app._camera._babylon.position;

        this.sps.mesh.rotation.x -= .0001
        this.sps.mesh.rotation.y += .0004
        this.sps.mesh.rotation.z += .0001
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


class ParticleSystemWithUpdators extends Garden {
    start(){
        this._camera = new ArcRotateCamera({
            activate:true
            , alpha: -.6
            , beta: 1.07
            , radius: 130
        });

        this._light = new HemisphericLight({ color: 'white'});
        this.children.add(this._light);

        this.ground = new Ground({ width: 100, height: 100, color: 'lightBlue' })
        this.children.add(this.ground);

        this.ps = new ParticleSystem({
            count: 200
            , items: [new Sphere({diameter: 1, segments: 1, color: 'royalBlue'})]
            , updatable: false
        })
        this.spp = new SprayParticlePositions();
        this.srp = SlowRotateParticlePositions
        this.ps.addUpdator(this.spp, this.srp)
        this.spsMesh = this.ps.create()

    }
}


class AdvancedParticleSystemWithUpdators extends Garden {

    start(){
        let alpha = 3
        this._camera = new ArcRotateCamera({
            activate:true
            , alpha: -.6
            , beta: 1.07
            , radius: 130
        });

        this._light = new HemisphericLight({ color: 'white'});
        this.children.add(this._light);

        this.ground = new Ground({ width: 100, height: 100, color: 'lightBlue' })
        this.children.add(this.ground);

        this.ps = new AdvancedParticleSystem({
            count: 200
            //, items: [new Sphere({diameter: 1, segments: 1, color: 'royalBlue'})]
            , updatable: false

        })
        this.spp = new SprayParticlePositions();
        //this.srp = SlowRotateParticlePositions
        //this.ps.addUpdator(this.spp, this.srp)
        this.spsMesh = this.ps.create()
        this._scene.registerBeforeRender(function(){
            this.ps._emitter.position.x = 4 * Math.cos(alpha);
            this.ps._emitter.position.z = 4 * Math.sin(alpha);
        }.bind(this))

    }
}


class ParticlesPositionPlane extends Garden {

    start(){

        this._camera = new ArcRotateCamera({
            activate:true
            , alpha: -.6
            , beta: 1.07
            , radius: 130
        });

        let item = this.s = new Box({
            diameter: 1
            , segments: 1
            , color: colors.get('white')
        })

        this._light = new HemisphericLight({ color: 'white'});
        this.children.add(this._light);

        this.ps = new ParticleSystem({
            count: 10000
            , items: [item]
            , updatable: false
        })

        this.spp = new FlatRandomParticlePositions;
        this.srp = new SlowRotateParticlePositions;
        this.ps.addUpdator(this.spp, this.srp)
        this.spsMesh = this.ps.addToScene()
    }
}


class ParticleSystemMatrix extends Garden {

    start(){

        this._light = new HemisphericLight({ color: 'white'});
        this._light.addToScene()

        this._camera = new ArcRotateCamera({
            activate:true
            , alpha: -.6
            , beta: 1.07
            , radius: 130
        });

        let item = this.s = new Box({
            diameter: 1
            , segments: 1
            , color: 'green' // colors.emissive('white')
        })

        this.ps = new ParticleSystem({
            count: 100
            , items: [item]
            , updatable: true
            //, setParticles: true
        })

        this.spp = new MatrixParticlePositions;
        this.ps.addUpdator(this.spp)
        this.spsMesh = this.ps.addToScene()
    }
}


class ParticleSystemStarField extends Garden {

    start(){
        this.backgroundColor = 'black';

        this._camera = new ArcRotateCamera({
            activate:true
            , alpha: -.6
            , beta: 1.07
            , radius: 130
        });

        let item = this.item = new Sphere({
            diameter: 1
            , segments: 1
            , color: colors.emissive('white')
        })

        this.ps = new ParticleSystem({
            count: 80000
            , items: [item]
            , updatable: false
        })

        this.spp = new RandomParticlePositions({ size: 3000 });
        this.srp = new SlowRotateParticlePositions;

        this.ps.addUpdator(this.spp, this.srp)
        this.spsMesh = this.ps.addToScene()

        this.sphere = new Sphere({
            color: colors.emissive('yellow')
            , diameter: 10
        })
        this.sphere.addToScene()
    }
}


class ParticleSystemHugePlane extends Garden {
    start() {
        let fact = 3000
        this._light = new HemisphericLight({ color: 'white'});
        this._camera = new ArcRotateCamera({
            radius: 105
            , beta: 1.288
            , activate:true
        });

        this.ground = new Ground({
            color: 'midnightBlue'
            , width: fact
            , height: fact
            , position: [0, 0, 0]
        })

        var b = new Box({
                color: 'white'
            });

        this.af = new ParticleSystem({
        //this.af = new PS({
            count: 100000
            , items: [b]

            , positionFunction: function(particle, i, s){
                // let uvSize = Math.random() * 0.9;
                asXYZ(
                    particle.scale
                    , Math.random() * 2 + 0.8
                    , Math.random() * 6 + 0.8
                    , Math.random() * 2 + 0.8
                    )

                asXYZ(
                    particle.position
                    , (Math.random() - 0.5) * fact
                    , particle.scale.y / 2 + 0.01
                    , (Math.random() - 0.5) * fact
                    )

                particle.rotation.y = Math.random() * 3.5;

                //grey = 1.0 - Math.random() * 0.5;
                //particle.color = new BABYLON.Color4(grey + 0.1, grey + 0.1, grey, 1);
                //particle.uvs.x = Math.random() * 0.1;
                //particle.uvs.y = Math.random() * 0.1;
                //particle.uvs.z = particle.uvs.x + uvSize;
                //particle.uvs.w = particle.uvs.y + uvSize;
            }
            , updatable: false
            , vertexFunction(){}
            , step: function(sps){
                //app._camera._babylon.rotation.x += .01
                app._camera._babylon.alpha += .0002

                //sps.setParticles()
            }
        })

        this.children.addMany(this._light, this.ground);
        this.afm = this.af.addToScene()


    }
}

class ParticleSystemHugePlaneField extends Garden {
    start() {
        let fact = 4000

        this.backgroundColor = [0,0,0];
        this._camera = new ArcRotateCamera({
            radius: 3084
            , alpha: 14
            , beta: 1.588
            , activate:true
        });


        var b = new Box({
                color: colors.emissive('white')
            });

        this.af = new ParticleSystem({
        //this.af = new PS({
            count: 100000
            , items: [b]

            , positionFunction: function(particle, i, s){
                // let uvSize = Math.random() * 0.9;
                asXYZ(
                    particle.scale
                    , Math.random() * 2 + 0.8
                    , Math.random() * 6 + 0.8
                    , Math.random() * 2 + 0.8
                    )

                asXYZ(
                    particle.position
                    , (Math.random() - 0.5) * fact
                    , particle.scale.y / 2 + 0.01
                    , (Math.random() - 0.5) * fact
                    )

                particle.rotation.y = Math.random() * 3.5;

                //grey = 1.0 - Math.random() * 0.5;
                //particle.color = new BABYLON.Color4(grey + 0.1, grey + 0.1, grey, 1);
                //particle.uvs.x = Math.random() * 0.1;
                //particle.uvs.y = Math.random() * 0.1;
                //particle.uvs.z = particle.uvs.x + uvSize;
                //particle.uvs.w = particle.uvs.y + uvSize;
            }
            , updatable: false
            , vertexFunction(){}
            , step: function(sps){
                //app._camera._babylon.rotation.x += .01
                app._camera._babylon.alpha += .0002
            }
        })

        this.afm = this.af.addToScene()


    }
}

Garden.register(
                ParticlesSystem
                , SprayParticlesApp
                , ParticleSystemWithUpdators
                , AsteroidFieldExample
                , ParticlesImmutableSystem
                , ParticlesPositionPlane
                , ParticleSystemStarField
                , ParticleSystemMatrix
                , ParticleSystemHugePlane
                , ParticleSystemHugePlaneField
                , AdvancedParticleSystemWithUpdators
                );
