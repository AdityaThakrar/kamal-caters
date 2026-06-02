import { useState } from 'react'

import type { MenuItem } from '../../types/menu'

interface Props {
  item: MenuItem
  className?: string
  /** `portrait` = modal / tall cards (352×528). `square` = list row thumbnail. */
  variant?: 'portrait' | 'square'
}

/**
 * Menu image: portrait tile for modals, or square crop for horizontal list cards.
 */
export function MenuItemTileImage({ item, className = '', variant = 'portrait' }: Props) {
  const [loadFailed, setLoadFailed] = useState(false)
  const showImg = Boolean(item.imageSrc) && !loadFailed

  const frame =
    variant === 'square'
      ? 'relative h-40 w-40 shrink-0 overflow-hidden rounded-xl bg-stone-200 ring-1 ring-stone-200/80 sm:h-44 sm:w-44'
      : 'relative mx-auto aspect-[352/528] w-full max-w-[352px] shrink-0 overflow-hidden rounded-xl bg-stone-200 ring-1 ring-stone-200/80'

  return (
    <div className={`${frame} ${className}`}>
      {showImg ? (
        <img
          src={item.imageSrc}
          alt={item.name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setLoadFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-stone-200 to-stone-300"
          aria-hidden
        >
          <div className="h-2/3 w-2/3 rounded-lg bg-stone-300/90 ring-1 ring-stone-400/40" />
          <span className="sr-only">No image</span>
        </div>
      )}
    </div>
  )
}
