class Trigger extends BaseClass {
    /*
    trigger = BABYLON.ActionManager.OnKeyUpTrigger
    action = new BABYLON.ExecuteCodeAction(trigger, function (evt) {
       if (evt.sourceEvent.key == "r") {}
    });
    scene.actionManager.registerAction(action);
     */
    hookName(){
        return
    }

    init(executeFunction, ...args) {
        if(executeFunction != undefined) {
            this._executeFunction = executeFunction;
        };
        this._initArgs = args;
    }

    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.triggers */
        return 'triggers'
    }

    getBabylonValue(){
        /* Return the Babylon class*/
        let r = this.getTriggerName()
        let b = BABYLON.ActionManager[r];
        return b;
    }

    getTriggerName() {
        /* Return the string name of the BABYLON trigger.
        By Default the class name prefixed with "On" should
        match a BABYLON trigger.

            On[PickTrigger]
        */
        let name = this.constructor.name;
        return `On${name}`;

    }

    action(item) {
        /* Create and return an action trigger.
        If an item is given, the new trigger is registered
        to the ActionManager.
        If the ActionManager does not exist, it is created.

            m = app.balls[0];
            p = new PickTrigger;
            p.action(m)
            // Pick view item.
        */
        let scene = Garden.instance().scene();
        let mesh = item || scene;

        // Instance protect.
        if( item instanceof(BabylonObject) && item._babylon != undefined) {
            console.info('Fetching _babylon from action object');
            mesh = mesh._babylon;
        };

        let [bCaller, bArgs] = this.actionArgs(item);
        let trigger = this.getBabylonValue();

        let action = new bCaller(trigger, ...bArgs);

        if(mesh != undefined) {
            if(!mesh.actionManager) {
                mesh.actionManager = new BABYLON.ActionManager(scene);
            };

            mesh.actionManager.registerAction(action);
        };

        return action;
    }

    get _babylon(){
        return this.action()
    }

    getBabylonAction(){
        /* Return the BABYLON action type,
        By default this is the ExecureCodeAction */
        return BABYLON.ExecuteCodeAction
    }

    actionArgs(...args) {
        /* Returns an array of [action, args] args for the action caller.*/
        return [this.getBabylonAction(), this.babylonArgs(...args)]
    }

    babylonArgs(...args){
        return [this.babylonExecuteFunction(...args)]
    }

    babylonExecuteFunction(...args){
        /* Returns a function for the ExecuteAction - Calling this.executeFunction
        within the right scope. */
        return (function(_this, ..._args){
            return function(evt){
                _this.executeFunction(this, evt, ..._args)
            }
        })(this, ...args)
    }

    executeFunction(action, evt, referenceItem, ...args) {
        /* Called by BABYLON action when the action occurs within the Scene.
        Nothing is returned. If the this._executeFunction exists, it's called
        with trigger and args. */

        if(this._executeFunction) {
            this._executeFunction(action, evt, referenceItem, ...args)
            return;
        };

        console.log('Trigger', referenceItem.id, this.getTriggerName());
    }
}


class KeyTrigger extends Trigger {
    /* A slightly altered trigger for quicker binding to the
    scene with keys.*/

    init(key=this.defaultChar(), executeFunction, ...args) {
        /* KeyTrigger accepts key char as first argument. */
        if( executeFunction == undefined
            && IT.g(key).is('function') ) {
            executeFunction = key;
            key = this.defaultChar()
        }
        super.init(executeFunction, ...args)
        this.keyChar = key
    }

    defaultChar(){
        return 'Enter'
    }

    getTriggerName(){
        return 'OnKeyUpTrigger'
    }

    char(){
        /* Return the trigger character*/
        return this.keyChar
    }

    babylonArgs(){
        /* Override to inject the extra args into the executeFunction -
        for convenience. */
        return [this.babylonExecuteFunction(this.char())]
    }

