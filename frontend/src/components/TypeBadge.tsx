import type { EventType } from "@/lib/types";
import { TYPE_META } from "@/lib/types";
import { TYPE_STYLE } from "@/lib/typeStyles";

export function TypeBadge({ type }: { type: EventType }) {
  const meta = TYPE_META[type];
  const style = TYPE_STYLE[type];
  return (
    <span className={`chip ${style.soft}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {meta.label}
    </span>
  );
}
