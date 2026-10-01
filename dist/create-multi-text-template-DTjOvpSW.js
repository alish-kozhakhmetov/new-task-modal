import { c as X, k as Q, l as q, j as n, a as G, b as U, d as P, M as Y, e as Z, m as _, h as tt } from "./index-a5iklpqy.js";
import { g as J } from "./get-inline-input-entries-CGVm7T7Q.js";
import { S as et, a as st } from "./solution-answer-panel--AFzEw8s.js";
import { s as u, T as K, m as F } from "./text-template.module-woWNFiNK.js";
const at = 0.583, lt = 32, nt = 72, it = 560, rt = (S, t) => {
  var b;
  let f = "";
  for (const i of Object.values((b = S.fields) != null ? b : {})) {
    if (!(typeof i == "number" || typeof i == "string" && /^\d+$/.test(i))) continue;
    const y = String(i);
    y.length > f.length && (f = y);
  }
  if (!f) return null;
  const s = f.length * t * at + lt;
  return Math.min(it, Math.max(nt, Math.round(s)));
}, ot = (S) => {
  const t = X.c(47), {
    task: f,
    deps: s,
    answer: b,
    solution: i,
    layout: v,
    normalizeBareMath: y
  } = S, e = y === void 0 ? !1 : y, a = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let l;
  t[0] !== s.global ? (l = (g) => s.global.translateTasks(g), t[0] = s.global, t[1] = l) : l = t[1];
  const d = l;
  let k, w, m, p, x, h, r, o;
  if (t[2] !== b || t[3] !== s || t[4] !== v || t[5] !== a || t[6] !== e || t[7] !== i || t[8] !== f || t[9] !== d) {
    const g = Q(i, a, d), B = q(b, a), N = J(f, d);
    h = u.container, t[18] !== s || t[19] !== f.title ? (r = /* @__PURE__ */ n.jsx(G, { title: f.title, deps: s }), t[18] = s, t[19] = f.title, t[20] = r) : r = t[20];
    const C = f;
    t[21] !== s || t[22] !== e || t[23] !== C ? (o = /* @__PURE__ */ n.jsx(K, { task: C, deps: s, normalizeBareMath: e }), t[21] = s, t[22] = e, t[23] = C, t[24] = o) : o = t[24];
    const A = B.join(" ; "), E = U(g);
    t[25] !== s || t[26] !== A || t[27] !== E ? (k = /* @__PURE__ */ n.jsx(et, { userAnswer: A, correctAnswer: E, deps: s }), t[25] = s, t[26] = A, t[27] = E, t[28] = k) : k = t[28], w = "text-inputs", m = v, p = v === "inline" ? u.inline : u.stack;
    let T;
    t[29] !== g || t[30] !== e ? (T = (V, R) => {
      var z;
      const {
        key: H,
        before: I,
        after: $
      } = V;
      return /* @__PURE__ */ n.jsxs("div", { className: `${u.inputRow} ${u.solutionRow}`, children: [
        I && /* @__PURE__ */ n.jsx(P, { "data-testid": "text-prefix", className: u.fieldLabel, value: F(I, e) }),
        /* @__PURE__ */ n.jsx(Y, { className: u.answerFormula, children: (z = g[R]) != null ? z : "" }),
        $ && /* @__PURE__ */ n.jsx(P, { "data-testid": "text-suffix", className: u.suffix, value: F($, e) })
      ] }, H);
    }, t[29] = g, t[30] = e, t[31] = T) : T = t[31], x = N.map(T), t[2] = b, t[3] = s, t[4] = v, t[5] = a, t[6] = e, t[7] = i, t[8] = f, t[9] = d, t[10] = k, t[11] = w, t[12] = m, t[13] = p, t[14] = x, t[15] = h, t[16] = r, t[17] = o;
  } else
    k = t[10], w = t[11], m = t[12], p = t[13], x = t[14], h = t[15], r = t[16], o = t[17];
  let j;
  t[32] !== w || t[33] !== m || t[34] !== p || t[35] !== x ? (j = /* @__PURE__ */ n.jsx("div", { "data-testid": w, "data-layout": m, className: p, children: x }), t[32] = w, t[33] = m, t[34] = p, t[35] = x, t[36] = j) : j = t[36];
  let c;
  t[37] !== s || t[38] !== i ? (c = /* @__PURE__ */ n.jsx(st, { solution: i, deps: s }), t[37] = s, t[38] = i, t[39] = c) : c = t[39];
  let M;
  return t[40] !== k || t[41] !== j || t[42] !== c || t[43] !== h || t[44] !== r || t[45] !== o ? (M = /* @__PURE__ */ n.jsxs("div", { className: h, children: [
    r,
    o,
    k,
    j,
    c
  ] }), t[40] = k, t[41] = j, t[42] = c, t[43] = h, t[44] = r, t[45] = o, t[46] = M) : M = t[46], M;
}, mt = ({
  id: S,
  layout: t,
  withBefore: f = !1,
  withAfter: s = !1,
  widthFromTask: b = !0,
  normalizeBareMath: i = !1
}) => {
  const v = (y) => {
    const e = X.c(42), {
      task: a,
      deps: l,
      answer: d,
      onChange: k,
      mathInput: w
    } = y;
    if (Z(a.solution)) {
      let N;
      return e[0] !== d || e[1] !== l || e[2] !== a ? (N = /* @__PURE__ */ n.jsx(ot, { task: a, deps: l, answer: d, solution: a.solution, layout: t, normalizeBareMath: i }), e[0] = d, e[1] = l, e[2] = a, e[3] = N) : N = e[3], N;
    }
    const m = l.helpers.TaskHelper.multipleTaskAnswerSeparator;
    let p, x, h, r, o, j, c, M;
    if (e[4] !== d || e[5] !== l || e[6] !== w || e[7] !== k || e[8] !== m || e[9] !== a) {
      const {
        bindRef: N,
        handleChange: C
      } = _({
        onChange: k,
        separator: m,
        mathInput: w
      });
      let A;
      e[18] !== d || e[19] !== m ? (A = q(d, m), e[18] = d, e[19] = m, e[20] = A) : A = e[20];
      const E = A;
      let T;
      e[21] !== l.global ? (T = ($) => l.global.translateTasks($), e[21] = l.global, e[22] = T) : T = e[22];
      const V = J(a, T);
      let R;
      e[23] !== a ? (R = b ? rt(a, 24) : null, e[23] = a, e[24] = R) : R = e[24];
      const H = R;
      o = u.container, j = S, e[25] !== l || e[26] !== a.title ? (c = /* @__PURE__ */ n.jsx(G, { title: a.title, deps: l }), e[25] = l, e[26] = a.title, e[27] = c) : c = e[27];
      const I = a;
      e[28] !== l || e[29] !== I ? (M = /* @__PURE__ */ n.jsx(K, { task: I, deps: l, normalizeBareMath: i }), e[28] = l, e[29] = I, e[30] = M) : M = e[30], p = "text-inputs", x = t, h = t === "inline" ? u.inline : u.stack, r = V.map(($, z) => {
        var O;
        const {
          key: D,
          before: L,
          after: W
        } = $;
        return /* @__PURE__ */ n.jsxs("div", { className: u.inputRow, children: [
          f && L && /* @__PURE__ */ n.jsx(P, { "data-testid": "text-prefix", className: u.fieldLabel, value: F(L, i) }),
          /* @__PURE__ */ n.jsx(tt, { id: D, ref: N(D), formula: (O = E[z]) != null ? O : "", onMathFieldChanged: C, className: u.input, style: H ? {
            flex: "none",
            minWidth: `min(${H}px, 100%)`
          } : void 0 }),
          s && W && /* @__PURE__ */ n.jsx(P, { "data-testid": "text-suffix", className: u.suffix, value: F(W, i) })
        ] }, D);
      }), e[4] = d, e[5] = l, e[6] = w, e[7] = k, e[8] = m, e[9] = a, e[10] = p, e[11] = x, e[12] = h, e[13] = r, e[14] = o, e[15] = j, e[16] = c, e[17] = M;
    } else
      p = e[10], x = e[11], h = e[12], r = e[13], o = e[14], j = e[15], c = e[16], M = e[17];
    let g;
    e[31] !== p || e[32] !== x || e[33] !== h || e[34] !== r ? (g = /* @__PURE__ */ n.jsx("div", { "data-testid": p, "data-layout": x, className: h, children: r }), e[31] = p, e[32] = x, e[33] = h, e[34] = r, e[35] = g) : g = e[35];
    let B;
    return e[36] !== o || e[37] !== j || e[38] !== c || e[39] !== M || e[40] !== g ? (B = /* @__PURE__ */ n.jsxs("div", { className: o, "data-template-id": j, children: [
      c,
      M,
      g
    ] }), e[36] = o, e[37] = j, e[38] = c, e[39] = M, e[40] = g, e[41] = B) : B = e[41], B;
  };
  return v.displayName = S, v;
};
export {
  mt as c
};
