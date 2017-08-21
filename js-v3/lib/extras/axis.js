class Axis extends Lines {

    babylonFuncName(...args) {
        /* Return the name of the function to execute on
        BABYLON[babylonFuncName] */

        return 'CreateLines'
    }

    keys(){
        k = super.keys()
        k.push('size')
        return k
    }

    sizeKey(){
        return 1
    }

    pointsKey(){
        let size = this._options.size
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


class Axis3D extends Sphere {
    babylonFuncName(){
        return 'CreateSphere'
    }

    //executeBabylon(babylonFunc, name, args) {
    babylonExecuted(mesh) {
        let diameter = .06;
        let x = new Cylinder({
            height: 1,
            diameter: diameter,
            color: 'red',
            rotation: [0, 0, 1.5707963267948966],
            position: [.5, 0, 0]
        })

        let z = new Cylinder({
            height: 1,
            diameter: diameter,
            color: 'blue',
            rotation: [1.5707963267948966, 0, 0],
            position: [0, 0, .5]
        })

        let y = new Cylinder({
            height: 1,
            diameter: diameter,
            color: 'green',
            position: [0, .5, 0]
        })


        this.x = x;
        this.z = z;
        this.y = y;

        // this.children.addMany(x, z, y)
        //

        /* This is a little ugly and should be removed.*/
        setTimeout(function(){
            let _c = this.color() || this.color('white');
            this.material().alpha = .2

            mesh.visibility = 1;

            /* Apply the axis columns to the upper render group of
            this item.*/
            let elements = [x,y,z]
            for (var i = 0; i < elements.length; i++) {
                let _m = elements[i].addTo(this);
                _m.renderingGroupId = 3;
            };
        }.bind(this))

        mesh.renderingGroupId = 2
        mesh.visibility = 0
        return mesh

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


class ColorAxisArrow extends Box {
    babylonFuncName() {
        return 'CreateBox'
    }

    pointsKey(){
        return []
    }

    keys(){
        k = super.keys()
        k.push('size')
        return k
    }

    sizeKey(){
        return 10
    }

    label(text, position, color='white',  size=2, font="bold 36px Arial"){
        let material = materials.standard();
        let scene = app.scene()
        var texture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        texture.hasAlpha = true;
        texture.drawText(text, 5, 40, font, color , "transparent", true);

        material.backFaceCulling = false;
        material.specularColor = colors.white()
        material.diffuseTexture = texture;

        let p = new Plane({
            size
            , material
            , position
        })

        return p;
    }

    babylonExecuted(mesh) {
        let size = this._options.size
        if(size == undefined) {
            size = this.sizeKey()
        };

        let x = new Lines({
            color: 'red'
            , points: [
              new BABYLON.Vector3.Zero(),
              new BABYLON.Vector3(size, 0, 0),
              new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
              new BABYLON.Vector3(size, 0, 0),
              new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
            ]
        })

        let y = new Lines({
            color: 'green'
            , points: [
                new BABYLON.Vector3.Zero(),
                new BABYLON.Vector3(0, size, 0),
                new BABYLON.Vector3( -0.05 * size, size * 0.95, 0),
                new BABYLON.Vector3(0, size, 0),
                new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
            ]
        })

        let z = new Lines({
            color: 'blue'
            , points: [
                new BABYLON.Vector3.Zero(),
                new BABYLON.Vector3(0, 0, size),
                new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
                new BABYLON.Vector3(0, 0, size),
                new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
            ]
        })

        let labels = [
            [
                'x',
                [0.9 * size, -0.05 * size, 0],
                "red",
            ],
            [   'y',
                [0, 0.9 * size, -0.05 * size],
                "green",
            ],
            [
                'z',
                [0, 0.05 * size, 0.9 * size],
                "blue",
            ]
        ]

        let labelPlanes = []
        for (var i = 0; i < labels.length; i++) {
            let [text, position, color] = labels[i]
            let label = this.label(text, asVector(position), color, size / 5)
            labelPlanes.push(label);
        }

        setTimeout(function(){
            let elements = [x,y,z].concat(labelPlanes)
            for (var i = 0; i < elements.length; i++) {
                let _m = elements[i].addTo(this);
                _m.renderingGroupId = 3;
            };
            mesh.visibility = 0
        }.bind(this))


        return super.babylonExecuted(mesh)
    }
}
