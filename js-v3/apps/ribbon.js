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
        /* The height of each peak of a sin.*/
        this.height = 5;
        /* The peak _Side_ width */
        this.width = 12;
        /* The peak length*/
        this.depth = 7;

        this.basicScene()

        this.ribbon = this.makeRibbon()
        this.ribbon.addToScene()
        this.ribbon.wireframe = true;

        let r2 = this.makeRibbon({
                color: 'dodgerBlue',
                position: [0,-20,0]}
            )
        r2.addToScene()
        this.r2 = r2
    }

    makeRibbon(options){
        /* Creae a ribbon instance using the insternal path generation functions
        REturns a ribbon instance
        */

        let conf = Object.assign({
            pathArray: this.firstPath()
            , updatable: true
            , sideOrientation: BABYLON.Mesh.BACKSIDE
        }, options)

        // Generate a new material.
        let mat = conf.material || materials.color(conf.color || 'mediumAquaMarine')
        mat.backFaceCulling = false;
        conf.material = mat

        // Make a new ribbon
        let rib = new this.shapes.Ribbon(conf)

        // Bind an update loop to the path update.
        rib.timestep = 0
        rib.renderLoop = this.ribbonLoop.bind(this);

        return rib
    }

    firstPath(){
        /* Generate the initial path for the ribbon. This is a two-step for loop
        calling `generatevenctors` */
        let pathArray = [] //new Array(count)
        for(var i = -20; i < 20; i++) {
            pathArray.push(this.generateVectors(i * 2));
        }

        return pathArray
    }

    generateVectors(k) {
        /* GFenerate an array of Vector3 instances, for the ribbon path.*/
        var path = [];
        for (var i = 0; i < 60; i++) {
            var x =  i - 30;
            var y = 0;
            var z = k;
            path.push(asVector(x, y, z));
        }
        return path;
    }

    updatePath(pathArray, timestep=0) {
        /* Iterate the pathArray with `updateVector.
        The path is mutated in place. Nothing is returned.*/
        for(var p = 0; p < pathArray.length; p++) {
            this.updateVector(pathArray[p], timestep);
        }
    }

    updateVector(path, k) {
        /* For each item in the path array, update the x,y,z for updating
        the view instance ventors */
        for (var i = 0; i < path.length; i++) {
            var z = path[i].z;
            var y = this.height * Math.sin(i/ this.depth) * Math.sin(k + z / this.width);
            path[i].y = y;
        }
    }

    ribbonLoop( scene, mesh, index, ribbon){
        /* given to ribbon.updateLoop, this function is called upon every
        displayList render iteration.
        Update the existing paths in the ribbon.
        Nothing is returned.

        This function is called directly from the displayList child iterator,
        therefore the given arguments reflect the item in the display list.

            scene: the attached item displayList scene
            mesh: the _bablyon item for the ribbon instance
            index: position within the displatList children
            ribbon: the ribbon instance, same as `this` by default.

        The local scope is the item(ribbon) by default. If your scope is lost
        due to binding, the last item in the arguments (ribbon) is the `this` scope.
        Therefore you can `bind()` the renderLoop function to some other instance.
        */
        let pathArray = ribbon._options.pathArray;
        this.updatePath(pathArray, ribbon.timestep += .02)
        ribbon.update({pathArray})
        mesh.rotation.y += .003
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
