var Q = Object.defineProperty;
var P = Object.getOwnPropertySymbols;
var W = Object.prototype.hasOwnProperty, X = Object.prototype.propertyIsEnumerable;
var V = (p, e, l) => e in p ? Q(p, e, { enumerable: !0, configurable: !0, writable: !0, value: l }) : p[e] = l, q = (p, e) => {
  for (var l in e || (e = {}))
    W.call(e, l) && V(p, l, e[l]);
  if (P)
    for (var l of P(e))
      X.call(e, l) && V(p, l, e[l]);
  return p;
};
import { c as H, y as Y, z as U, m as Z, D as ee, E as te, F as se, j as i, a as z, L as ae, G as J, b as ie, H as d, d as L, M as le, I as ne, e as oe, A as re, f as ue, k as ce } from "./index-wRluoD-s.js";
import { g as K } from "./get-inline-input-entries-s5EOxUfG.js";
import { h as de } from "./label-column-C240-oSs.js";
import { S as pe } from "./shared-solution-body-9WuuvhSD.js";
import { S as me } from "./solution-answer-panel-BnG30GAS.js";
const fe = (p) => {
  const e = H.c(43), {
    task: l,
    deps: n,
    answer: y,
    solution: S,
    layout: k
  } = p, t = n.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let a;
  e[0] !== n.global ? (a = (m) => n.global.translateTasks(m), e[0] = n.global, e[1] = a) : a = e[1];
  const s = a;
  let o, w, C, f, x, j, r, v, u;
  if (e[2] !== y || e[3] !== n || e[4] !== k || e[5] !== t || e[6] !== S || e[7] !== l || e[8] !== s) {
    const m = Y(S, t, s), T = U(y, t), $ = K(l, s), N = Z(l, n), A = !!(N && ee(N)) && N ? te(N, {
      quotient: m[0] || void 0
    }) : null;
    o = A ? se(A) : null, j = d.container, e[18] !== n || e[19] !== l.title ? (r = /* @__PURE__ */ i.jsx(z, { title: l.title, deps: n }), e[18] = n, e[19] = l.title, e[20] = r) : r = e[20], v = o ? /* @__PURE__ */ i.jsx(ae, { dividend: o.dividend, divisor: o.divisor }) : /* @__PURE__ */ i.jsx(J, { task: l, deps: n, quotient: m[0] || void 0, remainder: m[1] || void 0 });
    const E = T.join(" ; "), D = ie(m);
    e[21] !== n || e[22] !== E || e[23] !== D ? (u = /* @__PURE__ */ i.jsx(me, { userAnswer: E, correctAnswer: D, deps: n }), e[21] = n, e[22] = E, e[23] = D, e[24] = u) : u = e[24], w = "text-inputs", C = k, f = k === "inline" ? d.inline : d.stack;
    let M;
    e[25] !== m ? (M = (B, I) => {
      var G;
      const {
        key: F,
        before: O,
        after: R
      } = B;
      return /* @__PURE__ */ i.jsxs("div", { className: `${d.inputRow} ${d.solutionRow}`, children: [
        O && /* @__PURE__ */ i.jsx(L, { "data-testid": "text-prefix", className: d.fieldLabel, value: O }),
        /* @__PURE__ */ i.jsx(le, { className: d.answerFormula, children: (G = m[I]) != null ? G : "" }),
        R && /* @__PURE__ */ i.jsx(L, { "data-testid": "text-suffix", className: d.suffix, value: R })
      ] }, F);
    }, e[25] = m, e[26] = M) : M = e[26], x = $.map(M), e[2] = y, e[3] = n, e[4] = k, e[5] = t, e[6] = S, e[7] = l, e[8] = s, e[9] = o, e[10] = w, e[11] = C, e[12] = f, e[13] = x, e[14] = j, e[15] = r, e[16] = v, e[17] = u;
  } else
    o = e[9], w = e[10], C = e[11], f = e[12], x = e[13], j = e[14], r = e[15], v = e[16], u = e[17];
  let h;
  e[27] !== w || e[28] !== C || e[29] !== f || e[30] !== x ? (h = /* @__PURE__ */ i.jsx("div", { "data-testid": w, "data-layout": C, className: f, children: x }), e[27] = w, e[28] = C, e[29] = f, e[30] = x, e[31] = h) : h = e[31];
  const b = !!o;
  let c;
  e[32] !== n || e[33] !== S || e[34] !== b ? (c = /* @__PURE__ */ i.jsx(pe, { solution: S, deps: n, suppressFreeTextContent: b }), e[32] = n, e[33] = S, e[34] = b, e[35] = c) : c = e[35];
  let g;
  return e[36] !== h || e[37] !== c || e[38] !== j || e[39] !== r || e[40] !== v || e[41] !== u ? (g = /* @__PURE__ */ i.jsxs("div", { className: j, children: [
    r,
    v,
    u,
    h,
    c
  ] }), e[36] = h, e[37] = c, e[38] = j, e[39] = r, e[40] = v, e[41] = u, e[42] = g) : g = e[42], g;
}, xe = ({
  id: p,
  layout: e,
  withBefore: l = !1,
  withAfter: n = !1
}) => {
  const y = (k) => {
    const t = H.c(40), {
      task: a,
      deps: s,
      answer: o,
      onChange: w,
      mathInput: C
    } = k;
    if (oe(a.solution)) {
      let T;
      return t[0] !== o || t[1] !== s || t[2] !== a ? (T = /* @__PURE__ */ i.jsx(fe, { task: a, deps: s, answer: o, solution: a.solution, layout: e }), t[0] = o, t[1] = s, t[2] = a, t[3] = T) : T = t[3], T;
    }
    const f = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let x, j, r, v, u, h, b, c;
    if (t[4] !== o || t[5] !== s || t[6] !== C || t[7] !== w || t[8] !== f || t[9] !== a) {
      const {
        bindRef: T,
        handleChange: $
      } = re({
        onChange: w,
        separator: f,
        mathInput: C
      });
      let N;
      t[18] !== o || t[19] !== f ? (N = U(o, f), t[18] = o, t[19] = f, t[20] = N) : N = t[20];
      const _ = N;
      let A;
      t[21] !== s.global ? (A = (M) => s.global.translateTasks(M), t[21] = s.global, t[22] = A) : A = t[22];
      const E = K(a, A), D = de(e, l, E.map(je));
      u = d.container, h = p, t[23] !== s || t[24] !== a.title ? (b = /* @__PURE__ */ i.jsx(z, { title: a.title, deps: s }), t[23] = s, t[24] = a.title, t[25] = b) : b = t[25], t[26] !== s || t[27] !== a ? (c = /* @__PURE__ */ i.jsx(J, { task: a, deps: s }), t[26] = s, t[27] = a, t[28] = c) : c = t[28], x = "text-inputs", j = e, r = ue(d.stack, D && d.stackGrid), v = E.map((M, B) => {
        var R;
        const {
          key: I,
          before: F,
          after: O
        } = M;
        return /* @__PURE__ */ i.jsxs("div", { className: d.inputRow, children: [
          l && F ? /* @__PURE__ */ i.jsx(L, { "data-testid": "text-prefix", className: d.fieldLabel, value: F }) : D && /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ i.jsx(ce, { id: I, ref: T(I), formula: (R = _[B]) != null ? R : "", onMathFieldChanged: $, className: d.input }),
          n && O ? /* @__PURE__ */ i.jsx(L, { "data-testid": "text-suffix", className: d.suffix, value: O }) : D && /* @__PURE__ */ i.jsx("span", { "aria-hidden": !0 })
        ] }, I);
      }), t[4] = o, t[5] = s, t[6] = C, t[7] = w, t[8] = f, t[9] = a, t[10] = x, t[11] = j, t[12] = r, t[13] = v, t[14] = u, t[15] = h, t[16] = b, t[17] = c;
    } else
      x = t[10], j = t[11], r = t[12], v = t[13], u = t[14], h = t[15], b = t[16], c = t[17];
    let g;
    t[29] !== x || t[30] !== j || t[31] !== r || t[32] !== v ? (g = /* @__PURE__ */ i.jsx("div", { "data-testid": x, "data-layout": j, className: r, children: v }), t[29] = x, t[30] = j, t[31] = r, t[32] = v, t[33] = g) : g = t[33];
    let m;
    return t[34] !== u || t[35] !== h || t[36] !== b || t[37] !== c || t[38] !== g ? (m = /* @__PURE__ */ i.jsxs("div", { className: u, "data-template-id": h, children: [
      b,
      c,
      g
    ] }), t[34] = u, t[35] = h, t[36] = b, t[37] = c, t[38] = g, t[39] = m) : m = t[39], m;
  };
  return y.displayName = p, (k) => {
    const t = H.c(3);
    let a;
    t[0] === Symbol.for("react.memo_cache_sentinel") ? (a = {
      from: null
    }, t[0] = a) : a = t[0];
    let s;
    return t[1] !== k ? (s = /* @__PURE__ */ i.jsx(ne, { value: a, children: /* @__PURE__ */ i.jsx(y, q({}, k)) }), t[1] = k, t[2] = s) : s = t[2], s;
  };
};
function je(p) {
  const {
    before: e
  } = p;
  return e;
}
const Ce = xe({
  id: "columnOperation.multi.stack.n2.before",
  layout: "stack",
  withBefore: !0
});
export {
  Ce as ColumnOperationMultiStackN2Before
};
