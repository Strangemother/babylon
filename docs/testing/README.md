# Testing

A test suite is supplied built on top of Mocha and unitjs.

## Making Tests

Tests are nothing special. They load along with your code and press all the button waiting for an expected output. The base of any test requires a class applied to `Test.add(class)`:


```js
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
```

To run your tests run use `Test.run()`. A mocha test panel will be presented.
















