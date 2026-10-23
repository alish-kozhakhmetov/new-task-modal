import { c as T, j as m, P as Q, Q as O, a0 as X, a1 as Z, a2 as J, w as q, f as $, a3 as E, r as S, a4 as Y, i as ee, a5 as H, a6 as te, a7 as I, a as w, e as se } from "./index-BNRpFkFw.js";
import { S as ne, a as ie } from "./solution-answer-panel-UNpyOQ7G.js";
const le = "_container_1iy8p_2", ae = "_question_1iy8p_8", oe = "_questionAfter_1iy8p_13", re = "_figures_1iy8p_17", ce = "_figuresVertical_1iy8p_23", de = "_images_1iy8p_28", ue = "_unsupported_1iy8p_39", pe = "_radioGroup_1iy8p_45", fe = "_radioGroupHorizontal_1iy8p_49", me = "_radioGroupWrap_1iy8p_55", v = {
  container: le,
  question: ae,
  questionAfter: oe,
  figures: re,
  figuresVertical: ce,
  images: de,
  unsupported: ue,
  radioGroup: pe,
  radioGroupHorizontal: fe,
  radioGroupWrap: me
}, P = (c) => {
  const e = T.c(25), {
    description: s,
    deps: t
  } = c;
  let n, i, h, _, p, u;
  if (e[0] !== s.background || e[1] !== s.figures || e[2] !== s.images || e[3] !== s.isFiguresVertical) {
    u = Symbol.for("react.early_return_sentinel");
    e: {
      const l = Array.isArray(s.images) ? s.images.filter(he) : [];
      let a;
      e[10] !== s.figures ? (a = Array.isArray(s.figures) ? s.figures : [], e[10] = s.figures, e[11] = a) : a = e[11], n = a;
      const d = !!s.isFiguresVertical;
      if (!l.length && !n.length && !s.background) {
        u = null;
        break e;
      }
      i = `${v.figures} ${d ? v.figuresVertical : ""}`, h = "test-figures", e[12] !== s.background ? (_ = s.background ? /* @__PURE__ */ m.jsx("div", { dangerouslySetInnerHTML: {
        __html: s.background
      } }) : null, e[12] = s.background, e[13] = _) : _ = e[13], p = l.length > 0 ? /* @__PURE__ */ m.jsx("div", { className: v.images, children: l.map(be) }) : null;
    }
    e[0] = s.background, e[1] = s.figures, e[2] = s.images, e[3] = s.isFiguresVertical, e[4] = n, e[5] = i, e[6] = h, e[7] = _, e[8] = p, e[9] = u;
  } else
    n = e[4], i = e[5], h = e[6], _ = e[7], p = e[8], u = e[9];
  if (u !== Symbol.for("react.early_return_sentinel"))
    return u;
  let o;
  if (e[14] !== t || e[15] !== n) {
    let l;
    e[17] !== t ? (l = (a, d) => {
      const b = Q(a), f = Number(b.type);
      switch (f) {
        case O.Text:
          return /* @__PURE__ */ m.jsx(J, { part: b, deps: t }, d);
        case O.Image:
          return /* @__PURE__ */ m.jsx(Z, { part: b, deps: t }, d);
        case O.AngleList:
          return /* @__PURE__ */ m.jsx(X, { part: b }, d);
        default:
          return /* @__PURE__ */ m.jsxs("p", { className: v.unsupported, children: [
            "Unsupported figure type ",
            f
          ] }, d);
      }
    }, e[17] = t, e[18] = l) : l = e[18], o = n.map(l), e[14] = t, e[15] = n, e[16] = o;
  } else
    o = e[16];
  let r;
  return e[19] !== i || e[20] !== h || e[21] !== _ || e[22] !== p || e[23] !== o ? (r = /* @__PURE__ */ m.jsxs("div", { className: i, "data-testid": h, children: [
    _,
    p,
    o
  ] }), e[19] = i, e[20] = h, e[21] = _, e[22] = p, e[23] = o, e[24] = r) : r = e[24], r;
};
function he(c) {
  return typeof c == "string" && c.trim();
}
function be(c, e) {
  return /* @__PURE__ */ m.jsx("div", { dangerouslySetInnerHTML: {
    __html: c
  } }, e);
}
const _e = "_radioLabel_129ko_1", xe = "_radioButton_129ko_5", ge = "_disabled_129ko_20", ye = "_readOnly_129ko_20", ke = "_checked_129ko_24", ve = "_radioInput_129ko_39", je = "_radioControl_129ko_52", Le = "_htmlLabel_129ko_95", A = {
  radioLabel: _e,
  radioButton: xe,
  disabled: ge,
  readOnly: ye,
  checked: ke,
  radioInput: ve,
  radioControl: je,
  htmlLabel: Le
}, B = (c) => c.includes("svg") || c.includes("<div"), Te = (c) => {
  const e = T.c(23), {
    name: s,
    value: t,
    label: n,
    checked: i,
    onChange: h,
    disabled: _,
    readOnly: p
  } = c, u = _ === void 0 ? !1 : _, o = p === void 0 ? !1 : p, r = q.useId();
  let l, a;
  e[0] !== i || e[1] !== u || e[2] !== n || e[3] !== o ? (l = B(n), a = $(A.radioButton, i && A.checked, u && !o && A.disabled, o && A.readOnly, l && A.htmlLabel), e[0] = i, e[1] = u, e[2] = n, e[3] = o, e[4] = l, e[5] = a) : (l = e[4], a = e[5]);
  const d = u || o, b = l ? t : void 0;
  let f;
  e[6] !== i || e[7] !== r || e[8] !== s || e[9] !== h || e[10] !== d || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ m.jsx("input", { id: r, type: "radio", name: s, value: t, checked: i, onChange: h, disabled: d, className: A.radioInput, "aria-label": b }), e[6] = i, e[7] = r, e[8] = s, e[9] = h, e[10] = d, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ m.jsx("span", { className: A.radioControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let x;
  e[15] !== l || e[16] !== n ? (x = l ? /* @__PURE__ */ m.jsx("span", { className: $(A.radioLabel, E.mathText), dangerouslySetInnerHTML: {
    __html: n
  } }) : /* @__PURE__ */ m.jsx(S, { inline: !0, className: A.radioLabel, children: n }), e[15] = l, e[16] = n, e[17] = x) : x = e[17];
  let g;
  return e[18] !== r || e[19] !== a || e[20] !== f || e[21] !== x ? (g = /* @__PURE__ */ m.jsxs("label", { className: a, htmlFor: r, children: [
    f,
    y,
    x
  ] }), e[18] = r, e[19] = a, e[20] = f, e[21] = x, e[22] = g) : g = e[22], g;
}, Ae = "_checkboxLabel_1i7h7_2", Ne = "_checkbox_1i7h7_2", $e = "_disabled_1i7h7_22", Ce = "_readOnly_1i7h7_22", Se = "_checked_1i7h7_26", Oe = "_checkboxInput_1i7h7_41", qe = "_checkboxControl_1i7h7_58", Ie = "_htmlLabel_1i7h7_116", N = {
  checkboxLabel: Ae,
  checkbox: Ne,
  disabled: $e,
  readOnly: Ce,
  checked: Se,
  checkboxInput: Oe,
  checkboxControl: qe,
  htmlLabel: Ie
}, Ge = (c) => {
  const e = T.c(23), {
    name: s,
    value: t,
    label: n,
    checked: i,
    onChange: h,
    disabled: _,
    readOnly: p
  } = c, u = _ === void 0 ? !1 : _, o = p === void 0 ? !1 : p, r = q.useId();
  let l, a;
  e[0] !== i || e[1] !== u || e[2] !== n || e[3] !== o ? (l = B(n), a = $(N.checkbox, i && N.checked, u && !o && N.disabled, o && N.readOnly, l && N.htmlLabel), e[0] = i, e[1] = u, e[2] = n, e[3] = o, e[4] = l, e[5] = a) : (l = e[4], a = e[5]);
  const d = u || o, b = l ? t : void 0;
  let f;
  e[6] !== i || e[7] !== r || e[8] !== s || e[9] !== h || e[10] !== d || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ m.jsx("input", { id: r, type: "checkbox", name: s, value: t, checked: i, onChange: h, disabled: d, className: N.checkboxInput, "aria-label": b }), e[6] = i, e[7] = r, e[8] = s, e[9] = h, e[10] = d, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ m.jsx("span", { className: N.checkboxControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let x;
  e[15] !== l || e[16] !== n ? (x = l ? /* @__PURE__ */ m.jsx("span", { className: $(N.checkboxLabel, E.mathText), dangerouslySetInnerHTML: {
    __html: n
  } }) : /* @__PURE__ */ m.jsx(S, { inline: !0, className: N.checkboxLabel, children: n }), e[15] = l, e[16] = n, e[17] = x) : x = e[17];
  let g;
  return e[18] !== r || e[19] !== a || e[20] !== f || e[21] !== x ? (g = /* @__PURE__ */ m.jsxs("label", { className: a, htmlFor: r, children: [
    f,
    y,
    x
  ] }), e[18] = r, e[19] = a, e[20] = f, e[21] = x, e[22] = g) : g = e[22], g;
}, Ve = "_hint_srhhu_2", Ee = "_container_srhhu_6", G = {
  hint: Ve,
  container: Ee
}, z = ";;", F = (c) => (c != null ? c : "").split(z).map((e) => e.trim()).filter(Boolean), M = (c, e) => c.filter((s) => e.includes(s.value)).map((s) => s.value).join(z), He = (c) => {
  const e = T.c(30), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    disabled: h,
    readOnly: _,
    className: p,
    ariaLabel: u,
    hint: o
  } = c, r = h === void 0 ? !1 : h, l = _ === void 0 ? !1 : _;
  let a, d, b, f, y, x, g;
  if (e[0] !== u || e[1] !== p || e[2] !== r || e[3] !== o || e[4] !== s || e[5] !== i || e[6] !== t || e[7] !== l || e[8] !== n) {
    const C = F(n), K = (L) => {
      const D = C.includes(L) ? C.filter((U) => U !== L) : [...C, L];
      i(M(t, D));
    };
    e[16] !== p ? (x = $(p), e[16] = p, e[17] = x) : x = e[17], e[18] !== o ? (g = o ? /* @__PURE__ */ m.jsx("p", { className: G.hint, children: o }) : null, e[18] = o, e[19] = g) : g = e[19], a = G.container, d = "group", b = u, f = "checkbox-group", y = t.map((L) => /* @__PURE__ */ m.jsx(Ge, { name: s, value: L.value, label: L.label, checked: C.includes(L.value), onChange: () => K(L.value), disabled: r || L.disabled, readOnly: l }, L.value)), e[0] = u, e[1] = p, e[2] = r, e[3] = o, e[4] = s, e[5] = i, e[6] = t, e[7] = l, e[8] = n, e[9] = a, e[10] = d, e[11] = b, e[12] = f, e[13] = y, e[14] = x, e[15] = g;
  } else
    a = e[9], d = e[10], b = e[11], f = e[12], y = e[13], x = e[14], g = e[15];
  let k;
  e[20] !== a || e[21] !== d || e[22] !== b || e[23] !== f || e[24] !== y ? (k = /* @__PURE__ */ m.jsx("div", { className: a, role: d, "aria-label": b, "data-testid": f, children: y }), e[20] = a, e[21] = d, e[22] = b, e[23] = f, e[24] = y, e[25] = k) : k = e[25];
  let j;
  return e[26] !== k || e[27] !== x || e[28] !== g ? (j = /* @__PURE__ */ m.jsxs("div", { className: x, children: [
    g,
    k
  ] }), e[26] = k, e[27] = x, e[28] = g, e[29] = j) : j = e[29], j;
}, we = "_container_531kj_1", Pe = {
  container: we
}, Be = (c) => {
  const e = T.c(19), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    disabled: h,
    readOnly: _,
    className: p,
    ariaLabel: u
  } = c, o = h === void 0 ? !1 : h, r = _ === void 0 ? !1 : _;
  let l;
  e[0] !== p ? (l = $(Pe.container, p), e[0] = p, e[1] = l) : l = e[1];
  let a;
  if (e[2] !== o || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== r || e[7] !== n) {
    let b;
    e[9] !== o || e[10] !== s || e[11] !== i || e[12] !== r || e[13] !== n ? (b = (f) => /* @__PURE__ */ m.jsx(Te, { name: s, value: f.value, label: f.label, checked: n === f.value, onChange: () => i(f.value), disabled: o || f.disabled, readOnly: r }, f.value), e[9] = o, e[10] = s, e[11] = i, e[12] = r, e[13] = n, e[14] = b) : b = e[14], a = t.map(b), e[2] = o, e[3] = s, e[4] = i, e[5] = t, e[6] = r, e[7] = n, e[8] = a;
  } else
    a = e[8];
  let d;
  return e[15] !== u || e[16] !== l || e[17] !== a ? (d = /* @__PURE__ */ m.jsx("div", { className: l, role: "radiogroup", "aria-label": u, children: a }), e[15] = u, e[16] = l, e[17] = a, e[18] = d) : d = e[18], d;
}, ze = (c) => {
  if (!(c instanceof HTMLElement)) return !1;
  if (c.isContentEditable || c.tagName === "TEXTAREA") return !0;
  if (c.tagName !== "INPUT") return !1;
  const e = c.type;
  return e !== "radio" && e !== "checkbox" && e !== "button";
}, Fe = (c) => {
  const e = /^Key([A-Z])$/.exec(c);
  if (e) return e[1].charCodeAt(0) - 65;
  const s = /^(?:Digit|Numpad)([1-9])$/.exec(c);
  return s ? Number(s[1]) - 1 : -1;
}, Me = (c) => {
  const e = T.c(9), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    multiple: h,
    enabled: _
  } = c, p = Y(Re);
  let u, o;
  e[0] !== _ || e[1] !== p || e[2] !== h || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== n ? (u = () => {
    if (!_ || p)
      return;
    const r = (l) => {
      var y;
      if (l.defaultPrevented || l.isComposing || l.metaKey || l.ctrlKey || l.altKey || ze(l.target))
        return;
      const a = Fe(l.code), d = t[a];
      if (!d)
        return;
      if (l.preventDefault(), (y = document.querySelector(`input[name="${CSS.escape(s)}"][value="${CSS.escape(d.value)}"]`)) == null || y.focus({
        preventScroll: !0
      }), !h) {
        i(d.value);
        return;
      }
      const b = F(n), f = b.includes(d.value) ? b.filter((x) => x !== d.value) : [...b, d.value];
      i(M(t, f));
    };
    return document.addEventListener("keydown", r), () => document.removeEventListener("keydown", r);
  }, o = [_, p, s, t, n, i, h], e[0] = _, e[1] = p, e[2] = h, e[3] = s, e[4] = i, e[5] = t, e[6] = n, e[7] = u, e[8] = o) : (u = e[7], o = e[8]), q.useEffect(u, o);
};
function Re(c) {
  return c.taskList !== null;
}
const R = (c) => {
  const e = T.c(21), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    description: h,
    disabled: _,
    readOnly: p,
    multiple: u,
    multipleHint: o
  } = c, r = _ === void 0 ? !1 : _, l = p === void 0 ? !1 : p, a = u === void 0 ? !1 : u, d = !r && !l;
  let b;
  e[0] !== a || e[1] !== s || e[2] !== i || e[3] !== t || e[4] !== d || e[5] !== n ? (b = {
    name: s,
    options: t,
    value: n,
    onChange: i,
    multiple: a,
    enabled: d
  }, e[0] = a, e[1] = s, e[2] = i, e[3] = t, e[4] = d, e[5] = n, e[6] = b) : b = e[6], Me(b);
  const f = !!h.isHorizontal, y = !!h.isWrapVariants, x = f ? "horizontal" : "vertical";
  let g;
  e[7] !== r || e[8] !== f || e[9] !== a || e[10] !== o || e[11] !== s || e[12] !== i || e[13] !== t || e[14] !== l || e[15] !== n || e[16] !== y ? (g = a ? /* @__PURE__ */ m.jsx(He, { className: $(v.radioGroup, f && v.radioGroupHorizontal, y && v.radioGroupWrap), name: s, options: t, value: n, onChange: i, disabled: r, readOnly: l, ariaLabel: "test-options", hint: o }) : /* @__PURE__ */ m.jsx(Be, { className: $(v.radioGroup, f && v.radioGroupHorizontal, y && v.radioGroupWrap), name: s, options: t, value: n, onChange: i, disabled: r, readOnly: l, ariaLabel: "test-options" }), e[7] = r, e[8] = f, e[9] = a, e[10] = o, e[11] = s, e[12] = i, e[13] = t, e[14] = l, e[15] = n, e[16] = y, e[17] = g) : g = e[17];
  let k;
  return e[18] !== x || e[19] !== g ? (k = /* @__PURE__ */ m.jsx("div", { "data-testid": "test-options", "data-layout": x, children: g }), e[18] = x, e[19] = g, e[20] = k) : k = e[20], k;
}, V = (c, e) => c == null || c === "" ? "" : ee(c) ? e(c) : typeof c == "string" ? c : "", W = (c) => {
  const e = T.c(18), {
    description: s,
    deps: t
  } = c;
  let n;
  e[0] !== t ? (n = (d) => t.global.translateTasks(d), e[0] = t, e[1] = n) : n = e[1];
  const i = n;
  let h;
  e[2] !== s.question || e[3] !== i ? (h = V(s.question, i), e[2] = s.question, e[3] = i, e[4] = h) : h = e[4];
  const _ = h;
  let p;
  e[5] !== s.questionAfter || e[6] !== i ? (p = V(s.questionAfter, i), e[5] = s.questionAfter, e[6] = i, e[7] = p) : p = e[7];
  const u = p;
  let o;
  e[8] !== s.questionAlign ? (o = {}, s.questionAlign && (o.textAlign = s.questionAlign), e[8] = s.questionAlign, e[9] = o) : o = e[9];
  let r;
  e[10] !== _ || e[11] !== o ? (r = _ ? /* @__PURE__ */ m.jsx("div", { className: v.question, "data-testid": "test-question", style: Object.keys(o).length > 0 ? o : void 0, children: /* @__PURE__ */ m.jsx(S, { children: _ }) }) : null, e[10] = _, e[11] = o, e[12] = r) : r = e[12];
  let l;
  e[13] !== u ? (l = u ? /* @__PURE__ */ m.jsx("div", { className: v.questionAfter, children: /* @__PURE__ */ m.jsx(S, { children: u }) }) : null, e[13] = u, e[14] = l) : l = e[14];
  let a;
  return e[15] !== r || e[16] !== l ? (a = /* @__PURE__ */ m.jsxs(m.Fragment, { children: [
    r,
    l
  ] }), e[15] = r, e[16] = l, e[17] = a) : a = e[17], a;
}, We = (c) => {
  const e = T.c(36), {
    task: s,
    deps: t,
    answer: n,
    solution: i
  } = c;
  let h;
  e[0] !== t ? (h = (j) => t.global.translateTasks(j), e[0] = t, e[1] = h) : h = e[1];
  const _ = h;
  let p, u, o, r;
  e[2] !== n || e[3] !== i || e[4] !== s.description || e[5] !== _ ? (u = H(s.description.variants, _), p = te(s.description, i, _), r = I(u, n), o = I(u, p), e[2] = n, e[3] = i, e[4] = s.description, e[5] = _, e[6] = p, e[7] = u, e[8] = o, e[9] = r) : (p = e[6], u = e[7], o = e[8], r = e[9]);
  const l = o;
  let a;
  e[10] !== t || e[11] !== s.title ? (a = /* @__PURE__ */ m.jsx(w, { title: s.title, deps: t }), e[10] = t, e[11] = s.title, e[12] = a) : a = e[12];
  let d, b;
  e[13] !== t || e[14] !== s.description ? (d = /* @__PURE__ */ m.jsx(W, { description: s.description, deps: t }), b = /* @__PURE__ */ m.jsx(P, { description: s.description, deps: t }), e[13] = t, e[14] = s.description, e[15] = d, e[16] = b) : (d = e[15], b = e[16]);
  let f;
  e[17] !== l || e[18] !== t || e[19] !== r ? (f = /* @__PURE__ */ m.jsx(ne, { userAnswer: r, correctAnswer: l, deps: t }), e[17] = l, e[18] = t, e[19] = r, e[20] = f) : f = e[20];
  const y = `${s.id}-solution`;
  let x;
  e[21] !== p || e[22] !== u || e[23] !== y || e[24] !== s.description ? (x = /* @__PURE__ */ m.jsx(R, { name: y, options: u, value: p, onChange: Ke, description: s.description, readOnly: !0 }), e[21] = p, e[22] = u, e[23] = y, e[24] = s.description, e[25] = x) : x = e[25];
  let g;
  e[26] !== t || e[27] !== i ? (g = /* @__PURE__ */ m.jsx(ie, { solution: i, deps: t }), e[26] = t, e[27] = i, e[28] = g) : g = e[28];
  let k;
  return e[29] !== a || e[30] !== d || e[31] !== b || e[32] !== f || e[33] !== x || e[34] !== g ? (k = /* @__PURE__ */ m.jsxs("div", { className: v.container, children: [
    a,
    d,
    b,
    f,
    x,
    g
  ] }), e[29] = a, e[30] = d, e[31] = b, e[32] = f, e[33] = x, e[34] = g, e[35] = k) : k = e[35], k;
};
function Ke() {
}
const De = (c) => {
  var e, s;
  return (s = (e = c.localize) == null ? void 0 : e.pickEveryFittingOption) != null ? s : "Выберите все подходящие варианты";
}, Ue = ({
  id: c
}) => {
  const e = (s) => {
    const t = T.c(31), {
      task: n,
      deps: i,
      answer: h,
      onChange: _
    } = s;
    if (se(n.solution)) {
      let j;
      return t[0] !== h || t[1] !== i || t[2] !== n ? (j = /* @__PURE__ */ m.jsx(We, { task: n, deps: i, answer: h, solution: n.solution }), t[0] = h, t[1] = i, t[2] = n, t[3] = j) : j = t[3], j;
    }
    let p;
    t[4] !== i ? (p = (j) => i.global.translateTasks(j), t[4] = i, t[5] = p) : p = t[5];
    const u = p;
    let o;
    t[6] !== n.description.variants || t[7] !== u ? (o = H(n.description.variants, u), t[6] = n.description.variants, t[7] = u, t[8] = o) : o = t[8];
    const r = o;
    let l;
    t[9] !== i || t[10] !== n.title ? (l = /* @__PURE__ */ m.jsx(w, { title: n.title, deps: i }), t[9] = i, t[10] = n.title, t[11] = l) : l = t[11];
    let a, d;
    t[12] !== i || t[13] !== n.description ? (a = /* @__PURE__ */ m.jsx(W, { description: n.description, deps: i }), d = /* @__PURE__ */ m.jsx(P, { description: n.description, deps: i }), t[12] = i, t[13] = n.description, t[14] = a, t[15] = d) : (a = t[14], d = t[15]);
    const b = String(n.id), f = n.description, y = !!n.hasMultipleAnswers;
    let x;
    t[16] !== i ? (x = De(i), t[16] = i, t[17] = x) : x = t[17];
    let g;
    t[18] !== h || t[19] !== _ || t[20] !== r || t[21] !== b || t[22] !== y || t[23] !== x || t[24] !== n.description ? (g = /* @__PURE__ */ m.jsx(R, { name: b, options: r, value: h, onChange: _, description: f, multiple: y, multipleHint: x }), t[18] = h, t[19] = _, t[20] = r, t[21] = b, t[22] = y, t[23] = x, t[24] = n.description, t[25] = g) : g = t[25];
    let k;
    return t[26] !== g || t[27] !== l || t[28] !== a || t[29] !== d ? (k = /* @__PURE__ */ m.jsxs("div", { className: v.container, "data-template-id": c, children: [
      l,
      a,
      d,
      g
    ] }), t[26] = g, t[27] = l, t[28] = a, t[29] = d, t[30] = k) : k = t[30], k;
  };
  return e.displayName = c, e;
}, Ze = Ue({
  id: "test.plain"
});
export {
  Ze as TestPlain,
  Ze as default
};
