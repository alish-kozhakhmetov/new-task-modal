import { c as z, y as Q, z as O, j as n, a as D, b as U, d as F, M as W, e as X, A as Y, f as L, k as Z } from "./index-wRluoD-s.js";
import { s as f } from "./text-template.module-C6vBLKI6.js";
import { E as J } from "./equation-content-CiRYgAV9.js";
import { S as tt } from "./shared-solution-body-9WuuvhSD.js";
import { S as et } from "./solution-answer-panel-BnG30GAS.js";
const P = (A) => {
  var t, l;
  return Number((l = (t = /(\d+)$/.exec(A)) == null ? void 0 : t[1]) != null ? l : NaN);
}, K = (A, t) => {
  if (A == null || typeof A != "object") return [];
  const l = (s) => typeof s == "string" || typeof s == "object" && s !== null && "module_name" in s ? t(s) : "";
  return Object.entries(A).filter(([s]) => /^input\d+$/.test(s)).sort(([s], [w]) => P(s) - P(w)).map(([s, w]) => {
    const k = w != null ? w : {};
    return {
      key: s,
      before: l(k.before),
      after: l(k.after)
    };
  });
}, st = (A) => {
  const t = z.c(50), {
    task: l,
    deps: s,
    answer: w,
    solution: k,
    layout: S,
    withBefore: e,
    withAfter: a
  } = A, i = e === void 0 ? !1 : e, d = a === void 0 ? !1 : a, y = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let M;
  t[0] !== s.global ? (M = (q) => s.global.translateTasks(q), t[0] = s.global, t[1] = M) : M = t[1];
  const g = M;
  let r, c, m, j, x, b, u, o;
  if (t[2] !== w || t[3] !== s || t[4] !== S || t[5] !== y || t[6] !== k || t[7] !== l.answerInput || t[8] !== l.description || t[9] !== l.title || t[10] !== g || t[11] !== d || t[12] !== i) {
    const q = Q(k, y, g), H = O(w, y), V = K(l.answerInput, g);
    u = f.container, t[21] !== s || t[22] !== l.title ? (o = /* @__PURE__ */ n.jsx(D, { title: l.title, deps: s }), t[21] = s, t[22] = l.title, t[23] = o) : o = t[23], t[24] !== s || t[25] !== l.description ? (r = /* @__PURE__ */ n.jsx(J, { description: l.description, deps: s }), t[24] = s, t[25] = l.description, t[26] = r) : r = t[26];
    const T = H.join(" ; "), v = U(q);
    t[27] !== s || t[28] !== T || t[29] !== v ? (c = /* @__PURE__ */ n.jsx(et, { userAnswer: T, correctAnswer: v, deps: s }), t[27] = s, t[28] = T, t[29] = v, t[30] = c) : c = t[30], m = "equation-inputs", j = S, x = S === "inline" ? f.inline : f.stack;
    let _;
    t[31] !== q || t[32] !== d || t[33] !== i ? (_ = (E, B) => {
      var $;
      const {
        key: I,
        before: C,
        after: R
      } = E;
      return /* @__PURE__ */ n.jsxs("div", { className: `${f.inputRow} ${f.solutionRow}`, children: [
        i && C ? /* @__PURE__ */ n.jsx(F, { "data-testid": "equation-before", className: f.fieldLabel, value: C }) : null,
        /* @__PURE__ */ n.jsx(W, { className: f.answerFormula, children: ($ = q[B]) != null ? $ : "" }),
        d && R ? /* @__PURE__ */ n.jsx(F, { "data-testid": "equation-after", className: f.suffix, value: R }) : null
      ] }, I);
    }, t[31] = q, t[32] = d, t[33] = i, t[34] = _) : _ = t[34], b = V.map(_), t[2] = w, t[3] = s, t[4] = S, t[5] = y, t[6] = k, t[7] = l.answerInput, t[8] = l.description, t[9] = l.title, t[10] = g, t[11] = d, t[12] = i, t[13] = r, t[14] = c, t[15] = m, t[16] = j, t[17] = x, t[18] = b, t[19] = u, t[20] = o;
  } else
    r = t[13], c = t[14], m = t[15], j = t[16], x = t[17], b = t[18], u = t[19], o = t[20];
  let h;
  t[35] !== m || t[36] !== j || t[37] !== x || t[38] !== b ? (h = /* @__PURE__ */ n.jsx("div", { "data-testid": m, "data-layout": j, className: x, children: b }), t[35] = m, t[36] = j, t[37] = x, t[38] = b, t[39] = h) : h = t[39];
  let N;
  t[40] !== s || t[41] !== k ? (N = /* @__PURE__ */ n.jsx(tt, { solution: k, deps: s }), t[40] = s, t[41] = k, t[42] = N) : N = t[42];
  let p;
  return t[43] !== r || t[44] !== c || t[45] !== h || t[46] !== N || t[47] !== u || t[48] !== o ? (p = /* @__PURE__ */ n.jsxs("div", { className: u, children: [
    o,
    r,
    c,
    h,
    N
  ] }), t[43] = r, t[44] = c, t[45] = h, t[46] = N, t[47] = u, t[48] = o, t[49] = p) : p = t[49], p;
}, lt = "_stackGrid_l6osj_1", at = "_row_l6osj_9", it = "_label_l6osj_13", nt = "_field_l6osj_18", G = {
  stackGrid: lt,
  row: at,
  label: it,
  field: nt
}, pt = ({
  id: A,
  layout: t,
  inputCount: l,
  withBefore: s = !1,
  withAfter: w = !1
}) => {
  const k = (S) => {
    const e = z.c(42), {
      task: a,
      deps: i,
      answer: d,
      onChange: y,
      mathInput: M
    } = S;
    if (X(a.solution)) {
      let p;
      return e[0] !== d || e[1] !== i || e[2] !== a ? (p = /* @__PURE__ */ n.jsx(st, { task: a, deps: i, answer: d, solution: a.solution, layout: t, withBefore: s, withAfter: w }), e[0] = d, e[1] = i, e[2] = a, e[3] = p) : p = e[3], p;
    }
    const g = i.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let r, c, m, j, x, b, u, o;
    if (e[4] !== d || e[5] !== i || e[6] !== M || e[7] !== y || e[8] !== g || e[9] !== a.answerInput || e[10] !== a.description || e[11] !== a.title) {
      let p;
      e[20] !== i.global ? (p = (E) => i.global.translateTasks(E), e[20] = i.global, e[21] = p) : p = e[21];
      const q = K(a.answerInput, p), {
        bindRef: H,
        handleChange: V
      } = Y({
        onChange: y,
        separator: g,
        mathInput: M,
        inputCount: q.length || l
      });
      let T;
      e[22] !== d || e[23] !== g ? (T = O(d, g), e[22] = d, e[23] = g, e[24] = T) : T = e[24];
      const v = T, _ = t === "stack";
      x = f.container, b = A, e[25] !== i || e[26] !== a.title ? (u = /* @__PURE__ */ n.jsx(D, { title: a.title, deps: i }), e[25] = i, e[26] = a.title, e[27] = u) : u = e[27], e[28] !== i || e[29] !== a.description ? (o = /* @__PURE__ */ n.jsx(J, { description: a.description, deps: i }), e[28] = i, e[29] = a.description, e[30] = o) : o = e[30], r = "equation-inputs", c = t, m = _ ? G.stackGrid : f.inline, j = q.map((E, B) => {
        var $;
        const {
          key: I,
          before: C,
          after: R
        } = E;
        return /* @__PURE__ */ n.jsxs("div", { className: L(f.inputRow, _ && G.row), children: [
          s && C ? /* @__PURE__ */ n.jsx(F, { "data-testid": "equation-before", className: L(f.fieldLabel, _ && G.label), value: C }) : _ && /* @__PURE__ */ n.jsx("span", { "aria-hidden": !0 }),
          /* @__PURE__ */ n.jsx(Z, { id: I, ref: H(I), formula: ($ = v[B]) != null ? $ : "", onMathFieldChanged: V, className: L(f.input, _ && G.field) }),
          w && R ? /* @__PURE__ */ n.jsx(F, { "data-testid": "equation-after", className: f.suffix, value: R }) : _ && /* @__PURE__ */ n.jsx("span", { "aria-hidden": !0 })
        ] }, I);
      }), e[4] = d, e[5] = i, e[6] = M, e[7] = y, e[8] = g, e[9] = a.answerInput, e[10] = a.description, e[11] = a.title, e[12] = r, e[13] = c, e[14] = m, e[15] = j, e[16] = x, e[17] = b, e[18] = u, e[19] = o;
    } else
      r = e[12], c = e[13], m = e[14], j = e[15], x = e[16], b = e[17], u = e[18], o = e[19];
    let h;
    e[31] !== r || e[32] !== c || e[33] !== m || e[34] !== j ? (h = /* @__PURE__ */ n.jsx("div", { "data-testid": r, "data-layout": c, className: m, children: j }), e[31] = r, e[32] = c, e[33] = m, e[34] = j, e[35] = h) : h = e[35];
    let N;
    return e[36] !== x || e[37] !== b || e[38] !== u || e[39] !== o || e[40] !== h ? (N = /* @__PURE__ */ n.jsxs("div", { className: x, "data-template-id": b, children: [
      u,
      o,
      h
    ] }), e[36] = x, e[37] = b, e[38] = u, e[39] = o, e[40] = h, e[41] = N) : N = e[41], N;
  };
  return k.displayName = A, k;
};
export {
  pt as c
};
