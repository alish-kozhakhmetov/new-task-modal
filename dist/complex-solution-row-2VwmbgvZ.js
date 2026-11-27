import { c, W as e, j as u } from "./index-wRluoD-s.js";
import { u as a } from "./solution-answer-panel-BnG30GAS.js";
const r = (n, t) => Array.from(n.children).find((o) => o.classList.contains(t)), l = (n) => {
  const t = r(n, e.answerFormula), o = r(n, e.suffix);
  return !t || !o ? !1 : o.getBoundingClientRect().top >= t.getBoundingClientRect().bottom - 1;
}, d = (n) => {
  const t = c.c(3), {
    children: o
  } = n, i = a("data-unit-down", l);
  let s;
  return t[0] !== o || t[1] !== i ? (s = /* @__PURE__ */ u.jsx("div", { ref: i, className: `${e.inputRow} ${e.solutionRow}`, children: o }), t[0] = o, t[1] = i, t[2] = s) : s = t[2], s;
};
export {
  d as C
};
