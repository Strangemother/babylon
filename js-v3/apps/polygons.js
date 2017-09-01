class PolygonExampleBase extends Garden {
    basicScene(){
        this._camera = new ArcRotateCamera({
            position: [-2, 20, -20]
            , alpha: -1
            , beta: .8
            , radius: 19
            , activate: true
        });

        this.light = new HemisphericLight({ color: 'white' });
        this.light.addToScene()
    }

}

class PolygonBabylonExample extends PolygonExampleBase {

    start(){

        this.basicScene()
        let scene = this.scene();
        //let path = [asVector(1,0,0), asVector(0,1,0), asVector(0,0,1)];

        let path = [ new BABYLON.Vector2(4, -4),
                    new BABYLON.Vector2(2, 0),
                    new BABYLON.Vector2(5, 2),
                    new BABYLON.Vector2(1, 2),
                    new BABYLON.Vector2(-5, 5),
                    new BABYLON.Vector2(-3, 1),
                    new BABYLON.Vector2(-4, -4),
                    new BABYLON.Vector2(-2, -3),
                    new BABYLON.Vector2(2, -3),
              ];

        var polygon_triangulation = new BABYLON.PolygonMeshBuilder("name", path, scene);

        var polygon = polygon_triangulation.build(false, 0);
        polygon.material = materials.white();
        polygon.material.backFaceCulling = false;
        this.poly = polygon
    }
};


class PolygonGardenExample extends PolygonExampleBase {

    start(){
        this.basicScene();

        let path = [
            asVector(4, -4)
            , asVector(2, 0)
            , asVector(5, 2)
            , asVector(1, 2)
            , asVector(-5, 5)
            , asVector(-3, 1)
            , asVector(-4, -4)
            , asVector(-2, -3)
            , asVector(2, -3)
        ];

        this.ngon = new Ngon({ path })
        this.ngon.addToScene({ color: 'green'})
    }
};


class NgonVectors extends PolygonExampleBase {
    /*
     Spawn and edit a single NGon, reproducing the polygonal mesh
     using a mesh builder.
     */
    start() {
        this.basicScene()

        let ng = this.ngon = new Ngon({})

        let path = [
            asVector(2,-2)
            , asVector(-2, -2)
            , asVector(-2, 2)
        ]

        ng.addToScene({ path, depth: 1, color: 'red' })

        setTimeout(function(){
            /* Update the ngon with the redraw() permanent setting. */
            ng.redraw({ depth: 3 })
        }, 1000);

        setTimeout(function(){
            /* Push a new vwector to the ngon points, forcing a redraw */
            ng.points.add(asVector(2,2))
        }, 1500);

        setTimeout(function(){
            /* Apply settings to the current mesh.
            These transient settings are not applied through the create()
            factory*/
            ng.color('white').backFaceCulling = false;
        }, 2000);

        setTimeout(function(){
            /*Remove the item at position 3, forcing the ngon to
            update the mesh.
            The color will disappear - as it was applied to the current
            instance through the create() factory,
            but not applied using the redraw() */
            ng.points.remove(2)
        }, 2500);

        setTimeout(function(){
            /*Redraw the ngon mesh, storing the values applied for future
            redraws */
            ng.redraw({ color: 'lightBlue'})
        }, 3000);

        setTimeout(function(){
            /* reinsert the removed item rather than append.
            An ngon mesh is built anti-clockwise.
            You'll notice the 'redraw' applies a permanent color value
            to the drawn mesh.
            */
            ng.points.insert(2, asVector(-4, 4))
            ng.redraw({ depth: .4})

        }, 3500);

        //let v = ng.addVector()
        //console.log(v)
        //v = ng.addVector(asVector(2,3))
        //this.v = v;
        //console.log(v)
    }
}

class NgonPaths extends PolygonExampleBase {
    /*
     Spawn and edit a single NGon, reproducing the polygonal mesh
     using a mesh builder.
     */
    start() {
        this.basicScene()

        let ng = this.ngon = new Ngon({})


        setTimeout(function(){
            /* Update the ngon with the redraw() permanent setting. */
            //ng.redraw({ depth: 3 })
        }, 1000);

        let np = ng.points;
        np.startPath(2, 0);
        np.addLine(5, 2);

        ng.addToScene({ depth: 1, color: 'red' })


        setTimeout(function(){
            np.addLine(5, 2);
            np.addLine(1, 2);
        }, 500);

        setTimeout(function(){
            np.addLine(-5, 5);
            np.addLine(-3, 1);
        }, 1000);

        setTimeout(function(){
            np.addLine(-4, -4);
            ng.redraw({ depth: 3, color: 'green' })
        }, 1500);

        setTimeout(function(){
            np.addArc(0, -2, 4, -4, 100);
        }, 2000);

        var hole = [ new BABYLON.Vector2(1, -1),
         new BABYLON.Vector2(1.5, 0),
         new BABYLON.Vector2(1.4, 1),
         new BABYLON.Vector2(0.5, 1.5)
        ]

        setTimeout(function(){
            np.hole(hole);
        }, 2500);
    }

}

Garden.register(
    PolygonGardenExample
    , PolygonBabylonExample
    , NgonVectors
    , NgonPaths
)
