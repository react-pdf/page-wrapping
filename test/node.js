const node = (params) => ({
  x: params.x,
  y: params.y,
  width: params.width,
  height: params.height,
  break: params.break || false,
  fixed: params.fixed || false,
  children: params.children || [],
  onNodeWrap: params.onNodeWrap || null,
  minPresenceAhead: params.minPresenceAhead || null,
  wrap: params.wrap === undefined ? true : params.wrap,
  clone() {
    const clone = node(this);
    clone.children = clone.children.map(c => c.clone());
    return clone;
  }
});

export default node;
