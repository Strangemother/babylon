# Number

### number

| function | description |
| --- | --- |
|` is(expected) `                   | Assert actual number equality. |
|` isNot(expected) `                | Assert actual number to the negative equality. |
|` isIdenticalTo(expected) `        | Assert that the actual number is identical to (===) expected number. |
|` isNotIdenticalTo(expected) `     | Assert that the actual number is not identical to (!==) expected number. |
|` isEqualTo(expected) `            | Assert that the actual number is equal to (==) the expected number. |
|` isNotEqualTo(expected) `         | Assert that the actual number is not equal to (!=) the expected number. |
|` match(expected) `                | Assert actual number to match the expected value. |
|` notMatch(expected) `             | Assert actual number to not match the expected value. |
|` isValid(expected) `              | Alias of match(). |
|` isNotValid(expected) `           | Alias of notMatch(). |
|` matchEach(expected) `            | Assert actual number to match each expected value. |
|` notMatchEach(expected) `         | Assert actual number to not match one or several expected value. |
|` isBetween(begin, end) `          | Assert that the actual number is between begin and end (inclusive). |
|` isNotBetween(begin, end) `       | Assert that the actual number is not between begin and end (inclusive). |
|` isBefore(expected) `             | Alias of isLessThan(). |
|` isAfter(expected) `              | Alias of isGreaterThan(). |
|` isLessThan(expected) `           | Assert that the actual number is lesser than the expected value. |
|` isGreaterThan(expected) `        | Assert that the actual number is greater than the expected value. |
|` isApprox(num, delta) `           | Assert that the actual number (floating point number) near num within delta margin. |
|` isInfinite() `                   | Assert that the actual number is infinite. |
|` isNotInfinite() `                | Assert that the actual number is not infinite. |
|` isNaN() `                        | Assert that the actual number is NaN. |
|` isNotNaN() `                     | Assert that the actual number is not NaN. |
