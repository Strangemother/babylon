;(function(global){

var test = Test.assertions;

class InstanceTests {

    test_exists() {
        /* Ensure INSTANCE exists another large content block.*/
        test.value(_instance).isObject()
    }

}

Test.add(InstanceTests)

})(window)

