import { a2 as E, i as b, a3 as R, a4 as S, c as N, e as v, j as c, A as D, a as H, Y as z, Z as K, _ as L } from "./index-wRluoD-s.js";
import { A as O } from "./answer-cell-solution-BNYRXyPE.js";
const Y = "answercell", Z = (l, f) => {
  const n = E(l != null ? l : {}).content, u = typeof n == "string" ? n : b(n) ? f(n) : "", {
    parts: C
  } = R(S(u).split(Y));
  return Math.max(0, C.length - 1);
}, q = ({
  id: l,
  layout: f,
  inputCount: x,
  withBefore: n = !1,
  withAfter: u = !1,
  cellInputClassName: C
}) => {
  const I = (M) => {
    const t = N.c(29), {
      task: e,
      deps: s,
      answer: a,
      onChange: g,
      mathInput: T
    } = M;
    if (v(e.solution)) {
      let p;
      return t[0] !== a || t[1] !== s || t[2] !== e ? (p = /* @__PURE__ */ c.jsx(O, { task: e, deps: s, answer: a, solution: e.solution, withBefore: n, withAfter: u, multi: !0 }), t[0] = a, t[1] = s, t[2] = e, t[3] = p) : p = t[3], p;
    }
    const h = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let m;
    t[4] !== s.global ? (m = (p) => s.global.translateTasks(p), t[4] = s.global, t[5] = m) : m = t[5];
    const k = Z(e.description, m), y = k > 0 ? Math.min(k, x) : x;
    let d;
    t[6] !== T || t[7] !== g || t[8] !== h || t[9] !== y ? (d = D({
      onChange: g,
      separator: h,
      mathInput: T,
      inputCount: y
    }), t[6] = T, t[7] = g, t[8] = h, t[9] = y, t[10] = d) : d = t[10];
    const {
      bindRef: A,
      handleChange: j
    } = d;
    let i;
    t[11] !== s || t[12] !== e.title ? (i = /* @__PURE__ */ c.jsx(H, { title: e.title, deps: s }), t[11] = s, t[12] = e.title, t[13] = i) : i = t[13];
    let o;
    t[14] !== s || t[15] !== e.description ? (o = /* @__PURE__ */ c.jsx(z, { description: e.description, deps: s }), t[14] = s, t[15] = e.description, t[16] = o) : o = t[16];
    let r;
    t[17] !== a || t[18] !== A || t[19] !== s || t[20] !== j || t[21] !== e.answerInput || t[22] !== e.description || t[23] !== e.type ? (r = /* @__PURE__ */ c.jsx(K, { description: e.description, answerInput: e.answerInput, deps: s, answer: a, mode: "input", withBefore: n, withAfter: u, multi: !0, bindRef: A, onChange: j, taskType: e.type, cellInputClassName: C }), t[17] = a, t[18] = A, t[19] = s, t[20] = j, t[21] = e.answerInput, t[22] = e.description, t[23] = e.type, t[24] = r) : r = t[24];
    let w;
    return t[25] !== i || t[26] !== o || t[27] !== r ? (w = /* @__PURE__ */ c.jsxs("div", { className: L.container, "data-template-id": l, "data-layout": f, children: [
      i,
      o,
      r
    ] }), t[25] = i, t[26] = o, t[27] = r, t[28] = w) : w = t[28], w;
  };
  return I.displayName = l, I;
};
export {
  q as c
};
