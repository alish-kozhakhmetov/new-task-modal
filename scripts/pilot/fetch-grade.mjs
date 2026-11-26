/**
 * Grade pilot, step 1: the grade's lessons and tasks from test.qalan.kz, once.
 *
 *   node scripts/pilot/fetch-grade.mjs --grade=5 [--lessons] [--answers]
 *
 * - account: ~/.config/qalan/test-account.env (QALAN_TEST_BASE / LOGIN /
 *   PASSWORD / COUNTRY), read here only; values are never printed or written.
 * - only a test host: the password and the token go nowhere else.
 * - GET /lessons/:id/tasks writes the lesson's progress to the session's owner
 *   (the test pupil): every lesson is fetched once and cached in
 *   .pilot-cache/ (not in git); a cached lesson is never fetched again.
 * - the reference answer comes from the sandbox POST /tasks/testing<n>/answers
 *   with a wrong answer «0»: it writes no progress and answers `answerString`
 *   (result 30 — «0» was right, the reference is «0»).
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '../..')
const CACHE = path.join(ROOT, '.pilot-cache')

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=')
    return [k, v ?? true]
  }),
)
const GRADE = Number(args.grade ?? 5)

const ENV_FILE =
  process.env.QALAN_TEST_ENV_FILE ||
  path.join(os.homedir(), '.config', 'qalan', 'test-account.env')

const readEnv = () =>
  Object.fromEntries(
    fs
      .readFileSync(ENV_FILE, 'utf8')
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => {
        const i = l.indexOf('=')
        return [
          l.slice(0, i).trim(),
          l
            .slice(i + 1)
            .trim()
            .replace(/^(["'])(.*)\1$/, '$2'),
        ]
      }),
  )

const isTestHost = (h) =>
  /^(localhost|127\.0\.0\.1)$|\.localhost$|(^|\.)(test)\./.test(h)

const normalizePhone = (s) => {
  let d = String(s).replace(/\D/g, '')
  if (d.length === 11 && d.startsWith('8')) d = '7' + d.slice(1)
  if (d.length === 10) d = '7' + d
  return d
}

const env = readEnv()
const BASE = new URL(env.QALAN_TEST_BASE || 'https://test.qalan.kz').origin
if (!isTestHost(new URL(BASE).hostname)) {
  console.error('not a test host — stop')
  process.exit(1)
}
const API = `${BASE}/api`
const secrets = []
const redact = (s) =>
  secrets.reduce((acc, x) => (x ? acc.split(x).join('***') : acc), String(s))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let TOKEN = ''
async function api(p, { method = 'GET', body, noRetry = false } = {}) {
  // test goes down for minutes at a time (502 from Cloudflare): wait it out,
  // up to ~15 minutes per request; the requests are idempotent
  for (let attempt = 0; ; attempt++) {
    let r
    try {
      r = await fetch(`${API}${p}`, {
        method,
        headers: {
          Accept: 'application/json',
          'x-client-version': '1.8',
          ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      })
    } catch {
      r = null
    }
    const down = !r || r.status === 502 || r.status === 503 || r.status === 504
    if (down && !noRetry && attempt < 45) {
      if (attempt % 6 === 0) console.log(`  test is down (${r?.status ?? 'network'}) on ${p.split('?')[0]}, waiting`)
      await sleep(20000)
      continue
    }
    const text = await r.text()
    let json = null
    try {
      json = JSON.parse(text)
    } catch {
      /* not json */
    }
    return { status: r.status, json, text: redact(text.slice(0, 300)) }
  }
}

const unwrap = (j) =>
  j && typeof j === 'object' && !Array.isArray(j) && j.message && typeof j.message === 'object'
    ? j.message
    : j

