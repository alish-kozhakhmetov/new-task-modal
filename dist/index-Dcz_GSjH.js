import { c as N, s as k, g as R, t as b, b as y, q as B, A as $, B as q, D as E, j as l, a as T, L as I, E as M, F as v, M as P, e as L, h as z, k as G } from "./index-y5-JRyys.js";
import { S as F, a as H } from "./solution-answer-panel-DWkZlDnj.js";
const J = (h) => {
  const e = N.c(42), {
    task: m,
    deps: t,
    answer: n,
    solution: s
  } = h;
  let i, p, r, o, d;
  if (e[0] !== t || e[1] !== s || e[2] !== m) {
    let C;
    e[8] !== t ? (C = (O) => t.global.translateTasks(O), e[8] = t, e[9] = C) : C = e[9], i = k(R(s, C));
    let S;
    e[10] !== s ? (S = b(s), e[10] = s, e[11] = S) : S = e[11], r = S, o = y([i]);
    const A = B(m, t);
    p = !!(A && $(A));
    const g = p && A ? q(A, {
      quotient: i || void 0
    }) : null;
    d = g ? E(g) : null, e[0] = t, e[1] = s, e[2] = m, e[3] = i, e[4] = p, e[5] = r, e[6] = o, e[7] = d;
  } else
    i = e[3], p = e[4], r = e[5], o = e[6], d = e[7];
  const a = d;
  let c;
  e[12] !== t || e[13] !== m.title ? (c = /* @__PURE__ */ l.jsx(T, { title: m.title, deps: t }), e[12] = t, e[13] = m.title, e[14] = c) : c = e[14];
  let f;
  e[15] !== i || e[16] !== t || e[17] !== a || e[18] !== m ? (f = a ? /* @__PURE__ */ l.jsx(I, { dividend: a.dividend, divisor: a.divisor }) : /* @__PURE__ */ l.jsx(M, { task: m, deps: t, quotient: i || void 0 }), e[15] = i, e[16] = t, e[17] = a, e[18] = m, e[19] = f) : f = e[19];
  let u;
  e[20] !== n || e[21] !== i || e[22] !== t || e[23] !== p || e[24] !== r || e[25] !== o ? (u = !r && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsx(F, { userAnswer: n, correctAnswer: o, deps: t }),
    i && !p && /* @__PURE__ */ l.jsx("div", { className: `${v.inputRow} ${v.solutionRow}`, children: /* @__PURE__ */ l.jsx(P, { className: v.answerFormula, children: i }) })
  ] }), e[20] = n, e[21] = i, e[22] = t, e[23] = p, e[24] = r, e[25] = o, e[26] = u) : u = e[26];
  let x;
  e[27] !== n || e[28] !== t || e[29] !== r || e[30] !== o ? (x = r && /* @__PURE__ */ l.jsx(F, { userAnswer: n, correctAnswer: o, deps: t }), e[27] = n, e[28] = t, e[29] = r, e[30] = o, e[31] = x) : x = e[31];
  const D = !!a;
  let j;
  e[32] !== t || e[33] !== s || e[34] !== D ? (j = /* @__PURE__ */ l.jsx(H, { solution: s, deps: t, suppressFreeTextContent: D }), e[32] = t, e[33] = s, e[34] = D, e[35] = j) : j = e[35];
  let w;
  return e[36] !== c || e[37] !== f || e[38] !== u || e[39] !== x || e[40] !== j ? (w = /* @__PURE__ */ l.jsxs("div", { className: v.container, children: [
    c,
    f,
    u,
    x,
    j
  ] }), e[36] = c, e[37] = f, e[38] = u, e[39] = x, e[40] = j, e[41] = w) : w = e[41], w;
}, K = ({
  id: h
}) => {
  const e = (m) => {
    const t = N.c(20), {
      task: n,
      deps: s,
      answer: i,
      onChange: p,
      mathInput: r
    } = m;
    if (L(n.solution)) {
      let u;
      return t[0] !== i || t[1] !== s || t[2] !== n ? (u = /* @__PURE__ */ l.jsx(J, { task: n, deps: s, answer: i, solution: n.solution }), t[0] = i, t[1] = s, t[2] = n, t[3] = u) : u = t[3], u;
    }
    let o;
    t[4] !== s || t[5] !== n.title ? (o = /* @__PURE__ */ l.jsx(T, { title: n.title, deps: s }), t[4] = s, t[5] = n.title, t[6] = o) : o = t[6];
    let d;
    t[7] !== s || t[8] !== n ? (d = /* @__PURE__ */ l.jsx(M, { task: n, deps: s }), t[7] = s, t[8] = n, t[9] = d) : d = t[9];
    let a;
    t[10] !== r ? (a = (u) => z(u, r), t[10] = r, t[11] = a) : a = t[11];
    let c;
    t[12] !== i || t[13] !== p || t[14] !== a ? (c = /* @__PURE__ */ l.jsx(G, { ref: a, formula: i, onMathFieldChanged: p, className: v.input }), t[12] = i, t[13] = p, t[14] = a, t[15] = c) : c = t[15];
    let f;
    return t[16] !== o || t[17] !== d || t[18] !== c ? (f = /* @__PURE__ */ l.jsxs("div", { className: v.container, "data-template-id": h, children: [
      o,
      d,
      c
    ] }), t[16] = o, t[17] = d, t[18] = c, t[19] = f) : f = t[19], f;
  };
  return e.displayName = h, e;
}, V = K({
  id: "columnOperation.plain"
});
export {
  V as ColumnOperationPlain
};
