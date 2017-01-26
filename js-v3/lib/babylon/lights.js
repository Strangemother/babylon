class Light extends BabylonObject {

    static targetObjectAssignment(){
        /* Camera classes are packaged into Garden.cameras */
        return 'lights'
    }

    propKeys(){
        return [
            'diffuse'
            , 'specular'
        ]
    }

    diffuseProp(){
        return new BABYLON.Color3(.7,.7,.7);
    }

    specularProp(){
        return new BABYLON.Color3(1, 1, 1);
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

    positionKey(){
        return asVector(1, 2, 1.5)
    }
}

class DirectionalLight extends Light {
    // var light0 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(0, -1, 0), scene);
    // light0.diffuse = new BABYLON.Color3(1, 0, 0);
    // light0.specular = new BABYLON.Color3(1, 1, 1);
    keys() {
        return [
            'position'
        ]
    }
}

class SpotLight extends Light {
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

    intensityProp(){
        return .9
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

    directionKey(){
        return new BABYLON.Vector3(0,1,0)
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






