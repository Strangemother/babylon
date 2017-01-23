class AnimateBoxes extends Garden {
    start(){
        this.baseScene()
        this.animate1()
        this.animate2()
        this.animate3()
        this.animate4()
        this.animate5()
    }

    baseScene(){
        this.skyBox = new SkyBox({assetName: 'mountains'});
        this.skyBoxMesh = this.skyBox.addToScene();

        this.camera = new app.cameras.ArcRotateCamera(true)
    }


    animate1(){

        // Make a box and add it to the scene
        this.box = new Box({ color: 'red' })
        let mesh = this.mesh = this.box.addToScene()

        // Make a new animation
        let anim = new Animation({ targetProperty: 'scaling.x' })
        let babylonAnim = anim.create()

        // Apply animation keys to the BABYLON animation
        let keys = [{ frame: 0, value: 1}, { frame: 50, value: .2}, {frame: 100, value: 1}]
        babylonAnim.setKeys(keys);

        // Add the animation keys to the BABYLON mesh
        mesh.animations.push(babylonAnim);

        this.bAnim = babylonAnim;
        this.animScaleX = anim;

        // Start the animation in the mesh on the scene.
        this.a1Anim = app.scene().beginAnimation(mesh, 0, 100, true)
    }

    animate2() {

        // Make a box and add it to the scene
        let box = this.box2 = new Box({ color: 'green', position: [1, 0, 0]})
        box.addToScene()

        // Make a new animation and add frames
        let anim = new Animation({ targetProperty: 'scaling.y' })
        anim.frame(0, 1).frame(50, .2).frame(100, 1)

        // Add the animation to the box and start on the box scene
        this.a2Anim = box.animate(anim)

        this.animScaleY = anim;
    }

    animate3(){
        // Make a box and add it to the scene
        let box = this.box3 = new Box({ color: 'dodgerBlue', position: [2, 0, 0]})
        box.addToScene()

        // Make a new animation and add frames
        let anim = new Animation({ targetProperty: 'scaling.z' })
        anim.frames([0, 1], [50, .2], [100, 1])

        this.animScaleZ = anim

        // Add the animation to the box and start on the box scene
        box.animate(anim)

        // Add a shared animation to the scene
        this.a4Anim = box.animate(this.animScaleY)
    }

    animate4(){
        /* Using all the previously made animations, stack all to the box.
        The ScaleX animation keys were not applied to the Garden instance -
        therefore we can create new ones */

        // Make a box and add it to the scene
        let box = this.box4 = new Box({ color: 'gold', position: [3, 0, 0]})
        box.addToScene()

        // Add frames to the previously created animation
        this.animScaleX.frames([0, 1], [30, .8], [50, .6] , [80, .3], [100, 1])
        this.animScaleZ.frames([0, 1], [23, .8], [70, .4] , [100, 1])

        // Add many animations to the box and start each
        box.animate(this.animScaleX)
        box.animate(this.animScaleY)
        box.animate(this.animScaleZ)
    }

    animate5(){

        // Make a box and add it to the scene
        let box = this.box5 = new Box({ color: 'saddleBrown', position: [-1, 0, 0]})
        box.addToScene()

        // Make a new animation and add frames
        let anim = this.animRotX = new Animation({
            targetProperty: 'rotation.x'
            , setKeys: [ [0, 0] , [600, Math.radians(359)]]
        })

        // Add the animation to the box and start on the box scene
        this.a5Anim = box.animate(anim);
    }
}

Garden.register(AnimateBoxes)
