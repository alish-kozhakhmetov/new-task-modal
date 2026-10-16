var R = Object.defineProperty;
var N = Object.getOwnPropertySymbols;
var $ = Object.prototype.hasOwnProperty, B = Object.prototype.propertyIsEnumerable;
var T = (f, e, l) => e in f ? R(f, e, { enumerable: !0, configurable: !0, writable: !0, value: l }) : f[e] = l, M = (f, e) => {
  for (var l in e || (e = {}))
    $.call(e, l) && T(f, l, e[l]);
  if (N)
    for (var l of N(e))
      B.call(e, l) && T(f, l, e[l]);
  return f;
};
import { c as D, s as q, g as E, t as I, b as P, q as G, A as L, B as U, D as _, j as o, a as b, L as z, E as k, F as v, M as H, G as J, e as K, h as Q, k as V } from "./index-BfHLDJGm.js";
import { S as O, a as W } from "./solution-answer-panel-BuhBEWkl.js";
const X = (f) => {
  const e = D.c(42), {
    task: l,
    deps: s,
    answer: t,
    solution: n
  } = f;
  let i, r, a, c, x;
  if (e[0] !== s || e[1] !== n || e[2] !== l) {
    let C;
    e[8] !== s ? (C = (y) => s.global.translateTasks(y), e[8] = s, e[9] = C) : C = e[9], i = q(E(n, C));
    let g;
    e[10] !== n ? (g = I(n), e[10] = n, e[11] = g) : g = e[11], a = g, c = P([i]);
    const S = G(l, s);
    r = !!(S && L(S));
    const F = r && S ? U(S, {
      quotient: i || void 0
    }) : null;
    x = F ? _(F) : null, e[0] = s, e[1] = n, e[2] = l, e[3] = i, e[4] = r, e[5] = a, e[6] = c, e[7] = x;
  } else
    i = e[3], r = e[4], a = e[5], c = e[6], x = e[7];
  const u = x;
  let m;
  e[12] !== s || e[13] !== l.title ? (m = /* @__PURE__ */ o.jsx(b, { title: l.title, deps: s }), e[12] = s, e[13] = l.title, e[14] = m) : m = e[14];
  let p;
  e[15] !== i || e[16] !== s || e[17] !== u || e[18] !== l ? (p = u ? /* @__PURE__ */ o.jsx(z, { dividend: u.dividend, divisor: u.divisor }) : /* @__PURE__ */ o.jsx(k, { task: l, deps: s, quotient: i || void 0 }), e[15] = i, e[16] = s, e[17] = u, e[18] = l, e[19] = p) : p = e[19];
  let j;
  e[20] !== t || e[21] !== i || e[22] !== s || e[23] !== r || e[24] !== a || e[25] !== c ? (j = !a && /* @__PURE__ */ o.jsxs(o.Fragment, { children: [
    /* @__PURE__ */ o.jsx(O, { userAnswer: t, correctAnswer: c, deps: s }),
    i && !r && /* @__PURE__ */ o.jsx("div", { className: `${v.inputRow} ${v.solutionRow}`, children: /* @__PURE__ */ o.jsx(H, { className: v.answerFormula, children: i }) })
  ] }), e[20] = t, e[21] = i, e[22] = s, e[23] = r, e[24] = a, e[25] = c, e[26] = j) : j = e[26];
  let d;
  e[27] !== t || e[28] !== s || e[29] !== a || e[30] !== c ? (d = a && /* @__PURE__ */ o.jsx(O, { userAnswer: t, correctAnswer: c, deps: s }), e[27] = t, e[28] = s, e[29] = a, e[30] = c, e[31] = d) : d = e[31];
  const A = !!u;
  let h;
  e[32] !== s || e[33] !== n || e[34] !== A ? (h = /* @__PURE__ */ o.jsx(W, { solution: n, deps: s, suppressFreeTextContent: A }), e[32] = s, e[33] = n, e[34] = A, e[35] = h) : h = e[35];
  let w;
  return e[36] !== m || e[37] !== p || e[38] !== j || e[39] !== d || e[40] !== h ? (w = /* @__PURE__ */ o.jsxs("div", { className: v.container, children: [
    m,
    p,
    j,
    d,
    h
  ] }), e[36] = m, e[37] = p, e[38] = j, e[39] = d, e[40] = h, e[41] = w) : w = e[41], w;
}, Y = ({
  id: f
}) => {
  const e = (s) => {
    const t = D.c(20), {
      task: n,
      deps: i,
      answer: r,
      onChange: a,
      mathInput: c
    } = s;
    if (K(n.solution)) {
      let d;
      return t[0] !== r || t[1] !== i || t[2] !== n ? (d = /* @__PURE__ */ o.jsx(X, { task: n, deps: i, answer: r, solution: n.solution }), t[0] = r, t[1] = i, t[2] = n, t[3] = d) : d = t[3], d;
    }
    let x;
    t[4] !== i || t[5] !== n.title ? (x = /* @__PURE__ */ o.jsx(b, { title: n.title, deps: i }), t[4] = i, t[5] = n.title, t[6] = x) : x = t[6];
    let u;
    t[7] !== i || t[8] !== n ? (u = /* @__PURE__ */ o.jsx(k, { task: n, deps: i }), t[7] = i, t[8] = n, t[9] = u) : u = t[9];
    let m;
    t[10] !== c ? (m = (d) => Q(d, c), t[10] = c, t[11] = m) : m = t[11];
    let p;
    t[12] !== r || t[13] !== a || t[14] !== m ? (p = /* @__PURE__ */ o.jsx(V, { ref: m, formula: r, onMathFieldChanged: a, className: v.input }), t[12] = r, t[13] = a, t[14] = m, t[15] = p) : p = t[15];
    let j;
    return t[16] !== x || t[17] !== u || t[18] !== p ? (j = /* @__PURE__ */ o.jsxs("div", { className: v.container, "data-template-id": f, children: [
      x,
      u,
      p
    ] }), t[16] = x, t[17] = u, t[18] = p, t[19] = j) : j = t[19], j;
  };
  return e.displayName = f, (s) => {
    const t = D.c(3);
    let n;
    t[0] === Symbol.for("react.memo_cache_sentinel") ? (n = {
      from: null
    }, t[0] = n) : n = t[0];
    let i;
    return t[1] !== s ? (i = /* @__PURE__ */ o.jsx(J, { value: n, children: /* @__PURE__ */ o.jsx(e, M({}, s)) }), t[1] = s, t[2] = i) : i = t[2], i;
  };
}, se = Y({
  id: "columnOperation.plain"
});
export {
  se as ColumnOperationPlain
};
