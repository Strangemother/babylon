var log = function() {
    console.log.apply(console, arguments)
}

var simple_id_counter = 0
var simpleID = function(optional='', counter=undefined){
    let id = counter || simple_id_counter++; // Math.random().toString(32).slice(2);
    let insert = optional != ''? '_': '';
    return `${optional}${insert}${id}`
}

var complex_ids_counter = {
    defCounter: 0
}

var complexID = function(optional='defCounter') {
    if(complex_ids_counter[optional] == undefined) {
        complex_ids_counter[optional] = 0
    }

    complex_ids_counter[optional]++;
    return simpleID(optional, complex_ids_counter[optional]);

}


var asVector = function(...args){
    /*
        Create a LIB Vector type using
        arguments:

            asVector(10)           => Vector2(10, 10)
            asVector([10])         => Vector2(10, 10)
            asVector(1, 2)         => Vector2(1, 2)
            asVector([1, 2])       => Vector2(1, 2)
            asVector(1, 2, 3)      => Vector3(1, 2, 3)
            asVector([1, 2, 3])    => Vector3(1, 2, 3)
            asVector(1, 2, 3, 4)   => Vector4(1, 2, 3, 4)
            asVector([1, 2, 3, 4]) => Vector4(1, 2, 3, 4)
            asVector(new Vector#())=> Vector#()
     */
    let B = LIB;
    let classes = [
        undefined
        , function(a){
            if(IT.g(a).is('number')) return asVector(a, a);
            if(a.constructor != undefined) {
                let al = [ "Vector2" ,"Vector3" ,"Vector4" ];
                if( al.indexOf(a.constructor.name) > -1){
                    return a;
                };
            };

            NotImplementedError.throw('asVector requires a Number or Vector# type');
        }
        , LIB.Vector2
        , LIB.Vector3
        , LIB.Vector4
    ];

    let a = args;
    if(args.length == 1 && Array.isArray(a[0])){
        a = args[0]
    };

    let v = new classes[a.length](...a);
    return v;
}

var asXYZ = function(item, x, y, z){
    /* Apply the X Y and Z value to the given item.

        asXYZ(fooItem._position, 2,3,4)
        asXYZ(fooItem._position, [2,3,4])

    It's a little easier than writing 3 lines yourself.*/
    if( y == undefined
        && z == undefined
        && x != undefined) {
        [x, y, z] = [x[0], x[1], x[2]]
    }

    item.x = x;
    item.y = y;
    item.z = z;

}
