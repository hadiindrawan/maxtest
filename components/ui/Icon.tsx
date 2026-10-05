import {
  ArrowRight,
  Check,
  ChartColumn,
  Copy,
  Eye,
  FileText,
  ListChecks,
  Mail,
  MessageCircle,
  Minus,
  Pencil,
  Play,
  Plug,
  Plus,
  Search,
  Trash2,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  "arrow-right": ArrowRight,
  check: Check,
  "chart-column": ChartColumn,
  copy: Copy,
  eye: Eye,
  "file-text": FileText,
  "list-checks": ListChecks,
  mail: Mail,
  "message-circle": MessageCircle,
  minus: Minus,
  pencil: Pencil,
  play: Play,
  plug: Plug,
  plus: Plus,
  search: Search,
  "trash-2": Trash2,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

type Props = {
  name: IconName;
  size?: number;
  /** Give the icon an accessible name only when it carries meaning on its own; otherwise it is hidden from assistive tech. */
  label?: string;
  className?: string;
};

/** The only way pages use icons: monochrome Lucide in `currentColor` (design rule 3). */
export default function Icon({ name, size = 16, label, className }: Props) {
  const Cmp = ICONS[name];
  return (
    <Cmp
      width={size}
      height={size}
      strokeWidth={2}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn("shrink-0", className)}
    />
  );
}
