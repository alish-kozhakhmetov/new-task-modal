import { R as Q, U as Y, c as Z, s as _, g as I, b as ee, j as t, V as te, a as J, i as K, d as U, W as d, M as se, e as le, X as ne, A as ie, P as k, k as oe, h as re } from "./index-wRluoD-s.js";
import { S as ae } from "./shared-solution-body-9WuuvhSD.js";
import { S as ce } from "./solution-answer-panel-BnG30GAS.js";
import { C as de } from "./complex-solution-row-2VwmbgvZ.js";
const L = (l) => {
  const e = l == null ? void 0 : l.parts;
  return e != null && e.length ? e.every((n) => {
    const s = Q(n);
    return Number(s.type) === Y.Text;
  }) : !1;
}, q = (l, e) => l == null ? "" : K(l) ? e(l) : typeof l == "string" ? l : "", pe = (l) => {
  var X;
  const e = Z.c(56), {
    task: n,
    deps: s,
    answer: T,
    solution: i,
    id: p,
    withBefore: S,
    withAfter: H,
    equationLayout: M
  } = l, h = S === void 0 ? !1 : S, a = H === void 0 ? !1 : H, C = M === void 0 ? !1 : M;
  let N;
  e[0] !== s.global ? (N = (v) => s.global.translateTasks(v), e[0] = s.global, e[1] = N) : N = e[1];
  const r = N, B = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let x, c, j, f, m, u;
  if (e[2] !== T || e[3] !== i || e[4] !== n.answerInput || e[5] !== n.description || e[6] !== r || e[7] !== a || e[8] !== h) {
    const v = _(I(i, r)), o = n.answerInput, P = !!!((X = n.description) != null && X.isAnswerCellHidden) && !!v;
    let $;
    e[15] !== P || e[16] !== n.description ? ($ = P && L(n.description), e[15] = P, e[16] = n.description, e[17] = $) : $ = e[17], j = $;
    let z;
    e[18] !== (o == null ? void 0 : o.before) || e[19] !== r || e[20] !== h ? (z = h ? q(o == null ? void 0 : o.before, r) : "", e[18] = o == null ? void 0 : o.before, e[19] = r, e[20] = h, e[21] = z) : z = e[21];
    const V = z;
    let O;
    e[22] !== (o == null ? void 0 : o.after) || e[23] !== r || e[24] !== a ? (O = a ? q(o == null ? void 0 : o.after, r) : "", e[22] = o == null ? void 0 : o.after, e[23] = r, e[24] = a, e[25] = O) : O = e[25];
    const W = O;
    c = P ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
      V ? /* @__PURE__ */ t.jsx(U, { "data-testid": "text-prefix", className: d.prefix, value: V }) : null,
      /* @__PURE__ */ t.jsx(se, { className: d.answerFormula, children: v }),
      W ? /* @__PURE__ */ t.jsx(U, { "data-testid": "text-suffix", className: d.suffix, value: W }) : null
    ] }) : null, f = !!(c && (V || W)), x = ce, m = T, u = ee([v]), e[2] = T, e[3] = i, e[4] = n.answerInput, e[5] = n.description, e[6] = r, e[7] = a, e[8] = h, e[9] = x, e[10] = c, e[11] = j, e[12] = f, e[13] = m, e[14] = u;
  } else
    x = e[9], c = e[10], j = e[11], f = e[12], m = e[13], u = e[14];
  const g = p === "complex.plain.center";
  let b;
  e[26] !== x || e[27] !== s || e[28] !== m || e[29] !== u || e[30] !== g ? (b = /* @__PURE__ */ t.jsx(x, { userAnswer: m, correctAnswer: u, deps: s, alignCenter: g }), e[26] = x, e[27] = s, e[28] = m, e[29] = u, e[30] = g, e[31] = b) : b = e[31];
  const w = b;
  let A;
  e[32] !== s || e[33] !== C || e[34] !== B || e[35] !== i || e[36] !== n.description || e[37] !== r ? (A = /* @__PURE__ */ t.jsx(te, { description: n.description, deps: s, solution: i, separator: B, translate: r, equationLayout: C }), e[32] = s, e[33] = C, e[34] = B, e[35] = i, e[36] = n.description, e[37] = r, e[38] = A) : A = e[38];
  const D = A;
  let R;
  e[39] !== s || e[40] !== n.title ? (R = /* @__PURE__ */ t.jsx(J, { title: n.title, deps: s }), e[39] = s, e[40] = n.title, e[41] = R) : R = e[41];
  let y;
  e[42] !== c || e[43] !== w || e[44] !== D || e[45] !== j || e[46] !== f ? (y = j ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    w,
    /* @__PURE__ */ t.jsxs("div", { className: `${d.expressionRow} ${d.solutionRow}`, "data-layout": "inline", "data-testid": "complex-expression-row", children: [
      D,
      c
    ] })
  ] }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    D,
    w,
    f ? /* @__PURE__ */ t.jsx(de, { children: c }) : null
  ] }), e[42] = c, e[43] = w, e[44] = D, e[45] = j, e[46] = f, e[47] = y) : y = e[47];
  let F;
  e[48] !== s || e[49] !== i ? (F = /* @__PURE__ */ t.jsx(ae, { solution: i, deps: s }), e[48] = s, e[49] = i, e[50] = F) : F = e[50];
  let E;
  return e[51] !== p || e[52] !== R || e[53] !== y || e[54] !== F ? (E = /* @__PURE__ */ t.jsxs("div", { className: d.container, "data-template-id": p, children: [
    R,
    y,
    F
  ] }), e[51] = p, e[52] = R, e[53] = y, e[54] = F, e[55] = E) : E = e[55], E;
}, G = (l, e) => l == null ? "" : K(l) ? e(l) : typeof l == "string" ? l : "", je = ({
  id: l,
  withBefore: e = !1,
  withAfter: n = !1,
  equationLayout: s = !1
}) => {
  const T = ({
    task: i,
    deps: p,
    answer: S,
    onChange: H,
    mathInput: M
  }) => {
    var b, w;
    if (le(i.solution))
      return /* @__PURE__ */ t.jsx(pe, { task: i, deps: p, answer: S, solution: i.solution, id: l, withBefore: e, withAfter: n, equationLayout: s });
    const h = (A) => p.global.translateTasks(A), a = i.answerInput, C = !!((b = i.description) != null && b.isAnswerCellHidden), N = ne((w = i.description) == null ? void 0 : w.parts), r = C && N, B = !C && L(i.description), x = p.helpers.TaskHelper.multipleTaskAnswerSeparator, c = r ? ie({
      onChange: H,
      separator: x,
      mathInput: M
    }) : null;
    let j = 0;
    const f = c ? {
      answer: S,
      separator: x,
      bindRef: c.bindRef,
      handleChange: c.handleChange,
      nextInputIndex: () => j++
    } : null, m = e ? G(a == null ? void 0 : a.before, h) : "", u = n ? G(a == null ? void 0 : a.after, h) : "", g = C ? null : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
      m ? /* @__PURE__ */ t.jsx(U, { "data-testid": "text-prefix", className: d.prefix, value: m }) : null,
      /* @__PURE__ */ t.jsx(oe, { ref: (A) => re(A, M), formula: S, onMathFieldChanged: H, className: d.input }),
      u ? /* @__PURE__ */ t.jsx(U, { "data-testid": "text-suffix", className: d.suffix, value: u }) : null
    ] });
    return /* @__PURE__ */ t.jsxs("div", { className: d.container, "data-template-id": l, children: [
      /* @__PURE__ */ t.jsx(J, { title: i.title, deps: p }),
      B ? /* @__PURE__ */ t.jsxs("div", { className: d.expressionRow, "data-layout": "inline", "data-testid": "complex-expression-row", children: [
        /* @__PURE__ */ t.jsx(k, { description: i.description, deps: p, tableAnswerBindings: f, equationLayout: s }),
        g
      ] }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
        /* @__PURE__ */ t.jsx(k, { description: i.description, deps: p, tableAnswerBindings: f, equationLayout: s }),
        g ? /* @__PURE__ */ t.jsx("div", { className: d.inputRow, children: g }) : null
      ] })
    ] });
  };
  return T.displayName = l, T;
};
export {
  je as c
};
