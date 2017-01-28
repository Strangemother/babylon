class ShadowMap extends BabylonObject {
    keys(){
        return [
            'resolution'
            , 'receivers'

        ]
    }

    modeKey(v, opts, s){
        return v || Fog.EXP2
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
            , color: this._color || this.colorKey()
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
                s.fogStart = o.start
                s.fogEnd = o.end
            }
        };

        map[mode](options, scene)

        scene.fogMode = mode
        if(options.color) {
            scene.fogColor = colors.get(options.color)
        }
        return this;
    }


    babylonArrayArgs() {
        return false
    }

    executeBabylon(BABYLON, className, name, options, scene, ...args) {
        return this.on(options, scene)
    }
}


class LensEffect extends BabylonObject {
    keys(){
        return [
            //: number: from 0 to x (1 for realism)
            "chromatic_aberration"
            //: number: from 0 to x (1 for realism)
            , "edge_blur"
            //: number: from 0 to x (1 for realism)
            , "distortion"
            //: number: from 0 to 1
            , "grain_amount"
            //: BABYLON.Texture: texture to use for grain effect; if unset, use random B&W noise
            , "grain_texture"
            //: number: depth-of-field: focus distance; unset to disable (disabled by default)
            , "dof_focus_distance"
            //: number: depth-of-field: focus blur bias (default: 1)
            , "dof_aperture"
            //: number: depth-of-field: darken that which is out of focus (from 0 to 1, disabled by default)
            , "dof_darken"
            //: boolean: depth-of-field: makes a pentagon-like "bokeh" effect
            , "dof_pentagon"
            //: number: depth-of-field: highlights gain; unset to disable (disabled by default)
            , "dof_gain"
            //: number: depth-of-field: highlights threshold (default: 1)
            , "dof_threshold"
            //: boolean: add a little bit of noise to the blur (default: true)
            , "blur_noise"
        ]
    }
}
