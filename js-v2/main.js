var gi;
var I = INSTANCE;

run = function(interfaceConfig){
    g = start(interfaceConfig);
    //gs = g.level.scene;
    //s = new SimpleGamepad(gs);
    return g;
};

start = function(config){
    var game = config || {}
    console.log('(main) start()')
    gi = new AppInterface(CONFIG);
    gi.run(game);
    return gi
};

createBox = function(){
    var box = new I.Box;
    box.addChild()
}

window.apos = run({ level: 'scaleTest' });

