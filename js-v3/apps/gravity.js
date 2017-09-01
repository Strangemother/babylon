
class Force extends Garden {

    init(config){

        config = config || {};
        config.backgroundColor = [.2, .2, .4];
        super.init(config);

        this.run();
    }

    start(){

        this._camera = new ArcRotateCamera({
            position: [-2, 20, -20]
            , alpha: -1
            , beta: .8
            , radius: 19

        });

        this._bcc = 0

        this.light = new HemisphericLight({ color: 'white' });


        this.ground = new Ground({
            width: 20
            , height: 20
            , subdivisions: 1
        })

        this.children.addMany(this.light, this.ground);
        this._camera.activate();

        sceneClickers.onClick.add(this.onClick)

        this.sandbox()
    }

    onClick(item, gInst, ev){
        console.log('onClick', gInst)
        // this.boxBound(gInst)
    }

    sandbox(){
        let b = this.ball;
        let mag1 = 200;
        let f1Deg = 60;
        // let f1 = mag1 * Math.cos(f1Deg) * i + 200 * Math.sin(f1Deg) * j
        this.entity()
        this.setKeyTrigger()
        this.vectorData()

        // The keys move the entity; not the camera.
        // this._camera.detach()
        app._camera._babylon.inputs.attached.keyboard.detachControl()
    }

    vectorData(){
        this._rotation = asVector(0,0,0)
        this._force = asVector(0,0,0)
    }

    beforeRender(scene, eventState){
        this._rotation.y += .01
        this._bBox.rotation.y = this._rotation.y

        // Rotate by local space reference; looping at
        //app._rBox0.rotate(BABYLON.Axis.Z, this._force.y, BABYLON.Space.LOCAL)

        //app._rBox0.rotate(BABYLON.Axis.Y, this._force.z, BABYLON.Space.LOCAL)
        let _scale = 1 + (this._force.y * 3)
        this._rBox0.scaling.y = _scale < 1 ? 1: _scale
        this._rBox1.scaling.y = _scale < 1 ? 1: _scale

        this._rBox0.rotation.x = this._force.z * 10
        this._rBox1.rotation.x = this._force.z * 10

        this._rBox0.rotation.z = -this._force.x * 10
        this._rBox1.rotation.z = -this._force.x * 10

        if(this._bcc % 1000 == 0) {
            this.renderForce()
            this.bcc = 0
        }

        this.bcc +=1
    }

    renderForce(){
        let vs = [app.box1.position(), app.box2.position()]
        let force = this._force
        let rv = asVector(
                force.x * 20
                , force.y * 20
                , force.z * 20
            )

        this.axis.position(rv)
    }

    entity(){
        this.force = 0

        this.box0 = new Box({
            color: 'green'
            , height: 5
            , position: [0, 4, 0]
        });

        this.box1 = new Box({
            color: 'white'
            , height: 2
            , position: [2, 2, 0]
        });

        this.box2 = new Box({
            color: 'white'
            , height: 2
            , position: [-2, 2, 0]
        });

        this.children.addMany(this.box0, this.box1, this.box2)

        this._bBox = this.box0._babylon;
        this._rBox0 = this.box1._babylon;
        this._rBox1 = this.box2._babylon;

        let a1 = new ColorAxisArrow({ size: 2 })
        a1.addTo(this.box1)

        let a2 = new ColorAxisArrow({ size: 2 })
        a2.addTo(this.box2)

        this.axis = new Axis3D()
        this.axis.addToScene()

        app._scene.registerBeforeRender(this.beforeRender.bind(this))
    }

    setKeyTrigger(){
        let trigger = BABYLON.ActionManager.OnKeyDownTrigger
        let ex = new BABYLON.ExecuteCodeAction(trigger, this.keyup.bind(this))
        let am = app.actionManager()
        am.registerAction(ex);
    }

    keyup(e) {
        let key = e.sourceEvent.key;
        if(this[`keyup_${key}`] != undefined){
            this[`keyup_${key}`](e)
        }
    }

    keyup_ArrowUp(e){
        this._force.z += .01
    }

    keyup_ArrowDown(e){
        this._force.z -= .01
    }

    keyup_ArrowLeft(e){
        this._force.x -= .01
    }

    keyup_ArrowRight(e){
        this._force.x += .01
    }

    keyup_w(e){
        this._force.y += .01
    }

    keyup_s(e){
        this._force.y -= .01
    }

}

