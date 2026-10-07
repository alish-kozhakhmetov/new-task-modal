import { f as F, G as s, j as l, a as M, l as J, m as q, b as K, r as Q, H as A, c as G, w as L, e as Y, n as tt, k as et } from "./index-DwDfo0zf.js";
import { S as $, T as z } from "./shared-solution-description-2ItwXAUl.js";
import { a as U, S as lt } from "./solution-answer-panel-DNRF1AHT.js";
const E = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), st = E, nt = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), it = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function V(t) {
  const {
    id: e,
    mode: n,
    removeBorders: a,
    removePadding: i
  } = t;
  return F(s.table, a && s.tableRemoveBorders, i && s.tableRemovePadding, e === "table.plain" && a && !i && s.equationStretch, E.has(e) && s.tableRounded, e === "table.inline" && n === "input" && s.tableFlexInlineInput, e === "table.mixed" && n === "solution" && s.tableFlexMixedSolution, e === "table.mixed" && n === "input" && s.tableFlexMixedInput, e === "table.list" && n === "input" && s.tableFlexListInput, e === "table.list" && n === "solution" && s.tableFlexListSolution);
}
const Z = (t) => (t != null ? t : "").replace(/\\[,;:! ]/g, "").replace(/\\[()[\]]|\\[a-zA-Z]+|[{}$]/g, " ").trim(), at = (t) => new RegExp("\\p{L}{2,}", "u").test(Z(t)), ot = (t) => {
  const e = Z(t);
  return e !== "" && /^[−+-]?[\d\s.,]+(?:\s*[₸%])?$/u.test(e);
};
function k(t) {
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
  return F(
    s.cell,
    a && s.inputCell,
    a && !it.has(e) && s.inputCellDefaultWidth,
    d && s.cellHeader,
    E.has(e) && p && s.cellNoBottomBorder,
    // Row labels are bold only when they are words (rule 58): a first column
    // of numbers is data, not an axis.
    // The corner cell belongs to the header, never bold.
    st.has(e) && i && !a && !d && (u === void 0 || at(u)) && s.cellFirstColLabel,
    // Numbers align right so places line up down a column (rule 59). Only in
    // the bordered data tables; the flex rows (inline/list/mixed) are
    // sentences, not columns.
    E.has(e) && e !== "table.grid" && !d && !a && ot(u) && s.cellNum,
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
function X(t) {
  const {
    id: e,
    mode: n
  } = t;
  return F(s.input, n === "solution" && nt.has(e) && s.inputWidthAuto);
}
const rt = ({
  task: t,
  deps: e,
  answer: n,
  solution: a,
  templateId: i
}) => {
  const r = t.description.table;
  if (!r)
    return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(M, { title: t.title, deps: e }),
      /* @__PURE__ */ l.jsx($, { task: t, deps: e }),
      /* @__PURE__ */ l.jsx(U, { solution: a, deps: e })
    ] });
  const d = e.helpers.TaskHelper.multipleTaskAnswerSeparator, u = J(a, d, (b) => e.global.translateTasks(b)), h = q(n, d);
  let c = 0;
  return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": i, "data-mode": "solution", children: [
    /* @__PURE__ */ l.jsx(M, { title: t.title, deps: e }),
    /* @__PURE__ */ l.jsx($, { task: t, deps: e }),
    /* @__PURE__ */ l.jsx(lt, { userAnswer: h.join(" ; "), correctAnswer: K(u), deps: e }),
    /* @__PURE__ */ l.jsx("div", { className: s.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { className: V({
      id: i != null ? i : "table.plain",
      mode: "solution",
      removeBorders: r.removeBorders,
      removePadding: r.removePadding
    }), style: {
      width: i === "table.mixed" ? "100%" : r.width
    }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: r.rows.map((b, x) => /* @__PURE__ */ l.jsx("tr", { children: b.cells.map((w, g) => {
      var y, j, C;
      const v = w === "answercell", N = typeof w == "string" ? w : e.global.translateTasks(w), m = v ? c++ : -1, R = i === "table.grid" ? x < r.rows.length - 1 : i === "table.multiRow" || i === "table.multiRowSvg" ? x === 0 : !1;
      return /* @__PURE__ */ l.jsx("td", { className: k({
        id: i != null ? i : "table.plain",
        mode: "solution",
        isInput: v,
        isFirstCell: g === 0,
        isLastCell: g === b.cells.length - 1,
        isHeaderRow: R,
        isLastRow: x === r.rows.length - 1,
        content: v ? void 0 : N
      }), colSpan: ((y = b.colspan_list) == null ? void 0 : y[g]) || 1, rowSpan: ((j = b.rowspan_list) == null ? void 0 : j[g]) || 1, children: v ? /* @__PURE__ */ l.jsx(Q, { className: X({
        id: i != null ? i : "table.plain",
        mode: "solution"
      }), children: (C = u[m]) != null ? C : "" }) : /* @__PURE__ */ l.jsx(A, { content: N }) }, g);
    }) }, x)) }) }) }),
    /* @__PURE__ */ l.jsx(U, { solution: a, deps: e })
  ] });
}, ct = (t) => {
  const e = G.c(3), n = L.useRef(null);
  let a, i;
  return e[0] !== t ? (a = () => {
    var h;
    const r = n.current;
    if (!t || !r)
      return;
    const d = () => {
      for (const c of Array.from(r.querySelectorAll("tr"))) {
        c.removeAttribute("data-wrap"), c.style.removeProperty("--group-width");
        const b = Array.from(c.querySelectorAll(":scope > [data-group]")), x = b.filter(ut), w = x.length ? x : b;
        if (b.length < 2 || c.scrollWidth <= c.clientWidth + 1)
          continue;
        const g = Math.min(c.clientWidth, Math.ceil(Math.max(...w.map(dt))));
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
  }, i = [t], e[0] = t, e[1] = a, e[2] = i) : (a = e[1], i = e[2]), L.useLayoutEffect(a, i), n;
};
function ut(t) {
  return t.dataset.group === "glued";
}
function dt(t) {
  return t.getBoundingClientRect().width;
}
const pt = () => {
  const t = G.c(4), e = L.useRef(null), [n, a] = L.useState(!1);
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
  }, r = [], t[0] = i, t[1] = r) : (i = t[0], r = t[1]), L.useEffect(i, r);
  let d;
  return t[2] !== n ? (d = {
    ref: e,
    hiddenRight: n
  }, t[2] = n, t[3] = d) : d = t[3], d;
}, D = /* @__PURE__ */ new Set(["table.inline", "table.mixed"]), ft = ({
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
    } = pt(), h = ct(D.has(t));
    if (Y(n.solution))
      return /* @__PURE__ */ l.jsx(rt, { task: n, deps: a, answer: i, solution: n.solution, templateId: t });
    const c = n.description.table;
    if (!c)
      return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": t, "data-mode": "input", children: [
        /* @__PURE__ */ l.jsx(M, { title: n.title, deps: a }),
        /* @__PURE__ */ l.jsx(z, { task: n, deps: a })
      ] });
    const b = a.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: x,
      handleChange: w
    } = tt({
      onChange: r,
      separator: b,
      mathInput: d
    }), g = q(i, b);
    let v = 0;
    const N = t === "table.list" && c.rows.every(({
      cells: m
    }) => m.length === 2 && m[0] === "answercell" && m[1] !== "answercell");
    return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": t, "data-mode": "input", children: [
      /* @__PURE__ */ l.jsx(M, { title: n.title, deps: a }),
      /* @__PURE__ */ l.jsx(z, { task: n, deps: a }),
      /* @__PURE__ */ l.jsx("div", { className: s.tableFrame, "data-hidden-right": u || void 0, children: /* @__PURE__ */ l.jsx("div", { ref: p, className: s.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { ref: h, className: V({
        id: t,
        mode: "input",
        removeBorders: c.removeBorders,
        removePadding: c.removePadding
      }), style: {
        width: t === "table.list" || t === "table.mixed" || t === "table.inline" ? "100%" : c.width
      }, "data-testid": "task-table", "data-field-column": N || void 0, children: /* @__PURE__ */ l.jsx("tbody", { children: c.rows.map((m, R) => {
        var O, I;
        const y = t === "table.grid" ? R < c.rows.length - 1 : t === "table.multiRow" || t === "table.multiRowSvg" ? R === 0 : !1, j = (o, f, S) => k({
          content: S,
          id: t,
          mode: "input",
          isInput: f,
          isFirstCell: o === 0,
          isLastCell: o === m.cells.length - 1,
          isHeaderRow: y,
          isLastRow: R === c.rows.length - 1
        }), C = () => {
          var f;
          const o = v++;
          return /* @__PURE__ */ l.jsx(et, { id: `table-input-${o}`, ref: x(`table-input-${o}`), formula: (f = g[o]) != null ? f : "", onMathFieldChanged: w, className: X({
            id: t,
            mode: "input"
          }) });
        }, _ = (o) => typeof o == "string" ? o : a.global.translateTasks(o), T = [], P = D.has(t), W = m.cells.indexOf("answercell");
        let H = 0;
        P && W > 0 && (T.push(/* @__PURE__ */ l.jsx("td", { className: s.cellLead, children: m.cells.slice(0, W).map((o, f) => /* @__PURE__ */ l.jsx("span", { className: j(f, !1), children: /* @__PURE__ */ l.jsx(A, { content: _(o) }) }, f)) }, "lead")), H = W);
        for (let o = H; o < m.cells.length; o++) {
          const f = m.cells[o], S = f === "answercell", B = m.cells[o + 1];
          if (S && D.has(t) && B !== void 0 && B !== "answercell") {
            T.push(/* @__PURE__ */ l.jsxs("td", { className: s.cellGlued, "data-group": "glued", children: [
              /* @__PURE__ */ l.jsx("span", { className: j(o, !0), children: C() }),
              /* @__PURE__ */ l.jsx("span", { className: j(o + 1, !1), children: /* @__PURE__ */ l.jsx(A, { content: _(B) }) })
            ] }, o)), o++;
            continue;
          }
          T.push(/* @__PURE__ */ l.jsx("td", { className: j(o, S, S ? void 0 : _(f)), colSpan: ((O = m.colspan_list) == null ? void 0 : O[o]) || 1, rowSpan: ((I = m.rowspan_list) == null ? void 0 : I[o]) || 1, "data-group": P && S ? "" : void 0, children: S ? C() : /* @__PURE__ */ l.jsx(A, { content: _(f) }) }, o));
        }
        return /* @__PURE__ */ l.jsx("tr", { children: T }, R);
      }) }) }) }) })
    ] });
  };
  return e.displayName = t, e;
};
export {
  ft as c
};
