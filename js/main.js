
start = function(config){
    var game = config || {}
    var gi = new GameInterface(CONFIG);
    gi.run(game)
    return gi
}

// document.getElementById('run').addEventListener('click', function(){ run() });
// document.getElementById('runDev').addEventListener('click', function(){ runDev() });

run = function(interfaceConfig){
    g = start(interfaceConfig);
    gs = g.level.scene;
    s = new SimpleGamepad(gs);
    return g;
};

runInterface = function(config){
    var intf = new DevInterface();
    intf.start(config);
    return intf;
};

runDev = function(gi){
    intf.gameInterface( gi || run() );
};

if(window.DevInterface) {
    intf = runInterface(CONFIG);
} else {
    gi = run({ level: 'scaleTest' })
}

