;(function(){

let I = INSTANCE;

I._.mutators = class Mutator {

    name(){
        return 'Mutator'
    }

    preConfig(config, name, scene, instance){
        /* Alter the configuration before the babylon instance is
        created.
        this function will call mutate */
        var _config = config;

        if(config[this.name()] !== undefined) {
            _config = this.mutate(config, scene)
        }

        return _config;
    }

    postConfig(config, item, scene, instance) {
        /* Called after the bablyon item is created performing
        any tasks after creation.
        This function will call itemApply. */
        return this.itemApply(config, item, scene, instance)
    }

    activeProperty(item, key, setter, getter, config, instance){
        /* Create an attribute setting and getting a property from another
        object.
        When the value is appled to the parent object of this mutator, the
        change should perpetuate to the babyylon item instance.

        The item, intending to be the Bablyon instance will receive `key`.
        Optionally provide a setter and getter function., If the getter is undefined,
        the setter is used as both get and set of the attribute.*/

        // (item, key)
        // (item, key, config)
        // (item, key, setter, config)
        // (item, key, setter, getter, config, instance)
        let al = arguments.length;

        if(al==3) {
            config = setter;
            setter = undefined;
        } else if(al==4) {
            config = getter;
            getter = undefined
        }

        var conf = config // arguments[arguments.length-1]
        if(conf) {
            var v = conf[key];

            // Call if basic function
            if( IT.g(conf[key]).is('function') ) {
                v = conf[key](scene, conf);
            }

            item[key] = v;
        };

        var _setter = function(v){
            item[key] = v
        }

        var _getter = function(){
            return item[key]
        }

        // Apply a throughput getter setter
        var v = {
            get: function() {
                console.log('get', key, item.id);
                return (getter || setter || _getter)(undefined, this)
                // return this._props[key];

            }

            , set: function(newValue) {
                console.log('set', key, item.id);
                //this._props[key] = newValue
                (setter || _setter)(newValue, this);
            }
        }

        debugger;
        // Apply the thoughput on `this` the mutator (its parent)
        return Object.defineProperty(instance || this, key, v);
    }

    mutate(config, scene) {
        /* Alter the configuration object before it's applied to the
        babylon instance.
        return a mutated config object. */
        return config;
    }

    itemApply(config, item, scene, instance) {
        /* Alter the babylon `item` after the config has applied to the
        `item` instance and `mutate()` was called.
        Perform any post changes to your babylon `item`
        config: the config object given through the instance
        item:   bablyon item applied to the scene
        scene:  babylon scene for the object
        instance:  the library class instance managing the `item` */
    }
}


I._.mutators = class ActiveMutator extends I.Mutator {

    itemApply(config, item, scene, instance){
        /* Apply any mutations to the babylon item created */
        debugger
        this.itemApplyInit(config, item, scene, instance)
        // item, key, setter, getter, config, instance
        this.activeProperty(item, n, function(v, p){
            return self.setterGetter(v, item, p, this)
        }, undefined, config, instance)
    }

    itemApplyInit(config, item, scene, instance) {
        /* Called by `itemApply` to perform any changes to the babylon
        instance before the active property is applied to the `item`*/
        var n = this.name();
        item[n] = config[n];
    }

    setterGetter(value, item, parent, scope){
        /* Getter setter function performing the read write action
        on the `item` when calles*/
        if(v == undefined){ return item[this.name()] };
        item[this.name()] = value;
    }
}

I._.mutators.material = class MaterialMutator extends I.Mutator {
    /* A MaterialMutator provides the provides the `material` key to
    Babylon instance*/
    name(){
        /* Return a name of the instance used as a key
        for the read write of the babylon and config object.*/
        return 'material'
    }

    mutate(config, scene) {
        /* Edit config options before the babylon call */
        let n = this.name()
        var v = config[n];

        if(IT.g(v).is('function')) {
            v = config[n](scene, config);
        };

        config[n] = v;
        return config;
    }

    itemApply(config, item, scene, instance){
        debugger;
        /* Apply any mutations to the babylon item created */
        item[this.name()] = config[this.name()]

    }
}


I._.mutators.scaling = class ScaleMutator extends I.ActiveMutator {

    name(){
        return this.constructor.__decentChain__[0]
    }

    scaleKey(config, item, scene, instance){
        return this._scaleKey || 'x'
    }

    itemApplyInit(config, item, scene, instance) {
        item.scaling[this.scaleKey(config, item, scene, instance)] = config[this.name()];
    }

    setterGetter(value, item, parent, scope){
        if(v == undefined){ return item.scaling[this.scaleKey(config, item, scene, instance)]};
        item.scaling[this.scaleKey(config, item, scene, instance)]= value;
    }
}


I._.mutators.width = class WidthMutator extends I.ScaleMutator {

    scaleKey(){
        return 'x'
    }
}

I._.mutators.height = function HeightMutator() {
    var v = new I.ScaleMutator()
    v._scaleKey = 'y';
    return v;
}

})()
