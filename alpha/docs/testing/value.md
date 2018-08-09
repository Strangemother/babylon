# Value


| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual value equality by content and if possible, recursively. |
|` isNot(expected) `                | Assert actual value to the negative equality by content and if possible, recursively. |
|` isEqualTo(expected) `            | Assert that the actual value is equal to (==) the expected value. |
|` isNotEqualTo(expected) `         | Assert that the actual value is not equal to (!=) the expected value. |
|` isStrictEqualTo(expected) `      | Assert that the actual value is strict equal to (===) expected value. |
|` isNotStrictEqualTo(expected) `   | Assert that the actual value is not identical to (!==) expected value. |
|` isIdenticalTo(expected) `        | Assert that the actual value is identical to (===) expected value. |
|` isNotIdenticalTo(expected) `     | Assert that the actual value is not identical to (!==) expected value. |
|` match(expected) `                | Assert actual value to match the expected value. |
|` notMatch(expected) `             | Assert actual value to not match the expected value. |
|` matchEach(expected) `            | Assert actual value to match each expected value. |
|` notMatchEach(expected) `         | Assert actual value to not match one or several expected value. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` isType(expected) `               | Assert that the type of actual value is the given expected value (using typeof operator). |
|` isNotType(expected) `            | Assert that the type of actual value is not the given expected value (using typeof operator). |
|` isObject() `                     | Assert that the type of actual value is object (using typeof operator). |
|` isArray() `                      | Assert that the type of actual value is array (using typeof operator). |
|` isFunction() `                   | Assert that the type of actual value is function (using typeof operator). |
|` isString() `                     | Assert that the type of actual value is string (using typeof operator). |
|` isNumber() `                     | Assert that the type of actual value is number (using typeof operator). |
|` isBool() `                       | Alias of boolean(). |
|` isBoolean() `                    | Assert that the type of actual value is boolean (using typeof operator). |
|` isNull() `                       | Assert that the type of actual value is null (using typeof operator). |
|` isUndefined() `                  | Assert that the type of actual value is undefined (using typeof operator). |
|` isRegExp() `                     | Assert that the actual value is an instance of RegExp. |
|` isNotRegExp() `                  | Assert that the actual value is not an instance of RegExp. |
|` isDate() `                       | Assert that the actual value is an instance of Date. |
|` isNotDate() `                    | Assert that the actual value is not an instance of Date. |
|` isArguments() `                  | Assert that the actual value is the arguments object provided in a function. |
|` isNotArguments() `               | Assert that the actual value is not the arguments object provided in a function. |
|` isTrue() `                       | Assert that the actual value is true. |
|` isNotTrue() `                    | Assert that the actual value is not true. |
|` isTruthy() `                     | Assert that the actual value is truthy (!!actual).Only null, undefined, 0, false and "" are falsy in JavaScript. Everything else is truthy. |
|` isNotTruthy() `                  | Assert that the actual value is not truthy.Only null, undefined, 0, false and "" are falsy in JavaScript. Everything else is truthy. |
|` isFalse() `                      | Assert that the actual value is false. |
|` isNotFalse() `                   | Assert that the actual value is not false. |
|` isFalsy() `                      | Assert that the actual value is falsy.Only null, undefined, 0, false and "" are falsy in JavaScript. Everything else is truthy. |
|` isNotFalsy() `                   | Assert that the actual value is not falsy.Only null, undefined, 0, false and "" are falsy in JavaScript. Everything else is truthy. |
|` isEmpty() `                      | Assert that the actual value is empty. |
|` isNotEmpty() `                   | Assert that the actual value is not empty. |
|` exists() `                       | Assert that the actual value is exists and thereby is not null or undefined. |
|` isError() `                      | Assert that the actual value (trigger function) throws an instanceof Error (or inherited). |
|` throws(constructor, expected) `  | Assert that the actual value (trigger function) throws. |
|` hasLength(expected) `            | Assert that the actual value has a length property equal to expected number. |
|` hasNotLength(expected) `         | Assert that the actual value has not a length property equal to expected number. |
|` isBetween(begin, end) `          | Assert that the actual value is between begin and end (inclusive). |
|` isNotBetween(begin, end) `       | Assert that the actual value is not between begin and end (inclusive). |
|` isBefore(expected) `             | Alias of isLessThan(). |
|` isAfter(expected) `              | Alias of isGreaterThan(). |
|` isLessThan(expected) `           | Assert that the actual value is lesser than the expected value. |
|` isGreaterThan(expected) `        | Assert that the actual value is greater than the expected value. |
|` isApprox(num, delta) `           | Assert that the actual value (floating point number) near num within delta margin. |
|` isInfinite() `                   | Assert that the actual value is infinite. |
|` isNotInfinite() `                | Assert that the actual value is not infinite. |
|` isNaN() `                        | Assert that the actual value is NaN. |
|` isNotNaN() `                     | Assert that the actual value is not NaN. |
|` isEnumerable(property) `         | Assert that the actual value has an enumerable property.It will fail if the actual value lacks the property entirely. |
|` isNotEnumerable(property) `      | Assert that the actual value has a non-enumerable property.It will fail if the actual value lacks the property entirely. |
|` isFrozen() `                     | Assert that the actual value is frozen with Object.isFrozen. |
|` isNotFrozen() `                  | Assert that the actual value is not frozen with Object.isFrozen. |
|` isInstanceOf(expected) `         | Assert that the actual value is an instance of expected value. |
|` isNotInstanceOf(expected) `      | Assert that the actual value is not an instance of expected value. |
|` hasProperty(property, value) `   | Assert that the actual tested value has property.Optionally assert it equals (===) to value argument. |
|` hasNotProperty(property, value) `  | Assert that the actual tested value has not a property.Optionally assert it not equals (!==) to value argument. |
|` hasOwnProperty(property, value) `  | Assert that the actual tested value has own property.Optionally assert it equals (===) to value argument. |
|` hasNotOwnProperty(property, value) `  | Assert that the actual tested value has not own property.Optionally assert it not equals (!==) to value argument. |
|` hasProperties(properties) `      | Assert that the actual value has only the expected enumerable properties.Pass an array of strings as properties. |
|` hasNotProperties(properties) `   | Assert that the actual value has not the enumerable properties.Pass an array of strings as properties. |
|` hasOwnProperties(properties) `   | Assert that the actual value has only the expected enumerable properties of its own.Pass an array of strings as properties. |
|` hasKey(key, value) `             | Alias of hasProperty() |
|` notHasKey(key, value) `          | Alias of hasNotProperty() |
|` hasKeys(keys) `                  | Alias of hasProperties() |
|` notHasKeys(keys) `               | Alias of hasNotProperties() |
|` hasValue(expected) `             | Assert that the actual tested value has expected value. |
|` notHasValue(expected) `          | Assert that the actual tested value not has expected value. |
|` hasValues(expected) `            | Assert that the actual tested value has several expected values passed in an array of expected values. |
|` notHasValues(expected) `         | Assert that the actual tested value not has several expected values passed in an array of expected values. |
|` contains(expected) `             | Assert that the actual value to contain something (===) to expected within depth. |
|` notContains(expected) `          | Assert that the actual value to not contain something (!==) to expected within depth. |
|` isReverseOf(expected) `          | Assert that the actual tested value is the reverse array to the expected array.An array is a reverse of another if they both have the same elements (including the same number of duplicates) regardless of their order. Elements are checked with strict equals (===). |
|` isNotReverseOf(expected) `       | Assert that the actual tested value is not the reverse array to the expected array.An array is a reverse of another if they both have the same elements (including the same number of duplicates) regardless of their order. Elements are checked with strict equals (===). |
|` startsWith(str) `                | Assert that the actual value starts with str. |
|` notStartsWith(str) `             | Assert that the actual value not starts with str. |
|` endsWith(str) `                  | Assert that the actual value ends with str. |
|` notEndsWith(str) `               | Assert that the actual value not ends with str. |
|` hasHttpStatus(code) `            | Assert that the actual value has a given HTTP status code. |
|` notHasHttpStatus(code) `         | Assert that the actual value not has a given HTTP status code. |
|` hasHeader(field, value) `        | Assert that the actual value has a given header field and optional value are present. |
|` notHasHeader(field, value) `     | Assert that the actual value not has a given header field and optional value are not present. |
|` hasHeaderJson() `                | Assert that the actual value has a JSON header (application/json). |
|` notHasHeaderJson() `             | Assert that the actual value not has a JSON header (application/json). |
|` hasHeaderHtml() `                | Assert that the actual value has a HTML header (text/html). |
|` notHasHeaderHtml() `             | Assert that the actual value not has a HTML header (text/html). |







