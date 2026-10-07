import { c as G, l as Q, m as O, j as a, a as X, b as U, d as F, M as Y, e as Z, n as tt, f as et, k as st } from "./index-DwDfo0zf.js";
import { g as q } from "./get-inline-input-entries-CGVm7T7Q.js";
import { h as at } from "./label-column-C240-oSs.js";
import { S as lt, a as nt } from "./solution-answer-panel-DNRF1AHT.js";
import { s as r, T as J, m as L } from "./text-template.module-BQ2pVRIv.js";
const it = 0.583, rt = 32, ot = 72, ct = 560, ut = (w, t) => {
  var v;
  let o = "";
  for (const i of Object.values((v = w.fields) != null ? v : {})) {
    if (!(typeof i == "number" || typeof i == "string" && /^\d+$/.test(i))) continue;
    const S = String(i);
    S.length > o.length && (o = S);
  }
  if (!o) return null;
  const s = o.length * t * it + rt;
  return Math.min(ct, Math.max(ot, Math.round(s)));
}, ft = (w) => {
  const t = G.c(47), {
    task: o,
    deps: s,
    answer: v,
    solution: i,
    layout: N,
    normalizeBareMath: S
  } = w, e = S === void 0 ? !1 : S, l = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let n;
  t[0] !== s.global ? (n = (b) => s.global.translateTasks(b), t[0] = s.global, t[1] = n) : n = t[1];
  const d = n;
  let g, k, m, p, x, h, c, u;
  if (t[2] !== v || t[3] !== s || t[4] !== N || t[5] !== l || t[6] !== e || t[7] !== i || t[8] !== o || t[9] !== d) {
    const b = Q(i, l, d), R = O(v, l), A = q(o, d);
    h = r.container, t[18] !== s || t[19] !== o.title ? (c = /* @__PURE__ */ a.jsx(X, { title: o.title, deps: s }), t[18] = s, t[19] = o.title, t[20] = c) : c = t[20];
    const E = o;
    t[21] !== s || t[22] !== e || t[23] !== E ? (u = /* @__PURE__ */ a.jsx(J, { task: E, deps: s, normalizeBareMath: e }), t[21] = s, t[22] = e, t[23] = E, t[24] = u) : u = t[24];
    const y = R.join(" ; "), H = U(b);
    t[25] !== s || t[26] !== y || t[27] !== H ? (g = /* @__PURE__ */ a.jsx(lt, { userAnswer: y, correctAnswer: H, deps: s }), t[25] = s, t[26] = y, t[27] = H, t[28] = g) : g = t[28], k = "text-inputs", m = N, p = N === "inline" ? r.inline : r.stack;
    let T;
    t[29] !== b || t[30] !== e ? (T = (z, B) => {
      var $;
      const {
        key: P,
        before: C,
        after: I
      } = z;
      return /* @__PURE__ */ a.jsxs("div", { className: `${r.inputRow} ${r.solutionRow}`, children: [
        C && /* @__PURE__ */ a.jsx(F, { "data-testid": "text-prefix", className: r.fieldLabel, value: L(C, e) }),
        /* @__PURE__ */ a.jsx(Y, { className: r.answerFormula, children: ($ = b[B]) != null ? $ : "" }),
        I && /* @__PURE__ */ a.jsx(F, { "data-testid": "text-suffix", className: r.suffix, value: L(I, e) })
      ] }, P);
    }, t[29] = b, t[30] = e, t[31] = T) : T = t[31], x = A.map(T), t[2] = v, t[3] = s, t[4] = N, t[5] = l, t[6] = e, t[7] = i, t[8] = o, t[9] = d, t[10] = g, t[11] = k, t[12] = m, t[13] = p, t[14] = x, t[15] = h, t[16] = c, t[17] = u;
  } else
    g = t[10], k = t[11], m = t[12], p = t[13], x = t[14], h = t[15], c = t[16], u = t[17];
  let j;
  t[32] !== k || t[33] !== m || t[34] !== p || t[35] !== x ? (j = /* @__PURE__ */ a.jsx("div", { "data-testid": k, "data-layout": m, className: p, children: x }), t[32] = k, t[33] = m, t[34] = p, t[35] = x, t[36] = j) : j = t[36];
  let f;
  t[37] !== s || t[38] !== i ? (f = /* @__PURE__ */ a.jsx(nt, { solution: i, deps: s }), t[37] = s, t[38] = i, t[39] = f) : f = t[39];
  let M;
  return t[40] !== g || t[41] !== j || t[42] !== f || t[43] !== h || t[44] !== c || t[45] !== u ? (M = /* @__PURE__ */ a.jsxs("div", { className: h, children: [
    c,
    u,
    g,
    j,
    f
  ] }), t[40] = g, t[41] = j, t[42] = f, t[43] = h, t[44] = c, t[45] = u, t[46] = M) : M = t[46], M;
}, Mt = ({
  id: w,
  layout: t,
  withBefore: o = !1,
  withAfter: s = !1,
  widthFromTask: v = !0,
  normalizeBareMath: i = !1
}) => {
  const N = (S) => {
    const e = G.c(42), {
      task: l,
      deps: n,
      answer: d,
      onChange: g,
      mathInput: k
    } = S;
    if (Z(l.solution)) {
      let A;
      return e[0] !== d || e[1] !== n || e[2] !== l ? (A = /* @__PURE__ */ a.jsx(ft, { task: l, deps: n, answer: d, solution: l.solution, layout: t, normalizeBareMath: i }), e[0] = d, e[1] = n, e[2] = l, e[3] = A) : A = e[3], A;
    }
    const m = n.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let p, x, h, c, u, j, f, M;
    if (e[4] !== d || e[5] !== n || e[6] !== k || e[7] !== g || e[8] !== m || e[9] !== l) {
      const {
        bindRef: A,
        handleChange: E
      } = tt({
        onChange: g,
        separator: m,
        mathInput: k
      });
      let y;
      e[18] !== d || e[19] !== m ? (y = O(d, m), e[18] = d, e[19] = m, e[20] = y) : y = e[20];
      const H = y;
      let T;
      e[21] !== n.global ? (T = ($) => n.global.translateTasks($), e[21] = n.global, e[22] = T) : T = e[22];
      const z = q(l, T);
      let B;
      e[23] !== l ? (B = v ? ut(l, 24) : null, e[23] = l, e[24] = B) : B = e[24];
      const P = B, C = at(t, o, z.map(dt));
      u = r.container, j = w, e[25] !== n || e[26] !== l.title ? (f = /* @__PURE__ */ a.jsx(X, { title: l.title, deps: n }), e[25] = n, e[26] = l.title, e[27] = f) : f = e[27];
      const I = l;
      e[28] !== n || e[29] !== I ? (M = /* @__PURE__ */ a.jsx(J, { task: I, deps: n, normalizeBareMath: i }), e[28] = n, e[29] = I, e[30] = M) : M = e[30], p = "text-inputs", x = t, h = t === "inline" ? r.inline : et(r.stack, C && r.stackGrid), c = z.map(($, K) => {
        var _;
        const {
          key: V,
          before: D,
          after: W
        } = $;
        return /* @__PURE__ */ a.jsxs("div", { className: r.inputRow, children: [
          o && D ? /* @__PURE__ */ a.jsx(F, { "data-testid": "text-prefix", className: r.fieldLabel, value: L(D, i) }) : C && /* @__PURE__ */ a.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ a.jsx(st, { id: V, ref: A(V), formula: (_ = H[K]) != null ? _ : "", onMathFieldChanged: E, className: r.input, style: P ? {
            flex: "none",
            minWidth: `min(${P}px, 100%)`
          } : void 0 }),
          s && W ? /* @__PURE__ */ a.jsx(F, { "data-testid": "text-suffix", className: r.suffix, value: L(W, i) }) : C && /* @__PURE__ */ a.jsx("span", { "aria-hidden": !0 })
        ] }, V);
      }), e[4] = d, e[5] = n, e[6] = k, e[7] = g, e[8] = m, e[9] = l, e[10] = p, e[11] = x, e[12] = h, e[13] = c, e[14] = u, e[15] = j, e[16] = f, e[17] = M;
    } else
      p = e[10], x = e[11], h = e[12], c = e[13], u = e[14], j = e[15], f = e[16], M = e[17];
    let b;
    e[31] !== p || e[32] !== x || e[33] !== h || e[34] !== c ? (b = /* @__PURE__ */ a.jsx("div", { "data-testid": p, "data-layout": x, className: h, children: c }), e[31] = p, e[32] = x, e[33] = h, e[34] = c, e[35] = b) : b = e[35];
    let R;
    return e[36] !== u || e[37] !== j || e[38] !== f || e[39] !== M || e[40] !== b ? (R = /* @__PURE__ */ a.jsxs("div", { className: u, "data-template-id": j, children: [
      f,
      M,
      b
    ] }), e[36] = u, e[37] = j, e[38] = f, e[39] = M, e[40] = b, e[41] = R) : R = e[41], R;
  };
  return N.displayName = w, N;
};
function dt(w) {
  const {
    before: t
  } = w;
  return t;
}
export {
  Mt as c
};
