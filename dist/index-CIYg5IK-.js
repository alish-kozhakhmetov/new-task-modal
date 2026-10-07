import { c as P, l as J, m as V, q as K, A as Q, B as U, D as W, j as s, a as _, L as X, E as G, b as Y, F as c, d as L, M as Z, e as ee, n as te, f as se, k as ae } from "./index-DwDfo0zf.js";
import { g as z } from "./get-inline-input-entries-CGVm7T7Q.js";
import { h as ie } from "./label-column-C240-oSs.js";
import { S as le, a as ne } from "./solution-answer-panel-DNRF1AHT.js";
const oe = (M) => {
  const e = P.c(43), {
    task: b,
    deps: i,
    answer: A,
    solution: g,
    layout: t
  } = M, l = i.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let a;
  e[0] !== i.global ? (a = (n) => i.global.translateTasks(n), e[0] = i.global, e[1] = a) : a = e[1];
  const d = a;
  let k, w, p, m, f, x, o, j, r;
  if (e[2] !== A || e[3] !== i || e[4] !== t || e[5] !== l || e[6] !== g || e[7] !== b || e[8] !== d) {
    const n = J(g, l, d), $ = V(A, l), D = z(b, d), S = K(b, i), O = !!(S && Q(S)) && S ? U(S, {
      quotient: n[0] || void 0
    }) : null;
    k = O ? W(O) : null, x = c.container, e[18] !== i || e[19] !== b.title ? (o = /* @__PURE__ */ s.jsx(_, { title: b.title, deps: i }), e[18] = i, e[19] = b.title, e[20] = o) : o = e[20], j = k ? /* @__PURE__ */ s.jsx(X, { dividend: k.dividend, divisor: k.divisor }) : /* @__PURE__ */ s.jsx(G, { task: b, deps: i, quotient: n[0] || void 0, remainder: n[1] || void 0 });
    const C = $.join(" ; "), T = Y(n);
    e[21] !== i || e[22] !== C || e[23] !== T ? (r = /* @__PURE__ */ s.jsx(le, { userAnswer: C, correctAnswer: T, deps: i }), e[21] = i, e[22] = C, e[23] = T, e[24] = r) : r = e[24], w = "text-inputs", p = t, m = t === "inline" ? c.inline : c.stack;
    let y;
    e[25] !== n ? (y = (R, F) => {
      var H;
      const {
        key: I,
        before: B,
        after: q
      } = R;
      return /* @__PURE__ */ s.jsxs("div", { className: `${c.inputRow} ${c.solutionRow}`, children: [
        B && /* @__PURE__ */ s.jsx(L, { "data-testid": "text-prefix", className: c.fieldLabel, value: B }),
        /* @__PURE__ */ s.jsx(Z, { className: c.answerFormula, children: (H = n[F]) != null ? H : "" }),
        q && /* @__PURE__ */ s.jsx(L, { "data-testid": "text-suffix", className: c.suffix, value: q })
      ] }, I);
    }, e[25] = n, e[26] = y) : y = e[26], f = D.map(y), e[2] = A, e[3] = i, e[4] = t, e[5] = l, e[6] = g, e[7] = b, e[8] = d, e[9] = k, e[10] = w, e[11] = p, e[12] = m, e[13] = f, e[14] = x, e[15] = o, e[16] = j, e[17] = r;
  } else
    k = e[9], w = e[10], p = e[11], m = e[12], f = e[13], x = e[14], o = e[15], j = e[16], r = e[17];
  let u;
  e[27] !== w || e[28] !== p || e[29] !== m || e[30] !== f ? (u = /* @__PURE__ */ s.jsx("div", { "data-testid": w, "data-layout": p, className: m, children: f }), e[27] = w, e[28] = p, e[29] = m, e[30] = f, e[31] = u) : u = e[31];
  const h = !!k;
  let v;
  e[32] !== i || e[33] !== g || e[34] !== h ? (v = /* @__PURE__ */ s.jsx(ne, { solution: g, deps: i, suppressFreeTextContent: h }), e[32] = i, e[33] = g, e[34] = h, e[35] = v) : v = e[35];
  let N;
  return e[36] !== u || e[37] !== v || e[38] !== x || e[39] !== o || e[40] !== j || e[41] !== r ? (N = /* @__PURE__ */ s.jsxs("div", { className: x, children: [
    o,
    j,
    r,
    u,
    v
  ] }), e[36] = u, e[37] = v, e[38] = x, e[39] = o, e[40] = j, e[41] = r, e[42] = N) : N = e[42], N;
}, re = ({
  id: M,
  layout: e,
  withBefore: b = !1,
  withAfter: i = !1
}) => {
  const A = (g) => {
    const t = P.c(40), {
      task: l,
      deps: a,
      answer: d,
      onChange: k,
      mathInput: w
    } = g;
    if (ee(l.solution)) {
      let n;
      return t[0] !== d || t[1] !== a || t[2] !== l ? (n = /* @__PURE__ */ s.jsx(oe, { task: l, deps: a, answer: d, solution: l.solution, layout: e }), t[0] = d, t[1] = a, t[2] = l, t[3] = n) : n = t[3], n;
    }
    const p = a.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let m, f, x, o, j, r, u, h;
    if (t[4] !== d || t[5] !== a || t[6] !== w || t[7] !== k || t[8] !== p || t[9] !== l) {
      const {
        bindRef: n,
        handleChange: $
      } = te({
        onChange: k,
        separator: p,
        mathInput: w
      });
      let D;
      t[18] !== d || t[19] !== p ? (D = V(d, p), t[18] = d, t[19] = p, t[20] = D) : D = t[20];
      const S = D;
      let E;
      t[21] !== a.global ? (E = (T) => a.global.translateTasks(T), t[21] = a.global, t[22] = E) : E = t[22];
      const O = z(l, E), C = ie(e, b, O.map(ue));
      j = c.container, r = M, t[23] !== a || t[24] !== l.title ? (u = /* @__PURE__ */ s.jsx(_, { title: l.title, deps: a }), t[23] = a, t[24] = l.title, t[25] = u) : u = t[25], t[26] !== a || t[27] !== l ? (h = /* @__PURE__ */ s.jsx(G, { task: l, deps: a }), t[26] = a, t[27] = l, t[28] = h) : h = t[28], m = "text-inputs", f = e, x = se(c.stack, C && c.stackGrid), o = O.map((T, y) => {
        var B;
        const {
          key: R,
          before: F,
          after: I
        } = T;
        return /* @__PURE__ */ s.jsxs("div", { className: c.inputRow, children: [
          b && F ? /* @__PURE__ */ s.jsx(L, { "data-testid": "text-prefix", className: c.fieldLabel, value: F }) : C && /* @__PURE__ */ s.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ s.jsx(ae, { id: R, ref: n(R), formula: (B = S[y]) != null ? B : "", onMathFieldChanged: $, className: c.input }),
          i && I ? /* @__PURE__ */ s.jsx(L, { "data-testid": "text-suffix", className: c.suffix, value: I }) : C && /* @__PURE__ */ s.jsx("span", { "aria-hidden": !0 })
        ] }, R);
      }), t[4] = d, t[5] = a, t[6] = w, t[7] = k, t[8] = p, t[9] = l, t[10] = m, t[11] = f, t[12] = x, t[13] = o, t[14] = j, t[15] = r, t[16] = u, t[17] = h;
    } else
      m = t[10], f = t[11], x = t[12], o = t[13], j = t[14], r = t[15], u = t[16], h = t[17];
    let v;
    t[29] !== m || t[30] !== f || t[31] !== x || t[32] !== o ? (v = /* @__PURE__ */ s.jsx("div", { "data-testid": m, "data-layout": f, className: x, children: o }), t[29] = m, t[30] = f, t[31] = x, t[32] = o, t[33] = v) : v = t[33];
    let N;
    return t[34] !== j || t[35] !== r || t[36] !== u || t[37] !== h || t[38] !== v ? (N = /* @__PURE__ */ s.jsxs("div", { className: j, "data-template-id": r, children: [
      u,
      h,
      v
    ] }), t[34] = j, t[35] = r, t[36] = u, t[37] = h, t[38] = v, t[39] = N) : N = t[39], N;
  };
  return A.displayName = M, A;
};
function ue(M) {
  const {
    before: e
  } = M;
  return e;
}
const fe = re({
  id: "columnOperation.multi.stack.n2.before",
  layout: "stack",
  withBefore: !0
});
export {
  fe as ColumnOperationMultiStackN2Before
};