class TriPointCenter extends Garden {
    /*
        Given three points, calculate the centeroid of the triangle
     */
    start() {
        this._camera = new ArcRotateCamera({
            position: [-2, 20, -20]
            , alpha: -1
            , beta: .8
            , radius: 19
            , activate: true
        });

        this.light = new HemisphericLight({ color: 'white' });
        this._rc = 0
        this._counter = 0
        this.linesOnScene = false;


        this.a1 = new Axis3D({ position: [2,  4, 2], color: 'red'})
        this.a2 = new Axis3D({ position: [-3, 5, 3 ], color: 'white'})
        this.a3 = new Axis3D({ position: [-1, 4, -4], color: 'green'})

        this.aStage = new ColorAxisArrow({ size: 2})

        this.af = new Axis({ size: .4})
        this.rotationVector = new ColorAxisArrow({ size: 2})


        this.children.addMany(
            this._camera
            , this.light
            , this.aStage
            , this.a1
            , this.a2
            , this.a3

            , this.af
            , this.rotationVector
            )

        this.calcForce()
    }

    calcForce(){
        this._rc = 0
        this.rf = this._centroid()
        this.updateLines()
    }


    _centroid(){
        /* calculate the result centroid vector of the three given vectors*/
        let rf = asVector(0, 0, 0)
        let p1 = this.a1.position()
            , p2 = this.a2.position()
            , p3 = this.a3.position()

        let a = (p1.x + p2.x + p3.x) / 3
        let b = (p1.y + p2.y + p3.y) / 3
        let c = (p1.z + p2.z + p3.z) / 3

        let C = (a + b + c) / 3

        rf.copyFromFloats(a, b, c)

        let r1 = this.a1.rotation()
            , r2 = this.a2.rotation()
            , r3 = this.a3.rotation()

        let ra = (r1.x + r2.x + r3.x) / 3
        let rb = (r1.y + r2.y + r3.y) / 3
        let rc = (r1.z + r2.z + r3.z) / 3

        this.rotationVector.rotation(asVector(ra,rb,rc))
        this.rotationVector.position(rf)

        this.rf = rf
        return rf
    }

    movePoints(){
        /*
        Randomly move the vector point relative from its original position.
         */
        let p1 = this.a1.position()
            , p2 = this.a2.position()
            , p3 = this.a3.position()

        let points = [p1,p2,p3];
        this._counter += 1;
        for (var i = 0; i < points.length; i++) {
            let p = points[i];
            p.x += (Math.sin(this._counter * .4) * (Math.cos(i) * .03)) * .03
            p.y += Math.sin(this._counter * .02) * (Math.cos(i) * .03)
            p.z += Math.sin(this._counter * .04) * (-Math.cos(i) * .03)
        }

        this.calcForce();
        this._rc += 1
    }

    rotatePoints(){
        /*
        Perform smooth random rotation on each vector point,
        */
        let p1 = this.a1.rotation()
            , p2 = this.a2.rotation()
            , p3 = this.a3.rotation()

        let points = [p1,p2,p3];
        this._counter += 1;
        for (var i = 0; i < points.length; i++) {
            let p = points[i];
            p.x += (Math.PI * (Math.sin(i * .005) + Math.cos(i * .002)) ) * .001
            p.y += (Math.PI * (Math.sin(i % 3 * .05) + Math.cos(i * .002)) ) * .003
            p.z += (Math.PI * (Math.cos(i * .05) + Math.sin(i * .02)) ) * .003
        }

        this.calcForce();
        this._rc += 1
    }

    updateLines(){
        /* Generate a set of three lines to map between the three vector points.*/
        this.lines12 = new Lines({
            points: [this.a1.position(), this.a2.position()]
            , updatable: true
            , instance: this.lines12Mesh
        })


        this.lines23 = new Lines({
            points: [this.a2.position(), this.a3.position()]
            , updatable: true
            , instance: this.lines23Mesh
        })


        this.lines13 = new Lines({
            points: [this.a1.position(), this.a3.position()]
            , updatable: true
            , instance: this.lines13Mesh
        })


        this.lines12Mesh = this.lines12.addToScene()
        this.lines23Mesh = this.lines23.addToScene()
        this.lines13Mesh = this.lines13.addToScene()


    }

    renderLoop(){
        super.renderLoop.apply(this, arguments)
        this.af.position(this.rf)
        this.movePoints()
        this.rotatePoints()

    }
}


Garden.register(
    Force
    , TriPointCenter
)
