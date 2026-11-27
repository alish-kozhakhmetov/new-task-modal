import { c as D, y as E, z as R, s as M, $ as _, j as A, a as $, Y as z, b as H, Z as N, a0 as U, a1 as Y, _ as Z } from "./index-wRluoD-s.js";
import { S as q } from "./shared-solution-body-9WuuvhSD.js";
import { S as F } from "./solution-answer-panel-BnG30GAS.js";
const O = (y) => {
  const t = D.c(45), {
    task: e,
    deps: s,
    answer: o,
    solution: a,
    withBefore: S,
    withAfter: k,
    multi: T,
    solutionAlignCenter: v
  } = y, I = S === void 0 ? !1 : S, p = k === void 0 ? !1 : k, n = T === void 0 ? !1 : T, h = v === void 0 ? !1 : v;
  let j;
  t[0] !== s.global ? (j = (m) => s.global.translateTasks(m), t[0] = s.global, t[1] = j) : j = t[1];
  const c = j, l = s.helpers.TaskHelper.multipleTaskAnswerSeparator;
  let u, w, r, i, f;
  if (t[2] !== o || t[3] !== s || t[4] !== n || t[5] !== l || t[6] !== a || t[7] !== h || t[8] !== e.answerInput || t[9] !== e.description || t[10] !== e.title || t[11] !== e.type || t[12] !== c || t[13] !== p || t[14] !== I) {
    const m = E(a, l, c);
    let C;
    t[20] !== o || t[21] !== n || t[22] !== l ? (C = n ? R(M(o), l).join(" ; ") : M(o), t[20] = o, t[21] = n, t[22] = l, t[23] = C) : C = t[23];
    const b = C, P = m.some(G);
    let g;
    t[24] !== n || t[25] !== e.answerInput || t[26] !== c || t[27] !== p ? (g = p && !n ? _(e.answerInput, c) : "", t[24] = n, t[25] = e.answerInput, t[26] = c, t[27] = p, t[28] = g) : g = t[28];
    const B = g;
    w = Z.container, t[29] !== s || t[30] !== e.title ? (r = /* @__PURE__ */ A.jsx($, { title: e.title, deps: s }), t[29] = s, t[30] = e.title, t[31] = r) : r = t[31], t[32] !== s || t[33] !== e.description ? (i = /* @__PURE__ */ A.jsx(z, { description: e.description, deps: s }), t[32] = s, t[33] = e.description, t[34] = i) : i = t[34], f = /* @__PURE__ */ A.jsx(F, { userAnswer: b, correctAnswer: H(m), unit: B, deps: s, alignCenter: h }), u = P ? /* @__PURE__ */ A.jsx(N, { description: e.description, answerInput: e.answerInput, deps: s, answer: U(m, l), mode: "solution", withBefore: I, withAfter: p, multi: n, taskType: e.type, solutionAlignCenter: h }) : null, t[2] = o, t[3] = s, t[4] = n, t[5] = l, t[6] = a, t[7] = h, t[8] = e.answerInput, t[9] = e.description, t[10] = e.title, t[11] = e.type, t[12] = c, t[13] = p, t[14] = I, t[15] = u, t[16] = w, t[17] = r, t[18] = i, t[19] = f;
  } else
    u = t[15], w = t[16], r = t[17], i = t[18], f = t[19];
  let d;
  t[35] !== s || t[36] !== a ? (d = /* @__PURE__ */ A.jsx(q, { solution: a, deps: s }), t[35] = s, t[36] = a, t[37] = d) : d = t[37];
  let x;
  return t[38] !== u || t[39] !== d || t[40] !== w || t[41] !== r || t[42] !== i || t[43] !== f ? (x = /* @__PURE__ */ A.jsxs("div", { className: w, children: [
    r,
    i,
    f,
    u,
    d
  ] }), t[38] = u, t[39] = d, t[40] = w, t[41] = r, t[42] = i, t[43] = f, t[44] = x) : x = t[44], x;
};
function G(y) {
  return !Y(y);
}
export {
  O as A
};
