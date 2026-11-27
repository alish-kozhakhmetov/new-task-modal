import { c as v, s as E, g as O, p as B, b as P, j as o, a as D, Q as h, M as Q, e as q, i as z, O as G, d as y, h as H, k as J } from "./index-wRluoD-s.js";
import { S as K } from "./shared-solution-description-U-K_8gp1.js";
import { S as L } from "./shared-solution-body-9WuuvhSD.js";
import { S as C } from "./solution-answer-panel-BnG30GAS.js";
const U = (x) => {
  const t = v.c(35), {
    task: N,
    deps: l,
    answer: S,
    solution: e
  } = x;
  let a, i, n;
  if (t[0] !== l || t[1] !== e) {
    let j;
    t[5] !== l ? (j = (F) => l.global.translateTasks(F), t[5] = l, t[6] = j) : j = t[6], a = E(O(e, j));
    let m;
    t[7] !== e ? (m = B(e), t[7] = e, t[8] = m) : m = t[8], i = m, n = P([a]), t[0] = l, t[1] = e, t[2] = a, t[3] = i, t[4] = n;
  } else
    a = t[2], i = t[3], n = t[4];
  const u = n;
  let d;
  t[9] !== l || t[10] !== N.title ? (d = /* @__PURE__ */ o.jsx(D, { title: N.title, deps: l }), t[9] = l, t[10] = N.title, t[11] = d) : d = t[11];
  const A = N;
  let r;
  t[12] !== l || t[13] !== A ? (r = /* @__PURE__ */ o.jsx(K, { task: A, deps: l }), t[12] = l, t[13] = A, t[14] = r) : r = t[14];
  let s;
  t[15] !== S || t[16] !== a || t[17] !== l || t[18] !== i || t[19] !== u ? (s = !i && /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsx(C, { userAnswer: S, correctAnswer: u, deps: l }),
    a && /* @__PURE__ */ o.jsx("div", { className: `${h.inputRow} ${h.solutionRow}`, children: /* @__PURE__ */ o.jsx(Q, { className: h.answerFormula, children: a }) })
  ] }), t[15] = S, t[16] = a, t[17] = l, t[18] = i, t[19] = u, t[20] = s) : s = t[20];
  let f;
  t[21] !== S || t[22] !== l || t[23] !== i || t[24] !== u ? (f = i && /* @__PURE__ */ o.jsx(C, { userAnswer: S, correctAnswer: u, deps: l }), t[21] = S, t[22] = l, t[23] = i, t[24] = u, t[25] = f) : f = t[25];
  let c;
  t[26] !== l || t[27] !== e ? (c = /* @__PURE__ */ o.jsx(L, { solution: e, deps: l }), t[26] = l, t[27] = e, t[28] = c) : c = t[28];
  let p;
  return t[29] !== d || t[30] !== r || t[31] !== s || t[32] !== f || t[33] !== c ? (p = /* @__PURE__ */ o.jsxs("div", { className: h.container, children: [
    d,
    r,
    s,
    f,
    c
  ] }), t[29] = d, t[30] = r, t[31] = s, t[32] = f, t[33] = c, t[34] = p) : p = t[34], p;
}, $ = (x, t) => x == null ? "" : z(x) ? t(x) : typeof x == "string" ? x : "", Z = ({
  id: x,
  withBefore: t = !1,
  withAfter: N = !1
}) => {
  const l = (S) => {
    const e = v.c(36), {
      task: a,
      deps: i,
      answer: n,
      onChange: u,
      mathInput: d
    } = S;
    if (q(a.solution)) {
      let g;
      return e[0] !== n || e[1] !== i || e[2] !== a ? (g = /* @__PURE__ */ o.jsx(U, { task: a, deps: i, answer: n, solution: a.solution }), e[0] = n, e[1] = i, e[2] = a, e[3] = g) : g = e[3], g;
    }
    let A;
    e[4] !== i ? (A = (g) => i.global.translateTasks(g), e[4] = i, e[5] = A) : A = e[5];
    const r = A, s = a.answerInput;
    let f;
    e[6] !== (s == null ? void 0 : s.before) || e[7] !== r ? (f = t ? $(s == null ? void 0 : s.before, r) : "", e[6] = s == null ? void 0 : s.before, e[7] = r, e[8] = f) : f = e[8];
    const c = f;
    let p;
    e[9] !== (s == null ? void 0 : s.after) || e[10] !== r ? (p = N ? $(s == null ? void 0 : s.after, r) : "", e[9] = s == null ? void 0 : s.after, e[10] = r, e[11] = p) : p = e[11];
    const j = p;
    let m;
    e[12] !== i || e[13] !== a.title ? (m = /* @__PURE__ */ o.jsx(D, { title: a.title, deps: i }), e[12] = i, e[13] = a.title, e[14] = m) : m = e[14];
    let F;
    e[15] !== i || e[16] !== a ? (F = /* @__PURE__ */ o.jsx(G, { task: a, deps: i }), e[15] = i, e[16] = a, e[17] = F) : F = e[17];
    let T;
    e[18] !== c ? (T = c && /* @__PURE__ */ o.jsx(y, { "data-testid": "text-prefix", className: h.prefix, value: c }), e[18] = c, e[19] = T) : T = e[19];
    let k;
    e[20] !== d ? (k = (g) => H(g, d), e[20] = d, e[21] = k) : k = e[21];
    let M;
    e[22] !== n || e[23] !== u || e[24] !== k ? (M = /* @__PURE__ */ o.jsx(J, { ref: k, formula: n, onMathFieldChanged: u, className: h.input }), e[22] = n, e[23] = u, e[24] = k, e[25] = M) : M = e[25];
    let b;
    e[26] !== j ? (b = j && /* @__PURE__ */ o.jsx(y, { "data-testid": "text-suffix", className: h.suffix, value: j }), e[26] = j, e[27] = b) : b = e[27];
    let R;
    e[28] !== F || e[29] !== T || e[30] !== M || e[31] !== b ? (R = /* @__PURE__ */ o.jsxs("div", { className: h.expressionRow, children: [
      F,
      T,
      M,
      b
    ] }), e[28] = F, e[29] = T, e[30] = M, e[31] = b, e[32] = R) : R = e[32];
    let w;
    return e[33] !== R || e[34] !== m ? (w = /* @__PURE__ */ o.jsxs("div", { className: h.container, "data-template-id": x, children: [
      m,
      R
    ] }), e[33] = R, e[34] = m, e[35] = w) : w = e[35], w;
  };
  return l.displayName = x, l;
};
export {
  Z as c
};
