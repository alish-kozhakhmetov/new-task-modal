var ke = Object.defineProperty, Re = Object.defineProperties;
var Fe = Object.getOwnPropertyDescriptors;
var ye = Object.getOwnPropertySymbols;
var Me = Object.prototype.hasOwnProperty, Pe = Object.prototype.propertyIsEnumerable;
var Ne = (a, t, l) => t in a ? ke(a, t, { enumerable: !0, configurable: !0, writable: !0, value: l }) : a[t] = l, X = (a, t) => {
  for (var l in t || (t = {}))
    Me.call(t, l) && Ne(a, l, t[l]);
  if (ye)
    for (var l of ye(t))
      Pe.call(t, l) && Ne(a, l, t[l]);
  return a;
}, de = (a, t) => Re(a, Fe(t));
import { c as ie, r as V, f as ce, j as i, am as ue, e as Ae, an as Be, ao as xe, o as Ie, d as Se, k as He, h as Le, ap as $e, aq as Ee, a as We } from "./index-wRluoD-s.js";
import { S as Oe } from "./shared-solution-body-9WuuvhSD.js";
const Qe = "_text_1ig89_2", Ze = "_separator_1ig89_2", Ge = "_root_1ig89_13", Je = "_condition_1ig89_19", Ke = "_imageBefore_1ig89_32", qe = "_answer_1ig89_41", De = "_board_1ig89_52", Ue = "_zone_1ig89_69", Ve = "_zoneEmpty_1ig89_79", Xe = "_zoneWithPicture_1ig89_83", Ye = "_zonePicture_1ig89_88", et = "_zoneItems_1ig89_97", tt = "_zoneItemsFromTop_1ig89_112", ot = "_zoneItemsBelow_1ig89_117", st = "_zoneItemsLego_1ig89_123", lt = "_zoneItemsColumn_1ig89_131", nt = "_pool_1ig89_146", at = "_itemImage_1ig89_152", it = "_itemImageSized_1ig89_166", rt = "_poolGhost_1ig89_175", ct = "_zoneItem_1ig89_97", mt = "_poolItem_1ig89_184", dt = "_zoneItemButton_1ig89_206", ft = "_poolItemTaken_1ig89_258", ut = "_field_1ig89_264", pt = "_input_1ig89_271", p = {
  text: Qe,
  separator: Ze,
  root: Ge,
  condition: Je,
  imageBefore: Ke,
  answer: qe,
  board: De,
  zone: Ue,
  zoneEmpty: Ve,
  zoneWithPicture: Xe,
  zonePicture: Ye,
  zoneItems: et,
  zoneItemsFromTop: tt,
  zoneItemsBelow: ot,
  zoneItemsLego: st,
  zoneItemsColumn: lt,
  pool: nt,
  itemImage: at,
  itemImageSized: it,
  poolGhost: rt,
  zoneItem: ct,
  poolItem: mt,
  zoneItemButton: dt,
  poolItemTaken: ft,
  field: ut,
  input: pt
}, fe = (a) => {
  const t = ie.c(11), {
    html: l,
    scale: e,
    width: n
  } = a, s = e === void 0 ? 1 : e, u = n && p.itemImageSized;
  let m;
  t[0] !== u ? (m = ce(p.itemImage, u), t[0] = u, t[1] = m) : m = t[1];
  let h;
  t[2] !== s || t[3] !== n ? (h = n ? {
    "--cbi-w": `${n}px`
  } : s < 1 ? {
    "--cbi-scale": s
  } : void 0, t[2] = s, t[3] = n, t[4] = h) : h = t[4];
  let r;
  t[5] !== l ? (r = {
    __html: l
  }, t[5] = l, t[6] = r) : r = t[6];
  let c;
  return t[7] !== m || t[8] !== h || t[9] !== r ? (c = /* @__PURE__ */ i.jsx("span", { className: m, style: h, "aria-hidden": !0, dangerouslySetInnerHTML: r }), t[7] = m, t[8] = h, t[9] = r, t[10] = c) : c = t[10], c;
}, _e = (a) => {
  const t = ie.c(55), {
    zone: l,
    pool: e,
    taken: n,
    canAdd: s,
    layout: u,
    separator: m,
    perRow: h,
    zonePicture: r,
    placement: c,
    labels: d,
    onAdd: o,
    onRemove: x
  } = a;
  let f;
  t[0] !== h ? (f = {
    "--cbi-per-row": h
  }, t[0] = h, t[1] = f) : f = t[1];
  const g = f;
  let B;
  t[2] !== c.left || t[3] !== c.right || t[4] !== c.top || t[5] !== r ? (B = r ? X(X(X({}, c.top ? {
    top: c.top,
    bottom: "auto"
  } : {}), c.left ? {
    left: c.left,
    right: "auto"
  } : {}), c.right ? {
    right: c.right,
    left: "auto"
  } : {}) : {}, t[2] = c.left, t[3] = c.right, t[4] = c.top, t[5] = r, t[6] = B) : B = t[6];
  const _ = B, S = V.useRef(null), j = V.useRef(null), [w, F] = V.useState(!1), y = c.top && parseFloat(c.top) / 100 || 0;
  let N;
  t[7] !== y || t[8] !== r ? (N = () => {
    const I = S.current, $ = j.current;
    if (!r || !I || !$)
      return;
    const H = () => {
      const J = I.clientHeight * (1 - y);
      F(J > 0 && $.scrollHeight > J + 1);
    };
    if (H(), typeof ResizeObserver == "undefined")
      return;
    const T = new ResizeObserver(H);
    return T.observe(I), () => T.disconnect();
  }, t[7] = y, t[8] = r, t[9] = N) : N = t[9];
  let C;
  t[10] !== y || t[11] !== l.length || t[12] !== r ? (C = [r, y, l.length], t[10] = y, t[11] = l.length, t[12] = r, t[13] = C) : C = t[13], V.useLayoutEffect(N, C);
  const M = l.length === 0 && !r && p.zoneEmpty, R = r && p.zoneWithPicture;
  let b;
  t[14] !== M || t[15] !== R ? (b = ce(p.zone, M, R), t[14] = M, t[15] = R, t[16] = b) : b = t[16];
  const L = d.zone;
  let v;
  t[17] !== r ? (v = r ? /* @__PURE__ */ i.jsx("div", { ref: S, className: p.zonePicture, "aria-hidden": !0, dangerouslySetInnerHTML: {
    __html: r
  } }) : null, t[17] = r, t[18] = v) : v = t[18];
  const A = u === "lego" && p.zoneItemsLego, k = u === "column" && p.zoneItemsColumn, E = c.top && p.zoneItemsFromTop, P = w && p.zoneItemsBelow;
  let Q;
  t[19] !== A || t[20] !== k || t[21] !== E || t[22] !== P ? (Q = ce(p.zoneItems, A, k, E, P), t[19] = A, t[20] = k, t[21] = E, t[22] = P, t[23] = Q) : Q = t[23];
  const D = w ? void 0 : _, re = w ? "true" : void 0;
  let Z;
  if (t[24] !== d.remove || t[25] !== u || t[26] !== x || t[27] !== m || t[28] !== l) {
    let I;
    t[30] !== d.remove || t[31] !== u || t[32] !== x || t[33] !== m ? (I = ($, H) => {
      const {
        item: T,
        removable: J
      } = $;
      return /* @__PURE__ */ i.jsxs(V.Fragment, { children: [
        m && H > 0 ? /* @__PURE__ */ i.jsx("span", { className: p.separator, "aria-hidden": !0, children: "," }) : null,
        x && J ? /* @__PURE__ */ i.jsx("button", { type: "button", className: ce(p.zoneItem, p.zoneItemButton), "aria-label": d.remove, "data-testid": "cbi-zone-item", "data-index": T.index, onClick: () => x(H), children: /* @__PURE__ */ i.jsx(fe, { html: T.html, scale: T.scale, width: u === "column" ? T.columnWidth : void 0 }) }) : /* @__PURE__ */ i.jsx("span", { className: p.zoneItem, "data-testid": "cbi-zone-item", "data-index": T.index, "data-locked": J ? void 0 : "true", children: /* @__PURE__ */ i.jsx(fe, { html: T.html, scale: T.scale, width: u === "column" ? T.columnWidth : void 0 }) })
      ] }, `${T.index}-${H}`);
    }, t[30] = d.remove, t[31] = u, t[32] = x, t[33] = m, t[34] = I) : I = t[34], Z = l.map(I), t[24] = d.remove, t[25] = u, t[26] = x, t[27] = m, t[28] = l, t[29] = Z;
  } else
    Z = t[29];
  let W;
  t[35] !== Q || t[36] !== D || t[37] !== re || t[38] !== Z ? (W = /* @__PURE__ */ i.jsx("div", { className: Q, style: D, ref: j, "data-spill": re, children: Z }), t[35] = Q, t[36] = D, t[37] = re, t[38] = Z, t[39] = W) : W = t[39];
  let G;
  t[40] !== d.zone || t[41] !== W || t[42] !== b || t[43] !== v ? (G = /* @__PURE__ */ i.jsxs("div", { className: b, role: "group", "aria-label": L, "data-testid": "cbi-zone", children: [
    v,
    W
  ] }), t[40] = d.zone, t[41] = W, t[42] = b, t[43] = v, t[44] = G) : G = t[44];
  let K;
  t[45] !== s || t[46] !== d.add || t[47] !== o || t[48] !== e || t[49] !== n ? (K = o && e.length > 0 ? /* @__PURE__ */ i.jsx("div", { className: p.pool, "data-testid": "cbi-pool", children: e.map((I) => {
    var $, H;
    return n != null && n.has(I.index) ? /* @__PURE__ */ i.jsx("span", { className: ce(p.poolItem, p.poolItemTaken), "data-testid": "cbi-pool-slot", "aria-hidden": !0, children: /* @__PURE__ */ i.jsx("span", { className: p.poolGhost, children: /* @__PURE__ */ i.jsx(fe, { html: ($ = I.buttonHtml) != null ? $ : I.html, scale: I.buttonHtml ? 1 : I.scale }) }) }, I.index) : /* @__PURE__ */ i.jsx("button", { type: "button", className: p.poolItem, "aria-label": d.add, disabled: !s, "data-testid": "cbi-pool-item", "data-index": I.index, onClick: () => o(I), children: /* @__PURE__ */ i.jsx(fe, { html: (H = I.buttonHtml) != null ? H : I.html, scale: I.buttonHtml ? 1 : I.scale }) }, I.index);
  }) }) : null, t[45] = s, t[46] = d.add, t[47] = o, t[48] = e, t[49] = n, t[50] = K) : K = t[50];
  let U;
  return t[51] !== G || t[52] !== K || t[53] !== g ? (U = /* @__PURE__ */ i.jsxs("div", { className: p.board, style: g, children: [
    G,
    K
  ] }), t[51] = G, t[52] = K, t[53] = g, t[54] = U) : U = t[54], U;
}, Te = (a) => a.itemsMaxQuantity == null ? Number.NaN : Number(a.itemsMaxQuantity), gt = (a, t) => {
  if (a.withoutRemoveItem || Te(a) === 0) return "count";
  const l = a.constItem ? JSON.stringify(a.constItem.id) : null;
  if (l != null && t.pool.length > 0 && t.preplaced.some((m) => JSON.stringify(m.id) === l)) return "transform";
  const n = t.preplaced.length, s = Number(a.itemsCorrectQuantity) || 0, u = Number(a.itemsMinQuantity) || 0;
  return t.pool.length === 0 || s > 0 && s < n || u > 0 && n >= u ? "remove" : "add";
}, we = (a, t, l) => {
  if (a.withInputBefore || a.withoutRemoveItem) return !0;
  const e = Te(a), n = Number(a.itemsCorrectQuantity);
  return Number.isFinite(e) && t >= e ? !0 : Number.isFinite(n) && l === n;
}, be = (a) => {
  var l, e, n;
  const t = a.localize;
  return {
    add: (l = t == null ? void 0 : t.putItemIntoZone) != null ? l : "Положить",
    remove: (e = t == null ? void 0 : t.takeItemFromZone) != null ? e : "Убрать",
    zone: (n = t == null ? void 0 : t.itemZone) != null ? n : "Сюда"
  };
}, pe = (a) => {
  const t = ie.c(15), {
    task: l,
    model: e,
    deps: n
  } = a;
  let s;
  t[0] !== n || t[1] !== l.title ? (s = /* @__PURE__ */ i.jsx(We, { title: l.title, deps: n }), t[0] = n, t[1] = l.title, t[2] = s) : s = t[2];
  let u;
  t[3] !== e.textBefore ? (u = e.textBefore ? /* @__PURE__ */ i.jsx(Ie, { className: p.text, children: e.textBefore }) : null, t[3] = e.textBefore, t[4] = u) : u = t[4];
  let m;
  t[5] !== n || t[6] !== e.tableBefore ? (m = e.tableBefore ? /* @__PURE__ */ i.jsx(xe, { part: e.tableBefore, deps: n }) : null, t[5] = n, t[6] = e.tableBefore, t[7] = m) : m = t[7];
  let h;
  t[8] !== e.imageBefore ? (h = e.imageBefore ? /* @__PURE__ */ i.jsx("div", { className: p.imageBefore, dangerouslySetInnerHTML: {
    __html: e.imageBefore
  } }) : null, t[8] = e.imageBefore, t[9] = h) : h = t[9];
  let r;
  return t[10] !== s || t[11] !== u || t[12] !== m || t[13] !== h ? (r = /* @__PURE__ */ i.jsxs("div", { className: p.condition, children: [
    s,
    u,
    m,
    h
  ] }), t[10] = s, t[11] = u, t[12] = m, t[13] = h, t[14] = r) : r = t[14], r;
}, ze = (a) => ({
  layout: a.layout,
  separator: a.separator,
  perRow: a.perRow,
  zonePicture: a.zonePicture,
  placement: a.placement
}), ht = (a, t) => a.map((l) => t.catalog[l]).filter((l) => l != null), Ce = (a) => {
  const t = ie.c(43), {
    task: l,
    deps: e,
    translate: n
  } = a, s = l.solution;
  let u;
  t[0] !== l.description || t[1] !== n ? (u = ue(l.description, n), t[0] = l.description, t[1] = n, t[2] = u) : u = t[2];
  const m = u;
  if (s != null && typeof s == "object" && s.type === "calculateByImage" && Array.isArray(s.items)) {
    let x, f, g, B, _, S;
    if (t[3] !== e || t[4] !== m || t[5] !== s || t[6] !== l || t[7] !== n) {
      const N = ue(s, n);
      B = p.root, _ = "calculateByImage.solution", t[14] !== e || t[15] !== m || t[16] !== l ? (S = /* @__PURE__ */ i.jsx(pe, { task: l, model: m, deps: e }), t[14] = e, t[15] = m, t[16] = l, t[17] = S) : S = t[17], x = _e, t[18] !== m ? (f = ze(m), t[18] = m, t[19] = f) : f = t[19], g = N.preplaced.map(xt), t[3] = e, t[4] = m, t[5] = s, t[6] = l, t[7] = n, t[8] = x, t[9] = f, t[10] = g, t[11] = B, t[12] = _, t[13] = S;
    } else
      x = t[8], f = t[9], g = t[10], B = t[11], _ = t[12], S = t[13];
    let j;
    t[20] === Symbol.for("react.memo_cache_sentinel") ? (j = [], t[20] = j) : j = t[20];
    let w;
    t[21] !== e ? (w = be(e), t[21] = e, t[22] = w) : w = t[22];
    let F;
    t[23] !== x || t[24] !== f || t[25] !== g || t[26] !== w ? (F = /* @__PURE__ */ i.jsx(x, de(X({}, f), { zone: g, pool: j, canAdd: !1, labels: w })), t[23] = x, t[24] = f, t[25] = g, t[26] = w, t[27] = F) : F = t[27];
    let y;
    return t[28] !== B || t[29] !== _ || t[30] !== S || t[31] !== F ? (y = /* @__PURE__ */ i.jsxs("div", { className: B, "data-template-id": _, children: [
      S,
      F
    ] }), t[28] = B, t[29] = _, t[30] = S, t[31] = F, t[32] = y) : y = t[32], y;
  }
  let r;
  t[33] !== e || t[34] !== m || t[35] !== l ? (r = /* @__PURE__ */ i.jsx(pe, { task: l, model: m, deps: e }), t[33] = e, t[34] = m, t[35] = l, t[36] = r) : r = t[36];
  const c = l.solution;
  let d;
  t[37] !== e || t[38] !== c ? (d = /* @__PURE__ */ i.jsx(Oe, { solution: c, deps: e }), t[37] = e, t[38] = c, t[39] = d) : d = t[39];
  let o;
  return t[40] !== r || t[41] !== d ? (o = /* @__PURE__ */ i.jsxs("div", { className: p.root, "data-template-id": "calculateByImage.solution", children: [
    r,
    d
  ] }), t[40] = r, t[41] = d, t[42] = o) : o = t[42], o;
}, vt = ({
  id: a
}) => {
  const t = (l) => {
    const e = ie.c(56), {
      task: n,
      deps: s,
      answer: u,
      onChange: m
    } = l;
    let h;
    e[0] !== s.global ? (h = (v) => s.global.translateTasks(v), e[0] = s.global, e[1] = h) : h = e[1];
    const r = h;
    if (Ae(n.solution)) {
      let v;
      return e[2] !== s || e[3] !== n || e[4] !== r ? (v = /* @__PURE__ */ i.jsx(Ce, { task: n, deps: s, translate: r }), e[2] = s, e[3] = n, e[4] = r, e[5] = v) : v = e[5], v;
    }
    let c, d, o, x, f, g, B, _, S, j;
    if (e[6] !== u || e[7] !== s || e[8] !== m || e[9] !== n || e[10] !== r) {
      o = ue(n.description, r);
      const v = $e(u);
      j = v ? ht(v, o) : o.preplaced;
      const A = o.preplaced.length;
      let k;
      e[21] !== A || e[22] !== m ? (k = (P) => m(P.length > A ? Ee(P) : ""), e[21] = A, e[22] = m, e[23] = k) : k = e[23], d = k, S = o.oneTime ? new Set(j.slice(A).map(It)) : void 0, g = p.root, B = a, _ = /* @__PURE__ */ i.jsx(pe, { task: n, model: o, deps: s }), c = _e, e[24] !== o ? (x = ze(o), e[24] = o, e[25] = x) : x = e[25];
      let E;
      e[26] !== A ? (E = (P, Q) => ({
        item: P,
        removable: Q >= A
      }), e[26] = A, e[27] = E) : E = e[27], f = j.map(E), e[6] = u, e[7] = s, e[8] = m, e[9] = n, e[10] = r, e[11] = c, e[12] = d, e[13] = o, e[14] = x, e[15] = f, e[16] = g, e[17] = B, e[18] = _, e[19] = S, e[20] = j;
    } else
      c = e[11], d = e[12], o = e[13], x = e[14], f = e[15], g = e[16], B = e[17], _ = e[18], S = e[19], j = e[20];
    const w = o.pool, F = j.length < o.capacity;
    let y;
    e[28] !== s ? (y = be(s), e[28] = s, e[29] = y) : y = e[29];
    let N, C;
    e[30] !== d || e[31] !== j ? (N = (v) => d([...j, v]), C = (v) => d(j.filter((A, k) => k !== v)), e[30] = d, e[31] = j, e[32] = N, e[33] = C) : (N = e[32], C = e[33]);
    let M;
    e[34] !== c || e[35] !== o.pool || e[36] !== N || e[37] !== C || e[38] !== x || e[39] !== f || e[40] !== F || e[41] !== y || e[42] !== S ? (M = /* @__PURE__ */ i.jsx(c, de(X({}, x), { zone: f, pool: w, taken: S, canAdd: F, labels: y, onAdd: N, onRemove: C })), e[34] = c, e[35] = o.pool, e[36] = N, e[37] = C, e[38] = x, e[39] = f, e[40] = F, e[41] = y, e[42] = S, e[43] = M) : M = e[43];
    let R;
    e[44] !== s || e[45] !== o.tableAfter ? (R = o.tableAfter ? /* @__PURE__ */ i.jsx(xe, { part: o.tableAfter, deps: s }) : null, e[44] = s, e[45] = o.tableAfter, e[46] = R) : R = e[46];
    let b;
    e[47] !== o.textAfter ? (b = o.textAfter ? /* @__PURE__ */ i.jsx(Ie, { className: p.text, children: o.textAfter }) : null, e[47] = o.textAfter, e[48] = b) : b = e[48];
    let L;
    return e[49] !== M || e[50] !== R || e[51] !== b || e[52] !== g || e[53] !== B || e[54] !== _ ? (L = /* @__PURE__ */ i.jsxs("div", { className: g, "data-template-id": B, children: [
      _,
      M,
      R,
      b
    ] }), e[49] = M, e[50] = R, e[51] = b, e[52] = g, e[53] = B, e[54] = _, e[55] = L) : L = e[55], L;
  };
  return t.displayName = a, t;
}, jt = ({
  id: a
}) => {
  const t = (l) => {
    var ve, je;
    const e = ie.c(88), {
      task: n,
      deps: s,
      answer: u,
      onChange: m,
      mathInput: h
    } = l;
    let r;
    e[0] !== s.global ? (r = (z) => s.global.translateTasks(z), e[0] = s.global, e[1] = r) : r = e[1];
    const c = r, {
      description: d
    } = n;
    let o, x;
    e[2] !== d || e[3] !== c ? (o = ue(d, c), x = gt(d, o), e[2] = d, e[3] = c, e[4] = o, e[5] = x) : (o = e[4], x = e[5]);
    const f = x, [g, B] = V.useState(o.preplaced), [_, S] = V.useState(0);
    let j;
    e[6] !== d || e[7] !== o.preplaced.length ? (j = () => we(d, 0, o.preplaced.length), e[6] = d, e[7] = o.preplaced.length, e[8] = j) : j = e[8];
    const [w, F] = V.useState(j);
    if (Ae(n.solution)) {
      let z;
      return e[9] !== s || e[10] !== n || e[11] !== c ? (z = /* @__PURE__ */ i.jsx(Ce, { task: n, deps: s, translate: c }), e[9] = s, e[10] = n, e[11] = c, e[12] = z) : z = e[12], z;
    }
    let y;
    e[13] !== d || e[14] !== w ? (y = (z, O) => {
      B(z), S(O), !w && we(d, O, z.length) && F(!0);
    }, e[13] = d, e[14] = w, e[15] = y) : y = e[15];
    const N = y;
    let C;
    e[16] !== d.constItem ? (C = d.constItem ? JSON.stringify(d.constItem.id) : null, e[16] = d.constItem, e[17] = C) : C = e[17];
    const M = C;
    let R;
    e[18] !== M ? (R = (z) => JSON.stringify(z.id) === M, e[18] = M, e[19] = R) : R = e[19];
    const b = R, L = g.findIndex(b);
    let v;
    e[20] !== b || e[21] !== o.preplaced ? (v = o.preplaced.find(b), e[20] = b, e[21] = o.preplaced, e[22] = v) : v = e[22];
    const A = v, k = f === "add" ? o.preplaced.length : 0, E = Number(d.itemsMaxQuantity) || 0;
    let P;
    e[23] !== L || e[24] !== f || e[25] !== _ || e[26] !== N || e[27] !== g ? (P = (z) => {
      if (f === "transform") {
        if (L < 0)
          return;
        N(g.map((O, q) => q === L ? z : O), _ + 1);
        return;
      }
      N([...g, z], _ + 1);
    }, e[23] = L, e[24] = f, e[25] = _, e[26] = N, e[27] = g, e[28] = P) : P = e[28];
    const Q = P;
    let D;
    e[29] !== A || e[30] !== b || e[31] !== f || e[32] !== _ || e[33] !== N || e[34] !== g ? (D = (z) => {
      if (f === "transform") {
        if (!A || b(g[z]))
          return;
        N(g.map((O, q) => q === z ? A : O), Math.max(0, _ - 1));
        return;
      }
      if (f === "add") {
        N(g.filter((O, q) => q !== z), Math.max(0, _ - 1));
        return;
      }
      N(g.filter((O, q) => q !== z), _ + 1);
    }, e[29] = A, e[30] = b, e[31] = f, e[32] = _, e[33] = N, e[34] = g, e[35] = D) : D = e[35];
    const re = D, Z = f === "transform" ? L >= 0 : E === 0 || _ < E;
    let W;
    if (e[36] !== b || e[37] !== k || e[38] !== f || e[39] !== g) {
      let z;
      e[41] !== b || e[42] !== k || e[43] !== f ? (z = (O, q) => ({
        item: O,
        removable: f === "transform" ? !b(O) : f === "add" ? q >= k : f === "remove"
      }), e[41] = b, e[42] = k, e[43] = f, e[44] = z) : z = e[44], W = g.map(z), e[36] = b, e[37] = k, e[38] = f, e[39] = g, e[40] = W;
    } else
      W = e[40];
    const G = W, K = f !== "count", U = (ve = n.answerInput) == null ? void 0 : ve.before;
    let I;
    e[45] !== U || e[46] !== c ? (I = Be(U, c), e[45] = U, e[46] = c, e[47] = I) : I = e[47];
    const $ = I, H = (je = n.answerInput) == null ? void 0 : je.after;
    let T;
    e[48] !== H || e[49] !== c ? (T = Be(H, c), e[48] = H, e[49] = c, e[50] = T) : T = e[50];
    const J = T;
    let Y;
    e[51] !== s || e[52] !== o || e[53] !== n ? (Y = /* @__PURE__ */ i.jsx(pe, { task: n, model: o, deps: s }), e[51] = s, e[52] = o, e[53] = n, e[54] = Y) : Y = e[54];
    let ee;
    e[55] !== o ? (ee = ze(o), e[55] = o, e[56] = ee) : ee = e[56];
    let te;
    e[57] !== f || e[58] !== o.pool ? (te = f === "add" || f === "transform" ? o.pool : [], e[57] = f, e[58] = o.pool, e[59] = te) : te = e[59];
    let oe;
    e[60] !== s ? (oe = be(s), e[60] = s, e[61] = oe) : oe = e[61];
    const ge = K ? Q : void 0, he = K ? re : void 0;
    let se;
    e[62] !== Z || e[63] !== G || e[64] !== ee || e[65] !== te || e[66] !== oe || e[67] !== ge || e[68] !== he ? (se = /* @__PURE__ */ i.jsx(_e, de(X({}, ee), { zone: G, pool: te, canAdd: Z, labels: oe, onAdd: ge, onRemove: he })), e[62] = Z, e[63] = G, e[64] = ee, e[65] = te, e[66] = oe, e[67] = ge, e[68] = he, e[69] = se) : se = e[69];
    let le;
    e[70] !== s || e[71] !== o.tableAfter ? (le = o.tableAfter ? /* @__PURE__ */ i.jsx(xe, { part: o.tableAfter, deps: s }) : null, e[70] = s, e[71] = o.tableAfter, e[72] = le) : le = e[72];
    let ne;
    e[73] !== u || e[74] !== w || e[75] !== h || e[76] !== o.textAfter || e[77] !== m || e[78] !== $ || e[79] !== J ? (ne = w ? /* @__PURE__ */ i.jsxs(i.Fragment, { children: [
      o.textAfter ? /* @__PURE__ */ i.jsx(Ie, { className: p.text, children: o.textAfter }) : null,
      /* @__PURE__ */ i.jsxs("div", { className: p.field, "data-testid": "cbi-field", children: [
        $ ? /* @__PURE__ */ i.jsx(Se, { value: $ }) : null,
        /* @__PURE__ */ i.jsx(He, { ref: (z) => Le(z, h), formula: u, onMathFieldChanged: m, className: p.input }),
        J ? /* @__PURE__ */ i.jsx(Se, { value: J }) : null
      ] })
    ] }) : null, e[73] = u, e[74] = w, e[75] = h, e[76] = o.textAfter, e[77] = m, e[78] = $, e[79] = J, e[80] = ne) : ne = e[80];
    let ae;
    e[81] !== se || e[82] !== le || e[83] !== ne ? (ae = /* @__PURE__ */ i.jsxs("div", { className: p.answer, children: [
      se,
      le,
      ne
    ] }), e[81] = se, e[82] = le, e[83] = ne, e[84] = ae) : ae = e[84];
    let me;
    return e[85] !== Y || e[86] !== ae ? (me = /* @__PURE__ */ i.jsxs("div", { className: p.root, "data-template-id": a, children: [
      Y,
      ae
    ] }), e[85] = Y, e[86] = ae, e[87] = me) : me = e[87], me;
  };
  return t.displayName = a, t;
};
function xt(a) {
  return {
    item: a,
    removable: !1
  };
}
function It(a) {
  return a.index;
}
export {
  jt as a,
  vt as c
};
