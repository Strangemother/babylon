
run = function(interfaceConfig){
    g = start(interfaceConfig);
    //gs = g.level.scene;
    //s = new SimpleGamepad(gs);
    return g;
};

start = function(config){
    var game = config || {}
    console.log('(main) start()')
    var gi = new GameInterface(CONFIG);
    gi.run(game)
    return gi
};

window.apos = run({ level: 'scaleTest' });

