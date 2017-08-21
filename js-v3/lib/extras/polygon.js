class EntityManager {
    redraw(conf) {
        if(this.live == true && this.entity._babylon != undefined) {

            return this.entity.redraw(conf)
        };
    }
}

class PathManager extends EntityManager {

    constructor(){
        super()
        this.path = null;
    }

    startPath(x, y, z) {
        /*
         Start a path from a given position. x, y, z
         if argument count is 2, Path2(x, y) is created.
         if argument count is 3, Path3D(x, y, z) is created.

         three of more arguments are provided, all are given to the
         BABYLON Path3D:

             startPath()
             startPath(0, 1)
             Path2()

             startPath([asVector(x,y,z)])
             startPath([asVector(x,y,z)], firstNormal, raw)

             new Path3D(path, normal, raw)

         Creates a Path3D. A Path3D is a logical math object, so not a mesh.
         please read the description in the tutorial :  http://doc.babylonjs.com/tutorials/How_to_use_Path3D
         path : an array of Vector3, the curve axis of the Path3D
         normal (optional) : Vector3, the first wanted normal to the curve. Ex (0, 1, 0) for a vertical normal.
         raw (optional, default false) : boolean, if true the returned Path3D isn't normalized. Useful to depict path acceleration or speed.
        */
        let fname = 'Path3D';
        if(arguments.length == 2
            || arguments.length == 0) {
            fname = 'Path2';
        };

        return this.path = new BABYLON[fname](x,y,z);
    }

    addLine(x, y, z) {
        let poly_path = this.path;
        if(this.path == null) {
            poly_path = this.startPath.apply(this, arguments)
            return poly_path
        };

        let v = this.path.addLineTo(x, y, z);
        this.redraw({ path: v })
        return v;

    }

    addArc(midX, midY, endX, endY, segmentCount) {
        let v = this.path.addArcTo(midX, midY, endX, endY, segmentCount);
        this.redraw({ path: v })

        return v;
    }

    closePath(){
        let v = this.path.close();
        this.redraw({ path: v });
        return v;
    }

    points(){
        if(this.path != null) {
            return this.path.getPoints()
        }
    }

    pointAtLength(nomalizedLengthPosition) {
        /*Returns a new Vector2 located at a percentage of the Path2 total
        length on this path.*/
        return this.path.getPointAtLengthPosition(nomalizedLengthPosition)
    }
}

class VectorManager extends PathManager {

    constructor(){
        super()
        this.vectors = null;
    }

    add(item) {
        for (var i = 0; i < arguments.length; i++) {
            this.addVector(arguments[i])
        }

        this.redraw({ path: this.vectors })
    }

    insert(index, item){
        /* add at position*/
        for (var i = 1; i < arguments.length; i++) {
            this.vectors.splice(index, 0, arguments[i])
        }

        this.redraw({ path: this.vectors })

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

        this.redraw({ path: this.vectors })

        return removed
    }

    addVector(item) {
        this.vectors.push(item)
    }

}


class PointsManager extends VectorManager {

    constructor(vectors, entity, live=true){
        super()
        this.vectors = vectors || [];
        this.entity = entity;
        this.live = live;
        this.path = null;
    }

}

class Ngon extends BabylonObject {

    init(options, ...args) {
        this._updatable = false
        this.points = new PointsManager(undefined, this)
        return super.init(options, ...args)
    }

    _defaultColor() {
        return 'white'
    }

    keys(){
        return [
            'path'
            , 'updatable'
            , 'depth'
        ]
    }

    babylonFuncName(){
        return 'PolygonMeshBuilder'
    }

    updatable(){
        return this._updatable
    }

    updatableKey(){
        return false;
    }

    depthKey(){
        return 0
    }

    babylonParams(scene, overrides) {
        /* Return the configured options in order for this.babylonCall arguments
        Returned is [name, options, scene] */
        let name = this.generateName()
            , options = this.generateOptions(overrides, scene)

        if(this.babylonArrayArgs()) {
            return this.babylonConvertOptions(name, options, scene)
        }

        return [name, options, scene];
    }

    babylonArrayArgs() {
        return false
    }

    babylonCall(name, options, scene) {
        /* Produce a babylon object using the given args as
        parameters for the CreateXXX call.
        returned is a babylon instance. */
        let args = arguments
        let extrudeDepth = options.depth || this.depthKey()
        let updatable = options.updatable || this.updatable();
        this._babylonParams = args;
        let n = this.babylonFuncName(...args);
        let b = this.executeBabylon(this.babylonFunc(), n, ...args);
        this.assignProperties(b, ...args)
        this.assignLiveProperties(b, ...args)
        let builder = this.babylonExecuted(b, ...args)
        var polygon = builder.build(updatable, extrudeDepth);
        polygon._builder = builder;
        return polygon
    }

    dynamicPath(){
        if(this.points.path == null) {
            return this.points.vectors
        }

        return this.points.path;
    }

    executeBabylon(babylonFunc, babylonName, ...args) {
        /* expecting MeshBuilder */

        /* Expecting values are "name", "options", and scene.*/
        let name = args[0]
            , path = args[1].path
            , updatable = args[1].updatable
            , scene = args[2]

        if(updatable == undefined) {
            if(path == undefined) {
                updatable = false;
            } else {
                updatable = this.updatable()
            }
        };

        if(path == undefined) {
            path = this.dynamicPath()
        };

        return new babylonFunc[babylonName](name, path, scene);
    }

    addedToScene(mesh, options, scene){
        this.color && (this.color(options?options.color:false || this._defaultColor).backFaceCulling = false)
        if(this._babylon == mesh) {
            /* dynamic association.*/
            if(mesh._builder) {
                this.builder = mesh._builder
            }
            this._options = options;
        }

        if(options != undefined && options.path != undefined) {
            if(options.path instanceof BABYLON.Path2) {
                this.points.path = options.path;
            } else {
                this.points.vectors = options.path
            }
        }
    }

    redraw(options) {
        let atc = false;
        if(this.builder) {
            delete this.builder;
            if(this._babylon) {
                this.destroy()
                atc = true
            }
        }
        /*
        If the element is already on the scene, it should be re-added.
        This is to ensure the after effects are applied to a
        new object. the create() function factories a new babylon only. */
        let f = atc ? 'addToScene': 'create'
        let conf = Object.assign({}, this._options, options);
        return this[f](conf)
    }

    addVector(point) {
        return this.points.add(point)
    }
}
