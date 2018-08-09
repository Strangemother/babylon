# Exception


### Exception

| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual exception equality by content and if possible, recursively. |
|` isNot(expected) `                | Assert actual exception to the negative equality by content and if possible, recursively. |
|` isIdenticalTo(expected) `        | Assert that the actual exception is identical to (===) expected value. |
|` isNotIdenticalTo(expected) `     | Assert that the actual exception is not identical to (!==) expected value. |
|` isEqualTo(expected) `            | Assert that the actual exception is equal to (==) the expected value. |
|` isNotEqualTo(expected) `         | Assert that the actual exception is not equal to (!=) the expected value. |
|` match(expected) `                | Assert actual exception to match the expected value. |
|` notMatch(expected) `             | Assert actual exception to not match the expected value. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` isType(expected) `               | Assert that the type of actual exception is the given expected value (using typeof operator). |
|` isNotType(expected) `            | Assert that the type of actual exception is not the given expected value (using typeof operator). |
|` isObject() `                     | Assert that the type of actual exception is object (using typeof operator). |
|` isArray() `                      | Assert that the type of actual exception is array (using typeof operator). |
|` isString() `                     | Assert that the type of actual exception is string (using typeof operator). |
|` isNumber() `                     | Assert that the type of actual exception is number (using typeof operator). |
|` isBool() `                       | Alias of isBoolean(). |
|` isBoolean() `                    | Assert that the type of actual exception is boolean (using typeof operator). |
|` isNull() `                       | Assert that the type of actual exception is null (using typeof operator). |
|` isUndefined() `                  | Assert that the type of actual exception is undefined (using typeof operator). |
|` isRegExp() `                     | Assert that the actual exception is an instance of RegExp. |
|` isNotRegExp() `                  | Assert that the actual exception is not an instance of RegExp. |
|` isDate() `                       | Assert that the actual exception is an instance of Date. |
|` isNotDate() `                    | Assert that the actual exception is not an instance of Date. |
|` isArguments() `                  | Assert that the actual exception is the arguments object provided in a function. |
|` isNotArguments() `               | Assert that the actual exception is not the arguments object provided in a function. |
|` isEmpty() `                      | Assert that the actual exception is empty. |
|` isNotEmpty() `                   | Assert that the actual exception is not empty. |
|` isError() `                      | Assert that the actual exception is an Error instance. |
|` hasLength(expected) `            | Assert that the actual exception has a length property equal to expected number. |
|` hasNotLength(expected) `         | Assert that the actual exception has not a length property equal to expected number. |
|` isEnumerable(property) `         | Assert that the actual exception has an enumerable property.It will fail if the actual value lacks the property entirely. |
|` isNotEnumerable(property) `      | Assert that the actual exception has a non-enumerable property.It will fail if the actual value lacks the property entirely. |
|` isFrozen() `                     | Assert that the actual exception is frozen with Object.isFrozen. |
|` isNotFrozen() `                  | Assert that the actual exception is not frozen with Object.isFrozen. |
|` isInstanceOf(expected) `         | Assert that the actual exception is an instance of expected value. |
|` isNotInstanceOf(expected) `      | Assert that the actual exception is not an instance of expected value. |
|` hasProperty(property, value) `   | Assert that the actual tested exception has property.Optionally assert it equals (===) to value argument. |
|` hasNotProperty(property, value) `  | Assert that the actual tested exception has not a property.Optionally assert it not equals (!==) to value argument. |
|` hasOwnProperty(property, value) `  | Assert that the actual tested exception has own property.Optionally assert it equals (===) to value argument. |
|` hasNotOwnProperty(property, value) `  | Assert that the actual tested exception has not own property.Optionally assert it not equals (!==) to value argument. |
|` hasProperties(properties) `      | Assert that the actual exception has only the expected enumerable properties.Pass an array of strings as properties. |
|` hasNotProperties(properties) `   | Assert that the actual exception has not the enumerable properties.Pass an array of strings as properties. |
|` hasOwnProperties(properties) `   | Assert that the actual exception has only the expected enumerable properties of its own.Pass an array of strings as properties. |
|` hasKey(key, value) `             | Alias of hasProperty() |
|` notHasKey(key, value) `          | Alias of hasNotProperty() |
|` hasKeys(keys) `                  | Alias of hasProperties() |
|` notHasKeys(keys) `               | Alias of hasNotProperties() |
|` hasValue(expected) `             | Assert that the actual tested exception has expected value. |
|` notHasValue(expected) `          | Assert that the actual tested exception not has expected value. |
|` hasValues(expected) `            | Assert that the actual tested exception has several expected values passed in an array of expected values. |
|` notHasValues(expected) `         | Assert that the actual tested exception not has several expected values passed in an array of expected values. |
|` contains(expected) `             | Assert that the actual exception to contain something (===) to expected within depth. |
|` notContains(expected) `          | Assert that the actual exception to not contain something (!==) to expected within depth. |
|` startsWith(str) `                | Assert that the actual exception (string) starts with str. |
|` notStartsWith(str) `             | Assert that the actual exception (string) not starts with str. |
|` endsWith(str) `                  | Assert that the actual exception (string) ends with str. |
|` notEndsWith(str) `               | Assert that the actual exception (string) not ends with str. |
|` hasMessage(expected) `           | Alias of match(). |




