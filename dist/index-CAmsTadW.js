import { c as A, j as l, i as M, r as w, p as L, k, M as H, s as $, g as D, a as b, e as O, h as z } from "./index-y5-JRyys.js";
import { S as K, a as P } from "./solution-answer-panel-DWkZlDnj.js";
const N = {
  text_before: "textBefore",
  text_after: "textAfter",
  image_before: "imageBefore",
  table_before: "tableBefore",
  with_audio: "withAudio"
}, U = (s) => N[s] ? N[s] : s.includes("_") ? s.replace(/_([a-z])/g, (e, o) => o.toUpperCase()) : s, I = (s) => {
  const e = {};
  for (const [o, t] of Object.entries(s))
    e[U(o)] = t;
  return e;
}, q = "_root_p4uhv_4", G = "_textBefore_p4uhv_10", J = "_textAfter_p4uhv_11", Q = "_imageBefore_p4uhv_16", V = "_images_p4uhv_17", W = "_container_p4uhv_29", X = "_side_p4uhv_38", Y = "_svgSide_p4uhv_53", Z = "_input_p4uhv_58", ee = "_answerFormula_p4uhv_82", _ = {
  root: q,
  textBefore: G,
  textAfter: J,
  imageBefore: Q,
  images: V,
  container: W,
  side: X,
  svgSide: Y,
  input: Z,
  answerFormula: ee
}, y = (s, e) => s == null || s === "" ? "" : M(s) ? e(s) : typeof s == "string" ? s : "", F = (s) => {
  const e = A.c(15), {
    description: o,
    deps: t
  } = s;
  let i, n, c, g;
  if (e[0] !== t || e[1] !== o) {
    const r = I(o);
    let p;
    e[6] !== t ? (p = (h) => t.global.translateTasks(h), e[6] = t, e[7] = p) : p = e[7];
    const m = p, d = y(r.textBefore, m);
    g = y(r.textAfter, m);
    const u = typeof r.imageBefore == "string" && r.imageBefore.trim() ? r.imageBefore : "", x = Array.isArray(r.images) ? r.images.filter(te) : [];
    i = d ? /* @__PURE__ */ l.jsx(w, { className: _.textBefore, children: d }) : null, n = u ? /* @__PURE__ */ l.jsx("div", { className: _.imageBefore, dangerouslySetInnerHTML: {
      __html: u
    } }) : null, c = x.length > 0 ? /* @__PURE__ */ l.jsx("div", { className: _.images, children: x.map(se) }) : null, e[0] = t, e[1] = o, e[2] = i, e[3] = n, e[4] = c, e[5] = g;
  } else
    i = e[2], n = e[3], c = e[4], g = e[5];
  let f;
  e[8] !== g ? (f = g ? /* @__PURE__ */ l.jsx(w, { className: _.textAfter, children: g }) : null, e[8] = g, e[9] = f) : f = e[9];
  let a;
  return e[10] !== i || e[11] !== n || e[12] !== c || e[13] !== f ? (a = /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    i,
    n,
    c,
    f
  ] }), e[10] = i, e[11] = n, e[12] = c, e[13] = f, e[14] = a) : a = e[14], a;
};
function te(s) {
  return typeof s == "string" && s.trim();
}
function se(s, e) {
  return /* @__PURE__ */ l.jsx("div", { dangerouslySetInnerHTML: {
    __html: s
  } }, e);
}
const T = (s, e) => {
  if (s == null) return "";
  let o = "";
  return typeof s == "number" ? o = String(s) : typeof s == "string" ? o = s : M(s) && (o = e(s)), L(o);
}, R = (s) => {
  const e = A.c(27), {
    description: o,
    deps: t,
    answer: i,
    mode: n,
    onChange: c,
    mathInputRef: g
  } = s;
  let f, a, r, p;
  if (e[0] !== t || e[1] !== o) {
    const v = I(o);
    let B;
    e[6] !== t ? (B = (E) => t.global.translateTasks(E), e[6] = t, e[7] = B) : B = e[7];
    const C = B;
    f = T(v.first, C), a = T(v.second, C), r = typeof v.svg1 == "string" && v.svg1.trim() ? v.svg1 : "", p = typeof v.svg2 == "string" && v.svg2.trim() ? v.svg2 : "", e[0] = t, e[1] = o, e[2] = f, e[3] = a, e[4] = r, e[5] = p;
  } else
    f = e[2], a = e[3], r = e[4], p = e[5];
  const m = p;
  let d;
  e[8] !== r ? (d = r ? /* @__PURE__ */ l.jsx("div", { className: _.svgSide, dangerouslySetInnerHTML: {
    __html: r
  } }) : null, e[8] = r, e[9] = d) : d = e[9];
  let u;
  e[10] !== f ? (u = /* @__PURE__ */ l.jsx("div", { className: _.side, "data-testid": "comparison-first", children: /* @__PURE__ */ l.jsx(w, { children: f }) }), e[10] = f, e[11] = u) : u = e[11];
  let x;
  e[12] !== i || e[13] !== g || e[14] !== n || e[15] !== c ? (x = n === "input" ? /* @__PURE__ */ l.jsx(k, { ref: g, formula: i, onMathFieldChanged: c, className: _.input }) : /* @__PURE__ */ l.jsx(H, { className: _.answerFormula, children: $(i) }), e[12] = i, e[13] = g, e[14] = n, e[15] = c, e[16] = x) : x = e[16];
  let h;
  e[17] !== a ? (h = /* @__PURE__ */ l.jsx("div", { className: _.side, "data-testid": "comparison-second", children: /* @__PURE__ */ l.jsx(w, { children: a }) }), e[17] = a, e[18] = h) : h = e[18];
  let j;
  e[19] !== m ? (j = m ? /* @__PURE__ */ l.jsx("div", { className: _.svgSide, dangerouslySetInnerHTML: {
    __html: m
  } }) : null, e[19] = m, e[20] = j) : j = e[20];
  let S;
  return e[21] !== d || e[22] !== u || e[23] !== x || e[24] !== h || e[25] !== j ? (S = /* @__PURE__ */ l.jsxs("div", { className: _.container, "data-testid": "comparison-row", children: [
    d,
    u,
    x,
    h,
    j
  ] }), e[21] = d, e[22] = u, e[23] = x, e[24] = h, e[25] = j, e[26] = S) : S = e[26], S;
}, ie = (s) => {
  const e = A.c(28), {
    task: o,
    deps: t,
    answer: i,
    solution: n
  } = s;
  let c;
  e[0] !== t ? (c = (x) => t.global.translateTasks(x), e[0] = t, e[1] = c) : c = e[1];
  let g;
  e[2] !== n || e[3] !== c ? (g = D(n, c), e[2] = n, e[3] = c, e[4] = g) : g = e[4];
  const f = g;
  let a;
  e[5] !== t || e[6] !== o.title ? (a = /* @__PURE__ */ l.jsx(b, { title: o.title, deps: t }), e[5] = t, e[6] = o.title, e[7] = a) : a = e[7];
  let r;
  e[8] !== t || e[9] !== o.description ? (r = /* @__PURE__ */ l.jsx(F, { description: o.description, deps: t }), e[8] = t, e[9] = o.description, e[10] = r) : r = e[10];
  let p;
  e[11] !== i || e[12] !== f || e[13] !== t ? (p = /* @__PURE__ */ l.jsx(K, { userAnswer: i, correctAnswer: f, deps: t }), e[11] = i, e[12] = f, e[13] = t, e[14] = p) : p = e[14];
  let m;
  e[15] !== f || e[16] !== t || e[17] !== o.description ? (m = /* @__PURE__ */ l.jsx(R, { description: o.description, deps: t, answer: f, mode: "solution" }), e[15] = f, e[16] = t, e[17] = o.description, e[18] = m) : m = e[18];
  let d;
  e[19] !== t || e[20] !== n ? (d = /* @__PURE__ */ l.jsx(P, { solution: n, deps: t }), e[19] = t, e[20] = n, e[21] = d) : d = e[21];
  let u;
  return e[22] !== a || e[23] !== r || e[24] !== p || e[25] !== m || e[26] !== d ? (u = /* @__PURE__ */ l.jsxs("div", { className: _.root, children: [
    a,
    r,
    p,
    m,
    d
  ] }), e[22] = a, e[23] = r, e[24] = p, e[25] = m, e[26] = d, e[27] = u) : u = e[27], u;
}, ne = ({
  id: s
}) => {
  const e = (o) => {
    const t = A.c(22), {
      task: i,
      deps: n,
      answer: c,
      onChange: g,
      mathInput: f
    } = o;
    if (O(i.solution)) {
      let u;
      return t[0] !== c || t[1] !== n || t[2] !== i ? (u = /* @__PURE__ */ l.jsx(ie, { task: i, deps: n, answer: c, solution: i.solution }), t[0] = c, t[1] = n, t[2] = i, t[3] = u) : u = t[3], u;
    }
    let a;
    t[4] !== n || t[5] !== i.title ? (a = /* @__PURE__ */ l.jsx(b, { title: i.title, deps: n }), t[4] = n, t[5] = i.title, t[6] = a) : a = t[6];
    let r;
    t[7] !== n || t[8] !== i.description ? (r = /* @__PURE__ */ l.jsx(F, { description: i.description, deps: n }), t[7] = n, t[8] = i.description, t[9] = r) : r = t[9];
    let p;
    t[10] !== f ? (p = (u) => z(u, f), t[10] = f, t[11] = p) : p = t[11];
    let m;
    t[12] !== c || t[13] !== n || t[14] !== g || t[15] !== p || t[16] !== i.description ? (m = /* @__PURE__ */ l.jsx(R, { description: i.description, deps: n, answer: c, mode: "input", onChange: g, mathInputRef: p }), t[12] = c, t[13] = n, t[14] = g, t[15] = p, t[16] = i.description, t[17] = m) : m = t[17];
    let d;
    return t[18] !== a || t[19] !== r || t[20] !== m ? (d = /* @__PURE__ */ l.jsxs("div", { className: _.root, "data-template-id": s, children: [
      a,
      r,
      m
    ] }), t[18] = a, t[19] = r, t[20] = m, t[21] = d) : d = t[21], d;
  };
  return e.displayName = s, e;
}, le = ne({
  id: "comparison.plain"
});
export {
  le as ComparisonPlain,
  le as default
};
