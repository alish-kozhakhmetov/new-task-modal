import { f as F, I as s, j as l, a as M, l as Q, m as V, b as Y, r as tt, J as A, c as k, x as N, K as et, e as lt, n as st, H as nt, k as it } from "./index-fy3n_vRX.js";
import { S as z, T as I } from "./shared-solution-description-BC6KbdDU.js";
import { a as q, S as at } from "./solution-answer-panel-BS0jBq_8.js";
const D = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), ot = D, rt = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), ct = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function Z(t) {
  const {
    id: e,
    mode: n,
    removeBorders: a,
    removePadding: i
  } = t;
  return F(s.table, a && s.tableRemoveBorders, i && s.tableRemovePadding, e === "table.plain" && a && !i && s.equationStretch, D.has(e) && s.tableRounded, e === "table.inline" && n === "input" && s.tableFlexInlineInput, e === "table.mixed" && n === "solution" && s.tableFlexMixedSolution, e === "table.mixed" && n === "input" && s.tableFlexMixedInput, e === "table.list" && n === "input" && s.tableFlexListInput, e === "table.list" && n === "solution" && s.tableFlexListSolution);
}
const J = (t) => (t != null ? t : "").replace(/\\[,;:! ]/g, "").replace(/\\[()[\]]|\\[a-zA-Z]+|[{}$]/g, " ").trim(), ut = (t) => new RegExp("\\p{L}{2,}", "u").test(J(t)), dt = (t) => {
  const e = J(t);
  return e !== "" && /^[−+-]?[\d\s.,]+(?:\s*[₸%])?$/u.test(e);
};
function K(t) {
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
    a && !ct.has(e) && s.inputCellDefaultWidth,
    d && s.cellHeader,
    D.has(e) && p && s.cellNoBottomBorder,
    // Row labels are bold only when they are words (rule 58): a first column
    // of numbers is data, not an axis.
    // The corner cell belongs to the header, never bold.
    ot.has(e) && i && !a && !d && (u === void 0 || ut(u)) && s.cellFirstColLabel,
    // Numbers align right so places line up down a column (rule 59). Only in
    // the bordered data tables; the flex rows (inline/list/mixed) are
    // sentences, not columns.
    D.has(e) && e !== "table.grid" && !d && !a && dt(u) && s.cellNum,
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
  return F(s.input, n === "solution" && rt.has(e) && s.inputWidthAuto);
}
const pt = ({
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
      /* @__PURE__ */ l.jsx(z, { task: t, deps: e }),
      /* @__PURE__ */ l.jsx(q, { solution: a, deps: e })
    ] });
  const d = e.helpers.TaskHelper.multipleTaskAnswerSeparator, u = Q(a, d, (c) => e.global.translateTasks(c)), b = V(n, d);
  let m = 0;
  return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": i, "data-mode": "solution", children: [
    /* @__PURE__ */ l.jsx(M, { title: t.title, deps: e }),
    /* @__PURE__ */ l.jsx(z, { task: t, deps: e }),
    /* @__PURE__ */ l.jsx(at, { userAnswer: b.join(" ; "), correctAnswer: Y(u), deps: e }),
    /* @__PURE__ */ l.jsx("div", { className: s.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { className: Z({
      id: i != null ? i : "table.plain",
      mode: "solution",
      removeBorders: r.removeBorders,
      removePadding: r.removePadding
    }), style: {
      width: i === "table.mixed" ? "100%" : (
        // the answer row is the same phrase as the task row
        (i != null ? i : "table.plain") === "table.plain" && r.removeBorders ? void 0 : r.width
      )
    }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: r.rows.map((c, g) => /* @__PURE__ */ l.jsx("tr", { children: c.cells.map((S, w) => {
      var h, j, C;
      const R = S === "answercell", L = typeof S == "string" ? S : e.global.translateTasks(S), B = R ? m++ : -1, E = i === "table.grid" ? g < r.rows.length - 1 : i === "table.multiRow" || i === "table.multiRowSvg" ? g === 0 : !1;
      return /* @__PURE__ */ l.jsx("td", { className: K({
        id: i != null ? i : "table.plain",
        mode: "solution",
        isInput: R,
        isFirstCell: w === 0,
        isLastCell: w === c.cells.length - 1,
        isHeaderRow: E,
        isLastRow: g === r.rows.length - 1,
        content: R ? void 0 : L
      }), colSpan: ((h = c.colspan_list) == null ? void 0 : h[w]) || 1, rowSpan: ((j = c.rowspan_list) == null ? void 0 : j[w]) || 1, children: R ? /* @__PURE__ */ l.jsx(tt, { className: X({
        id: i != null ? i : "table.plain",
        mode: "solution"
      }), children: (C = u[B]) != null ? C : "" }) : /* @__PURE__ */ l.jsx(A, { content: L }) }, w);
    }) }, g)) }) }) }),
    /* @__PURE__ */ l.jsx(q, { solution: a, deps: e })
  ] });
}, mt = (t) => {
  const e = k.c(3), n = N.useRef(null);
  let a, i;
  return e[0] !== t ? (a = () => {
    var b;
    const r = n.current;
    if (!t || !r)
      return;
    const d = () => {
      for (const m of Array.from(r.querySelectorAll("tr"))) {
        m.removeAttribute("data-wrap"), m.style.removeProperty("--group-width");
        const c = Array.from(m.querySelectorAll(":scope > [data-group]")), g = c.filter(ht), S = g.length ? g : c;
        if (c.length < 2 || m.scrollWidth <= m.clientWidth + 1)
          continue;
        const w = Math.min(m.clientWidth, Math.ceil(Math.max(...S.map(bt))));
        m.style.setProperty("--group-width", `${w}px`), m.setAttribute("data-wrap", "");
      }
    };
    d(), (b = document.fonts) == null || b.ready.then(d);
    let p = r.getBoundingClientRect().width;
    const u = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(() => {
      const m = r.getBoundingClientRect().width;
      Math.abs(m - p) < 1 || (p = m, d());
    });
    return u == null || u.observe(r), () => u == null ? void 0 : u.disconnect();
  }, i = [t], e[0] = t, e[1] = a, e[2] = i) : (a = e[1], i = e[2]), N.useLayoutEffect(a, i), n;
};
function ht(t) {
  return t.dataset.group === "glued";
}
function bt(t) {
  return t.getBoundingClientRect().width;
}
const ft = () => {
  const t = k.c(4), e = N.useRef(null), [n, a] = N.useState(!1);
  let i, r;
  t[0] === Symbol.for("react.memo_cache_sentinel") ? (i = () => {
    const p = e.current;
    if (!p)
      return;
    const u = () => a(p.scrollLeft + p.clientWidth < p.scrollWidth - 1);
    u(), p.addEventListener("scroll", u, {
      passive: !0
    });
    const b = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(u);
    return b == null || b.observe(p), p.firstElementChild && (b == null || b.observe(p.firstElementChild)), () => {
      p.removeEventListener("scroll", u), b == null || b.disconnect();
    };
  }, r = [], t[0] = i, t[1] = r) : (i = t[0], r = t[1]), N.useEffect(i, r);
  let d;
  return t[2] !== n ? (d = {
    ref: e,
    hiddenRight: n
  }, t[2] = n, t[3] = d) : d = t[3], d;
}, W = /* @__PURE__ */ new Set(["table.inline", "table.mixed"]), gt = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), xt = {
  from: 4
}, vt = ({
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
    } = ft(), b = mt(W.has(t)), m = et();
    if (lt(n.solution))
      return /* @__PURE__ */ l.jsx(pt, { task: n, deps: a, answer: i, solution: n.solution, templateId: t });
    const c = n.description.table;
    if (!c)
      return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": t, "data-mode": "input", children: [
        /* @__PURE__ */ l.jsx(M, { title: n.title, deps: a }),
        /* @__PURE__ */ l.jsx(I, { task: n, deps: a })
      ] });
    const g = a.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: S,
      handleChange: w
    } = st({
      onChange: r,
      separator: g,
      mathInput: d
    }), R = V(i, g);
    let L = 0;
    const B = t === "table.list" && c.rows.every(({
      cells: h
    }) => h.length === 2 && h[0] === "answercell" && h[1] !== "answercell"), E = (h) => m.from === null || !gt.has(t) ? m : c.rows.some(({
      cells: C
    }) => {
      const x = C[h];
      if (x === void 0 || x === "answercell") return !1;
      const y = typeof x == "string" ? x : a.global.translateTasks(x);
      return /\d{5,}/.test(y.replace(new RegExp("(?<=\\d)[ \\u00a0]+(?=\\d{3})", "g"), ""));
    }) ? xt : m;
    return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": t, "data-mode": "input", children: [
      /* @__PURE__ */ l.jsx(M, { title: n.title, deps: a }),
      /* @__PURE__ */ l.jsx(I, { task: n, deps: a }),
      /* @__PURE__ */ l.jsx("div", { className: s.tableFrame, "data-hidden-right": u || void 0, children: /* @__PURE__ */ l.jsx("div", { ref: p, className: s.tableWrapper, "data-ntm-table-scroll": !0, children: /* @__PURE__ */ l.jsx("table", { ref: b, className: Z({
        id: t,
        mode: "input",
        removeBorders: c.removeBorders,
        removePadding: c.removePadding
      }), style: {
        width: t === "table.list" || t === "table.mixed" || t === "table.inline" ? "100%" : (
          // A borderless table.plain row is a phrase and sizes to
          // its content; the backend flag is ignored (.equationStretch).
          t === "table.plain" && c.removeBorders ? void 0 : c.width
        )
      }, "data-testid": "task-table", "data-field-column": B || void 0, children: /* @__PURE__ */ l.jsx("tbody", { children: c.rows.map((h, j) => {
        var G, $;
        const C = t === "table.grid" ? j < c.rows.length - 1 : t === "table.multiRow" || t === "table.multiRowSvg" ? j === 0 : !1, x = (o, f, v) => K({
          content: v,
          id: t,
          mode: "input",
          isInput: f,
          isFirstCell: o === 0,
          isLastCell: o === h.cells.length - 1,
          isHeaderRow: C,
          isLastRow: j === c.rows.length - 1
        }), y = () => {
          var f;
          const o = L++;
          return /* @__PURE__ */ l.jsx(it, { id: `table-input-${o}`, ref: S(`table-input-${o}`), formula: (f = R[o]) != null ? f : "", onMathFieldChanged: w, className: X({
            id: t,
            mode: "input"
          }) });
        }, T = (o) => typeof o == "string" ? o : a.global.translateTasks(o), _ = [], H = W.has(t), O = h.cells.indexOf("answercell");
        let U = 0;
        H && O > 0 && (_.push(/* @__PURE__ */ l.jsx("td", { className: s.cellLead, children: h.cells.slice(0, O).map((o, f) => /* @__PURE__ */ l.jsx("span", { className: x(f, !1), children: /* @__PURE__ */ l.jsx(A, { content: T(o) }) }, f)) }, "lead")), U = O);
        for (let o = U; o < h.cells.length; o++) {
          const f = h.cells[o], v = f === "answercell", P = h.cells[o + 1];
          if (v && W.has(t) && P !== void 0 && P !== "answercell") {
            _.push(/* @__PURE__ */ l.jsxs("td", { className: s.cellGlued, "data-group": "glued", children: [
              /* @__PURE__ */ l.jsx("span", { className: x(o, !0), children: y() }),
              /* @__PURE__ */ l.jsx("span", { className: x(o + 1, !1), children: /* @__PURE__ */ l.jsx(A, { content: T(P) }) })
            ] }, o)), o++;
            continue;
          }
          _.push(/* @__PURE__ */ l.jsx("td", { className: x(o, v, v ? void 0 : T(f)), colSpan: ((G = h.colspan_list) == null ? void 0 : G[o]) || 1, rowSpan: (($ = h.rowspan_list) == null ? void 0 : $[o]) || 1, "data-group": H && v ? "" : void 0, children: /* @__PURE__ */ l.jsx(nt, { value: E(o), children: v ? y() : /* @__PURE__ */ l.jsx(A, { content: T(f) }) }) }, o));
        }
        return /* @__PURE__ */ l.jsx("tr", { children: _ }, j);
      }) }) }) }) })
    ] });
  };
  return e.displayName = t, e;
};
export {
  vt as c
};
