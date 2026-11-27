import { c as D, y as G, z as P, j as s, a as _, b as O, Q as c, d as L, M as Q, e as q, A as J, f as K, k as U, O as W } from "./index-wRluoD-s.js";
import { g as z } from "./get-inline-input-entries-s5EOxUfG.js";
import { h as X } from "./label-column-C240-oSs.js";
import { S as Y } from "./shared-solution-description-U-K_8gp1.js";
import { S as Z } from "./shared-solution-body-9WuuvhSD.js";
import { S as tt } from "./solution-answer-panel-BnG30GAS.js";
const et = (v) => {
  const t = D.c(44), {
    task: k,
    deps: a,
    answer: A,
    solution: g,
    layout: e
  } = v, i = a.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let l;
  t[0] !== a.global ? (l = (h) => a.global.translateTasks(h), t[0] = a.global, t[1] = l) : l = t[1];
  const f = l;
  let b, w, d, m, p, n, r, o;
  if (t[2] !== A || t[3] !== a || t[4] !== e || t[5] !== i || t[6] !== g || t[7] !== k || t[8] !== f) {
    const h = G(g, i, f), T = P(A, i), S = z(k, f);
    p = c.container, t[17] !== a || t[18] !== k.title ? (n = /* @__PURE__ */ s.jsx(_, { title: k.title, deps: a }), t[17] = a, t[18] = k.title, t[19] = n) : n = t[19];
    const F = k;
    t[20] !== a || t[21] !== F ? (r = /* @__PURE__ */ s.jsx(Y, { task: F, deps: a }), t[20] = a, t[21] = F, t[22] = r) : r = t[22];
    const M = T.join(" ; "), R = O(h);
    t[23] !== a || t[24] !== M || t[25] !== R ? (o = /* @__PURE__ */ s.jsx(tt, { userAnswer: M, correctAnswer: R, deps: a }), t[23] = a, t[24] = M, t[25] = R, t[26] = o) : o = t[26], b = "text-inputs", w = e, d = e === "inline" ? c.inline : c.stack;
    let N;
    t[27] !== h ? (N = ($, C) => {
      var I;
      const {
        key: E,
        before: H,
        after: y
      } = $;
      return /* @__PURE__ */ s.jsxs("div", { className: `${c.inputRow} ${c.solutionRow}`, children: [
        H && /* @__PURE__ */ s.jsx(L, { "data-testid": "text-prefix", className: c.fieldLabel, value: H }),
        /* @__PURE__ */ s.jsx(Q, { className: c.answerFormula, children: (I = h[C]) != null ? I : "" }),
        y && /* @__PURE__ */ s.jsx(L, { "data-testid": "text-suffix", className: c.suffix, value: y })
      ] }, E);
    }, t[27] = h, t[28] = N) : N = t[28], m = S.map(N), t[2] = A, t[3] = a, t[4] = e, t[5] = i, t[6] = g, t[7] = k, t[8] = f, t[9] = b, t[10] = w, t[11] = d, t[12] = m, t[13] = p, t[14] = n, t[15] = r, t[16] = o;
  } else
    b = t[9], w = t[10], d = t[11], m = t[12], p = t[13], n = t[14], r = t[15], o = t[16];
  let x;
  t[29] !== b || t[30] !== w || t[31] !== d || t[32] !== m ? (x = /* @__PURE__ */ s.jsx("div", { "data-testid": b, "data-layout": w, className: d, children: m }), t[29] = b, t[30] = w, t[31] = d, t[32] = m, t[33] = x) : x = t[33];
  let u;
  t[34] !== a || t[35] !== g ? (u = /* @__PURE__ */ s.jsx(Z, { solution: g, deps: a }), t[34] = a, t[35] = g, t[36] = u) : u = t[36];
  let j;
  return t[37] !== x || t[38] !== u || t[39] !== p || t[40] !== n || t[41] !== r || t[42] !== o ? (j = /* @__PURE__ */ s.jsxs("div", { className: p, children: [
    n,
    r,
    o,
    x,
    u
  ] }), t[37] = x, t[38] = u, t[39] = p, t[40] = n, t[41] = r, t[42] = o, t[43] = j) : j = t[43], j;
}, st = ({
  id: v,
  layout: t,
  withBefore: k = !1,
  withAfter: a = !1
}) => {
  const A = (g) => {
    const e = D.c(40), {
      task: i,
      deps: l,
      answer: f,
      onChange: b,
      mathInput: w
    } = g;
    if (q(i.solution)) {
      let S;
      return e[0] !== f || e[1] !== l || e[2] !== i ? (S = /* @__PURE__ */ s.jsx(et, { task: i, deps: l, answer: f, solution: i.solution, layout: t }), e[0] = f, e[1] = l, e[2] = i, e[3] = S) : S = e[3], S;
    }
    const d = l.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let m, p, n, r, o, x, u, j;
    if (e[4] !== f || e[5] !== l || e[6] !== w || e[7] !== b || e[8] !== d || e[9] !== i) {
      const {
        bindRef: S,
        handleChange: F
      } = J({
        onChange: b,
        separator: d,
        mathInput: w
      });
      let M;
      e[18] !== f || e[19] !== d ? (M = P(f, d), e[18] = f, e[19] = d, e[20] = M) : M = e[20];
      const R = M;
      let N;
      e[21] !== l.global ? (N = (E) => l.global.translateTasks(E), e[21] = l.global, e[22] = N) : N = e[22];
      const $ = z(i, N), C = X(t, k, $.map(at));
      o = c.container, x = v, e[23] !== l || e[24] !== i.title ? (u = /* @__PURE__ */ s.jsx(_, { title: i.title, deps: l }), e[23] = l, e[24] = i.title, e[25] = u) : u = e[25], e[26] !== l || e[27] !== i ? (j = /* @__PURE__ */ s.jsx(W, { task: i, deps: l }), e[26] = l, e[27] = i, e[28] = j) : j = e[28], m = "text-inputs", p = t, n = K(c.stack, C && c.stackGrid), r = $.map((E, H) => {
        var B;
        const {
          key: y,
          before: I,
          after: V
        } = E;
        return /* @__PURE__ */ s.jsxs("div", { className: c.inputRow, children: [
          k && I ? /* @__PURE__ */ s.jsx(L, { "data-testid": "text-prefix", className: c.fieldLabel, value: I }) : C && /* @__PURE__ */ s.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ s.jsx(U, { id: y, ref: S(y), formula: (B = R[H]) != null ? B : "", onMathFieldChanged: F, className: c.input }),
          a && V ? /* @__PURE__ */ s.jsx(L, { "data-testid": "text-suffix", className: c.suffix, value: V }) : C && /* @__PURE__ */ s.jsx("span", { "aria-hidden": !0 })
        ] }, y);
      }), e[4] = f, e[5] = l, e[6] = w, e[7] = b, e[8] = d, e[9] = i, e[10] = m, e[11] = p, e[12] = n, e[13] = r, e[14] = o, e[15] = x, e[16] = u, e[17] = j;
    } else
      m = e[10], p = e[11], n = e[12], r = e[13], o = e[14], x = e[15], u = e[16], j = e[17];
    let h;
    e[29] !== m || e[30] !== p || e[31] !== n || e[32] !== r ? (h = /* @__PURE__ */ s.jsx("div", { "data-testid": m, "data-layout": p, className: n, children: r }), e[29] = m, e[30] = p, e[31] = n, e[32] = r, e[33] = h) : h = e[33];
    let T;
    return e[34] !== o || e[35] !== x || e[36] !== u || e[37] !== j || e[38] !== h ? (T = /* @__PURE__ */ s.jsxs("div", { className: o, "data-template-id": x, children: [
      u,
      j,
      h
    ] }), e[34] = o, e[35] = x, e[36] = u, e[37] = j, e[38] = h, e[39] = T) : T = e[39], T;
  };
  return A.displayName = v, A;
};
function at(v) {
  const {
    before: t
  } = v;
  return t;
}
const ct = st({
  id: "formula.multi.stack.n2.before",
  layout: "stack",
  withBefore: !0
});
export {
  ct as FormulaMultiStackN2Before
};
