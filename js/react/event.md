# Handling Events

- React events are named using camelCase
- With JSX you pass a function as the event handler
- You cannot return `false` to prevent default behavior
  
## Naming Conventions

- event name `on[event]`
- event handler `handle[event]`

## Bind `this`

- in constructor
- use public class fields syntax
- use arrow function

**If arrow function is passed as prop to lower components, those components might do an extra re-rendering**

## Passing Arguments to Event Handlers

```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

## Event Pooling

- The `SyntheticEvent` object will be reused
- All properties will be nullified after the event callback has been invoked
- You cannot access the event in as asynchronous way
- Call `event.persist()` on the event, then you can access the event properties in an asynchronous way

## Capture phrase

- use `on[event]Capture`
