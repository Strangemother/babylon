;(function(global){

var test = Test.assertions;

class InstanceTests {

    test_exists() {
        /* Ensure INSTANCE exists another large content block.*/
        test.value(INSTANCE).isObject()
    }
}

Test.add(InstanceTests)

})(window)
