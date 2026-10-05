import Image from "next/image";
import manifest from "@/lib/character-manifest.json";
import { characterAlt, characterFile, characterSrc, type CharacterRef, type Variant } from "@/lib/characters";
import { cn } from "@/lib/utils";

type Props = {
  of: CharacterRef;
  /** `exhaust` for large placements, `noexhaust` for small ones. */
  variant?: Variant;
  /** Display height in CSS pixels; width follows the sprite's aspect ratio. */
  height: number;
  /** Decorative repeats get empty alt text. */
  decorative?: boolean;
  priority?: boolean;
  className?: string;
};

export default function Character({ of, variant = "noexhaust", height, decorative = false, priority = false, className }: Props) {
  const dims = (manifest as Record<string, { width: number; height: number }>)[characterFile(of, variant)];
  const width = Math.round((dims.width / dims.height) * height);
  return (
    <Image
      src={characterSrc(of, variant)}
      alt={decorative ? "" : characterAlt(of)}
      width={width}
      height={height}
      priority={priority}
      draggable={false}
      className={cn("select-none", className)}
    />
  );
}
