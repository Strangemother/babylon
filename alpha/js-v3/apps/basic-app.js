
class SimpleColoredSpheres extends Garden {
    init(config){

        config = config || {};
        config.backgroundColor = [.2, .2, .4];
        super.init(config);

        this.run();
    }

    start(){

        let b1 = new Sphere({
            color: 'red'
            , position: asVector(0, 1, 0)
        });

        let b2 = new Sphere({
            color: 'dodgerBlue'
            , position: asVector(0, 2, 0)
        });

        let b3 = new Sphere({
            color: 'gold'
            , position: asVector(0, 3, 0)
        });

        this.balls = [b1, b2, b3]
        this.children.addMany(b1, b2, b3)

        this._camera = new ArcRotateCamera({
            position: [4, 2, -4]
        });
        this.light = new HemisphericLight({ color: 'white' });

        this.sphere = new Sphere({ color: 'green' });
        this.children.addMany(this.sphere, this.light);
        this._camera.activate();
    }
}


Garden.register(SimpleColoredSpheres)

