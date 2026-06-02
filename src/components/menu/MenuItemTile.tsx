import { formatMoney } from '../../lib/money'
import { showServesCountOnMenuCard } from '../../lib/menuDisplay'
import type { MenuItem } from '../../types/menu'
import { MenuItemTileImage } from './MenuItemTileImage'

interface Props {
  item: MenuItem
  onSelect: () => void
}

/**
 * Horizontal ezCater-style card: whole surface is one button (opens customize).
 * Text + image on top with gap-x-6; price and + share a bottom row so nothing overlaps the image.
 */
export function MenuItemTile({ item, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group flex h-full min-h-[180px] w-full flex-col rounded-lg px-3 py-6 text-left outline-none transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 sm:px-4"
    >
      <div className="flex min-h-0 flex-1 flex-row gap-x-6">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-sm font-bold leading-snug text-stone-900 lg:text-base">{item.name}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 lg:mt-2 lg:gap-2">
            {item.most_ordered && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900 lg:text-[11px]">
                Most ordered
              </span>
            )}
            {item.packaging_type === 'Individual' && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-900 lg:text-[11px]">
                Individual packaging
              </span>
            )}
            {item.dietary_tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-semibold text-stone-800 lg:text-[11px]"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="mt-3 min-h-0 flex-1 text-sm leading-relaxed text-stone-600 line-clamp-4">
            {item.description}
          </p>
        </div>

        <div className="shrink-0 self-start pt-0.5">
          <MenuItemTileImage item={item} variant="square" className="mx-0" />
        </div>
      </div>

      <div className="mt-5 flex shrink-0 flex-row items-center justify-between gap-4 pt-1">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-base font-bold text-stone-900 lg:text-lg">{formatMoney(item.price)}</p>
          {showServesCountOnMenuCard(item) && (
            <p className="text-[11px] text-stone-500 lg:text-xs">
              Serves <span className="font-semibold text-stone-800">{item.serves_count}</span>
            </p>
          )}
        </div>
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-900 text-xl font-light leading-none text-white shadow-md ring-1 ring-stone-900/15 transition group-hover:bg-stone-800"
          aria-hidden
        >
          +
        </span>
      </div>
    </button>
  )
}
