var E = Object.defineProperty;
var j = Object.getOwnPropertySymbols;
var L = Object.prototype.hasOwnProperty, k = Object.prototype.propertyIsEnumerable;
var y = (n, e, t) => e in n ? E(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t, N = (n, e) => {
  for (var t in e || (e = {}))
    L.call(e, t) && y(n, t, e[t]);
  if (j)
    for (var t of j(e))
      k.call(e, t) && y(n, t, e[t]);
  return n;
};
import { r as b, c as v, t as M, j as m, v as S, f as R, w as B, M as F, d as T, o as $ } from "./index-wRluoD-s.js";
const O = (n) => /* @__PURE__ */ b.createElement("svg", N({ width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, n), /* @__PURE__ */ b.createElement("path", { d: "M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", stroke: "#0066FE", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" })), W = "_container_1pfp7_2", q = "_highlight_1pfp7_2", D = "_highlightCenter_1pfp7_25", H = "_label_1pfp7_29", U = "_answer_1pfp7_34", P = "_userAnswer_1pfp7_48", X = "_ellipsis_1pfp7_59", Z = "_unit_1pfp7_63", G = "_delimeter_1pfp7_70", I = "_icon_1pfp7_75", g = {
  container: W,
  highlight: q,
  highlightCenter: D,
  label: H,
  answer: U,
  userAnswer: P,
  ellipsis: X,
  unit: Z,
  delimeter: G,
  icon: I
}, J = (n, e) => {
  const t = v.c(4), a = b.useRef(null);
  let o, l;
  return t[0] !== n || t[1] !== e ? (o = () => {
    var h;
    const s = a.current;
    if (!s)
      return;
    const d = () => {
      s.removeAttribute(n), e(s) && s.setAttribute(n, "");
    };
    d(), (h = document.fonts) == null || h.ready.then(d);
    let f = s.getBoundingClientRect().width;
    const r = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(() => {
      const u = s.getBoundingClientRect().width;
      Math.abs(u - f) < 1 || (f = u, d());
    });
    r == null || r.observe(s);
    let c = 0;
    const i = new MutationObserver(() => {
      cancelAnimationFrame(c), c = requestAnimationFrame(d);
    });
    return i.observe(s, {
      childList: !0,
      subtree: !0
    }), () => {
      r == null || r.disconnect(), i.disconnect(), cancelAnimationFrame(c), s.removeAttribute(n);
    };
  }, l = [n, e], t[0] = n, t[1] = e, t[2] = o, t[3] = l) : (o = t[2], l = t[3]), b.useLayoutEffect(o, l), a;
}, K = (n) => {
  var o;
  const e = [];
  for (const l of Array.from(n.childNodes)) {
    if (l instanceof Element) {
      e.push(...Array.from(l.getClientRects()));
      continue;
    }
    if (l.nodeType !== Node.TEXT_NODE || !((o = l.textContent) != null && o.trim())) continue;
    const s = document.createRange();
    s.selectNodeContents(l), typeof s.getClientRects == "function" && e.push(...Array.from(s.getClientRects()));
  }
  const t = e.filter((l) => l.width > 0 && l.height > 0), a = t[0];
  return !!a && t.some((l) => l.top >= a.bottom - 1);
}, Q = (n) => {
  const e = v.c(19), {
    text: t,
    label: a,
    unit: o,
    alignCenter: l
  } = n, {
    rowRef: s,
    displayText: d,
    truncated: f,
    onTypesetDone: r
  } = S(g.userAnswer, t), c = l && g.highlightCenter;
  let i;
  e[0] !== c ? (i = R(g.highlight, c), e[0] = c, e[1] = i) : i = e[1];
  let h;
  e[2] === Symbol.for("react.memo_cache_sentinel") ? (h = /* @__PURE__ */ m.jsx(B, { className: g.icon }), e[2] = h) : h = e[2];
  let u;
  e[3] !== a ? (u = /* @__PURE__ */ m.jsx("span", { className: g.label, children: a }), e[3] = a, e[4] = u) : u = e[4];
  let w;
  e[5] !== d || e[6] !== r ? (w = /* @__PURE__ */ m.jsx(F, { className: g.userAnswer, onTypeset: r, children: d }), e[5] = d, e[6] = r, e[7] = w) : w = e[7];
  let _;
  e[8] !== f ? (_ = f && /* @__PURE__ */ m.jsx("span", { className: g.ellipsis, "aria-hidden": "true", children: "…" }), e[8] = f, e[9] = _) : _ = e[9];
  let p;
  e[10] !== o ? (p = o ? /* @__PURE__ */ m.jsx(T, { "data-testid": "answer-unit", className: g.unit, value: o }) : null, e[10] = o, e[11] = p) : p = e[11];
  let x;
  return e[12] !== s || e[13] !== i || e[14] !== u || e[15] !== w || e[16] !== _ || e[17] !== p ? (x = /* @__PURE__ */ m.jsxs("div", { ref: s, "data-testid": "user-answer-highlight", className: i, children: [
    h,
    u,
    w,
    _,
    p
  ] }), e[12] = s, e[13] = i, e[14] = u, e[15] = w, e[16] = _, e[17] = p, e[18] = x) : x = e[18], x;
}, V = (n) => {
  const e = n.querySelector(`.${g.answer}`);
  return e ? K(e) : !1;
}, Y = (n) => {
  const e = v.c(15), {
    text: t,
    label: a,
    unit: o,
    alignCenter: l
  } = n, s = J("data-wrapped", V), d = l && g.highlightCenter;
  let f;
  e[0] !== d ? (f = R(g.highlight, d), e[0] = d, e[1] = f) : f = e[1];
  let r;
  e[2] === Symbol.for("react.memo_cache_sentinel") ? (r = /* @__PURE__ */ m.jsx(O, { className: g.icon }), e[2] = r) : r = e[2];
  let c;
  e[3] !== a ? (c = /* @__PURE__ */ m.jsx("span", { className: g.label, children: a }), e[3] = a, e[4] = c) : c = e[4];
  let i;
  e[5] !== t ? (i = /* @__PURE__ */ m.jsx($, { inline: !0, className: g.answer, children: t }), e[5] = t, e[6] = i) : i = e[6];
  let h;
  e[7] !== o ? (h = o ? /* @__PURE__ */ m.jsx(T, { "data-testid": "answer-unit", className: g.unit, value: o }) : null, e[7] = o, e[8] = h) : h = e[8];
  let u;
  return e[9] !== s || e[10] !== f || e[11] !== c || e[12] !== i || e[13] !== h ? (u = /* @__PURE__ */ m.jsxs("div", { ref: s, className: f, children: [
    r,
    c,
    i,
    h
  ] }), e[9] = s, e[10] = f, e[11] = c, e[12] = i, e[13] = h, e[14] = u) : u = e[14], u;
}, te = (n) => {
  const e = v.c(27), {
    userAnswer: t,
    correctAnswer: a,
    correctLabel: o,
    unit: l,
    deps: s,
    alignCenter: d
  } = n;
  let f;
  e[0] !== t ? (f = t == null ? void 0 : t.trim(), e[0] = t, e[1] = f) : f = e[1];
  const r = !!f;
  let c;
  e[2] !== a ? (c = a == null ? void 0 : a.trim(), e[2] = a, e[3] = c) : c = e[3];
  const i = !!c;
  if (!r && !i)
    return null;
  let h;
  e[4] !== a || e[5] !== o || e[6] !== s.global ? (h = o != null ? o : s.global.translateTasks(a), e[4] = a, e[5] = o, e[6] = s.global, e[7] = h) : h = e[7];
  const u = h;
  let w, _, p, x;
  if (e[8] !== d || e[9] !== s.global || e[10] !== u || e[11] !== i || e[12] !== r || e[13] !== l || e[14] !== t) {
    const A = M(s.global);
    w = g.container, _ = r && /* @__PURE__ */ m.jsx(Q, { text: t, label: A("yourAnswer"), unit: l, alignCenter: d }), e[19] !== i || e[20] !== r ? (p = r && i && /* @__PURE__ */ m.jsx("hr", { className: g.delimeter }), e[19] = i, e[20] = r, e[21] = p) : p = e[21], x = i && /* @__PURE__ */ m.jsx(Y, { text: u, label: A("correctAnswer"), unit: l, alignCenter: d }), e[8] = d, e[9] = s.global, e[10] = u, e[11] = i, e[12] = r, e[13] = l, e[14] = t, e[15] = w, e[16] = _, e[17] = p, e[18] = x;
  } else
    w = e[15], _ = e[16], p = e[17], x = e[18];
  let C;
  return e[22] !== w || e[23] !== _ || e[24] !== p || e[25] !== x ? (C = /* @__PURE__ */ m.jsxs("div", { className: w, children: [
    _,
    p,
    x
  ] }), e[22] = w, e[23] = _, e[24] = p, e[25] = x, e[26] = C) : C = e[26], C;
};
export {
  te as S,
  J as u
};
