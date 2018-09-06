// Default presence ahead function. Used when node does not provides one.
const defaultPresenceAhead = element => height => Math.min(element.height, height);

// Calculates the presence ahead or an array of nodes, given the available height.
const getPresenceAhead = (elements, height) => {
  let result = 0;

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    const isElementInside = height > element.top;
    const presenceAhead = element.presenceAhead || defaultPresenceAhead(element);

    if (element && isElementInside) {
      result += presenceAhead(height - element.top);
    }
  }

  return result;
}

// Clone element recursively including children
const cloneRecursively = (node) => {
  const clone = node.clone();

  if (node.children && node.children.length > 0) {
    node.children.forEach(child => clone.appendChild(cloneRecursively(child)));
  }

  return clone;
}

// Wrap nodes tree in fixed height page, and returns exceedings separately.
export const wrap = (nodes, height) => {
  const currentPage = [];
  const nextPageElements = [];
  const elementsToBeRemoved = [];

  // Transform nodes into an array
  const elements = Array.isArray(nodes) ? nodes : [nodes];

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];

    if (element.onNodeWrap) element.onNodeWrap();

    const futureElements = elements.slice(i + 1);
    const isElementOutside = height <= element.top;
    const elementShouldSplit = height < element.top + element.height;
    let elementShouldBreak = element.break || (!element.wrap && elementShouldSplit);

    // If element is fixed, we add it both to the current page
    // and to all future pages to come.
    if (element.fixed) {
      nextPageElements.push(cloneRecursively(element));
      continue;
    }

    // If current element is outside wrapping zone, we ignore it completely.
    // Just substract page height so next time will be upper in the page's layout.
    if (isElementOutside) {
      nextPageElements.push(cloneRecursively(element));
      elementsToBeRemoved.push(element);
      continue;
    }

    // Checks if element has more than the minimun presence ahead on that page.
    // If not, we break the page in this element.
    if (element.minPresenceAhead) {
      const presenceAhead = getPresenceAhead(futureElements, height);
      if (presenceAhead < element.minPresenceAhead) elementShouldBreak = true;
    }

    // Element can break based on many conditions: if has the break flag,
    // if has the wrap flag as false and should be splitted or didn't have enough
    // presence ahead. Either way, the element get's relocated on the next page,
    // as well as all other next elements.
    if (elementShouldBreak) {
      const clone = cloneRecursively(element);
      const newFutureElements = futureElements.map(element => cloneRecursively(element));

      clone.top = 0;
      element.break = false;

      nextPageElements.push(clone, ...newFutureElements);
      elementsToBeRemoved.push(element, ...futureElements);
      break;
    }

    // Element is between to pages and needs to be splitted.
    // We clone the original one adjusting his dimensions, and send the
    // remaining section to be rendered on next page
    if (elementShouldSplit) {
      const clone = element.clone();
      const remainingHeight = height - element.top;

      if (element.children && element.children.length > 0) {
        const wrappedChildren = wrap(element.children, remainingHeight);
        wrappedChildren[1].forEach(child => clone.appendChild(child));
      }

      element.onNodeSplit ? element.onNodeSplit(height, clone) : {};

      clone.top = 0;
      clone.height -= remainingHeight;
      element.height = remainingHeight;

      currentPage.push(element);
      nextPageElements.push(clone);

      continue;
    }

    // Elements suits perfectly inside subpage, and is added is it is.
    currentPage.push(element);
  }

  // Remove elements that didn't fit inside page
  // We do this here to not interfer with upper elements iteration
  elementsToBeRemoved.forEach(element => element.remove());

  return [currentPage, nextPageElements];
}

// Wrap nodes tree in equal sized subpages
const wrapPages = (nodes, height) => {
  const [currentPage, nextPageElements] = wrap(nodes, height);
  const nonFixedElements = nextPageElements.filter(element => element && !element.fixed);

  // Fixed elements should repeat throughout all pages, so we filter them
  // in order to know if we should prevent nodes tree to wrap.
  if (nonFixedElements.length === 0) return currentPage;

  return [...currentPage, ...wrapPages(nextPageElements, height)];
}

const wrapPage = (page, height) => {
  if (!page) return [];
  return wrapPages(cloneRecursively(page), height);
}

export default wrapPage;
