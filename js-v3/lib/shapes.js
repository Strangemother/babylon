class Box extends Shape {
    /* A basic mesh object to help build BABYLON.Mesh components*/

    keys(){
        return [
                //size    (number) size of each box side  1
                'size'
                //height  (number) height size, overwrites size property  size
                , 'height'
                //width   (number) width size, overwrites size property   size
                , 'width'
                //depth   (number) depth size, overwrites size property   size
                , 'depth'
                //faceColors  (Color4[]) array of 6 Color4, one per box face  Color4(1, 1, 1, 1) for each side
                , 'faceColors'
                //faceUV  (Vector4[]) array of 6 Vector4, one per box face    UVs(0, 0, 1, 1) for each side
                , 'faceUV'
                //updatable   (boolean) true if the mesh is updatable false
                , 'updatable'
                //sideOrientation (number) side orientation   DEFAULTSIDE
                , 'sideOrientation'
        ]
    }
}


class Sphere extends Shape {

    keys(){
        return [
            // segments        (number) number of horizontal segments  32
            'segments'
            // diameter        (number) diameter of the sphere 1
            , 'diameter'
            // diameterX       (number) diameter on X axis, overwrites diameter property   diameter
            , 'diameterX'
            // diameterY       (number) diameter on Y axis, overwrites diameter property   diameter
            , 'diameterY'
            // diameterZ       (number) diameter on Z axis, overwrites diameter property   diameter
            , 'diameterZ'
            // arc             (number) ratio of the circumference (latitude) between 0 and 1  1
            , 'arc'
            // slice           (number) ratio of the height (longitude) between 0 and 1    1
            , 'slice'
            // updatable       (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
        ]
    }
}

class Cylinder extends Shape {

// or Cone

    keys(){
        return [
            // height  (number) height of the cylinder 2
            'height'
            // diameterTop (number) diameter of the top cap, can be zero to create a cone, overwrites the diameter property    1
            , 'diameterTop'
            // diameterBottom  (number) diameter of the bottom cap, can't be zero, overwrites the diameter property    1
            , 'diameterBottom'
            // diameter    (number) diameter of both caps  1
            , 'diameter'
            // tessellation    (number) number of radial sides 24
            , 'tessellation'
            // subdivisions    (number) number of rings    1
            , 'subdivisions'
            // faceColors  (Color4[]) array of 3 Color4, 0 : bottom cap, 1 : cylinder tube, 2 : top cap    Color4(1, 1, 1, 1) for each face
            , 'faceColors'
            // faceUV  (Vector4[]) array of 3 Vector4, 0 : bottom cap, 1 : cylinder tube, 2 : top cap  UVs(0, 0, 1, 1) for each face
            , 'faceUV'
            // arc (number) ratio of the circumference between 0 and 1 1
            , 'arc'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
        ]
    }
}

class Plane extends Shape {

    keys(){
        return [
            // size    (number) side size of the plane 1
            'size'
            // width   (number) size of the width  size
            , 'width'
            // height  (number) size of the height size
            , 'height'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
            // sourcePlane (Plane) source plane (math) the mesh will be transformed to null
            , 'sourcePlane'
        ]
    }
}

class Ground extends Shape {

    keys(){
        return [

            // width   (number) size of the width  1
            'width'
            // height  (number) size of the height 1
            , 'height'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // subdivisions    (number) number of square subdivisions  1
            , 'subdivisions'
        ]
    }
}

class GroundFromHeightMap extends Shape {

    keys(){
        return [

            // width   (number) size of the map width  10
            'width'
            // height  (number) size of the map height 10
            , 'height'
            // subdivisions    (number) number of map subdivisions 1
            , 'subdivisions'
            // minHeight   (number) minimum altitude   0
            , 'minHeight'
            // maxHeigth   (number) maximum altitude   1
            , 'maxHeigth'
            // onReady (function) a callback js function that is called and passed the just built mesh (mesh) => {return;}
            , 'onReady'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
        ]
    }
}

class TiledGround extends Shape {

    keys(){
        return [

            // xmin    (number) map min x coordinate value -1
            'xmin'
            // zmin    (number) map min z coordinate value -1
            , 'zmin'
            // xmax    (number) map max x coordinate value 1
            , 'xmax'
            // zmin    (number) map max z coordinate value 1
            , 'zmin'
            // subdivisions    ( {w: number, h: number} ) number of subdivisions (tiles) on the height and the width of the map    {w: 6, h: 6}
            , 'subdivisions'
            // precision   ( {w: number, h: number} ) number of subdivisions on the height and the width of each tile  {w: 2, h: 2}
            , 'precision'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
        ]
    }
}

class Disc extends Shape {

    keys(){
        return [

            // radius  (number) the radius of the disc or polygon  0.5
            'radius'
            // tessellation    (number) the number of disc/polygon sides   64
            , 'tessellation'
            // arc (number) ratio of the circumference between 0 and 1 1
            , 'arc'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
        ]
    }
}

class Torus extends Shape {

