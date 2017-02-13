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


class AnimatedBoxApp extends Garden {

    start(){
        this.backgroundColor = colors.black()
        this._camera = new ArcRotateCamera({
            activate:true
            , radius: 20
        });

        this.hemiLight = new HemisphericLight({
            intensity: .7
        })

        this.spotLight = new SpotLight({
            position: asVector(0, 10, 0)
            , direction: asVector(0, -1, 0)
            , diffuse: 'white'
            , angle: 1
            , exponent: 5
            , intensity: .4
        })


        this.ground = new Ground({
            color: 'white'
            , width: 20
            , height: 20
            , position: [0, 0, 0]
        })

        this.box = new Box({
            position: [0, 3, 0]
            , color: 'darkCyan'
        });

        this.box2 = new Box({
            position: [0, 3, 3]
            , color: 'sandyBrown'
        });

        this.cone = new Polyhedron({
            type: 11
            , position: [0, 3, -3]
            , rotation: [.7, 0, 0]
            , color: 'gold'
        })

        this.spotLight.shadows(
            this.box
            , this.box2
            , this.cone
            ).receiver(this.ground)

        this.children.addMany(
            this.spotLight
            , this.hemiLight
            , this.ground
            , this.box
            , this.cone
            , this.box2
            )

        let anim = new Animation({ targetProperty: 'rotation.y' })
        anim.frame(0, 0).frame(600, Math.PI*2)

        let animX = new Animation({ targetProperty: 'rotation.x' })
        animX.frame(0, 0).frame(200, -Math.PI*2)

        let anim3 = new Animation({ targetProperty: 'scaling.z' })
        anim3.frame(0, 1).frame(150, 2).frame(350, 1.2).frame(400, .5).frame(600, 1)

        let anim4 = new Animation({ targetProperty: 'rotation.y' })
        anim4.frame(0, 0).frame(400, -Math.PI*2)

        this.box.animate(anim)
        this.box.animate(animX)
        this.box.animate(anim3)
        this.cone.animate(anim4)

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


class TexturedBox extends Garden {
    start(){
        this.backgroundColor = colors.black()
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

        this.ground = new Ground({
            color: 'paleGreen'
            , width: 20
            , height: 20
            , position: [0, 0, 0]
        })

        this.box = new Box({
            position: [0, 1, 0]
            , size:2
            // , color: 'red'
            , material: './assets/textures/glassbuilding.jpg'
        });

        this.pointLight.shadow(this.box).receiver(this.ground)
        this.children.addMany(this.hemiLight, this.pointLight, this.ground, this.box)

    }
}


class BuildingsApp extends Garden {
    start() {
        let fact = 100
        this._light = new HemisphericLight({ color: 'white'});
        this._camera = new ArcRotateCamera({
            radius: 105
            , beta: 1.288
            , activate:true
        });

        this.ground = new Ground({
            color: 'darkOliveGreen'
            , width: fact
            , height: fact
            , position: [0, 0, 0]
        })

        var b = new Box({
                // color: 'black'
                material: './assets/textures/glassbuilding.jpg'
            });

        this.af = new ParticleSystem({
        //this.af = new PS({
            count: 200
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


class HugeParticlePlaneApp extends Garden {
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
                , Sandbox
                , ChildrenApp
                , AnimatedBoxApp
                , SpotlightApp
                , TexturedBox
                , BuildingsApp
                , SpinBox
                , HugeParticlePlaneApp
                );
