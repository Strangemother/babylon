class Action extends BabylonObject {
    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.actions */
        return 'actions'
    }

    init(trigger, path='opacity', value=1, time=1000) {
        this.trigger = trigger || PickTrigger;
        this.path = path;
        this.value=value;
        this.time=time;
    }

    getName() {
        /* Return the string name of the BABYLON action.

        */
        let name = this.constructor.name;
        return name;
    }

    getBabylonClass(){
        /* Return the BABYLON action type,
        By default this is the ExecureCodeAction */
        return BABYLON[this.getName()]
    }

    getTrigger(){
        /* Can return a BABYLON On[KeyTrigger] or a Garden Type.*/
        return new this.trigger;
    }

    getPropertyPath(){
        /* REturn a string property path for accessing your
        variable on action. Example: "diffuse" or dotted notation "position.x"
        */

       // TODO: Fix bad ref.
       return this.path;
    }

    getCondition(){
        return
    }

    action(target, trigger, path, condition){
        /* Combine and return the babylon content
        to a real action. Returned is a Babylon Action type instance */
        let aClass = this.getBabylonClass();
        let tClass = asBabylon(trigger || this.getTrigger());
        let pPath = path || this.getPropertyPath();
        let cond = condition || this.getCondition();

        return new aClass(tClass, target, pPath, cond)
    }
}


class SwitchBooleanAction extends Action {
    //BABYLON.SwitchBooleanAction: Used to switch the current value of a boolean property:

    //  SwitchBooleanAction(trigger, target, propertyPath, condition)
}


class SetValueAction extends Action {
    //BABYLON.SetValueAction: Used to specify a direct value for a property:

    //  SetValueAction(trigger, target, propertyPath, value, condition)
}


class IncrementValueAction extends Action {
    //BABYLON.IncrementValueAction: Add a specified value to a number property:

    //  IncrementValueAction(trigger, target, propertyPath, value, condition)
}


class PlayAnimationAction extends Action {
    //BABYLON.PlayAnimationAction: Launch an animation on a specified target:

    //  PlayAnimationAction(trigger, target, from, to, loop, condition)
}


class StopAnimationAction extends Action {
    //BABYLON.StopAnimationAction: Stop an animation on a specified target:

    //  StopAnimationAction(trigger, target, condition)
}


class DoNothingAction extends Action {
    //BABYLON.DoNothingAction: Do nothing :)

    //  DoNothingAction(trigger, condition)
}


class CombineAction extends Action {
    //BABYLON.CombineAction: This action is a container. You can use it to execute many actions simultaneously on the same trigger. The children property must be an array of actions:

    //  CombineAction(trigger, children, condition)
}


class ExecuteCodeAction extends Action {
    //BABYLON.ExecuteCodeAction: Execute your own code when the trigger is raised and the condition is true:

    //  ExecuteCodeAction(trigger, func, condition)
}


class SetParentAction extends Action {
    //BABYLON.SetParentAction: Used to define the parent of a node (camera, light, mesh):

    //  SetParentAction(trigger, target, parent, condition)
}


class InterpolateValueAction extends Action {
    //BABYLON.InterpolateValueAction: This action creates an animation to interpolate the current value of a property to a given target. The following types are supported:

    //  number
/*BABYLON.Color3


BABYLON.Vector3
BABYLON.Quaternion
InterpolateValueAction(trigger, target, propertyPath, value, duration, condition, stopOtherAnimations)
*/
}


class PlaySoundAction extends Action {
    // BABYLON.PlaySoundAction and BABYLON.StopSoundAction: The "sound" parameter is the reference of the sound you created using var sound = new BABYLON.Sound(...)
    // PlaySoundAction(trigger, sound, condition)
    // StopSoundAction(trigger, sound, condition)
    //
}


class StopSoundAction extends Action {

    // BABYLON.PlaySoundAction and BABYLON.StopSoundAction: The "sound" parameter is the reference of the sound you created using var sound = new BABYLON.Sound(...)
    // PlaySoundAction(trigger, sound, condition)
    // StopSoundAction(trigger, sound, condition)
}

Garden.register(
    SwitchBooleanAction
    , SetValueAction
    , IncrementValueAction
    , PlayAnimationAction
    , StopAnimationAction
    , DoNothingAction
    , CombineAction
    , ExecuteCodeAction
    , SetParentAction
    , InterpolateValueAction
    , PlaySoundAction
    , StopSoundAction
)
