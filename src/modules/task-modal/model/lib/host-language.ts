import type { Global } from '@/types/global'

/**
 * The pupil's language as the site's old window puts it into a request on a
 * task — the check, the solution, the video (TaskModalOld.jsx): `school` on
 * qalan.school, otherwise the site's short name — `kaz`, `rus`, `uzb`, `kgz`,
 * `aze`, `ar-eg`, `ar-sa`; a language without one goes as it is (`english`).
 *
 * The site's `Api.checkAnswer(task)` and `Api.getTaskSolution(task)` read the
 * language from the task object only, never from an argument after it: until
 * 2.5.5 the new window passed it as the third argument and the answer went to
 * the backend without a language.
 */
export const hostLanguage = (
  global: Pick<Global, 'isLocationQalanSchool' | 'getAbbreviatedLanguage'>,
): string =>
  global.isLocationQalanSchool() ? 'school' : global.getAbbreviatedLanguage()
