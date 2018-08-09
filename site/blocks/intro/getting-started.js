class SimpleBasicScene extends Garden {
    start(){
        this.cam = new FreeCamera({
            activate: true
            , position: asVector(0, 5, -10)
            , target: asVector(0,0,0)
        })

        this.light = new HemisphericLight({
            position: asVector(0, 1, 0)
            , intensity: 1
        })

        this.sphere = new Sphere({
            segments: 16
            , diameter: 2
            , color: 'green'
            , position: asVector(0, 1, 0)
        })

        this.children.addMany(
            this.cam
            , this.light
            , this.sphere
        )
    }
}

// # Execute
var myApp = new SimpleBasicScene({ canvas: canvasNode })
myApp.run()
