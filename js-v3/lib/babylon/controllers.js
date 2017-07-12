INPUT = {
    BUTTON_DOWN: 'button_down'
    , BUTTON_UP: 'button_up'
    , DPAD_DOWN: 'dpad_down'
    , DPAD_UP: 'dpad_up'
    , LEFTTRIGGER_CHANGED: 'lefttrigger_changed'
    , RIGHTTRIGGER_CHANGED: 'righttrigger_changed'
    , LEFTSTICK_CHANGED: 'leftstick_changed'
    , RIGHTSTICK_CHANGED: 'rightstick_changed'

    , BUTTON : 'button'
    , DPAD: 'dpad'
    , TRIGGER : 'trigger'
    , STICK : 'stick'

    , idFromVal(value, type){

        if(type === undefined) {
            for(let key in this) {
                if(this[key] == value) return key;
            }
        };

        for(let key in this) {
            if(this[key] == value) return key;
        }
    }
}

XBOX_BUTTON = {
    BUTTON:{
          A: [0, 'A']
        , B: [1, 'B']
        , X: [2, 'X']
        , Y: [3, 'Y']
        , BACK: [5, 'Back']
        , START: [4, 'Start']
        , LB: [6, 'LB']
        , RB: [7, 'RB']
        , LEFTSTICK: [8, 'LeftStick']
        , RIGHTSTICK: [9, 'RightStick']
    }

    , DPAD: {
        DOWN: [1, 'Down']
        , LEFT: [2, 'Left']
        , RIGHT: [3, 'Right']
        , UP: [0, 'Up']
    }

    , TRIGGER: 'change'
    , STICK: 'change'

    , idFromInt(i, type) {
        let _t = this[type];
        if(_t == undefined) {
            _t = this[INPUT.idFromVal(type)]
        }

        for(let key in _t) {
            if(_t[key][0] == i) return key;
        }

        return _t;
    }
}


class InputController {
    /*
     An input Controller binds babylon gamepads to a functional repeater
     through keys.
     */
    constructor(){
        this.controllers = []
        this.keyChain = {}
    }

    waitConnect() {
        /* Attach the funtional caller to BABYLON */
        this.gamepads = new BABYLON.Gamepads(this.onConnect.bind(this))
    }

    onConnect(inputDevice){
        /* Called by BABYLON upon a new controller connection*/
        return this.setupController(inputDevice)
    }

    setupController(inputDevice) {
        /* Given a inputDevice object, perform all operations to bind the controller
        to the keymapping.*/
        console.log("Setup inputDevice", inputDevice.id)
        let index = this.controllers.push(inputDevice) - 1
        let self = this;
        let boundCaller = function(item){
            return self.controllerCall.bind({ item, self, index })
        }

        for(let item of this.boundMethods()) {
            let name = item.name;
            /* call each mapped method with a new calling function */
            try {
               inputDevice[name](boundCaller(item).bind(this))
            } catch(e) {
                console.warn(`Connected device ${inputDevice.id} does not support ${name} function`)
            }
        }

        /*
            id
            index
            browserGamepad
            _leftStickAxisX
            _leftStickAxisY
            _rightStickAxisX
            _rightStickAxisY
            _leftStick
            _rightStick
            _leftTrigger
            _rightTrigger
            _buttonA
            _buttonB
            _buttonX
            _buttonY
            _buttonBack
            _buttonStart
            _buttonLB
            _buttonRB
            _buttonLeftStick
            _buttonRightStick
            _dPadUp
            _dPadDown
            _dPadLeft
            _dPadRight
            _isXboxOnePad
         */
    }

    boundMethods(){
        /* Return a list of names of methods to bind onto the input controller
        Each name will be called as a function on the controller during setup.
        Each caller function maps to an a method of this instance */
        return [
              { name: "onbuttondown",           type: INPUT.BUTTON,  id: INPUT.BUTTON_DOWN }
            , { name: "onbuttonup",             type: INPUT.BUTTON,  id: INPUT.BUTTON_UP }
            , { name: "ondpaddown",             type: INPUT.DPAD,  id: INPUT.DPAD_DOWN }
            , { name: "ondpadup",               type: INPUT.DPAD,  id: INPUT.DPAD_UP }
            , { name: "onlefttriggerchanged",   type: INPUT.TRIGGER,  id: INPUT.LEFTTRIGGER_CHANGED }
            , { name: "onrighttriggerchanged",  type: INPUT.TRIGGER,  id: INPUT.RIGHTTRIGGER_CHANGED }
            , { name: "onleftstickchanged",     type: INPUT.STICK,  id: INPUT.LEFTSTICK_CHANGED }
            , { name: "onrightstickchanged",    type: INPUT.STICK,  id: INPUT.RIGHTSTICK_CHANGED }
        ]
    }

    controllerCall(value) {
        /* Called by any mapped method by the controller on change */
        let controller = this.self.controllers[this.index]
        let buttonName = XBOX_BUTTON.idFromInt(value, this.item.type);
        let inputZone = INPUT.idFromVal(this.item.id, this.item.type)

        this.self.callInput(controller, inputZone, buttonName, value)
    }

    callInput(controller, inputZone, buttonName, value) {
        // console.log(controller.index, inputZone, buttonName, value)

        // call chain
        let ch = this.keyChain[inputZone.toLowerCase()];
        if(ch != undefined) {
            this.callKeyChain(ch, controller, inputZone, buttonName, value)
        }
    }

    callKeyChain(keyChain, controller, inputZone, buttonName, value){

        // console.info('call', inputZone, buttonName)
        // console.info(keyChain)
        for (var i = keyChain.length - 1; i >= 0; i--) {
            keyChain[i](controller, inputZone, buttonName, value)
        }
    }

    addMap(){
        /*
        Given arguments of lists, each item (type array) is a keymap
        */
        for (var i = arguments.length - 1; i >= 0; i--) {
            let _t = IT.g(arguments[i]);
            if(_t.is('object')) {
                /*
                    addMap(){
                        rightStick_Changed(){}
                    }
                 */
                for(let key in arguments[i]){
                    this.addKeyFunctionMap(key, arguments[i][key], arguments[i])
                }
            }

            if(_t.is('array')) {
                this.addKeyFunctionMap(arguments[i][0], arguments[i][1], arguments)
            }

        }
    }

    addKeyFunctionMap(inputKey, functionCallback, keys) {
        /* Map a input i.e "INPUT.TRIGGER', to a function callback */
        let lik = inputKey.toLowerCase()
        if(this.keyChain[lik] == undefined) {
            this.keyChain[lik] = []
        }

        console.log('add', lik, 'to callbacks')
        this.keyChain[lik].push(functionCallback)
    }

    keys(){
        return {
            //XBOX_BUTTON.A: 1
        }
    }
}
