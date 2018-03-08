class Curve extends Shape {
    babylonFunc() {
        return BABYLON.Curve3
    }
}

class VectorSet {

    constructor(parent=undefined, vectors=null){
        this.parent = parent;
        this.vectors = vectors;
    }

    redraw(options) {
        if(this.parent.draw) {
            this.parent.draw(options)
        }
    }

    add(item) {
        for (var i = 0; i < arguments.length; i++) {
            this.addVector(arguments[i])
        }

        this.redraw({ points: this.vectors })
    }

    insert(index, item){
        /* add at position*/
        for (var i = 1; i < arguments.length; i++) {
            this.vectors.splice(index, 0, arguments[i])
        }

        this.redraw({ points: this.vectors })
    }

    remove(item) {
        let removed = undefined;
        if(Number.isInteger(item)) {
            removed = this.vectors.splice(item, 1)
        }

        let i = this.vectors.indexOf(item);
        if(i > -1) {
            removed = this.vectors.splice(i, 1)
        }

        this.redraw({ points: this.vectors })

        return removed
    }

    addVector(item) {
        if(this.vectors == null) {
            this.vectors = []
        }

        this.vectors.push(item)
    }

    get(item) {
        if(Number.isInteger(item)) {
            return this.vectors[item]
        }
    }

    list(){
        return this.vectors || []
    }
}

class Spline extends BabylonObject {

    init(options, ...args){
        /* API hook to start your component. Such as an add to view.*/
        this.points = new VectorSet(this, options? options.points: this.defaultPoints())
        super.init(options, ...args)
    }

    keys(){
        return [
            'points'
            , 'initial'
        ]
    }

    defaultPoints(){
        return [asVector(0, 0, 0), asVector(0, 0, 0)]
    }

    pointsKey(){
        return this.points.list()

    }

    initialKey(){
        return asVector(0, 0, 0)
    }

    babylonFuncName(){
        return 'Path3D'
    }

    babylonSceneArg(){
        return undefined
    }

    babylonNameArg(){
        return undefined
    }

    addtoScene(options){
        return this.draw(options)
    }

    draw(options={}){
        let conf = Object.assign({}, { points: undefined }, options);
        if(conf.points == undefined) {
            let curve;
            if(this._babylon) {
                curve = this._babylon.getCurve();
            } else {
                curve = this.create(options).getCurve()
            };
            conf.points = curve;
        };

        let lines = new Lines()
        lines.addToScene(conf);
        if(this._last) {
            this._last.destroy()
        }
        this._last = lines;
        return lines;
    }

    destroy(){
        if(this._last) {
            this._last.destroy()
        }

        return super.destroy()
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
        return []
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


class CubicBezierLine extends CubicBezier {

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


    pointsKey(){
        return [asVector(0, 0, 0)]
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









