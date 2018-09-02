// http://doc.babylonjs.com/babylon101/lights


class CameraBase extends DisplayObject {
    adapterName(){
        let n = this.constructor.name;//.slice(0, -7)
        return n
    }

    gardenType(){
        /* Camera classes are packaged into Garden.cameras */
        return 'Camera'
    }

    hookProduceMesh(instance, libFunc, name, config, scene) {
        /* Override the generic mesh production to spply
        the position to the LIB config, not the entire object. */
        let mesh = new libFunc(name, config.position, scene)
        return mesh
    }

    keys(){
        return [
            'position'
        ]
    }

    props(){
        /* A Prop or property defines an attribute assigned through the construct
        or build, applied to this instance as an editable variable. */
        return [
            { key: 'distance', libKey: 'radius', default: 2.4}
            , { key: 'pitch', libKey: 'beta', default: 0.4 }
            , { key: 'rotation', libKey: 'alpha', default: 0}
            , { key: 'groundColor', forced: false }
        ]
    }
}

class TargetCamera extends CameraBase {

}

class Camera extends TargetCamera {

    adapterName(){
        return 'FreeCamera'
    }
}

class FollowCamera extends TargetCamera {

}

class ArcFollowCamera extends TargetCamera {

}



class DeviceOrientationCamera extends Camera {

}


class ArcCamera extends TargetCamera {
    adapterName(){
        return 'ArcRotateCamera'
    }
}

class AnaglyphArcCamera extends ArcCamera {
    adapterName(){
        return 'AnaglyphArcRotateCamera'
    }
}

class StereoArcCamera extends ArcCamera {
    adapterName(){
        return 'StereoscopicArcRotateCamera'
    }
}

class VRDeviceOrientationArcCamera extends ArcCamera {
    adapterName(){
        return 'VRDeviceOrientationArcRotateCamera'
    }
}

class TouchCamera extends Camera {

}

class UniversalCamera extends TouchCamera {

}


class VirtualJoysticksCamera extends Camera {

}

class AnaglyphCamera extends Camera {
    adapterName(){
        return 'AnaglyphFreeCamera'
    }
}

class StereoCamera extends Camera {
    adapterName(){
        return 'StereoscopicFreeCamera'
    }
}

class WebVRCamera extends Camera {
    adapterName(){
        return 'WebVRFreeCamera'
    }
}


