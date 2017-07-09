function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



class Force extends Garden {

    init(config){

        config = config || {};
        config.backgroundColor = [.2, .2, .4];
        super.init(config);

        this.run();
    }

    start(){

        this._camera = new ArcRotateCamera({
            position: [-2, 20, -20]
            , alpha: -1
            , beta: .8
            , radius: 19
        });

        this.light = new HemisphericLight({ color: 'white' });

        this.children.addMany(this.light);
        this._camera.activate();

        sceneClickers.onClick.add(this.onClick)

        this.sandbox()
    }

    onClick(item, gInst, ev){
        console.log('onClick', gInst)
        // this.boxBound(gInst)
    }

    sandbox(){
        let b = this.ball;
        let mag1 = 200;
        let f1Deg = 60;
        // let f1 = mag1 * Math.cos(f1Deg) * i + 200 * Math.sin(f1Deg) * j
        this.entity()
        this.setKeyTrigger()
        this.vectorData()

        // The keys move the entity; not the camera.
        // this._camera.detach()
        app._camera._babylon.inputs.attached.keyboard.detachControl()
    }

    vectorData(){
        this._rotation = asVector(0,0,0)
        this._force = asVector(0,0,0)
    }

    beforeRender(scene, eventState){
        this._rotation.y += .01
        this._bBox.rotation.y = this._rotation.y

        // Rotate by local space reference; looping at
        //app._rBox0.rotate(BABYLON.Axis.Z, this._force.y, BABYLON.Space.LOCAL)

        //app._rBox0.rotate(BABYLON.Axis.Y, this._force.z, BABYLON.Space.LOCAL)

        this._rBox0.rotation.y = this._force.z
        this._rBox1.rotation.y += -this._force.z

    }

    entity(){
        this.force = 0

        this.box0 = new Box({
            color: 'green'
            , height: 5
            , position: [0, 0, 0]
        });

        this.box1 = new Box({
            color: 'white'
            , height: 2
            , position: [2, -2, 0]
        });

        this.box2 = new Box({
            color: 'white'
            , height: 2
            , position: [-2, -2, 0]
        });


        this.children.addMany(this.box0, this.box1, this.box2)

        this._bBox = this.box0._babylon;
        this._rBox0 = this.box1._babylon;
        this._rBox1 = this.box2._babylon;

        app._scene.registerBeforeRender(this.beforeRender.bind(this))
    }

    setKeyTrigger(){
        let trigger = BABYLON.ActionManager.OnKeyDownTrigger
        let ex = new BABYLON.ExecuteCodeAction(trigger, this.keyup.bind(this))
        let am = app.actionManager()
        am.registerAction(ex);
    }

    keyup(e) {
        let key = e.sourceEvent.key;
        if(this[`keyup_${key}`] != undefined){
            this[`keyup_${key}`](e)
        }
    }

    keyup_ArrowUp(e){
        this._force.y += .001
    }

    keyup_ArrowDown(e){
        this._force.y -= .001
    }

    keyup_w(e){
        this._force.z += .001
    }

    keyup_s(e){
        this._force.z -= .001
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
                      getRandomIntInclusive(-10, 10)
                    , getRandomIntInclusive(-10, 10)
                    , getRandomIntInclusive(-10, 10)
                ]
            , size: [
                [
                    getRandomIntInclusive(2, 20)
                    , getRandomIntInclusive(2, 20)
                ]
                , getRandomIntInclusive(2, 20)
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


Garden.register(SlowBoxDraw, Force)
