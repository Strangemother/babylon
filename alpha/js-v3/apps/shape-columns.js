
class ShapeColumn extends Garden {
    start(){
        this._light = new HemisphericLight();
        this._camera = new ArcRotateCamera({activate:true});
        this.children.add(this._light);

        let t = new app.shapes.TriangleLines({ color: 'green' });
        let meshes = this.meshes = []

        let n = -Math.floor(colors.names.length/2), m;
        for(let c of colors.names) {
            m = t.create({
                color: c
                , position: [0, n++, 0]
                , rotation: [0, (n++)*.01, 0]
            })
            meshes.push(m)
        }
    }

    _destroyable(){
        return [
            this._camera
            , this._light
            , this.meshes
        ]
    }
}


class SlowBoxDraw extends Garden {

    init(config){

        config = config || {};
        config.backgroundColor = [.2, .2, .4];
        super.init(config);

        this.run();
    }

    start(){

        this._camera = new ArcRotateCamera({
            position: [4, 2, -4]
            , radius: 50
        });

        this.light = new HemisphericLight({ color: 'white' });

        this.children.addMany(this.light);
        this._camera.activate();

        sceneClickers.onClick.add(this.onClick)

        this.ball = this.centerPoint()
        this.children.addMany(this.ball)
        this.sandbox()
    }

    onClick(item, gInst, ev){
        console.log('onClick', gInst)
        // this.boxBound(gInst)
    }

    centerPoint(){

        let b1 = new Sphere({
            color: 'red'
            , position: asVector(0, 0, 0)
        });

        return b1
    }

    sandbox(){
        /* Generate the entire play space*/
        let loopCall = function(){
            window.setTimeout(function(){
                this.createBox(this.getRandomConfig(), loopCall)
            }.bind(this), 900)
        }.bind(this)

        this.createBox(this.getRandomConfig(), loopCall)
        // this.universe = this.createBox(config)
    }

    getRandomConfig(){
        return {
            // Universe size
            position: [
                      randomInt(-10, 10)
                    , randomInt(-10, 10)
                    , randomInt(-10, 10)
                ]
            , size: [
                [
                    randomInt(2, 20)
                    , randomInt(2, 20)
                ]
                , randomInt(2, 20)
            ]
            , speed: 60
        }

    }

    buildDone(lines){
        console.log('made', lines)
    }

    boxBound(){
        /* apply the bound box.*/

    }

    createBox(config, cb) {
        /* build the playable area*/

        // Apply space bounding box.
        // As box
        let position = asVector(config.position);

        let x = 5
        let shapes = []
        let connects =[]
        var self = this;
        let speed = config.speed != undefined? config.speed: 50
        var instanceArray = this._connects ||[];

        // Create two squares
        let [a, b] = [
                this.createLineArgs(
                        [
                            position.x, position.y , position.z
                        ]
                        , instanceArray.splice(0, 4)
                        , config.size[0]
                    )
                , this.createLineArgs(
                        [
                            position.x + 20, position.y , position.z
                        ]
                        , instanceArray.splice(4)
                        , config.size[1]
                    )
            ]

        let lines = a.concat(b);


        let line = lines.pop();
        this._connects = connects;
        this._shapes = shapes;
        this._lines= lines;

        this._mainSlowTimer = window.setInterval(function(){
            let gInst = self.createLine.apply(self, line);
            connects.push(gInst);
            gInst.addToScene();

            line = lines.pop();
            if(line == undefined) {
                window.clearInterval(self._mainSlowTimer)
                self.slowAddConnections(a, b, connects, instanceArray, speed, cb)
                return
            };
        }, speed)

    }

    slowAddConnections(a, b, storeArray=undefined, instanceArray=undefined, ms=1000, cb) {

        let connects = storeArray != undefined ? storeArray: []
        let self = this;
        /* The current math plots the last item in the same position
        as the first, as the two squres 'turtle' draw the lines.
        Therefore the _last_ vectors of the first line are used
        for the missing step. */
        let stepBackInterval = 1;
        instanceArray = instanceArray == undefined? Array(connects.length):instanceArray

        this._slowTimer = window.setInterval((function(a, b){
            return function(){
                let pos = a.length - 1;
                let item = a.pop();
                let itemB = b.pop();

                if(item === undefined) {
                    window.clearInterval(self._slowTimer)
                    cb && cb(connects)
                    return
                };

                let [lineA, lineB] = [item, itemB]
                let line = self.createLine(
                        lineA[stepBackInterval], lineB[stepBackInterval]
                        , instanceArray[pos]
                        , 'dodgerBlue'
                    )
                connects.push(line)
                stepBackInterval = 0
                line.addToScene()
            }
        })(a,b), ms);
    }

