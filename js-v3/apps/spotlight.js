
class BoxInSpotlight extends Garden {
    basicScene(){
        this.backgroundColor = colors.black()
        this._camera = new ArcRotateCamera({
            activate:true
            , radius: 20
        });

        this.hemiLight = new HemisphericLight({
            intensity: .4
        })
    }

    start(){

        this.basicScene()

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


Garden.register(BoxInSpotlight);
