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

        this.hemiLight = new HemisphericLight({
            intensity: 1
        })
        this.hemiLight.addToScene()

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


class AnimatedInSpotlight extends Garden {

    start(){
        this.backgroundColor = colors.black()
        this._camera = new ArcRotateCamera({
            activate:true
            , radius: 20
        });

        this.hemiLight = new HemisphericLight({
            intensity: .7
        })

        this.spotLight = new SpotLight({
            position: asVector(0, 10, 0)
            , direction: asVector(0, -1, 0)
            , diffuse: 'white'
            , angle: 1
            , exponent: 5
            , intensity: .4
        })


        this.ground = new Ground({
            color: 'white'
            , width: 20
            , height: 20
            , position: [0, 0, 0]
        })

        this.box = new Box({
            position: [0, 3, 0]
            , color: 'darkCyan'
        });

        this.box2 = new Box({
            position: [0, 3, 3]
            , color: 'sandyBrown'
        });

        this.cone = new Polyhedron({
            type: 11
            , position: [0, 3, -3]
            , rotation: [.7, 0, 0]
            , color: 'gold'
        })

        this.spotLight.shadows(
            this.box
            , this.box2
            , this.cone
            ).receiver(this.ground)

        this.children.addMany(
            this.spotLight
            , this.hemiLight
            , this.ground
            , this.box
            , this.cone
            , this.box2
            )

        let anim = new Animation({ targetProperty: 'rotation.y' })
        anim.frame(0, 0).frame(600, Math.PI*2)

        let animX = new Animation({ targetProperty: 'rotation.x' })
        animX.frame(0, 0).frame(200, -Math.PI*2)

        let anim3 = new Animation({ targetProperty: 'scaling.z' })
        anim3.frame(0, 1).frame(150, 2).frame(350, 1.2).frame(400, .5).frame(600, 1)

        let anim4 = new Animation({ targetProperty: 'rotation.y' })
        anim4.frame(0, 0).frame(400, -Math.PI*2)

        this.box.animate(anim)
        this.box.animate(animX)
        this.box.animate(anim3)
        this.cone.animate(anim4)

    }
}


Garden.register(AnimateBoxes, AnimatedInSpotlight)
