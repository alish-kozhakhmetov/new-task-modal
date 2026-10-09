import { useLayoutEffect, useRef } from 'react'

import type { TaskModalDependencies } from '@/modules/task-modal/model/types/props'

import type { ComplexImagePart } from '../../lib/types.task'
import styles from '../complex.module.scss'

import { cropSvgToContent } from './crop-svg'

interface Props {
  part: ComplexImagePart
  deps: TaskModalDependencies
}

const htmlFromContent = (
  content: ComplexImagePart['content'],
  deps: TaskModalDependencies,
): string => {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return ''
  return deps.global.translateTasks(content)
}

/** Display-only image / SVG part (no countable click UI for grade 4). */
export const ImagePart = ({ part, deps }: Props) => {
  // A picture is cropped to its drawing like a bare plane (rule on empty
  // space around figures). Countable sets (array content) are not touched:
  // their items sit at positions the click layer relies on.
  const pictureRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const root = pictureRef.current
    if (!root) return
    root
      .querySelectorAll<SVGSVGElement>(':scope > div > svg')
      .forEach((svg) => {
        cropSvgToContent(svg)
      })
  })

  const repeat = Math.max(1, Number(part.repeatQuantity) || 1)
  const backgroundImage = part.backgroundImage ?? null
  const size =
    typeof part.manuallySetSize === 'number' ? part.manuallySetSize : part.size

  if (Array.isArray(part.content)) {
    return (
      <div
        className={styles.imageOverlay}
        data-figure-type="160"
        data-testid="complex-image-part"
      >
        {backgroundImage ? (
          <div dangerouslySetInnerHTML={{ __html: backgroundImage }} />
        ) : null}
        <div className={styles.imagePart}>
          {part.content.map((item, index) => (
            <div
              key={index}
              style={size ? { width: size, height: size } : undefined}
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </div>
      </div>
    )
  }

  const html = htmlFromContent(part.content, deps)
  if (!html) return null

  return (
    <div
      ref={pictureRef}
      className={styles.imagePart}
      data-figure-type="160"
      data-testid="complex-image-part"
    >
      {Array.from({ length: repeat }, (_, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: html }} />
      ))}
    </div>
  )
}
