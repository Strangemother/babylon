// # Part 1
class EmptyLitScene extends Garden {
    mySetup(){
        this.backgroundColor = colors.white()
        this._camera = new ArcRotateCamera({
            activate: true
            , radius: 20
            , speed: .2
        });

        this.pointLight = new PointLight({
            position: [12, 7, 2]
            , intensity: .5
        })

        this.hemiLight = new HemisphericLight({
            intensity: .5
        })

        this.children.addMany(this.hemiLight, this.pointLight);
    }
}

window.EmptyLitScene = EmptyLitScene


// # Part 2
class SphereExample extends EmptyLitScene {
    start(){
        this.mySetup()

        this.sphere = new Sphere({
            diameter: 2
            , subdivisions: 16
            , position: [0, 0, 0]
            , color: 'lightBlue'
        })

        console.log('Add to scene:', this.sphere)
        this.sphere.addToScene()
    }
}

// # Execute
var myApp = new SphereExample({ element: canvasNode })
myApp.run()
