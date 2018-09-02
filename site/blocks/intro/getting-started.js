let garden = new Garden({ element: canvasNode, sceneColor: 'lightBlue' })

let cube = new Cube({ color: 'green' })
cube.addToScene()

let light = new Light({ direction: asVector(1, 1, 3) })
light.addToScene();
