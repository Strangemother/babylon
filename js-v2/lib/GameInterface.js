;(function(){

var I = INSTANCE;

I._ = class GameInterface extends I.ProxyClass {

    __declare__() {
        return { global: true }
    }

    __assets__() {
        return ['foo.js']
    }

    init(config){
        this.log('config', config)
        this.config = config;
    }

    run(gameConfig){
        this.log('Run', gameConfig);
        this.gameConfig = gameConfig;
    }
}

})()
