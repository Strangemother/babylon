
class BasicElements extends Garden {
    start(){
        var scene = this.scene()

        this.cam = new ArcRotateCamera({
            activate: true
             , alpha: 3 * Math.PI / 2
             , beta: Math.PI / 8
             , radius: 50
             , target: asVector([0,0,0])
         });

        this.light = new HemisphericLight({
            direction: asVector(0, 1, 0)
        });

        this.box = new Box({
            size: 6
            , position: asVector(-10, 0, 0)
        })

        this.sphere = new Sphere({
            diameter: 10
            , position: asVector(0, 10, 0)
        })

        this.plane = new Plane({
            size: 10
            , position: asVector(0, 0, 10)
        })

        this.cylinder = new Cylinder({
            height: 3
            , diameter: 3
            , tessellation: 6
            , position: asVector(0, 0, -10)
            , updatable: false
        })

        this.torus = new Torus({
            diameter: 5
            , thickness: 1
            , tessellation: 10
            , position: asVector(10, 0, 0)
        })

        this.knot = new TorusKnot({
            radius: 2
            , tube: 0.5
            , radialSegments: 128
            , tubularSegments: 64
            , p: 2
            , q: 3

        })

        this.lines = new Lines({
            points: [
                asVector(-10, 0, 0)
                , asVector(10, 0, 0)
                , asVector(0, 0, -10)
                , asVector(0, 0, 10)
            ]
        })


        // Creation of a ribbon
        // let's first create many paths along a maths exponential function as an example
        var exponentialPath = function (p) {
            var path = [];
            let z;

            for (var i = -10; i < 10; i++) {
                z = Math.sin(p / 3) * 5 * Math.exp(-(i - p) * (i - p) / 60) + i / 3;
                path.push(asVector(p, i, z))
            };
            return path;
        };

        // let's populate arrayOfPaths with all these different paths
        var arrayOfPaths = [];
        for (var p = 0; p < 20; p++) {
            arrayOfPaths[p] = exponentialPath(p);
        }

        // (name, array of paths, closeArray, closePath, offset, scene)
        //var ribbon = BABYLON.Mesh.CreateRibbon("ribbon", arrayOfPaths, false, false, 0, scene);
        this.ribbon = new Ribbon({
            pathArray: arrayOfPaths
            , position: asVector(-10, -10, 20)
            , closeArray: false
            , closePath: false
            , offset: 0
        })

        this.children.addMany(this.light
            , this.box
            , this.sphere
            , this.plane
            , this.cylinder
            , this.torus
            , this.knot
            , this.lines
            , this.ribbon
            )
    }
}

Garden.register(BasicElements)
