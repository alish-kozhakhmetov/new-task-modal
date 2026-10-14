const l = (e) => new RegExp("\\p{L}{2,}", "u").test(e) && !/[\d=+×·*<>\\]/.test(e), r = (e, n, s) => {
  const t = s.filter(Boolean);
  return e !== "inline" && n && t.length > 0 && t.every((o) => l(String(o)));
};
export {
  r as h
};
