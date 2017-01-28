class Light extends BabylonObject {

    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.cameras */
        return 'lights'
    }



    init(config){
        this._earlyShadow = []
        this._earlyReceiver = []
        this.shadowGenerators = []
        super.init(config)
    }

    propKeys(){
        return [
            'diffuse'
            , 'specular'
            , 'intensity'
            , 'darkness'
        ]
    }

    darknessPropSetter(babylon, key, value, name, ...args){
        if(value != undefined){
            babylon.setDarkness(value)
        }
    }

    diffuseProp(ov){
        return ov == undefined ? new BABYLON.Color3(.7,.7,.7): colors.get(ov);
    }

    specularProp(ov){
        return colors.get(ov || 'white');
    }

    intensityProp(ov){
        return ov == undefined ? 1: ov
    }

    shadow(item, light) {
        let sg = this.getShadowGenerator(light);
        let m = item;

        if(sg == undefined) {
            if(this._earlyShadow.indexOf(item) == -1) {
                this._earlyShadow.push(item);
                return this;
            }
        }

        if(item) {

            if(item.gardenType) {
                m = item._babylon
            };

            if(m == undefined && item !== undefined) {
                if(this._earlyShadow.indexOf(item) == -1) {
                    this._earlyShadow.push(item)
                };

                this._app.children.onAdd(item.id, this._observeAddShadow.bind(this), true)
                console.log('_earlyShadow: no item', item)
                return this
            };

            this.getShadowList(light).push(m);
        }


        return this;
    }

    getShadowList(light){
        let g = this.getShadowGenerator(light)
        return g.getShadowMap().renderList
    }

    getShadowGenerator(light, index=-1) {
        let sg;
        let _b = light;
        if(this.shadowGenerators.length == 0){

            _b = (_b != undefined && _b.gardenType != undefined) ? _b._babylon: _b;
            if(_b == undefined) {
                return
            };

            sg = new BABYLON.ShadowGenerator(1024, _b)
            this.shadowGenerators.push(sg);
        }

        sg = this.shadowGenerators[index == -1? (this.shadowGenerators.length-1): index]
        return sg;
    }

    _observeAddShadow(item, mesh, options, scene, engine, canvas) {
        console.log('Adding', item)
        this.getShadowList().push(mesh);
    }

    _observeAddReceiver(item, mesh, options, scene, engine, canvas) {
        console.log('Receiver', item)
        mesh.receiveShadows = true
    }


    babylonExecuted(light) {
        console.log('light execute')
        for (var i = 0; i < this._earlyShadow.length; i++) {
            this.shadow(this._earlyShadow[i], light)
        }

        for (var i = 0; i < this._earlyReceiver.length; i++) {
            this.receiver(this._earlyReceiver[i])
        }

        return light;
    }

    receiver(item) {
        let m = item;
        if(item.gardenType) {
            m = item._babylon
        };

        if(m == undefined) {
            console.log('_earlyReceiver', item)
            if(this._earlyReceiver.indexOf(item) == -1) {
                this._earlyReceiver.push(item)
            } else {
                console.log('Another early.')
                this._app.children.onAdd(item.id, this._observeAddReceiver.bind(this), true)
            }

            return this
        }

        m.receiveShadows = true;
        return this
    }

}

class PointLight extends Light {
    // var light0 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(1, 10, 1), scene);
    // light0.diffuse = new BABYLON.Color3(1, 0, 0);
    // light0.specular = new BABYLON.Color3(1, 1, 1);
    keys() {
        return [
            'position'
        ]
    }

    positionKey(ov){
        return asVector(ov || [1, 2, 1.5])
    }
}

class DirectionalLight extends PointLight {
    // var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), scene);
    // light0.diffuse = new BABYLON.Color3(1, 0, 0);
    // light0.specular = new BABYLON.Color3(1, 1, 1);
    keys() {
        return [
            'position'
        ]
    }
}

class SpotLight extends DirectionalLight {
    // A spot light is defined by
    // a position (2nd arg),
    // a direction (3rd arg),
    // an angle (4th arg),
    // and an exponent (5th arg).
    // These values define a cone of light starting from the position, emitting toward the direction.
    //
    // var light0 = new BABYLON.SpotLight("Spot0", new BABYLON.Vector3(0, 30, -10), new BABYLON.Vector3(0, -1, 0), 0.8, 2, scene);
    // light0.diffuse = new BABYLON.Color3(1, 0, 0);
    // light0.specular = new BABYLON.Color3(1, 1, 1);
     keys() {
        return [
            'position'
            , 'direction'
            , 'angle'
            , 'exponent'
        ]
    }

    propKeys(){
        let keys = super.propKeys();
        keys.push('intensity')
        return keys;
    }
}

class HemisphericLight extends Light {
    // A hemispheric light is defined by
    // a direction to the sky (the 2nd arg in the constructor)
    // and by 3 colors: one for the diffuse (the sky color - for pixels/faces facing upward),
    // one for the ground (the color for pixels/faces facing downward),
    // and one for the specular.
    //
    // var light0 = new BABYLON.HemisphericLight("Hemi0", new BABYLON.Vector3(0, 1, 0), scene);
    // light0.diffuse = new BABYLON.Color3(1, 1, 1);
    // light0.specular = new BABYLON.Color3(1, 1, 1);
    // light0.groundColor = new BABYLON.Color3(0, 0, 0);
    keys() {
        return [
            'direction'
        ]
    }

    propKeys(){
        let keys = super.propKeys();
        keys.push('groundColor')
        return keys;
    }

    directionKey(ov, obj, scene){
        return ov || new BABYLON.Vector3(0,1,0)
    }

    groundColorProp(){
        return new BABYLON.Color3(0, 0, 0);
    }
}


Garden.register(
    Light
    , PointLight
    , DirectionalLight
    , SpotLight
    , HemisphericLight
)






