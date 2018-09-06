import node from './node';
import wrapPages from '../index';

describe('page-wrapping', () => {
  test('Wrap should return empty array if no nodes passed', () => {
    const result = wrapPages(null, 200);

    expect(result).toHaveLength(0);
  });

  test('Wrap should return copy of input node', () => {
    const input = node({ left: 0, top: 0, width: 100, height: 100 });
    const result = wrapPages(input, 200);

    expect(result[0]).not.toEqual(input);
  });

  test('Should not edit passed input', () => {
    const input = node({ left: 20, top: 20, width: 100, height: 100 });
    const result = wrapPages(input, 60);

    expect(input.left).toBe(20);
    expect(input.top).toBe(20);
    expect(input.width).toBe(100);
    expect(input.height).toBe(100);
  });

  test('Should wrap single object on bigger space', () => {
    const page = node({ left: 10, top: 10, width: 100, height: 100 });
    const result = wrapPages(page, 200);

    expect(result[0].left).toBe(10);
    expect(result[0].top).toBe(10);
    expect(result[0].width).toBe(100);
    expect(result[0].height).toBe(100);
  });

  test('Should wrap single object on smaller space', () => {
    const page = node({ left: 20, top: 20, width: 100, height: 100 });
    const result = wrapPages(page, 60);

    expect(result[0].left).toBe(20);
    expect(result[0].top).toBe(20);
    expect(result[0].width).toBe(100);
    expect(result[0].height).toBe(40);
    expect(result[1].left).toBe(20);
    expect(result[1].top).toBe(0);
    expect(result[1].width).toBe(100);
    expect(result[1].height).toBe(60);
  });

  test('Should wrap single object on smaller space in many pieces', () => {
    const page = node({ left: 20, top: 20, width: 100, height: 100 });
    const result = wrapPages(page, 40);

    expect(result).toHaveLength(3);
    expect(result[0].left).toBe(20);
    expect(result[0].top).toBe(20);
    expect(result[0].width).toBe(100);
    expect(result[0].height).toBe(20);
    expect(result[1].left).toBe(20);
    expect(result[1].top).toBe(0);
    expect(result[1].width).toBe(100);
    expect(result[1].height).toBe(40);
    expect(result[2].left).toBe(20);
    expect(result[2].top).toBe(0);
    expect(result[2].width).toBe(100);
    expect(result[2].height).toBe(40);
  });

  test('Should wrap many horizontal aligned object on bigger space', () => {
    const page = node({ left: 0, top: 0, width: 100, height: 100 });
    const child1 = node({ left: 0, top: 10, width: 50, height: 100 });
    const child2 = node({ left: 50, top: 10, width: 50, height: 100 });

    page.appendChild(child1);
    page.appendChild(child2);

    const result = wrapPages(page, 200);

    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children[0].left).toBe(0);
    expect(result[0].children[0].top).toBe(10);
    expect(result[0].children[0].width).toBe(50);
    expect(result[0].children[0].height).toBe(100);
    expect(result[0].children[1].left).toBe(50);
    expect(result[0].children[1].top).toBe(10);
    expect(result[0].children[1].width).toBe(50);
    expect(result[0].children[1].height).toBe(100);
  });

  test('Should wrap many horizontal aligned object on smaller space', () => {
    const page = node({ left: 0, top: 0, width: 100, height: 100 });
    const child1 = node({ left: 0, top: 10, width: 50, height: 100 });
    const child2 = node({ left: 50, top: 10, width: 50, height: 100 });

    page.appendChild(child1);
    page.appendChild(child2);

    const result = wrapPages(page, 70);

    expect(result).toHaveLength(2);
    expect(result[0].children[0].left).toBe(0);
    expect(result[0].children[0].top).toBe(10);
    expect(result[0].children[0].width).toBe(50);
    expect(result[0].children[0].height).toBe(60);
    expect(result[0].children[1].left).toBe(50);
    expect(result[0].children[1].top).toBe(10);
    expect(result[0].children[1].width).toBe(50);
    expect(result[0].children[1].height).toBe(60);
    expect(result[1].children[0].left).toBe(0);
    expect(result[1].children[0].top).toBe(0);
    expect(result[1].children[0].width).toBe(50);
    expect(result[1].children[0].height).toBe(40);
    expect(result[1].children[1].left).toBe(50);
    expect(result[1].children[1].top).toBe(0);
    expect(result[1].children[1].width).toBe(50);
    expect(result[1].children[1].height).toBe(40);
  });

  test('Should break element', () => {
    const parent = node({ left: 0, top: 0, width: 100, height: 120 });
    const child1 = node({ left: 0, top: 10, width: 100, height: 50 });
    const child2 = node({ left: 0, top: 60, width: 100, height: 20, break: true });
    const child3 = node({ left: 0, top: 80, width: 100, height: 40 });

    parent.appendChild(child1);
    parent.appendChild(child2);
    parent.appendChild(child3);

    const result = wrapPages(parent, 70);

    expect(result).toHaveLength(2);

    expect(result[0].left).toBe(0);
    expect(result[0].top).toBe(0);
    expect(result[0].width).toBe(100);
    expect(result[0].height).toBe(70);
    expect(result[0].children).toHaveLength(1);

    expect(result[1].left).toBe(0);
    expect(result[1].top).toBe(0);
    expect(result[1].width).toBe(100);
    expect(result[1].height).toBe(50);

  });

  test('Should ignore wrap flag if element should not split', () => {
    const page = node({ left: 10, top: 10, width: 100, height: 100, wrap: false });
    const result = wrapPages(page, 200);

    expect(result[0].left).toBe(10);
    expect(result[0].top).toBe(10);
    expect(result[0].width).toBe(100);
    expect(result[0].height).toBe(100);
  });

  test('Should not wrap element with flag as false', () => {
    const page = node({ left: 0, top: 0, width: 110, height: 150 });
    const child1 = node({ left: 10, top: 10, width: 100, height: 70 });
    const child2 = node({ left: 10, top: 80, width: 100, height: 70, wrap: false });

    page.appendChild(child1);
    page.appendChild(child2);

    const result = wrapPages(page, 100);

    expect(result).toHaveLength(2);
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].left).toBe(10);
    expect(result[0].children[0].top).toBe(10);
    expect(result[0].children[0].width).toBe(100);
    expect(result[0].children[0].height).toBe(70);
    expect(result[1].children).toHaveLength(1);
    expect(result[1].children[0].left).toBe(10);
    expect(result[1].children[0].top).toBe(0);
    expect(result[1].children[0].width).toBe(100);
    expect(result[1].children[0].height).toBe(70);
  });

  test('Should repeat fixed elements in all pages', () => {
    const page = node({ left: 0, top: 0, width: 110, height: 120 });
    const child1 = node({ left: 10, top: 10, width: 100, height: 10, fixed: true });
    const child2 = node({ left: 10, top: 20, width: 100, height: 120 });

    page.appendChild(child1);
    page.appendChild(child2);

    const result = wrapPages(page, 60);

    expect(result).toHaveLength(2);
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children[0].left).toBe(10);
    expect(result[0].children[0].top).toBe(10);
    expect(result[0].children[0].width).toBe(100);
    expect(result[0].children[0].height).toBe(10);
    expect(result[0].children[0].fixed).toBe(true);
    expect(result[1].children).toHaveLength(2);
    expect(result[1].children[0].left).toBe(10);
    expect(result[1].children[0].top).toBe(10);
    expect(result[1].children[0].width).toBe(100);
    expect(result[1].children[0].height).toBe(10);
    expect(result[1].children[0].fixed).toBe(true);
  });

  test('Should call onNodeWrap on node if passed', () => {
    const onNodeWrap = jest.fn();

    const page = node({ left: 0, top: 0, width: 110, height: 60, onNodeWrap});
    const child1 = node({ left: 10, top: 10, width: 100, height: 10 });
    const child2 = node({ left: 10, top: 20, width: 100, height: 40 });

    page.appendChild(child1);
    page.appendChild(child2);

    const result = wrapPages(page, 60);

    expect(onNodeWrap.mock.calls.length).toBe(1);
  });

  test('Should call onNodeWrap one time per output page', () => {
    const onNodeWrap = jest.fn();

    const page = node({ left: 10, top: 10, width: 100, height: 200, onNodeWrap });
    const result = wrapPages(page, 60);

    expect(onNodeWrap.mock.calls.length).toBe(4);
  });

  test('Should break element if not enough space ahead', () => {
    const page = node({ left: 0, top: 0, width: 110, height: 80 });
    const child1 = node({ left: 10, top: 0, width: 100, height: 10 });
    const child2 = node({ left: 10, top: 10, width: 100, height: 30, minPresenceAhead: 30 });
    const child3 = node({ left: 10, top: 40, width: 100, height: 40 });

    page.appendChild(child1);
    page.appendChild(child2);
    page.appendChild(child3);

    const result = wrapPages(page, 60);

    expect(result).toHaveLength(2);
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].left).toBe(10);
    expect(result[0].children[0].top).toBe(0);
    expect(result[0].children[0].width).toBe(100);
    expect(result[0].children[0].height).toBe(10);
    expect(result[1].children).toHaveLength(2);
    expect(result[1].children[0].left).toBe(10);
    expect(result[1].children[0].top).toBe(0);
    expect(result[1].children[0].width).toBe(100);
    expect(result[1].children[0].height).toBe(30);
  });

  test('Should wrap nested object on bigger space', () => {
    const page = node({ left: 0, top: 0, width: 100, height: 110 });
    const parent = node({ left: 10, top: 10, width: 100, height: 100 });
    const child = node({ left: 10, top: 0, width: 100, height: 70 });

    page.appendChild(parent);
    parent.appendChild(child);

    const result = wrapPages(page, 200);

    expect(result).toHaveLength(1);
    expect(result[0].children[0].children).toHaveLength(1);
    expect(result[0].children[0].left).toBe(10);
    expect(result[0].children[0].top).toBe(10);
    expect(result[0].children[0].width).toBe(100);
    expect(result[0].children[0].height).toBe(100);
    expect(result[0].children[0].children[0].left).toBe(10);
    expect(result[0].children[0].children[0].top).toBe(0);
    expect(result[0].children[0].children[0].width).toBe(100);
    expect(result[0].children[0].children[0].height).toBe(70);
  });

  test('Should wrap single object on smaller space', () => {
    const page = node({ left: 0, top: 0, width: 100, height: 110 });
    const parent = node({ left: 10, top: 10, width: 100, height: 100 });
    const child = node({ left: 10, top: 0, width: 100, height: 70 });

    page.appendChild(parent);
    parent.appendChild(child);

    const result = wrapPages(page, 70);

    expect(result).toHaveLength(2);
    expect(result[0].children[0].left).toBe(10);
    expect(result[0].children[0].top).toBe(10);
    expect(result[0].children[0].width).toBe(100);
    expect(result[0].children[0].height).toBe(60);
    expect(result[0].children[0].children[0].left).toBe(10);
    expect(result[0].children[0].children[0].top).toBe(0);
    expect(result[0].children[0].children[0].width).toBe(100);
    expect(result[0].children[0].children[0].height).toBe(60);
    expect(result[1].children[0].left).toBe(10);
    expect(result[1].children[0].top).toBe(0);
    expect(result[1].children[0].width).toBe(100);
    expect(result[1].children[0].height).toBe(40);
    expect(result[1].children[0].children[0].left).toBe(10);
    expect(result[1].children[0].children[0].top).toBe(0);
    expect(result[1].children[0].children[0].width).toBe(100);
    expect(result[1].children[0].children[0].height).toBe(10);
  });
});
