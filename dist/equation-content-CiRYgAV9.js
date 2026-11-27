import { al as x, c as m, o as T, j as p } from "./index-wRluoD-s.js";
const E = "_container_reeri_1", b = "_content_reeri_7", d = "_inputWrapper_reeri_11", F = "_beforeText_reeri_18", R = "_afterText_reeri_19", y = "_input_reeri_11", g = "_inputFull_reeri_28", j = "_answerFormula_reeri_33", A = {
  container: E,
  content: b,
  inputWrapper: d,
  beforeText: F,
  afterText: R,
  input: y,
  inputFull: g,
  answerFormula: j
}, S = /\\[a-zA-Z]+|[\^_]/, h = /[·⋅]/g, q = (e) => {
  const t = e.trim();
  return !t || x.test(t) || !S.test(t) ? e : `\\(${t.replace(h, "\\times ")}\\)`;
}, M = (e) => {
  const t = m.c(14), {
    description: c,
    deps: _
  } = e, f = _.global;
  let r, n, o, s, i;
  if (t[0] !== _.global || t[1] !== c.content) {
    i = Symbol.for("react.early_return_sentinel");
    t: {
      const u = f.translateTasks(c.content);
      if (!u.trim()) {
        i = null;
        break t;
      }
      o = A.content, s = "equation-content", r = T, n = q(u);
    }
    t[0] = _.global, t[1] = c.content, t[2] = r, t[3] = n, t[4] = o, t[5] = s, t[6] = i;
  } else
    r = t[2], n = t[3], o = t[4], s = t[5], i = t[6];
  if (i !== Symbol.for("react.early_return_sentinel"))
    return i;
  let a;
  t[7] !== r || t[8] !== n ? (a = /* @__PURE__ */ p.jsx(r, { children: n }), t[7] = r, t[8] = n, t[9] = a) : a = t[9];
  let l;
  return t[10] !== o || t[11] !== s || t[12] !== a ? (l = /* @__PURE__ */ p.jsx("div", { className: o, "data-testid": s, children: a }), t[10] = o, t[11] = s, t[12] = a, t[13] = l) : l = t[13], l;
};
export {
  M as E,
  A as s
};
