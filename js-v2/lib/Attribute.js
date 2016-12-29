// Assign actiuve attributes to an object though reference of
// keys on the item

;(function(){
    var I = INSTANCE;

I._ = class Attributes {

    __overload__(classTarget) {
        // called when a method is applied
        // overloading the abstract name of the class
        // on the main instance
        debugger
        return ['mutators', this.accepter]
    }

    accepter(oTarget) {
        /* accept an object to the overload  instance location */
        debugger;
    }
}


I._.attribute = class DecendantAttribute {

    _decent(){
        return item.scaling
    }
}


I._ = class ScaleAttribute extends I.DecendantAttribute {

    __init__(){
        this._scaleKey = undefined;
    }

    name(){
        return this.constructor.__decentChain__[0]
    }

    initAttr(config, item, scene, instance) {
        /* apply the config value to the decent chain item*/
        this._decent(item, scene)[this.scaleKey(config, item, scene, instance)] = config[this.name()];
    }

    setAttr(value, item, parent, scope){
        /* set value applied to the assigned attribute.*/
        this._decent(item, scene)[this.scaleKey(config, item, scene, instance)] = value;
    }

    getAttr(item, parent, scope){
        /* get value. Return object */
        return this._decent(item, scene)[this.scaleKey(config, item, scene, instance)]
    }

    scaleKey(config, item, scene, instance){
        return this._scaleKey || 'x'
    }
}


//
I._ = class Width extends I.ScaleAttribute {

    name() {
        return 'width'
    }

    scaleKey(config, item, scene, instance){
        return 'x'
    }
}


I._ = class Height extends I.ScaleAttribute {

    name() {
        return 'height'
    }

    scaleKey(config, item, scene, instance){
        return 'y'
    }
}


I._ = class Depth extends I.ScaleAttribute {

    name() {
        return 'depth'
    }

    scaleKey(config, item, scene, instance){
        return 'z'
    }
}


I._ = class PositionX extends I.ScaleAttribute {

    _decent(){
        return item.position
    }

    name() {
        return 'x'
    }

    scaleKey(config, item, scene, instance){
        return 'x'
    }
}


I._ = class PositionY extends I.PositionX {

    name() {
        return 'y'
    }

    scaleKey(config, item, scene, instance){
        return 'y'
    }
}


I._ = class PositionZ extends I.PositionX {

    name() {
        return 'z'
    }

    scaleKey(config, item, scene, instance){
        return 'z'
    }
}

})()
