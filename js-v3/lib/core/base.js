class Destroyable extends BabylonInterface {
    init(...args) {
        super.init(...args)
        console.log('Destroyable')
        this._setInitKeys()
    }

    _setInitKeys() {
        this._initKeys = Object.keys(this)
        this._initKeys = this._initKeys.concat(['_initKeys', '_canvas', '_engine'])
    }

    destroy(){

        let _destroyed = this._destroyFlagged()
        console.log('BASE destroy')
        if(this.displayListManager) {
            this.displayListManager.destroy();
        }

        if(this.children){
            delete this.children
            delete this.displayListManager
        }

        let scene = this.scene()
        if(scene != undefined) {
            if(scene.meshes) {
                for (var i = scene.meshes.length - 1; i >= 0; i--) {
                    scene.meshes[i].dispose()
                }
            }
        }

        for(let c of scene.cameras) {
            c.dispose()
        }
        scene.cameras = []
        this._destroyed = true

        return _destroyed;

    }

    destroyable(){
        /* Get all items added to the scene */
        let keys = Object.keys(this).reverse();
        let r = []
        let preKeys = this._initKeys
        let _in = function(k){
            return preKeys.indexOf(k) != -1
        };

        for(let key of keys) {
            if(!_in(key)) {
                console.log('destroy', key)
                r.push(key)
            }
        }

        return r;
    }

    _destroyFlagged() {
        let ref, names;
        let _d = this.destroyable()
        for(let name of _d) {
            if(this[name] != undefined) {
                this._destroyItem(this[name], name, this)
            } else if(IT.g(name).is('object')) {
                this._destroyItem(this[name], name, this)
            }
        };

        return _d;
    }

    _destroyItem(_d, name, scope){
        if(!_d) {
            console.log('Item to destroy was undefined:', name)
        }
        if(_d.destroy != undefined) {
            _d.destroy();
            if(scope[name]) {
                delete scope[name]
            }
        } else {
            if(_d.dispose) {
                console.log('BABYLON', _d)
                // _d.dispose()
            } else {
                console.log('Could not destroy:', name)
            }
        }

        if(IT.g(_d).is('array')) {
            let [parent, name] = _d;
            if(parent[name] != undefined) {
                if(parent[name].destroy != undefined) {
                    parent[name].destroy();
                }
            }
        }
    }

    destroyItem(name, scope) {
        /* Destroy an item by name on the app*/
        scope = scope || this;
        return this._destroyItem(scope[name], name, scope)
    }
}


class Base extends Destroyable {

    init(config){
        console.log('BASE init')
        super.init(config)
        this._setupDisplayManager()
        this._inheritInstanceKeys(_instance)
        this._renderers.push(this.startCaller.bind(this))
        this._setInitKeys()

    }

    _inheritInstanceKeys(_i) {
        _i = _i || _instance
        let ignore=['_ran']
        if(_i != undefined) {
            let keys = Object.keys(_i);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if(ignore.indexOf(key) == -1) {
                    this[key] = _i[key]
                }
            }
            this._inheritedKeys = keys;
        };

        _instance = this;
    }

    _setupDisplayManager(){
        console.info('Setup displayListManager')
        this.displayListManager = new DisplayListManager(this)
        this.children = this.displayListManager.childList() // new ChildList(this)
        this._childID = this.constructor.name
    }

    get babylonSet(){
        /* Return the triplet of babylon tools
        Scene, engine, canvas */
        return [this.scene(), this._engine, this._canvas]
    }

    startCaller(scene, index) {
        /* Call the `start` function and remove the function from the _render
        list. */
        let r = this.start(scene, index);
        this._renderers.splice(index, 1)
        return r;
    }

    start(scene, index) {
        /* Perform any first render operations*/
        log('Start run once.')
    }

    get backgroundColor(){
        /* return the clearColor from the main scene */
        return this.scene().clearColor
    }

    set backgroundColor(v){
        /* return the clearColor from the main scene */
        this.scene().clearColor = v;
        return true;
    }
}

