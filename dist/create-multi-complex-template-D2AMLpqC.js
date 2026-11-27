import { c as q, y as G, z as F, X as P, j as s, a as V, P as D, b as J, W as i, d as E, M as K, e as O, A as Q, k as U } from "./index-wRluoD-s.js";
import { g as L } from "./get-inline-input-entries-s5EOxUfG.js";
import { S as Y } from "./shared-solution-body-9WuuvhSD.js";
import { S as Z } from "./solution-answer-panel-BnG30GAS.js";
import { C as _ } from "./complex-solution-row-2VwmbgvZ.js";
const ee = (v) => {
  var I, M, S, j;
  const e = q.c(44), {
    task: l,
    deps: t,
    answer: w,
    solution: n,
    layout: u
  } = v, p = t.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let A;
  e[0] !== t.global ? (A = (C) => t.global.translateTasks(C), e[0] = t.global, e[1] = A) : A = e[1];
  const d = A;
  let h;
  e[2] !== p || e[3] !== n || e[4] !== d ? (h = G(n, p, d), e[2] = p, e[3] = n, e[4] = d, e[5] = h) : h = e[5];
  const o = h;
  let x, a, r, c, m;
  if (e[6] !== w || e[7] !== o || e[8] !== t || e[9] !== u || e[10] !== p || e[11] !== l || e[12] !== d) {
    const C = F(w, p), H = !!((I = l.description) != null && I.isAnswerCellHidden);
    let T;
    e[18] !== o || e[19] !== ((M = l.description) == null ? void 0 : M.parts) ? (T = P((S = l.description) == null ? void 0 : S.parts) ? o : null, e[18] = o, e[19] = (j = l.description) == null ? void 0 : j.parts, e[20] = T) : T = e[20];
    const N = T, z = L(l, d);
    x = i.container, e[21] !== t || e[22] !== l.title ? (a = /* @__PURE__ */ s.jsx(V, { title: l.title, deps: t }), e[21] = t, e[22] = l.title, e[23] = a) : a = e[23], e[24] !== t || e[25] !== N || e[26] !== l.description ? (r = /* @__PURE__ */ s.jsx(D, { description: l.description, deps: t, tableSolutionAnswers: N }), e[24] = t, e[25] = N, e[26] = l.description, e[27] = r) : r = e[27];
    const R = C.join(" ; ");
    let g;
    e[28] !== o ? (g = J(o), e[28] = o, e[29] = g) : g = e[29], e[30] !== t || e[31] !== g || e[32] !== R ? (c = /* @__PURE__ */ s.jsx(Z, { userAnswer: R, correctAnswer: g, deps: t }), e[30] = t, e[31] = g, e[32] = R, e[33] = c) : c = e[33], m = H ? null : /* @__PURE__ */ s.jsx("div", { "data-testid": "text-inputs", "data-layout": u, className: u === "inline" ? i.inline : i.stack, children: z.map((W, X) => {
      var k;
      const {
        key: $,
        before: y,
        after: B
      } = W;
      return /* @__PURE__ */ s.jsxs(_, { children: [
        y ? /* @__PURE__ */ s.jsx(E, { "data-testid": "text-prefix", className: i.fieldLabel, value: y }) : null,
        /* @__PURE__ */ s.jsx(K, { className: i.answerFormula, children: (k = o[X]) != null ? k : "" }),
        B ? /* @__PURE__ */ s.jsx(E, { "data-testid": "text-suffix", className: i.suffix, value: B }) : null
      ] }, $);
    }) }), e[6] = w, e[7] = o, e[8] = t, e[9] = u, e[10] = p, e[11] = l, e[12] = d, e[13] = x, e[14] = a, e[15] = r, e[16] = c, e[17] = m;
  } else
    x = e[13], a = e[14], r = e[15], c = e[16], m = e[17];
  let f;
  e[34] !== t || e[35] !== n ? (f = /* @__PURE__ */ s.jsx(Y, { solution: n, deps: t }), e[34] = t, e[35] = n, e[36] = f) : f = e[36];
  let b;
  return e[37] !== x || e[38] !== a || e[39] !== r || e[40] !== c || e[41] !== m || e[42] !== f ? (b = /* @__PURE__ */ s.jsxs("div", { className: x, children: [
    a,
    r,
    c,
    m,
    f
  ] }), e[37] = x, e[38] = a, e[39] = r, e[40] = c, e[41] = m, e[42] = f, e[43] = b) : b = e[43], b;
}, ae = ({
  id: v,
  layout: e,
  withBefore: l = !1,
  withAfter: t = !1
}) => {
  const w = ({
    task: n,
    deps: u,
    answer: p,
    onChange: A,
    mathInput: d
  }) => {
    var M, S;
    if (O(n.solution))
      return /* @__PURE__ */ s.jsx(ee, { task: n, deps: u, answer: p, solution: n.solution, layout: e });
    const h = !!((M = n.description) != null && M.isAnswerCellHidden), o = P((S = n.description) == null ? void 0 : S.parts), x = h && o, a = u.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: r,
      handleChange: c
    } = Q({
      onChange: A,
      separator: a,
      mathInput: d
    });
    let m = 0;
    const f = x ? {
      answer: p,
      separator: a,
      bindRef: r,
      handleChange: c,
      nextInputIndex: () => m++
    } : null, b = F(p, a), I = L(n, (j) => u.global.translateTasks(j));
    return /* @__PURE__ */ s.jsxs("div", { className: i.container, "data-template-id": v, children: [
      /* @__PURE__ */ s.jsx(V, { title: n.title, deps: u }),
      /* @__PURE__ */ s.jsx(D, { description: n.description, deps: u, tableAnswerBindings: f }),
      h ? null : /* @__PURE__ */ s.jsx("div", { "data-testid": "text-inputs", "data-layout": e, className: e === "inline" ? i.inline : i.stack, children: I.map(({
        key: j,
        before: C,
        after: H
      }, T) => {
        var N;
        return /* @__PURE__ */ s.jsxs("div", { className: i.inputRow, children: [
          l && C ? /* @__PURE__ */ s.jsx(E, { "data-testid": "text-prefix", className: i.fieldLabel, value: C }) : null,
          /* @__PURE__ */ s.jsx(U, { id: j, ref: r(j), formula: (N = b[T]) != null ? N : "", onMathFieldChanged: c, className: i.input }),
          t && H ? /* @__PURE__ */ s.jsx(E, { "data-testid": "text-suffix", className: i.suffix, value: H }) : null
        ] }, j);
      }) })
    ] });
  };
  return w.displayName = v, w;
};
export {
  ae as c
};
