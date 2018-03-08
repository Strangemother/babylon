runInterface = function(config){
    var intf = new DevInterface();
    intf.start(config);
    return intf;
};

runDev = function(){
    intf.appData( CONFIG );
};

intf = runInterface(CONFIG);
