"use client";
import { COLORS } from "@/lib/data";
import { PriceEntry } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  sizes: number[];
  entries: PriceEntry[];
  filter: { hairType: string; laceType: string; texture: string };
  onCellTap: (size: number, colorCode: string, colorName: string) => void;
  visibleColors: string[];
}

export function PriceTable({
  sizes,
  entries,
  filter,
  onCellTap,
  visibleColors,
}: Props) {
  const colors = COLORS.filter((c) => visibleColors.includes(c.code));

  const entryFor = (size: number, color: string) =>
    entries.find(
      (e) =>
        e.hairType === filter.hairType &&
        e.laceType === filter.laceType &&
        e.texture === filter.texture &&
        e.size === size &&
        e.colorCode === color
    );

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <table className="border-separate border-spacing-1">
        <thead>
          <tr>
            <th className="sticky left-0 bg-neutral-950 z-10 text-left text-[10px] uppercase tracking-widest text-neutral-500 px-2 py-2 min-w-[50px]">
              Size
            </th>
            {colors.map((c) => (
              <th
                key={c.code}
                className="text-center px-2 py-2 min-w-[76px] align-bottom"
              >
                <div className="text-[11px] uppercase tracking-widest text-neutral-300 font-semibold">
                  {c.code}
                </div>
                <div className="text-[9px] text-neutral-500 mt-0.5 leading-tight max-w-[72px] mx-auto">
                  {c.name}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sizes.map((size) => (
            <tr key={size}>
              <td className="sticky left-0 bg-neutral-950 z-10 text-sm font-medium text-neutral-200 px-2 py-2">
                {size}&quot;
              </td>
              {colors.map((color) => {
                const entry = entryFor(size, color.code);
                return (
                  <td key={color.code} className="p-0">
                    <button
                      onClick={() => onCellTap(size, color.code, color.name)}
                      className={cn(
                        "w-full min-h-[56px] rounded-lg border transition text-center px-1 py-1.5 flex flex-col items-center justify-center",
                        entry
                          ? "bg-orange-500/10 border-orange-500/40 hover:bg-orange-500/20"
                          : "bg-white/[0.02] border-white/10 hover:bg-white/5"
                      )}
                    >
                      {entry ? (
                        <>
                          <span className="text-sm font-semibold text-orange-400 leading-none">
                            {entry.price}
                          </span>
                          {entry.bulkPrice && (
                            <span className="text-[9px] text-orange-400/70 mt-0.5 leading-none">
                              {entry.bulkPrice}
                              {entry.bulkQuantity
                                ? `@${entry.bulkQuantity}`
                                : ""}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-neutral-600 text-lg leading-none">
                          +
                        </span>
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}