async function login() {
  secrets.push(env.QALAN_TEST_PASSWORD, env.QALAN_TEST_LOGIN)
  const r = await api('/users/login', {
    method: 'POST',
    body: {
      phoneNumber: normalizePhone(env.QALAN_TEST_LOGIN),
      password: env.QALAN_TEST_PASSWORD,
      countryCode: env.QALAN_TEST_COUNTRY || 'kz',
    },
  })
  const j = unwrap(r.json)
  if (!j?.token) throw new Error(`login failed: HTTP ${r.status}`)
  TOKEN = j.token
  secrets.push(TOKEN)
  const u = j.user || {}
  // booleans only — no names, no ids
  console.log('account:', {
    pupil: Boolean(u.pupil),
    teacher: Boolean(u.isTeacher),
    employee: Boolean(u.employee && Object.values(u.employee).some((v) => v != null && v !== false && v !== '')),
    pupilGrade: u.pupil?.class?.grade ?? u.pupil?.grade ?? null,
  })
  return u
}

/** test is up: a cheap GET answers without 5xx (waits up to ~15 min) */
async function healthy() {
  for (let i = 0; i < 45; i++) {
    const r = await fetch(`${API}/chatMessages/last`, { headers: { 'x-client-version': '1.8', Authorization: `Bearer ${TOKEN}` } }).catch(() => null)
    if (r && r.status < 500) return true
    if (i % 6 === 0) console.log(`  test is down (${r?.status ?? 'network'}), waiting`)
    await sleep(20000)
  }
  return false
}

async function pool(items, n, fn) {
  let i = 0
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const k = i++
        await fn(items[k], k)
      }
    }),
  )
}

const writeJson = (f, o) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(o, null, 1))
}

