import { c as D, l as K, m as P, j as s, a as _, b as q, K as c, d as L, M as z, e as J, n as O, f as Q, k as U, I as W } from "./index-DwDfo0zf.js";
import { g as G } from "./get-inline-input-entries-CGVm7T7Q.js";
import { h as X } from "./label-column-C240-oSs.js";
import { S as Y } from "./shared-solution-description-2ItwXAUl.js";
import { S as Z, a as tt } from "./solution-answer-panel-DNRF1AHT.js";
const et = (v) => {
  const t = D.c(44), {
    task: k,
    deps: a,
    answer: T,
    solution: g,
    layout: e
  } = v, i = a.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let l;
  t[0] !== a.global ? (l = (h) => a.global.translateTasks(h), t[0] = a.global, t[1] = l) : l = t[1];
  const d = l;
  let b, w, f, m, p, n, r, o;
  if (t[2] !== T || t[3] !== a || t[4] !== e || t[5] !== i || t[6] !== g || t[7] !== k || t[8] !== d) {
    const h = K(g, i, d), A = P(T, i), M = G(k, d);
    p = c.container, t[17] !== a || t[18] !== k.title ? (n = /* @__PURE__ */ s.jsx(_, { title: k.title, deps: a }), t[17] = a, t[18] = k.title, t[19] = n) : n = t[19];
    const y = k;
    t[20] !== a || t[21] !== y ? (r = /* @__PURE__ */ s.jsx(Y, { task: y, deps: a }), t[20] = a, t[21] = y, t[22] = r) : r = t[22];
    const S = A.join(" ; "), I = q(h);
    t[23] !== a || t[24] !== S || t[25] !== I ? (o = /* @__PURE__ */ s.jsx(Z, { userAnswer: S, correctAnswer: I, deps: a }), t[23] = a, t[24] = S, t[25] = I, t[26] = o) : o = t[26], b = "text-inputs", w = e, f = e === "inline" ? c.inline : c.stack;
    let N;
    t[27] !== h ? (N = ($, R) => {
      var E;
      const {
        key: C,
        before: H,
        after: F
      } = $;
      return /* @__PURE__ */ s.jsxs("div", { className: `${c.inputRow} ${c.solutionRow}`, children: [
        H && /* @__PURE__ */ s.jsx(L, { "data-testid": "text-prefix", className: c.fieldLabel, value: H }),
        /* @__PURE__ */ s.jsx(z, { className: c.answerFormula, children: (E = h[R]) != null ? E : "" }),
        F && /* @__PURE__ */ s.jsx(L, { "data-testid": "text-suffix", className: c.suffix, value: F })
      ] }, C);
    }, t[27] = h, t[28] = N) : N = t[28], m = M.map(N), t[2] = T, t[3] = a, t[4] = e, t[5] = i, t[6] = g, t[7] = k, t[8] = d, t[9] = b, t[10] = w, t[11] = f, t[12] = m, t[13] = p, t[14] = n, t[15] = r, t[16] = o;
  } else
    b = t[9], w = t[10], f = t[11], m = t[12], p = t[13], n = t[14], r = t[15], o = t[16];
  let x;
  t[29] !== b || t[30] !== w || t[31] !== f || t[32] !== m ? (x = /* @__PURE__ */ s.jsx("div", { "data-testid": b, "data-layout": w, className: f, children: m }), t[29] = b, t[30] = w, t[31] = f, t[32] = m, t[33] = x) : x = t[33];
  let u;
  t[34] !== a || t[35] !== g ? (u = /* @__PURE__ */ s.jsx(tt, { solution: g, deps: a }), t[34] = a, t[35] = g, t[36] = u) : u = t[36];
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
  const T = (g) => {
    const e = D.c(40), {
      task: i,
      deps: l,
      answer: d,
      onChange: b,
      mathInput: w
    } = g;
    if (J(i.solution)) {
      let M;
      return e[0] !== d || e[1] !== l || e[2] !== i ? (M = /* @__PURE__ */ s.jsx(et, { task: i, deps: l, answer: d, solution: i.solution, layout: t }), e[0] = d, e[1] = l, e[2] = i, e[3] = M) : M = e[3], M;
    }
    const f = l.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let m, p, n, r, o, x, u, j;
    if (e[4] !== d || e[5] !== l || e[6] !== w || e[7] !== b || e[8] !== f || e[9] !== i) {
      const {
        bindRef: M,
        handleChange: y
      } = O({
        onChange: b,
        separator: f,
        mathInput: w
      });
      let S;
      e[18] !== d || e[19] !== f ? (S = P(d, f), e[18] = d, e[19] = f, e[20] = S) : S = e[20];
      const I = S;
      let N;
      e[21] !== l.global ? (N = (C) => l.global.translateTasks(C), e[21] = l.global, e[22] = N) : N = e[22];
      const $ = G(i, N), R = X(t, k, $.map(at));
      o = c.container, x = v, e[23] !== l || e[24] !== i.title ? (u = /* @__PURE__ */ s.jsx(_, { title: i.title, deps: l }), e[23] = l, e[24] = i.title, e[25] = u) : u = e[25], e[26] !== l || e[27] !== i ? (j = /* @__PURE__ */ s.jsx(W, { task: i, deps: l }), e[26] = l, e[27] = i, e[28] = j) : j = e[28], m = "text-inputs", p = t, n = Q(c.stack, R && c.stackGrid), r = $.map((C, H) => {
        var B;
        const {
          key: F,
          before: E,
          after: V
        } = C;
        return /* @__PURE__ */ s.jsxs("div", { className: c.inputRow, children: [
          k && E ? /* @__PURE__ */ s.jsx(L, { "data-testid": "text-prefix", className: c.fieldLabel, value: E }) : R && /* @__PURE__ */ s.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ s.jsx(U, { id: F, ref: M(F), formula: (B = I[H]) != null ? B : "", onMathFieldChanged: y, className: c.input }),
          a && V ? /* @__PURE__ */ s.jsx(L, { "data-testid": "text-suffix", className: c.suffix, value: V }) : R && /* @__PURE__ */ s.jsx("span", { "aria-hidden": !0 })
        ] }, F);
      }), e[4] = d, e[5] = l, e[6] = w, e[7] = b, e[8] = f, e[9] = i, e[10] = m, e[11] = p, e[12] = n, e[13] = r, e[14] = o, e[15] = x, e[16] = u, e[17] = j;
    } else
      m = e[10], p = e[11], n = e[12], r = e[13], o = e[14], x = e[15], u = e[16], j = e[17];
    let h;
    e[29] !== m || e[30] !== p || e[31] !== n || e[32] !== r ? (h = /* @__PURE__ */ s.jsx("div", { "data-testid": m, "data-layout": p, className: n, children: r }), e[29] = m, e[30] = p, e[31] = n, e[32] = r, e[33] = h) : h = e[33];
    let A;
    return e[34] !== o || e[35] !== x || e[36] !== u || e[37] !== j || e[38] !== h ? (A = /* @__PURE__ */ s.jsxs("div", { className: o, "data-template-id": x, children: [
      u,
      j,
      h
    ] }), e[34] = o, e[35] = x, e[36] = u, e[37] = j, e[38] = h, e[39] = A) : A = e[39], A;
  };
  return T.displayName = v, T;
};
function at(v) {
  const {
    before: t
  } = v;
  return t;
}
const ut = st({
  id: "formula.multi.stack.n2.before",
  layout: "stack",
  withBefore: !0
});
export {
  ut as FormulaMultiStackN2Before
};
