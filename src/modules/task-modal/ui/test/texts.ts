/**
 * Texts of the lesson test. The site's Localization has only «Завершить» and
 * «Уверены завершить?» — the rest is new; Russian, on «вы» (ux-copy). Other
 * languages — from the site's Localization when the test ships (open question).
 */
export const TEST_TEXTS = {
  next: 'Далее',
  skip: 'Пропустить',
  finish: 'Завершить',
  confirmTitle: 'Завершить тест?',
  confirmAllAnswered: 'Ответы на все задачи сохранены.',
  confirmUnanswered: (n: number, total: number) =>
    `Без ответа ${n} из ${total}. Задачи без ответа не засчитаются.`,
  confirmYes: 'Завершить тест',
  confirmBack: 'Вернуться к задачам',
  timeLeft: 'Осталось',
  passed: 'Тест пройден, вы молодец!',
  failed: (pass: number) =>
    `Тест не пройден. Проходной результат — ${pass}\u00a0%. Повторите практику и попробуйте снова`,
  result: 'Результат',
  answered: 'Ответы',
  retake: 'Пересдать тест',
  repeatPractice: 'Повторить практику',
  close: 'Закрыть',
}
