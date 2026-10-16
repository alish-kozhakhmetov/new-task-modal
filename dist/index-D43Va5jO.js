import { c as N, j as d, P as U, Q as C, a0 as D, a1 as J, a2 as K, w as V, f as O, a3 as H, r as q, i as X, a4 as B, a5 as Y, a6 as S, a as w, e as Z } from "./index-DehSyVY_.js";
import { S as ee, a as te } from "./solution-answer-panel-CrjPyaWc.js";
const se = "_container_1iy8p_2", le = "_question_1iy8p_8", ie = "_questionAfter_1iy8p_13", ae = "_figures_1iy8p_17", ne = "_figuresVertical_1iy8p_23", oe = "_images_1iy8p_28", re = "_unsupported_1iy8p_39", ce = "_radioGroup_1iy8p_45", de = "_radioGroupHorizontal_1iy8p_49", ue = "_radioGroupWrap_1iy8p_55", j = {
  container: se,
  question: le,
  questionAfter: ie,
  figures: ae,
  figuresVertical: ne,
  images: oe,
  unsupported: re,
  radioGroup: ce,
  radioGroupHorizontal: de,
  radioGroupWrap: ue
}, z = (f) => {
  const e = N.c(25), {
    description: s,
    deps: t
  } = f;
  let l, i, _, g, p, u;
  if (e[0] !== s.background || e[1] !== s.figures || e[2] !== s.images || e[3] !== s.isFiguresVertical) {
    u = Symbol.for("react.early_return_sentinel");
    e: {
      const a = Array.isArray(s.images) ? s.images.filter(pe) : [];
      let n;
      e[10] !== s.figures ? (n = Array.isArray(s.figures) ? s.figures : [], e[10] = s.figures, e[11] = n) : n = e[11], l = n;
      const c = !!s.isFiguresVertical;
      if (!a.length && !l.length && !s.background) {
        u = null;
        break e;
      }
      i = `${j.figures} ${c ? j.figuresVertical : ""}`, _ = "test-figures", e[12] !== s.background ? (g = s.background ? /* @__PURE__ */ d.jsx("div", { dangerouslySetInnerHTML: {
        __html: s.background
      } }) : null, e[12] = s.background, e[13] = g) : g = e[13], p = a.length > 0 ? /* @__PURE__ */ d.jsx("div", { className: j.images, children: a.map(he) }) : null;
    }
    e[0] = s.background, e[1] = s.figures, e[2] = s.images, e[3] = s.isFiguresVertical, e[4] = l, e[5] = i, e[6] = _, e[7] = g, e[8] = p, e[9] = u;
  } else
    l = e[4], i = e[5], _ = e[6], g = e[7], p = e[8], u = e[9];
  if (u !== Symbol.for("react.early_return_sentinel"))
    return u;
  let o;
  if (e[14] !== t || e[15] !== l) {
    let a;
    e[17] !== t ? (a = (n, c) => {
      const b = U(n), h = Number(b.type);
      switch (h) {
        case C.Text:
          return /* @__PURE__ */ d.jsx(K, { part: b, deps: t }, c);
        case C.Image:
          return /* @__PURE__ */ d.jsx(J, { part: b, deps: t }, c);
        case C.AngleList:
          return /* @__PURE__ */ d.jsx(D, { part: b }, c);
        default:
          return /* @__PURE__ */ d.jsxs("p", { className: j.unsupported, children: [
            "Unsupported figure type ",
            h
          ] }, c);
      }
    }, e[17] = t, e[18] = a) : a = e[18], o = l.map(a), e[14] = t, e[15] = l, e[16] = o;
  } else
    o = e[16];
  let r;
  return e[19] !== i || e[20] !== _ || e[21] !== g || e[22] !== p || e[23] !== o ? (r = /* @__PURE__ */ d.jsxs("div", { className: i, "data-testid": _, children: [
    g,
    p,
    o
  ] }), e[19] = i, e[20] = _, e[21] = g, e[22] = p, e[23] = o, e[24] = r) : r = e[24], r;
};
function pe(f) {
  return typeof f == "string" && f.trim();
}
function he(f, e) {
  return /* @__PURE__ */ d.jsx("div", { dangerouslySetInnerHTML: {
    __html: f
  } }, e);
}
const fe = "_radioLabel_129ko_1", me = "_radioButton_129ko_5", _e = "_disabled_129ko_20", be = "_readOnly_129ko_20", ge = "_checked_129ko_24", xe = "_radioInput_129ko_39", ye = "_radioControl_129ko_52", ke = "_htmlLabel_129ko_95", T = {
  radioLabel: fe,
  radioButton: me,
  disabled: _e,
  readOnly: be,
  checked: ge,
  radioInput: xe,
  radioControl: ye,
  htmlLabel: ke
}, F = (f) => f.includes("svg") || f.includes("<div"), je = (f) => {
  const e = N.c(23), {
    name: s,
    value: t,
    label: l,
    checked: i,
    onChange: _,
    disabled: g,
    readOnly: p
  } = f, u = g === void 0 ? !1 : g, o = p === void 0 ? !1 : p, r = V.useId();
  let a, n;
  e[0] !== i || e[1] !== u || e[2] !== l || e[3] !== o ? (a = F(l), n = O(T.radioButton, i && T.checked, u && !o && T.disabled, o && T.readOnly, a && T.htmlLabel), e[0] = i, e[1] = u, e[2] = l, e[3] = o, e[4] = a, e[5] = n) : (a = e[4], n = e[5]);
  const c = u || o, b = a ? t : void 0;
  let h;
  e[6] !== i || e[7] !== r || e[8] !== s || e[9] !== _ || e[10] !== c || e[11] !== b || e[12] !== t ? (h = /* @__PURE__ */ d.jsx("input", { id: r, type: "radio", name: s, value: t, checked: i, onChange: _, disabled: c, className: T.radioInput, "aria-label": b }), e[6] = i, e[7] = r, e[8] = s, e[9] = _, e[10] = c, e[11] = b, e[12] = t, e[13] = h) : h = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ d.jsx("span", { className: T.radioControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let m;
  e[15] !== a || e[16] !== l ? (m = a ? /* @__PURE__ */ d.jsx("span", { className: O(T.radioLabel, H.mathText), dangerouslySetInnerHTML: {
    __html: l
  } }) : /* @__PURE__ */ d.jsx(q, { inline: !0, className: T.radioLabel, children: l }), e[15] = a, e[16] = l, e[17] = m) : m = e[17];
  let x;
  return e[18] !== r || e[19] !== n || e[20] !== h || e[21] !== m ? (x = /* @__PURE__ */ d.jsxs("label", { className: n, htmlFor: r, children: [
    h,
    y,
    m
  ] }), e[18] = r, e[19] = n, e[20] = h, e[21] = m, e[22] = x) : x = e[22], x;
}, ve = "_checkboxLabel_1i7h7_2", Le = "_checkbox_1i7h7_2", Te = "_disabled_1i7h7_22", Ae = "_readOnly_1i7h7_22", Ne = "_checked_1i7h7_26", Oe = "_checkboxInput_1i7h7_41", $e = "_checkboxControl_1i7h7_58", qe = "_htmlLabel_1i7h7_116", A = {
  checkboxLabel: ve,
  checkbox: Le,
  disabled: Te,
  readOnly: Ae,
  checked: Ne,
  checkboxInput: Oe,
  checkboxControl: $e,
  htmlLabel: qe
}, Ce = (f) => {
  const e = N.c(23), {
    name: s,
    value: t,
    label: l,
    checked: i,
    onChange: _,
    disabled: g,
    readOnly: p
  } = f, u = g === void 0 ? !1 : g, o = p === void 0 ? !1 : p, r = V.useId();
  let a, n;
  e[0] !== i || e[1] !== u || e[2] !== l || e[3] !== o ? (a = F(l), n = O(A.checkbox, i && A.checked, u && !o && A.disabled, o && A.readOnly, a && A.htmlLabel), e[0] = i, e[1] = u, e[2] = l, e[3] = o, e[4] = a, e[5] = n) : (a = e[4], n = e[5]);
  const c = u || o, b = a ? t : void 0;
  let h;
  e[6] !== i || e[7] !== r || e[8] !== s || e[9] !== _ || e[10] !== c || e[11] !== b || e[12] !== t ? (h = /* @__PURE__ */ d.jsx("input", { id: r, type: "checkbox", name: s, value: t, checked: i, onChange: _, disabled: c, className: A.checkboxInput, "aria-label": b }), e[6] = i, e[7] = r, e[8] = s, e[9] = _, e[10] = c, e[11] = b, e[12] = t, e[13] = h) : h = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ d.jsx("span", { className: A.checkboxControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let m;
  e[15] !== a || e[16] !== l ? (m = a ? /* @__PURE__ */ d.jsx("span", { className: O(A.checkboxLabel, H.mathText), dangerouslySetInnerHTML: {
    __html: l
  } }) : /* @__PURE__ */ d.jsx(q, { inline: !0, className: A.checkboxLabel, children: l }), e[15] = a, e[16] = l, e[17] = m) : m = e[17];
  let x;
  return e[18] !== r || e[19] !== n || e[20] !== h || e[21] !== m ? (x = /* @__PURE__ */ d.jsxs("label", { className: n, htmlFor: r, children: [
    h,
    y,
    m
  ] }), e[18] = r, e[19] = n, e[20] = h, e[21] = m, e[22] = x) : x = e[22], x;
}, Se = "_hint_srhhu_2", Ge = "_container_srhhu_6", G = {
  hint: Se,
  container: Ge
}, P = ";;", Ie = (f) => (f != null ? f : "").split(P).map((e) => e.trim()).filter(Boolean), Ve = (f, e) => f.filter((s) => e.includes(s.value)).map((s) => s.value).join(P), He = (f) => {
  const e = N.c(30), {
    name: s,
    options: t,
    value: l,
    onChange: i,
    disabled: _,
    readOnly: g,
    className: p,
    ariaLabel: u,
    hint: o
  } = f, r = _ === void 0 ? !1 : _, a = g === void 0 ? !1 : g;
  let n, c, b, h, y, m, x;
  if (e[0] !== u || e[1] !== p || e[2] !== r || e[3] !== o || e[4] !== s || e[5] !== i || e[6] !== t || e[7] !== a || e[8] !== l) {
    const $ = Ie(l), E = (L) => {
      const W = $.includes(L) ? $.filter((Q) => Q !== L) : [...$, L];
      i(Ve(t, W));
    };
    e[16] !== p ? (m = O(p), e[16] = p, e[17] = m) : m = e[17], e[18] !== o ? (x = o ? /* @__PURE__ */ d.jsx("p", { className: G.hint, children: o }) : null, e[18] = o, e[19] = x) : x = e[19], n = G.container, c = "group", b = u, h = "checkbox-group", y = t.map((L) => /* @__PURE__ */ d.jsx(Ce, { name: s, value: L.value, label: L.label, checked: $.includes(L.value), onChange: () => E(L.value), disabled: r || L.disabled, readOnly: a }, L.value)), e[0] = u, e[1] = p, e[2] = r, e[3] = o, e[4] = s, e[5] = i, e[6] = t, e[7] = a, e[8] = l, e[9] = n, e[10] = c, e[11] = b, e[12] = h, e[13] = y, e[14] = m, e[15] = x;
  } else
    n = e[9], c = e[10], b = e[11], h = e[12], y = e[13], m = e[14], x = e[15];
  let k;
  e[20] !== n || e[21] !== c || e[22] !== b || e[23] !== h || e[24] !== y ? (k = /* @__PURE__ */ d.jsx("div", { className: n, role: c, "aria-label": b, "data-testid": h, children: y }), e[20] = n, e[21] = c, e[22] = b, e[23] = h, e[24] = y, e[25] = k) : k = e[25];
  let v;
  return e[26] !== k || e[27] !== m || e[28] !== x ? (v = /* @__PURE__ */ d.jsxs("div", { className: m, children: [
    x,
    k
  ] }), e[26] = k, e[27] = m, e[28] = x, e[29] = v) : v = e[29], v;
}, Be = "_container_531kj_1", we = {
  container: Be
}, ze = (f) => {
  const e = N.c(19), {
    name: s,
    options: t,
    value: l,
    onChange: i,
    disabled: _,
    readOnly: g,
    className: p,
    ariaLabel: u
  } = f, o = _ === void 0 ? !1 : _, r = g === void 0 ? !1 : g;
  let a;
  e[0] !== p ? (a = O(we.container, p), e[0] = p, e[1] = a) : a = e[1];
  let n;
  if (e[2] !== o || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== r || e[7] !== l) {
    let b;
    e[9] !== o || e[10] !== s || e[11] !== i || e[12] !== r || e[13] !== l ? (b = (h) => /* @__PURE__ */ d.jsx(je, { name: s, value: h.value, label: h.label, checked: l === h.value, onChange: () => i(h.value), disabled: o || h.disabled, readOnly: r }, h.value), e[9] = o, e[10] = s, e[11] = i, e[12] = r, e[13] = l, e[14] = b) : b = e[14], n = t.map(b), e[2] = o, e[3] = s, e[4] = i, e[5] = t, e[6] = r, e[7] = l, e[8] = n;
  } else
    n = e[8];
  let c;
  return e[15] !== u || e[16] !== a || e[17] !== n ? (c = /* @__PURE__ */ d.jsx("div", { className: a, role: "radiogroup", "aria-label": u, children: n }), e[15] = u, e[16] = a, e[17] = n, e[18] = c) : c = e[18], c;
}, M = (f) => {
  const e = N.c(14), {
    name: s,
    options: t,
    value: l,
    onChange: i,
    description: _,
    disabled: g,
    readOnly: p,
    multiple: u,
    multipleHint: o
  } = f, r = g === void 0 ? !1 : g, a = p === void 0 ? !1 : p, n = u === void 0 ? !1 : u, c = !!_.isHorizontal, b = !!_.isWrapVariants, h = c ? "horizontal" : "vertical";
  let y;
  e[0] !== r || e[1] !== c || e[2] !== n || e[3] !== o || e[4] !== s || e[5] !== i || e[6] !== t || e[7] !== a || e[8] !== l || e[9] !== b ? (y = n ? /* @__PURE__ */ d.jsx(He, { className: O(j.radioGroup, c && j.radioGroupHorizontal, b && j.radioGroupWrap), name: s, options: t, value: l, onChange: i, disabled: r, readOnly: a, ariaLabel: "test-options", hint: o }) : /* @__PURE__ */ d.jsx(ze, { className: O(j.radioGroup, c && j.radioGroupHorizontal, b && j.radioGroupWrap), name: s, options: t, value: l, onChange: i, disabled: r, readOnly: a, ariaLabel: "test-options" }), e[0] = r, e[1] = c, e[2] = n, e[3] = o, e[4] = s, e[5] = i, e[6] = t, e[7] = a, e[8] = l, e[9] = b, e[10] = y) : y = e[10];
  let m;
  return e[11] !== h || e[12] !== y ? (m = /* @__PURE__ */ d.jsx("div", { "data-testid": "test-options", "data-layout": h, children: y }), e[11] = h, e[12] = y, e[13] = m) : m = e[13], m;
}, I = (f, e) => f == null || f === "" ? "" : X(f) ? e(f) : typeof f == "string" ? f : "", R = (f) => {
  const e = N.c(18), {
    description: s,
    deps: t
  } = f;
  let l;
  e[0] !== t ? (l = (c) => t.global.translateTasks(c), e[0] = t, e[1] = l) : l = e[1];
  const i = l;
  let _;
  e[2] !== s.question || e[3] !== i ? (_ = I(s.question, i), e[2] = s.question, e[3] = i, e[4] = _) : _ = e[4];
  const g = _;
  let p;
  e[5] !== s.questionAfter || e[6] !== i ? (p = I(s.questionAfter, i), e[5] = s.questionAfter, e[6] = i, e[7] = p) : p = e[7];
  const u = p;
  let o;
  e[8] !== s.questionAlign ? (o = {}, s.questionAlign && (o.textAlign = s.questionAlign), e[8] = s.questionAlign, e[9] = o) : o = e[9];
  let r;
  e[10] !== g || e[11] !== o ? (r = g ? /* @__PURE__ */ d.jsx("div", { className: j.question, "data-testid": "test-question", style: Object.keys(o).length > 0 ? o : void 0, children: /* @__PURE__ */ d.jsx(q, { children: g }) }) : null, e[10] = g, e[11] = o, e[12] = r) : r = e[12];
  let a;
  e[13] !== u ? (a = u ? /* @__PURE__ */ d.jsx("div", { className: j.questionAfter, children: /* @__PURE__ */ d.jsx(q, { children: u }) }) : null, e[13] = u, e[14] = a) : a = e[14];
  let n;
  return e[15] !== r || e[16] !== a ? (n = /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    r,
    a
  ] }), e[15] = r, e[16] = a, e[17] = n) : n = e[17], n;
}, Fe = (f) => {
  const e = N.c(36), {
    task: s,
    deps: t,
    answer: l,
    solution: i
  } = f;
  let _;
  e[0] !== t ? (_ = (v) => t.global.translateTasks(v), e[0] = t, e[1] = _) : _ = e[1];
  const g = _;
  let p, u, o, r;
  e[2] !== l || e[3] !== i || e[4] !== s.description || e[5] !== g ? (u = B(s.description.variants, g), p = Y(s.description, i, g), r = S(u, l), o = S(u, p), e[2] = l, e[3] = i, e[4] = s.description, e[5] = g, e[6] = p, e[7] = u, e[8] = o, e[9] = r) : (p = e[6], u = e[7], o = e[8], r = e[9]);
  const a = o;
  let n;
  e[10] !== t || e[11] !== s.title ? (n = /* @__PURE__ */ d.jsx(w, { title: s.title, deps: t }), e[10] = t, e[11] = s.title, e[12] = n) : n = e[12];
  let c, b;
  e[13] !== t || e[14] !== s.description ? (c = /* @__PURE__ */ d.jsx(R, { description: s.description, deps: t }), b = /* @__PURE__ */ d.jsx(z, { description: s.description, deps: t }), e[13] = t, e[14] = s.description, e[15] = c, e[16] = b) : (c = e[15], b = e[16]);
  let h;
  e[17] !== a || e[18] !== t || e[19] !== r ? (h = /* @__PURE__ */ d.jsx(ee, { userAnswer: r, correctAnswer: a, deps: t }), e[17] = a, e[18] = t, e[19] = r, e[20] = h) : h = e[20];
  const y = `${s.id}-solution`;
  let m;
  e[21] !== p || e[22] !== u || e[23] !== y || e[24] !== s.description ? (m = /* @__PURE__ */ d.jsx(M, { name: y, options: u, value: p, onChange: Pe, description: s.description, readOnly: !0 }), e[21] = p, e[22] = u, e[23] = y, e[24] = s.description, e[25] = m) : m = e[25];
  let x;
  e[26] !== t || e[27] !== i ? (x = /* @__PURE__ */ d.jsx(te, { solution: i, deps: t }), e[26] = t, e[27] = i, e[28] = x) : x = e[28];
  let k;
  return e[29] !== n || e[30] !== c || e[31] !== b || e[32] !== h || e[33] !== m || e[34] !== x ? (k = /* @__PURE__ */ d.jsxs("div", { className: j.container, children: [
    n,
    c,
    b,
    h,
    m,
    x
  ] }), e[29] = n, e[30] = c, e[31] = b, e[32] = h, e[33] = m, e[34] = x, e[35] = k) : k = e[35], k;
};
function Pe() {
}
const Me = (f) => {
  var e, s;
  return (s = (e = f.localize) == null ? void 0 : e.pickEveryFittingOption) != null ? s : "Выберите все подходящие варианты";
}, Re = ({
  id: f
}) => {
  const e = (s) => {
    const t = N.c(31), {
      task: l,
      deps: i,
      answer: _,
      onChange: g
    } = s;
    if (Z(l.solution)) {
      let v;
      return t[0] !== _ || t[1] !== i || t[2] !== l ? (v = /* @__PURE__ */ d.jsx(Fe, { task: l, deps: i, answer: _, solution: l.solution }), t[0] = _, t[1] = i, t[2] = l, t[3] = v) : v = t[3], v;
    }
    let p;
    t[4] !== i ? (p = (v) => i.global.translateTasks(v), t[4] = i, t[5] = p) : p = t[5];
    const u = p;
    let o;
    t[6] !== l.description.variants || t[7] !== u ? (o = B(l.description.variants, u), t[6] = l.description.variants, t[7] = u, t[8] = o) : o = t[8];
    const r = o;
    let a;
    t[9] !== i || t[10] !== l.title ? (a = /* @__PURE__ */ d.jsx(w, { title: l.title, deps: i }), t[9] = i, t[10] = l.title, t[11] = a) : a = t[11];
    let n, c;
    t[12] !== i || t[13] !== l.description ? (n = /* @__PURE__ */ d.jsx(R, { description: l.description, deps: i }), c = /* @__PURE__ */ d.jsx(z, { description: l.description, deps: i }), t[12] = i, t[13] = l.description, t[14] = n, t[15] = c) : (n = t[14], c = t[15]);
    const b = String(l.id), h = l.description, y = !!l.hasMultipleAnswers;
    let m;
    t[16] !== i ? (m = Me(i), t[16] = i, t[17] = m) : m = t[17];
    let x;
    t[18] !== _ || t[19] !== g || t[20] !== r || t[21] !== b || t[22] !== y || t[23] !== m || t[24] !== l.description ? (x = /* @__PURE__ */ d.jsx(M, { name: b, options: r, value: _, onChange: g, description: h, multiple: y, multipleHint: m }), t[18] = _, t[19] = g, t[20] = r, t[21] = b, t[22] = y, t[23] = m, t[24] = l.description, t[25] = x) : x = t[25];
    let k;
    return t[26] !== x || t[27] !== a || t[28] !== n || t[29] !== c ? (k = /* @__PURE__ */ d.jsxs("div", { className: j.container, "data-template-id": f, children: [
      a,
      n,
      c,
      x
    ] }), t[26] = x, t[27] = a, t[28] = n, t[29] = c, t[30] = k) : k = t[30], k;
  };
  return e.displayName = f, e;
}, Qe = Re({
  id: "test.plain"
});
export {
  Qe as TestPlain,
  Qe as default
};
