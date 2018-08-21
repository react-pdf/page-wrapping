// Default presence ahead function. Used when node does not provides one.
const defaultPresenceAhead = element => height => Math.min(element.height, height);

// Calculates the presence ahead or an array of nodes, given the available height.
const getPresenceAhead = (elements, height) => {
  let result = 0;

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    const isElementInside = height > element.y;
    const presenceAhead = element.presenceAhead || defaultPresenceAhead(element);

    if (element && isElementInside) {
      result += presenceAhead(height - element.y);
    }
  }

  return result;
}

// Wrap nodes tree in equal sized subpages
const wrap = (nodes = [], height) => {
  const elements = Array.isArray(nodes) ? nodes : [nodes];
  const nonFixedElements = elements.filter(element => element && !element.fixed);

  // Fixed elements should repeat throughout all pages, so we filter them
  // in order to know if we should prevent nodes tree to wrap.
  if (nonFixedElements.length === 0) return [];

  // Keep track of this and future pages elements
  const currentPage = [];
  const nextPageElements = [];

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i].clone();
    const futureElements = elements.slice(i + 1);
    const isElementOutside = height < element.y;
    const elementShouldSplit = height < element.y + element.height;
    let elementShouldBreak = element.break || (!element.wrap && elementShouldSplit);

    if (element.onNodeWrap) element.onNodeWrap();

    // If element is fixed, we add it both to the current page
    // and to all future pages to come.
    if (element.fixed) {
      currentPage.push(element);
      nextPageElements.push(element);
      continue;
    }

    // If current element is outside wrapping zone, we ignore it completely.
    // Just substract page height so next time will be upper in the page's layout.
    if (isElementOutside) {
      element.y -= height;
      nextPageElements.push(element);
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
      futureElements.forEach(e => e.y -= element.y);

      element.y = 0;
      element.break = false;

      nextPageElements.push(element, ...futureElements);
      break;
    }

    // Element is between to pages and needs to be splitted.
    // We clone the original one adjusting his dimensions, and send the
    // remaining section to be rendered on next page
    if (elementShouldSplit) {
      const clone = element.clone();
      const remainingHeight = height - element.y;

      element.y = 0;
      clone.height = remainingHeight;
      element.height = element.height - remainingHeight;

      currentPage.push(clone);
      nextPageElements.push(element);
      continue;
    }

    // Elements suits perfectly inside subpage, and is added is it is.
    currentPage.push(element);
  }

  // Recursively wrap all pages until all elements are covered
  return [currentPage, ...wrap(nextPageElements, height)];
}

export default wrap;
