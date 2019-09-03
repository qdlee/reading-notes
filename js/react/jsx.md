# JSX

## Embedding Expressions in JSX

- use curly braces `{}`
- can put any valid JavaScript expression inside the curly braces
- JSX is an expression too

## Specifying Attributes with JSX

- use double quotes to specify string literals
- use `{}` to specify other expressions
- JSX use `camelCase` property naming convention
- attributes default to `true`
- spread attributes `{...props}`

## Specifying Children with JSX

- between open and close tag
- string literals as children
- JSX elements as children
- JavaScript expressions as children
- functions as children
- booleans,null,and undefined are ignored, number `0` still be rendered

## Specifying The React Element Type

- `React` must be in scope
- JSX elements can be used by dot notation
- user-defined components must be capitalized
- if need chose the type at runtime, must use capitalized variable
