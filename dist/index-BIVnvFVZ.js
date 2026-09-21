import { c as T, j as d, N as U, O, _ as D, $ as Q, a0 as J, w as I, q, r as $, i as K, a1 as F, a2 as X, a3 as S, a as V, e as Y } from "./index-C9Ty7xv-.js";
import { S as Z, a as ee } from "./solution-answer-panel-Bb4RYmRp.js";
const te = "_container_197pz_2", se = "_question_197pz_8", le = "_questionAfter_197pz_14", ie = "_figures_197pz_18", ne = "_figuresVertical_197pz_24", ae = "_images_197pz_29", oe = "_unsupported_197pz_40", re = "_radioGroup_197pz_46", ce = "_radioGroupHorizontal_197pz_50", de = "_radioGroupWrap_197pz_56", j = {
  container: te,
  question: se,
  questionAfter: le,
  figures: ie,
  figuresVertical: ne,
  images: ae,
  unsupported: oe,
  radioGroup: re,
  radioGroupHorizontal: ce,
  radioGroupWrap: de
}, H = (m) => {
  const e = T.c(25), {
    description: s,
    deps: t
  } = m;
  let l, i, _, g, p, u;
  if (e[0] !== s.background || e[1] !== s.figures || e[2] !== s.images || e[3] !== s.isFiguresVertical) {
    u = Symbol.for("react.early_return_sentinel");
    e: {
      const n = Array.isArray(s.images) ? s.images.filter(ue) : [];
      let a;
      e[10] !== s.figures ? (a = Array.isArray(s.figures) ? s.figures : [], e[10] = s.figures, e[11] = a) : a = e[11], l = a;
      const c = !!s.isFiguresVertical;
      if (!n.length && !l.length && !s.background) {
        u = null;
        break e;
      }
      i = `${j.figures} ${c ? j.figuresVertical : ""}`, _ = "test-figures", e[12] !== s.background ? (g = s.background ? /* @__PURE__ */ d.jsx("div", { dangerouslySetInnerHTML: {
        __html: s.background
      } }) : null, e[12] = s.background, e[13] = g) : g = e[13], p = n.length > 0 ? /* @__PURE__ */ d.jsx("div", { className: j.images, children: n.map(pe) }) : null;
    }
    e[0] = s.background, e[1] = s.figures, e[2] = s.images, e[3] = s.isFiguresVertical, e[4] = l, e[5] = i, e[6] = _, e[7] = g, e[8] = p, e[9] = u;
  } else
    l = e[4], i = e[5], _ = e[6], g = e[7], p = e[8], u = e[9];
  if (u !== Symbol.for("react.early_return_sentinel"))
    return u;
  let o;
  if (e[14] !== t || e[15] !== l) {
    let n;
    e[17] !== t ? (n = (a, c) => {
      const b = U(a), f = Number(b.type);
      switch (f) {
        case O.Text:
          return /* @__PURE__ */ d.jsx(J, { part: b, deps: t }, c);
        case O.Image:
          return /* @__PURE__ */ d.jsx(Q, { part: b, deps: t }, c);
        case O.AngleList:
          return /* @__PURE__ */ d.jsx(D, { part: b }, c);
        default:
          return /* @__PURE__ */ d.jsxs("p", { className: j.unsupported, children: [
            "Unsupported figure type ",
            f
          ] }, c);
      }
    }, e[17] = t, e[18] = n) : n = e[18], o = l.map(n), e[14] = t, e[15] = l, e[16] = o;
  } else
    o = e[16];
  let r;
  return e[19] !== i || e[20] !== _ || e[21] !== g || e[22] !== p || e[23] !== o ? (r = /* @__PURE__ */ d.jsxs("div", { className: i, "data-testid": _, children: [
    g,
    p,
    o
  ] }), e[19] = i, e[20] = _, e[21] = g, e[22] = p, e[23] = o, e[24] = r) : r = e[24], r;
};
function ue(m) {
  return typeof m == "string" && m.trim();
}
function pe(m, e) {
  return /* @__PURE__ */ d.jsx("div", { dangerouslySetInnerHTML: {
    __html: m
  } }, e);
}
const fe = "_radioLabel_14h0g_1", me = "_radioButton_14h0g_5", he = "_disabled_14h0g_19", _e = "_readOnly_14h0g_19", be = "_checked_14h0g_23", ge = "_radioInput_14h0g_38", xe = "_radioControl_14h0g_51", ye = "_htmlLabel_14h0g_107", A = {
  radioLabel: fe,
  radioButton: me,
  disabled: he,
  readOnly: _e,
  checked: be,
  radioInput: ge,
  radioControl: xe,
  htmlLabel: ye
}, B = (m) => m.includes("svg") || m.includes("<div"), ke = (m) => {
  const e = T.c(23), {
    name: s,
    value: t,
    label: l,
    checked: i,
    onChange: _,
    disabled: g,
    readOnly: p
  } = m, u = g === void 0 ? !1 : g, o = p === void 0 ? !1 : p, r = I.useId();
  let n, a;
  e[0] !== i || e[1] !== u || e[2] !== l || e[3] !== o ? (n = B(l), a = q(A.radioButton, i && A.checked, u && !o && A.disabled, o && A.readOnly, n && A.htmlLabel), e[0] = i, e[1] = u, e[2] = l, e[3] = o, e[4] = n, e[5] = a) : (n = e[4], a = e[5]);
  const c = u || o, b = n ? t : void 0;
  let f;
  e[6] !== i || e[7] !== r || e[8] !== s || e[9] !== _ || e[10] !== c || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ d.jsx("input", { id: r, type: "radio", name: s, value: t, checked: i, onChange: _, disabled: c, className: A.radioInput, "aria-label": b }), e[6] = i, e[7] = r, e[8] = s, e[9] = _, e[10] = c, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ d.jsx("span", { className: A.radioControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let h;
  e[15] !== n || e[16] !== l ? (h = n ? /* @__PURE__ */ d.jsx("span", { className: A.radioLabel, dangerouslySetInnerHTML: {
    __html: l
  } }) : /* @__PURE__ */ d.jsx("span", { className: A.radioLabel, children: l }), e[15] = n, e[16] = l, e[17] = h) : h = e[17];
  let x;
  return e[18] !== r || e[19] !== a || e[20] !== f || e[21] !== h ? (x = /* @__PURE__ */ d.jsxs("label", { className: a, htmlFor: r, children: [
    f,
    y,
    h
  ] }), e[18] = r, e[19] = a, e[20] = f, e[21] = h, e[22] = x) : x = e[22], x;
}, je = "_checkboxLabel_1mxp3_2", ve = "_checkbox_1mxp3_2", Le = "_disabled_1mxp3_21", Ae = "_readOnly_1mxp3_21", Ne = "_checked_1mxp3_25", Te = "_checkboxInput_1mxp3_40", qe = "_checkboxControl_1mxp3_57", ze = "_htmlLabel_1mxp3_114", N = {
  checkboxLabel: je,
  checkbox: ve,
  disabled: Le,
  readOnly: Ae,
  checked: Ne,
  checkboxInput: Te,
  checkboxControl: qe,
  htmlLabel: ze
}, Oe = (m) => {
  const e = T.c(23), {
    name: s,
    value: t,
    label: l,
    checked: i,
    onChange: _,
    disabled: g,
    readOnly: p
  } = m, u = g === void 0 ? !1 : g, o = p === void 0 ? !1 : p, r = I.useId();
  let n, a;
  e[0] !== i || e[1] !== u || e[2] !== l || e[3] !== o ? (n = B(l), a = q(N.checkbox, i && N.checked, u && !o && N.disabled, o && N.readOnly, n && N.htmlLabel), e[0] = i, e[1] = u, e[2] = l, e[3] = o, e[4] = n, e[5] = a) : (n = e[4], a = e[5]);
  const c = u || o, b = n ? t : void 0;
  let f;
  e[6] !== i || e[7] !== r || e[8] !== s || e[9] !== _ || e[10] !== c || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ d.jsx("input", { id: r, type: "checkbox", name: s, value: t, checked: i, onChange: _, disabled: c, className: N.checkboxInput, "aria-label": b }), e[6] = i, e[7] = r, e[8] = s, e[9] = _, e[10] = c, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ d.jsx("span", { className: N.checkboxControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let h;
  e[15] !== n || e[16] !== l ? (h = n ? /* @__PURE__ */ d.jsx("span", { className: N.checkboxLabel, dangerouslySetInnerHTML: {
    __html: l
  } }) : /* @__PURE__ */ d.jsx("span", { className: N.checkboxLabel, children: l }), e[15] = n, e[16] = l, e[17] = h) : h = e[17];
  let x;
  return e[18] !== r || e[19] !== a || e[20] !== f || e[21] !== h ? (x = /* @__PURE__ */ d.jsxs("label", { className: a, htmlFor: r, children: [
    f,
    y,
    h
  ] }), e[18] = r, e[19] = a, e[20] = f, e[21] = h, e[22] = x) : x = e[22], x;
}, $e = "_hint_risgu_2", Se = "_container_risgu_6", C = {
  hint: $e,
  container: Se
}, w = ";;", Ce = (m) => (m != null ? m : "").split(w).map((e) => e.trim()).filter(Boolean), Ge = (m, e) => m.filter((s) => e.includes(s.value)).map((s) => s.value).join(w), Ie = (m) => {
  const e = T.c(30), {
    name: s,
    options: t,
    value: l,
    onChange: i,
    disabled: _,
    readOnly: g,
    className: p,
    ariaLabel: u,
    hint: o
  } = m, r = _ === void 0 ? !1 : _, n = g === void 0 ? !1 : g;
  let a, c, b, f, y, h, x;
  if (e[0] !== u || e[1] !== p || e[2] !== r || e[3] !== o || e[4] !== s || e[5] !== i || e[6] !== t || e[7] !== n || e[8] !== l) {
    const z = Ce(l), R = (L) => {
      const E = z.includes(L) ? z.filter((W) => W !== L) : [...z, L];
      i(Ge(t, E));
    };
    e[16] !== p ? (h = q(p), e[16] = p, e[17] = h) : h = e[17], e[18] !== o ? (x = o ? /* @__PURE__ */ d.jsx("p", { className: C.hint, children: o }) : null, e[18] = o, e[19] = x) : x = e[19], a = C.container, c = "group", b = u, f = "checkbox-group", y = t.map((L) => /* @__PURE__ */ d.jsx(Oe, { name: s, value: L.value, label: L.label, checked: z.includes(L.value), onChange: () => R(L.value), disabled: r || L.disabled, readOnly: n }, L.value)), e[0] = u, e[1] = p, e[2] = r, e[3] = o, e[4] = s, e[5] = i, e[6] = t, e[7] = n, e[8] = l, e[9] = a, e[10] = c, e[11] = b, e[12] = f, e[13] = y, e[14] = h, e[15] = x;
  } else
    a = e[9], c = e[10], b = e[11], f = e[12], y = e[13], h = e[14], x = e[15];
  let k;
  e[20] !== a || e[21] !== c || e[22] !== b || e[23] !== f || e[24] !== y ? (k = /* @__PURE__ */ d.jsx("div", { className: a, role: c, "aria-label": b, "data-testid": f, children: y }), e[20] = a, e[21] = c, e[22] = b, e[23] = f, e[24] = y, e[25] = k) : k = e[25];
  let v;
  return e[26] !== k || e[27] !== h || e[28] !== x ? (v = /* @__PURE__ */ d.jsxs("div", { className: h, children: [
    x,
    k
  ] }), e[26] = k, e[27] = h, e[28] = x, e[29] = v) : v = e[29], v;
}, Fe = "_container_1dyth_1", Ve = {
  container: Fe
}, He = (m) => {
  const e = T.c(19), {
    name: s,
    options: t,
    value: l,
    onChange: i,
    disabled: _,
    readOnly: g,
    className: p,
    ariaLabel: u
  } = m, o = _ === void 0 ? !1 : _, r = g === void 0 ? !1 : g;
  let n;
  e[0] !== p ? (n = q(Ve.container, p), e[0] = p, e[1] = n) : n = e[1];
  let a;
  if (e[2] !== o || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== r || e[7] !== l) {
    let b;
    e[9] !== o || e[10] !== s || e[11] !== i || e[12] !== r || e[13] !== l ? (b = (f) => /* @__PURE__ */ d.jsx(ke, { name: s, value: f.value, label: f.label, checked: l === f.value, onChange: () => i(f.value), disabled: o || f.disabled, readOnly: r }, f.value), e[9] = o, e[10] = s, e[11] = i, e[12] = r, e[13] = l, e[14] = b) : b = e[14], a = t.map(b), e[2] = o, e[3] = s, e[4] = i, e[5] = t, e[6] = r, e[7] = l, e[8] = a;
  } else
    a = e[8];
  let c;
  return e[15] !== u || e[16] !== n || e[17] !== a ? (c = /* @__PURE__ */ d.jsx("div", { className: n, role: "radiogroup", "aria-label": u, children: a }), e[15] = u, e[16] = n, e[17] = a, e[18] = c) : c = e[18], c;
}, P = (m) => {
  const e = T.c(14), {
    name: s,
    options: t,
    value: l,
    onChange: i,
    description: _,
    disabled: g,
    readOnly: p,
    multiple: u,
    multipleHint: o
  } = m, r = g === void 0 ? !1 : g, n = p === void 0 ? !1 : p, a = u === void 0 ? !1 : u, c = !!_.isHorizontal, b = !!_.isWrapVariants, f = c ? "horizontal" : "vertical";
  let y;
  e[0] !== r || e[1] !== c || e[2] !== a || e[3] !== o || e[4] !== s || e[5] !== i || e[6] !== t || e[7] !== n || e[8] !== l || e[9] !== b ? (y = a ? /* @__PURE__ */ d.jsx(Ie, { className: q(j.radioGroup, c && j.radioGroupHorizontal, b && j.radioGroupWrap), name: s, options: t, value: l, onChange: i, disabled: r, readOnly: n, ariaLabel: "test-options", hint: o }) : /* @__PURE__ */ d.jsx(He, { className: q(j.radioGroup, c && j.radioGroupHorizontal, b && j.radioGroupWrap), name: s, options: t, value: l, onChange: i, disabled: r, readOnly: n, ariaLabel: "test-options" }), e[0] = r, e[1] = c, e[2] = a, e[3] = o, e[4] = s, e[5] = i, e[6] = t, e[7] = n, e[8] = l, e[9] = b, e[10] = y) : y = e[10];
  let h;
  return e[11] !== f || e[12] !== y ? (h = /* @__PURE__ */ d.jsx("div", { "data-testid": "test-options", "data-layout": f, children: y }), e[11] = f, e[12] = y, e[13] = h) : h = e[13], h;
}, G = (m, e) => m == null || m === "" ? "" : K(m) ? e(m) : typeof m == "string" ? m : "", M = (m) => {
  const e = T.c(19), {
    description: s,
    deps: t
  } = m;
  let l;
  e[0] !== t ? (l = (c) => t.global.translateTasks(c), e[0] = t, e[1] = l) : l = e[1];
  const i = l;
  let _;
  e[2] !== s.question || e[3] !== i ? (_ = G(s.question, i), e[2] = s.question, e[3] = i, e[4] = _) : _ = e[4];
  const g = _;
  let p;
  e[5] !== s.questionAfter || e[6] !== i ? (p = G(s.questionAfter, i), e[5] = s.questionAfter, e[6] = i, e[7] = p) : p = e[7];
  const u = p;
  let o;
  e[8] !== s.questionAlign || e[9] !== s.questionFontSize ? (o = {}, s.questionFontSize && (o.fontSize = s.questionFontSize), s.questionAlign && (o.textAlign = s.questionAlign), e[8] = s.questionAlign, e[9] = s.questionFontSize, e[10] = o) : o = e[10];
  let r;
  e[11] !== g || e[12] !== o ? (r = g ? /* @__PURE__ */ d.jsx("div", { className: j.question, "data-testid": "test-question", style: Object.keys(o).length > 0 ? o : void 0, children: /* @__PURE__ */ d.jsx($, { children: g }) }) : null, e[11] = g, e[12] = o, e[13] = r) : r = e[13];
  let n;
  e[14] !== u ? (n = u ? /* @__PURE__ */ d.jsx("div", { className: j.questionAfter, children: /* @__PURE__ */ d.jsx($, { children: u }) }) : null, e[14] = u, e[15] = n) : n = e[15];
  let a;
  return e[16] !== r || e[17] !== n ? (a = /* @__PURE__ */ d.jsxs(d.Fragment, { children: [
    r,
    n
  ] }), e[16] = r, e[17] = n, e[18] = a) : a = e[18], a;
}, Be = (m) => {
  const e = T.c(36), {
    task: s,
    deps: t,
    answer: l,
    solution: i
  } = m;
  let _;
  e[0] !== t ? (_ = (v) => t.global.translateTasks(v), e[0] = t, e[1] = _) : _ = e[1];
  const g = _;
  let p, u, o, r;
  e[2] !== l || e[3] !== i || e[4] !== s.description || e[5] !== g ? (u = F(s.description.variants, g), p = X(s.description, i, g), r = S(u, l), o = S(u, p), e[2] = l, e[3] = i, e[4] = s.description, e[5] = g, e[6] = p, e[7] = u, e[8] = o, e[9] = r) : (p = e[6], u = e[7], o = e[8], r = e[9]);
  const n = o;
  let a;
  e[10] !== t || e[11] !== s.title ? (a = /* @__PURE__ */ d.jsx(V, { title: s.title, deps: t }), e[10] = t, e[11] = s.title, e[12] = a) : a = e[12];
  let c, b;
  e[13] !== t || e[14] !== s.description ? (c = /* @__PURE__ */ d.jsx(M, { description: s.description, deps: t }), b = /* @__PURE__ */ d.jsx(H, { description: s.description, deps: t }), e[13] = t, e[14] = s.description, e[15] = c, e[16] = b) : (c = e[15], b = e[16]);
  let f;
  e[17] !== n || e[18] !== t || e[19] !== r ? (f = /* @__PURE__ */ d.jsx(Z, { userAnswer: r, correctAnswer: n, deps: t }), e[17] = n, e[18] = t, e[19] = r, e[20] = f) : f = e[20];
  const y = `${s.id}-solution`;
  let h;
  e[21] !== p || e[22] !== u || e[23] !== y || e[24] !== s.description ? (h = /* @__PURE__ */ d.jsx(P, { name: y, options: u, value: p, onChange: we, description: s.description, readOnly: !0 }), e[21] = p, e[22] = u, e[23] = y, e[24] = s.description, e[25] = h) : h = e[25];
  let x;
  e[26] !== t || e[27] !== i ? (x = /* @__PURE__ */ d.jsx(ee, { solution: i, deps: t }), e[26] = t, e[27] = i, e[28] = x) : x = e[28];
  let k;
  return e[29] !== a || e[30] !== c || e[31] !== b || e[32] !== f || e[33] !== h || e[34] !== x ? (k = /* @__PURE__ */ d.jsxs("div", { className: j.container, children: [
    a,
    c,
    b,
    f,
    h,
    x
  ] }), e[29] = a, e[30] = c, e[31] = b, e[32] = f, e[33] = h, e[34] = x, e[35] = k) : k = e[35], k;
};
function we() {
}
const Pe = (m) => {
  var e, s;
  return (s = (e = m.localize) == null ? void 0 : e.pickEveryFittingOption) != null ? s : "Выберите все подходящие варианты";
}, Me = ({
  id: m
}) => {
  const e = (s) => {
    const t = T.c(31), {
      task: l,
      deps: i,
      answer: _,
      onChange: g
    } = s;
    if (Y(l.solution)) {
      let v;
      return t[0] !== _ || t[1] !== i || t[2] !== l ? (v = /* @__PURE__ */ d.jsx(Be, { task: l, deps: i, answer: _, solution: l.solution }), t[0] = _, t[1] = i, t[2] = l, t[3] = v) : v = t[3], v;
    }
    let p;
    t[4] !== i ? (p = (v) => i.global.translateTasks(v), t[4] = i, t[5] = p) : p = t[5];
    const u = p;
    let o;
    t[6] !== l.description.variants || t[7] !== u ? (o = F(l.description.variants, u), t[6] = l.description.variants, t[7] = u, t[8] = o) : o = t[8];
    const r = o;
    let n;
    t[9] !== i || t[10] !== l.title ? (n = /* @__PURE__ */ d.jsx(V, { title: l.title, deps: i }), t[9] = i, t[10] = l.title, t[11] = n) : n = t[11];
    let a, c;
    t[12] !== i || t[13] !== l.description ? (a = /* @__PURE__ */ d.jsx(M, { description: l.description, deps: i }), c = /* @__PURE__ */ d.jsx(H, { description: l.description, deps: i }), t[12] = i, t[13] = l.description, t[14] = a, t[15] = c) : (a = t[14], c = t[15]);
    const b = String(l.id), f = l.description, y = !!l.hasMultipleAnswers;
    let h;
    t[16] !== i ? (h = Pe(i), t[16] = i, t[17] = h) : h = t[17];
    let x;
    t[18] !== _ || t[19] !== g || t[20] !== r || t[21] !== b || t[22] !== y || t[23] !== h || t[24] !== l.description ? (x = /* @__PURE__ */ d.jsx(P, { name: b, options: r, value: _, onChange: g, description: f, multiple: y, multipleHint: h }), t[18] = _, t[19] = g, t[20] = r, t[21] = b, t[22] = y, t[23] = h, t[24] = l.description, t[25] = x) : x = t[25];
    let k;
    return t[26] !== x || t[27] !== n || t[28] !== a || t[29] !== c ? (k = /* @__PURE__ */ d.jsxs("div", { className: j.container, "data-template-id": m, children: [
      n,
      a,
      c,
      x
    ] }), t[26] = x, t[27] = n, t[28] = a, t[29] = c, t[30] = k) : k = t[30], k;
  };
  return e.displayName = m, e;
}, We = Me({
  id: "test.plain"
});
export {
  We as TestPlain,
  We as default
};
