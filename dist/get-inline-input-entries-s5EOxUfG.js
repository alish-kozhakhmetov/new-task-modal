const i = (t, r) => typeof t == "string" || t && typeof t == "object" ? r(t) : "", s = (t, r) => {
  const o = t.answerInput;
  return o ? Object.entries(o).filter(([e]) => e.startsWith("input")).sort(([e], [n]) => e.localeCompare(n)).map(([e, n]) => {
    const f = n;
    return {
      key: e,
      before: i(f.before, r),
      after: i(f.after, r)
    };
  }) : [];
};
export {
  s as g
};
