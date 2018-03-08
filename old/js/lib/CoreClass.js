class CoreClass {
    /*
     Every component should load from this class for all basic usage.
     */

    constructor(data, late=false) {
        this.data = data;
        this._config = {}
        if(late !== true) {
            this.init.apply(this, arguments);
        }
    }

    init(){
        // this.log('CoreClass init')
    }

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

    defaults(){
        /* return an object for ket definitions of the config*/
        return this._config
    }

    get config(){
        /* return the config object*/
        return this._config
    }

    set config(v){
        this._config = v
        return true;
    }

    get interface(){
        /* returns an instance of the game interface */
        return GameInterface._instance
    }
}
