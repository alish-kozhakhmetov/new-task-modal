import clsx from 'clsx'
import { useKeenSlider } from 'keen-slider/react'
import { useState, type ReactNode, type RefObject } from 'react'

import styles from './slider.module.scss'

interface Props {
  slides: ReactNode[]
  ref?: RefObject<HTMLDivElement | null>
  className?: string
  /** Name of each page for its pagination dot (screen readers, Tab). */
  slideLabels?: string[]
}

const INITIAL = 1

export const Slider = ({ slides, ref, className, slideLabels }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(INITIAL)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    initial: INITIAL,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  const changeSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index)
  }

  return (
    <div ref={ref} className={className}>
      <div ref={sliderRef} className="keen-slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="keen-slider__slide"
            // Off-screen pages stay out of Tab and screen readers (rule 96).
            inert={index !== currentSlide}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        {/* A dot is a button: named by its page, the shown one marked
            (rule 96 — they were unnamed buttons in the Tab order). */}
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={slideLabels?.[index] ?? String(index + 1)}
            aria-current={currentSlide === index ? 'true' : undefined}
            onClick={() => changeSlide(index)}
            className={clsx(
              styles.dot,
              currentSlide === index ? styles.active : styles.inactive,
            )}
          />
        ))}
      </div>
    </div>
  )
}
