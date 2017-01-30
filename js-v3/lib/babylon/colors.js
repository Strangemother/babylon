var colors = {};
var materials = {};
var modifiers = {};

colors.DIFFUSE = 'diffuseColor'
colors.EMISSIVE = 'emissiveColor'

materials.white = function(scene) {
    var mat = materials.standard(scene, 'White')
    mat.diffuseColor = colors.white()
    return mat
}

materials.blue = function(scene) {
    var mat = materials.standard(scene, 'Blue')
    mat.emissiveColor = colors.blue()
    return mat
}

materials.standard = function(scene, name) {
    scene = scene || Garden.instance().scene();
    var m = new BABYLON.StandardMaterial(name, scene);
    return m;
}

materials.color = function(scene, name, type=colors.DIFFUSE){
    let item = name;
    if(typeof(name) == 'string') {
        item = colors[name](undefined, type)
    } else {
        name = simpleID(item.name)
    }

    let m = materials.standard(scene, name);
    console.log('making', item, type)
    m[type] = item;
    return m
}

modifiers.fog = function(scene) {
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.04;
    scene.fogColor = new BABYLON.Color3(0.8, 0.83, 0.8);
}


let _colors = {
    red:       [1, 0, 0]
    , green:   [0, 1, 0]
    , blue:    [0, 0, 1] // will be skipped due to override
    , blue:    [0, 0, 1] // will be skipped due to override
    , black:   [0,0,0]
    , white:   [1,1,1]
    , red:     [1,0,0]
    , lime:    [0,1,0]
    , blue:    [0,0,1]
    , yellow:  [1,1,0]
    , cyan:    [0,1,1]
    , magenta: [1,0,1]
    , silver:  [.75,.75,.75]
    , gray:    [.6,.6,.6]
    , maroon:  [.6,0,0]
    , olive:   [.6,.6,0]
    , purple:  [.6,0,.6]
    , teal:    [0,.6,.6]
    , navy:    [0,0,.6]

}


colors.emissive = function() {
    let v= colors.get.apply(colors, arguments)
    v._gardenType = colors.EMISSIVE
    return v;
}

colors.get = function(value, count=-1, type=colors.DIFFUSE){
    // Cast the element as the given type.

    let c = (count==-1)? 4: count;
    if(typeof(value) == 'string' ) {
        // if(count==-1) c = 3
        return colors[value](c, type)
    }

    let _t = IT.g(value)

    /* The given element was not a string.
    Assume it was a BABYLON.Color# type and ensure
    it's of the given count.*/
    let n = `Color${c}`;
    let cn = value.constructor.name;

    if(cn == n) {
        return value;
    };

    let mapName = {
        Color3: ['r', 'g', 'b']
        , Color4: ['r', 'g', 'b', 'a']
    }

    if(_t.is('object')) {
        // Fetch info.
        let mv = mapName[n];
        if(mv != undefined) {
            let nc = colors.make(...mv.map(x => value[x]))
            nc._gardenType = value._gardenType || type
            return nc
        }
    };

    if(_t.is('array')) {
        // Cast new
        let func = count == -1? 'make': `make${count}`
        return colors.make(...value)
    };

    let m = `Could not resolve color "${value}"`
    console.error('Could not resolve color:', value)
    return NotImplementedError.throw(m)
}

colors.color3 = function(num) {
    return colors.make(num, num, num)
}


colors.color4 = function(num, a) {
    return colors.make(num, num, num, a || num)
}


colors.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16)
        , parseInt(result[2], 16)
        , parseInt(result[3], 16)
    ] : null;
}


colors.hex = function(hexVal){
    /* Create a color using a hex value*/
    return colors.make.apply(colors, colors.hexToRgb(hexVal).map(x => x/255))
}


colors.rgbToHex = function(...args) {
    let [r,g,b] = args.map(x => x*255)
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

colors.make = function(r, g, b, a=1, type, count) {
    let l = count || arguments.length;
    let secondArg = type;
    let result;

    if(r instanceof Array) {
        var v = r;
        r = v[0];
        if( g != undefined ) {
            secondArg = g;
        };
        g = v[1];
        b = v[2];
        a = v[3] || a;
        if(a==undefined) l = count || 3;
    };

    let funcName = l==3? 'Color3': 'Color4'
    result = new BABYLON[funcName](r,g,b,a);
    result._gardenType = secondArg;

    return result;
}

colors.make3 = function(r, g, b, type){
    return colors.make(r, g, b, undefined, type, 3)
}

colors.make4 = function(r, g, b, a, type){
    if(a == undefined) {
        return colors.make(r,g,b,1, type, 4)
    };

    return colors.make(r,g,b, a, type, 4)
}



colors.names = [];

colors.addColors = function(_colors, overwrite=true) {
    /* Add an object of colors,
    Creating a function on `colors` of the key from the given object.
    The function calls `colors.make` returning a BABYLON type.

        colors.addColors({ red: [1, 0, 0]})*/
    for(var name in _colors) {
        if(colors[name] !== undefined) {
            if(overwrite == false) {
                continue;
            } else {
                console.warn('overwrite ' + name)
            }
        }

        colors.names.push(name)

        _colors['_' + name] = _colors[name];

        colors[name] = (function(){
            var name = this.name;
            return function(count=4, type=undefined){
                let c = colors['make'+String(count)].call(colors, _colors['_'+name], type)
                return c;
            }

        }).apply({ name })
    }
}


colors.addColors(_colors, false)

