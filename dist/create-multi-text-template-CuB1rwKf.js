import { c as O, l as U, m as X, j as a, a as q, b as Y, d as P, M as Z, e as tt, n as et, f as st, k as at } from "./index-y5-JRyys.js";
import { g as J } from "./get-inline-input-entries-CGVm7T7Q.js";
import { S as lt, a as nt } from "./solution-answer-panel-DWkZlDnj.js";
import { s as r, T as K, m as F } from "./text-template.module-CV9vwmrA.js";
const it = 0.583, rt = 32, ot = 72, ct = 560, ut = (d, t) => {
  var w;
  let o = "";
  for (const i of Object.values((w = d.fields) != null ? w : {})) {
    if (!(typeof i == "number" || typeof i == "string" && /^\d+$/.test(i))) continue;
    const S = String(i);
    S.length > o.length && (o = S);
  }
  if (!o) return null;
  const s = o.length * t * it + rt;
  return Math.min(ct, Math.max(ot, Math.round(s)));
}, ft = (d) => {
  const t = O.c(47), {
    task: o,
    deps: s,
    answer: w,
    solution: i,
    layout: N,
    normalizeBareMath: S
  } = d, e = S === void 0 ? !1 : S, l = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let n;
  t[0] !== s.global ? (n = (b) => s.global.translateTasks(b), t[0] = s.global, t[1] = n) : n = t[1];
  const m = n;
  let k, T, p, x, h, j, c, u;
  if (t[2] !== w || t[3] !== s || t[4] !== N || t[5] !== l || t[6] !== e || t[7] !== i || t[8] !== o || t[9] !== m) {
    const b = U(i, l, m), B = X(w, l), A = J(o, m);
    j = r.container, t[18] !== s || t[19] !== o.title ? (c = /* @__PURE__ */ a.jsx(q, { title: o.title, deps: s }), t[18] = s, t[19] = o.title, t[20] = c) : c = t[20];
    const C = o;
    t[21] !== s || t[22] !== e || t[23] !== C ? (u = /* @__PURE__ */ a.jsx(K, { task: C, deps: s, normalizeBareMath: e }), t[21] = s, t[22] = e, t[23] = C, t[24] = u) : u = t[24];
    const y = B.join(" ; "), E = Y(b);
    t[25] !== s || t[26] !== y || t[27] !== E ? (k = /* @__PURE__ */ a.jsx(lt, { userAnswer: y, correctAnswer: E, deps: s }), t[25] = s, t[26] = y, t[27] = E, t[28] = k) : k = t[28], T = "text-inputs", p = N, x = N === "inline" ? r.inline : r.stack;
    let v;
    t[29] !== b || t[30] !== e ? (v = (z, R) => {
      var $;
      const {
        key: L,
        before: H,
        after: I
      } = z;
      return /* @__PURE__ */ a.jsxs("div", { className: `${r.inputRow} ${r.solutionRow}`, children: [
        H && /* @__PURE__ */ a.jsx(P, { "data-testid": "text-prefix", className: r.fieldLabel, value: F(H, e) }),
        /* @__PURE__ */ a.jsx(Z, { className: r.answerFormula, children: ($ = b[R]) != null ? $ : "" }),
        I && /* @__PURE__ */ a.jsx(P, { "data-testid": "text-suffix", className: r.suffix, value: F(I, e) })
      ] }, L);
    }, t[29] = b, t[30] = e, t[31] = v) : v = t[31], h = A.map(v), t[2] = w, t[3] = s, t[4] = N, t[5] = l, t[6] = e, t[7] = i, t[8] = o, t[9] = m, t[10] = k, t[11] = T, t[12] = p, t[13] = x, t[14] = h, t[15] = j, t[16] = c, t[17] = u;
  } else
    k = t[10], T = t[11], p = t[12], x = t[13], h = t[14], j = t[15], c = t[16], u = t[17];
  let M;
  t[32] !== T || t[33] !== p || t[34] !== x || t[35] !== h ? (M = /* @__PURE__ */ a.jsx("div", { "data-testid": T, "data-layout": p, className: x, children: h }), t[32] = T, t[33] = p, t[34] = x, t[35] = h, t[36] = M) : M = t[36];
  let f;
  t[37] !== s || t[38] !== i ? (f = /* @__PURE__ */ a.jsx(nt, { solution: i, deps: s }), t[37] = s, t[38] = i, t[39] = f) : f = t[39];
  let g;
  return t[40] !== k || t[41] !== M || t[42] !== f || t[43] !== j || t[44] !== c || t[45] !== u ? (g = /* @__PURE__ */ a.jsxs("div", { className: j, children: [
    c,
    u,
    k,
    M,
    f
  ] }), t[40] = k, t[41] = M, t[42] = f, t[43] = j, t[44] = c, t[45] = u, t[46] = g) : g = t[46], g;
}, dt = (d) => new RegExp("\\p{L}{2,}", "u").test(d) && !/[\d=+×·*<>\\]/.test(d), gt = ({
  id: d,
  layout: t,
  withBefore: o = !1,
  withAfter: s = !1,
  widthFromTask: w = !0,
  normalizeBareMath: i = !1
}) => {
  const N = (S) => {
    const e = O.c(42), {
      task: l,
      deps: n,
      answer: m,
      onChange: k,
      mathInput: T
    } = S;
    if (tt(l.solution)) {
      let A;
      return e[0] !== m || e[1] !== n || e[2] !== l ? (A = /* @__PURE__ */ a.jsx(ft, { task: l, deps: n, answer: m, solution: l.solution, layout: t, normalizeBareMath: i }), e[0] = m, e[1] = n, e[2] = l, e[3] = A) : A = e[3], A;
    }
    const p = n.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let x, h, j, c, u, M, f, g;
    if (e[4] !== m || e[5] !== n || e[6] !== T || e[7] !== k || e[8] !== p || e[9] !== l) {
      const {
        bindRef: A,
        handleChange: C
      } = et({
        onChange: k,
        separator: p,
        mathInput: T
      });
      let y;
      e[18] !== m || e[19] !== p ? (y = X(m, p), e[18] = m, e[19] = p, e[20] = y) : y = e[20];
      const E = y;
      let v;
      e[21] !== n.global ? (v = (V) => n.global.translateTasks(V), e[21] = n.global, e[22] = v) : v = e[22];
      const z = J(l, v);
      let R;
      e[23] !== l ? (R = w ? ut(l, 24) : null, e[23] = l, e[24] = R) : R = e[24];
      const L = R, H = z.map(mt).filter(Boolean), I = t !== "inline" && o && H.length > 0 && H.every(pt);
      u = r.container, M = d, e[25] !== n || e[26] !== l.title ? (f = /* @__PURE__ */ a.jsx(q, { title: l.title, deps: n }), e[25] = n, e[26] = l.title, e[27] = f) : f = e[27];
      const $ = l;
      e[28] !== n || e[29] !== $ ? (g = /* @__PURE__ */ a.jsx(K, { task: $, deps: n, normalizeBareMath: i }), e[28] = n, e[29] = $, e[30] = g) : g = e[30], x = "text-inputs", h = t, j = t === "inline" ? r.inline : st(r.stack, I && r.stackGrid), c = z.map((V, Q) => {
        var G;
        const {
          key: W,
          before: _,
          after: D
        } = V;
        return /* @__PURE__ */ a.jsxs("div", { className: r.inputRow, children: [
          o && _ ? /* @__PURE__ */ a.jsx(P, { "data-testid": "text-prefix", className: r.fieldLabel, value: F(_, i) }) : I && /* @__PURE__ */ a.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ a.jsx(at, { id: W, ref: A(W), formula: (G = E[Q]) != null ? G : "", onMathFieldChanged: C, className: r.input, style: L ? {
            flex: "none",
            minWidth: `min(${L}px, 100%)`
          } : void 0 }),
          s && D ? /* @__PURE__ */ a.jsx(P, { "data-testid": "text-suffix", className: r.suffix, value: F(D, i) }) : I && /* @__PURE__ */ a.jsx("span", { "aria-hidden": !0 })
        ] }, W);
      }), e[4] = m, e[5] = n, e[6] = T, e[7] = k, e[8] = p, e[9] = l, e[10] = x, e[11] = h, e[12] = j, e[13] = c, e[14] = u, e[15] = M, e[16] = f, e[17] = g;
    } else
      x = e[10], h = e[11], j = e[12], c = e[13], u = e[14], M = e[15], f = e[16], g = e[17];
    let b;
    e[31] !== x || e[32] !== h || e[33] !== j || e[34] !== c ? (b = /* @__PURE__ */ a.jsx("div", { "data-testid": x, "data-layout": h, className: j, children: c }), e[31] = x, e[32] = h, e[33] = j, e[34] = c, e[35] = b) : b = e[35];
    let B;
    return e[36] !== u || e[37] !== M || e[38] !== f || e[39] !== g || e[40] !== b ? (B = /* @__PURE__ */ a.jsxs("div", { className: u, "data-template-id": M, children: [
      f,
      g,
      b
    ] }), e[36] = u, e[37] = M, e[38] = f, e[39] = g, e[40] = b, e[41] = B) : B = e[41], B;
  };
  return N.displayName = d, N;
};
function mt(d) {
  const {
    before: t
  } = d;
  return t;
}
function pt(d) {
  return dt(String(d));
}
export {
  gt as c
};
