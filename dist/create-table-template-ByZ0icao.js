import { f as $, I as i, c as G, x as C, j as s, a as O, l as le, m as K, b as ne, r as se, J as F, K as ie, e as ae, n as re, H as oe, k as ce, N as ue } from "./index-MzEOC_BN.js";
import { S as V, T as Z } from "./shared-solution-description-naLnMz-S.js";
import { a as J, S as de } from "./solution-answer-panel-BbIuujwX.js";
const N = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), pe = N, me = /* @__PURE__ */ new Set(["table.mixed", "table.list", "table.plain"]), be = /* @__PURE__ */ new Set(["table.inline", "table.list", "table.mixed"]);
function X(e) {
  const {
    id: t,
    mode: n,
    removeBorders: a,
    removePadding: l
  } = e;
  return $(i.table, a && i.tableRemoveBorders, l && i.tableRemovePadding, t === "table.plain" && a && !l && i.equationStretch, N.has(t) && i.tableRounded, t === "table.inline" && n === "input" && i.tableFlexInlineInput, t === "table.mixed" && n === "solution" && i.tableFlexMixedSolution, t === "table.mixed" && n === "input" && i.tableFlexMixedInput, t === "table.list" && n === "input" && i.tableFlexListInput, t === "table.list" && n === "solution" && i.tableFlexListSolution);
}
const Q = (e) => (e != null ? e : "").replace(/\\[,;:! ]/g, "").replace(/\\[()[\]]|\\[a-zA-Z]+|[{}$]/g, " ").trim(), he = (e) => new RegExp("\\p{L}{2,}", "u").test(Q(e)), fe = (e) => {
  const t = Q(e);
  return t !== "" && /^[−+-]?[\d\s.,]+(?:\s*[₸%])?$/u.test(t);
};
function Y(e) {
  const {
    id: t,
    mode: n,
    isInput: a,
    isFirstCell: l,
    isLastCell: p,
    isHeaderRow: o,
    isLastRow: c,
    content: u,
    inWrappingColumn: m
  } = e;
  return $(
    i.cell,
    a && i.inputCell,
    a && !be.has(t) && i.inputCellDefaultWidth,
    o && i.cellHeader,
    // Rule 12: a wrapped header no longer holds the column open, so the field
    // keeps room for its answer itself (4_10_9_9: an empty 62px for «1500»).
    N.has(t) && a && m && i.inputCellAnswerRoom,
    N.has(t) && c && i.cellNoBottomBorder,
    // Row labels are bold only when they are words (rule 58): a first column
    // of numbers is data, not an axis.
    // The corner cell belongs to the header, never bold.
    pe.has(t) && l && !a && !o && (u === void 0 || he(u)) && i.cellFirstColLabel,
    // Numbers align right so places line up down a column (rule 59). Only in
    // the bordered data tables; the flex rows (inline/list/mixed) are
    // sentences, not columns.
    N.has(t) && t !== "table.grid" && !o && !a && fe(u) && i.cellNum,
    t === "table.inline" && n === "solution" && i.cellInlineSolution,
    t === "table.inline" && n === "input" && i.cellInlineInput,
    t === "table.inline" && n === "input" && a && i.inputCellInlineInput,
    t === "table.mixed" && n === "solution" && i.cellMixedSolution,
    t === "table.mixed" && n === "input" && i.cellMixedInput,
    t === "table.list" && n === "input" && p && i.cellListLastInput,
    t === "table.list" && n === "solution" && p && i.cellListLastSolution,
    t === "table.list" && n === "input" && a && i.inputCellListInput,
    t === "table.list" && n === "solution" && a && i.inputCellListSolution,
    t === "table.plain" && n === "solution" && a && i.inputCellPlainSolution
  );
}
function ee(e) {
  const {
    id: t,
    mode: n
  } = e;
  return $(i.input, n === "solution" && me.has(t) && i.inputWidthAuto);
}
const M = "data-header-wrap", te = (e) => {
  const t = G.c(3);
  let n, a;
  t[0] !== e ? (n = () => {
    const l = e.current;
    if (!l)
      return;
    const p = () => l.scrollWidth > l.clientWidth + 1, o = () => {
      if (!l.querySelector(`.${i.cellHeader} .${i.cellLineWords}`)) {
        l.removeAttribute(M);
        return;
      }
      const {
        scrollLeft: b
      } = l;
      l.removeAttribute(M), p() && (l.setAttribute(M, ""), p() && l.removeAttribute(M)), l.scrollLeft !== b && (l.scrollLeft = b);
    };
    if (o(), typeof ResizeObserver == "undefined")
      return;
    let c = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(c), c = requestAnimationFrame(o);
    });
    return u.observe(l), l.firstElementChild && u.observe(l.firstElementChild), () => {
      cancelAnimationFrame(c), u.disconnect();
    };
  }, a = [e], t[0] = e, t[1] = n, t[2] = a) : (n = t[1], a = t[2]), C.useLayoutEffect(n, a);
}, ge = ({
  task: e,
  deps: t,
  answer: n,
  solution: a,
  templateId: l
}) => {
  const p = C.useRef(null);
  te(p);
  const o = e.description.table;
  if (!o)
    return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
      /* @__PURE__ */ s.jsx(O, { title: e.title, deps: t }),
      /* @__PURE__ */ s.jsx(V, { task: e, deps: t }),
      /* @__PURE__ */ s.jsx(J, { solution: a, deps: t })
    ] });
  const c = t.helpers.TaskHelper.multipleTaskAnswerSeparator, m = le(a, c, (g) => t.global.translateTasks(g)), b = K(n, c);
  let h = 0;
  return /* @__PURE__ */ s.jsxs("div", { className: i.container, "data-template-id": l, "data-mode": "solution", children: [
    /* @__PURE__ */ s.jsx(O, { title: e.title, deps: t }),
    /* @__PURE__ */ s.jsx(V, { task: e, deps: t }),
    /* @__PURE__ */ s.jsx(de, { userAnswer: b.join(" ; "), correctAnswer: ne(m), deps: t }),
    /* @__PURE__ */ s.jsx("div", { ref: p, className: i.tableWrapper, children: /* @__PURE__ */ s.jsx("table", { className: X({
      id: l != null ? l : "table.plain",
      mode: "solution",
      removeBorders: o.removeBorders,
      removePadding: o.removePadding
    }), style: {
      width: l === "table.mixed" ? "100%" : (
        // the answer row is the same phrase as the task row
        (l != null ? l : "table.plain") === "table.plain" && o.removeBorders ? void 0 : o.width
      )
    }, "data-testid": "task-table", children: /* @__PURE__ */ s.jsx("tbody", { children: o.rows.map((g, v) => /* @__PURE__ */ s.jsx("tr", { children: g.cells.map((R, S) => {
      var W, d, w;
      const L = R === "answercell", y = typeof R == "string" ? R : t.global.translateTasks(R), B = L ? h++ : -1, T = l === "table.grid" ? v < o.rows.length - 1 : l === "table.multiRow" || l === "table.multiRowSvg" ? v === 0 : !1;
      return /* @__PURE__ */ s.jsx("td", { className: Y({
        id: l != null ? l : "table.plain",
        mode: "solution",
        isInput: L,
        isFirstCell: S === 0,
        isLastCell: S === g.cells.length - 1,
        isHeaderRow: T,
        isLastRow: v === o.rows.length - 1,
        content: L ? void 0 : y
      }), colSpan: ((W = g.colspan_list) == null ? void 0 : W[S]) || 1, rowSpan: ((d = g.rowspan_list) == null ? void 0 : d[S]) || 1, children: L ? /* @__PURE__ */ s.jsx(se, { className: ee({
        id: l != null ? l : "table.plain",
        mode: "solution"
      }), children: (w = m[B]) != null ? w : "" }) : /* @__PURE__ */ s.jsx(F, { content: y }) }, S);
    }) }, v)) }) }) }),
    /* @__PURE__ */ s.jsx(J, { solution: a, deps: t })
  ] });
}, xe = (e) => {
  const t = G.c(3), n = C.useRef(null);
  let a, l;
  return t[0] !== e ? (a = () => {
    var m;
    const p = n.current;
    if (!e || !p)
      return;
    const o = () => {
      for (const b of Array.from(p.querySelectorAll("tr"))) {
        b.removeAttribute("data-wrap"), b.style.removeProperty("--group-width");
        const h = Array.from(b.querySelectorAll(":scope > [data-group]")), g = h.filter(we), v = g.length ? g : h;
        if (h.length < 2 || b.scrollWidth <= b.clientWidth + 1)
          continue;
        const R = Math.min(b.clientWidth, Math.ceil(Math.max(...v.map(ve))));
        b.style.setProperty("--group-width", `${R}px`), b.setAttribute("data-wrap", "");
      }
    };
    o(), (m = document.fonts) == null || m.ready.then(o);
    let c = p.getBoundingClientRect().width;
    const u = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(() => {
      const b = p.getBoundingClientRect().width;
      Math.abs(b - c) < 1 || (c = b, o());
    });
    return u == null || u.observe(p), () => u == null ? void 0 : u.disconnect();
  }, l = [e], t[0] = e, t[1] = a, t[2] = l) : (a = t[1], l = t[2]), C.useLayoutEffect(a, l), n;
};
function we(e) {
  return e.dataset.group === "glued";
}
function ve(e) {
  return e.getBoundingClientRect().width;
}
const Re = () => {
  const e = G.c(4), t = C.useRef(null), [n, a] = C.useState(!1);
  let l, p;
  e[0] === Symbol.for("react.memo_cache_sentinel") ? (l = () => {
    const c = t.current;
    if (!c)
      return;
    const u = () => a(c.scrollLeft + c.clientWidth < c.scrollWidth - 1);
    u(), c.addEventListener("scroll", u, {
      passive: !0
    });
    const m = typeof ResizeObserver == "undefined" ? null : new ResizeObserver(u);
    return m == null || m.observe(c), c.firstElementChild && (m == null || m.observe(c.firstElementChild)), () => {
      c.removeEventListener("scroll", u), m == null || m.disconnect();
    };
  }, p = [], e[0] = l, e[1] = p) : (l = e[0], p = e[1]), C.useEffect(l, p);
  let o;
  return e[2] !== n ? (o = {
    ref: t,
    hiddenRight: n
  }, e[2] = n, e[3] = o) : o = e[3], o;
}, U = /* @__PURE__ */ new Set(["table.inline", "table.mixed"]), Se = /* @__PURE__ */ new Set(["table.grid", "table.multiRow", "table.multiRowSvg"]), je = {
  from: 4
}, Ne = ({
  id: e
}) => {
  const t = ({
    task: n,
    deps: a,
    answer: l,
    onChange: p,
    mathInput: o
  }) => {
    const {
      ref: c,
      hiddenRight: u
    } = Re();
    te(c);
    const m = xe(U.has(e)), b = ie();
    if (ae(n.solution))
      return /* @__PURE__ */ s.jsx(ge, { task: n, deps: a, answer: l, solution: n.solution, templateId: e });
    const h = n.description.table;
    if (!h)
      return /* @__PURE__ */ s.jsxs("div", { className: i.container, "data-template-id": e, "data-mode": "input", children: [
        /* @__PURE__ */ s.jsx(O, { title: n.title, deps: a }),
        /* @__PURE__ */ s.jsx(Z, { task: n, deps: a })
      ] });
    const g = a.helpers.TaskHelper.multipleTaskAnswerSeparator, {
      bindRef: v,
      handleChange: R
    } = re({
      onChange: p,
      separator: g,
      mathInput: o
    }), S = K(l, g);
    let L = 0;
    const y = e === "table.list" && h.rows.every(({
      cells: d
    }) => d.length === 2 && d[0] === "answercell" && d[1] !== "answercell"), B = (d) => b.from === null || !Se.has(e) ? b : h.rows.some(({
      cells: A
    }) => {
      const f = A[d];
      if (f === void 0 || f === "answercell") return !1;
      const _ = typeof f == "string" ? f : a.global.translateTasks(f);
      return /\d{5,}/.test(_.replace(new RegExp("(?<=\\d)[ \\u00a0]+(?=\\d{3})", "g"), ""));
    }) ? je : b, T = (d) => e === "table.grid" ? d < h.rows.length - 1 : e === "table.multiRow" || e === "table.multiRowSvg" ? d === 0 : !1, W = (d) => h.rows.some(({
      cells: w
    }, A) => {
      const f = w[d];
      return !T(A) || f === void 0 || f === "answercell" ? !1 : ue(typeof f == "string" ? f : a.global.translateTasks(f));
    });
    return /* @__PURE__ */ s.jsxs("div", { className: i.container, "data-template-id": e, "data-mode": "input", children: [
      /* @__PURE__ */ s.jsx(O, { title: n.title, deps: a }),
      /* @__PURE__ */ s.jsx(Z, { task: n, deps: a }),
      /* @__PURE__ */ s.jsx("div", { className: i.tableFrame, "data-hidden-right": u || void 0, children: /* @__PURE__ */ s.jsx("div", { ref: c, className: i.tableWrapper, "data-ntm-table-scroll": !0, children: /* @__PURE__ */ s.jsx("table", { ref: m, className: X({
        id: e,
        mode: "input",
        removeBorders: h.removeBorders,
        removePadding: h.removePadding
      }), style: {
        width: e === "table.list" || e === "table.mixed" || e === "table.inline" ? "100%" : (
          // A borderless table.plain row is a phrase and sizes to
          // its content; the backend flag is ignored (.equationStretch).
          e === "table.plain" && h.removeBorders ? void 0 : h.width
        )
      }, "data-testid": "task-table", "data-field-column": y || void 0, children: /* @__PURE__ */ s.jsx("tbody", { children: h.rows.map((d, w) => {
        var I, k;
        const A = T(w), f = (r, x, j) => Y({
          content: j,
          id: e,
          mode: "input",
          isInput: x,
          isFirstCell: r === 0,
          isLastCell: r === d.cells.length - 1,
          isHeaderRow: A,
          isLastRow: w === h.rows.length - 1,
          inWrappingColumn: x && W(r)
        }), _ = () => {
          var x;
          const r = L++;
          return /* @__PURE__ */ s.jsx(ce, { id: `table-input-${r}`, ref: v(`table-input-${r}`), formula: (x = S[r]) != null ? x : "", onMathFieldChanged: R, className: ee({
            id: e,
            mode: "input"
          }) });
        }, E = (r) => typeof r == "string" ? r : a.global.translateTasks(r), D = [], z = U.has(e), H = d.cells.indexOf("answercell");
        let q = 0;
        z && H > 0 && (D.push(/* @__PURE__ */ s.jsx("td", { className: i.cellLead, children: d.cells.slice(0, H).map((r, x) => /* @__PURE__ */ s.jsx("span", { className: f(x, !1), children: /* @__PURE__ */ s.jsx(F, { content: E(r) }) }, x)) }, "lead")), q = H);
        for (let r = q; r < d.cells.length; r++) {
          const x = d.cells[r], j = x === "answercell", P = d.cells[r + 1];
          if (j && U.has(e) && P !== void 0 && P !== "answercell") {
            D.push(/* @__PURE__ */ s.jsxs("td", { className: i.cellGlued, "data-group": "glued", children: [
              /* @__PURE__ */ s.jsx("span", { className: f(r, !0), children: _() }),
              /* @__PURE__ */ s.jsx("span", { className: f(r + 1, !1), children: /* @__PURE__ */ s.jsx(F, { content: E(P) }) })
            ] }, r)), r++;
            continue;
          }
          D.push(/* @__PURE__ */ s.jsx("td", { className: f(r, j, j ? void 0 : E(x)), colSpan: ((I = d.colspan_list) == null ? void 0 : I[r]) || 1, rowSpan: ((k = d.rowspan_list) == null ? void 0 : k[r]) || 1, "data-group": z && j ? "" : void 0, children: /* @__PURE__ */ s.jsx(oe, { value: B(r), children: j ? _() : /* @__PURE__ */ s.jsx(F, { content: E(x) }) }) }, r));
        }
        return /* @__PURE__ */ s.jsx("tr", { children: D }, w);
      }) }) }) }) })
    ] });
  };
  return t.displayName = e, t;
};
export {
  Ne as c
};
