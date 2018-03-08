# Error


| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual Error exception equality by content and if possible, recursively. |
|` isNot(expected) `                | Assert actual Error exception to the negative equality by content and if possible, recursively. |
|` isIdenticalTo(expected) `        | Assert that the actual Error exception is identical to (===) expected value. |
|` isNotIdenticalTo(expected) `     | Assert that the actual Error exception is not identical to (!==) expected value. |
|` isEqualTo(expected) `            | Assert that the actual Error exception is equal to (==) the expected value. |
|` isNotEqualTo(expected) `         | Assert that the actual Error exception is not equal to (!=) the expected value. |
|` match(expected) `                | Assert actual Error exception to match the expected value. |
|` notMatch(expected) `             | Assert actual Error exception to not match the expected value. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` isEnumerable(property) `         | Assert that the actual Error exception has an enumerable property.It will fail if the actual value lacks the property entirely. |
|` isNotEnumerable(property) `      | Assert that the actual Error exception has a non-enumerable property.It will fail if the actual value lacks the property entirely. |
|` isFrozen() `                     | Assert that the actual Error exception is frozen with Object.isFrozen. |
|` isNotFrozen() `                  | Assert that the actual Error exception is not frozen with Object.isFrozen. |
|` isInstanceOf(expected) `         | Assert that the actual Error exception is an instance of expected value. |
|` isNotInstanceOf(expected) `      | Assert that the actual Error exception is not an instance of expected value. |
|` hasProperty(property, value) `   | Assert that the actual tested Error exception has property.Optionally assert it equals (===) to value argument. |
|` hasNotProperty(property, value) `  | Assert that the actual tested Error exception has not a property.Optionally assert it not equals (!==) to value argument. |
|` hasOwnProperty(property, value) `  | Assert that the actual tested Error exception has own property.Optionally assert it equals (===) to value argument. |
|` hasNotOwnProperty(property, value) `  | Assert that the actual tested Error exception has not own property.Optionally assert it not equals (!==) to value argument. |
|` hasKey(key, value) `             | Alias of hasProperty() |
|` notHasKey(key, value) `          | Alias of hasNotProperty() |
|` hasMessage(expected) `           | Alias of match(). |

