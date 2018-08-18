# Array

Array Type:

```js
test.array([]).match([])
```

| function | description |
| --- | --- |
|`is(expected)`                   | Assert actual value equality by content and if possible, recursively. |
|`isNot(expected)`                | Assert actual value to the negative equality by content and if possible, recursively. |
|`isIdenticalTo(expected)`        | Assert that the actual value is identical to (===) expected value. |
|`isNotIdenticalTo(expected)`     | Assert that the actual value is not identical to (!==) expected value. |
|`isEqualTo(expected)`            | Assert that the actual value is equal to (==) the expected value. |
|`isNotEqualTo(expected)`         | Assert that the actual value is not equal to (!=) the expected value. |
|`match(expected)`                | Assert actual value to match the expected value. |
|`notMatch(expected)`             | Assert actual value to not match the expected value. |
|`isValid(expected)`              | Alias of match(). |
|`isNotValid(expected)`           | Alias of notMatch(). |
|`matchEach(expected)`            | Assert actual array to match each expected value. |
|`notMatchEach(expected)`         | Assert actual array to not match one or several expected value. |
|`isEmpty()`                      | Assert that the actual array is empty. Inherited keys also counted. |
|`isNotEmpty()`                   | Assert that the actual array is not empty. Inherited keys also counted. |
|`hasLength(expected)`            | Assert that the actual array has a length property equal to expected number. |
|`hasNotLength(expected)`         | Assert that the actual array has not a length property equal to expected number. |
|`isEnumerable(property)`         | Assert that the actual array has an enumerable property. |
|`isNotEnumerable(property)`      | Assert that the actual value has a non-enumerable property. |
|`hasProperty(property, value)`   | Assert that the actual tested array has property. Optionally assert it equals (===) to value argument. |
|`hasNotProperty(property, value)`  | Assert that the actual tested array has not a property. Optionally assert it not equals (!==) to value argument. |
|`hasKey(key, value)`             | Alias of hasProperty() |
|`notHasKey(key, value)`          | Alias of hasNotProperty() |
|`hasValue(expected)`             | Assert that the actual tested array has expected value. |
|`notHasValue(expected)`          | Assert that the actual tested array not has expected value. |
|`hasValues(expected)`            | Assert that the actual tested array has several expected values passed in an array of expected values. |
|`notHasValues(expected)`         | Assert that the actual tested array not has several expected values passed in an array of expected values. |
|`contains(expected)`             | Assert that the actual array to contain something (===) to expected within depth. |
|`notContains(expected)`          | Assert that the actual array to not contain something (!==) to expected within depth. |
|`isReverseOf(expected)`          | Assert that the actual tested array is the reverse to the expected array. An array is a reverse of another if they both have the same elements (including the same number of duplicates) regardless of their order. Elements are checked with strict equals (===). |
|`isNotReverseOf(expected)`       | Assert that the actual tested array is not the reverse to the expected array. An array is a reverse of another if they both have the same elements (including the same number of duplicates) regardless of their order. Elements are checked with strict equals (===). |
