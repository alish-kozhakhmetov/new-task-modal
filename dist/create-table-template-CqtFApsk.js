import { q as D, G as n, j as l, a as _, k as X, l as q, b as Z, r as J, H as T, c as z, w as L, e as K, m as Q, h as Y } from "./index-MpD7fYY7.js";
import { S as I, T as U } from "./shared-solution-description-aJV9eqz0.js";
import { a as $, S as tt } from "./solution-answer-panel-D-PEbkii.js";
const F = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), et = F, lt = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), st = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function G(t) {
  const {
    id: e,
    mode: s,
    removeBorders: a,
    removePadding: i
  } = t;
  return D(n.table, a && n.tableRemoveBorders, i && n.tableRemovePadding, e === "table.plain" && a && !i && n.equationStretch, F.has(e) && n.tableRounded, e === "table.inline" && s === "input" && n.tableFlexInlineInput, e === "table.mixed" && s === "solution" && n.tableFlexMixedSolution, e === "table.mixed" && s === "input" && n.tableFlexMixedInput, e === "table.list" && s === "input" && n.tableFlexListInput, e === "table.list" && s === "solution" && n.tableFlexListSolution);
}
function V(t) {
  const {
    id: e,
    mode: s,
    isInput: a,
    isFirstCell: i,
    isLastCell: r,
    isHeaderRow: h,
    isLastRow: u
  } = t;
  return D(n.cell, a && n.inputCell, a && !st.has(e) && n.inputCellDefaultWidth, h && n.cellHeader, F.has(e) && u && n.cellNoBottomBorder, et.has(e) && i && !a && n.cellFirstColLabel, e === "table.inline" && s === "solution" && n.cellInlineSolution, e === "table.inline" && s === "input" && n.cellInlineInput, e === "table.inline" && s === "input" && a && n.inputCellInlineInput, e === "table.mixed" && s === "solution" && n.cellMixedSolution, e === "table.mixed" && s === "input" && n.cellMixedInput, e === "table.list" && s === "input" && r && n.cellListLastInput, e === "table.list" && s === "solution" && r && n.cellListLastSolution, e === "table.list" && s === "input" && a && n.inputCellListInput, e === "table.list" && s === "solution" && a && n.inputCellListSolution, e === "table.plain" && s === "solution" && a && n.inputCellPlainSolution);
}
function k(t) {
  const {
    id: e,
    mode: s
  } = t;
  return D(n.input, s === "solution" && lt.has(e) && n.inputWidthAuto);
}
const nt = ({
  task: t,
  deps: e,
  answer: s,
  solution: a,
  templateId: i
}) => {
  const r = t.description.table;
  if (!r)
    return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(_, { title: t.title, deps: e }),
      /* @__PURE__ */ l.jsx(I, { task: t, deps: e }),
      /* @__PURE__ */ l.jsx($, { solution: a, deps: e })
    ] });
  const h = e.helpers.TaskHelper.multipleTaskAnswerSeparator, d = X(a, h, (m) => e.global.translateTasks(m)), p = q(s, h);
  let c = 0;
  return /* @__PURE__ */ l.jsxs("div", { className: n.container, "data-template-id": i, "data-mode": "solution", children: [
    /* @__PURE__ */ l.jsx(_, { title: t.title, deps: e }),
    /* @__PURE__ */ l.jsx(I, { task: t, deps: e }),
    /* @__PURE__ */ l.jsx(tt, { userAnswer: p.join(" ; "), correctAnswer: Z(d), deps: e }),
    /* @__PURE__ */ l.jsx("div", { className: n.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { className: G({
      id: i != null ? i : "table.plain",
      mode: "solution",
      removeBorders: r.removeBorders,
      removePadding: r.removePadding
    }), style: {
      width: i === "table.mixed" ? "100%" : r.width
    }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: r.rows.map((m, x) => /* @__PURE__ */ l.jsx("tr", { children: m.cells.map((j, g) => {
      var S, C, R;
      const v = j === "answercell", b = typeof j == "string" ? j : e.global.translateTasks(j), w = v ? c++ : -1, A = i === "table.grid" ? x < r.rows.length - 1 : i === "table.multiRow" || i === "table.multiRowSvg" ? x === 0 : !1;
      return /* @__PURE__ */ l.jsx("td", { className: V({
        id: i != null ? i : "table.plain",
        mode: "solution",
        isInput: v,
        isFirstCell: g === 0,
        isLastCell: g === m.cells.length - 1,
        isHeaderRow: A,
        isLastRow: x === r.rows.length - 1
      }), colSpan: ((S = m.colspan_list) == null ? void 0 : S[g]) || 1, rowSpan: ((C = m.rowspan_list) == null ? void 0 : C[g]) || 1, children: v ? /* @__PURE__ */ l.jsx(J, { className: k({
        id: i != null ? i : "table.plain",
        mode: "solution"
      }), children: (R = d[w]) != null ? R : "" }) : /* @__PURE__ */ l.jsx(T, { content: b }) }, g);
    }) }, x)) }) }) }),
    /* @__PURE__ */ l.jsx($, { solution: a, deps: e })
  ] });
}, it = (t) => {
  const e = z.c(3), s = L.useRef(null);
  let a, i;
  return e[0] !== t ? (a = () => {
    var p;
    const r = s.current;
    if (!t || !r)
      return;
    const h = () => {
      for (const c of Array.from(r.querySelectorAll("tr"))) {
        c.removeAttribute("data-wrap"), c.style.removeProperty("--group-width");
        const m = Array.from(c.querySelectorAll(":scope > [data-group]")), x = m.filter(at), j = x.length ? x : m;
        if (m.length < 2 || c.scrollWidth <= c.clientWidth + 1)
          continue;
        const g = Math.min(c.clientWidth, Math.ceil(Math.max(...j.map(ot))));
        c.style.setProperty("--group-width", `${g}px`), c.setAttribute("data-wrap", "");
      }
    };
    h(), (p = document.fonts) == null || p.ready.then(h);
    let u = r.getBoundingClientRect().width;
    const d = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(() => {
      const c = r.getBoundingClientRect().width;
      Math.abs(c - u) < 1 || (u = c, h());
    });
    return d == null || d.observe(r), () => d == null ? void 0 : d.disconnect();
  }, i = [t], e[0] = t, e[1] = a, e[2] = i) : (a = e[1], i = e[2]), L.useLayoutEffect(a, i), s;
};
function at(t) {
  return t.dataset.group === "glued";
}
function ot(t) {
  return t.getBoundingClientRect().width;
}
const rt = () => {
  const t = z.c(4), e = L.useRef(null), [s, a] = L.useState(!1);
  let i, r;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (i = () => {
    const u = e.current;
    if (!u)
      return;
    const d = () => a(u.scrollLeft + u.clientWidth < u.scrollWidth - 1);
    d(), u.addEventListener("scroll", d, {
      passive: !0
    });
    const p = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(d);
    return p == null || p.observe(u), u.firstElementChild && (p == null || p.observe(u.firstElementChild)), () => {
      u.removeEventListener("scroll", d), p == null || p.disconnect();
    };
  }, r = [], t[0] = i, t[1] = r) : (i = t[0], r = t[1]), L.useEffect(i, r);
  let h;
  return t[2] !== s ? (h = {
    ref: e,
    hiddenRight: s
  }, t[2] = s, t[3] = h) : h = t[3], h;
}, B = /* @__PURE__ */ new Set(["table.inline", "table.mixed"]), pt = ({
  id: t
}) => {
  const e = ({
    task: s,
    deps: a,
    answer: i,
    onChange: r,
    mathInput: h
  }) => {
    const {
      ref: u,
      hiddenRight: d
    } = rt(), p = it(B.has(t));
    if (K(s.solution))
      return /* @__PURE__ */ l.jsx(nt, { task: s, deps: a, answer: i, solution: s.solution, templateId: t });
    const c = s.description.table;
    if (!c)
      return /* @__PURE__ */ l.jsxs("div", { className: n.container, "data-template-id": t, "data-mode": "input", children: [
        /* @__PURE__ */ l.jsx(_, { title: s.title, deps: a }),
        /* @__PURE__ */ l.jsx(U, { task: s, deps: a })
      ] });
    const m = a.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: x,
      handleChange: j
    } = Q({
      onChange: r,
      separator: m,
      mathInput: h
    }), g = q(i, m);
    let v = 0;
    return /* @__PURE__ */ l.jsxs("div", { className: n.container, "data-template-id": t, "data-mode": "input", children: [
      /* @__PURE__ */ l.jsx(_, { title: s.title, deps: a }),
      /* @__PURE__ */ l.jsx(U, { task: s, deps: a }),
      /* @__PURE__ */ l.jsx("div", { className: n.tableFrame, "data-hidden-right": d || void 0, children: /* @__PURE__ */ l.jsx("div", { ref: u, className: n.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { ref: p, className: G({
        id: t,
        mode: "input",
        removeBorders: c.removeBorders,
        removePadding: c.removePadding
      }), style: {
        width: t === "table.list" || t === "table.mixed" || t === "table.inline" ? "100%" : c.width
      }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: c.rows.map((b, w) => {
        var H, O;
        const A = t === "table.grid" ? w < c.rows.length - 1 : t === "table.multiRow" || t === "table.multiRowSvg" ? w === 0 : !1, S = (o, f) => V({
          id: t,
          mode: "input",
          isInput: f,
          isFirstCell: o === 0,
          isLastCell: o === b.cells.length - 1,
          isHeaderRow: A,
          isLastRow: w === c.rows.length - 1
        }), C = () => {
          var f;
          const o = v++;
          return /* @__PURE__ */ l.jsx(Y, { id: `table-input-${o}`, ref: x(`table-input-${o}`), formula: (f = g[o]) != null ? f : "", onMathFieldChanged: j, className: k({
            id: t,
            mode: "input"
          }) });
        }, R = (o) => typeof o == "string" ? o : a.global.translateTasks(o), N = [], W = B.has(t), M = b.cells.indexOf("answercell");
        let P = 0;
        W && M > 0 && (N.push(/* @__PURE__ */ l.jsx("td", { className: n.cellLead, children: b.cells.slice(0, M).map((o, f) => /* @__PURE__ */ l.jsx("span", { className: S(f, !1), children: /* @__PURE__ */ l.jsx(T, { content: R(o) }) }, f)) }, "lead")), P = M);
        for (let o = P; o < b.cells.length; o++) {
          const f = b.cells[o], y = f === "answercell", E = b.cells[o + 1];
          if (y && B.has(t) && E !== void 0 && E !== "answercell") {
            N.push(/* @__PURE__ */ l.jsxs("td", { className: n.cellGlued, "data-group": "glued", children: [
              /* @__PURE__ */ l.jsx("span", { className: S(o, !0), children: C() }),
              /* @__PURE__ */ l.jsx("span", { className: S(o + 1, !1), children: /* @__PURE__ */ l.jsx(T, { content: R(E) }) })
            ] }, o)), o++;
            continue;
          }
          N.push(/* @__PURE__ */ l.jsx("td", { className: S(o, y), colSpan: ((H = b.colspan_list) == null ? void 0 : H[o]) || 1, rowSpan: ((O = b.rowspan_list) == null ? void 0 : O[o]) || 1, "data-group": W && y ? "" : void 0, children: y ? C() : /* @__PURE__ */ l.jsx(T, { content: R(f) }) }, o));
        }
        return /* @__PURE__ */ l.jsx("tr", { children: N }, w);
      }) }) }) }) })
    ] });
  };
  return e.displayName = t, e;
};
export {
  pt as c
};
