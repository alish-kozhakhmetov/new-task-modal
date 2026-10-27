import { c as L, j as m, Q, R as O, a1 as X, a2 as Z, a3 as J, x as q, f as $, a4 as V, r as S, a5 as Y, i as ee, a6 as H, a7 as te, a8 as I, a as w, e as se, a9 as ne, aa as ie } from "./index-1rSmWLFL.js";
import { S as le, a as ae } from "./solution-answer-panel-BCQOAZ1e.js";
const oe = "_container_1iy8p_2", re = "_question_1iy8p_8", ce = "_questionAfter_1iy8p_13", de = "_figures_1iy8p_17", ue = "_figuresVertical_1iy8p_23", pe = "_images_1iy8p_28", fe = "_unsupported_1iy8p_39", me = "_radioGroup_1iy8p_45", he = "_radioGroupHorizontal_1iy8p_49", be = "_radioGroupWrap_1iy8p_55", v = {
  container: oe,
  question: re,
  questionAfter: ce,
  figures: de,
  figuresVertical: ue,
  images: pe,
  unsupported: fe,
  radioGroup: me,
  radioGroupHorizontal: he,
  radioGroupWrap: be
}, B = (r) => {
  const e = L.c(25), {
    description: s,
    deps: t
  } = r;
  let n, i, h, _, p, u;
  if (e[0] !== s.background || e[1] !== s.figures || e[2] !== s.images || e[3] !== s.isFiguresVertical) {
    u = Symbol.for("react.early_return_sentinel");
    e: {
      const l = Array.isArray(s.images) ? s.images.filter(_e) : [];
      let a;
      e[10] !== s.figures ? (a = Array.isArray(s.figures) ? s.figures : [], e[10] = s.figures, e[11] = a) : a = e[11], n = a;
      const d = !!s.isFiguresVertical;
      if (!l.length && !n.length && !s.background) {
        u = null;
        break e;
      }
      i = `${v.figures} ${d ? v.figuresVertical : ""}`, h = "test-figures", e[12] !== s.background ? (_ = s.background ? /* @__PURE__ */ m.jsx("div", { dangerouslySetInnerHTML: {
        __html: s.background
      } }) : null, e[12] = s.background, e[13] = _) : _ = e[13], p = l.length > 0 ? /* @__PURE__ */ m.jsx("div", { className: v.images, children: l.map(xe) }) : null;
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
  let c;
  return e[19] !== i || e[20] !== h || e[21] !== _ || e[22] !== p || e[23] !== o ? (c = /* @__PURE__ */ m.jsxs("div", { className: i, "data-testid": h, children: [
    _,
    p,
    o
  ] }), e[19] = i, e[20] = h, e[21] = _, e[22] = p, e[23] = o, e[24] = c) : c = e[24], c;
};
function _e(r) {
  return typeof r == "string" && r.trim();
}
function xe(r, e) {
  return /* @__PURE__ */ m.jsx("div", { dangerouslySetInnerHTML: {
    __html: r
  } }, e);
}
const ge = "_radioLabel_129ko_1", ye = "_radioButton_129ko_5", ke = "_disabled_129ko_20", ve = "_readOnly_129ko_20", je = "_checked_129ko_24", Te = "_radioInput_129ko_39", Le = "_radioControl_129ko_52", Ae = "_htmlLabel_129ko_95", A = {
  radioLabel: ge,
  radioButton: ye,
  disabled: ke,
  readOnly: ve,
  checked: je,
  radioInput: Te,
  radioControl: Le,
  htmlLabel: Ae
}, F = (r) => r.includes("svg") || r.includes("<div"), Ne = (r) => {
  const e = L.c(23), {
    name: s,
    value: t,
    label: n,
    checked: i,
    onChange: h,
    disabled: _,
    readOnly: p
  } = r, u = _ === void 0 ? !1 : _, o = p === void 0 ? !1 : p, c = q.useId();
  let l, a;
  e[0] !== i || e[1] !== u || e[2] !== n || e[3] !== o ? (l = F(n), a = $(A.radioButton, i && A.checked, u && !o && A.disabled, o && A.readOnly, l && A.htmlLabel), e[0] = i, e[1] = u, e[2] = n, e[3] = o, e[4] = l, e[5] = a) : (l = e[4], a = e[5]);
  const d = u || o, b = l ? t : void 0;
  let f;
  e[6] !== i || e[7] !== c || e[8] !== s || e[9] !== h || e[10] !== d || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ m.jsx("input", { id: c, type: "radio", name: s, value: t, checked: i, onChange: h, disabled: d, className: A.radioInput, "aria-label": b }), e[6] = i, e[7] = c, e[8] = s, e[9] = h, e[10] = d, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ m.jsx("span", { className: A.radioControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let x;
  e[15] !== l || e[16] !== n ? (x = l ? /* @__PURE__ */ m.jsx("span", { className: $(A.radioLabel, V.mathText), dangerouslySetInnerHTML: {
    __html: n
  } }) : /* @__PURE__ */ m.jsx(S, { inline: !0, className: A.radioLabel, children: n }), e[15] = l, e[16] = n, e[17] = x) : x = e[17];
  let g;
  return e[18] !== c || e[19] !== a || e[20] !== f || e[21] !== x ? (g = /* @__PURE__ */ m.jsxs("label", { className: a, htmlFor: c, children: [
    f,
    y,
    x
  ] }), e[18] = c, e[19] = a, e[20] = f, e[21] = x, e[22] = g) : g = e[22], g;
}, $e = "_checkboxLabel_1i7h7_2", Ce = "_checkbox_1i7h7_2", Se = "_disabled_1i7h7_22", Oe = "_readOnly_1i7h7_22", qe = "_checked_1i7h7_26", Ie = "_checkboxInput_1i7h7_41", Ee = "_checkboxControl_1i7h7_58", Ge = "_htmlLabel_1i7h7_116", N = {
  checkboxLabel: $e,
  checkbox: Ce,
  disabled: Se,
  readOnly: Oe,
  checked: qe,
  checkboxInput: Ie,
  checkboxControl: Ee,
  htmlLabel: Ge
}, Ve = (r) => {
  const e = L.c(23), {
    name: s,
    value: t,
    label: n,
    checked: i,
    onChange: h,
    disabled: _,
    readOnly: p
  } = r, u = _ === void 0 ? !1 : _, o = p === void 0 ? !1 : p, c = q.useId();
  let l, a;
  e[0] !== i || e[1] !== u || e[2] !== n || e[3] !== o ? (l = F(n), a = $(N.checkbox, i && N.checked, u && !o && N.disabled, o && N.readOnly, l && N.htmlLabel), e[0] = i, e[1] = u, e[2] = n, e[3] = o, e[4] = l, e[5] = a) : (l = e[4], a = e[5]);
  const d = u || o, b = l ? t : void 0;
  let f;
  e[6] !== i || e[7] !== c || e[8] !== s || e[9] !== h || e[10] !== d || e[11] !== b || e[12] !== t ? (f = /* @__PURE__ */ m.jsx("input", { id: c, type: "checkbox", name: s, value: t, checked: i, onChange: h, disabled: d, className: N.checkboxInput, "aria-label": b }), e[6] = i, e[7] = c, e[8] = s, e[9] = h, e[10] = d, e[11] = b, e[12] = t, e[13] = f) : f = e[13];
  let y;
  e[14] === Symbol.for("react.memo_cache_sentinel") ? (y = /* @__PURE__ */ m.jsx("span", { className: N.checkboxControl, "aria-hidden": !0 }), e[14] = y) : y = e[14];
  let x;
  e[15] !== l || e[16] !== n ? (x = l ? /* @__PURE__ */ m.jsx("span", { className: $(N.checkboxLabel, V.mathText), dangerouslySetInnerHTML: {
    __html: n
  } }) : /* @__PURE__ */ m.jsx(S, { inline: !0, className: N.checkboxLabel, children: n }), e[15] = l, e[16] = n, e[17] = x) : x = e[17];
  let g;
  return e[18] !== c || e[19] !== a || e[20] !== f || e[21] !== x ? (g = /* @__PURE__ */ m.jsxs("label", { className: a, htmlFor: c, children: [
    f,
    y,
    x
  ] }), e[18] = c, e[19] = a, e[20] = f, e[21] = x, e[22] = g) : g = e[22], g;
}, He = "_hint_srhhu_2", we = "_container_srhhu_6", E = {
  hint: He,
  container: we
}, P = ";;", z = (r) => (r != null ? r : "").split(P).map((e) => e.trim()).filter(Boolean), M = (r, e) => r.filter((s) => e.includes(s.value)).map((s) => s.value).join(P), Be = (r) => {
  const e = L.c(30), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    disabled: h,
    readOnly: _,
    className: p,
    ariaLabel: u,
    hint: o
  } = r, c = h === void 0 ? !1 : h, l = _ === void 0 ? !1 : _;
  let a, d, b, f, y, x, g;
  if (e[0] !== u || e[1] !== p || e[2] !== c || e[3] !== o || e[4] !== s || e[5] !== i || e[6] !== t || e[7] !== l || e[8] !== n) {
    const C = z(n), W = (T) => {
      const D = C.includes(T) ? C.filter((U) => U !== T) : [...C, T];
      i(M(t, D));
    };
    e[16] !== p ? (x = $(p), e[16] = p, e[17] = x) : x = e[17], e[18] !== o ? (g = o ? /* @__PURE__ */ m.jsx("p", { className: E.hint, children: o }) : null, e[18] = o, e[19] = g) : g = e[19], a = E.container, d = "group", b = u, f = "checkbox-group", y = t.map((T) => /* @__PURE__ */ m.jsx(Ve, { name: s, value: T.value, label: T.label, checked: C.includes(T.value), onChange: () => W(T.value), disabled: c || T.disabled, readOnly: l }, T.value)), e[0] = u, e[1] = p, e[2] = c, e[3] = o, e[4] = s, e[5] = i, e[6] = t, e[7] = l, e[8] = n, e[9] = a, e[10] = d, e[11] = b, e[12] = f, e[13] = y, e[14] = x, e[15] = g;
  } else
    a = e[9], d = e[10], b = e[11], f = e[12], y = e[13], x = e[14], g = e[15];
  let k;
  e[20] !== a || e[21] !== d || e[22] !== b || e[23] !== f || e[24] !== y ? (k = /* @__PURE__ */ m.jsx("div", { className: a, role: d, "aria-label": b, "data-testid": f, children: y }), e[20] = a, e[21] = d, e[22] = b, e[23] = f, e[24] = y, e[25] = k) : k = e[25];
  let j;
  return e[26] !== k || e[27] !== x || e[28] !== g ? (j = /* @__PURE__ */ m.jsxs("div", { className: x, children: [
    g,
    k
  ] }), e[26] = k, e[27] = x, e[28] = g, e[29] = j) : j = e[29], j;
}, Fe = "_container_531kj_1", Pe = {
  container: Fe
}, ze = (r) => {
  const e = L.c(19), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    disabled: h,
    readOnly: _,
    className: p,
    ariaLabel: u
  } = r, o = h === void 0 ? !1 : h, c = _ === void 0 ? !1 : _;
  let l;
  e[0] !== p ? (l = $(Pe.container, p), e[0] = p, e[1] = l) : l = e[1];
  let a;
  if (e[2] !== o || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== c || e[7] !== n) {
    let b;
    e[9] !== o || e[10] !== s || e[11] !== i || e[12] !== c || e[13] !== n ? (b = (f) => /* @__PURE__ */ m.jsx(Ne, { name: s, value: f.value, label: f.label, checked: n === f.value, onChange: () => i(f.value), disabled: o || f.disabled, readOnly: c }, f.value), e[9] = o, e[10] = s, e[11] = i, e[12] = c, e[13] = n, e[14] = b) : b = e[14], a = t.map(b), e[2] = o, e[3] = s, e[4] = i, e[5] = t, e[6] = c, e[7] = n, e[8] = a;
  } else
    a = e[8];
  let d;
  return e[15] !== u || e[16] !== l || e[17] !== a ? (d = /* @__PURE__ */ m.jsx("div", { className: l, role: "radiogroup", "aria-label": u, children: a }), e[15] = u, e[16] = l, e[17] = a, e[18] = d) : d = e[18], d;
}, Me = (r) => {
  if (!(r instanceof HTMLElement)) return !1;
  if (r.isContentEditable || r.tagName === "TEXTAREA") return !0;
  if (r.tagName !== "INPUT") return !1;
  const e = r.type;
  return e !== "radio" && e !== "checkbox" && e !== "button";
}, Re = (r) => {
  const e = /^Key([A-Z])$/.exec(r);
  if (e) return e[1].charCodeAt(0) - 65;
  const s = /^(?:Digit|Numpad)([1-9])$/.exec(r);
  return s ? Number(s[1]) - 1 : -1;
}, Ke = (r) => {
  const e = L.c(9), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    multiple: h,
    enabled: _
  } = r, p = Y(We);
  let u, o;
  e[0] !== _ || e[1] !== p || e[2] !== h || e[3] !== s || e[4] !== i || e[5] !== t || e[6] !== n ? (u = () => {
    if (!_ || p)
      return;
    const c = (l) => {
      var y;
      if (l.defaultPrevented || l.isComposing || l.metaKey || l.ctrlKey || l.altKey || Me(l.target))
        return;
      const a = Re(l.code), d = t[a];
      if (!d)
        return;
      if (l.preventDefault(), (y = document.querySelector(`input[name="${CSS.escape(s)}"][value="${CSS.escape(d.value)}"]`)) == null || y.focus({
        preventScroll: !0
      }), !h) {
        i(d.value);
        return;
      }
      const b = z(n), f = b.includes(d.value) ? b.filter((x) => x !== d.value) : [...b, d.value];
      i(M(t, f));
    };
    return document.addEventListener("keydown", c), () => document.removeEventListener("keydown", c);
  }, o = [_, p, s, t, n, i, h], e[0] = _, e[1] = p, e[2] = h, e[3] = s, e[4] = i, e[5] = t, e[6] = n, e[7] = u, e[8] = o) : (u = e[7], o = e[8]), q.useEffect(u, o);
};
function We(r) {
  return r.taskList !== null;
}
const R = (r) => {
  const e = L.c(21), {
    name: s,
    options: t,
    value: n,
    onChange: i,
    description: h,
    disabled: _,
    readOnly: p,
    multiple: u,
    multipleHint: o
  } = r, c = _ === void 0 ? !1 : _, l = p === void 0 ? !1 : p, a = u === void 0 ? !1 : u, d = !c && !l;
  let b;
  e[0] !== a || e[1] !== s || e[2] !== i || e[3] !== t || e[4] !== d || e[5] !== n ? (b = {
    name: s,
    options: t,
    value: n,
    onChange: i,
    multiple: a,
    enabled: d
  }, e[0] = a, e[1] = s, e[2] = i, e[3] = t, e[4] = d, e[5] = n, e[6] = b) : b = e[6], Ke(b);
  const f = !!h.isHorizontal, y = !!h.isWrapVariants, x = f ? "horizontal" : "vertical";
  let g;
  e[7] !== c || e[8] !== f || e[9] !== a || e[10] !== o || e[11] !== s || e[12] !== i || e[13] !== t || e[14] !== l || e[15] !== n || e[16] !== y ? (g = a ? /* @__PURE__ */ m.jsx(Be, { className: $(v.radioGroup, f && v.radioGroupHorizontal, y && v.radioGroupWrap), name: s, options: t, value: n, onChange: i, disabled: c, readOnly: l, ariaLabel: "test-options", hint: o }) : /* @__PURE__ */ m.jsx(ze, { className: $(v.radioGroup, f && v.radioGroupHorizontal, y && v.radioGroupWrap), name: s, options: t, value: n, onChange: i, disabled: c, readOnly: l, ariaLabel: "test-options" }), e[7] = c, e[8] = f, e[9] = a, e[10] = o, e[11] = s, e[12] = i, e[13] = t, e[14] = l, e[15] = n, e[16] = y, e[17] = g) : g = e[17];
  let k;
  return e[18] !== x || e[19] !== g ? (k = /* @__PURE__ */ m.jsx("div", { "data-testid": "test-options", "data-layout": x, children: g }), e[18] = x, e[19] = g, e[20] = k) : k = e[20], k;
}, G = (r, e) => r == null || r === "" ? "" : ee(r) ? e(r) : typeof r == "string" ? r : "", K = (r) => {
  const e = L.c(18), {
    description: s,
    deps: t
  } = r;
  let n;
  e[0] !== t ? (n = (d) => t.global.translateTasks(d), e[0] = t, e[1] = n) : n = e[1];
  const i = n;
  let h;
  e[2] !== s.question || e[3] !== i ? (h = G(s.question, i), e[2] = s.question, e[3] = i, e[4] = h) : h = e[4];
  const _ = h;
  let p;
  e[5] !== s.questionAfter || e[6] !== i ? (p = G(s.questionAfter, i), e[5] = s.questionAfter, e[6] = i, e[7] = p) : p = e[7];
  const u = p;
  let o;
  e[8] !== s.questionAlign ? (o = {}, s.questionAlign && (o.textAlign = s.questionAlign), e[8] = s.questionAlign, e[9] = o) : o = e[9];
  let c;
  e[10] !== _ || e[11] !== o ? (c = _ ? /* @__PURE__ */ m.jsx("div", { className: v.question, "data-testid": "test-question", style: Object.keys(o).length > 0 ? o : void 0, children: /* @__PURE__ */ m.jsx(S, { children: _ }) }) : null, e[10] = _, e[11] = o, e[12] = c) : c = e[12];
  let l;
  e[13] !== u ? (l = u ? /* @__PURE__ */ m.jsx("div", { className: v.questionAfter, children: /* @__PURE__ */ m.jsx(S, { children: u }) }) : null, e[13] = u, e[14] = l) : l = e[14];
  let a;
  return e[15] !== c || e[16] !== l ? (a = /* @__PURE__ */ m.jsxs(m.Fragment, { children: [
    c,
    l
  ] }), e[15] = c, e[16] = l, e[17] = a) : a = e[17], a;
}, De = (r) => {
  const e = L.c(36), {
    task: s,
    deps: t,
    answer: n,
    solution: i
  } = r;
  let h;
  e[0] !== t ? (h = (j) => t.global.translateTasks(j), e[0] = t, e[1] = h) : h = e[1];
  const _ = h;
  let p, u, o, c;
  e[2] !== n || e[3] !== i || e[4] !== s.description || e[5] !== _ ? (u = H(s.description.variants, _), p = te(s.description, i, _), c = I(u, n), o = I(u, p), e[2] = n, e[3] = i, e[4] = s.description, e[5] = _, e[6] = p, e[7] = u, e[8] = o, e[9] = c) : (p = e[6], u = e[7], o = e[8], c = e[9]);
  const l = o;
  let a;
  e[10] !== t || e[11] !== s.title ? (a = /* @__PURE__ */ m.jsx(w, { title: s.title, deps: t }), e[10] = t, e[11] = s.title, e[12] = a) : a = e[12];
  let d, b;
  e[13] !== t || e[14] !== s.description ? (d = /* @__PURE__ */ m.jsx(K, { description: s.description, deps: t }), b = /* @__PURE__ */ m.jsx(B, { description: s.description, deps: t }), e[13] = t, e[14] = s.description, e[15] = d, e[16] = b) : (d = e[15], b = e[16]);
  let f;
  e[17] !== l || e[18] !== t || e[19] !== c ? (f = /* @__PURE__ */ m.jsx(le, { userAnswer: c, correctAnswer: l, deps: t }), e[17] = l, e[18] = t, e[19] = c, e[20] = f) : f = e[20];
  const y = `${s.id}-solution`;
  let x;
  e[21] !== p || e[22] !== u || e[23] !== y || e[24] !== s.description ? (x = /* @__PURE__ */ m.jsx(R, { name: y, options: u, value: p, onChange: Ue, description: s.description, readOnly: !0 }), e[21] = p, e[22] = u, e[23] = y, e[24] = s.description, e[25] = x) : x = e[25];
  let g;
  e[26] !== t || e[27] !== i ? (g = /* @__PURE__ */ m.jsx(ae, { solution: i, deps: t }), e[26] = t, e[27] = i, e[28] = g) : g = e[28];
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
function Ue() {
}
const Qe = (r) => {
  var e, s;
  return (s = (e = r.localize) == null ? void 0 : e.pickEveryFittingOption) != null ? s : ne(r.global, ie.pickEveryFittingOption);
}, Xe = ({
  id: r
}) => {
  const e = (s) => {
    const t = L.c(31), {
      task: n,
      deps: i,
      answer: h,
      onChange: _
    } = s;
    if (se(n.solution)) {
      let j;
      return t[0] !== h || t[1] !== i || t[2] !== n ? (j = /* @__PURE__ */ m.jsx(De, { task: n, deps: i, answer: h, solution: n.solution }), t[0] = h, t[1] = i, t[2] = n, t[3] = j) : j = t[3], j;
    }
    let p;
    t[4] !== i ? (p = (j) => i.global.translateTasks(j), t[4] = i, t[5] = p) : p = t[5];
    const u = p;
    let o;
    t[6] !== n.description.variants || t[7] !== u ? (o = H(n.description.variants, u), t[6] = n.description.variants, t[7] = u, t[8] = o) : o = t[8];
    const c = o;
    let l;
    t[9] !== i || t[10] !== n.title ? (l = /* @__PURE__ */ m.jsx(w, { title: n.title, deps: i }), t[9] = i, t[10] = n.title, t[11] = l) : l = t[11];
    let a, d;
    t[12] !== i || t[13] !== n.description ? (a = /* @__PURE__ */ m.jsx(K, { description: n.description, deps: i }), d = /* @__PURE__ */ m.jsx(B, { description: n.description, deps: i }), t[12] = i, t[13] = n.description, t[14] = a, t[15] = d) : (a = t[14], d = t[15]);
    const b = String(n.id), f = n.description, y = !!n.hasMultipleAnswers;
    let x;
    t[16] !== i ? (x = Qe(i), t[16] = i, t[17] = x) : x = t[17];
    let g;
    t[18] !== h || t[19] !== _ || t[20] !== c || t[21] !== b || t[22] !== y || t[23] !== x || t[24] !== n.description ? (g = /* @__PURE__ */ m.jsx(R, { name: b, options: c, value: h, onChange: _, description: f, multiple: y, multipleHint: x }), t[18] = h, t[19] = _, t[20] = c, t[21] = b, t[22] = y, t[23] = x, t[24] = n.description, t[25] = g) : g = t[25];
    let k;
    return t[26] !== g || t[27] !== l || t[28] !== a || t[29] !== d ? (k = /* @__PURE__ */ m.jsxs("div", { className: v.container, "data-template-id": r, children: [
      l,
      a,
      d,
      g
    ] }), t[26] = g, t[27] = l, t[28] = a, t[29] = d, t[30] = k) : k = t[30], k;
  };
  return e.displayName = r, e;
}, Ye = Xe({
  id: "test.plain"
});
export {
  Ye as TestPlain,
  Ye as default
};
