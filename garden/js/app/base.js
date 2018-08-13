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
