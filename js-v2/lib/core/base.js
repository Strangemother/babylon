;(function(global){


var _instance = {
    classes: {}
}

var main = function(){
    /* Start ther integration og the instance with the
    global*/
    _instance = new Instance(_instance);
    BaseClass.instance = _instance;

    _instance.add(BaseClass)

    global.INSTANCE = _instance.proxy();
    global.IAPP = _instance.InstanceCreator;
}


class BaseClass {
    /* core function for everything to extend. */
    constructor(){
        return this.init.apply(this, arguments)
    }

    init() {

    }

    get instance(){
        return _instance;
    }
}


class LogMixin {
    /* Provide log functionality as a mixin */

    log() {
        /*print to a renderer*/
        let n = this.constructor.name;
        let fn = `%c ${n} `
        var v = [fn, 'background: #DDD; color: #333'];
        for (var i = 0; i < arguments.length; i++) {
            v.push(arguments[i])
        }

        console.log.apply(console, v)
    }
}

var mixHandler = function(...mixins){
    /* Add a handler to the mix function handlers - each mix ensures
    the class exists within the chain. */
    // console.log('Mixing', mixins)
    for (var i = 0; i < mixins.length; i++) {
        if(mixins[i] == undefined) {
            debugger
            console.warn('Mixin index', i, 'is undefined')
            return
        }
        var name = mixins[i].name

        if(_instance.classes[name] == undefined) {
            _instance.classes[name] = mixins[i]
        }
    }
}

mix.addHandler(mixHandler)

class Instance extends mix(BaseClass, LogMixin) {

    constructor(data){

        super()
        this.classes = {};

        if(data !== undefined) {
            for(var key in data) {
                this[key] = data[key]
            }
        }
    }

    get instance() {
        return _instance
    }

    add(key, data){
        /* add a key of data to the instance*/
        if(data=== undefined) {
            data = key;
            key = data.name;
        }

        // debugger
        // this.log('add', key)
        this.instance[key] = data;
        return this.instance[key] == data;
    }

    proxy(){

        var handler = {
            get: function(target, name){
                if(!(name in target)) {
                    return target.classes[name]
                }

                return target[name]
            }
        };

        var p = new Proxy(this, handler);
        return p;
    }
}

main()

})(window)