    keys(){
        return [

            // diameter    (number) diameter of the torus  1
            'diameter'
            // thickness   (number) thickness of its tube  0.5
            , 'thickness'
            // tessellation    (number) number of segments along the circle    16
            , 'tessellation'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
        ]
    }
}


class TorusKnot extends Shape {

    keys(){
        return [

            // radius  (number) radius of the torus knot   2
            'radius'
            // tube    (number) thickness of its tube  0.5
            , 'tube'
            // radialSegments  (number) number of radial segments  32
            , 'radialSegments'
            // tubularSegments (number) number of tubular segments 32
            , 'tubularSegments'
            // p   (number) number of windings 2
            , 'p'
            // q   (number) number of windings 3
            , 'q'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
        ]
    }
}


class Polyhedron extends Shape {

    /// 0   Tetrahedron 4
    /// 1   Octahedron  8
    /// 2   Dodecahedron    12
    /// 3   Icosahedron 20
    /// 4   Rhombicuboctahedron 26
    /// 5   Triangular Prism    5
    /// 6   Pentagonal Prism    7
    /// 7   Hexagonal Prism 8
    /// 8   Square Pyramid (J1) 5
    /// 9   Pentagonal Pyramid (J2) 6
    /// 10  Triangular Dipyramid (J12)  6
    /// 11  Pentagonal Dipyramid (J13)  10
    /// 12  Elongated Square Dipyramid (J15)    12
    /// 13  Elongated Pentagonal Dipyramid (J16)    15
    /// 14  Elongated Pentagonal Cupola (J20)   22

    //# var heptagonalPrism = { "name":"Heptagonal Prism", "category":["Prism"], "vertex":[[0,0,1.090071],[0.796065,0,0.7446715],[-0.1498633,0.7818315,0.7446715],[-0.7396399,-0.2943675,0.7446715],[0.6462017,0.7818315,0.3992718],[1.049102,-0.2943675,-0.03143449],[-0.8895032,0.487464,0.3992718],[-0.8658909,-0.6614378,-0.03143449],[0.8992386,0.487464,-0.3768342],[0.5685687,-0.6614378,-0.6538232],[-1.015754,0.1203937,-0.3768342],[-0.2836832,-0.8247995,-0.6538232],[0.4187054,0.1203937,-0.9992228],[-0.4335465,-0.042968,-0.9992228]],
    //# "face":[[0,1,4,2],[0,2,6,3],[1,5,8,4],[3,6,10,7],[5,9,12,8],[7,10,13,11],[9,11,13,12],[0,3,7,11,9,5,1],[2,4,8,12,13,10,6]]};
    //#
    //# var mesh = BABYLON.MeshBuilder.CreatePolyhdron("h", {custom: heptagonalPrism}, scene);

    keys(){
        return [

            // type (number) polyhedron type in the range [0,14]    0
            'type'
            // size    (number) polyhedron size    1
            , 'size'
            // sizeX   (number) X polyhedron size, overwrites the size property    1
            , 'sizeX'
            // sizeY   (number) Y polyhedron size, overwrites the size property    1
            , 'sizeY'
            // sizeZ   (number) Z polyhedron size, overwrites the size property    1
            , 'sizeZ'
            // custom  (polygonObjectReference) a polyhedron object, overwrites the type property  null
            , 'custom'
            // faceColors  (Color4[]) array of Color4, one per face    Color4(1, 1, 1, 1) for each side
            , 'faceColors'
            // faceUV  (Vector4[]) array of Vector4, one per face  UVs(0, 0, 1, 1) for each side
            , 'faceUV'
            // flat    (boolean) if false, a polyhedron has a single global face, faceUV and faceColors are ignored    true
            , 'flat'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'

        ]
    }
}


class IcoSphere extends Shape {

    keys(){
        return [
            // radius  (number) radius 1
            'radius'
            // radiusX (number) the X radius, overwrites the radius value  radius
            , 'radiusX'
            // radiusY (Vector3) the Y radius, overwrites the radius value radius
            , 'radiusY'
            // radiusZ (number) the Z radius, overwrites the radius value  radius
            , 'radiusZ'
            // subdivisions    (number) the number of subdivisions 4
            , 'subdivisions'
            // flat    (boolean) if true, the mesh faces have their own normals    true
            , 'flat'
            // updatable   (boolean) true if the mesh is updatable false
            , 'updatable'
            // sideOrientation (number) side orientation   DEFAULTSIDE
            , 'sideOrientation'
        ]
    }
}


class Decals extends Shape {

    keys(){
        return [
            // position    (Vector3) position of the decal (World coordinates) (0, 0, 0)
            'position'
            // normal  (Vector3) the normal of the mesh where the decal is applied onto (World coordinates)    Vector3.Up
            , 'normal'
            // size    (Vector3) the x, y, z sizes of the decal    (1, 1, 1)
            , 'size'
            // angle   (number) the angle to rotate the decal  0
            , 'angle'

        ]
    }
}



MeshTools.register(
    Box
    , Sphere
    , Cylinder
    , Plane
    , Ground
    , GroundFromHeightMap
    , TiledGround
    , Disc
    , Torus
    , TorusKnot
    , Polyhedron
    , IcoSphere
    , Decals
)









