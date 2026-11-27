import { c as O, y as U, z as X, j as a, a as q, b as Y, d as F, M as Z, e as tt, A as et, f as st, k as at, B as lt } from "./index-wRluoD-s.js";
import { g as J } from "./get-inline-input-entries-s5EOxUfG.js";
import { h as nt } from "./label-column-C240-oSs.js";
import { S as it } from "./shared-solution-body-9WuuvhSD.js";
import { S as rt } from "./solution-answer-panel-BnG30GAS.js";
import { T as K, m as L } from "./text-task-description-C7l32smS.js";
import { s as r } from "./text-template.module-C6vBLKI6.js";
const ot = 0.583, ct = 32, ut = 72, ft = 560, mt = (k, t) => {
  var v;
  let o = "";
  for (const i of Object.values((v = k.fields) != null ? v : {})) {
    if (!(typeof i == "number" || typeof i == "string" && /^\d+$/.test(i))) continue;
    const S = String(i);
    S.length > o.length && (o = S);
  }
  if (!o) return null;
  const s = o.length * t * ot + ct;
  return Math.min(ft, Math.max(ut, Math.round(s)));
}, dt = (k) => {
  const t = O.c(47), {
    task: o,
    deps: s,
    answer: v,
    solution: i,
    layout: A,
    normalizeBareMath: S
  } = k, e = S === void 0 ? !1 : S, l = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let n;
  t[0] !== s.global ? (n = (g) => s.global.translateTasks(g), t[0] = s.global, t[1] = n) : n = t[1];
  const m = n;
  let b, w, d, p, x, h, c, u;
  if (t[2] !== v || t[3] !== s || t[4] !== A || t[5] !== l || t[6] !== e || t[7] !== i || t[8] !== o || t[9] !== m) {
    const g = U(i, l, m), B = X(v, l), N = J(o, m);
    h = r.container, t[18] !== s || t[19] !== o.title ? (c = /* @__PURE__ */ a.jsx(q, { title: o.title, deps: s }), t[18] = s, t[19] = o.title, t[20] = c) : c = t[20];
    const z = o;
    t[21] !== s || t[22] !== e || t[23] !== z ? (u = /* @__PURE__ */ a.jsx(K, { task: z, deps: s, normalizeBareMath: e }), t[21] = s, t[22] = e, t[23] = z, t[24] = u) : u = t[24];
    const y = B.join(" ; "), E = Y(g);
    t[25] !== s || t[26] !== y || t[27] !== E ? (b = /* @__PURE__ */ a.jsx(rt, { userAnswer: y, correctAnswer: E, deps: s }), t[25] = s, t[26] = y, t[27] = E, t[28] = b) : b = t[28], w = "text-inputs", d = A, p = A === "inline" ? r.inline : r.stack;
    let T;
    t[29] !== g || t[30] !== e ? (T = (H, R) => {
      var $;
      const {
        key: P,
        before: C,
        after: I
      } = H;
      return /* @__PURE__ */ a.jsxs("div", { className: `${r.inputRow} ${r.solutionRow}`, children: [
        C && /* @__PURE__ */ a.jsx(F, { "data-testid": "text-prefix", className: r.fieldLabel, value: L(C, e) }),
        /* @__PURE__ */ a.jsx(Z, { className: r.answerFormula, children: ($ = g[R]) != null ? $ : "" }),
        I && /* @__PURE__ */ a.jsx(F, { "data-testid": "text-suffix", className: r.suffix, value: L(I, e) })
      ] }, P);
    }, t[29] = g, t[30] = e, t[31] = T) : T = t[31], x = N.map(T), t[2] = v, t[3] = s, t[4] = A, t[5] = l, t[6] = e, t[7] = i, t[8] = o, t[9] = m, t[10] = b, t[11] = w, t[12] = d, t[13] = p, t[14] = x, t[15] = h, t[16] = c, t[17] = u;
  } else
    b = t[10], w = t[11], d = t[12], p = t[13], x = t[14], h = t[15], c = t[16], u = t[17];
  let j;
  t[32] !== w || t[33] !== d || t[34] !== p || t[35] !== x ? (j = /* @__PURE__ */ a.jsx("div", { "data-testid": w, "data-layout": d, className: p, children: x }), t[32] = w, t[33] = d, t[34] = p, t[35] = x, t[36] = j) : j = t[36];
  let f;
  t[37] !== s || t[38] !== i ? (f = /* @__PURE__ */ a.jsx(it, { solution: i, deps: s }), t[37] = s, t[38] = i, t[39] = f) : f = t[39];
  let M;
  return t[40] !== b || t[41] !== j || t[42] !== f || t[43] !== h || t[44] !== c || t[45] !== u ? (M = /* @__PURE__ */ a.jsxs("div", { className: h, children: [
    c,
    u,
    b,
    j,
    f
  ] }), t[40] = b, t[41] = j, t[42] = f, t[43] = h, t[44] = c, t[45] = u, t[46] = M) : M = t[46], M;
}, G = (k) => !!(k && lt(k).text), wt = ({
  id: k,
  layout: t,
  withBefore: o = !1,
  withAfter: s = !1,
  widthFromTask: v = !0,
  normalizeBareMath: i = !1
}) => {
  const A = (S) => {
    const e = O.c(42), {
      task: l,
      deps: n,
      answer: m,
      onChange: b,
      mathInput: w
    } = S;
    if (tt(l.solution)) {
      let N;
      return e[0] !== m || e[1] !== n || e[2] !== l ? (N = /* @__PURE__ */ a.jsx(dt, { task: l, deps: n, answer: m, solution: l.solution, layout: t, normalizeBareMath: i }), e[0] = m, e[1] = n, e[2] = l, e[3] = N) : N = e[3], N;
    }
    const d = n.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let p, x, h, c, u, j, f, M;
    if (e[4] !== m || e[5] !== n || e[6] !== w || e[7] !== b || e[8] !== d || e[9] !== l) {
      const {
        bindRef: N,
        handleChange: z
      } = et({
        onChange: b,
        separator: d,
        mathInput: w
      });
      let y;
      e[18] !== m || e[19] !== d ? (y = X(m, d), e[18] = m, e[19] = d, e[20] = y) : y = e[20];
      const E = y;
      let T;
      e[21] !== n.global ? (T = ($) => n.global.translateTasks($), e[21] = n.global, e[22] = T) : T = e[22];
      const H = J(l, T);
      let R;
      e[23] !== l ? (R = v ? mt(l, 24) : null, e[23] = l, e[24] = R) : R = e[24];
      const P = R, C = nt(t, o, H.map(pt));
      u = r.container, j = k, e[25] !== n || e[26] !== l.title ? (f = /* @__PURE__ */ a.jsx(q, { title: l.title, deps: n }), e[25] = n, e[26] = l.title, e[27] = f) : f = e[27];
      const I = l;
      e[28] !== n || e[29] !== I ? (M = /* @__PURE__ */ a.jsx(K, { task: I, deps: n, normalizeBareMath: i }), e[28] = n, e[29] = I, e[30] = M) : M = e[30], p = "text-inputs", x = t, h = t === "inline" ? r.inline : st(r.stack, C && r.stackGrid), c = H.map(($, Q) => {
        var _;
        const {
          key: V,
          before: D,
          after: W
        } = $;
        return /* @__PURE__ */ a.jsxs("div", { className: r.inputRow, children: [
          o && G(D) ? /* @__PURE__ */ a.jsx(F, { "data-testid": "text-prefix", className: r.fieldLabel, value: L(D, i) }) : C && /* @__PURE__ */ a.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ a.jsx(at, { id: V, ref: N(V), formula: (_ = E[Q]) != null ? _ : "", onMathFieldChanged: z, className: r.input, style: P ? {
            flex: "none",
            minWidth: `min(${P}px, 100%)`
          } : void 0 }),
          s && G(W) ? /* @__PURE__ */ a.jsx(F, { "data-testid": "text-suffix", className: r.suffix, value: L(W, i) }) : C && /* @__PURE__ */ a.jsx("span", { "aria-hidden": !0 })
        ] }, V);
      }), e[4] = m, e[5] = n, e[6] = w, e[7] = b, e[8] = d, e[9] = l, e[10] = p, e[11] = x, e[12] = h, e[13] = c, e[14] = u, e[15] = j, e[16] = f, e[17] = M;
    } else
      p = e[10], x = e[11], h = e[12], c = e[13], u = e[14], j = e[15], f = e[16], M = e[17];
    let g;
    e[31] !== p || e[32] !== x || e[33] !== h || e[34] !== c ? (g = /* @__PURE__ */ a.jsx("div", { "data-testid": p, "data-layout": x, className: h, children: c }), e[31] = p, e[32] = x, e[33] = h, e[34] = c, e[35] = g) : g = e[35];
    let B;
    return e[36] !== u || e[37] !== j || e[38] !== f || e[39] !== M || e[40] !== g ? (B = /* @__PURE__ */ a.jsxs("div", { className: u, "data-template-id": j, children: [
      f,
      M,
      g
    ] }), e[36] = u, e[37] = j, e[38] = f, e[39] = M, e[40] = g, e[41] = B) : B = e[41], B;
  };
  return A.displayName = k, A;
};
function pt(k) {
  const {
    before: t
  } = k;
  return t;
}
export {
  wt as c
};
