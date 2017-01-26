
class CoreClass {
    /*
     Every component should load from this class for all basic usage.
     */

    constructor(data) {
        this.data = data;
        this.init.apply(this, arguments)
    }

    init(){

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
}
