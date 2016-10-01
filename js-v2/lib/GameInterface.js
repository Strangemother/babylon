;(function(){

var I = INSTANCE;

class GameInterface extends I.ProxyClass {

    constructor(){
        console.log('GameInterface super')
        super()
    }

    init(config){
        console.log('GameInterface init')
        this.log(config)
        this.config = config;
    }

    run(gameConfig){
        this.log('Run', gameConfig)
    }
}

window.GameInterface = GameInterface
})()