    getBabylonValue(){
        /* Return the Babylon class*/
        let b = super.getBabylonValue()
        return { trigger: b, parameter: this.char() };
    }

    action(scene) {
        scene = scene || Garden.instance().scene();
        return super.action(scene)
    }

    // executeFunction(action, evt, char, ...args) {
    //     /* Trigger function accepts the extra arg `char`.
    //     By nature of the API, the override is not required as the char
    //     would be the first var in ...args*/
    //     return super.executeFunction(...arguments)
    // }

}

class KeyHandler extends Trigger {

    init(direction='Up', executeFunction, ...args) {
        /* Store the direction, call the super and
        call the action with the instance Scene.*/
        if( executeFunction == undefined
            && IT.g(direction).is('function') ) {
            executeFunction = direction;
            direction = 'Up';
        };

        this.direction = direction;
        super.init(executeFunction, ...args)
        this.action(Garden.instance().scene());
    }

    getTriggerName(){
        /* Return name of the trigger, applied with this.direction */
        return `OnKey${this.direction}Trigger`
    }

    char(){
        /* Return the trigger character*/
        return this.lastChar
    }

    executeFunction(action, evt, ...args) {
        /* Called by BABYLON action when the action occurs within the Scene.
        Nothing is returned. If the this._executeFunction exists, it's called
        with trigger and args. */

        if(this._executeFunction) {
            this._executeFunction(action, evt, evt.sourceEvent.key, ...args)
            return;
        };

        console.log('Key Handle', evt.sourceEvent.key);
    }

    set handler(func) {
        this._executeFunction = func;
        return true;
    }

    get handler(){
        return this._executeFunction;
    }
}

class PickTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnPickTrigger
    //  : Raised when the user touches/clicks on a mesh.
}


class PickDownTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnPickDownTrigger
    //  : Raised when the user touches/clicks down on a mesh
}


class PickUpTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnPickUpTrigger
    //  : Raised when the user touches/clicks up on a mesh.
}


class PickOutTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnPickOutTrigger
    //  : Raised when the user touches/clicks down on a mesh and then move off-of the mesh.
}


class LeftPickTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnLeftPickTrigger
    //  : Raised when the user touches/clicks on a mesh with left button.
}


class RightPickTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnRightPickTrigger
    //  : Raised when the user touches/clicks on a mesh with right button.
}


class CenterPickTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnCenterPickTrigger
    //  : Raised when the user touches/clicks on a mesh with center button.
}


class LongPressTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnLongPressTrigger
    //  : Raised when the user touches/clicks up on a mesh for a long period of time (defined by BABYLONActionManager.LongPressDelay).
}


class PointerOverTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnPointerOverTrigger
    //  : Raised when the pointer is over a mesh. Raised just once.
}


class PointerOutTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnPointerOutTrigger
    //  : Raised when the pointer is no more over a mesh. Raised just once.
}


class IntersectionEnterTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnIntersectionEnterTrigger
    //  : Raised when the mesh is in intersection with another mesh. Raised just once.
}


class IntersectionExitTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnIntersectionExitTrigger
    //  : Raised when the mesh is no more in intersection with another mesh. Raised just once.
}


class KeyDownTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnKeyDownTrigger
    //  : Raised when a key is press.
}


class KeyUpTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnKeyUpTrigger
    //  : Raised when a key is up
}


class EveryFrameTrigger extends Trigger {
    // BABYLON.ActionManager.

    // OnEveryFrameTrigger
    //  : ???
}

Garden.register(
    PickTrigger
    , PickDownTrigger
    , PickUpTrigger
    , PickOutTrigger
    , LeftPickTrigger
    , RightPickTrigger
    , CenterPickTrigger
    , LongPressTrigger
    , PointerOverTrigger
    , PointerOutTrigger
    , IntersectionEnterTrigger
    , IntersectionExitTrigger
    , KeyDownTrigger
    , KeyUpTrigger
    , EveryFrameTrigger
)
