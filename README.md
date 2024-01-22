# Documentation for `index.js`

This file contains the function `PMPDInitDraggable`.

## `PMPDInitDraggable`

The `PMPDInitDraggable` function is used to initialize a draggable element. It returns an object with two methods: `destroy` and `onDropped`.

### `PMPDInitDraggable(element)`

This function is responsible for initializing a draggable element.

#### Parameters

- `element` (HTMLElement): The HTML element to make draggable.

#### Returns

- An object with two methods:
    - `destroy()`: Removes the mousedown event listener from the subject, effectively disabling the dragging functionality.
    - `onDropped(callback)`: Adds an event listener for the custom "pmpd-dropped" event. The callback function is called with the event's detail when the event is fired. This callback is triggered when a dragged element is dropped. (it will be appended to an element it was dropped over automatically)

#### Example

```javascript
const draggable = PMPDInitDraggable(document.getElementById("draggable"));
draggable.onDropped(function(data) {
    console.log("Dropped", data);
});

// or if you need to disable dragging

draggable.destroy();
```

This example shows how to make an element with the id "draggable" draggable. When the element is dropped, it logs "Dropped" and the event's detail to the console. The dragging functionality can be disabled by calling the `destroy` method.
