var Q = Object.defineProperty;
var H = Object.getOwnPropertySymbols;
var W = Object.prototype.hasOwnProperty, X = Object.prototype.propertyIsEnumerable;
var P = (p, e, i) => e in p ? Q(p, e, { enumerable: !0, configurable: !0, writable: !0, value: i }) : p[e] = i, V = (p, e) => {
  for (var i in e || (e = {}))
    W.call(e, i) && P(p, i, e[i]);
  if (H)
    for (var i of H(e))
      X.call(e, i) && P(p, i, e[i]);
  return p;
};
import { c as _, l as Y, m as U, q as Z, A as ee, B as te, D as se, j as l, a as z, L as ae, E as J, b as le, F as d, d as I, M as ie, G as ne, e as oe, n as re, f as ue, k as ce } from "./index-BltXZALQ.js";
import { g as K } from "./get-inline-input-entries-CGVm7T7Q.js";
import { h as de } from "./label-column-C240-oSs.js";
import { S as pe, a as me } from "./solution-answer-panel-CPZq6kDL.js";
const fe = (p) => {
  const e = _.c(43), {
    task: i,
    deps: n,
    answer: y,
    solution: A,
    layout: k
  } = p, t = n.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let a;
  e[0] !== n.global ? (a = (m) => n.global.translateTasks(m), e[0] = n.global, e[1] = a) : a = e[1];
  const s = a;
  let o, w, C, f, x, j, r, v, u;
  if (e[2] !== y || e[3] !== n || e[4] !== k || e[5] !== t || e[6] !== A || e[7] !== i || e[8] !== s) {
    const m = Y(A, t, s), T = U(y, t), L = K(i, s), N = Z(i, n), D = !!(N && ee(N)) && N ? te(N, {
      quotient: m[0] || void 0
    }) : null;
    o = D ? se(D) : null, j = d.container, e[18] !== n || e[19] !== i.title ? (r = /* @__PURE__ */ l.jsx(z, { title: i.title, deps: n }), e[18] = n, e[19] = i.title, e[20] = r) : r = e[20], v = o ? /* @__PURE__ */ l.jsx(ae, { dividend: o.dividend, divisor: o.divisor }) : /* @__PURE__ */ l.jsx(J, { task: i, deps: n, quotient: m[0] || void 0, remainder: m[1] || void 0 });
    const E = T.join(" ; "), S = le(m);
    e[21] !== n || e[22] !== E || e[23] !== S ? (u = /* @__PURE__ */ l.jsx(pe, { userAnswer: E, correctAnswer: S, deps: n }), e[21] = n, e[22] = E, e[23] = S, e[24] = u) : u = e[24], w = "text-inputs", C = k, f = k === "inline" ? d.inline : d.stack;
    let M;
    e[25] !== m ? (M = ($, O) => {
      var G;
      const {
        key: F,
        before: R,
        after: B
      } = $;
      return /* @__PURE__ */ l.jsxs("div", { className: `${d.inputRow} ${d.solutionRow}`, children: [
        R && /* @__PURE__ */ l.jsx(I, { "data-testid": "text-prefix", className: d.fieldLabel, value: R }),
        /* @__PURE__ */ l.jsx(ie, { className: d.answerFormula, children: (G = m[O]) != null ? G : "" }),
        B && /* @__PURE__ */ l.jsx(I, { "data-testid": "text-suffix", className: d.suffix, value: B })
      ] }, F);
    }, e[25] = m, e[26] = M) : M = e[26], x = L.map(M), e[2] = y, e[3] = n, e[4] = k, e[5] = t, e[6] = A, e[7] = i, e[8] = s, e[9] = o, e[10] = w, e[11] = C, e[12] = f, e[13] = x, e[14] = j, e[15] = r, e[16] = v, e[17] = u;
  } else
    o = e[9], w = e[10], C = e[11], f = e[12], x = e[13], j = e[14], r = e[15], v = e[16], u = e[17];
  let h;
  e[27] !== w || e[28] !== C || e[29] !== f || e[30] !== x ? (h = /* @__PURE__ */ l.jsx("div", { "data-testid": w, "data-layout": C, className: f, children: x }), e[27] = w, e[28] = C, e[29] = f, e[30] = x, e[31] = h) : h = e[31];
  const b = !!o;
  let c;
  e[32] !== n || e[33] !== A || e[34] !== b ? (c = /* @__PURE__ */ l.jsx(me, { solution: A, deps: n, suppressFreeTextContent: b }), e[32] = n, e[33] = A, e[34] = b, e[35] = c) : c = e[35];
  let g;
  return e[36] !== h || e[37] !== c || e[38] !== j || e[39] !== r || e[40] !== v || e[41] !== u ? (g = /* @__PURE__ */ l.jsxs("div", { className: j, children: [
    r,
    v,
    u,
    h,
    c
  ] }), e[36] = h, e[37] = c, e[38] = j, e[39] = r, e[40] = v, e[41] = u, e[42] = g) : g = e[42], g;
}, xe = ({
  id: p,
  layout: e,
  withBefore: i = !1,
  withAfter: n = !1
}) => {
  const y = (k) => {
    const t = _.c(40), {
      task: a,
      deps: s,
      answer: o,
      onChange: w,
      mathInput: C
    } = k;
    if (oe(a.solution)) {
      let T;
      return t[0] !== o || t[1] !== s || t[2] !== a ? (T = /* @__PURE__ */ l.jsx(fe, { task: a, deps: s, answer: o, solution: a.solution, layout: e }), t[0] = o, t[1] = s, t[2] = a, t[3] = T) : T = t[3], T;
    }
    const f = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let x, j, r, v, u, h, b, c;
    if (t[4] !== o || t[5] !== s || t[6] !== C || t[7] !== w || t[8] !== f || t[9] !== a) {
      const {
        bindRef: T,
        handleChange: L
      } = re({
        onChange: w,
        separator: f,
        mathInput: C
      });
      let N;
      t[18] !== o || t[19] !== f ? (N = U(o, f), t[18] = o, t[19] = f, t[20] = N) : N = t[20];
      const q = N;
      let D;
      t[21] !== s.global ? (D = (M) => s.global.translateTasks(M), t[21] = s.global, t[22] = D) : D = t[22];
      const E = K(a, D), S = de(e, i, E.map(je));
      u = d.container, h = p, t[23] !== s || t[24] !== a.title ? (b = /* @__PURE__ */ l.jsx(z, { title: a.title, deps: s }), t[23] = s, t[24] = a.title, t[25] = b) : b = t[25], t[26] !== s || t[27] !== a ? (c = /* @__PURE__ */ l.jsx(J, { task: a, deps: s }), t[26] = s, t[27] = a, t[28] = c) : c = t[28], x = "text-inputs", j = e, r = ue(d.stack, S && d.stackGrid), v = E.map((M, $) => {
        var B;
        const {
          key: O,
          before: F,
          after: R
        } = M;
        return /* @__PURE__ */ l.jsxs("div", { className: d.inputRow, children: [
          i && F ? /* @__PURE__ */ l.jsx(I, { "data-testid": "text-prefix", className: d.fieldLabel, value: F }) : S && /* @__PURE__ */ l.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ l.jsx(ce, { id: O, ref: T(O), formula: (B = q[$]) != null ? B : "", onMathFieldChanged: L, className: d.input }),
          n && R ? /* @__PURE__ */ l.jsx(I, { "data-testid": "text-suffix", className: d.suffix, value: R }) : S && /* @__PURE__ */ l.jsx("span", { "aria-hidden": !0 })
        ] }, O);
      }), t[4] = o, t[5] = s, t[6] = C, t[7] = w, t[8] = f, t[9] = a, t[10] = x, t[11] = j, t[12] = r, t[13] = v, t[14] = u, t[15] = h, t[16] = b, t[17] = c;
    } else
      x = t[10], j = t[11], r = t[12], v = t[13], u = t[14], h = t[15], b = t[16], c = t[17];
    let g;
    t[29] !== x || t[30] !== j || t[31] !== r || t[32] !== v ? (g = /* @__PURE__ */ l.jsx("div", { "data-testid": x, "data-layout": j, className: r, children: v }), t[29] = x, t[30] = j, t[31] = r, t[32] = v, t[33] = g) : g = t[33];
    let m;
    return t[34] !== u || t[35] !== h || t[36] !== b || t[37] !== c || t[38] !== g ? (m = /* @__PURE__ */ l.jsxs("div", { className: u, "data-template-id": h, children: [
      b,
      c,
      g
    ] }), t[34] = u, t[35] = h, t[36] = b, t[37] = c, t[38] = g, t[39] = m) : m = t[39], m;
  };
  return y.displayName = p, (k) => {
    const t = _.c(3);
    let a;
    t[0] === Symbol.for("react.memo_cache_sentinel") ? (a = {
      from: null
    }, t[0] = a) : a = t[0];
    let s;
    return t[1] !== k ? (s = /* @__PURE__ */ l.jsx(ne, { value: a, children: /* @__PURE__ */ l.jsx(y, V({}, k)) }), t[1] = k, t[2] = s) : s = t[2], s;
  };
};
function je(p) {
  const {
    before: e
  } = p;
  return e;
}
const we = xe({
  id: "columnOperation.multi.stack.n2.before",
  layout: "stack",
  withBefore: !0
});
export {
  we as ColumnOperationMultiStackN2Before
};
