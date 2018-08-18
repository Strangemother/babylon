# Regexp

| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual RegExp equality by content and if possible, recursively. |
|` isNot(expected) `                | Assert actual RegExp to the negative equality by content and if possible, recursively. |
|` isIdenticalTo(expected) `        | Assert that the actual RegExp is identical to (===) expected value. |
|` isNotIdenticalTo(expected) `     | Assert that the actual RegExp is not identical to (!==) expected value. |
|` isEqualTo(expected) `            | Assert that the actual RegExp is equal to (==) the expected value. |
|` isNotEqualTo(expected) `         | Assert that the actual RegExp is not equal to (!=) the expected value. |
|` match(expected) `                | Assert actual RegExp to match the expected value. |
|` notMatch(expected) `             | Assert actual RegExp to not match the expected value. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` isEnumerable(property) `         | Assert that the actual RegExp has an enumerable property.It will fail if the actual value lacks the property entirely. |
|` isNotEnumerable(property) `      | Assert that the actual RegExp has a non-enumerable property.It will fail if the actual value lacks the property entirely. |
|` isFrozen() `                     | Assert that the actual RegExp is frozen with Object.isFrozen. |
|` isNotFrozen() `                  | Assert that the actual RegExp is not frozen with Object.isFrozen. |
|` hasProperty(property, value) `   | Assert that the actual tested RegExp has property.Optionally assert it equals (===) to value argument. |
|` hasNotProperty(property, value) `  | Assert that the actual tested RegExp has not a property.Optionally assert it not equals (!==) to value argument. |
|` hasOwnProperty(property, value) `  | Assert that the actual tested RegExp has own property.Optionally assert it equals (===) to value argument. |
|` hasNotOwnProperty(property, value) `  | Assert that the actual tested RegExp has not own property.Optionally assert it not equals (!==) to value argument. |
|` hasKey(key, value) `             | Alias of hasProperty() |
|` notHasKey(key, value) `          | Alias of hasNotProperty() |

