class StandardScenePatch extends GardenPatch {
    $start(){

        this.camera = new ArcRotateCamera({
            position: [-2, 20, -20]
            , alpha: -1
            , beta: .8
            , radius: 19

        });

        this.light = new HemisphericLight({ color: 'white', intensity: 1});

        this.$children.addMany(this.light);
        this.camera.activate();
    }
}


class MachinePatch extends GardenPatch {
    $start(scene, app){
        let body = this.body(app)
        let engines = this.engines(app, body)

        let a = new Axis3D({ position: [0,0,0], color: 'red'})
        a.addTo(body)

        // let b = new Axis3D({ position: [0,0,0], color: 'white'})
        // b.addTo(body)

        let center = this._resultant(engines)
        let rotation = this._resultant(engines, 'rotation')

        a.position(center)
        // b.position(this._centeroid(engines))
    }

    body(app){
        let box = new Box({
            position: [0, 2, 0]
            , width: 5 // x
            , depth: 8 // z
            , height: 2
            , color: 'cornFlowerBlue'
        })

        box.addToScene()
        return app.body = box;
    }

    engines(app, body) {
        let r = []
        r.push(this.engine(body))
        r.push(this.engine(body))
        r.push(this.engine(body))

        for (var i = 0; i < r.length; i++) {
            let item = r[i]
            item.addTo(body)
            item.position([(i * 2) - (r.length/2) - .5, 1, -4])
        }

        r[1].position().z = 4
        r[1].position().y = -1
        return app.engines = r
    }

    engine(body) {
        let box = new Box({
            position: [0, 0, 0]
            , color: 'green'
            , height: 2
        });

        return box
    }

    _resultant(items, func){
        /* calculate the result centroid vector of the three given vectors*/
        if(func == undefined) {
            func = 'position'
        }

        let rf = asVector(0, 0, 0)
        let len = items.length;
        for (var i = 0; i < len; i++) {
            let p = items[i][func]();
            rf.addInPlace(p);
        }
        rf = rf.divide(asVector(len, len, len))

        return rf;
    }

}

class Entity {
    constructor(item){
        this.item = item;
        this.mass = 1

    }
}

class ForcesEngines extends Garden {
    /*
        Given three points, calculate the centeroid of the triangle
     */

    $patches(){
        return [
            MachinePatch
            , StandardScenePatch
        ]
    }

    start() {

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

            this.aStage
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
    ForcesEngines
)
