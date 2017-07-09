class ShareScale {
    constructor(item) {
        this.item = item;
    }
}

class Scaling extends Garden {
    init(config){
        config = config || {};
        config.backgroundColor = config.backgroundColor || [.2, .2, .4]
        super.init(config)
    }

    start(){

        this._light = new HemisphericLight();

        this.children.addMany(this._light);

        this._camera = new ArcRotateCamera({
            beta: 1.4
            , radius: 32
            , alpha: -1.7
            , activate:true
        });

        //this.freeCam = new FreeCamera({
        //    position:  {x: 972.6412510509451, y: 309.53609622114965, z: -565.3667455002411}
        //    , rotation:  {x: 0.24087030622757938, y: -0.8938284558117208, z: 0}
        //});

        // this._camera.activate()
        this.scaler()
    }

    planetConfig(){
        return {
            sun: {
                color: 'yellow'
                , size: 1000
                , position: -500
            }
            , mercury: {
                color: 'white'
                , size: 3.504
                , position: 0// 57.093
            }
            , venus: {
                color: 'cyan'
                , size: 8.6911
                , position: 7.7697
            }
            , earth: {
                color: 'blue'
                , size: 9.1492
                , position: 1.0742
            }
            , mars: {
                color: 'red'
                , size: 4.8676
                , position: 1.6367
            }
            , jupiter: {
                color: 'brown'
                , size: 100.4
                , position: 5.5903
            }
            , saturn: {
                color: 'brown'
                , size: 83.626
                , position: 1.0293
            }
            , uranus: {
                color: 'blue'
                , size: 36.422
                , position: 2.0656
            }
            , neptune: {
                color: 'green'
                , size: 35.359
                , position: 3.2336
            }
            , pluto: {
                color: 'white'
                , size: 1.7003
                , position: 4.2178
            }
        }
    }

    scaler(){

        // let sun = this.ball('yellow', 1000)
        // let mercury = this.ball('red', 3.504)
        // let venus = this.ball('cyan', 8.6911)
        // let earth = this.ball('blue', 9.1492)
        // let mars = this.ball('red', 4.8676)
        // let jupiter = this.ball('brown', 100.4)
        // let saturn = this.ball('brown', 83.626)
        // let uranus = this.ball('blue', 36.422)
        // let neptune = this.ball('green', 35.359)
        // let pluto = this.ball('white', 1.7003)
        // sun.position(0, 0, 0)
        // mercury.position(41.663, 0, 0)
        // venus.position(77.67, 0, 0)
        // earth.position(107.457, 0, 0)
        // mars.position(163.689, 0, 0)
        // jupiter.position(559.048, 0, 0)
        // saturn.position(1025.217, 0, 0)
        // uranus.position(2062.145, 0, 0)
        // neptune.position(3232.919, 0, 0)
        // pluto.position(4248.15, 0, 0)

        let conf = this.planetConfig()
        let planets = {};
        let r, item;
        let t = 0
        let names = ['sun', 'mercury']
        for(let name in conf) {
            if(names.indexOf(name) == -1) continue;
            item = conf[name]
            t +=  item.size
            r = new Sphere({
                diameter: item.size
                , color: item.color
                , position: [item.position, 0, 0]
            });

            r.addToScene()
            planets[name] = r;
        }

        this.planets = planets
    }

    ball(color, size=1){
        let r = new Sphere({
            diameter: size
            , color: color
        });

        r.addToScene()
        return r;
    }
}


Garden.register(Scaling)
