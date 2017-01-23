// http://doc.babylonjs.com/tutorials/Mesh_CreateXXX_Methods_With_Options_Parameter#linesystem

class ParametricShape extends Shape {

}

class Lines extends ParametricShape {

    keys(){
        return [
            // points  (Vector3[]) array of Vector3, the path of the line REQUIRED
            'points'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // instance    (LineMesh) an instance of a line mesh to be updated null
            , 'instance'
        ]
    }


}

class DashedLines extends ParametricShape {

    keys() {
        return [
            // points  (Vector3[]) array of Vector3, the path of the line REQUIRED
            'points'
            // dashSize    (number) size of the dashes 3
            , 'dashSize'
            // gapSize (number) size of the gaps   1
            , 'gapSize'
            // dashBn  (number) intended number of dashes  200
            , 'dashBn'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // instance    (LineMesh) an instance of a line mesh to be updated null
            , 'instance'
        ]
    }
}


class LineSystem extends ParametricShape {

    keys() {
        return [
            // lines   (Vector3[]) array of lines, each line being an array of successive Vector3 REQUIRED
            'lines'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // instance    (LineMesh) an instance of a line system mesh to be updated  null
            , 'instance'

        ]
    }
}


class TriangleLines extends Lines {

    babylonFuncName(...args) {
        return "CreateLines";
    }

    pointsKey(){
        return [
            new BABYLON.Vector3(-5, 0, 5)
            , new BABYLON.Vector3(5, 0, 5)
            , new BABYLON.Vector3(0, 0, -5)
            , new BABYLON.Vector3(-5, 0, 5)
        ]
    }
}


class Ribbon extends ParametricShape {

    keys() {
        return [

            // pathArray   (Vector3[][]) array of array of Vector3, the array of paths REQUIRED
            'pathArray'
            // closeArray  (boolean) to force the ribbon to join its last and first paths  false
            , 'closeArray'
            // closePath   (boolean) to force each ribbon path to join its last and first points   false
            , 'closePath'
            // offset  (number) used if the pathArray has one path only    half the path length
            , 'offset'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
            // instance    (LineMesh) an instance of a ribbon to be updated    null
            , 'instance'
            // invertUV    (boolean) to swap the U and V coordinates at geometry construction
            , 'invertUV'
            // time (texture rotation of 90°)   false
            , 'time'

        ]
    }
}


class Tube extends ParametricShape {

    keys() {
        return [
            // path    (Vector3[]) array of Vector3, the path of the tube REQUIRED
            'path'
            // radius  (number) the radius of the tube 1
            , 'radius'
            // tessellation    (number) the number of radial segments  64
            , 'tessellation'
            // radiusFunction  ( function(i, distance) ) a function returning a radius value /
            , 'radiusFunction'
            // cap (number) tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL NO_CAP
            , 'cap'
            // arc (number) ratio of the tube circumference between 0 and 1    1
            , 'arc'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
            // instance    (LineMesh) an instance of a tube to be updated  null
            , 'instance'
            // invertUV    (boolean) to swap the U and V coordinates at geometry construction
            , 'invertUV'
            // time (texture rotation of 90°)   false
            , 'time'

        ]
    }
}



class ExtrudedShapes extends ParametricShape {

    keys() {
        return [

            // shape   (Vector3[]) array of Vector3, the shape you want to extrude REQUIRED
            'shape'
            // path    (Vector3[]) array of Vector3, the extrusion axis REQUIRED
            , 'path'
            // scale   (number) the value to scale the shape   1
            , 'scale'
            // rotation    (number) the value to rotate the shape each step along the path 0
            , 'rotation'
            // cap (number) extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL    NO_CAP
            , 'cap'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
            // instance    (LineMesh) an instance of an extruded shape to be updated   null
            , 'instance'
            // invertUV    (boolean) to swap the U and V coordinates at geometry construction  invertUV//time (texture rotation of 90°)   false
            , 'time'


        ]
    }
}


class CustomExtrudedShapes extends ParametricShape {

    keys() {
        return [
            // shape   (Vector3[]) array of Vector3, the shape you want to extrude REQUIRED
            'shape'
            // path    (Vector3[]) array of Vector3, the extrusion axis REQUIRED
            , 'path'
            // scaleFunction   ( function(i, distance) ) a function returning a scale value //
            , 'scaleFunction'
            // rotationFunction    ( function(i, distance) ) a function returning a rotation /
            , 'rotationFunction'
            // ribbonClosePath (boolean) the underlying ribbon closePath parameter value   false
            , 'ribbonClosePath'
            // ribbonCloseArray    (boolean) the underlying ribbon closeArray parameter value  false
            , 'ribbonCloseArray'
            // cap (number) extrusion cap : NO_CAP, CAP_START, CAP_END, CAP_ALL    NO_CAP
            , 'cap'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
            // instance    (LineMesh) an instance of an extruded shape to be updated   null
            , 'instance'
            // invertUV    (boolean) to swap the U and V coordinates at geometry construction invertUV//time (texture rotation of 90°)   false
            , 'time'

        ]
    }
}


class Lathe extends ParametricShape {

    keys() {
        return [
            // shape   (Vector3[]) array of Vector3, the shape you want to turn REQUIRED
            'shape'
            // radius  (number) the value to radius of the lathe   1
            , 'radius'
            // tessellation    (number) the number of iteration around the lathe   64
            , 'tessellation'
            // arc (number) ratio of the circumference between 0 and 1 1
            , 'arc'
            // cap (number) tube cap : NO_CAP, CAP_START, CAP_END, CAP_ALL NO_CAP
            , 'cap'
            // closed  (boolean) to open/close the lathe circumference, should be set to false when used with arc  true
            , 'closed'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
            // invertUV    (boolean) to swap the U and V coordinates at geometry construction invertUV//time (texture rotation of 90°)   false
            , 'time'
        ]
    }
}



Garden.register(
    Lines
    , DashedLines
    , LineSystem
    , Ribbon
    , Tube
    , ExtrudedShapes
    , CustomExtrudedShapes
    , Lathe
    , TriangleLines
)
