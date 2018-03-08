# Mocks API reference

## What are mocks?

Mocks (and mock expectations) are fake methods (like spies) with pre-programmed behavior (like stubs) as well as pre-programmed expectations. A mock will fail your test if it is not used as expected.

## When to use mocks?

Mocks should only be used for the method under test. In every unit test, there should be one unit under test. If you want to control how your unit is being used and like stating expectations upfront (as opposed to asserting after the fact), use a mock.

## When to not use mocks?

Mocks come with built-in expectations that may fail your test. Thus, they enforce implementation details. The rule of thumb is: if you wouldn’t add an assertion for some specific call, don’t mock it. Use a stub instead. In general you should never have more than one mock (possibly with several expectations) in a single test.

Expectations implement both the spies and stubs APIs.

    function () {
        var assertions = Test.assetions

        var myAPI = { method: function () {} };
        var spy = assertions.spy();
        var mock = assertions.mock(myAPI);

        mock.expects("method").once().throws();

        mock.verify();
        assert(spy.calledOnce);
    }


## Mocks API

    var assertions = Test.assetions
    var mock = assertions.mock(obj);

Creates a mock for the provided object. Does not change the object, but returns a mock object to set expectations on the object’s methods.

    var expectation = mock.expects("method");

Overrides obj.method with a mock function and returns it. See expectations below.

    // Restores all mocked methods.
    mock.restore();

    // Verifies all expectations on the mock.
    // If any expectation is not satisfied, an exception is thrown.
    // Also restores the mocked methods.
    mock.verify();


## Expectations

All the expectation methods return the expectation, meaning you can chain them. Typical usage:

    var assertions = Test.assetions

    assertions.mock(jQuery).expects("ajax").atLeast(2).atMost(5);
    jQuery.ajax.verify();

    var mock = Test.assetions.mock

    var expectation = mock.expectation.create([methodName]);

Creates an expectation without a mock object, basically an anonymous mock function. Method name is optional and is used in exception messages to make them more readable.

    var assertions = Test.assetions

    var expectation = assertions.mock();

The same as the above.

| function | description |
| -- | -- |
| `atLeast(number)`                 | Specify the minimum amount of calls expected. |
| `atMost(number)`                  | Specify the maximum amount of calls expected. |
| `never()`                         | Expect the method to never be called. |
| `once()`                          | Expect the method to be called exactly once. |
| `twice()`                         | Expect the method to be called exactly twice. |
| `thrice()`                        | Expect the method to be called exactly thrice. |
| `exactly(number)`                 | Expect the method to be called exactly number times. |
| `withArgs(arg1, arg2, ...)`       | Expect the method to be called with the provided arguments and possibly others. |
| `withExactArgs(arg1, arg2, ...)`  | Expect the method to be called with the provided arguments and no others. |
| `on(obj)`                         | Expect the method to be called with obj as this. |
| `verify()`                        | Verifies the expectation and throws an exception if it’s not met. 
