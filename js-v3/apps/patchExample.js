class LitScene extends GardenPatch {
    $start(){

        this.camera = new ArcRotateCamera({
            position: [-2, 20, -20]
            , alpha: -1
            , beta: .8
            , radius: 19

        });

        this.light = new HemisphericLight({ color: 'white'});

        this.ground = new Ground({
            width: 20
            , height: 20
            , subdivisions: 1
        })

        this.$children.addMany(this.light, this.ground);
        this.camera.activate();
    }
}

class LitBox extends GardenPatch {
    $start(){

        this.light = new PointLight({
            position: [0, 3, 0]
            , intensity: .5
        })

        this.box = new Box({ color: 'green', position:[0, 1, 0] });
        this.$children.addMany(this.box, this.light);

    }
}

class PatchExample extends Garden {
    /* Mix a scene and an element using two patches.
    Each ran from the start function */
    $patches(){
        return [LitScene, LitBox]
    }

    start(){
        this.sphere = new Sphere({
            diameter: 2
            , subdivisions: 16
            , position: [0, 5, 0]
            , color: 'lightBlue'
        })
        this.children.add(this.sphere)
    }
}

Garden.register(PatchExample)
