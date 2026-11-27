var D = Object.defineProperty, U = Object.defineProperties;
var X = Object.getOwnPropertyDescriptors;
var O = Object.getOwnPropertySymbols;
var Q = Object.prototype.hasOwnProperty, Z = Object.prototype.propertyIsEnumerable;
var z = (a, e, s) => e in a ? D(a, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : a[e] = s, $ = (a, e) => {
  for (var s in e || (e = {}))
    Q.call(e, s) && z(a, s, e[s]);
  if (O)
    for (var s of O(e))
      Z.call(e, s) && z(a, s, e[s]);
  return a;
}, G = (a, e) => U(a, X(e));
import { c as T, j as b, a5 as C, R as J, U as V, a6 as Y, a7 as ee, a8 as te, f as w, a9 as se, aa as ie, r as ne, ab as ae, ac as re, ad as le, ae as oe, o as F, i as ce, af as M, ag as ue, ah as P, a as B, e as de, ai as pe, aj as fe, ak as ge } from "./index-wRluoD-s.js";
import { S as me } from "./shared-solution-body-9WuuvhSD.js";
import { S as be } from "./solution-answer-panel-BnG30GAS.js";
const he = "_container_1hhbp_2", ye = "_question_1hhbp_8", xe = "_questionAfter_1hhbp_13", _e = "_figures_1hhbp_17", ve = "_table_1hhbp_23", je = "_figuresVertical_1hhbp_28", Ae = "_images_1hhbp_33", Te = "_radioGroup_1hhbp_50", ke = "_radioGroupHorizontal_1hhbp_54", qe = "_radioGroupWrap_1hhbp_60", A = {
  container: he,
  question: ye,
  questionAfter: xe,
  figures: _e,
  table: ve,
  figuresVertical: je,
  images: Ae,
  radioGroup: Te,
  radioGroupHorizontal: ke,
  radioGroupWrap: qe
}, I = (a) => {
  const e = T.c(32), {
    description: s,
    deps: t
  } = a;
  let n, i, u, g, d, f, c;
  if (e[0] !== t || e[1] !== s.background || e[2] !== s.figures || e[3] !== s.images || e[4] !== s.isFiguresVertical || e[5] !== s.table) {
    c = Symbol.for("react.early_return_sentinel");
    e: {
      const l = Array.isArray(s.images) ? s.images.filter(Se) : [];
      let o;
      e[13] !== s.figures ? (o = Array.isArray(s.figures) ? s.figures : [], e[13] = s.figures, e[14] = o) : o = e[14], n = o;
      const h = !!s.isFiguresVertical, m = s.table && typeof s.table == "object" ? s.table : null;
      if (!l.length && !n.length && !s.background && !m) {
        c = null;
        break e;
      }
      i = `${A.figures} ${h ? A.figuresVertical : ""}`, u = "test-figures", e[15] !== s.background ? (g = s.background ? /* @__PURE__ */ b.jsx("div", { dangerouslySetInnerHTML: {
        __html: s.background
      } }) : null, e[15] = s.background, e[16] = g) : g = e[16], e[17] !== t || e[18] !== m ? (d = m ? /* @__PURE__ */ b.jsx("div", { className: A.table, "data-testid": "test-table", children: C(G($({}, m), {
        type: 120
      }), t, -1) }) : null, e[17] = t, e[18] = m, e[19] = d) : d = e[19], f = l.length > 0 ? /* @__PURE__ */ b.jsx("div", { className: A.images, children: l.map(Ne) }) : null;
    }
    e[0] = t, e[1] = s.background, e[2] = s.figures, e[3] = s.images, e[4] = s.isFiguresVertical, e[5] = s.table, e[6] = n, e[7] = i, e[8] = u, e[9] = g, e[10] = d, e[11] = f, e[12] = c;
  } else
    n = e[6], i = e[7], u = e[8], g = e[9], d = e[10], f = e[11], c = e[12];
  if (c !== Symbol.for("react.early_return_sentinel"))
    return c;
  let p;
  if (e[20] !== t || e[21] !== n) {
    let l;
    e[23] !== t ? (l = (o, h) => {
      const m = J(o);
      switch (Number(m.type)) {
        case V.Text:
          return /* @__PURE__ */ b.jsx(te, { part: m, deps: t }, h);
        case V.Image:
          return /* @__PURE__ */ b.jsx(ee, { part: m, deps: t }, h);
        case V.AngleList:
          return /* @__PURE__ */ b.jsx(Y, { part: m }, h);
        default:
          return C(m, t, h);
      }
    }, e[23] = t, e[24] = l) : l = e[24], p = n.map(l), e[20] = t, e[21] = n, e[22] = p;
  } else
    p = e[22];
  let r;
  return e[25] !== i || e[26] !== u || e[27] !== g || e[28] !== d || e[29] !== f || e[30] !== p ? (r = /* @__PURE__ */ b.jsxs("div", { className: i, "data-testid": u, children: [
    g,
    d,
    f,
    p
  ] }), e[25] = i, e[26] = u, e[27] = g, e[28] = d, e[29] = f, e[30] = p, e[31] = r) : r = e[31], r;
};
function Se(a) {
  return typeof a == "string" && a.trim();
}
function Ne(a, e) {
  return /* @__PURE__ */ b.jsx("div", { dangerouslySetInnerHTML: {
    __html: a
  } }, e);
}
const $e = "_container_531kj_1", Ge = {
  container: $e
}, Ve = (a) => {
  const e = T.c(19), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    disabled: u,
    readOnly: g,
    className: d,
    ariaLabel: f
  } = a, c = u === void 0 ? !1 : u, p = g === void 0 ? !1 : g;
  let r;
  e[0] !== d ? (r = w(Ge.container, d), e[0] = d, e[1] = r) : r = e[1];
  let l;
  if (e[2] !== c || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== p || e[7] !== n) {
    let h;
    e[9] !== c || e[10] !== s || e[11] !== i || e[12] !== p || e[13] !== n ? (h = (m) => /* @__PURE__ */ b.jsx(se, { name: s, value: m.value, label: m.label, figure: m.figure, checked: n === m.value, onChange: () => i(m.value), disabled: c || m.disabled, readOnly: p }, m.value), e[9] = c, e[10] = s, e[11] = i, e[12] = p, e[13] = n, e[14] = h) : h = e[14], l = t.map(h), e[2] = c, e[3] = s, e[4] = i, e[5] = t, e[6] = p, e[7] = n, e[8] = l;
  } else
    l = e[8];
  let o;
  return e[15] !== f || e[16] !== r || e[17] !== l ? (o = /* @__PURE__ */ b.jsx("div", { className: r, role: "radiogroup", "aria-label": f, children: l }), e[15] = f, e[16] = r, e[17] = l, e[18] = o) : o = e[18], o;
}, Ce = (a) => {
  if (!(a instanceof HTMLElement)) return !1;
  if (a.isContentEditable || a.tagName === "TEXTAREA") return !0;
  if (a.tagName !== "INPUT") return !1;
  const e = a.type;
  return e !== "radio" && e !== "checkbox" && e !== "button";
}, we = (a) => {
  const e = /^Key([A-Z])$/.exec(a);
  if (e) return e[1].charCodeAt(0) - 65;
  const s = /^(?:Digit|Numpad)([1-9])$/.exec(a);
  return s ? Number(s[1]) - 1 : -1;
}, Ee = (a) => {
  const e = T.c(9), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    multiple: u,
    enabled: g
  } = a, d = ie(He);
  let f, c;
  e[0] !== g || e[1] !== d || e[2] !== u || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== n ? (f = () => {
    if (!g || d)
      return;
    const p = (r) => {
      var x;
      if (r.defaultPrevented || r.isComposing || r.metaKey || r.ctrlKey || r.altKey || Ce(r.target))
        return;
      const l = we(r.code), o = t[l];
      if (!o)
        return;
      if (r.preventDefault(), (x = document.querySelector(`input[name="${CSS.escape(s)}"][value="${CSS.escape(o.value)}"]`)) == null || x.focus({
        preventScroll: !0
      }), !u) {
        i(o.value);
        return;
      }
      const h = ae(n), m = h.includes(o.value) ? h.filter((y) => y !== o.value) : [...h, o.value];
      i(re(t, m));
    };
    return document.addEventListener("keydown", p), () => document.removeEventListener("keydown", p);
  }, c = [g, d, s, t, n, i, u], e[0] = g, e[1] = d, e[2] = u, e[3] = s, e[4] = i, e[5] = t, e[6] = n, e[7] = f, e[8] = c) : (f = e[7], c = e[8]), ne.useEffect(f, c);
};
function He(a) {
  return a.taskList !== null;
}
const R = (a) => {
  const e = T.c(27), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    description: u,
    deps: g,
    disabled: d,
    readOnly: f,
    multiple: c,
    multipleHint: p
  } = a, r = d === void 0 ? !1 : d, l = f === void 0 ? !1 : f, o = c === void 0 ? !1 : c;
  let h;
  e[0] !== u.variants ? (h = Array.isArray(u.variants) ? u.variants : [], e[0] = u.variants, e[1] = h) : h = e[1];
  const m = h;
  let x;
  e[2] !== g || e[3] !== t || e[4] !== m ? (x = g ? t.map((E, H) => {
    const L = m[H];
    return le(L) ? G($({}, E), {
      figure: C(L, g, H)
    }) : E;
  }) : t, e[2] = g, e[3] = t, e[4] = m, e[5] = x) : x = e[5];
  const y = x, _ = !r && !l;
  let v;
  e[6] !== o || e[7] !== s || e[8] !== i || e[9] !== y || e[10] !== _ || e[11] !== n ? (v = {
    name: s,
    options: y,
    value: n,
    onChange: i,
    multiple: o,
    enabled: _
  }, e[6] = o, e[7] = s, e[8] = i, e[9] = y, e[10] = _, e[11] = n, e[12] = v) : v = e[12], Ee(v);
  const j = !!u.isHorizontal, q = !!u.isWrapVariants, N = j ? "horizontal" : "vertical";
  let k;
  e[13] !== r || e[14] !== j || e[15] !== o || e[16] !== p || e[17] !== s || e[18] !== i || e[19] !== y || e[20] !== l || e[21] !== n || e[22] !== q ? (k = o ? /* @__PURE__ */ b.jsx(oe, { className: w(A.radioGroup, j && A.radioGroupHorizontal, q && A.radioGroupWrap), name: s, options: y, value: n, onChange: i, disabled: r, readOnly: l, ariaLabel: "test-options", hint: p }) : /* @__PURE__ */ b.jsx(Ve, { className: w(A.radioGroup, j && A.radioGroupHorizontal, q && A.radioGroupWrap), name: s, options: y, value: n, onChange: i, disabled: r, readOnly: l, ariaLabel: "test-options" }), e[13] = r, e[14] = j, e[15] = o, e[16] = p, e[17] = s, e[18] = i, e[19] = y, e[20] = l, e[21] = n, e[22] = q, e[23] = k) : k = e[23];
  let S;
  return e[24] !== N || e[25] !== k ? (S = /* @__PURE__ */ b.jsx("div", { "data-testid": "test-options", "data-layout": N, children: k }), e[24] = N, e[25] = k, e[26] = S) : S = e[26], S;
}, K = (a, e) => a == null || a === "" ? "" : ce(a) ? e(a) : typeof a == "string" ? a : "", W = (a) => {
  const e = T.c(18), {
    description: s,
    deps: t
  } = a;
  let n;
  e[0] !== t ? (n = (o) => t.global.translateTasks(o), e[0] = t, e[1] = n) : n = e[1];
  const i = n;
  let u;
  e[2] !== s.question || e[3] !== i ? (u = K(s.question, i), e[2] = s.question, e[3] = i, e[4] = u) : u = e[4];
  const g = u;
  let d;
  e[5] !== s.questionAfter || e[6] !== i ? (d = K(s.questionAfter, i), e[5] = s.questionAfter, e[6] = i, e[7] = d) : d = e[7];
  const f = d;
  let c;
  e[8] !== s.questionAlign ? (c = {}, s.questionAlign && (c.textAlign = s.questionAlign), e[8] = s.questionAlign, e[9] = c) : c = e[9];
  let p;
  e[10] !== g || e[11] !== c ? (p = g ? /* @__PURE__ */ b.jsx("div", { className: A.question, "data-testid": "test-question", style: Object.keys(c).length > 0 ? c : void 0, children: /* @__PURE__ */ b.jsx(F, { children: g }) }) : null, e[10] = g, e[11] = c, e[12] = p) : p = e[12];
  let r;
  e[13] !== f ? (r = f ? /* @__PURE__ */ b.jsx("div", { className: A.questionAfter, children: /* @__PURE__ */ b.jsx(F, { children: f }) }) : null, e[13] = f, e[14] = r) : r = e[14];
  let l;
  return e[15] !== p || e[16] !== r ? (l = /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
    p,
    r
  ] }), e[15] = p, e[16] = r, e[17] = l) : l = e[17], l;
}, Le = (a) => {
  const e = T.c(37), {
    task: s,
    deps: t,
    answer: n,
    solution: i
  } = a;
  let u;
  e[0] !== t ? (u = (j) => t.global.translateTasks(j), e[0] = t, e[1] = u) : u = e[1];
  const g = u;
  let d, f, c, p;
  e[2] !== n || e[3] !== i || e[4] !== s.description || e[5] !== g ? (f = M(s.description.variants, g), d = ue(s.description, i, g), p = P(f, n), c = P(f, d), e[2] = n, e[3] = i, e[4] = s.description, e[5] = g, e[6] = d, e[7] = f, e[8] = c, e[9] = p) : (d = e[6], f = e[7], c = e[8], p = e[9]);
  const r = c;
  let l;
  e[10] !== t || e[11] !== s.title ? (l = /* @__PURE__ */ b.jsx(B, { title: s.title, deps: t }), e[10] = t, e[11] = s.title, e[12] = l) : l = e[12];
  let o, h;
  e[13] !== t || e[14] !== s.description ? (o = /* @__PURE__ */ b.jsx(W, { description: s.description, deps: t }), h = /* @__PURE__ */ b.jsx(I, { description: s.description, deps: t }), e[13] = t, e[14] = s.description, e[15] = o, e[16] = h) : (o = e[15], h = e[16]);
  let m;
  e[17] !== r || e[18] !== t || e[19] !== p ? (m = /* @__PURE__ */ b.jsx(be, { userAnswer: p, correctAnswer: r, deps: t }), e[17] = r, e[18] = t, e[19] = p, e[20] = m) : m = e[20];
  const x = `${s.id}-solution`;
  let y;
  e[21] !== d || e[22] !== t || e[23] !== f || e[24] !== x || e[25] !== s.description ? (y = /* @__PURE__ */ b.jsx(R, { name: x, options: f, value: d, onChange: Oe, description: s.description, deps: t, readOnly: !0 }), e[21] = d, e[22] = t, e[23] = f, e[24] = x, e[25] = s.description, e[26] = y) : y = e[26];
  let _;
  e[27] !== t || e[28] !== i ? (_ = /* @__PURE__ */ b.jsx(me, { solution: i, deps: t }), e[27] = t, e[28] = i, e[29] = _) : _ = e[29];
  let v;
  return e[30] !== l || e[31] !== o || e[32] !== h || e[33] !== m || e[34] !== y || e[35] !== _ ? (v = /* @__PURE__ */ b.jsxs("div", { className: A.container, children: [
    l,
    o,
    h,
    m,
    y,
    _
  ] }), e[30] = l, e[31] = o, e[32] = h, e[33] = m, e[34] = y, e[35] = _, e[36] = v) : v = e[36], v;
};
function Oe() {
}
const ze = (a) => {
  var e, s;
  return (s = (e = a.localize) == null ? void 0 : e.pickEveryFittingOption) != null ? s : fe(a.global, ge.pickEveryFittingOption);
}, Fe = ({
  id: a
}) => {
  const e = (s) => {
    const t = T.c(34), {
      task: n,
      deps: i,
      answer: u,
      onChange: g
    } = s;
    if (de(n.solution)) {
      let j;
      return t[0] !== u || t[1] !== i || t[2] !== n ? (j = /* @__PURE__ */ b.jsx(Le, { task: n, deps: i, answer: u, solution: n.solution }), t[0] = u, t[1] = i, t[2] = n, t[3] = j) : j = t[3], j;
    }
    let d;
    t[4] !== i ? (d = (j) => i.global.translateTasks(j), t[4] = i, t[5] = d) : d = t[5];
    const f = d;
    let c;
    t[6] !== n.description.variants || t[7] !== f ? (c = M(n.description.variants, f), t[6] = n.description.variants, t[7] = f, t[8] = c) : c = t[8];
    const p = c;
    let r;
    t[9] !== i || t[10] !== n.title ? (r = /* @__PURE__ */ b.jsx(B, { title: n.title, deps: i }), t[9] = i, t[10] = n.title, t[11] = r) : r = t[11];
    let l, o;
    t[12] !== i || t[13] !== n.description ? (l = /* @__PURE__ */ b.jsx(W, { description: n.description, deps: i }), o = /* @__PURE__ */ b.jsx(I, { description: n.description, deps: i }), t[12] = i, t[13] = n.description, t[14] = l, t[15] = o) : (l = t[14], o = t[15]);
    const h = String(n.id), m = n.description;
    let x;
    t[16] !== n ? (x = pe(n), t[16] = n, t[17] = x) : x = t[17];
    let y;
    t[18] !== i ? (y = ze(i), t[18] = i, t[19] = y) : y = t[19];
    let _;
    t[20] !== u || t[21] !== i || t[22] !== g || t[23] !== p || t[24] !== h || t[25] !== x || t[26] !== y || t[27] !== n.description ? (_ = /* @__PURE__ */ b.jsx(R, { name: h, options: p, value: u, onChange: g, description: m, deps: i, multiple: x, multipleHint: y }), t[20] = u, t[21] = i, t[22] = g, t[23] = p, t[24] = h, t[25] = x, t[26] = y, t[27] = n.description, t[28] = _) : _ = t[28];
    let v;
    return t[29] !== _ || t[30] !== r || t[31] !== l || t[32] !== o ? (v = /* @__PURE__ */ b.jsxs("div", { className: A.container, "data-template-id": a, children: [
      r,
      l,
      o,
      _
    ] }), t[29] = _, t[30] = r, t[31] = l, t[32] = o, t[33] = v) : v = t[33], v;
  };
  return e.displayName = a, e;
}, Ie = Fe({
  id: "test.plain"
});
export {
  Ie as TestPlain,
  Ie as default
};
