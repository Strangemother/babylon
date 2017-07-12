class ShareScale {
    constructor(item) {
        this.item = item;
    }
}

class BoxLightCameraExample extends Garden{

    start(){
        this.box = new Box({ color: 'green' });
        this._camera = new ArcRotateCamera({
            activate:true
            , control: true
            , alpha: -1.29
            , beta: 1.30

        });

        this._camera._babylon.inputs.attached.gamepad.detachControl()
        this._light = new HemisphericLight();

        this.children.addMany(this.box, this._camera, this._light);
    }
}

class ControllerExample extends BoxLightCameraExample {

    start(){
        super.start()
        this.waitConnect()
    }

    waitConnect(){
        this.minHeight = .1
        this.maxScale = 3;

        let con = new InputController()
        con.waitConnect()
        con.addMap(this.inputMap())
        this.con  = con
    }

    downScale(item, value){
        let l = asVector(this.minHeight, this.minHeight, this.minHeight)
            .MaximizeInPlace(
                item.scaling().subtract(
                    asVector(value, value, value)
                )
            )
        item.scaling(l)
    }

    upScale(item, value) {
        let l = asVector(this.maxScale, this.maxScale, this.maxScale)
            .MinimizeInPlace(
                value.scaling().add(
                    asVector(value, value, value)
                )
            )
        value.scaling(l)
    }

    xyScale(item, value){
        let l = asVector(this.minHeight, this.minHeight, this.minHeight)
            .MaximizeInPlace(
                item.scaling().addInPlace(
                    asVector(value.x*.08, -value.y*.08, 0)
                )
            )

        item.scaling(l.MinimizeInPlace(asVector(3,3,3)))
    }

    xyRotate(item, value) {
        item.rotation().addInPlace(asVector(-(value.y*.09), (value.x*.09), 0))
    }

    resetScale(item){
        console.log('scale reset')
        item.scaling(1,1,1)
        item.rotation(0,0,0)
    }

    inputMap(){
        let self = this;
        return {
            [INPUT.RIGHTTRIGGER_CHANGED](controller, zone, name, value){
                console.log(zone, name, value)

                self.upScale(self.box, value * .12)
            }
            , [INPUT.LEFTTRIGGER_CHANGED](controller, zone, name, value){
                console.log(zone, name, value)

                self.downScale(self.box, value * .12)
            }
            , [INPUT.RIGHTSTICK_CHANGED](controller, zone, name, value) {
                console.log(zone, name, value)

                self.xyRotate(self.box, value)
            }

            , [INPUT.LEFTSTICK_CHANGED](controller, zone, name, value) {
                console.log(zone, name, value)

                self.xyScale(self.box, value);
            }

            , [INPUT.BUTTON_UP](controller, zone, name, value) {

                if(value == XBOX_BUTTON.BUTTON.B[0]) {
                    self.resetScale(self.box)
                }
            }
        }
    }
}


class JoystickExample extends ControllerExample {

    waitConnect(){
        super.waitConnect()

        this._scene.registerAfterRender(function() {

        });
    }

    inputMap(){
        let r = super.inputMap()
        r[INPUT.BUTTON_UP] = function(controller, zone, name, value){
            console.log(zone, name, value)
        }

        return r;
    }
}


class ControllerVehicleExample extends BoxLightCameraExample {

    start(){
        this.ball = new Sphere()
        this.ball.addToScene()
        super.start()
        this.waitConnect()
    }

    waitConnect(){
        let self = this;
        this.minHeight = .1
        this.maxScale = 3;
        this.speed = 0

        this[INPUT.RIGHTTRIGGER_CHANGED] = 0
        self.joydir = asVector(0,0,0)


        let con = new InputController()
        con.waitConnect()
        con.addMap(this.inputMap())

        let p = self.box.position();
        let r = self.box.rotation();
        this._scene.registerAfterRender(function() {

            p.x -= Math.sin( r.y ) * self.speed;
            p.z -= Math.cos( r.y ) * self.speed;

        });
    }

    updateActor(){
        let model = self.box;
        var target = model.position().clone();
        var forward = target.subtract(self.box.position() ).normalize();
        var diffAngle = Math.atan2(forward.x,forward.z);
        var joyangle = Math.atan2((self.joydir.y * 180 / Math.PI),-(self.joydir.x * 180 / Math.PI));

        model.rotation.y = diffAngle + joyangle + Math.PI;

        var rot = diffAngle + joyangle;
        var v2 = BABYLON.Vector3.TransformCoordinates(
            new BABYLON.Vector3(0, 0, 0.5),
            BABYLON.Matrix.RotationY(rot)
        );

        model.position().addInPlace(v2);
    }

    inputMap(){
        let self = this;
        return {
            [INPUT.RIGHTTRIGGER_CHANGED](controller, zone, name, value){
                //self.box.position().z += value * .09
                self.speed = -value * .5
            }

            , [INPUT.LEFTTRIGGER_CHANGED](controller, zone, name, value){
                // self.box.position().z -= value * .09
                self.speed = value * .5
            }

            , [INPUT.RIGHTSTICK_CHANGED](controller, zone, name, value) {
                self.box.rotation().y += value.x * .09
                // self.box.rotation().x += -value.y * .09
                self.joydir = value
                }

            , [INPUT.LEFTSTICK_CHANGED](controller, zone, name, value) {
            }

            , [INPUT.BUTTON_UP](controller, zone, name, value) {

                if(value == XBOX_BUTTON.BUTTON.B[0]) {
                    self.box.rotation(0,0,0)
                    self.box.position(0,0,0)
                }
            }
        }
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
        this.posScale()

        let con = new InputController()
        con.waitConnect()
        con.addMap({
            [INPUT.LEFTTRIGGER_CHANGED](controller, zone, name, value){
                console.log('T', zone, value)
            }
            , [INPUT.LEFTSTICK_CHANGED](controller, zone, name, value) {
                console.log('L', zone, value)
            }

            , [INPUT.BUTTON_UP](controller, zone, name, value) {
                console.log('Buton UP', value)
            }
        })
    }

    posScale(){
        let il = this.planets.left;
        let ir = this.planets.right;
        let ia = this.planets.actor;

        let max = 100
        let irp = ir.position();
        let iap = ia.position();
        let distance = iap.subtract(irp);
        let sc = ir.scaling()
        /*
            33 = 7
            0 = 10
            100 = 0
            50 = 5
            33 = 7
         */
        let scV = asVector(
            (1 / 100) * Math.abs(distance.length())
            , (1 / 100) * Math.abs(distance.length())
            , (1 / 100) * Math.abs(distance.length())
        )
        console.log(scV)
        ir.scaling(scV)


        console.log('distance', distance, distance.length())
    }

    shortConfig(){
        return {
            left: {
                color: 'white'
                , size: 5
                , position: -10
            }
            , right: {
                color: 'white'
                , size: 5
                , position: 10
            }
            , actor: {
                color: 'red'
                , size: 1
                , position: 0
            }
        }
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
        let conf = this.shortConfig()
        // let conf = this.planetConfig()
        let planets = {};
        let r, item;
        let t = 0
        let names = ['sun', 'mercury']
        for(let name in conf) {
            // if(names.indexOf(name) == -1) continue;
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


Garden.register(
    Scaling,
    ControllerExample,
    JoystickExample,
    ControllerVehicleExample,
    BoxLightCameraExample
    )
