import { u as x, c as h, o as d, p as g, q as w, f as j, j as p, r as k } from "./index-y5-JRyys.js";
import { u as F, s as m } from "./task-description.module-CL3qKfxI.js";
const R = (n) => n.includes("^") ? n.split(/(\\\([\s\S]*?\\\)|\$[^$]*\$)/).map((e) => e.startsWith("\\(") || e.startsWith("$") ? e : e.replace(/([^\s\\]*\^[0-9]+)/g, (c) => `\\(${x(c)}\\)`)).join("") : n, $ = (n, s) => s ? R(n) : n, A = (n) => {
  const s = h.c(12), {
    task: e,
    deps: c,
    className: r,
    normalizeBareMath: u
  } = n, _ = u === void 0 ? !1 : u, l = F(M);
  let a;
  s[0] !== c || s[1] !== _ || s[2] !== e ? (a = d(g($(w(e, c), _))), s[0] = c, s[1] = _, s[2] = e, s[3] = a) : a = s[3];
  const i = a;
  let t;
  s[4] !== r ? (t = j(m.container, r), s[4] = r, s[5] = t) : t = s[5];
  let o;
  s[6] !== l || s[7] !== i ? (o = l ? /* @__PURE__ */ p.jsx(T, { text: i, progress: l }) : i, s[6] = l, s[7] = i, s[8] = o) : o = s[8];
  let f;
  return s[9] !== t || s[10] !== o ? (f = /* @__PURE__ */ p.jsx(k, { className: t, children: o }), s[9] = t, s[10] = o, s[11] = f) : f = s[11], f;
}, T = (n) => {
  const s = h.c(13), {
    text: e,
    progress: c
  } = n, r = Math.floor(e.length * c);
  let u;
  s[0] !== r || s[1] !== e ? (u = e.slice(0, r), s[0] = r, s[1] = e, s[2] = u) : u = s[2];
  const _ = u;
  let l;
  s[3] !== r || s[4] !== e ? (l = e.slice(r), s[3] = r, s[4] = e, s[5] = l) : l = s[5];
  const a = l;
  let i;
  s[6] !== _ ? (i = /* @__PURE__ */ p.jsx("span", { className: m.highlighted, children: _ }), s[6] = _, s[7] = i) : i = s[7];
  let t;
  s[8] !== a ? (t = /* @__PURE__ */ p.jsx("span", { className: m.remaining, children: a }), s[8] = a, s[9] = t) : t = s[9];
  let o;
  return s[10] !== i || s[11] !== t ? (o = /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
    i,
    t
  ] }), s[10] = i, s[11] = t, s[12] = o) : o = s[12], o;
};
function M(n) {
  return n.progress;
}
const N = "_container_1e5se_4", z = "_inputRow_1e5se_10", b = "_solutionRow_1e5se_17", y = "_input_1e5se_10", L = "_inputFull_1e5se_26", B = "_answerFormula_1e5se_32", G = "_prefix_1e5se_36", S = "_suffix_1e5se_37", D = "_stack_1e5se_61", E = "_inline_1e5se_67", U = "_fieldLabel_1e5se_74", W = "_stackGrid_1e5se_80", I = {
  container: N,
  inputRow: z,
  solutionRow: b,
  input: y,
  inputFull: L,
  answerFormula: B,
  prefix: G,
  suffix: S,
  stack: D,
  inline: E,
  fieldLabel: U,
  stackGrid: W
};
export {
  A as T,
  $ as m,
  I as s
};
