import { c as b, t as S, p as y, q as d, j as c, C as g, f as C, S as h, o as k } from "./index-wRluoD-s.js";
const T = "_title_mswcm_1", N = "_container_mswcm_5", A = "_formula_mswcm_17", B = "_textBlock_mswcm_23", w = "_textAfterComplex_mswcm_27", x = {
  title: T,
  container: N,
  formula: A,
  textBlock: B,
  textAfterComplex: w
}, j = (n) => /* @__PURE__ */ c.jsx(h, { content: n, formulaClassName: x.formula }), v = (n) => {
  const t = b.c(27), {
    solution: e,
    deps: l
  } = n;
  let p;
  t[0] !== l.global ? (p = S(l.global)("explanation"), t[0] = l.global, t[1] = p) : p = t[1];
  const o = p;
  if (typeof e == "object" && e !== null && e.error) {
    let s;
    t[2] !== l.global || t[3] !== e.error ? (s = typeof e.error == "string" ? e.error : l.global.translateTasks(e.error), t[2] = l.global, t[3] = e.error, t[4] = s) : s = t[4];
    const r = s;
    let i;
    return t[5] !== r ? (i = /* @__PURE__ */ c.jsx("div", { className: x.container, children: /* @__PURE__ */ c.jsx(k, { inline: !0, children: r }) }), t[5] = r, t[6] = i) : i = t[6], i;
  }
  if (y(e)) {
    let s;
    t[7] !== o ? (s = /* @__PURE__ */ c.jsx("p", { className: x.title, children: o }), t[7] = o, t[8] = s) : s = t[8];
    let r;
    t[9] !== e ? (r = j(e), t[9] = e, t[10] = r) : r = t[10];
    let i;
    return t[11] !== s || t[12] !== r ? (i = /* @__PURE__ */ c.jsxs("div", { className: x.container, children: [
      s,
      r
    ] }), t[11] = s, t[12] = r, t[13] = i) : i = t[13], i;
  }
  if (typeof e != "object" || e === null)
    return null;
  let f;
  t[14] !== l.global || t[15] !== e ? (f = !d(e) && e.content && (typeof e.content == "string" ? e.content : l.global.translateTasks(e.content)), t[14] = l.global, t[15] = e, t[16] = f) : f = t[16];
  const a = f;
  let m, u;
  if (t[17] !== l || t[18] !== a || t[19] !== e || t[20] !== o) {
    u = Symbol.for("react.early_return_sentinel");
    t: {
      const s = d(e);
      let r;
      t[23] !== a ? (r = typeof a == "string" && a.trim(), t[23] = a, t[24] = r) : r = t[24];
      const i = !!r;
      if (!s && !i) {
        u = null;
        break t;
      }
      let _;
      t[25] !== o ? (_ = /* @__PURE__ */ c.jsx("p", { className: x.title, children: o }), t[25] = o, t[26] = _) : _ = t[26], m = /* @__PURE__ */ c.jsxs("div", { className: x.container, children: [
        _,
        s && /* @__PURE__ */ c.jsx(g, { parts: e.parts, deps: l }),
        i && /* @__PURE__ */ c.jsx("div", { className: C(x.textBlock, s && x.textAfterComplex), children: j(a) })
      ] });
    }
    t[17] = l, t[18] = a, t[19] = e, t[20] = o, t[21] = m, t[22] = u;
  } else
    m = t[21], u = t[22];
  return u !== Symbol.for("react.early_return_sentinel") ? u : m;
}, E = (n) => n && typeof n == "object" && "parts" in n && Array.isArray(n.parts) && n.parts.length > 0 ? n.parts : null, F = (n) => {
  const t = b.c(8), {
    solution: e,
    deps: l,
    suppressFreeTextContent: p
  } = n;
  if (p)
    return null;
  let o;
  t[0] !== e ? (o = E(e), t[0] = e, t[1] = o) : o = t[1];
  const f = o;
  if (f) {
    let m;
    return t[2] !== l || t[3] !== f ? (m = /* @__PURE__ */ c.jsx(g, { parts: f, deps: l }), t[2] = l, t[3] = f, t[4] = m) : m = t[4], m;
  }
  let a;
  return t[5] !== l || t[6] !== e ? (a = /* @__PURE__ */ c.jsx(v, { solution: e, deps: l }), t[5] = l, t[6] = e, t[7] = a) : a = t[7], a;
};
export {
  F as S
};
