import { c as v, j as c, k as B, M as R, s as C, d as N, r as W, g as $, a as k, e as y, h as I } from "./index-DwDfo0zf.js";
import { S as D, a as P } from "./solution-answer-panel-DNRF1AHT.js";
const z = "_container_71r77_1", G = "_content_71r77_7", H = "_inputWrapper_71r77_11", J = "_beforeText_71r77_18", K = "_afterText_71r77_19", L = "_input_71r77_11", O = "_answerFormula_71r77_28", b = {
  container: z,
  content: G,
  inputWrapper: H,
  beforeText: J,
  afterText: K,
  input: L,
  answerFormula: O
}, E = (h, t) => h == null ? "" : t(h), F = (h) => {
  const t = v.c(24), {
    answerInput: s,
    deps: n,
    answer: f,
    mode: e,
    withBefore: o,
    withAfter: r,
    onChange: x,
    mathInputRef: _,
    correctAnswer: p
  } = h, m = o === void 0 ? !1 : o, u = r === void 0 ? !1 : r;
  let i;
  t[0] !== n ? (i = (S) => n.global.translateTasks(S), t[0] = n, t[1] = i) : i = t[1];
  const a = i;
  let d;
  t[2] !== (s == null ? void 0 : s.before) || t[3] !== a || t[4] !== m ? (d = m ? E(s == null ? void 0 : s.before, a) : "", t[2] = s == null ? void 0 : s.before, t[3] = a, t[4] = m, t[5] = d) : d = t[5];
  const l = d;
  let j;
  t[6] !== (s == null ? void 0 : s.after) || t[7] !== a || t[8] !== u ? (j = u ? E(s == null ? void 0 : s.after, a) : "", t[6] = s == null ? void 0 : s.after, t[7] = a, t[8] = u, t[9] = j) : j = t[9];
  const w = j;
  let T;
  t[10] !== l ? (T = l ? /* @__PURE__ */ c.jsx(N, { "data-testid": "equation-before", className: b.beforeText, value: l }) : null, t[10] = l, t[11] = T) : T = t[11];
  let A;
  t[12] !== f || t[13] !== p || t[14] !== _ || t[15] !== e || t[16] !== x ? (A = e === "input" ? /* @__PURE__ */ c.jsx(B, { ref: _, formula: f, onMathFieldChanged: x, className: b.input }) : p ? /* @__PURE__ */ c.jsx(R, { className: b.answerFormula, children: C(p) }) : null, t[12] = f, t[13] = p, t[14] = _, t[15] = e, t[16] = x, t[17] = A) : A = t[17];
  let q;
  t[18] !== w ? (q = w ? /* @__PURE__ */ c.jsx(N, { "data-testid": "equation-after", className: b.afterText, value: w }) : null, t[18] = w, t[19] = q) : q = t[19];
  let g;
  return t[20] !== T || t[21] !== A || t[22] !== q ? (g = /* @__PURE__ */ c.jsxs("div", { className: b.inputWrapper, "data-testid": "equation-answer-row", children: [
    T,
    A,
    q
  ] }), t[20] = T, t[21] = A, t[22] = q, t[23] = g) : g = t[23], g;
}, M = (h) => {
  const t = v.c(6), {
    description: s,
    deps: n
  } = h;
  let f, e;
  if (t[0] !== n.global || t[1] !== s.content ? (e = n.global.translateTasks(s.content), f = e.trim(), t[0] = n.global, t[1] = s.content, t[2] = f, t[3] = e) : (f = t[2], e = t[3]), !f)
    return null;
  let o;
  return t[4] !== e ? (o = /* @__PURE__ */ c.jsx("div", { className: b.content, "data-testid": "equation-content", children: /* @__PURE__ */ c.jsx(W, { children: e }) }), t[4] = e, t[5] = o) : o = t[5], o;
}, Q = (h) => {
  const t = v.c(31), {
    task: s,
    deps: n,
    answer: f,
    solution: e,
    withBefore: o,
    withAfter: r
  } = h, x = o === void 0 ? !1 : o, _ = r === void 0 ? !1 : r;
  let p;
  t[0] !== n ? (p = (T) => n.global.translateTasks(T), t[0] = n, t[1] = p) : p = t[1];
  let m;
  t[2] !== e || t[3] !== p ? (m = $(e, p), t[2] = e, t[3] = p, t[4] = m) : m = t[4];
  const u = m;
  let i;
  t[5] !== n || t[6] !== s.title ? (i = /* @__PURE__ */ c.jsx(k, { title: s.title, deps: n }), t[5] = n, t[6] = s.title, t[7] = i) : i = t[7];
  let a;
  t[8] !== n || t[9] !== s.description ? (a = /* @__PURE__ */ c.jsx(M, { description: s.description, deps: n }), t[8] = n, t[9] = s.description, t[10] = a) : a = t[10];
  let d;
  t[11] !== f || t[12] !== u || t[13] !== n ? (d = /* @__PURE__ */ c.jsx(D, { userAnswer: f, correctAnswer: u, deps: n }), t[11] = f, t[12] = u, t[13] = n, t[14] = d) : d = t[14];
  let l;
  t[15] !== f || t[16] !== u || t[17] !== n || t[18] !== s.answerInput || t[19] !== _ || t[20] !== x ? (l = /* @__PURE__ */ c.jsx(F, { answerInput: s.answerInput, deps: n, answer: f, mode: "solution", withBefore: x, withAfter: _, correctAnswer: u }), t[15] = f, t[16] = u, t[17] = n, t[18] = s.answerInput, t[19] = _, t[20] = x, t[21] = l) : l = t[21];
  let j;
  t[22] !== n || t[23] !== e ? (j = /* @__PURE__ */ c.jsx(P, { solution: e, deps: n }), t[22] = n, t[23] = e, t[24] = j) : j = t[24];
  let w;
  return t[25] !== i || t[26] !== a || t[27] !== d || t[28] !== l || t[29] !== j ? (w = /* @__PURE__ */ c.jsxs("div", { className: b.container, children: [
    i,
    a,
    d,
    l,
    j
  ] }), t[25] = i, t[26] = a, t[27] = d, t[28] = l, t[29] = j, t[30] = w) : w = t[30], w;
}, U = ({
  id: h,
  withBefore: t = !1,
  withAfter: s = !1
}) => {
  const n = (f) => {
    const e = v.c(22), {
      task: o,
      deps: r,
      answer: x,
      onChange: _,
      mathInput: p
    } = f;
    if (y(o.solution)) {
      let l;
      return e[0] !== x || e[1] !== r || e[2] !== o ? (l = /* @__PURE__ */ c.jsx(Q, { task: o, deps: r, answer: x, solution: o.solution, withBefore: t, withAfter: s }), e[0] = x, e[1] = r, e[2] = o, e[3] = l) : l = e[3], l;
    }
    let m;
    e[4] !== r || e[5] !== o.title ? (m = /* @__PURE__ */ c.jsx(k, { title: o.title, deps: r }), e[4] = r, e[5] = o.title, e[6] = m) : m = e[6];
    let u;
    e[7] !== r || e[8] !== o.description ? (u = /* @__PURE__ */ c.jsx(M, { description: o.description, deps: r }), e[7] = r, e[8] = o.description, e[9] = u) : u = e[9];
    let i;
    e[10] !== p ? (i = (l) => I(l, p), e[10] = p, e[11] = i) : i = e[11];
    let a;
    e[12] !== x || e[13] !== r || e[14] !== _ || e[15] !== i || e[16] !== o.answerInput ? (a = /* @__PURE__ */ c.jsx(F, { answerInput: o.answerInput, deps: r, answer: x, mode: "input", withBefore: t, withAfter: s, onChange: _, mathInputRef: i }), e[12] = x, e[13] = r, e[14] = _, e[15] = i, e[16] = o.answerInput, e[17] = a) : a = e[17];
    let d;
    return e[18] !== m || e[19] !== u || e[20] !== a ? (d = /* @__PURE__ */ c.jsxs("div", { className: b.container, "data-template-id": h, children: [
      m,
      u,
      a
    ] }), e[18] = m, e[19] = u, e[20] = a, e[21] = d) : d = e[21], d;
  };
  return n.displayName = h, n;
}, Y = U({
  id: "equation.before",
  withBefore: !0
});
export {
  Y as EquationBefore,
  Y as default
};
