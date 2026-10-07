import { c as G, s as L, g as O, j as r, a as H, b as Q, i as J, d as E, M as U, e as V, f as W, h as X, k as Y } from "./index-DwDfo0zf.js";
import { S as Z, a as _ } from "./solution-answer-panel-DNRF1AHT.js";
import { m as C, s as k, T as K } from "./text-template.module-BQ2pVRIv.js";
const P = (o, t) => o == null ? "" : J(o) ? t(o) : typeof o == "string" ? o : "", I = (o) => {
  const t = G.c(58), {
    task: u,
    deps: a,
    answer: R,
    solution: v,
    withBefore: D,
    withAfter: e,
    answerInputAsSuffix: f,
    normalizeBareMath: n
  } = o, b = D === void 0 ? !1 : D, F = e === void 0 ? !1 : e, $ = f === void 0 ? !1 : f, i = n === void 0 ? !1 : n;
  let S;
  t[0] !== a ? (S = (l) => a.global.translateTasks(l), t[0] = a, t[1] = S) : S = t[1];
  const s = S;
  let N, m, h, d, c, B, j, p, x;
  if (t[2] !== R || t[3] !== $ || t[4] !== a || t[5] !== i || t[6] !== v || t[7] !== u || t[8] !== s || t[9] !== F || t[10] !== b) {
    m = L(O(v, s));
    const l = u.answerInput;
    let z;
    t[20] !== (l == null ? void 0 : l.before) || t[21] !== i || t[22] !== s || t[23] !== b ? (z = b ? C(P(l == null ? void 0 : l.before, s), i) : "", t[20] = l == null ? void 0 : l.before, t[21] = i, t[22] = s, t[23] = b, t[24] = z) : z = t[24], h = z;
    let A;
    t[25] !== (l == null ? void 0 : l.after) || t[26] !== $ || t[27] !== i || t[28] !== u.answerInput || t[29] !== s || t[30] !== F ? (A = $ ? C(P(u.answerInput, s), i) : F ? C(P(l == null ? void 0 : l.after, s), i) : "", t[25] = l == null ? void 0 : l.after, t[26] = $, t[27] = i, t[28] = u.answerInput, t[29] = s, t[30] = F, t[31] = A) : A = t[31], d = A, p = k.container, t[32] !== a || t[33] !== u.title ? (x = /* @__PURE__ */ r.jsx(H, { title: u.title, deps: a }), t[32] = a, t[33] = u.title, t[34] = x) : x = t[34];
    const w = u;
    t[35] !== a || t[36] !== i || t[37] !== w ? (c = /* @__PURE__ */ r.jsx(K, { task: w, deps: a, normalizeBareMath: i }), t[35] = a, t[36] = i, t[37] = w, t[38] = c) : c = t[38], N = Z, B = R, j = Q([m]), t[2] = R, t[3] = $, t[4] = a, t[5] = i, t[6] = v, t[7] = u, t[8] = s, t[9] = F, t[10] = b, t[11] = N, t[12] = m, t[13] = h, t[14] = d, t[15] = c, t[16] = B, t[17] = j, t[18] = p, t[19] = x;
  } else
    N = t[11], m = t[12], h = t[13], d = t[14], c = t[15], B = t[16], j = t[17], p = t[18], x = t[19];
  let y;
  t[39] !== N || t[40] !== a || t[41] !== B || t[42] !== j ? (y = /* @__PURE__ */ r.jsx(N, { userAnswer: B, correctAnswer: j, deps: a }), t[39] = N, t[40] = a, t[41] = B, t[42] = j, t[43] = y) : y = t[43];
  let T;
  t[44] !== m || t[45] !== h || t[46] !== d ? (T = m && (h || d) && /* @__PURE__ */ r.jsxs("div", { className: `${k.inputRow} ${k.solutionRow}`, children: [
    h && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-prefix", className: k.prefix, value: h }),
    /* @__PURE__ */ r.jsx(U, { className: k.answerFormula, children: m }),
    d && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-suffix", className: k.suffix, value: d })
  ] }), t[44] = m, t[45] = h, t[46] = d, t[47] = T) : T = t[47];
  let M;
  t[48] !== a || t[49] !== v ? (M = /* @__PURE__ */ r.jsx(_, { solution: v, deps: a }), t[48] = a, t[49] = v, t[50] = M) : M = t[50];
  let g;
  return t[51] !== c || t[52] !== y || t[53] !== T || t[54] !== M || t[55] !== p || t[56] !== x ? (g = /* @__PURE__ */ r.jsxs("div", { className: p, children: [
    x,
    c,
    y,
    T,
    M
  ] }), t[51] = c, t[52] = y, t[53] = T, t[54] = M, t[55] = p, t[56] = x, t[57] = g) : g = t[57], g;
}, q = (o, t) => o == null ? "" : J(o) ? t(o) : typeof o == "string" ? o : "", lt = ({
  id: o,
  withBefore: t = !1,
  withAfter: u = !1,
  answerInputAsSuffix: a = !1,
  normalizeBareMath: R = !1
}) => {
  const v = (D) => {
    const e = G.c(40), {
      task: f,
      deps: n,
      answer: b,
      onChange: F,
      mathInput: $
    } = D;
    if (V(f.solution)) {
      let A;
      return e[0] !== b || e[1] !== n || e[2] !== f ? (A = /* @__PURE__ */ r.jsx(I, { task: f, deps: n, answer: b, solution: f.solution, withBefore: t, withAfter: u, answerInputAsSuffix: a, normalizeBareMath: R }), e[0] = b, e[1] = n, e[2] = f, e[3] = A) : A = e[3], A;
    }
    let i;
    e[4] !== n ? (i = (A) => n.global.translateTasks(A), e[4] = n, e[5] = i) : i = e[5];
    const S = i, s = f.answerInput;
    let N;
    e[6] !== (s == null ? void 0 : s.before) || e[7] !== S ? (N = t ? C(q(s == null ? void 0 : s.before, S), R) : "", e[6] = s == null ? void 0 : s.before, e[7] = S, e[8] = N) : N = e[8];
    const m = N;
    let h;
    e[9] !== (s == null ? void 0 : s.after) || e[10] !== f.answerInput || e[11] !== S ? (h = a ? C(q(f.answerInput, S), R) : u ? C(q(s == null ? void 0 : s.after, S), R) : "", e[9] = s == null ? void 0 : s.after, e[10] = f.answerInput, e[11] = S, e[12] = h) : h = e[12];
    const d = h;
    let c;
    e[13] !== n || e[14] !== f.title ? (c = /* @__PURE__ */ r.jsx(H, { title: f.title, deps: n }), e[13] = n, e[14] = f.title, e[15] = c) : c = e[15];
    const B = f;
    let j;
    e[16] !== n || e[17] !== B ? (j = /* @__PURE__ */ r.jsx(K, { task: B, deps: n, normalizeBareMath: R }), e[16] = n, e[17] = B, e[18] = j) : j = e[18];
    let p;
    e[19] !== m ? (p = m && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-prefix", className: k.prefix, value: m }), e[19] = m, e[20] = p) : p = e[20];
    let x;
    e[21] !== $ ? (x = (A) => X(A, $), e[21] = $, e[22] = x) : x = e[22];
    const y = !m && !d && k.inputFull;
    let T;
    e[23] !== y ? (T = W(k.input, y), e[23] = y, e[24] = T) : T = e[24];
    let M;
    e[25] !== b || e[26] !== F || e[27] !== T || e[28] !== x ? (M = /* @__PURE__ */ r.jsx(Y, { ref: x, formula: b, onMathFieldChanged: F, className: T }), e[25] = b, e[26] = F, e[27] = T, e[28] = x, e[29] = M) : M = e[29];
    let g;
    e[30] !== d ? (g = d && /* @__PURE__ */ r.jsx(E, { "data-testid": "text-suffix", className: k.suffix, value: d }), e[30] = d, e[31] = g) : g = e[31];
    let l;
    e[32] !== M || e[33] !== g || e[34] !== p ? (l = /* @__PURE__ */ r.jsxs("div", { className: k.inputRow, children: [
      p,
      M,
      g
    ] }), e[32] = M, e[33] = g, e[34] = p, e[35] = l) : l = e[35];
    let z;
    return e[36] !== l || e[37] !== c || e[38] !== j ? (z = /* @__PURE__ */ r.jsxs("div", { className: k.container, "data-template-id": o, children: [
      c,
      j,
      l
    ] }), e[36] = l, e[37] = c, e[38] = j, e[39] = z) : z = e[39], z;
  };
  return v.displayName = o, v;
};
export {
  lt as c
};
