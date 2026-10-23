# 📖 API Reference: TaskModalController

Основная точка входа библиотеки `@qalan/new-task-modal`.

---

## 🚀 Сигнатура вызова

```typescript
import TaskModalController from '@qalan/new-task-modal'

TaskModalController(props: TaskModalProps): void
```

Функция ищет элемент с id `task-modal-wrapper` в DOM хост-приложения и монтирует в него React Root с модальным окном задания.

Хост перерисовывает контроллер на каждый свой `setState` и на смену адреса. Пока окно открыто в том же `task-modal-wrapper`, повторный вызов его не пересобирает (2.5.5): задачи окно ведёт в своём хранилище, а не в состоянии хоста.

---

## 📋 TaskModalProps

```typescript
export interface TaskModalProps {
  activeTask: Task
  deps: TaskModalDependencies
  state: TaskModalState
  setState: SetTaskModalState
  hostProps: TaskModalHostProps
  actions: TaskModalActions
  closeModal: () => void
}
```

| Параметр | Тип | Описание |
| :--- | :--- | :--- |
| `activeTask` | `Task` | Объект активного задания (ID, текст, данные). |
| `deps` | `TaskModalDependencies` | Внешние инжектируемые сервисы (API, локализация, тосты). |
| `state` | `TaskModalState` | Текущее состояние модального окна от хоста. |
| `setState` | `SetTaskModalState` | Состояние хоста. Окно зовёт его при закрытии (`userProgress`) и на каждом переходе к следующей задаче — `{ activeTask, tasks, lockVersion, userProgress }`, `activeTask` — объект из `tasks` (2.5.5); сайт по нему пишет `?taskIndex=` в адрес. |
| `hostProps` | `TaskModalHostProps` | Метаданные хоста (ID урока, устройство, версия). |
| `actions` | `TaskModalActions` | Набор коллбэков и методов взаимодействия. |
| `closeModal` | `() => void` | Функция для размонтирования и закрытия модалки. |

---

## 🛠️ TaskModalActions

| Метод | Сигнатура | Описание |
| :--- | :--- | :--- |
| `onLoadLesson` | `() => void` | Загрузка данных текущего урока. |
| `onTaskAnswerChanged` | `(answer: any) => void` | Обработка изменения ответа пользователем. |
| `onCheckAnswer` | `() => void` | Отправка ответа на проверку на бэкенд. |
| `onShowNextTask` | `(progress?: number) => void` | Переход к следующему заданию. |
| `onShowPrevTask` | `() => void` | Переход к предыдущему заданию. |
| `onShowSolution` | `() => void` | Показать подробное текстовое решение. |
| `onShowVideoExplanation` | `() => void` | Открыть видео-разбор задания. |
| `onOpenTheoryModal` | `() => void` | Открыть панель теории урока. |

---

## 🔗 TaskModalDependencies (`deps`)

| Поле | Тип | Описание |
| :--- | :--- | :--- |
| `api` | `HttpClient` | HTTP-клиент для запросов к бэкенду. |
| `localize` | `(key: string) => string` | Функция перевода строк. |
| `toast` | `ToastService` | Всплывающие уведомления. |
| `socketController` | `SocketController` | WebSocket контроллер для чата. |
| `eventEmitter` | `EventEmitter` | Шина межкомпонентных событий. |
