class Axis extends Lines {

    babylonFuncName(...args) {
        /* Return the name of the function to execute on
        BABYLON[babylonFuncName] */

        return 'CreateLines'
    }

    pointsKey(){
        let size = 1
        let tipSize = size * .10
        return [

            new BABYLON.Vector3(0, 0, 0)
            , new BABYLON.Vector3(size, 0, 0)

            , new BABYLON.Vector3(size, 0, 0)
            , new BABYLON.Vector3(size - tipSize,0, -tipSize)
            , new BABYLON.Vector3(size, 0, 0)

            , new BABYLON.Vector3(size, 0, 0)
            , new BABYLON.Vector3(size - tipSize,0, tipSize)
            , new BABYLON.Vector3(size, 0, 0)

            , new BABYLON.Vector3(0, 0, 0)
            , new BABYLON.Vector3(0, size, 0)

            , new BABYLON.Vector3(0, size, 0)
            , new BABYLON.Vector3(0, size - tipSize, -tipSize)
            , new BABYLON.Vector3(0, size, 0)

            , new BABYLON.Vector3(0, size, 0)
            , new BABYLON.Vector3(0, size - tipSize, tipSize)
            , new BABYLON.Vector3(0, size, 0)

            , new BABYLON.Vector3(0, 0, 0)
            , new BABYLON.Vector3(0, 0, size)

            , new BABYLON.Vector3(tipSize, 0, size - tipSize)
            , new BABYLON.Vector3(0, 0, size)
            , new BABYLON.Vector3(-tipSize, 0, size - tipSize)

        ]
    }

    babylonExecuted(mesh) {
        mesh.renderingGroupId = 2
        return super.babylonExecuted.apply(this, arguments)
    }
}


class Axis2 extends BabylonObject {


    executeBabylon(babylonFunc, name, ...args) {

        return new babylonFunc[name](...args);
    }
}

class AxisArrow extends Lines {

    babylonFuncName(...args) {
        return 'CreateLines'
    }

    pointsKey(){
        let size = 10
        let tipSize = .5
        return [
            new BABYLON.Vector3(0, 0, 0)
            , new BABYLON.Vector3(0, size, 0)

            , new BABYLON.Vector3(0, size, 0)
            , new BABYLON.Vector3(0, size - tipSize, -tipSize)
            , new BABYLON.Vector3(0, size, 0)

            , new BABYLON.Vector3(0, size, 0)
            , new BABYLON.Vector3(0, size - tipSize, tipSize)
            , new BABYLON.Vector3(0, size, 0)

        ]
    }

}
