# page-wrapping
Generic page wrapping algorithm proposal.
Intended to be used in react-pdf in the near future

## How it works

```js
import wrap from 'page-wrapping';

// Create node instance.
// It can be whatever type of construction you want, but should always if support Node interface (see below).
const node = Node({ x: 20, y: 20, width: 100, height: 100 });

// Start page wrapping process.
// You should pass as first argument the page children (in this case only one node),
// and as second argument the page height used to wrap the elements.
wrap([node], 40);

// [
//   [{ x: 20, y: 20, width: 100, height: 20 }],
//   [{ x: 20, y: 0, width: 100, height: 40 }],
//   [{ x: 20, y: 0, width: 100, height: 40 }]
// ]
```

## Node interface

| Property        | Description                                           | Type     |
| --------------- | ----------------------------------------------------- | -------- |
| x               | Node x coordinate                                     | Number   |
| y               | Node y coordinate                                     | Number   |
| width           | Node width                                            | Number   |
| height          | Node height                                           | Number   |
| wrap            | Whether a node should be able to split in two or more | Boolean  |
| break           | Whether a node should create a page break             | Boolean  |
| fixed           | Whether a node should repeat throughout all pages     | Boolean  |
| clone           | Returns a copy of target node                         | Function |
| onNodeWrap      | Callback before element wrap                          | Function |
