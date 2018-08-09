class StubCanvas {
    constructor(name) {
        this.name = name;
    }

    context() {
        return ( document.getElementById(this.name) != null) ? document.getElementById(this.name).getContext('2d'): undefined
    }
}


var stubCanvas = new StubCanvas('test_canvas')
var stubC = stubCanvas.context();
GameInterface.stub = {canvas:stubCanvas, context: stubC};
