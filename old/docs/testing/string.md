# String

| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual string equality. |
|` isNot(expected) `                | Assert actual string to the negative equality. |
|` isIdenticalTo(expected) `        | Assert that the actual string is identical to (===) expected value. |
|` isNotIdenticalTo(expected) `     | Assert that the actual string is not identical to (!==) expected value. |
|` isEqualTo(expected) `            | Assert that the actual string is equal to (==) the expected value. |
|` isNotEqualTo(expected) `         | Assert that the actual string is not equal to (!=) the expected value. |
|` match(expected) `                | Assert actual string to match the expected value. |
|` notMatch(expected) `             | Assert actual string to not match the expected value. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` matchEach(expected) `            | Assert actual string to match each expected value. |
|` notMatchEach(expected) `         | Assert actual string to not match one or several expected value. |
|` isEmpty() `                      | Assert that the actual string is empty. |
|` isNotEmpty() `                   | Assert that the actual string is not empty. |
|` hasLength(expected) `            | Assert that the actual string has a length equal to expected number. |
|` hasNotLength(expected) `         | Assert that the actual string has not a length equal to expected number. |
|` hasValue(expected) `             | Assert that the actual tested string has expected value. |
|` notHasValue(expected) `          | Assert that the actual tested string not has expected value. |
|` hasValues(expected) `            | Assert that the actual tested string has several expected values passed in an array of expected values. |
|` notHasValues(expected) `         | Assert that the actual tested string not has several expected values passed in an array of expected values. |
|` contains(expected) `             | Assert that the actual string to contain something (===) to expected. |
|` notContains(expected) `          | Assert that the actual string to not contain something (!==) to expected. |
|` startsWith(str) `                | Assert that the actual string starts with str. |
|` notStartsWith(str) `             | Assert that the actual string not starts with str. |
|` endsWith(str) `                  | Assert that the actual string ends with str. |
|` notEndsWith(str) `               | Assert that the actual string not ends with str. |
