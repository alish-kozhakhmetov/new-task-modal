import { c as A, j as l, i as M, r as w, p as L, k, M as H, s as $, g as D, a as b, e as O, h as z } from "./index-DwDfo0zf.js";
import { S as K, a as P } from "./solution-answer-panel-DNRF1AHT.js";
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
}, q = "_root_1mgs6_4", G = "_textBefore_1mgs6_10", J = "_textAfter_1mgs6_11", Q = "_imageBefore_1mgs6_16", V = "_images_1mgs6_17", W = "_container_1mgs6_29", X = "_side_1mgs6_38", Y = "_svgSide_1mgs6_53", Z = "_input_1mgs6_58", ee = "_answerFormula_1mgs6_82", _ = {
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
    let f;
    e[6] !== t ? (f = (h) => t.global.translateTasks(h), e[6] = t, e[7] = f) : f = e[7];
    const d = f, p = y(r.textBefore, d);
    g = y(r.textAfter, d);
    const u = typeof r.imageBefore == "string" && r.imageBefore.trim() ? r.imageBefore : "", x = Array.isArray(r.images) ? r.images.filter(te) : [];
    i = p ? /* @__PURE__ */ l.jsx(w, { className: _.textBefore, children: p }) : null, n = u ? /* @__PURE__ */ l.jsx("div", { className: _.imageBefore, dangerouslySetInnerHTML: {
      __html: u
    } }) : null, c = x.length > 0 ? /* @__PURE__ */ l.jsx("div", { className: _.images, children: x.map(se) }) : null, e[0] = t, e[1] = o, e[2] = i, e[3] = n, e[4] = c, e[5] = g;
  } else
    i = e[2], n = e[3], c = e[4], g = e[5];
  let m;
  e[8] !== g ? (m = g ? /* @__PURE__ */ l.jsx(w, { className: _.textAfter, children: g }) : null, e[8] = g, e[9] = m) : m = e[9];
  let a;
  return e[10] !== i || e[11] !== n || e[12] !== c || e[13] !== m ? (a = /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    i,
    n,
    c,
    m
  ] }), e[10] = i, e[11] = n, e[12] = c, e[13] = m, e[14] = a) : a = e[14], a;
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
  let m, a, r, f;
  if (e[0] !== t || e[1] !== o) {
    const j = I(o);
    let B;
    e[6] !== t ? (B = (E) => t.global.translateTasks(E), e[6] = t, e[7] = B) : B = e[7];
    const C = B;
    m = T(j.first, C), a = T(j.second, C), r = typeof j.svg1 == "string" && j.svg1.trim() ? j.svg1 : "", f = typeof j.svg2 == "string" && j.svg2.trim() ? j.svg2 : "", e[0] = t, e[1] = o, e[2] = m, e[3] = a, e[4] = r, e[5] = f;
  } else
    m = e[2], a = e[3], r = e[4], f = e[5];
  const d = f;
  let p;
  e[8] !== r ? (p = r ? /* @__PURE__ */ l.jsx("div", { className: _.svgSide, dangerouslySetInnerHTML: {
    __html: r
  } }) : null, e[8] = r, e[9] = p) : p = e[9];
  let u;
  e[10] !== m ? (u = /* @__PURE__ */ l.jsx("div", { className: _.side, "data-testid": "comparison-first", children: /* @__PURE__ */ l.jsx(w, { children: m }) }), e[10] = m, e[11] = u) : u = e[11];
  let x;
  e[12] !== i || e[13] !== g || e[14] !== n || e[15] !== c ? (x = n === "input" ? /* @__PURE__ */ l.jsx(k, { ref: g, formula: i, onMathFieldChanged: c, className: _.input }) : /* @__PURE__ */ l.jsx(H, { className: _.answerFormula, children: $(i) }), e[12] = i, e[13] = g, e[14] = n, e[15] = c, e[16] = x) : x = e[16];
  let h;
  e[17] !== a ? (h = /* @__PURE__ */ l.jsx("div", { className: _.side, "data-testid": "comparison-second", children: /* @__PURE__ */ l.jsx(w, { children: a }) }), e[17] = a, e[18] = h) : h = e[18];
  let v;
  e[19] !== d ? (v = d ? /* @__PURE__ */ l.jsx("div", { className: _.svgSide, dangerouslySetInnerHTML: {
    __html: d
  } }) : null, e[19] = d, e[20] = v) : v = e[20];
  let S;
  return e[21] !== p || e[22] !== u || e[23] !== x || e[24] !== h || e[25] !== v ? (S = /* @__PURE__ */ l.jsxs("div", { className: _.container, "data-testid": "comparison-row", children: [
    p,
    u,
    x,
    h,
    v
  ] }), e[21] = p, e[22] = u, e[23] = x, e[24] = h, e[25] = v, e[26] = S) : S = e[26], S;
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
  const m = g;
  let a;
  e[5] !== t || e[6] !== o.title ? (a = /* @__PURE__ */ l.jsx(b, { title: o.title, deps: t }), e[5] = t, e[6] = o.title, e[7] = a) : a = e[7];
  let r;
  e[8] !== t || e[9] !== o.description ? (r = /* @__PURE__ */ l.jsx(F, { description: o.description, deps: t }), e[8] = t, e[9] = o.description, e[10] = r) : r = e[10];
  let f;
  e[11] !== i || e[12] !== m || e[13] !== t ? (f = /* @__PURE__ */ l.jsx(K, { userAnswer: i, correctAnswer: m, deps: t }), e[11] = i, e[12] = m, e[13] = t, e[14] = f) : f = e[14];
  let d;
  e[15] !== m || e[16] !== t || e[17] !== o.description ? (d = /* @__PURE__ */ l.jsx(R, { description: o.description, deps: t, answer: m, mode: "solution" }), e[15] = m, e[16] = t, e[17] = o.description, e[18] = d) : d = e[18];
  let p;
  e[19] !== t || e[20] !== n ? (p = /* @__PURE__ */ l.jsx(P, { solution: n, deps: t }), e[19] = t, e[20] = n, e[21] = p) : p = e[21];
  let u;
  return e[22] !== a || e[23] !== r || e[24] !== f || e[25] !== d || e[26] !== p ? (u = /* @__PURE__ */ l.jsxs("div", { className: _.root, children: [
    a,
    r,
    f,
    d,
    p
  ] }), e[22] = a, e[23] = r, e[24] = f, e[25] = d, e[26] = p, e[27] = u) : u = e[27], u;
}, ne = ({
  id: s
}) => {
  const e = (o) => {
    const t = A.c(22), {
      task: i,
      deps: n,
      answer: c,
      onChange: g,
      mathInput: m
    } = o;
    if (O(i.solution)) {
      let u;
      return t[0] !== c || t[1] !== n || t[2] !== i ? (u = /* @__PURE__ */ l.jsx(ie, { task: i, deps: n, answer: c, solution: i.solution }), t[0] = c, t[1] = n, t[2] = i, t[3] = u) : u = t[3], u;
    }
    let a;
    t[4] !== n || t[5] !== i.title ? (a = /* @__PURE__ */ l.jsx(b, { title: i.title, deps: n }), t[4] = n, t[5] = i.title, t[6] = a) : a = t[6];
    let r;
    t[7] !== n || t[8] !== i.description ? (r = /* @__PURE__ */ l.jsx(F, { description: i.description, deps: n }), t[7] = n, t[8] = i.description, t[9] = r) : r = t[9];
    let f;
    t[10] !== m ? (f = (u) => z(u, m), t[10] = m, t[11] = f) : f = t[11];
    let d;
    t[12] !== c || t[13] !== n || t[14] !== g || t[15] !== f || t[16] !== i.description ? (d = /* @__PURE__ */ l.jsx(R, { description: i.description, deps: n, answer: c, mode: "input", onChange: g, mathInputRef: f }), t[12] = c, t[13] = n, t[14] = g, t[15] = f, t[16] = i.description, t[17] = d) : d = t[17];
    let p;
    return t[18] !== a || t[19] !== r || t[20] !== d ? (p = /* @__PURE__ */ l.jsxs("div", { className: _.root, "data-template-id": s, children: [
      a,
      r,
      d
    ] }), t[18] = a, t[19] = r, t[20] = d, t[21] = p) : p = t[21], p;
  };
  return e.displayName = s, e;
}, le = ne({
  id: "comparison.plain"
});
export {
  le as ComparisonPlain,
  le as default
};
