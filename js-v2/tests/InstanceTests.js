;(function(global){

var test = Test.assertions;

class InstanceTests {

    test_exists() {
        test.value(INSTANCE).isObject()
    }
}

Test.add(InstanceTests)

})(window)
