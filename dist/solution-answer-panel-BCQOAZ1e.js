var L = Object.defineProperty;
var S = Object.getOwnPropertySymbols;
var P = Object.prototype.hasOwnProperty, R = Object.prototype.propertyIsEnumerable;
var v = (n, e, t) => e in n ? L(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, A = (n, e) => {
  for (var t in e || (e = {}))
    P.call(e, t) && v(n, t, e[t]);
  if (S)
    for (var t of S(e))
      R.call(e, t) && v(n, t, e[t]);
  return n;
};
import { c as C, t as E, v as U, w as k, j as r, C as $, f as N, S as z, r as M, x as T, d as F, y as D, z as H, M as W } from "./index-1rSmWLFL.js";
const Z = "_title_mswcm_1", q = "_container_mswcm_5", G = "_formula_mswcm_17", I = "_textBlock_mswcm_23", J = "_textAfterComplex_mswcm_27", j = {
  title: Z,
  container: q,
  formula: G,
  textBlock: I,
  textAfterComplex: J
}, B = (n) => /* @__PURE__ */ r.jsx(z, { content: n, formulaClassName: j.formula }), K = (n) => {
  const e = C.c(27), {
    solution: t,
    deps: s
  } = n;
  let u;
  e[0] !== s.global ? (u = E(s.global)("explanation"), e[0] = s.global, e[1] = u) : u = e[1];
  const a = u;
  if (typeof t == "object" && t !== null && t.error) {
    let o;
    e[2] !== s.global || e[3] !== t.error ? (o = typeof t.error == "string" ? t.error : s.global.translateTasks(t.error), e[2] = s.global, e[3] = t.error, e[4] = o) : o = e[4];
    const l = o;
    let i;
    return e[5] !== l ? (i = /* @__PURE__ */ r.jsx("div", { className: j.container, children: /* @__PURE__ */ r.jsx(M, { inline: !0, children: l }) }), e[5] = l, e[6] = i) : i = e[6], i;
  }
  if (U(t)) {
    let o;
    e[7] !== a ? (o = /* @__PURE__ */ r.jsx("p", { className: j.title, children: a }), e[7] = a, e[8] = o) : o = e[8];
    let l;
    e[9] !== t ? (l = B(t), e[9] = t, e[10] = l) : l = e[10];
    let i;
    return e[11] !== o || e[12] !== l ? (i = /* @__PURE__ */ r.jsxs("div", { className: j.container, children: [
      o,
      l
    ] }), e[11] = o, e[12] = l, e[13] = i) : i = e[13], i;
  }
  if (typeof t != "object" || t === null)
    return null;
  let f;
  e[14] !== s.global || e[15] !== t ? (f = !k(t) && t.content && (typeof t.content == "string" ? t.content : s.global.translateTasks(t.content)), e[14] = s.global, e[15] = t, e[16] = f) : f = e[16];
  const c = f;
  let h, m;
  if (e[17] !== s || e[18] !== c || e[19] !== t || e[20] !== a) {
    m = Symbol.for("react.early_return_sentinel");
    e: {
      const o = k(t);
      let l;
      e[23] !== c ? (l = typeof c == "string" && c.trim(), e[23] = c, e[24] = l) : l = e[24];
      const i = !!l;
      if (!o && !i) {
        m = null;
        break e;
      }
      let g;
      e[25] !== a ? (g = /* @__PURE__ */ r.jsx("p", { className: j.title, children: a }), e[25] = a, e[26] = g) : g = e[26], h = /* @__PURE__ */ r.jsxs("div", { className: j.container, children: [
        g,
        o && /* @__PURE__ */ r.jsx($, { parts: t.parts, deps: s }),
        i && /* @__PURE__ */ r.jsx("div", { className: N(j.textBlock, o && j.textAfterComplex), children: B(c) })
      ] });
    }
    e[17] = s, e[18] = c, e[19] = t, e[20] = a, e[21] = h, e[22] = m;
  } else
    h = e[21], m = e[22];
  return m !== Symbol.for("react.early_return_sentinel") ? m : h;
}, O = (n) => n && typeof n == "object" && "parts" in n && Array.isArray(n.parts) && n.parts.length > 0 ? n.parts : null, fe = (n) => {
  const e = C.c(8), {
    solution: t,
    deps: s,
    suppressFreeTextContent: u
  } = n;
  if (u)
    return null;
  let a;
  e[0] !== t ? (a = O(t), e[0] = t, e[1] = a) : a = e[1];
  const f = a;
  if (f) {
    let h;
    return e[2] !== s || e[3] !== f ? (h = /* @__PURE__ */ r.jsx($, { parts: f, deps: s }), e[2] = s, e[3] = f, e[4] = h) : h = e[4], h;
  }
  let c;
  return e[5] !== s || e[6] !== t ? (c = /* @__PURE__ */ r.jsx(K, { solution: t, deps: s }), e[5] = s, e[6] = t, e[7] = c) : c = e[7], c;
}, Q = (n) => /* @__PURE__ */ T.createElement("svg", A({ width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, n), /* @__PURE__ */ T.createElement("path", { d: "M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", stroke: "#0066FE", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })), V = "_container_1scfb_2", X = "_highlight_1scfb_2", Y = "_highlightCenter_1scfb_25", ee = "_label_1scfb_29", te = "_answer_1scfb_34", se = "_userAnswer_1scfb_48", le = "_ellipsis_1scfb_59", ne = "_unit_1scfb_63", re = "_delimeter_1scfb_70", oe = "_icon_1scfb_75", x = {
  container: V,
  highlight: X,
  highlightCenter: Y,
  label: ee,
  answer: te,
  userAnswer: se,
  ellipsis: le,
  unit: ne,
  delimeter: re,
  icon: oe
}, ie = (n) => {
  const e = C.c(19), {
    text: t,
    label: s,
    unit: u,
    alignCenter: a
  } = n, {
    rowRef: f,
    displayText: c,
    truncated: h,
    onTypesetDone: m
  } = D(x.userAnswer, t), o = a && x.highlightCenter;
  let l;
  e[0] !== o ? (l = N(x.highlight, o), e[0] = o, e[1] = l) : l = e[1];
  let i;
  e[2] === Symbol.for("react.memo_cache_sentinel") ? (i = /* @__PURE__ */ r.jsx(H, { className: x.icon }), e[2] = i) : i = e[2];
  let g;
  e[3] !== s ? (g = /* @__PURE__ */ r.jsx("span", { className: x.label, children: s }), e[3] = s, e[4] = g) : g = e[4];
  let d;
  e[5] !== c || e[6] !== m ? (d = /* @__PURE__ */ r.jsx(W, { className: x.userAnswer, onTypeset: m, children: c }), e[5] = c, e[6] = m, e[7] = d) : d = e[7];
  let p;
  e[8] !== h ? (p = h && /* @__PURE__ */ r.jsx("span", { className: x.ellipsis, "aria-hidden": "true", children: "…" }), e[8] = h, e[9] = p) : p = e[9];
  let _;
  e[10] !== u ? (_ = u ? /* @__PURE__ */ r.jsx(F, { "data-testid": "answer-unit", className: x.unit, value: u }) : null, e[10] = u, e[11] = _) : _ = e[11];
  let b;
  return e[12] !== f || e[13] !== l || e[14] !== g || e[15] !== d || e[16] !== p || e[17] !== _ ? (b = /* @__PURE__ */ r.jsxs("div", { ref: f, "data-testid": "user-answer-highlight", className: l, children: [
    i,
    g,
    d,
    p,
    _
  ] }), e[12] = f, e[13] = l, e[14] = g, e[15] = d, e[16] = p, e[17] = _, e[18] = b) : b = e[18], b;
}, he = (n) => {
  const e = C.c(27), {
    userAnswer: t,
    correctAnswer: s,
    correctLabel: u,
    unit: a,
    deps: f,
    alignCenter: c
  } = n;
  let h;
  e[0] !== t ? (h = t == null ? void 0 : t.trim(), e[0] = t, e[1] = h) : h = e[1];
  const m = !!h;
  let o;
  e[2] !== s ? (o = s == null ? void 0 : s.trim(), e[2] = s, e[3] = o) : o = e[3];
  const l = !!o;
  if (!m && !l)
    return null;
  let i;
  e[4] !== s || e[5] !== u || e[6] !== f.global ? (i = u != null ? u : f.global.translateTasks(s), e[4] = s, e[5] = u, e[6] = f.global, e[7] = i) : i = e[7];
  const g = i;
  let d, p, _, b;
  if (e[8] !== c || e[9] !== f.global || e[10] !== g || e[11] !== l || e[12] !== m || e[13] !== a || e[14] !== t) {
    const y = E(f.global);
    d = x.container, p = m && /* @__PURE__ */ r.jsx(ie, { text: t, label: y("yourAnswer"), unit: a, alignCenter: c }), e[19] !== l || e[20] !== m ? (_ = m && l && /* @__PURE__ */ r.jsx("hr", { className: x.delimeter }), e[19] = l, e[20] = m, e[21] = _) : _ = e[21], b = l && /* @__PURE__ */ r.jsxs("div", { className: N(x.highlight, c && x.highlightCenter), children: [
      /* @__PURE__ */ r.jsx(Q, { className: x.icon }),
      /* @__PURE__ */ r.jsx("span", { className: x.label, children: y("correctAnswer") }),
      /* @__PURE__ */ r.jsx(M, { inline: !0, className: x.answer, children: g }),
      a ? /* @__PURE__ */ r.jsx(F, { "data-testid": "answer-unit", className: x.unit, value: a }) : null
    ] }), e[8] = c, e[9] = f.global, e[10] = g, e[11] = l, e[12] = m, e[13] = a, e[14] = t, e[15] = d, e[16] = p, e[17] = _, e[18] = b;
  } else
    d = e[15], p = e[16], _ = e[17], b = e[18];
  let w;
  return e[22] !== d || e[23] !== p || e[24] !== _ || e[25] !== b ? (w = /* @__PURE__ */ r.jsxs("div", { className: d, children: [
    p,
    _,
    b
  ] }), e[22] = d, e[23] = p, e[24] = _, e[25] = b, e[26] = w) : w = e[26], w;
};
export {
  he as S,
  fe as a
};
