class MultiTextureBox extends Garden {
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
        this._camera = new ArcRotateCamera();
        this._light = new HemisphericLight({
            color: 'white',
            intensity: 1
        });


        this.spotLight = new SpotLight({
            position: asVector(0, -10, 0)
            , direction: asVector(0, 1, 0)
            , diffuse: 'white'
            , angle: 4
            , exponent: 12
            , intensity: 1
        })

        this._sphere = new Sphere({ color: 'green' });
        var faceColors = new Array(6);

        faceColors[4] = colors.get('red')
        faceColors[1] = colors.lightSkyBlue()
        faceColors[5] = colors.yellow()

        app.c = new Box({ color: 'white', faceColors: faceColors})
        app.c.addToScene()

        //this._shapes()
        this.children.addMany(this._sphere, this.spotLight, this._light);

        this._camera.activate()
    }
}


class BoxInSpotlight extends Garden {

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


class BoxesWithChildren extends Garden {

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


Garden.register(MultiTextureBox
                , BoxesWithChildren
                , BoxInSpotlight
                );
