import { c as N, j as d, k as F, f as B, M as y, s as $, d as S, g as D, a as k, e as P, h as W } from "./index-wRluoD-s.js";
import { s as b, E as M } from "./equation-content-CiRYgAV9.js";
import { S as z } from "./shared-solution-body-9WuuvhSD.js";
import { S as G } from "./solution-answer-panel-BnG30GAS.js";
const g = (v, t) => v == null ? "" : t(v), R = (v) => {
  const t = N.c(26), {
    answerInput: s,
    deps: l,
    answer: j,
    mode: e,
    withBefore: o,
    withAfter: a,
    onChange: x,
    mathInputRef: w,
    correctAnswer: u
  } = v, m = o === void 0 ? !1 : o, f = a === void 0 ? !1 : a;
  let p;
  t[0] !== l ? (p = (C) => l.global.translateTasks(C), t[0] = l, t[1] = p) : p = t[1];
  const i = p;
  let n;
  t[2] !== (s == null ? void 0 : s.before) || t[3] !== i || t[4] !== m ? (n = m ? g(s == null ? void 0 : s.before, i) : "", t[2] = s == null ? void 0 : s.before, t[3] = i, t[4] = m, t[5] = n) : n = t[5];
  const c = n;
  let r;
  t[6] !== (s == null ? void 0 : s.after) || t[7] !== i || t[8] !== f ? (r = f ? g(s == null ? void 0 : s.after, i) : "", t[6] = s == null ? void 0 : s.after, t[7] = i, t[8] = f, t[9] = r) : r = t[9];
  const h = r;
  let A;
  t[10] !== c ? (A = c ? /* @__PURE__ */ d.jsx(S, { "data-testid": "equation-before", className: b.beforeText, value: c }) : null, t[10] = c, t[11] = A) : A = t[11];
  let T;
  t[12] !== h || t[13] !== j || t[14] !== c || t[15] !== u || t[16] !== w || t[17] !== e || t[18] !== x ? (T = e === "input" ? /* @__PURE__ */ d.jsx(F, { ref: w, formula: j, onMathFieldChanged: x, className: B(b.input, !c && !h && b.inputFull) }) : u ? /* @__PURE__ */ d.jsx(y, { className: b.answerFormula, children: $(u) }) : null, t[12] = h, t[13] = j, t[14] = c, t[15] = u, t[16] = w, t[17] = e, t[18] = x, t[19] = T) : T = t[19];
  let q;
  t[20] !== h ? (q = h ? /* @__PURE__ */ d.jsx(S, { "data-testid": "equation-after", className: b.afterText, value: h }) : null, t[20] = h, t[21] = q) : q = t[21];
  let E;
  return t[22] !== A || t[23] !== T || t[24] !== q ? (E = /* @__PURE__ */ d.jsxs("div", { className: b.inputWrapper, "data-testid": "equation-answer-row", children: [
    A,
    T,
    q
  ] }), t[22] = A, t[23] = T, t[24] = q, t[25] = E) : E = t[25], E;
}, H = (v) => {
  const t = N.c(31), {
    task: s,
    deps: l,
    answer: j,
    solution: e,
    withBefore: o,
    withAfter: a
  } = v, x = o === void 0 ? !1 : o, w = a === void 0 ? !1 : a;
  let u;
  t[0] !== l ? (u = (T) => l.global.translateTasks(T), t[0] = l, t[1] = u) : u = t[1];
  let m;
  t[2] !== e || t[3] !== u ? (m = D(e, u), t[2] = e, t[3] = u, t[4] = m) : m = t[4];
  const f = m;
  let p;
  t[5] !== l || t[6] !== s.title ? (p = /* @__PURE__ */ d.jsx(k, { title: s.title, deps: l }), t[5] = l, t[6] = s.title, t[7] = p) : p = t[7];
  let i;
  t[8] !== l || t[9] !== s.description ? (i = /* @__PURE__ */ d.jsx(M, { description: s.description, deps: l }), t[8] = l, t[9] = s.description, t[10] = i) : i = t[10];
  let n;
  t[11] !== j || t[12] !== f || t[13] !== l ? (n = /* @__PURE__ */ d.jsx(G, { userAnswer: j, correctAnswer: f, deps: l }), t[11] = j, t[12] = f, t[13] = l, t[14] = n) : n = t[14];
  const c = s.answerInput;
  let r;
  t[15] !== j || t[16] !== f || t[17] !== l || t[18] !== c || t[19] !== w || t[20] !== x ? (r = /* @__PURE__ */ d.jsx(R, { answerInput: c, deps: l, answer: j, mode: "solution", withBefore: x, withAfter: w, correctAnswer: f }), t[15] = j, t[16] = f, t[17] = l, t[18] = c, t[19] = w, t[20] = x, t[21] = r) : r = t[21];
  let h;
  t[22] !== l || t[23] !== e ? (h = /* @__PURE__ */ d.jsx(z, { solution: e, deps: l }), t[22] = l, t[23] = e, t[24] = h) : h = t[24];
  let A;
  return t[25] !== h || t[26] !== p || t[27] !== i || t[28] !== n || t[29] !== r ? (A = /* @__PURE__ */ d.jsxs("div", { className: b.container, children: [
    p,
    i,
    n,
    r,
    h
  ] }), t[25] = h, t[26] = p, t[27] = i, t[28] = n, t[29] = r, t[30] = A) : A = t[30], A;
}, Q = ({
  id: v,
  withBefore: t = !1,
  withAfter: s = !1
}) => {
  const l = (j) => {
    const e = N.c(22), {
      task: o,
      deps: a,
      answer: x,
      onChange: w,
      mathInput: u
    } = j;
    if (P(o.solution)) {
      let r;
      return e[0] !== x || e[1] !== a || e[2] !== o ? (r = /* @__PURE__ */ d.jsx(H, { task: o, deps: a, answer: x, solution: o.solution, withBefore: t, withAfter: s }), e[0] = x, e[1] = a, e[2] = o, e[3] = r) : r = e[3], r;
    }
    let m;
    e[4] !== a || e[5] !== o.title ? (m = /* @__PURE__ */ d.jsx(k, { title: o.title, deps: a }), e[4] = a, e[5] = o.title, e[6] = m) : m = e[6];
    let f;
    e[7] !== a || e[8] !== o.description ? (f = /* @__PURE__ */ d.jsx(M, { description: o.description, deps: a }), e[7] = a, e[8] = o.description, e[9] = f) : f = e[9];
    const p = o.answerInput;
    let i;
    e[10] !== u ? (i = (r) => W(r, u), e[10] = u, e[11] = i) : i = e[11];
    let n;
    e[12] !== x || e[13] !== a || e[14] !== w || e[15] !== p || e[16] !== i ? (n = /* @__PURE__ */ d.jsx(R, { answerInput: p, deps: a, answer: x, mode: "input", withBefore: t, withAfter: s, onChange: w, mathInputRef: i }), e[12] = x, e[13] = a, e[14] = w, e[15] = p, e[16] = i, e[17] = n) : n = e[17];
    let c;
    return e[18] !== m || e[19] !== f || e[20] !== n ? (c = /* @__PURE__ */ d.jsxs("div", { className: b.container, "data-template-id": v, children: [
      m,
      f,
      n
    ] }), e[18] = m, e[19] = f, e[20] = n, e[21] = c) : c = e[21], c;
  };
  return l.displayName = v, l;
};
export {
  Q as c
};