    createLine(vectorA, vectorB, instance, color='green') {
        let LinesClass = app.shapes.Lines;

        let lines = new LinesClass({
            points: [ vectorA, vectorB ]
            , color: color
            , updatable: true
            , instance: instance == undefined? instance: asBabylon(instance)
        })

        return lines;

    }

    createLineArgs(positionVector, instances, size=1) {
        let pv = asVector(positionVector);
        let [x,y] = [size, size]

        if( IT.g(size).is('array') ) {
            [x,y] = size;
        }

        return [
            // up
            [
                asVector(pv.x, pv.y, pv.z)
                , asVector(pv.x, y + pv.y, pv.z)
                , instances[0]
                , 'green'
            ]

            // back
            , [
                asVector(pv.x, y + pv.y, pv.z)
                , asVector(pv.x, y + pv.y, x + pv.z)
                , instances[1]
                , 'white'
            ]
            // down
            , [
                asVector(pv.x, y + pv.y, x + pv.z)
                , asVector(pv.x, pv.y, x + pv.z)
                , instances[2]
                , 'red'
            ]
            // forward to Start
            , [
                asVector(pv.x, pv.y, pv.z)
                , asVector(pv.x, pv.y, x + pv.z)
                , instances[3]
                , 'yellow'
            ]
        ]
    }
}

class SplineExample extends Garden {

    basicScene(){

        this._camera = new ArcRotateCamera({
            position: [0, 20, -20]
            , alpha: 1
            , beta: .5
            , radius: 600
            , activate: true
        });

        this.axis = new ColorAxisArrow({ size: 20})
        this.axis.addToScene()

    }

    createSplines(count=10) {

        if(this.splines != undefined) {
            for (var i = 0; i < this.splines.length; i++) {
                this.splines[i].destroy()
            }
        }

        this.splines = []
        for (let i = 0; i < count; i++) {
            let s = new Spline;
            this.splines.push(s)
            s.draw()//{ initial: asVector(0, 1, 0)})
        };
    }

    start(){
        this.rl = 0
        this.max = 150;
        this.count = 10;
        this.exotic = false;
        this.padding = 1;
        this.basicScene();
        this.stepTimer()
    }

    runTimer(){
        let i = 0;
        let self =  this;
        this.createSplines(this.count)

        this.timer = window.setInterval(function(){

            i++;
            self.renderSplines(i)
            if(i > self.max) {
                window.clearInterval(self.timer)
                self.stepTimer()
                i = 0
            }

        }, 30)
    }

    renderSplines(i){
        let l = this.splines.length;
        for (var j = 0; j < this.splines.length; j++) {
            let s = this.splines[j];
            let distance = j;

            if(this.exotic) {
                distance = (j * i) / this.distance;
            };

            var points = [];
            let vector = asVector(
                 -(i + j + this.padding) * Math.sin(Math.PI * (i + j) / this.xStep) + distance
                , -(i + j + this.padding) * Math.cos(Math.PI * (i + j) / this.yStep) + distance
                , (i + j + this.padding) * Math.cos(Math.PI * (i + j ) / this.zStep) + distance
                )

            s.points.add(vector);
            //posVec.position(vector)
        }
    }

    stepTimer() {
        this.distance = randomInt(1, 10)
        this.yStep = randomInt(10,40)
        this.zStep = randomInt(this.yStep, this.yStep + randomInt(-10, 20))
        this.xStep = randomInt(this.zStep, this.yStep + randomInt(-10, 20))
        console.log(this.xStep, this.yStep, this.zStep, this.distance)
        window.setTimeout(this.runTimer.bind(this), 1000)

    }
}

Garden.register(ShapeColumn, SlowBoxDraw, SplineExample)
