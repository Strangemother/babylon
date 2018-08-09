/*

 */

class Register {

    add(items) {
        let _instance = Garden
        for(let item of arguments) {
            let n = 'objects'
            let s = item.name
            let name = s = s[0].toLowerCase() + s.slice(1)

            if(item.targetObjectAssignment) {
                let n = item.targetObjectAssignment(_instance)
                if(n != null) {
                    if(n === undefined) {
                        console.warn('targetObjectAssignment name was undefined for', item);
                    }

                    if(_instance[n] == undefined) { _instance[n] = {} }
                }
            }
            // log('Register', name)
            _instance[n][name] = this.functionalCaller(item)
        }
    }

    setConfig(gardenInstance, config) {
        /*
        A Garden instance is in init() state, currently being built with
        the given cofig object.
        Return an object to update the existing config, or undefined
        to perform no action.

        The given config is the _in-flight_ value through the iteration of sibiling
        plugins, therefore the config object may change depending upon the
        insert position within the register list of this plugin instance.

        Ensure only the _updated_ object values are returned, as they
        concantenate upon the in-flight config given to the nth iteration
        of the gardeInstance plugin register list.
         */
    }

    functionalCaller(_class) {
        /* given a class, return a functional caller. The user can use either class
        or function to create an object

        box = Garden.objects.box({ scene })

        box = new Box()
        box.addTo(scene)
        */
       let f = (function(obj){
            let _class = this._class;
            return function(){
                let c = new _class(obj)
                if(obj && obj.scene) {
                    c.addToScene(obj.scene)
                }
                return c
            }.bind(this)

       }).apply({ _class })

       return f
    }

    register(Garden) {
        // log('registered Register class')
        Garden.register = this.add.bind(this)
        Garden.objects = {}

    }

    mount(gardenInstance){
        log(this, 'mount', gardenInstance)
    }

}

Garden.plugin(Register)
