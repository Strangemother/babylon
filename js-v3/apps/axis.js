
class AxisExample extends Garden {

    start(){

        this.basicScene()

        this.box = new Box({
            color: 'green'
            , size: 7
            , position: [0, 5, 0]})

        this.box.addToScene()

        this.axis = new Axis({ color: 'white' });

        this.axisM = this.axis.addTo(this.box)
        //this.axisM = this.axis.addToScene(this.box)

        this.finaliseScene()
    }

    finaliseScene(){
        this.spotLight.shadows(this.box).receiver(this.ground)
        this.animations()
    }

    animations(){
        let anim1 = new Animation({ targetProperty: 'position.y' })
        let y = this.box.position().y;
        anim1.frame(0, y).frame(150, y * 2).frame(300, y)
        this.box.animate(anim1)

        let anim = new Animation({ targetProperty: 'rotation.y' })
        anim.frame(0, 0).frame(300, Math.PI*2)
        this.box.animate(anim)
    }

    basicScene() {

        this._camera = new ArcRotateCamera({
            activate: true
            , alpha: -.6
            , beta: 1.07
            , radius: 100
        });

        this.spotLight = new SpotLight({
            position: asVector(0, 30, 0)
            , direction: asVector(0, -1, 0)
            , diffuse: 'white'
            , angle: 4
            , exponent: 12
            , intensity: .4
        })

        this._light = new HemisphericLight({ color: 'white'});
        this._light.addToScene()

        this.ground = new Ground({
            color: 'thistle'
            , width: 50
            , height: 50
            , position: [0, 0, 0]
        })

        this.children.addMany(this.spotLight, this.ground)
    }

}

class Axis3dExample extends AxisExample {
    start(){

        this.basicScene()

        this.box = new Box({
            color: 'white'
            , size: 3
            , position: [0, 5, 0]})

        this.box.addToScene()

        this.axis = new Axis3D({size: 3, diameter: 2});
        // Okay. I didn't know this worked.
        this.axisM = this.axis.addTo(this.box)

        this.finaliseScene()
    }
}

class AxisLabelExample extends AxisExample {
    start(){

        this.basicScene()

        this.box = new Box({
            color: 'red'
            , size: 7
            , position: [0, 5, 0]})

        this.box.addToScene()

        this.axis = new ColorAxisArrow();
        // Okay. I didn't know this worked.
        this.axisM = this.axis.addTo(this.box)

        this.finaliseScene()
    }
}

class AxisLayeredExample extends AxisExample {

    start(){
        super.start()
        this._render = true

        this.colorAxis = new ColorAxisArrow({size: 10});
        this.colorAxis.addTo(this.box)

        this.axis3d = new Axis3D({ size: 2});
        this.axis3d.addTo(this.box)
        this.ground.color('lightBlue')
    }

    renderLoop(){
        super.renderLoop.apply(this, arguments);
        if(this._render != true) return;
        this.box._babylon.rotation.addInPlace(asVector(.001, .005, .002));

    }
}

Garden.register(AxisExample, Axis3dExample, AxisLabelExample, AxisLayeredExample);
