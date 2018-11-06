# page-wrapping

[![npm](https://img.shields.io/npm/v/page-wrapping.svg)](https://www.npmjs.com/package/page-wrapping)
[![Travis](https://img.shields.io/travis/react-pdf/page-wrapping.svg)](https://travis-ci.org/react-pdf/page-wrapping)

Generic page wrapping algorithm proposal.

## How it works

```js
import wrapPage from 'page-wrapping'

// Create node instance.
// It can be whatever type of construction you want, but should always if support Node interface (see below).
const node = Node({ left: 20, top: 20, width: 100, height: 100 })

// Start page wrapping process.
// You should pass as first argument the page children (in this case only one node),
// and as second argument the page height used to wrap the elements.
await wrapPage([node], 40)

// [
//   { left: 20, top: 20, width: 100, height: 20 },
//   { left: 20, top: 0, width: 100, height: 40 },
//   { left: 20, top: 0, width: 100, height: 40 }
// ]
```

## Node interface

| Property         | Description                                           | Type        |
| ---------------- | ----------------------------------------------------- | ----------- |
| left             | Node x coordinate                                     | Number      |
| top              | Node y coordinate                                     | Number      |
| width            | Node width                                            | Number      |
| height           | Node height                                           | Number      |
| minPresenceAhead | Presence ahead of element to not to break             | Number      |
| wrap             | Whether a node should be able to split in two or more | Boolean     |
| break            | Whether a node should create a page break             | Boolean     |
| fixed            | Whether a node should repeat throughout all pages     | Boolean     |
| parent           | Node pointer to parent                                | Node        |
| children         | Children nodes                                        | Array<Node> |
| appendChild      | Add node as children                                  | Function    |
| remove           | Detach node from paren                                | Function    |
| clone            | Returns a copy of target node                         | Function    |
| nodeWillWrap     | Callback before element wrap. Can return promise      | Function    |
| onNodeSplit      | Callback after element is split in two                | Function    |
| isEmpty          | Returns if node is empty or not                       | Function    |
