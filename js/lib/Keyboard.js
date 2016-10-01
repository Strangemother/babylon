/* Simple capture of keys */

// Named keys
KEYS = {
    UP:      38
    , DOWN:  40
    , LEFT:  37
    , RIGHT: 39
}

class Keyboard {

    constructor(){
        this._listen()
        var self = this;
        this.key = new Proxy({}, {
            get(target, name, receiver){
                return self._keyProxyGet(name, receiver)
            }

            , set(target, property, value, receiver)  {
                return self._keyProxySet(property, value, receiver)
            }
        })
    }

    _listen(){
        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    _keyProxyGet(name, receiver){
        console.log('get', name);
        return this[name]
    }

    _keyProxySet(property, value, receiver){
        this[property] = value;
        return true;
    }

    onKeyDown(e){
        console.log('key', e.keyCode)
    }

    onKeyUp(e){
        console.log('key', e.keyCode)
    }
}

k = new Keyboard()
