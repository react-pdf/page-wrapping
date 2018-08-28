import node from './node';
import wrapPages, { moveNodes } from '../index';

describe('page-wrapping', () => {
  test('Wrap should return empty array if no nodes passed', () => {
    const result = wrapPages(null, 200);

    expect(result).toHaveLength(0);
  });

  test('Wrap should return empty array if empty nodes passed', () => {
    const result = wrapPages([], 200);

    expect(result).toHaveLength(0);
  });

  test('Wrap should return copy of input node', () => {
    const input = node({ x: 0, y: 0, width: 100, height: 100 });
    const result = wrapPages(input, 200);

    expect(result[0][0]).not.toEqual(input);
  });

  test('Should not edit passed input', () => {
    const input = node({ x: 20, y: 20, width: 100, height: 100 });
    const result = wrapPages(input, 60);

    expect(input.x).toBe(20);
    expect(input.y).toBe(20);
    expect(input.width).toBe(100);
    expect(input.height).toBe(100);
  });

  test('Should wrap single object on bigger space', () => {
    const result = wrapPages(node({ x: 10, y: 10, width: 100, height: 100 }), 200);

    expect(result[0][0].x).toBe(10);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(100);
  });

  test('Should wrap single object on smaller space', () => {
    const result = wrapPages(node({ x: 20, y: 20, width: 100, height: 100 }), 60);

    expect(result[0][0].x).toBe(20);
    expect(result[0][0].y).toBe(20);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(40);
    expect(result[1][0].x).toBe(20);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(60);
  });

  test('Should wrap single object on smaller space in many pieces', () => {
    const result = wrapPages(node({ x: 20, y: 20, width: 100, height: 100 }), 40);

    expect(result).toHaveLength(3);
    expect(result[0][0].x).toBe(20);
    expect(result[0][0].y).toBe(20);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(20);
    expect(result[1][0].x).toBe(20);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(40);
    expect(result[2][0].x).toBe(20);
    expect(result[2][0].y).toBe(0);
    expect(result[2][0].width).toBe(100);
    expect(result[2][0].height).toBe(40);
  });

  test('Should wrap single object outside first page', () => {
    const result = wrapPages(node({ x: 20, y: 80, width: 100, height: 10 }), 60);

    expect(result[0]).toHaveLength(0);
    expect(result[1][0].x).toBe(20);
    expect(result[1][0].y).toBe(20);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(10);
  });

  test('Should wrap many horizontal aligned object on bigger space', () => {
    const result = wrapPages([
      node({ x: 0, y: 10, width: 50, height: 100 }),
      node({ x: 50, y: 10, width: 50, height: 100 })
    ], 200);

    expect(result[0][0].x).toBe(0);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(50);
    expect(result[0][0].height).toBe(100);
    expect(result[0][1].x).toBe(50);
    expect(result[0][1].y).toBe(10);
    expect(result[0][1].width).toBe(50);
    expect(result[0][1].height).toBe(100);
  });

  test('Should wrap many horizontal aligned object on smaller space', () => {
    const result = wrapPages([
      node({ x: 0, y: 10, width: 50, height: 100 }),
      node({ x: 50, y: 10, width: 50, height: 100 })
    ], 70);

    expect(result[0][0].x).toBe(0);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(50);
    expect(result[0][0].height).toBe(60);
    expect(result[0][1].x).toBe(50);
    expect(result[0][1].y).toBe(10);
    expect(result[0][1].width).toBe(50);
    expect(result[0][1].height).toBe(60);
    expect(result[1][0].x).toBe(0);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(50);
    expect(result[1][0].height).toBe(40);
    expect(result[1][1].x).toBe(50);
    expect(result[1][1].y).toBe(0);
    expect(result[1][1].width).toBe(50);
    expect(result[1][1].height).toBe(40);
  });

  test('Should break element on its own', () => {
    const result = wrapPages(node({ x: 0, y: 10, width: 50, height: 50, break: true }), 70);

    expect(result[0]).toHaveLength(0);
    expect(result[1][0].x).toBe(0);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(50);
    expect(result[1][0].height).toBe(50);
  });

  test('Should break element with others', () => {
    const result = wrapPages([
      node({ x: 0, y: 10, width: 100, height: 50 }),
      node({ x: 0, y: 60, width: 100, height: 20, break: true }),
      node({ x: 0, y: 80, width: 100, height: 40 })
    ], 70);

    expect(result[0]).toHaveLength(1);
    expect(result[0][0].x).toBe(0);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(50);
    expect(result[1]).toHaveLength(2);
    expect(result[1][0].x).toBe(0);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(20);
    expect(result[1][1].x).toBe(0);
    expect(result[1][1].y).toBe(20);
    expect(result[1][1].width).toBe(100);
    expect(result[1][1].height).toBe(40);
  });

  test('Should ignore wrap flag if element should not split', () => {
    const result = wrapPages(node({ x: 10, y: 10, width: 100, height: 100, wrap: false }), 200);

    expect(result[0][0].x).toBe(10);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(100);
  });

  test('Should not wrap element with flag as false', () => {
    const result = wrapPages([
      node({ x: 10, y: 10, width: 100, height: 70 }),
      node({ x: 10, y: 80, width: 100, height: 70, wrap: false }),
    ], 100);

    expect(result[0]).toHaveLength(1);
    expect(result[0][0].x).toBe(10);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(70);
    expect(result[1]).toHaveLength(1);
    expect(result[1][0].x).toBe(10);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(70);
  });

  test('Should repeat fixed elements in all pages', () => {
    const result = wrapPages([
      node({ x: 10, y: 10, width: 100, height: 10, fixed: true }),
      node({ x: 10, y: 20, width: 100, height: 130 }),
    ], 60);

    expect(result[0]).toHaveLength(2);
    expect(result[0][0].x).toBe(10);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(10);
    expect(result[0][0].fixed).toBe(true);
    expect(result[1]).toHaveLength(2);
    expect(result[1][0].x).toBe(10);
    expect(result[1][0].y).toBe(10);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(10);
    expect(result[1][0].fixed).toBe(true);
  });

  test('Should call onNodeWrap on node if passed', () => {
    const onNodeWrap = jest.fn();
    const result = wrapPages([
      node({ x: 10, y: 10, width: 100, height: 10 }),
      node({ x: 10, y: 20, width: 100, height: 40, onNodeWrap }),
    ], 60);

    expect(onNodeWrap.mock.calls.length).toBe(1);
  });

  test('Should call onNodeWrap one time per output page', () => {
    const onNodeWrap = jest.fn();
    const result = wrapPages([
      node({ x: 10, y: 10, width: 100, height: 200, onNodeWrap }),
    ], 60);

    expect(onNodeWrap.mock.calls.length).toBe(4);
  });

  test('Should break element if not enough space ahead', () => {
    const result = wrapPages([
      node({ x: 10, y: 0, width: 100, height: 10 }),
      node({ x: 10, y: 10, width: 100, height: 30, minPresenceAhead: 30 }),
      node({ x: 10, y: 40, width: 100, height: 40 }),
    ], 60);

    expect(result[0]).toHaveLength(1);
    expect(result[0][0].x).toBe(10);
    expect(result[0][0].y).toBe(0);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(10);
    expect(result[1]).toHaveLength(2);
    expect(result[1][0].x).toBe(10);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(30);
    expect(result[1][1].x).toBe(10);
    expect(result[1][1].y).toBe(30);
    expect(result[1][1].width).toBe(100);
    expect(result[1][1].height).toBe(30);
  });

  test('Should wrap nested object on bigger space', () => {
    const result = wrapPages(
      node({ x: 10, y: 10, width: 100, height: 100, children: [
        node({ x: 10, y: 10, width: 100, height: 50 })
      ]})
    , 200);

    expect(result[0][0].children).toHaveLength(1);
    expect(result[0][0].x).toBe(10);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(100);
    expect(result[0][0].children[0].x).toBe(10);
    expect(result[0][0].children[0].y).toBe(10);
    expect(result[0][0].children[0].width).toBe(100);
    expect(result[0][0].children[0].height).toBe(50);
  });

  test('Should wrap single object on smaller space', () => {
    const result = wrapPages(
      node({ x: 10, y: 10, width: 100, height: 100, children: [
        node({ x: 10, y: 10, width: 100, height: 70 })
      ]})
    , 70);

    expect(result[0][0].x).toBe(10);
    expect(result[0][0].y).toBe(10);
    expect(result[0][0].width).toBe(100);
    expect(result[0][0].height).toBe(60);
    expect(result[0][0].children[0].x).toBe(10);
    expect(result[0][0].children[0].y).toBe(10);
    expect(result[0][0].children[0].width).toBe(100);
    expect(result[0][0].children[0].height).toBe(60);
    expect(result[1][0].x).toBe(10);
    expect(result[1][0].y).toBe(0);
    expect(result[1][0].width).toBe(100);
    expect(result[1][0].height).toBe(40);
    expect(result[1][0].children[0].x).toBe(10);
    expect(result[1][0].children[0].y).toBe(0);
    expect(result[1][0].children[0].width).toBe(100);
    expect(result[1][0].children[0].height).toBe(10);
  });

  test('Should move nodes up', () => {
    const input = node({ x: 10, y: 40, width: 100, height: 100, children: [
      node({ x: 10, y: 50, width: 100, height: 50 })
    ]});

    moveNodes(input, -30);

    expect(input.y).toBe(10);
    expect(input.children[0].y).toBe(20);
  });
});
