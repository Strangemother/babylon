
var pl = new PrintLogger(true);

deflog = pl.create({});

example = pl.create({
    name: 'example'
    , showIndex: true
    , showTime: false
});

other = pl.create({
    name: 'other'
});

pl.add({
    value: 'Name'
});

pl.add({
    name: 'example'
    , value: '1 (example) This should go to example'
});

pl.add({
    name: 'example'
    , value: '2 (example) Another example'
});

pl.add({
    value: '3 (default) to default default'
});

other.add({
    name:'foo'
    , value: '4 (other) straight to other'
});

pl.add({
    value: '5 (default) Ooh no!'

})

var t, _stop, names = ['example', 'other']

var choice = function(...args){

    if(args.length == 0) {
        return Math.random() > .46
    };

    let v = Math.round(args.length * Math.random());
    if(v == args.length) v-=1
    return args[v]
}

var run = function(){
    _stop = false;
    let timeout = 100 * Math.random();

    var o = {}

    let name;

    let cl = choice(true, false, true);
    if(cl) {
        name = choice(...names);
        o.name = name
    }


    if(choice()){
        o.info = choice('info', '', 'error', 'warn', '')
    }

    o.value = loremIpsum(Math.random() * 10)

    pl.add(o)

    if(_stop) return;
    t = window.setTimeout(function(){
        if(_stop) return;
        run()
    }, timeout)
}

var stop = function(){
    window.clearTimeout(t);
    _stop = true;
}

var spam = function(){
    var lr = _stop;
    stop()
    var r =  Math.random() * 340
    for (var i = 0; i < r; i++) {
        other.add({
            name:'foo'
            , value: '4 (other) straight to other'
        });
    };

    if(!lr) run()
}
