import { u as x, c as f, n as d, l as j, m as T, f as $, j as p, o as M } from "./index-wRluoD-s.js";
import { u as N, s as u } from "./task-description.module-DEz238H2.js";
const z = (i) => i.includes("^") ? i.split(/(\\\([\s\S]*?\\\)|\$[^$]*\$)/).map((e) => e.startsWith("\\(") || e.startsWith("$") ? e : e.replace(/([^\s\\]*\^[0-9]+)/g, (c) => `\\(${x(c)}\\)`)).join("") : i, y = (i, s) => s ? z(i) : i, E = (i) => {
  const s = f.c(12), {
    task: e,
    deps: c,
    className: a,
    normalizeBareMath: h
  } = i, m = h === void 0 ? !1 : h, l = N(S);
  let o;
  s[0] !== c || s[1] !== m || s[2] !== e ? (o = d(j(y(T(e, c), m))), s[0] = c, s[1] = m, s[2] = e, s[3] = o) : o = s[3];
  const r = o;
  let t;
  s[4] !== a ? (t = $(u.container, a), s[4] = a, s[5] = t) : t = s[5];
  let n;
  s[6] !== l || s[7] !== r ? (n = l ? /* @__PURE__ */ p.jsx(B, { text: r, progress: l }) : r, s[6] = l, s[7] = r, s[8] = n) : n = s[8];
  let g;
  return s[9] !== t || s[10] !== n ? (g = /* @__PURE__ */ p.jsx(M, { className: t, children: n }), s[9] = t, s[10] = n, s[11] = g) : g = s[11], g;
}, B = (i) => {
  const s = f.c(13), {
    text: e,
    progress: c
  } = i, a = Math.floor(e.length * c);
  let h;
  s[0] !== a || s[1] !== e ? (h = e.slice(0, a), s[0] = a, s[1] = e, s[2] = h) : h = s[2];
  const m = h;
  let l;
  s[3] !== a || s[4] !== e ? (l = e.slice(a), s[3] = a, s[4] = e, s[5] = l) : l = s[5];
  const o = l;
  let r;
  s[6] !== m ? (r = /* @__PURE__ */ p.jsx("span", { className: u.highlighted, children: m }), s[6] = m, s[7] = r) : r = s[7];
  let t;
  s[8] !== o ? (t = /* @__PURE__ */ p.jsx("span", { className: u.remaining, children: o }), s[8] = o, s[9] = t) : t = s[9];
  let n;
  return s[10] !== r || s[11] !== t ? (n = /* @__PURE__ */ p.jsxs(p.Fragment, { children: [
    r,
    t
  ] }), s[10] = r, s[11] = t, s[12] = n) : n = s[12], n;
};
function S(i) {
  return i.progress;
}
export {
  E as T,
  y as m
};
