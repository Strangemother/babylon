class EmptyScene extends Garden {
    start(){
        //this.backgroundColor = colors.white()
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


        this.children.addMany(this.hemiLight, this.pointLight);
    }

}

class SimpleBox extends Garden {
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


class SimpleBoxRotation extends Garden {
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

        this.children.addMany(this.hemiLight, this.pointLight, this.box);
        this._render = true;
    }

    renderLoop(){
        super.renderLoop.apply(this, arguments);
        if(this._render != true) return;
        this.box._babylon.rotation.addInPlace(asVector(.001, .005, .002));

    }
}


class SimpleExample extends Garden {

    start(){
        this._camera = new FreeCamera({
            activate:true
            , radius: 20
            , position: [0, 5, -10]
        });

        this.hemiLight = new HemisphericLight({
            intensity: .5
        })

        this.sphere = new Sphere({
            diameter: 2
            , subdivisions: 16
            , position: [0, 1, 0]
        })


        this.ground = new Ground({
            width: 6
            , height: 6
            , subdivisions: 2
        })

        this.children.addMany(this._camera, this.hemiLight, this.sphere, this.ground)
    }
}

Garden.register(ToonColors
                , EmptyScene
                , SimpleBox
                , SimpleBoxRotation
                , SimpleExample
                );
