import { u as x, c as h, n as g, o as d, p as y, q as w, j as p, r as j } from "./index-BMecoduC.js";
import { u as R, s as m } from "./task-description.module-BgCtpyWS.js";
const $ = (i) => i.includes("^") ? i.split(/(\\\([\s\S]*?\\\)|\$[^$]*\$)/).map((t) => t.startsWith("\\(") || t.startsWith("$") ? t : t.replace(/([^\s\\]*\^[0-9]+)/g, (c) => `\\(${x(c)}\\)`)).join("") : i, T = (i, s) => s ? $(i) : i, v = (i) => {
  const s = h.c(12), {
    task: t,
    deps: c,
    className: r,
    normalizeBareMath: u
  } = i, _ = u === void 0 ? !1 : u, a = R(N);
  let l;
  s[0] !== c || s[1] !== _ || s[2] !== t ? (l = g(d(T(y(t, c), _))), s[0] = c, s[1] = _, s[2] = t, s[3] = l) : l = s[3];
  const n = l;
  let e;
  s[4] !== r ? (e = w(m.container, r), s[4] = r, s[5] = e) : e = s[5];
  let o;
  s[6] !== a || s[7] !== n ? (o = a ? /* @__PURE__ */ p.jsx(M, { text: n, progress: a }) : n, s[6] = a, s[7] = n, s[8] = o) : o = s[8];
  let f;
  return s[9] !== e || s[10] !== o ? (f = /* @__PURE__ */ p.jsx(j, { className: e, children: o }), s[9] = e, s[10] = o, s[11] = f) : f = s[11], f;
}, M = (i) => {
  const s = h.c(13), {
    text: t,
    progress: c
  } = i, r = Math.floor(t.length * c);
  let u;
  s[0] !== r || s[1] !== t ? (u = t.slice(0, r), s[0] = r, s[1] = t, s[2] = u) : u = s[2];
  const _ = u;
  let a;
  s[3] !== r || s[4] !== t ? (a = t.slice(r), s[3] = r, s[4] = t, s[5] = a) : a = s[5];
  const l = a;
  let n;
  s[6] !== _ ? (n = /* @__PURE__ */ p.jsx("span", { className: m.highlighted, children: _ }), s[6] = _, s[7] = n) : n = s[7];
  let e;
  s[8] !== l ? (e = /* @__PURE__ */ p.jsx("span", { className: m.remaining, children: l }), s[8] = l, s[9] = e) : e = s[9];
  let o;
  return s[10] !== n || s[11] !== e ? (o = /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
    n,
    e
  ] }), s[10] = n, s[11] = e, s[12] = o) : o = s[12], o;
};
function N(i) {
  return i.progress;
}
const k = "_container_131iy_4", z = "_inputRow_131iy_10", F = "_solutionRow_131iy_17", b = "_input_131iy_10", L = "_answerFormula_131iy_27", B = "_prefix_131iy_31", S = "_suffix_131iy_32", D = "_stack_131iy_56", E = "_inline_131iy_62", U = "_fieldLabel_131iy_69", A = {
  container: k,
  inputRow: z,
  solutionRow: F,
  input: b,
  answerFormula: L,
  prefix: B,
  suffix: S,
  stack: D,
  inline: E,
  fieldLabel: U
};
export {
  v as T,
  T as m,
  A as s
};
