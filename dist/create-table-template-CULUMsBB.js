import { f as U, I as s, j as l, a as B, l as ee, m as Z, b as te, r as le, J as D, c as J, x as L, K as se, e as ne, n as ie, H as ae, k as oe, N as re } from "./index-CTy3EOjT.js";
import { S as q, T as I } from "./shared-solution-description-DyAv_278.js";
import { a as V, S as ce } from "./solution-answer-panel-BhQnC1g1.js";
const y = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), ue = y, de = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), pe = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function K(e) {
  const {
    id: t,
    mode: n,
    removeBorders: a,
    removePadding: i
  } = e;
  return U(s.table, a && s.tableRemoveBorders, i && s.tableRemovePadding, t === "table.plain" && a && !i && s.equationStretch, y.has(t) && s.tableRounded, t === "table.inline" && n === "input" && s.tableFlexInlineInput, t === "table.mixed" && n === "solution" && s.tableFlexMixedSolution, t === "table.mixed" && n === "input" && s.tableFlexMixedInput, t === "table.list" && n === "input" && s.tableFlexListInput, t === "table.list" && n === "solution" && s.tableFlexListSolution);
}
const X = (e) => (e != null ? e : "").replace(/\\[,;:! ]/g, "").replace(/\\[()[\]]|\\[a-zA-Z]+|[{}$]/g, " ").trim(), me = (e) => new RegExp("\\p{L}{2,}", "u").test(X(e)), he = (e) => {
  const t = X(e);
  return t !== "" && /^[−+-]?[\d\s.,]+(?:\s*[₸%])?$/u.test(t);
};
function Q(e) {
  const {
    id: t,
    mode: n,
    isInput: a,
    isFirstCell: i,
    isLastCell: r,
    isHeaderRow: m,
    isLastRow: h,
    content: d,
    inWrappingColumn: p
  } = e;
  return U(
    s.cell,
    a && s.inputCell,
    a && !pe.has(t) && s.inputCellDefaultWidth,
    m && s.cellHeader,
    // Rule 12: a wrapped header no longer holds the column open, so the field
    // keeps room for its answer itself (4_10_9_9: an empty 62px for «1500»).
    y.has(t) && a && p && s.inputCellAnswerRoom,
    y.has(t) && h && s.cellNoBottomBorder,
    // Row labels are bold only when they are words (rule 58): a first column
    // of numbers is data, not an axis.
    // The corner cell belongs to the header, never bold.
    ue.has(t) && i && !a && !m && (d === void 0 || me(d)) && s.cellFirstColLabel,
    // Numbers align right so places line up down a column (rule 59). Only in
    // the bordered data tables; the flex rows (inline/list/mixed) are
    // sentences, not columns.
    y.has(t) && t !== "table.grid" && !m && !a && he(d) && s.cellNum,
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
function Y(e) {
  const {
    id: t,
    mode: n
  } = e;
  return U(s.input, n === "solution" && de.has(t) && s.inputWidthAuto);
}
const be = ({
  task: e,
  deps: t,
  answer: n,
  solution: a,
  templateId: i
}) => {
  const r = e.description.table;
  if (!r)
    return /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(B, { title: e.title, deps: t }),
      /* @__PURE__ */ l.jsx(q, { task: e, deps: t }),
      /* @__PURE__ */ l.jsx(V, { solution: a, deps: t })
    ] });
  const m = t.helpers.TaskHelper.multipleTaskAnswerSeparator, d = ee(a, m, (c) => t.global.translateTasks(c)), p = Z(n, m);
  let b = 0;
  return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": i, "data-mode": "solution", children: [
    /* @__PURE__ */ l.jsx(B, { title: e.title, deps: t }),
    /* @__PURE__ */ l.jsx(q, { task: e, deps: t }),
    /* @__PURE__ */ l.jsx(ce, { userAnswer: p.join(" ; "), correctAnswer: te(d), deps: t }),
    /* @__PURE__ */ l.jsx("div", { className: s.tableWrapper, children: /* @__PURE__ */ l.jsx("table", { className: K({
      id: i != null ? i : "table.plain",
      mode: "solution",
      removeBorders: r.removeBorders,
      removePadding: r.removePadding
    }), style: {
      width: i === "table.mixed" ? "100%" : (
        // the answer row is the same phrase as the task row
        (i != null ? i : "table.plain") === "table.plain" && r.removeBorders ? void 0 : r.width
      )
    }, "data-testid": "task-table", children: /* @__PURE__ */ l.jsx("tbody", { children: r.rows.map((c, x) => /* @__PURE__ */ l.jsx("tr", { children: c.cells.map((S, w) => {
      var C, A, u;
      const v = S === "answercell", T = typeof S == "string" ? S : t.global.translateTasks(S), E = v ? b++ : -1, O = i === "table.grid" ? x < r.rows.length - 1 : i === "table.multiRow" || i === "table.multiRowSvg" ? x === 0 : !1;
      return /* @__PURE__ */ l.jsx("td", { className: Q({
        id: i != null ? i : "table.plain",
        mode: "solution",
        isInput: v,
        isFirstCell: w === 0,
        isLastCell: w === c.cells.length - 1,
        isHeaderRow: O,
        isLastRow: x === r.rows.length - 1,
        content: v ? void 0 : T
      }), colSpan: ((C = c.colspan_list) == null ? void 0 : C[w]) || 1, rowSpan: ((A = c.rowspan_list) == null ? void 0 : A[w]) || 1, children: v ? /* @__PURE__ */ l.jsx(le, { className: Y({
        id: i != null ? i : "table.plain",
        mode: "solution"
      }), children: (u = d[E]) != null ? u : "" }) : /* @__PURE__ */ l.jsx(D, { content: T }) }, w);
    }) }, x)) }) }) }),
    /* @__PURE__ */ l.jsx(V, { solution: a, deps: t })
  ] });
}, ge = (e) => {
  const t = J.c(3), n = L.useRef(null);
  let a, i;
  return t[0] !== e ? (a = () => {
    var p;
    const r = n.current;
    if (!e || !r)
      return;
    const m = () => {
      for (const b of Array.from(r.querySelectorAll("tr"))) {
        b.removeAttribute("data-wrap"), b.style.removeProperty("--group-width");
        const c = Array.from(b.querySelectorAll(":scope > [data-group]")), x = c.filter(fe), S = x.length ? x : c;
        if (c.length < 2 || b.scrollWidth <= b.clientWidth + 1)
          continue;
        const w = Math.min(b.clientWidth, Math.ceil(Math.max(...S.map(xe))));
        b.style.setProperty("--group-width", `${w}px`), b.setAttribute("data-wrap", "");
      }
    };
    m(), (p = document.fonts) == null || p.ready.then(m);
    let h = r.getBoundingClientRect().width;
    const d = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(() => {
      const b = r.getBoundingClientRect().width;
      Math.abs(b - h) < 1 || (h = b, m());
    });
    return d == null || d.observe(r), () => d == null ? void 0 : d.disconnect();
  }, i = [e], t[0] = e, t[1] = a, t[2] = i) : (a = t[1], i = t[2]), L.useLayoutEffect(a, i), n;
};
function fe(e) {
  return e.dataset.group === "glued";
}
function xe(e) {
  return e.getBoundingClientRect().width;
}
const we = () => {
  const e = J.c(4), t = L.useRef(null), [n, a] = L.useState(!1);
  let i, r;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (i = () => {
    const h = t.current;
    if (!h)
      return;
    const d = () => a(h.scrollLeft + h.clientWidth < h.scrollWidth - 1);
    d(), h.addEventListener("scroll", d, {
      passive: !0
    });
    const p = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(d);
    return p == null || p.observe(h), h.firstElementChild && (p == null || p.observe(h.firstElementChild)), () => {
      h.removeEventListener("scroll", d), p == null || p.disconnect();
    };
  }, r = [], e[0] = i, e[1] = r) : (i = e[0], r = e[1]), L.useEffect(i, r);
  let m;
  return e[2] !== n ? (m = {
    ref: t,
    hiddenRight: n
  }, e[2] = n, e[3] = m) : m = e[3], m;
}, H = /* @__PURE__ */ new Set(["table.inline", "table.mixed"]), Se = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), je = {
  from: 4
}, Ne = ({
  id: e
}) => {
  const t = ({
    task: n,
    deps: a,
    answer: i,
    onChange: r,
    mathInput: m
  }) => {
    const {
      ref: h,
      hiddenRight: d
    } = we(), p = ge(H.has(e)), b = se();
    if (ne(n.solution))
      return /* @__PURE__ */ l.jsx(be, { task: n, deps: a, answer: i, solution: n.solution, templateId: e });
    const c = n.description.table;
    if (!c)
      return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": e, "data-mode": "input", children: [
        /* @__PURE__ */ l.jsx(B, { title: n.title, deps: a }),
        /* @__PURE__ */ l.jsx(I, { task: n, deps: a })
      ] });
    const x = a.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: S,
      handleChange: w
    } = ie({
      onChange: r,
      separator: x,
      mathInput: m
    }), v = Z(i, x);
    let T = 0;
    const E = e === "table.list" && c.rows.every(({
      cells: u
    }) => u.length === 2 && u[0] === "answercell" && u[1] !== "answercell"), O = (u) => b.from === null || !Se.has(e) ? b : c.rows.some(({
      cells: N
    }) => {
      const g = N[u];
      if (g === void 0 || g === "answercell") return !1;
      const _ = typeof g == "string" ? g : a.global.translateTasks(g);
      return /\d{5,}/.test(_.replace(new RegExp("(?<=\\d)[ \\u00a0]+(?=\\d{3})", "g"), ""));
    }) ? je : b, C = (u) => e === "table.grid" ? u < c.rows.length - 1 : e === "table.multiRow" || e === "table.multiRowSvg" ? u === 0 : !1, A = (u) => c.rows.some(({
      cells: R
    }, N) => {
      const g = R[u];
      return !C(N) || g === void 0 || g === "answercell" ? !1 : re(typeof g == "string" ? g : a.global.translateTasks(g));
    });
    return /* @__PURE__ */ l.jsxs("div", { className: s.container, "data-template-id": e, "data-mode": "input", children: [
      /* @__PURE__ */ l.jsx(B, { title: n.title, deps: a }),
      /* @__PURE__ */ l.jsx(I, { task: n, deps: a }),
      /* @__PURE__ */ l.jsx("div", { className: s.tableFrame, "data-hidden-right": d || void 0, children: /* @__PURE__ */ l.jsx("div", { ref: h, className: s.tableWrapper, "data-ntm-table-scroll": !0, children: /* @__PURE__ */ l.jsx("table", { ref: p, className: K({
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
      }, "data-testid": "task-table", "data-field-column": E || void 0, children: /* @__PURE__ */ l.jsx("tbody", { children: c.rows.map((u, R) => {
        var z, k;
        const N = C(R), g = (o, f, j) => Q({
          content: j,
          id: e,
          mode: "input",
          isInput: f,
          isFirstCell: o === 0,
          isLastCell: o === u.cells.length - 1,
          isHeaderRow: N,
          isLastRow: R === c.rows.length - 1,
          inWrappingColumn: f && A(o)
        }), _ = () => {
          var f;
          const o = T++;
          return /* @__PURE__ */ l.jsx(oe, { id: `table-input-${o}`, ref: S(`table-input-${o}`), formula: (f = v[o]) != null ? f : "", onMathFieldChanged: w, className: Y({
            id: e,
            mode: "input"
          }) });
        }, M = (o) => typeof o == "string" ? o : a.global.translateTasks(o), W = [], G = H.has(e), P = u.cells.indexOf("answercell");
        let $ = 0;
        G && P > 0 && (W.push(/* @__PURE__ */ l.jsx("td", { className: s.cellLead, children: u.cells.slice(0, P).map((o, f) => /* @__PURE__ */ l.jsx("span", { className: g(f, !1), children: /* @__PURE__ */ l.jsx(D, { content: M(o) }) }, f)) }, "lead")), $ = P);
        for (let o = $; o < u.cells.length; o++) {
          const f = u.cells[o], j = f === "answercell", F = u.cells[o + 1];
          if (j && H.has(e) && F !== void 0 && F !== "answercell") {
            W.push(/* @__PURE__ */ l.jsxs("td", { className: s.cellGlued, "data-group": "glued", children: [
              /* @__PURE__ */ l.jsx("span", { className: g(o, !0), children: _() }),
              /* @__PURE__ */ l.jsx("span", { className: g(o + 1, !1), children: /* @__PURE__ */ l.jsx(D, { content: M(F) }) })
            ] }, o)), o++;
            continue;
          }
          W.push(/* @__PURE__ */ l.jsx("td", { className: g(o, j, j ? void 0 : M(f)), colSpan: ((z = u.colspan_list) == null ? void 0 : z[o]) || 1, rowSpan: ((k = u.rowspan_list) == null ? void 0 : k[o]) || 1, "data-group": G && j ? "" : void 0, children: /* @__PURE__ */ l.jsx(ae, { value: O(o), children: j ? _() : /* @__PURE__ */ l.jsx(D, { content: M(f) }) }) }, o));
        }
        return /* @__PURE__ */ l.jsx("tr", { children: W }, R);
      }) }) }) }) })
    ] });
  };
  return t.displayName = e, t;
};
export {
  Ne as c
};
