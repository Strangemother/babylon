# Object


### object

| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual object equality by content and if possible, recursively. |
|` isNot(expected) `                | Assert actual object to the negative equality by content and if possible, recursively. |
|` isIdenticalTo(expected) `        | Assert that the actual object is identical to (===) expected value. |
|` isNotIdenticalTo(expected) `     | Assert that the actual object is not identical to (!==) expected value. |
|` isEqualTo(expected) `            | Assert that the actual object is equal to (==) the expected value. |
|` isNotEqualTo(expected) `         | Assert that the actual object is not equal to (!=) the expected value. |
|` match(expected) `                | Assert actual object to match the expected value. |
|` notMatch(expected) `             | Assert actual object to not match the expected value. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` matchEach(expected) `            | Assert actual object to match each expected value. |
|` notMatchEach(expected) `         | Assert actual object to not match one or several expected value. |
|` isArray() `                      | Assert that actual object is an array (using typeof operator). |
|` isRegExp() `                     | Assert that the actual object is an instance of RegExp. |
|` isNotRegExp() `                  | Assert that the actual object is not an instance of RegExp. |
|` isDate() `                       | Assert that the actual object is an instance of Date. |
|` isNotDate() `                    | Assert that the actual object is not an instance of Date. |
|` isArguments() `                  | Assert that the actual object is the arguments object provided in a function. |
|` isNotArguments() `               | Assert that the actual object is not the arguments object provided in a function. |
|` isEmpty() `                      | Assert that the actual object is empty. |
|` isNotEmpty() `                   | Assert that the actual object is not empty. |
|` hasLength(expected) `            | Assert that the actual object has a length property equal to expected number. |
|` hasNotLength(expected) `         | Assert that the actual object has not a length property equal to expected number. |
|` isEnumerable(property) `         | Assert that the actual object has an enumerable property.It will fail if the actual value lacks the property entirely. |
|` isNotEnumerable(property) `      | Assert that the actual object has a non-enumerable property.It will fail if the actual value lacks the property entirely. |
|` isFrozen() `                     | Assert that the actual object is frozen with Object.isFrozen. |
|` isNotFrozen() `                  | Assert that the actual object is not frozen with Object.isFrozen. |
|` isInstanceOf(expected) `         | Assert that the actual object is an instance of expected value. |
|` isNotInstanceOf(expected) `      | Assert that the actual object is not an instance of expected value. |
|` hasProperty(property, value) `   | Assert that the actual tested object has property.Optionally assert it equals (===) to value argument. |
|` hasNotProperty(property, value) `  | Assert that the actual tested object has not a property.Optionally assert it not equals (!==) to value argument. |
|` hasOwnProperty(property, value) `  | Assert that the actual tested object has own property.Optionally assert it equals (===) to value argument. |
|` hasNotOwnProperty(property, value) `  | Assert that the actual tested object has not own property.Optionally assert it not equals (!==) to value argument. |
|` hasProperties(properties) `      | Assert that the actual object has only the expected enumerable properties.Pass an array of strings as properties. |
|` hasNotProperties(properties) `   | Assert that the actual object has not the enumerable properties.Pass an array of strings as properties. |
|` hasOwnProperties(properties) `   | Assert that the actual object has only the expected enumerable properties of its own.Pass an array of strings as properties. |
|` hasKey(key, value) `             | Alias of hasProperty() |
|` notHasKey(key, value) `          | Alias of hasNotProperty() |
|` hasKeys(keys) `                  | Alias of hasProperties() |
|` notHasKeys(keys) `               | Alias of hasNotProperties() |
|` hasValue(expected) `             | Assert that the actual tested object has expected value. |
|` notHasValue(expected) `          | Assert that the actual tested object not has expected value. |
|` hasValues(expected) `            | Assert that the actual tested object has several expected values passed in an array of expected values. |
|` notHasValues(expected) `         | Assert that the actual tested object not has several expected values passed in an array of expected values. |
|` contains(expected) `             | Assert that the actual object to contain something (===) to expected within depth. |
|` notContains(expected) `          | Assert that the actual object to not contain something (!==) to expected within depth. |
|` hasName(expected) `              | Assert that the actual object has an expected name. |




