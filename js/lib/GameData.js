class GameData extends CoreClass {
    /* Data getter setter*/
    init(){
        this.data = {}
    }

    get(name, cb) {

        if(cb) {
            cb(this.data[name])
        }
        return this.data[name]
    }

    set(name, data, cb) {

        if(cb) {
            cb(this.data, name)
        }

        this.data[name] = data
    }

    load(name, level) {
        var dn = this.dataName(name, level);
        var d = this.get(dn)
        return d;
    }

    dataName(name, level) {
        var dn = name;
        if(level !== undefined) {
            // var gn = level.gameInterface.data.name
            var n = level.name
                ;
            dn = `${n}_${name}`;
        };

        return dn
    }

    static register(name, level, data) {
        console.log('register', name)
        if(arguments.length == 2) {
            data = level;
            level = undefined;
        }

        _transientGameData.set( _transientGameData.dataName(name, level), data)
    }

    static load(name, level){
        /* load data by name from the endpoint. Optionally provide the
        level for data scoping.
        If the data is not defined a fallback is returned. */
        var d;
        d = _transientGameData.load(name, level)

        return d;
    }
}

var _transientGameData = new GameData()
