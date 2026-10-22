// Снимки витрины тренажёра для Figma — переснимать после каждого выпуска пакета.
//   1) сторибук этой версии: npx storybook dev -p 6006 (или STORYBOOK_BASE)
//   2) node e2e/showcase/shoot.mjs [--out=папка] [--only=Text/plain,…]
// Кадры — e2e/showcase/frames.json; задача — первая задача 4 класса варианта (код 4_…).
// На каждый кадр 4 PNG: <ключ>--375-empty, --375-filled, --1440-empty, --1440-filled
// (ключ варианта, «/» → «__»). 375 — телефон; 1440 — широкая раскладка: чат, задача, черновик.
import { chromium } from 'playwright'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1]
const base = process.env.STORYBOOK_BASE || 'http://localhost:6006'
const root = new URL('../../', import.meta.url).pathname
const out = arg('out') || join(root, 'e2e/showcase/out')
const only = arg('only') ? arg('only').split(',') : null
const { frames } = JSON.parse(readFileSync(join(root, 'e2e/showcase/frames.json'), 'utf8'))
mkdirSync(out, { recursive: true })

// Верный ответ задачи — из фикстуры варианта (groups.json, задача группы = первая задача 4 класса)
const variantsSrc = readFileSync(join(root, 'src/modules/trainer/lib/trainer-variants.tsx'), 'utf8')
const groupsPath = {}
for (const m of variantsSrc.matchAll(/import (groups_\w+) from '@\/([^']+groups\.json)'/g)) groupsPath[m[1]] = join(root, 'src', m[2])
const groupsOf = {}
for (const m of variantsSrc.matchAll(/key: '([^']+)'[\s\S]*?groupsJson: (groups_\w+)/g)) groupsOf[m[1]] = groupsPath[m[2]]
const text = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? v.rus || '' : '')
function answerOf(variant, picked) {
  try {
    const groups = JSON.parse(readFileSync(groupsOf[variant], 'utf8'))
    const g = groups.find((x) => x.group === picked.group)
    if (!g || !g.tasks.length || g.tasks[0].id !== picked.task) return null
    const a = text(g.task.solution && g.task.solution.answer).replace(/\\[()]/g, '').trim()
    return a ? a.split(/;;|;/).map((x) => x.trim()) : null
  } catch (e) {
    return null
  }
}

const STORY = { 375: 'trainer-trainer--idle', 1440: 'trainer-trainer--wide-desktop-chat' }
const fileKey = (v) => v.replace(/\//g, '__')

async function pickTask(page) {
  // группа и задача 4 класса: первая задача с кодом 4_…
  const groups = await page.locator('[data-testid="trainer-group-select"] option').evaluateAll((os) => os.map((o) => o.value))
  for (const g of groups) {
    await page.selectOption('[data-testid="trainer-group-select"]', g)
    await page.waitForTimeout(400)
    const tasks = await page.locator('[data-testid="trainer-task-select"] option').evaluateAll((os) => os.map((o) => o.value))
    const t = tasks.find((x) => x.startsWith('4_'))
    if (t) {
      await page.selectOption('[data-testid="trainer-task-select"]', t)
      return { group: g, task: t }
    }
  }
  return null
}

// Заполненный ответ: тест — первый вариант; остальные — число в каждое поле ввода
async function fill(page, variant, answer) {
  if (variant.startsWith('Test/')) {
    // ответ теста — буква варианта: A → первый
    const i = answer && /^[A-Z]$/.test(answer[0]) ? answer[0].charCodeAt(0) - 65 : 0
    const opts = page.locator('[role="radio"], input[type="radio"], [data-variant]')
    if (await opts.count()) await opts.nth(Math.min(i, (await opts.count()) - 1)).click({ force: true })
    return
  }
  const inputs = page.locator('[data-input]')
  const n = await inputs.count()
  const sample = answer || (variant.startsWith('Comparison/') ? ['>'] : ['24', '8', '15', '6', '3'])
  for (let i = 0; i < n; i++) {
    await inputs.nth(i).click({ force: true })
    await page.keyboard.type(sample[i % sample.length])
    await page.waitForTimeout(150)
  }
}

const report = []
const browser = await chromium.launch()
for (const f of frames) {
  if (only && !only.includes(f.variant)) continue
  for (const w of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width: w, height: w === 375 ? 812 : 900 } })
    await page.goto(`${base}/iframe.html?id=${STORY[w]}&viewMode=story`, { waitUntil: 'load', timeout: 240000 })
    await page.waitForSelector('[data-testid="trainer-template-select"]', { timeout: 240000 })
    await page.selectOption('[data-testid="trainer-template-select"]', f.variant)
    await page.waitForTimeout(1500)
    const picked = await pickTask(page)
    await page.waitForTimeout(2500)
    await page.addStyleTag({ content: '[class*="toolbar"]{display:none!important}' })
    await page.waitForTimeout(300)
    const shot = (state) => page.screenshot({ path: join(out, `${fileKey(f.variant)}--${w}-${state}.png`) })
    await shot('empty')
    const answer = picked ? answerOf(f.variant, picked) : null
    await fill(page, f.variant, answer)
    await page.mouse.click(1, 1) // убрать фокус-кольцо с кнопки, не с поля
    // высокое условие прокручено к полю, как в приложении при вводе: в кадре виден ответ
    await page.waitForTimeout(500)
    await shot('filled')
    if (w === 375) report.push({ variant: f.variant, name: f.name, group: picked && picked.group, task: picked && picked.task, answer: answer ? answer.join(' ; ') : 'пример, не из задачи' })
    console.log(`${f.variant} ${w}: ${picked ? picked.task : 'нет задачи 4 класса'}`)
    await page.close()
  }
}
await browser.close()
writeFileSync(join(out, 'frames.json'), JSON.stringify(report, null, 2) + '\n')
