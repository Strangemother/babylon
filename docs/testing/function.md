# Function


| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual function equality by content and if possible, recursively. |
|` isNot(expected) `                | Assert actual function to the negative equality by content and if possible, recursively. |
|` isIdenticalTo(expected) `        | Assert that the actual function is identical to (===) expected function. |
|` isNotIdenticalTo(expected) `     | Assert that the actual function is not identical to (!==) expected function. |
|` isEqualTo(expected) `            | Assert that the actual function is equal to (==) the expected function. |
|` isNotEqualTo(expected) `         | Assert that the actual function is not equal to (!=) the expected function. |
|` match(expected) `                | Assert actual function to match the expected function. |
|` notMatch(expected) `             | Assert actual function to not match the expected function. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` throws(constructor, expected) `  | Assert that the actual function (trigger function) throws. |
|` isError() `                      | Assert that the actual function (trigger function) throws an instance of Error (or inherited). |
|` hasName(expected) `              | Assert that the actual function has an expected name. |
