/*
The Configure method caller provides attributes to a class
after instansiation. This saves a lot of writing.
The configure values write to the config of the wrapped
class, for class pickup.
 */
var Configure = function(Klass, obj){
    return (function(Klass, obj){
        return function(d){
            var c = new Klass(d, late=true)
            var conf = Object.assign({}, c.defaults(), obj)
            c._config = conf
            return c
        }
    }).apply({}, [Klass, obj])
}
