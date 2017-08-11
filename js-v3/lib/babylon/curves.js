class Curve extends Shape {
    babylonFunc() {
        return BABYLON.Curve3
    }
}

class CubicBezier extends Curve {

    keys(){
        return [
            'points'
            , 'pointCount'
        ]
    }

    pointsKey(){
        return [
            new BABYLON.Vector3(5, 5, -5),
            new BABYLON.Vector3(30, 30, 40),
            new BABYLON.Vector3(-60, 50, -40),
            new BABYLON.Vector3( -30, 60, 30)
        ]
    }

    pointCountKey(){
        return 60
    }

    executeBabylon(babylonFunc, babylonFuncName, name, options, scene) {
        let ps = options.points;
        let pointCount = options.pointCount;
        return babylonFunc[babylonFuncName](ps[0], ps[1], ps[2], ps[3], pointCount)
    }

    asLines(options, scene){
        scene = scene || this._app.scene();
        let bInst = this._babylon || this.create(options, scene)
        let line = new Lines(Object.assign({
            points: bInst.getPoints()
        }, options));

        return line;
    }
}


class CubicBezierLine extends ParametricShape {

    keys(){
        return [
            // points  (Vector3[]) array of Vector3, the path of the line REQUIRED
            'points'

            ,'pointCount'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // instance    (LineMesh) an instance of a line mesh to be updated null
            , 'instance'
        ]

    }

    babylonFuncName(){
        return 'CreateLines'
    }

    pointCountKey(){
        return 60
    }

    executeBabylon(babylonFunc, babylonFuncName, name, options, scene) {

        let curve = this.getCurve()
        let points = options.points || curve.pointsKey()
        let pointCount = options.pointCount || curve.pointCountKey();
        options.points = curve.create({points, pointCount}).getPoints()
        return super.executeBabylon.apply(this, arguments)
    }

    getCurve(){
        return new CubicBezier()
    }
}


class QuadraticBezier extends CubicBezier {

}

class QuadraticBezierLine extends CubicBezierLine {

    getCurve(){
        return new QuadraticBezier()
    }
}


Garden.register(
    Curve
    , CubicBezier
    , QuadraticBezier
    , CubicBezierLine
)









