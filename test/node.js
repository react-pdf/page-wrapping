const node = (params) => ({
  x: params.x,
  y: params.y,
  width: params.width,
  height: params.height,
  break: params.break || false,
  fixed: params.fixed || false,
  wrap: params.wrap === undefined ? true : params.wrap,
  clone() {
    return node(this);
  }
});

export default node;
