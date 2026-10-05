import { f as D, G as s, j as l, a as _, l as X, m as U, b as J, r as K, H as T, c as q, w as N, e as Q, n as Y, k as tt } from "./index-Bs5_BBVa.js";
import { S as I, T as $ } from "./shared-solution-description-ZPag1ZMA.js";
import { a as z, S as et } from "./solution-answer-panel-BwXDdbp5.js";
const A = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), lt = A, st = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), nt = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function G(t) {
  const {
    id: e,
    mode: n,
    removeBorders: a,
    removePadding: i
  } = t;
  return D(s.table, a && s.tableRemoveBorders, i && s.tableRemovePadding, e === "table.plain" && a && !i && s.equationStretch, A.has(e) && s.tableRounded, e === "table.inline" && n === "input" && s.tableFlexInlineInput, e === "table.mixed" && n === "solution" && s.tableFlexMixedSolution, e === "table.mixed" && n === "input" && s.tableFlexMixedInput, e === "table.list" && n === "input" && s.tableFlexListInput, e === "table.list" && n === "solution" && s.tableFlexListSolution);
}
const V = (t) => (t != null ? t : "").replace(/\\[,;:! ]/g, "").replace(/\\[()[\]]|\\[a-zA-Z]+|[{}$]/g, " ").trim(), it = (t) => new RegExp("\\p{L}{2,}", "u").test(V(t)), at = (t) => {
  const e = V(t);
  return e !== "" && /^[−+-]?[\d\s.,]+(?:\s*[₸%])?$/u.test(e);
};
function Z(t) {
  const {
    id: e,
    mode: n,
    isInput: a,
    isFirstCell: i,
    isLastCell: r,
    isHeaderRow: d,
    isLastRow: p,
    content: u
  } = t;
  return D(
    s.cell,
    a && s.inputCell,
    a && !nt.has(e) && s.inputCellDefaultWidth,
    d && s.cellHeader,
    A.has(e) && p && s.cellNoBottomBorder,
    // Row labels are bold only when they are words (rule 58): a first column
    // of numbers is data, not an axis.
    // The corner cell belongs to the header, never bold.
    lt.has(e) && i && !a && !d && (u === void 0 || it(u)) && s.cellFirstColLabel,
    // Numbers align right so places line up down a column (rule 59). Only in
    // the bordered data tables; the flex rows (inline/list/mixed) are
    // sentences, not columns.
    A.has(e) && e !== "table.grid" && !d && !a && at(u) && s.cellNum,
    e === "table.inline" && n === "solution" && s.cellInlineSolution,
    e === "table.inline" && n === "input" && s.cellInlineInput,
    e === "table.inline" && n === "input" && a && s.inputCellInlineInput,
    e === "table.mixed" && n === "solution" && s.cellMixedSolution,
    e === "table.mixed" && n === "input" && s.cellMixedInput,
    e === "table.list" && n === "input" && r && s.cellListLastInput,
    e === "table.list" && n === "solution" && r && s.cellListLastSolution,
    e === "table.list" && n === "input" && a && s.inputCellListInput,
    e === "table.list" && n === "solution" && a && s.inputCellListSolution,
    e === "table.plain" && n === "solution" && a && s.inputCellPlainSolution
  );
}
function k(t) {
  const {
    id: e,
    mode: n
  } = t;
  return D(s.input, n === "solution" && st.has(e) && s.inputWidthAuto);
}
const ot = ({
  task: t,
  deps: e,
  answer: n,
  solution: a,
  templateId: i
}) => {
  const r = t.description.table;
  if (!r)
    return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(_, { title: t.title, deps: e }),
      /* @__PURE__ */ l.jsx(I, { task: t, deps: e }),
      /* @__PURE__ */ l.jsx(z, { solution: a, deps: e })
    ] });
  const d = e.helpers.TaskHelper.multipleTaskAnswerSeparator, u = X(a, d, (m) => e.global.translateTasks(m)), h = U(n, d);
  let c = 0;
  return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": i, "data-mode": "solution", children: [
    /* @__PURE__ */ l.jsx(_, { title: t.title, deps: e }),
    /* @__PURE__ */ l.jsx(I, { task: t, deps: e }),
    /* @__PURE__ */ l.jsx(et, { userAnswer: h.join(" ; "), correctAnswer: J(u), deps: e }),
    /* @__PURE__ */ l.jsx("div", { className: s.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { className: G({
      id: i != null ? i : "table.plain",
      mode: "solution",
      removeBorders: r.removeBorders,
      removePadding: r.removePadding
    }), style: {
      width: i === "table.mixed" ? "100%" : r.width
    }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: r.rows.map((m, x) => /* @__PURE__ */ l.jsx("tr", { children: m.cells.map((j, g) => {
      var S, L, w;
      const v = j === "answercell", b = typeof j == "string" ? j : e.global.translateTasks(j), C = v ? c++ : -1, M = i === "table.grid" ? x < r.rows.length - 1 : i === "table.multiRow" || i === "table.multiRowSvg" ? x === 0 : !1;
      return /* @__PURE__ */ l.jsx("td", { className: Z({
        id: i != null ? i : "table.plain",
        mode: "solution",
        isInput: v,
        isFirstCell: g === 0,
        isLastCell: g === m.cells.length - 1,
        isHeaderRow: M,
        isLastRow: x === r.rows.length - 1,
        content: v ? void 0 : b
      }), colSpan: ((S = m.colspan_list) == null ? void 0 : S[g]) || 1, rowSpan: ((L = m.rowspan_list) == null ? void 0 : L[g]) || 1, children: v ? /* @__PURE__ */ l.jsx(K, { className: k({
        id: i != null ? i : "table.plain",
        mode: "solution"
      }), children: (w = u[C]) != null ? w : "" }) : /* @__PURE__ */ l.jsx(T, { content: b }) }, g);
    }) }, x)) }) }) }),
    /* @__PURE__ */ l.jsx(z, { solution: a, deps: e })
  ] });
}, rt = (t) => {
  const e = q.c(3), n = N.useRef(null);
  let a, i;
  return e[0] !== t ? (a = () => {
    var h;
    const r = n.current;
    if (!t || !r)
      return;
    const d = () => {
      for (const c of Array.from(r.querySelectorAll("tr"))) {
        c.removeAttribute("data-wrap"), c.style.removeProperty("--group-width");
        const m = Array.from(c.querySelectorAll(":scope > [data-group]")), x = m.filter(ct), j = x.length ? x : m;
        if (m.length < 2 || c.scrollWidth <= c.clientWidth + 1)
          continue;
        const g = Math.min(c.clientWidth, Math.ceil(Math.max(...j.map(ut))));
        c.style.setProperty("--group-width", `${g}px`), c.setAttribute("data-wrap", "");
      }
    };
    d(), (h = document.fonts) == null || h.ready.then(d);
    let p = r.getBoundingClientRect().width;
    const u = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(() => {
      const c = r.getBoundingClientRect().width;
      Math.abs(c - p) < 1 || (p = c, d());
    });
    return u == null || u.observe(r), () => u == null ? void 0 : u.disconnect();
  }, i = [t], e[0] = t, e[1] = a, e[2] = i) : (a = e[1], i = e[2]), N.useLayoutEffect(a, i), n;
};
function ct(t) {
  return t.dataset.group === "glued";
}
function ut(t) {
  return t.getBoundingClientRect().width;
}
const dt = () => {
  const t = q.c(4), e = N.useRef(null), [n, a] = N.useState(!1);
  let i, r;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (i = () => {
    const p = e.current;
    if (!p)
      return;
    const u = () => a(p.scrollLeft + p.clientWidth < p.scrollWidth - 1);
    u(), p.addEventListener("scroll", u, {
      passive: !0
    });
    const h = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(u);
    return h == null || h.observe(p), p.firstElementChild && (h == null || h.observe(p.firstElementChild)), () => {
      p.removeEventListener("scroll", u), h == null || h.disconnect();
    };
  }, r = [], t[0] = i, t[1] = r) : (i = t[0], r = t[1]), N.useEffect(i, r);
  let d;
  return t[2] !== n ? (d = {
    ref: e,
    hiddenRight: n
  }, t[2] = n, t[3] = d) : d = t[3], d;
}, B = /* @__PURE__ */ new Set(["table.inline", "table.mixed"]), bt = ({
  id: t
}) => {
  const e = ({
    task: n,
    deps: a,
    answer: i,
    onChange: r,
    mathInput: d
  }) => {
    const {
      ref: p,
      hiddenRight: u
    } = dt(), h = rt(B.has(t));
    if (Q(n.solution))
      return /* @__PURE__ */ l.jsx(ot, { task: n, deps: a, answer: i, solution: n.solution, templateId: t });
    const c = n.description.table;
    if (!c)
      return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": t, "data-mode": "input", children: [
        /* @__PURE__ */ l.jsx(_, { title: n.title, deps: a }),
        /* @__PURE__ */ l.jsx($, { task: n, deps: a })
      ] });
    const m = a.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: x,
      handleChange: j
    } = Y({
      onChange: r,
      separator: m,
      mathInput: d
    }), g = U(i, m);
    let v = 0;
    return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": t, "data-mode": "input", children: [
      /* @__PURE__ */ l.jsx(_, { title: n.title, deps: a }),
      /* @__PURE__ */ l.jsx($, { task: n, deps: a }),
      /* @__PURE__ */ l.jsx("div", { className: s.tableFrame, "data-hidden-right": u || void 0, children: /* @__PURE__ */ l.jsx("div", { ref: p, className: s.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { ref: h, className: G({
        id: t,
        mode: "input",
        removeBorders: c.removeBorders,
        removePadding: c.removePadding
      }), style: {
        width: t === "table.list" || t === "table.mixed" || t === "table.inline" ? "100%" : c.width
      }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: c.rows.map((b, C) => {
        var H, O;
        const M = t === "table.grid" ? C < c.rows.length - 1 : t === "table.multiRow" || t === "table.multiRowSvg" ? C === 0 : !1, S = (o, f, R) => Z({
          content: R,
          id: t,
          mode: "input",
          isInput: f,
          isFirstCell: o === 0,
          isLastCell: o === b.cells.length - 1,
          isHeaderRow: M,
          isLastRow: C === c.rows.length - 1
        }), L = () => {
          var f;
          const o = v++;
          return /* @__PURE__ */ l.jsx(tt, { id: `table-input-${o}`, ref: x(`table-input-${o}`), formula: (f = g[o]) != null ? f : "", onMathFieldChanged: j, className: k({
            id: t,
            mode: "input"
          }) });
        }, w = (o) => typeof o == "string" ? o : a.global.translateTasks(o), y = [], F = B.has(t), E = b.cells.indexOf("answercell");
        let P = 0;
        F && E > 0 && (y.push(/* @__PURE__ */ l.jsx("td", { className: s.cellLead, children: b.cells.slice(0, E).map((o, f) => /* @__PURE__ */ l.jsx("span", { className: S(f, !1), children: /* @__PURE__ */ l.jsx(T, { content: w(o) }) }, f)) }, "lead")), P = E);
        for (let o = P; o < b.cells.length; o++) {
          const f = b.cells[o], R = f === "answercell", W = b.cells[o + 1];
          if (R && B.has(t) && W !== void 0 && W !== "answercell") {
            y.push(/* @__PURE__ */ l.jsxs("td", { className: s.cellGlued, "data-group": "glued", children: [
              /* @__PURE__ */ l.jsx("span", { className: S(o, !0), children: L() }),
              /* @__PURE__ */ l.jsx("span", { className: S(o + 1, !1), children: /* @__PURE__ */ l.jsx(T, { content: w(W) }) })
            ] }, o)), o++;
            continue;
          }
          y.push(/* @__PURE__ */ l.jsx("td", { className: S(o, R, R ? void 0 : w(f)), colSpan: ((H = b.colspan_list) == null ? void 0 : H[o]) || 1, rowSpan: ((O = b.rowspan_list) == null ? void 0 : O[o]) || 1, "data-group": F && R ? "" : void 0, children: R ? L() : /* @__PURE__ */ l.jsx(T, { content: w(f) }) }, o));
        }
        return /* @__PURE__ */ l.jsx("tr", { children: y }, C);
      }) }) }) }) })
    ] });
  };
  return e.displayName = t, e;
};
export {
  bt as c
};
