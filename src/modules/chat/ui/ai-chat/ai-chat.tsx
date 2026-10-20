import BrokenHeartIcon from '@/assets/icons/header/heart-broken-color.svg'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { FlexRow } from '@/ui/layout/flex-row/flex-row'

import { ChatLayout } from '../common/chat-layout/chat-layout'
import { ChatInput } from '../common/input/chat-input'

import s from './ai-chat.module.scss'
import { getMessageNodes } from './model/lib'
import { useAiChat } from './model/use-ai-chat'

interface Props {
  props: TaskModalProps
}

export const AiChat = ({ props }: Props) => {
  const {
    messages,
    isTheorySet,
    isHintShown,
    isSolutionShown,
    handleSend,
    handleViewExample,
    handleShowAnswer,
    addMessages,
  } = useAiChat({ props })

  const shouldShowActions = !isHintShown || !isSolutionShown

  const messageNodes = getMessageNodes(messages)
  const messageKeys = messages.map((message) => message.id)

  return (
    <ChatLayout
      messageNodes={messageNodes}
      messageKeys={messageKeys}
      isLoading={!isTheorySet}
    >
      {shouldShowActions && (
        <FlexRow className={s.buttons}>
          {!isHintShown && (
            <button className={s.button} onClick={handleViewExample}>
              <FlexRow>
                <BrokenHeartIcon />
              </FlexRow>
              {/* Two words, two lines in the wide chat column (Alisher,
                  20.10): both quick replies the same height. Inline spans
                  render as plain text everywhere else — one
                  flex item, as the bare text was. */}
              <span>
                <span className={s.word}>Смотреть</span>{' '}
                <span className={s.word}>пример</span>
              </span>
            </button>
          )}

          {!isSolutionShown && (
            <button className={s.button} onClick={handleShowAnswer}>
              <FlexRow>
                <BrokenHeartIcon />
                <BrokenHeartIcon />
              </FlexRow>
              <span>
                <span className={s.word}>Показать</span>{' '}
                <span className={s.word}>ответ</span>
              </span>
            </button>
          )}
        </FlexRow>
      )}

      <ChatInput
        onSend={handleSend}
        onAddMessage={addMessages}
        deps={props.deps}
      />
    </ChatLayout>
  )
}
