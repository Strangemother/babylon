var main = function(){

    //let v = new App(CONFIG);

    $('#run_tests').click(runTests);
    window.app = simpleExample()

    return

    Garden.config(CONFIG)
    window.app = Garden.run('Simple')

}

var simpleExample = function(){
    return Garden.run(CONFIG)
}

var runTests = function(){
    Test.run()
};

class ActorBox extends BabylonObject {
    keys(){
        return ['position']
    }

    babylonCall(...args) {
        // build a box
        return BABYLON.MeshBuilder.CreateBox(...args)
    }

    get position(){
        let b = this._babylon;
        if(!b) Garden.handleError('missingBabylon', '_bablyon instance must exist')
        return b.position
    }

    set position(v){
        this._babylon.position = v
        return true;
    }
}


var logger = function(name) {
    /* Setup the print logger */
    var logger = new PrintLogger(name, true);
    window.log = logger.log;
    var logView = logger.create({});
}

;main();
