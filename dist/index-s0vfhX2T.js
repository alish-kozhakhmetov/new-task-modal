import { c as N, j as d, N as D, O as $, _ as Q, $ as J, a0 as K, w as z, f as q, a1 as F, r as S, i as X, a2 as V, a3 as Y, a4 as C, a as H, e as Z } from "./index-DwDfo0zf.js";
import { S as ee, a as te } from "./solution-answer-panel-DNRF1AHT.js";
const se = "_container_1iy8p_2", ie = "_question_1iy8p_8", le = "_questionAfter_1iy8p_13", ne = "_figures_1iy8p_17", ae = "_figuresVertical_1iy8p_23", oe = "_images_1iy8p_28", re = "_unsupported_1iy8p_39", ce = "_radioGroup_1iy8p_45", de = "_radioGroupHorizontal_1iy8p_49", ue = "_radioGroupWrap_1iy8p_55", j = {
  container: se,
  question: ie,
  questionAfter: le,
  figures: ne,
  figuresVertical: ae,
  images: oe,
  unsupported: re,
  radioGroup: ce,
  radioGroupHorizontal: de,
  radioGroupWrap: ue
}, B = (h) => {
  const e = N.c(25), {
    description: s,
    deps: t
  } = h;
  let i, l, _, g, p, u;
  if (e[0] !== s.background || e[1] !== s.figures || e[2] !== s.images || e[3] !== s.isFiguresVertical) {
    u = Symbol.for("react.early_return_sentinel");
    e: {
      const n = Array.isArray(s.images) ? s.images.filter(pe) : [];
      let a;
      e[10] !== s.figures ? (a = Array.isArray(s.figures) ? s.figures : [], e[10] = s.figures, e[11] = a) : a = e[11], i = a;
      const c = !!s.isFiguresVertical;
      if (!n.length && !i.length && !s.background) {
        u = null;
        break e;
      }
      l = `${j.figures} ${c ? j.figuresVertical : ""}`, _ = "test-figures", e[12] !== s.background ? (g = s.background ? /* @__PURE__ */ d.jsx("div", { dangerouslySetInnerHTML: {
        __html: s.background
      } }) : null, e[12] = s.background, e[13] = g) : g = e[13], p = n.length > 0 ? /* @__PURE__ */ d.jsx("div", { className: j.images, children: n.map(fe) }) : null;
    }
    e[0] = s.background, e[1] = s.figures, e[2] = s.images, e[3] = s.isFiguresVertical, e[4] = i, e[5] = l, e[6] = _, e[7] = g, e[8] = p, e[9] = u;
  } else
    i = e[4], l = e[5], _ = e[6], g = e[7], p = e[8], u = e[9];
  if (u !== Symbol.for("react.early_return_sentinel"))
    return u;
  let o;
  if (e[14] !== t || e[15] !== i) {
    let n;
    e[17] !== t ? (n = (a, c) => {
      const b = D(a), f = Number(b.type);
      switch (f) {
        case $.Text:
          return /* @__PURE__ */ d.jsx(K, { part: b, deps: t }, c);
        case $.Image:
          return /* @__PURE__ */ d.jsx(J, { part: b, deps: t }, c);
        case $.AngleList:
          return /* @__PURE__ */ d.jsx(Q, { part: b }, c);
        default:
          return /* @__PURE__ */ d.jsxs("p", { className: j.unsupported, children: [
            "Unsupported figure type ",
            f
          ] }, c);
      }
    }, e[17] = t, e[18] = n) : n = e[18], o = i.map(n), e[14] = t, e[15] = i, e[16] = o;
  } else
    o = e[16];
  let r;
  return e[19] !== l || e[20] !== _ || e[21] !== g || e[22] !== p || e[23] !== o ? (r = /* @__PURE__ */ d.jsxs("div", { className: l, "data-testid": _, children: [
    g,
    p,
    o
  ] }), e[19] = l, e[20] = _, e[21] = g, e[22] = p, e[23] = o, e[24] = r) : r = e[24], r;
};
function pe(h) {
  return typeof h == "string" && h.trim();
}
function fe(h, e) {
  return /* @__PURE__ */ d.jsx("div", { dangerouslySetInnerHTML: {
    __html: h
  } }, e);
}
const he = "_radioLabel_129ko_1", me = "_radioButton_129ko_5", _e = "_disabled_129ko_20", be = "_readOnly_129ko_20", ge = "_checked_129ko_24", xe = "_radioInput_129ko_39", ye = "_radioControl_129ko_52", ke = "_htmlLabel_129ko_95", T = {
  radioLabel: he,
  radioButton: me,
  disabled: _e,
  readOnly: be,
  checked: ge,
  radioInput: xe,
  radioControl: ye,
  htmlLabel: ke
}, w = (h) => h.includes("svg") || h.includes("<div"), je = (h) => {
  const e = N.c(23), {
    name: s,
    value: t,
    label: i,
    checked: l,
    onChange: _,
    disabled: g,
    readOnly: p
  } = h, u = g === void 0 ? !1 : g, o = p === void 0 ? !1 : p, r = z.useId();
  let n, a;
  e[0] !== l || e[1] !== u || e[2] !== i || e[3] !== o ? (n = w(i), a = q(T.radioButton, l && T.checked, u && !o && T.disabled, o && T.readOnly, n && T.htmlLabel), e[0] = l, e[1] = u, e[2] = i, e[3] = o, e[4] = n, e[5] = a) : (n = e[4], a = e[5]);
  const c = u || o, b = n ? t : void 0;
  let f;
  e[6] !== l || e[7] !== r || e[8] !== s || e[9] !== _ || e[10] !== c || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ d.jsx("input", { id: r, type: "radio", name: s, value: t, checked: l, onChange: _, disabled: c, className: T.radioInput, "aria-label": b }), e[6] = l, e[7] = r, e[8] = s, e[9] = _, e[10] = c, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ d.jsx("span", { className: T.radioControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let m;
  e[15] !== n || e[16] !== i ? (m = n ? /* @__PURE__ */ d.jsx("span", { className: q(T.radioLabel, F.mathText), dangerouslySetInnerHTML: {
    __html: i
  } }) : /* @__PURE__ */ d.jsx(S, { inline: !0, className: T.radioLabel, children: i }), e[15] = n, e[16] = i, e[17] = m) : m = e[17];
  let x;
  return e[18] !== r || e[19] !== a || e[20] !== f || e[21] !== m ? (x = /* @__PURE__ */ d.jsxs("label", { className: a, htmlFor: r, children: [
    f,
    y,
    m
  ] }), e[18] = r, e[19] = a, e[20] = f, e[21] = m, e[22] = x) : x = e[22], x;
}, ve = "_checkboxLabel_1i7h7_2", Le = "_checkbox_1i7h7_2", Te = "_disabled_1i7h7_22", Ae = "_readOnly_1i7h7_22", Ne = "_checked_1i7h7_26", qe = "_checkboxInput_1i7h7_41", Oe = "_checkboxControl_1i7h7_58", Se = "_htmlLabel_1i7h7_116", A = {
  checkboxLabel: ve,
  checkbox: Le,
  disabled: Te,
  readOnly: Ae,
  checked: Ne,
  checkboxInput: qe,
  checkboxControl: Oe,
  htmlLabel: Se
}, $e = (h) => {
  const e = N.c(23), {
    name: s,
    value: t,
    label: i,
    checked: l,
    onChange: _,
    disabled: g,
    readOnly: p
  } = h, u = g === void 0 ? !1 : g, o = p === void 0 ? !1 : p, r = z.useId();
  let n, a;
  e[0] !== l || e[1] !== u || e[2] !== i || e[3] !== o ? (n = w(i), a = q(A.checkbox, l && A.checked, u && !o && A.disabled, o && A.readOnly, n && A.htmlLabel), e[0] = l, e[1] = u, e[2] = i, e[3] = o, e[4] = n, e[5] = a) : (n = e[4], a = e[5]);
  const c = u || o, b = n ? t : void 0;
  let f;
  e[6] !== l || e[7] !== r || e[8] !== s || e[9] !== _ || e[10] !== c || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ d.jsx("input", { id: r, type: "checkbox", name: s, value: t, checked: l, onChange: _, disabled: c, className: A.checkboxInput, "aria-label": b }), e[6] = l, e[7] = r, e[8] = s, e[9] = _, e[10] = c, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ d.jsx("span", { className: A.checkboxControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let m;
  e[15] !== n || e[16] !== i ? (m = n ? /* @__PURE__ */ d.jsx("span", { className: q(A.checkboxLabel, F.mathText), dangerouslySetInnerHTML: {
    __html: i
  } }) : /* @__PURE__ */ d.jsx(S, { inline: !0, className: A.checkboxLabel, children: i }), e[15] = n, e[16] = i, e[17] = m) : m = e[17];
  let x;
  return e[18] !== r || e[19] !== a || e[20] !== f || e[21] !== m ? (x = /* @__PURE__ */ d.jsxs("label", { className: a, htmlFor: r, children: [
    f,
    y,
    m
  ] }), e[18] = r, e[19] = a, e[20] = f, e[21] = m, e[22] = x) : x = e[22], x;
}, Ce = "_hint_srhhu_2", Ge = "_container_srhhu_6", G = {
  hint: Ce,
  container: Ge
}, P = ";;", Ie = (h) => (h != null ? h : "").split(P).map((e) => e.trim()).filter(Boolean), ze = (h, e) => h.filter((s) => e.includes(s.value)).map((s) => s.value).join(P), Fe = (h) => {
  const e = N.c(30), {
    name: s,
    options: t,
    value: i,
    onChange: l,
    disabled: _,
    readOnly: g,
    className: p,
    ariaLabel: u,
    hint: o
  } = h, r = _ === void 0 ? !1 : _, n = g === void 0 ? !1 : g;
  let a, c, b, f, y, m, x;
  if (e[0] !== u || e[1] !== p || e[2] !== r || e[3] !== o || e[4] !== s || e[5] !== l || e[6] !== t || e[7] !== n || e[8] !== i) {
    const O = Ie(i), E = (L) => {
      const W = O.includes(L) ? O.filter((U) => U !== L) : [...O, L];
      l(ze(t, W));
    };
    e[16] !== p ? (m = q(p), e[16] = p, e[17] = m) : m = e[17], e[18] !== o ? (x = o ? /* @__PURE__ */ d.jsx("p", { className: G.hint, children: o }) : null, e[18] = o, e[19] = x) : x = e[19], a = G.container, c = "group", b = u, f = "checkbox-group", y = t.map((L) => /* @__PURE__ */ d.jsx($e, { name: s, value: L.value, label: L.label, checked: O.includes(L.value), onChange: () => E(L.value), disabled: r || L.disabled, readOnly: n }, L.value)), e[0] = u, e[1] = p, e[2] = r, e[3] = o, e[4] = s, e[5] = l, e[6] = t, e[7] = n, e[8] = i, e[9] = a, e[10] = c, e[11] = b, e[12] = f, e[13] = y, e[14] = m, e[15] = x;
  } else
    a = e[9], c = e[10], b = e[11], f = e[12], y = e[13], m = e[14], x = e[15];
  let k;
  e[20] !== a || e[21] !== c || e[22] !== b || e[23] !== f || e[24] !== y ? (k = /* @__PURE__ */ d.jsx("div", { className: a, role: c, "aria-label": b, "data-testid": f, children: y }), e[20] = a, e[21] = c, e[22] = b, e[23] = f, e[24] = y, e[25] = k) : k = e[25];
  let v;
  return e[26] !== k || e[27] !== m || e[28] !== x ? (v = /* @__PURE__ */ d.jsxs("div", { className: m, children: [
    x,
    k
  ] }), e[26] = k, e[27] = m, e[28] = x, e[29] = v) : v = e[29], v;
}, Ve = "_container_531kj_1", He = {
  container: Ve
}, Be = (h) => {
  const e = N.c(19), {
    name: s,
    options: t,
    value: i,
    onChange: l,
    disabled: _,
    readOnly: g,
    className: p,
    ariaLabel: u
  } = h, o = _ === void 0 ? !1 : _, r = g === void 0 ? !1 : g;
  let n;
  e[0] !== p ? (n = q(He.container, p), e[0] = p, e[1] = n) : n = e[1];
  let a;
  if (e[2] !== o || e[3] !== s || e[4] !== l || e[5] !== t || e[6] !== r || e[7] !== i) {
    let b;
    e[9] !== o || e[10] !== s || e[11] !== l || e[12] !== r || e[13] !== i ? (b = (f) => /* @__PURE__ */ d.jsx(je, { name: s, value: f.value, label: f.label, checked: i === f.value, onChange: () => l(f.value), disabled: o || f.disabled, readOnly: r }, f.value), e[9] = o, e[10] = s, e[11] = l, e[12] = r, e[13] = i, e[14] = b) : b = e[14], a = t.map(b), e[2] = o, e[3] = s, e[4] = l, e[5] = t, e[6] = r, e[7] = i, e[8] = a;
  } else
    a = e[8];
  let c;
  return e[15] !== u || e[16] !== n || e[17] !== a ? (c = /* @__PURE__ */ d.jsx("div", { className: n, role: "radiogroup", "aria-label": u, children: a }), e[15] = u, e[16] = n, e[17] = a, e[18] = c) : c = e[18], c;
}, M = (h) => {
  const e = N.c(14), {
    name: s,
    options: t,
    value: i,
    onChange: l,
    description: _,
    disabled: g,
    readOnly: p,
    multiple: u,
    multipleHint: o
  } = h, r = g === void 0 ? !1 : g, n = p === void 0 ? !1 : p, a = u === void 0 ? !1 : u, c = !!_.isHorizontal, b = !!_.isWrapVariants, f = c ? "horizontal" : "vertical";
  let y;
  e[0] !== r || e[1] !== c || e[2] !== a || e[3] !== o || e[4] !== s || e[5] !== l || e[6] !== t || e[7] !== n || e[8] !== i || e[9] !== b ? (y = a ? /* @__PURE__ */ d.jsx(Fe, { className: q(j.radioGroup, c && j.radioGroupHorizontal, b && j.radioGroupWrap), name: s, options: t, value: i, onChange: l, disabled: r, readOnly: n, ariaLabel: "test-options", hint: o }) : /* @__PURE__ */ d.jsx(Be, { className: q(j.radioGroup, c && j.radioGroupHorizontal, b && j.radioGroupWrap), name: s, options: t, value: i, onChange: l, disabled: r, readOnly: n, ariaLabel: "test-options" }), e[0] = r, e[1] = c, e[2] = a, e[3] = o, e[4] = s, e[5] = l, e[6] = t, e[7] = n, e[8] = i, e[9] = b, e[10] = y) : y = e[10];
  let m;
  return e[11] !== f || e[12] !== y ? (m = /* @__PURE__ */ d.jsx("div", { "data-testid": "test-options", "data-layout": f, children: y }), e[11] = f, e[12] = y, e[13] = m) : m = e[13], m;
}, I = (h, e) => h == null || h === "" ? "" : X(h) ? e(h) : typeof h == "string" ? h : "", R = (h) => {
  const e = N.c(19), {
    description: s,
    deps: t
  } = h;
  let i;
  e[0] !== t ? (i = (c) => t.global.translateTasks(c), e[0] = t, e[1] = i) : i = e[1];
  const l = i;
  let _;
  e[2] !== s.question || e[3] !== l ? (_ = I(s.question, l), e[2] = s.question, e[3] = l, e[4] = _) : _ = e[4];
  const g = _;
  let p;
  e[5] !== s.questionAfter || e[6] !== l ? (p = I(s.questionAfter, l), e[5] = s.questionAfter, e[6] = l, e[7] = p) : p = e[7];
  const u = p;
  let o;
  e[8] !== s.questionAlign || e[9] !== s.questionFontSize ? (o = {}, s.questionFontSize && (o.fontSize = s.questionFontSize), s.questionAlign && (o.textAlign = s.questionAlign), e[8] = s.questionAlign, e[9] = s.questionFontSize, e[10] = o) : o = e[10];
  let r;
  e[11] !== g || e[12] !== o ? (r = g ? /* @__PURE__ */ d.jsx("div", { className: j.question, "data-testid": "test-question", style: Object.keys(o).length > 0 ? o : void 0, children: /* @__PURE__ */ d.jsx(S, { children: g }) }) : null, e[11] = g, e[12] = o, e[13] = r) : r = e[13];
  let n;
  e[14] !== u ? (n = u ? /* @__PURE__ */ d.jsx("div", { className: j.questionAfter, children: /* @__PURE__ */ d.jsx(S, { children: u }) }) : null, e[14] = u, e[15] = n) : n = e[15];
  let a;
  return e[16] !== r || e[17] !== n ? (a = /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    r,
    n
  ] }), e[16] = r, e[17] = n, e[18] = a) : a = e[18], a;
}, we = (h) => {
  const e = N.c(36), {
    task: s,
    deps: t,
    answer: i,
    solution: l
  } = h;
  let _;
  e[0] !== t ? (_ = (v) => t.global.translateTasks(v), e[0] = t, e[1] = _) : _ = e[1];
  const g = _;
  let p, u, o, r;
  e[2] !== i || e[3] !== l || e[4] !== s.description || e[5] !== g ? (u = V(s.description.variants, g), p = Y(s.description, l, g), r = C(u, i), o = C(u, p), e[2] = i, e[3] = l, e[4] = s.description, e[5] = g, e[6] = p, e[7] = u, e[8] = o, e[9] = r) : (p = e[6], u = e[7], o = e[8], r = e[9]);
  const n = o;
  let a;
  e[10] !== t || e[11] !== s.title ? (a = /* @__PURE__ */ d.jsx(H, { title: s.title, deps: t }), e[10] = t, e[11] = s.title, e[12] = a) : a = e[12];
  let c, b;
  e[13] !== t || e[14] !== s.description ? (c = /* @__PURE__ */ d.jsx(R, { description: s.description, deps: t }), b = /* @__PURE__ */ d.jsx(B, { description: s.description, deps: t }), e[13] = t, e[14] = s.description, e[15] = c, e[16] = b) : (c = e[15], b = e[16]);
  let f;
  e[17] !== n || e[18] !== t || e[19] !== r ? (f = /* @__PURE__ */ d.jsx(ee, { userAnswer: r, correctAnswer: n, deps: t }), e[17] = n, e[18] = t, e[19] = r, e[20] = f) : f = e[20];
  const y = `${s.id}-solution`;
  let m;
  e[21] !== p || e[22] !== u || e[23] !== y || e[24] !== s.description ? (m = /* @__PURE__ */ d.jsx(M, { name: y, options: u, value: p, onChange: Pe, description: s.description, readOnly: !0 }), e[21] = p, e[22] = u, e[23] = y, e[24] = s.description, e[25] = m) : m = e[25];
  let x;
  e[26] !== t || e[27] !== l ? (x = /* @__PURE__ */ d.jsx(te, { solution: l, deps: t }), e[26] = t, e[27] = l, e[28] = x) : x = e[28];
  let k;
  return e[29] !== a || e[30] !== c || e[31] !== b || e[32] !== f || e[33] !== m || e[34] !== x ? (k = /* @__PURE__ */ d.jsxs("div", { className: j.container, children: [
    a,
    c,
    b,
    f,
    m,
    x
  ] }), e[29] = a, e[30] = c, e[31] = b, e[32] = f, e[33] = m, e[34] = x, e[35] = k) : k = e[35], k;
};
function Pe() {
}
const Me = (h) => {
  var e, s;
  return (s = (e = h.localize) == null ? void 0 : e.pickEveryFittingOption) != null ? s : "Выберите все подходящие варианты";
}, Re = ({
  id: h
}) => {
  const e = (s) => {
    const t = N.c(31), {
      task: i,
      deps: l,
      answer: _,
      onChange: g
    } = s;
    if (Z(i.solution)) {
      let v;
      return t[0] !== _ || t[1] !== l || t[2] !== i ? (v = /* @__PURE__ */ d.jsx(we, { task: i, deps: l, answer: _, solution: i.solution }), t[0] = _, t[1] = l, t[2] = i, t[3] = v) : v = t[3], v;
    }
    let p;
    t[4] !== l ? (p = (v) => l.global.translateTasks(v), t[4] = l, t[5] = p) : p = t[5];
    const u = p;
    let o;
    t[6] !== i.description.variants || t[7] !== u ? (o = V(i.description.variants, u), t[6] = i.description.variants, t[7] = u, t[8] = o) : o = t[8];
    const r = o;
    let n;
    t[9] !== l || t[10] !== i.title ? (n = /* @__PURE__ */ d.jsx(H, { title: i.title, deps: l }), t[9] = l, t[10] = i.title, t[11] = n) : n = t[11];
    let a, c;
    t[12] !== l || t[13] !== i.description ? (a = /* @__PURE__ */ d.jsx(R, { description: i.description, deps: l }), c = /* @__PURE__ */ d.jsx(B, { description: i.description, deps: l }), t[12] = l, t[13] = i.description, t[14] = a, t[15] = c) : (a = t[14], c = t[15]);
    const b = String(i.id), f = i.description, y = !!i.hasMultipleAnswers;
    let m;
    t[16] !== l ? (m = Me(l), t[16] = l, t[17] = m) : m = t[17];
    let x;
    t[18] !== _ || t[19] !== g || t[20] !== r || t[21] !== b || t[22] !== y || t[23] !== m || t[24] !== i.description ? (x = /* @__PURE__ */ d.jsx(M, { name: b, options: r, value: _, onChange: g, description: f, multiple: y, multipleHint: m }), t[18] = _, t[19] = g, t[20] = r, t[21] = b, t[22] = y, t[23] = m, t[24] = i.description, t[25] = x) : x = t[25];
    let k;
    return t[26] !== x || t[27] !== n || t[28] !== a || t[29] !== c ? (k = /* @__PURE__ */ d.jsxs("div", { className: j.container, "data-template-id": h, children: [
      n,
      a,
      c,
      x
    ] }), t[26] = x, t[27] = n, t[28] = a, t[29] = c, t[30] = k) : k = t[30], k;
  };
  return e.displayName = h, e;
}, Ue = Re({
  id: "test.plain"
});
export {
  Ue as TestPlain,
  Ue as default
};
