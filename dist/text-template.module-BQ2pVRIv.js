import { u as x, c as m, o as d, p as g, q as w, f as j, j as h, r as k } from "./index-DwDfo0zf.js";
import { u as F, s as f } from "./task-description.module-Dzl2kOM1.js";
const R = (n) => n.includes("^") ? n.split(/(\\\([\s\S]*?\\\)|\$[^$]*\$)/).map((t) => t.startsWith("\\(") || t.startsWith("$") ? t : t.replace(/([^\s\\]*\^[0-9]+)/g, (c) => `\\(${x(c)}\\)`)).join("") : n, $ = (n, s) => s ? R(n) : n, A = (n) => {
  const s = m.c(12), {
    task: t,
    deps: c,
    className: r,
    normalizeBareMath: p
  } = n, u = p === void 0 ? !1 : p, l = F(M);
  let a;
  s[0] !== c || s[1] !== u || s[2] !== t ? (a = d(g($(w(t, c), u))), s[0] = c, s[1] = u, s[2] = t, s[3] = a) : a = s[3];
  const i = a;
  let e;
  s[4] !== r ? (e = j(f.container, r), s[4] = r, s[5] = e) : e = s[5];
  let o;
  s[6] !== l || s[7] !== i ? (o = l ? /* @__PURE__ */ h.jsx(T, { text: i, progress: l }) : i, s[6] = l, s[7] = i, s[8] = o) : o = s[8];
  let _;
  return s[9] !== e || s[10] !== o ? (_ = /* @__PURE__ */ h.jsx(k, { className: e, children: o }), s[9] = e, s[10] = o, s[11] = _) : _ = s[11], _;
}, T = (n) => {
  const s = m.c(13), {
    text: t,
    progress: c
  } = n, r = Math.floor(t.length * c);
  let p;
  s[0] !== r || s[1] !== t ? (p = t.slice(0, r), s[0] = r, s[1] = t, s[2] = p) : p = s[2];
  const u = p;
  let l;
  s[3] !== r || s[4] !== t ? (l = t.slice(r), s[3] = r, s[4] = t, s[5] = l) : l = s[5];
  const a = l;
  let i;
  s[6] !== u ? (i = /* @__PURE__ */ h.jsx("span", { className: f.highlighted, children: u }), s[6] = u, s[7] = i) : i = s[7];
  let e;
  s[8] !== a ? (e = /* @__PURE__ */ h.jsx("span", { className: f.remaining, children: a }), s[8] = a, s[9] = e) : e = s[9];
  let o;
  return s[10] !== i || s[11] !== e ? (o = /* @__PURE__ */ h.jsxs(h.Fragment, { children: [
    i,
    e
  ] }), s[10] = i, s[11] = e, s[12] = o) : o = s[12], o;
};
function M(n) {
  return n.progress;
}
const N = "_container_5ho2p_4", z = "_inputRow_5ho2p_10", b = "_solutionRow_5ho2p_17", y = "_input_5ho2p_10", L = "_inputFull_5ho2p_26", B = "_answerFormula_5ho2p_32", G = "_prefix_5ho2p_36", S = "_suffix_5ho2p_37", D = "_stack_5ho2p_61", E = "_inline_5ho2p_67", U = "_fieldLabel_5ho2p_74", W = "_stackGrid_5ho2p_79", I = {
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
