const node = (params) => ({
  x: params.x,
  y: params.y,
  width: params.width,
  height: params.height,
  break: params.break || false,
  clone() {
    return node(this);
  }
});

export default node;
