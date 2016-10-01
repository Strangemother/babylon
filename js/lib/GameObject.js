
var loadConfig = function(name) {
    var v = localStorage[name];
    if(v === undefined) {
        return
    }
    return JSON.parse(v)
}

var saveConfig = function(name, data) {
    return localStorage[name] = JSON.stringify(data)
}


class GameObject extends CoreClass {
    /* Load a 3D object from a file */
    get name(){
        return this._name
    }

    set name(v){
        this._name = v
        return true;
    }

    init(name) {
        if(this.name != name) {
            this.name = name
        }

        this.events = new EventEmitter(name);
        // console.log('load asset', this.name)
        return super.init.apply(this, arguments);
    }

    load() {
        path = CONFIG.asset_path + this.name
    }
}


class GameSceneObject extends GameObject {
    /*
     Accepts name and scene, or just scene without name
     for construct.
     */
    constructor(name, scene, late=false) {
        var v =super(name, scene, late)
        this._object = undefined;
    }

    init(name, scene) {
        this.scene = scene;
        if( arguments.length == 1
            && typeof(name) != 'string') {
            this.scene = name
            name = undefined
        }
        this.log('new actor')
        return super.init(name)
    }

    remove(){
        /* remove from scene*/
        if(this._object) {
            this._object.dispose()
        }
    }
}


class GameActor extends GameSceneObject {
    init(scene, name) {
        name = this.name;
        return super.init(name, scene)
    }

    itemType(scene){
        return 'box'
    }

    itemArgs(scene){
        return {}
    }

    get name(){
        return 'actor'
    }

    run(scene) {
        this._item = this.item(scene)
    }

    item(scene, name){
        /* item instance used as an actor*/
        var config = Object.assign({
            type: this.itemType(scene)
        }, this.itemArgs(scene) );

        name = name || this.name
        return this.interface.objects.render(scene, config, name)
    }

    camera(){
        /* return the camer used by the actor*/
    }

    data(){
        /* return actor data such as position.*/
    }
}


// vs._drawVirtualJoystick()

class SimpleGamepad {
    /*
    s = new SimpleGamepad;
    gs=g.level.scene;
    s = new SimpleGamepad(gs)
     */
    constructor(gameScene){
        this.gameScene = gameScene;
        this._gamepads = []
        this.run(gameScene)
    }

    run(gameScene) {
        gameScene = gameScene || this.gameScene;
        /* start the gamepad hook*/
        this.gamepads = new BABYLON.Gamepads(this.connected.bind(this));
        this.gamepads._startMonitoringGamepads();
        if(gameScene && gameScene._renderers) {
            gameScene._renderers.push(this.renderLoop.bind(this) )
        }
    }

    renderLoop(scene, index){

        this.gamepads._updateGamepadObjects()

        for (var i = 0; i < this._gamepads.length; i++) {
            this._gamepads[i].update()
        }
    }

    connected(e) {
        /* pad connection*/
        console.log('pad connected', this, arguments);
        this.addGamepad(e.browserGamepad)
    }

    addGamepad(gamepad) {
        /*Add the gamepad to the list of value pads.*/
        var Gamepad = BABYLON.Xbox360Pad;
        var g = new Gamepad(gamepad.id, gamepad.index, gamepad);
        this.listen(g)
        this._gamepads.push(g)
        return g;
    }

    getGamepad(index) {
        /* return a gamepag by index, if no index is supplied the
        last is returned.*/
        index = index || this._gamepads.length - 1;
        return this._gamepads[index]
    }

    listen(gamepad) {

        var methodMap = {
            onbuttondown: this.buttonDown
            , onbuttonup: this.buttonUp
            , ondpaddown: this.dPadDown
            , ondpadup: this.dPadUp
            , onleftstickchanged: this.leftStick
            , onrightstickchanged: this.rightStick
            , onlefttriggerchanged: this.leftTrigger
            , onrighttriggerchanged: this.rightTrigger
        }

        for(var funcName in methodMap) {
            gamepad[funcName](methodMap[funcName].bind(this) )
        }
    }

    buttonDown(){
        console.log('buttonDown', arguments)
    }

    buttonUp(){
        console.log('buttonUp', arguments)
    }

    dPadDown(){
        console.log('dPadDown', arguments)
    }

    dPadUp(){
        console.log('dPadUp', arguments)
    }

    leftStick(xy){
        console.log('leftStick', arguments)
    }

    rightStick(xy){
        console.log('rightStick', arguments)
    }

    leftTrigger(){
        console.log('leftTrigger', arguments)
    }

    rightTrigger(){
        console.log('rightTrigger', arguments)
    }

}

