;(function(){


class BabylonRibbon extends Garden {

    basicScene() {

        this._camera = new ArcRotateCamera({
            activate: true
            , alpha: -.6
            , beta: 1.07
            , radius: 100
        });

        this._light = new HemisphericLight({ color: 'white'});
        this._light.addToScene()

    }

    start(){
        this.basicScene()

        let scene = app.scene()
        var mat = new BABYLON.StandardMaterial("mat1", scene);
        mat.alpha = 1.0;
        mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
        mat.backFaceCulling = false;
        mat.wireframe = true;

          // path function
          var pathFunction = function(k) {
            var path = [];
            for (var i = 0; i < 60; i++) {
                var x =  i - 30;
                var y = 0;
                var z = k;
                path.push(new BABYLON.Vector3(x, y, z));
            }
            return path;
          };

          // update path function
          var updatePath = function(path, k) {

            /* The height of each peak of a sin.*/
            let height = 5
            /* The peak _Side_ width */
            let width = 12
            /* The peak length*/
            let depth = 7;

            for (var i = 0; i < path.length; i++) {
                var x = path[i].x;
                var z = path[i].z;
                var y = height * Math.sin(i/ depth) * Math.sin(k + z / width);
                path[i].x = x;
                path[i].y = y;
                path[i].z = z;
            }
          };

        // ribbon creation
        var sideO = BABYLON.Mesh.BACKSIDE;
        var pathArray = [];
        let ribbonLength = 3;
        let speed = 0.03
        for(var i = -20; i < 20; i++) {
            pathArray.push(pathFunction(i * ribbonLength));
        }
        var mesh = BABYLON.Mesh.CreateRibbon("ribbon", pathArray, false, false, 0, scene, true, sideO);
        mesh.material = mat;


          // morphing
          var k = 0;
        scene.registerBeforeRender(function(){
            // update pathArray
            for(var p = 0; p < pathArray.length; p++) {
                updatePath(pathArray[p], k);
            }
            // ribbon update
            mesh = BABYLON.Mesh.CreateRibbon(null, pathArray, null, null, null, null, null, null, mesh);
            k += speed;
        });
    }

}


class Ribbon extends Garden {

    start(){

        this.basicScene()

        this.makeRibbon()
        //this.axis = new Axis();
        // Okay. I didn't know this worked.
        //this.axisM = this.axis.addTo(this.ribbon)

        this.finaliseScene()
    }

    makeRibbon(){
        let count = 60;
        let pathArray = new Array(count)

        for (var k = -20; k < 20; k++) {
            for (var i = pathArray.length - 1; i >= 0; i--) {
                pathArray[i] = asVector(i - count, 0, k)
            };
        }

          var mat = new BABYLON.StandardMaterial("mat1", app.scene());
          mat.alpha = 1.0;
          mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1.0);
          mat.backFaceCulling = false;

        let rib = new this.shapes.Ribbon({
            pathArray: pathArray
            , material: mat
            , offset: 0
            , updatable: true
            , sideOrientation: BABYLON.Mesh.BACKSIDE
        })

        this.ribbon = rib
        rib.addToScene()
    }

    finaliseScene(){
        //this.spotLight.shadows(this.ribbon).receiver(this.ground)

    }

    basicScene() {

        this._camera = new ArcRotateCamera({
            activate: true
            , alpha: -.6
            , beta: 1.07
            , radius: 100
        });

        this._light = new HemisphericLight({ color: 'white'});
        this._light.addToScene()

    }

}


Garden.register(Ribbon, BabylonRibbon);

})()
