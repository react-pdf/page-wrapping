const node = (params) => ({
  x: params.x,
  y: params.y,
  width: params.width,
  height: params.height,
  wrap: params.wrap === undefined ? true : params.wrap,
  break: params.break || false,
  clone() {
    return node(this);
  }
});

export default node;