async function main() {
  fs.mkdirSync(CACHE, { recursive: true })
  const user = await login()
  if (!user.pupil && !args['allow-non-pupil']) {
    console.error('the account is not a pupil — lesson GETs would write progress to someone else; stop')
    process.exit(1)
  }

  const chaptersFile = path.join(CACHE, `grade-${GRADE}-chapters.json`)
  let chapters
  if (fs.existsSync(chaptersFile)) {
    chapters = JSON.parse(fs.readFileSync(chaptersFile, 'utf8'))
  } else {
    // the site's own list: GET /courses/1/grades/:g/chapters (chaptersWithLessons
    // of all grades answers 502 on test)
    const r = await api(`/courses/1/grades/${GRADE}/chapters?language=rus`)
    if (r.status !== 200) throw new Error(`chapters: HTTP ${r.status} ${r.text}`)
    const j = unwrap(r.json)
    const list = Array.isArray(j) ? j : j?.chapters ?? []
    chapters = list.map((c) => ({
      ...c,
      grade: GRADE,
      lessons: c.lessons ?? (c.units ?? []).flatMap((u) => u.lessons ?? []),
    }))
    writeJson(chaptersFile, chapters)
  }
  const gradeChapters = chapters.filter((c) => Number(c.grade) === GRADE)
  const lessons = gradeChapters.flatMap((c) =>
    (c.lessons || []).map((l) => ({ chapterId: c.id, chapterTitle: c.title, lesson: l })),
  )
  console.log(
    `grade ${GRADE}: ${gradeChapters.length} chapters, ${lessons.length} lessons (all grades: ${chapters.length} chapters)`,
  )
  writeJson(path.join(CACHE, `grade-${GRADE}-lessons.json`), {
    grade: GRADE,
    chapters: gradeChapters.map((c) => ({
      id: c.id,
      title: c.title?.rus ?? c.title,
      published: c.published,
      lessons: (c.lessons || []).map((l) => ({ id: l.id, title: l.title?.rus ?? l.title, published: l.published, hasTasks: l.hasTasks })),
    })),
  })
  if (!args.lessons) return

  const lessonDir = path.join(CACHE, `grade-${GRADE}`, 'lessons')
  const isDone = (id) => {
    const f = path.join(lessonDir, `${id}.json`)
    if (!fs.existsSync(f)) return false
    return args['retry-failed'] ? JSON.parse(fs.readFileSync(f, 'utf8')).status === 200 : true
  }
  const todo = lessons.filter((x) => !isDone(x.lesson.id))
  console.log(`lessons to fetch: ${todo.length} (cached: ${lessons.length - todo.length})`)
  let done = 0
  const failed = []
  // one lesson at a time, test healthy before each; a lesson that answers
  // 5xx is cached with its status and not asked again (it may be the one
  // that takes test down: --retry-failed asks once more)
  const suspects = []
  await pool(todo, 1, async (x) => {
    if (!(await healthy())) throw new Error('test stays down')
    const t0 = Date.now()
    const r = await api(`/lessons/${x.lesson.id}/tasks?language=rus`, { noRetry: true })
    const j = unwrap(r.json)
    const tasks = Array.isArray(j) ? j : j?.tasks
    writeJson(path.join(lessonDir, `${x.lesson.id}.json`), {
      chapterId: x.chapterId,
      lessonId: x.lesson.id,
      lessonTitle: x.lesson.title?.rus ?? x.lesson.title,
      status: r.status,
      ms: Date.now() - t0,
      error: r.status === 200 ? null : r.text,
      tasks: tasks ?? [],
    })
    if (r.status !== 200) {
      failed.push(`${x.lesson.id}:${r.status}`)
      // did test go down right after it?
      const after = await fetch(`${API}/chatMessages/last`, { headers: { 'x-client-version': '1.8', Authorization: `Bearer ${TOKEN}` } }).catch(() => null)
      suspects.push(`${x.lesson.id}: HTTP ${r.status} in ${Date.now() - t0} ms, test after it: ${after?.status ?? 'network'}`)
      console.log(`  lesson ${x.lesson.id}: HTTP ${r.status} (${Date.now() - t0} ms), test after: ${after?.status ?? 'network'}`)
    }
    done++
    if (done % 10 === 0) console.log(`  ${done}/${todo.length}`)
  })
  if (suspects.length) writeJson(path.join(CACHE, `grade-${GRADE}`, 'lesson-failures.json'), suspects)
  console.log(`lessons fetched: ${done}, failed: ${failed.length} ${failed.join(' ')}`)

  if (!args.answers) return
  const refFile = path.join(CACHE, `grade-${GRADE}`, 'reference.json')
  const refs = fs.existsSync(refFile) ? JSON.parse(fs.readFileSync(refFile, 'utf8')) : {}
  const jobs = []
  for (const f of fs.readdirSync(lessonDir)) {
    const l = JSON.parse(fs.readFileSync(path.join(lessonDir, f), 'utf8'))
    for (const t of l.tasks) {
      const key = `${l.lessonId}/${t.id}`
      if (refs[key]?.answer != null) continue
      if (!t.fields || !t.type) continue
      jobs.push({ key, type: t.type, fields: t.fields })
    }
  }
  console.log(`references to fetch: ${jobs.length}`)
  let n = 0
  let sinceDown = 0
  await pool(jobs, 2, async (job, k) => {
    const r = await api(`/tasks/testing${k}/answers`, {
      method: 'POST',
      noRetry: true,
      body: { type: job.type, fields: job.fields, answer: '0', language: 'rus' },
    })
    const j = unwrap(r.json) || {}
    if (j.answerString != null && j.answerString !== 'error') refs[job.key] = { answer: String(j.answerString), result: j.result }
    else if (j.result === 30) refs[job.key] = { answer: '0', result: 30 }
    else if (r.status >= 500 || r.status === 0) {
      // not cached: asked again on the next run
      console.log(`  sandbox ${job.type}: HTTP ${r.status}`)
      await healthy()
    } else refs[job.key] = { answer: null, status: r.status, result: j.result ?? null, error: j.answerString === 'error' ? 'error' : r.text.slice(0, 120) }
    n++
    if (n % 200 === 0) {
      console.log(`  ${n}/${jobs.length}`)
      writeJson(refFile, refs)
    }
    sinceDown++
  })
  writeJson(refFile, refs)
  const got = Object.values(refs).filter((x) => x.answer != null).length
  console.log(`references: ${got} of ${Object.keys(refs).length}`)
}

main().catch((e) => {
  console.error(redact(e?.stack || e))
  process.exit(1)
})
