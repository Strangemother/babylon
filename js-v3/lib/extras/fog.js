class Fog extends BabylonObject {
    keys(){
        return [
            'mode'
            , 'color'
            , 'density'
            , 'start'
            , 'end'
        ]
    }

    modeKey(){
        return Fog.EXP2
    }

    colorKey(){
        return new BABYLON.Color3(0.9, 0.9, 0.85);
    }

    densityKey(){
        return 0.02
    }

    startKey(){
        return 20.0
    }

    endKey(){
        return 60;
    }

    off(scene){
        scene = scene || this._app.scene()
        if(this._on) {
            this._fogMode = scene.fogMode
            this._density = scene.fogDensity
            this._start = scene.fogStart
            this._end   = scene.fogEnd
        };

        scene.fogMode = Fog.NONE

        return this;
    }

    on(options, scene) {
        scene = scene || this._app.scene()
        options = options || {
            mode: this._fogMode || this.modeKey()
            , density: this._density || this.densityKey()
            , start: this._start || this.startKey()
            , end: this._end || this.endKey()
        }

        let mode = options.mode
        let fdf = function(o, s){
                s.fogDensity = o.density;
            };
        let map = {
            [Fog.NONE]: function(){ return this.off() }.bind(this)
            , [Fog.EXP]: fdf
            , [Fog.EXP2]: fdf
            , [Fog.LINEAR]: function(o, s){
                s.fogStart = o.fogStart
                s.fogEnd = o.fogEnd
            }
        };

        map[mode](options, scene)

        scene.fogMode = mode

        return this;
    }


    babylonArrayArgs() {
        return false
    }

    executeBabylon(BABYLON, className, name, options, scene, ...args) {
        return this.on(options, scene)
    }
}

Fog.NONE = BABYLON.Scene.FOGMODE_NONE
Fog.EXP = BABYLON.Scene.FOGMODE_EXP
Fog.EXP2 = BABYLON.Scene.FOGMODE_EXP2
Fog.LINEAR = BABYLON.Scene.FOGMODE_LINEAR
