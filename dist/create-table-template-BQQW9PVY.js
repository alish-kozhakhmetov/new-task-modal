import { f as F, H as s, j as l, a as M, l as Q, m as V, b as Y, r as ee, I as A, c as k, w as N, J as te, e as le, n as se, G as ne, k as ie } from "./index-BxlJxidr.js";
import { S as z, T as I } from "./shared-solution-description-C63tIftY.js";
import { a as q, S as ae } from "./solution-answer-panel-Bg0BZGg8.js";
const D = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), oe = D, re = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), ce = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function Z(e) {
  const {
    id: t,
    mode: n,
    removeBorders: a,
    removePadding: i
  } = e;
  return F(s.table, a && s.tableRemoveBorders, i && s.tableRemovePadding, t === "table.plain" && a && !i && s.equationStretch, D.has(t) && s.tableRounded, t === "table.inline" && n === "input" && s.tableFlexInlineInput, t === "table.mixed" && n === "solution" && s.tableFlexMixedSolution, t === "table.mixed" && n === "input" && s.tableFlexMixedInput, t === "table.list" && n === "input" && s.tableFlexListInput, t === "table.list" && n === "solution" && s.tableFlexListSolution);
}
const J = (e) => (e != null ? e : "").replace(/\\[,;:! ]/g, "").replace(/\\[()[\]]|\\[a-zA-Z]+|[{}$]/g, " ").trim(), ue = (e) => new RegExp("\\p{L}{2,}", "u").test(J(e)), de = (e) => {
  const t = J(e);
  return t !== "" && /^[−+-]?[\d\s.,]+(?:\s*[₸%])?$/u.test(t);
};
function X(e) {
  const {
    id: t,
    mode: n,
    isInput: a,
    isFirstCell: i,
    isLastCell: r,
    isHeaderRow: d,
    isLastRow: p,
    content: u
  } = e;
  return F(
    s.cell,
    a && s.inputCell,
    a && !ce.has(t) && s.inputCellDefaultWidth,
    d && s.cellHeader,
    D.has(t) && p && s.cellNoBottomBorder,
    // Row labels are bold only when they are words (rule 58): a first column
    // of numbers is data, not an axis.
    // The corner cell belongs to the header, never bold.
    oe.has(t) && i && !a && !d && (u === void 0 || ue(u)) && s.cellFirstColLabel,
    // Numbers align right so places line up down a column (rule 59). Only in
    // the bordered data tables; the flex rows (inline/list/mixed) are
    // sentences, not columns.
    D.has(t) && t !== "table.grid" && !d && !a && de(u) && s.cellNum,
    t === "table.inline" && n === "solution" && s.cellInlineSolution,
    t === "table.inline" && n === "input" && s.cellInlineInput,
    t === "table.inline" && n === "input" && a && s.inputCellInlineInput,
    t === "table.mixed" && n === "solution" && s.cellMixedSolution,
    t === "table.mixed" && n === "input" && s.cellMixedInput,
    t === "table.list" && n === "input" && r && s.cellListLastInput,
    t === "table.list" && n === "solution" && r && s.cellListLastSolution,
    t === "table.list" && n === "input" && a && s.inputCellListInput,
    t === "table.list" && n === "solution" && a && s.inputCellListSolution,
    t === "table.plain" && n === "solution" && a && s.inputCellPlainSolution
  );
}
function K(e) {
  const {
    id: t,
    mode: n
  } = e;
  return F(s.input, n === "solution" && re.has(t) && s.inputWidthAuto);
}
const pe = ({
  task: e,
  deps: t,
  answer: n,
  solution: a,
  templateId: i
}) => {
  const r = e.description.table;
  if (!r)
    return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(M, { title: e.title, deps: t }),
      /* @__PURE__ */ l.jsx(z, { task: e, deps: t }),
      /* @__PURE__ */ l.jsx(q, { solution: a, deps: t })
    ] });
  const d = t.helpers.TaskHelper.multipleTaskAnswerSeparator, u = Q(a, d, (c) => t.global.translateTasks(c)), b = V(n, d);
  let m = 0;
  return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": i, "data-mode": "solution", children: [
    /* @__PURE__ */ l.jsx(M, { title: e.title, deps: t }),
    /* @__PURE__ */ l.jsx(z, { task: e, deps: t }),
    /* @__PURE__ */ l.jsx(ae, { userAnswer: b.join(" ; "), correctAnswer: Y(u), deps: t }),
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
      const R = S === "answercell", L = typeof S == "string" ? S : t.global.translateTasks(S), B = R ? m++ : -1, E = i === "table.grid" ? g < r.rows.length - 1 : i === "table.multiRow" || i === "table.multiRowSvg" ? g === 0 : !1;
      return /* @__PURE__ */ l.jsx("td", { className: X({
        id: i != null ? i : "table.plain",
        mode: "solution",
        isInput: R,
        isFirstCell: w === 0,
        isLastCell: w === c.cells.length - 1,
        isHeaderRow: E,
        isLastRow: g === r.rows.length - 1,
        content: R ? void 0 : L
      }), colSpan: ((h = c.colspan_list) == null ? void 0 : h[w]) || 1, rowSpan: ((j = c.rowspan_list) == null ? void 0 : j[w]) || 1, children: R ? /* @__PURE__ */ l.jsx(ee, { className: K({
        id: i != null ? i : "table.plain",
        mode: "solution"
      }), children: (C = u[B]) != null ? C : "" }) : /* @__PURE__ */ l.jsx(A, { content: L }) }, w);
    }) }, g)) }) }) }),
    /* @__PURE__ */ l.jsx(q, { solution: a, deps: t })
  ] });
}, me = (e) => {
  const t = k.c(3), n = N.useRef(null);
  let a, i;
  return t[0] !== e ? (a = () => {
    var b;
    const r = n.current;
    if (!e || !r)
      return;
    const d = () => {
      for (const m of Array.from(r.querySelectorAll("tr"))) {
        m.removeAttribute("data-wrap"), m.style.removeProperty("--group-width");
        const c = Array.from(m.querySelectorAll(":scope > [data-group]")), g = c.filter(he), S = g.length ? g : c;
        if (c.length < 2 || m.scrollWidth <= m.clientWidth + 1)
          continue;
        const w = Math.min(m.clientWidth, Math.ceil(Math.max(...S.map(be))));
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
  }, i = [e], t[0] = e, t[1] = a, t[2] = i) : (a = t[1], i = t[2]), N.useLayoutEffect(a, i), n;
};
function he(e) {
  return e.dataset.group === "glued";
}
function be(e) {
  return e.getBoundingClientRect().width;
}
const fe = () => {
  const e = k.c(4), t = N.useRef(null), [n, a] = N.useState(!1);
  let i, r;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (i = () => {
    const p = t.current;
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
  }, r = [], e[0] = i, e[1] = r) : (i = e[0], r = e[1]), N.useEffect(i, r);
  let d;
  return e[2] !== n ? (d = {
    ref: t,
    hiddenRight: n
  }, e[2] = n, e[3] = d) : d = e[3], d;
}, W = /* @__PURE__ */ new Set(["table.inline", "table.mixed"]), ge = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), xe = {
  from: 4
}, ve = ({
  id: e
}) => {
  const t = ({
    task: n,
    deps: a,
    answer: i,
    onChange: r,
    mathInput: d
  }) => {
    const {
      ref: p,
      hiddenRight: u
    } = fe(), b = me(W.has(e)), m = te();
    if (le(n.solution))
      return /* @__PURE__ */ l.jsx(pe, { task: n, deps: a, answer: i, solution: n.solution, templateId: e });
    const c = n.description.table;
    if (!c)
      return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": e, "data-mode": "input", children: [
        /* @__PURE__ */ l.jsx(M, { title: n.title, deps: a }),
        /* @__PURE__ */ l.jsx(I, { task: n, deps: a })
      ] });
    const g = a.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: S,
      handleChange: w
    } = se({
      onChange: r,
      separator: g,
      mathInput: d
    }), R = V(i, g);
    let L = 0;
    const B = e === "table.list" && c.rows.every(({
      cells: h
    }) => h.length === 2 && h[0] === "answercell" && h[1] !== "answercell"), E = (h) => m.from === null || !ge.has(e) ? m : c.rows.some(({
      cells: C
    }) => {
      const x = C[h];
      if (x === void 0 || x === "answercell") return !1;
      const y = typeof x == "string" ? x : a.global.translateTasks(x);
      return /\d{5,}/.test(y.replace(new RegExp("(?<=\\d)[ \\u00a0]+(?=\\d{3})", "g"), ""));
    }) ? xe : m;
    return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": e, "data-mode": "input", children: [
      /* @__PURE__ */ l.jsx(M, { title: n.title, deps: a }),
      /* @__PURE__ */ l.jsx(I, { task: n, deps: a }),
      /* @__PURE__ */ l.jsx("div", { className: s.tableFrame, "data-hidden-right": u || void 0, children: /* @__PURE__ */ l.jsx("div", { ref: p, className: s.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { ref: b, className: Z({
        id: e,
        mode: "input",
        removeBorders: c.removeBorders,
        removePadding: c.removePadding
      }), style: {
        width: e === "table.list" || e === "table.mixed" || e === "table.inline" ? "100%" : (
          // A borderless table.plain row is a phrase and sizes to
          // its content; the backend flag is ignored (.equationStretch).
          e === "table.plain" && c.removeBorders ? void 0 : c.width
        )
      }, "data-testid": "task-table", "data-field-column": B || void 0, children: /* @__PURE__ */ l.jsx("tbody", { children: c.rows.map((h, j) => {
        var U, $;
        const C = e === "table.grid" ? j < c.rows.length - 1 : e === "table.multiRow" || e === "table.multiRowSvg" ? j === 0 : !1, x = (o, f, v) => X({
          content: v,
          id: e,
          mode: "input",
          isInput: f,
          isFirstCell: o === 0,
          isLastCell: o === h.cells.length - 1,
          isHeaderRow: C,
          isLastRow: j === c.rows.length - 1
        }), y = () => {
          var f;
          const o = L++;
          return /* @__PURE__ */ l.jsx(ie, { id: `table-input-${o}`, ref: S(`table-input-${o}`), formula: (f = R[o]) != null ? f : "", onMathFieldChanged: w, className: K({
            id: e,
            mode: "input"
          }) });
        }, T = (o) => typeof o == "string" ? o : a.global.translateTasks(o), _ = [], H = W.has(e), O = h.cells.indexOf("answercell");
        let G = 0;
        H && O > 0 && (_.push(/* @__PURE__ */ l.jsx("td", { className: s.cellLead, children: h.cells.slice(0, O).map((o, f) => /* @__PURE__ */ l.jsx("span", { className: x(f, !1), children: /* @__PURE__ */ l.jsx(A, { content: T(o) }) }, f)) }, "lead")), G = O);
        for (let o = G; o < h.cells.length; o++) {
          const f = h.cells[o], v = f === "answercell", P = h.cells[o + 1];
          if (v && W.has(e) && P !== void 0 && P !== "answercell") {
            _.push(/* @__PURE__ */ l.jsxs("td", { className: s.cellGlued, "data-group": "glued", children: [
              /* @__PURE__ */ l.jsx("span", { className: x(o, !0), children: y() }),
              /* @__PURE__ */ l.jsx("span", { className: x(o + 1, !1), children: /* @__PURE__ */ l.jsx(A, { content: T(P) }) })
            ] }, o)), o++;
            continue;
          }
          _.push(/* @__PURE__ */ l.jsx("td", { className: x(o, v, v ? void 0 : T(f)), colSpan: ((U = h.colspan_list) == null ? void 0 : U[o]) || 1, rowSpan: (($ = h.rowspan_list) == null ? void 0 : $[o]) || 1, "data-group": H && v ? "" : void 0, children: v ? y() : /* @__PURE__ */ l.jsx(ne, { value: E(o), children: /* @__PURE__ */ l.jsx(A, { content: T(f) }) }) }, o));
        }
        return /* @__PURE__ */ l.jsx("tr", { children: _ }, j);
      }) }) }) }) })
    ] });
  };
  return t.displayName = e, t;
};
export {
  ve as c
};
