import { c as G, s as L, g as O, j as r, a as H, b as Q, i as J, d as E, M as U, e as V, f as W, h as X, k as Y } from "./index-wRluoD-s.js";
import { S as Z } from "./shared-solution-body-9WuuvhSD.js";
import { S as _ } from "./solution-answer-panel-BnG30GAS.js";
import { m as C, T as K } from "./text-task-description-C7l32smS.js";
import { s as k } from "./text-template.module-C6vBLKI6.js";
const P = (o, t) => o == null ? "" : J(o) ? t(o) : typeof o == "string" ? o : "", I = (o) => {
  const t = G.c(58), {
    task: u,
    deps: i,
    answer: R,
    solution: v,
    withBefore: D,
    withAfter: e,
    answerInputAsSuffix: f,
    normalizeBareMath: n
  } = o, S = D === void 0 ? !1 : D, F = e === void 0 ? !1 : e, $ = f === void 0 ? !1 : f, a = n === void 0 ? !1 : n;
  let b;
  t[0] !== i ? (b = (l) => i.global.translateTasks(l), t[0] = i, t[1] = b) : b = t[1];
  const s = b;
  let N, m, h, d, c, B, p, j, x;
  if (t[2] !== R || t[3] !== $ || t[4] !== i || t[5] !== a || t[6] !== v || t[7] !== u || t[8] !== s || t[9] !== F || t[10] !== S) {
    m = L(O(v, s));
    const l = u.answerInput;
    let z;
    t[20] !== (l == null ? void 0 : l.before) || t[21] !== a || t[22] !== s || t[23] !== S ? (z = S ? C(P(l == null ? void 0 : l.before, s), a) : "", t[20] = l == null ? void 0 : l.before, t[21] = a, t[22] = s, t[23] = S, t[24] = z) : z = t[24], h = z;
    let A;
    t[25] !== (l == null ? void 0 : l.after) || t[26] !== $ || t[27] !== a || t[28] !== u.answerInput || t[29] !== s || t[30] !== F ? (A = $ ? C(P(u.answerInput, s), a) : F ? C(P(l == null ? void 0 : l.after, s), a) : "", t[25] = l == null ? void 0 : l.after, t[26] = $, t[27] = a, t[28] = u.answerInput, t[29] = s, t[30] = F, t[31] = A) : A = t[31], d = A, j = k.container, t[32] !== i || t[33] !== u.title ? (x = /* @__PURE__ */ r.jsx(H, { title: u.title, deps: i }), t[32] = i, t[33] = u.title, t[34] = x) : x = t[34];
    const w = u;
    t[35] !== i || t[36] !== a || t[37] !== w ? (c = /* @__PURE__ */ r.jsx(K, { task: w, deps: i, normalizeBareMath: a }), t[35] = i, t[36] = a, t[37] = w, t[38] = c) : c = t[38], N = _, B = R, p = Q([m]), t[2] = R, t[3] = $, t[4] = i, t[5] = a, t[6] = v, t[7] = u, t[8] = s, t[9] = F, t[10] = S, t[11] = N, t[12] = m, t[13] = h, t[14] = d, t[15] = c, t[16] = B, t[17] = p, t[18] = j, t[19] = x;
  } else
    N = t[11], m = t[12], h = t[13], d = t[14], c = t[15], B = t[16], p = t[17], j = t[18], x = t[19];
  let y;
  t[39] !== N || t[40] !== i || t[41] !== B || t[42] !== p ? (y = /* @__PURE__ */ r.jsx(N, { userAnswer: B, correctAnswer: p, deps: i }), t[39] = N, t[40] = i, t[41] = B, t[42] = p, t[43] = y) : y = t[43];
  let T;
  t[44] !== m || t[45] !== h || t[46] !== d ? (T = m && (h || d) && /* @__PURE__ */ r.jsxs("div", { className: `${k.inputRow} ${k.solutionRow}`, children: [
    h && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-prefix", className: k.prefix, value: h }),
    /* @__PURE__ */ r.jsx(U, { className: k.answerFormula, children: m }),
    d && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-suffix", className: k.suffix, value: d })
  ] }), t[44] = m, t[45] = h, t[46] = d, t[47] = T) : T = t[47];
  let M;
  t[48] !== i || t[49] !== v ? (M = /* @__PURE__ */ r.jsx(Z, { solution: v, deps: i }), t[48] = i, t[49] = v, t[50] = M) : M = t[50];
  let g;
  return t[51] !== c || t[52] !== y || t[53] !== T || t[54] !== M || t[55] !== j || t[56] !== x ? (g = /* @__PURE__ */ r.jsxs("div", { className: j, children: [
    x,
    c,
    y,
    T,
    M
  ] }), t[51] = c, t[52] = y, t[53] = T, t[54] = M, t[55] = j, t[56] = x, t[57] = g) : g = t[57], g;
}, q = (o, t) => o == null ? "" : J(o) ? t(o) : typeof o == "string" ? o : "", at = ({
  id: o,
  withBefore: t = !1,
  withAfter: u = !1,
  answerInputAsSuffix: i = !1,
  normalizeBareMath: R = !1
}) => {
  const v = (D) => {
    const e = G.c(40), {
      task: f,
      deps: n,
      answer: S,
      onChange: F,
      mathInput: $
    } = D;
    if (V(f.solution)) {
      let A;
      return e[0] !== S || e[1] !== n || e[2] !== f ? (A = /* @__PURE__ */ r.jsx(I, { task: f, deps: n, answer: S, solution: f.solution, withBefore: t, withAfter: u, answerInputAsSuffix: i, normalizeBareMath: R }), e[0] = S, e[1] = n, e[2] = f, e[3] = A) : A = e[3], A;
    }
    let a;
    e[4] !== n ? (a = (A) => n.global.translateTasks(A), e[4] = n, e[5] = a) : a = e[5];
    const b = a, s = f.answerInput;
    let N;
    e[6] !== (s == null ? void 0 : s.before) || e[7] !== b ? (N = t ? C(q(s == null ? void 0 : s.before, b), R) : "", e[6] = s == null ? void 0 : s.before, e[7] = b, e[8] = N) : N = e[8];
    const m = N;
    let h;
    e[9] !== (s == null ? void 0 : s.after) || e[10] !== f.answerInput || e[11] !== b ? (h = i ? C(q(f.answerInput, b), R) : u ? C(q(s == null ? void 0 : s.after, b), R) : "", e[9] = s == null ? void 0 : s.after, e[10] = f.answerInput, e[11] = b, e[12] = h) : h = e[12];
    const d = h;
    let c;
    e[13] !== n || e[14] !== f.title ? (c = /* @__PURE__ */ r.jsx(H, { title: f.title, deps: n }), e[13] = n, e[14] = f.title, e[15] = c) : c = e[15];
    const B = f;
    let p;
    e[16] !== n || e[17] !== B ? (p = /* @__PURE__ */ r.jsx(K, { task: B, deps: n, normalizeBareMath: R }), e[16] = n, e[17] = B, e[18] = p) : p = e[18];
    let j;
    e[19] !== m ? (j = m && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-prefix", className: k.prefix, value: m }), e[19] = m, e[20] = j) : j = e[20];
    let x;
    e[21] !== $ ? (x = (A) => X(A, $), e[21] = $, e[22] = x) : x = e[22];
    const y = !m && !d && k.inputFull;
    let T;
    e[23] !== y ? (T = W(k.input, y), e[23] = y, e[24] = T) : T = e[24];
    let M;
    e[25] !== S || e[26] !== F || e[27] !== T || e[28] !== x ? (M = /* @__PURE__ */ r.jsx(Y, { ref: x, formula: S, onMathFieldChanged: F, className: T }), e[25] = S, e[26] = F, e[27] = T, e[28] = x, e[29] = M) : M = e[29];
    let g;
    e[30] !== d ? (g = d && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-suffix", className: k.suffix, value: d }), e[30] = d, e[31] = g) : g = e[31];
    let l;
    e[32] !== M || e[33] !== g || e[34] !== j ? (l = /* @__PURE__ */ r.jsxs("div", { className: k.inputRow, children: [
      j,
      M,
      g
    ] }), e[32] = M, e[33] = g, e[34] = j, e[35] = l) : l = e[35];
    let z;
    return e[36] !== l || e[37] !== c || e[38] !== p ? (z = /* @__PURE__ */ r.jsxs("div", { className: k.container, "data-template-id": o, children: [
      c,
      p,
      l
    ] }), e[36] = l, e[37] = c, e[38] = p, e[39] = z) : z = e[39], z;
  };
  return v.displayName = o, v;
};
export {
  at as c
};
