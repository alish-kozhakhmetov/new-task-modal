import { Fragment } from 'react'

import BrokenHeartIcon from '@/assets/icons/header/heart-broken-color.svg'
import type { TaskModalProps } from '@/modules/task-modal/model/types/props'
import { FlexRow } from '@/ui/layout/flex-row/flex-row'

import { useChatDraft } from '../../model/use-chat-draft'
import { ChatLayout } from '../common/chat-layout/chat-layout'
import { ChatInput } from '../common/input/chat-input'

import s from './ai-chat.module.scss'
import { getMessageNodes } from './model/lib'
import { useAiChat } from './model/use-ai-chat'

interface Props {
  props: TaskModalProps
  isPinned?: boolean
}

// Each word its own span: two words, two lines in the wide chat column. The
// space between them is a text node beside the words, as in 2.5.1 — inside a
// wrapper span with the next word, the accessible name lost it
// («Смотретьпример»: the Trainer › Tests story could not find the button).
const Words = ({ text }: { text: string }) => (
  <>
    {text.split(' ').map((w, i) => (
      <Fragment key={i}>
        {i ? ' ' : null}
        <span className={s.word}>{w}</span>
      </Fragment>
    ))}
  </>
)

export const AiChat = ({ props, isPinned = false }: Props) => {
  const draft = useChatDraft('ai')
  const {
    t,
    messages,
    isTheorySet,
    awardTheoryCoin,
    isHintShown,
    isSolutionShown,
    handleSend,
    handleViewExample,
    handleShowAnswer,
    addMessages,
  } = useAiChat({ props, isPinned })

  const shouldShowActions = !isHintShown || !isSolutionShown

  const messageNodes = getMessageNodes(messages, awardTheoryCoin)
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
                <Words text={t('viewExample')} />
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
                <Words text={t('showAnswer')} />
              </span>
            </button>
          )}
        </FlexRow>
      )}

      <ChatInput
        onSend={handleSend}
        onAddMessage={addMessages}
        deps={props.deps}
        draft={draft}
      />
    </ChatLayout>
  )
}
