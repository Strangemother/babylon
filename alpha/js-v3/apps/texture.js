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


class ToonColors extends Garden {
    /*
        By not applying any external lighting, and providing emissive colors
        to entities - a tool effect is applied.
     */
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


Garden.register(TexturedBox
                , BuildingsApp
                , ToonColors
                );
