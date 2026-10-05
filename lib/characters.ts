export const POSES = ["main", "idle", "smile"] as const;
export const ROLES = ["writer", "runner", "detective", "scribe", "reporter", "guard", "pass", "fail"] as const;

export type Pose = (typeof POSES)[number];
export type Role = (typeof ROLES)[number];
export type Variant = "exhaust" | "noexhaust";
export type CharacterRef = { kind: "max"; pose: Pose } | { kind: "cast"; role: Role };

export const ROLE_LABEL: Record<Role, string> = {
  writer: "The Writer",
  runner: "The Runner",
  detective: "The Detective",
  scribe: "The Scribe",
  reporter: "The Reporter",
  guard: "The Gatekeeper",
  pass: "A passed test",
  fail: "A failed test",
};

const POSE_MOOD: Record<Pose, string> = {
  main: "the Maxtest rocket mascot",
  idle: "the Maxtest rocket mascot",
  smile: "the Maxtest rocket mascot, smiling",
};

export function characterFile(ref: CharacterRef, variant: Variant): string {
  const stem = ref.kind === "max" ? `max-${ref.pose}` : `cast-${ref.role}`;
  return `${stem}${variant === "noexhaust" ? "-noexhaust" : ""}.png`;
}

export function characterSrc(ref: CharacterRef, variant: Variant): string {
  return `/characters/${characterFile(ref, variant)}`;
}

export function characterAlt(ref: CharacterRef): string {
  return ref.kind === "max" ? `Max, ${POSE_MOOD[ref.pose]}` : `${ROLE_LABEL[ref.role]}, a rocket character`;
}

export function allCharacterFiles(): string[] {
  const refs: CharacterRef[] = [
    ...POSES.map((pose) => ({ kind: "max", pose }) as const),
    ...ROLES.map((role) => ({ kind: "cast", role }) as const),
  ];
  return refs.flatMap((ref) => (["exhaust", "noexhaust"] as const).map((v) => characterFile(ref, v)));
}
