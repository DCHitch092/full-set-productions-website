/**
 * /brand-shapes — internal design-system reference page.
 * Shows all logo-derived embellishments: bullets, shapes, and icon housings.
 */

import {
  FDiamond,
  SHalfCircle,
  LOblong,
  LogoBullet,
  LogoBulletList,
  SplitCircleIcon,
  SplitCircleNumber,
} from "@/components/brand-shapes"
import {
  Shield,
  ClipboardCheck,
  Sparkles,
  Wrench,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react"

// Brand palette pulled directly from CSS vars for the demo
const COLORS = {
  blue:   "var(--color-blue)",
  teal:   "var(--color-teal)",
  pink:   "var(--color-pink)",
  coral:  "var(--color-coral)",
  yellow: "var(--color-yellow)",
}

export default function BrandShapesPage() {
  return (
    <main className="min-h-screen bg-background font-sans">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="border-b border-border bg-card px-6 py-8 sm:px-10 lg:px-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Design System
        </p>
        <h1 className="font-serif text-4xl text-foreground text-balance">
          Brand Shape Assets
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
          Embellishments derived from the Full Set Productions logo letterforms —
          the diamond of the&nbsp;<strong>F</strong>, the tilted half-circle of the&nbsp;<strong>S</strong>,
          and the oblong cap of the&nbsp;<strong>L</strong>.
        </p>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-14 sm:px-10 lg:px-8 space-y-20">

        {/* ── Section 1: Primitive Shapes ──────────────── */}
        <section>
          <SectionLabel>Primitive Logo Shapes</SectionLabel>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-lg leading-relaxed">
            The three core shapes extracted from the logo letterforms. Each is an SVG component
            that accepts a <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">size</code> and <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">color</code> prop.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* F Diamond */}
            <ShapeCard label="F Diamond" note="Rotated square — from the letter F">
              <div className="flex items-center gap-4">
                {(["xs","sm","md","lg","xl"] as const).map((s) => (
                  <FDiamond key={s} size={s} color={COLORS.coral} />
                ))}
              </div>
            </ShapeCard>

            {/* S Half-Circle */}
            <ShapeCard label="S Half-Circle" note="Tilted half-circle — from the letter S">
              <div className="flex items-center gap-4">
                {(["xs","sm","md","lg","xl"] as const).map((s) => (
                  <SHalfCircle key={s} size={s} color={COLORS.teal} />
                ))}
              </div>
            </ShapeCard>

            {/* L Oblong */}
            <ShapeCard label="L Oblong" note="Wide pill rectangle — from the letter L">
              <div className="flex flex-col gap-3">
                {(["xs","sm","md","lg","xl"] as const).map((s) => (
                  <LOblong key={s} size={s} color={COLORS.blue} />
                ))}
              </div>
            </ShapeCard>
          </div>
        </section>

        {/* ── Section 2: Bullet System ─────────────────── */}
        <section>
          <SectionLabel>Bullet System</SectionLabel>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-lg leading-relaxed">
            Bullets cycle through all three shapes in order — diamond → half-circle → oblong —
            then repeat. Use <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">LogoBulletList</code> as a drop-in for plain <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">&lt;ul&gt;</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Default colour (primary) */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Default (primary)
              </p>
              <LogoBulletList
                items={[
                  "Durable builds that survive hundreds of resets",
                  "Clear documentation and staff handover",
                  "Operator-friendly control systems",
                  "Immersive storytelling that serves the game",
                ]}
              />
            </div>

            {/* Teal colour */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Teal accent
              </p>
              <LogoBulletList
                bulletColor={COLORS.teal}
                items={[
                  "Set design and prop fabrication",
                  "Puzzle systems and tech integration",
                  "Theme consultation and creative direction",
                  "On-site installation and testing",
                ]}
              />
            </div>

            {/* Coral colour */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Coral accent
              </p>
              <LogoBulletList
                bulletColor={COLORS.coral}
                items={[
                  "Escape rooms and puzzle experiences",
                  "Immersive theatre and live events",
                  "Museum installations",
                ]}
              />
            </div>

            {/* Individual bullet shapes */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Shape override
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <LogoBullet shape="diamond" size="md" color={COLORS.coral} />
                  <span className="text-muted-foreground">Diamond bullet (F shape)</span>
                </li>
                <li className="flex items-center gap-3">
                  <LogoBullet shape="halfcircle" size="md" color={COLORS.teal} />
                  <span className="text-muted-foreground">Half-circle bullet (S shape)</span>
                </li>
                <li className="flex items-center gap-3">
                  <LogoBullet shape="oblong" size="md" color={COLORS.blue} />
                  <span className="text-muted-foreground">Oblong bullet (L shape)</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── Section 3: Split-Circle Icon Housing ──────── */}
        <section>
          <SectionLabel>Split-Circle Icon Housing</SectionLabel>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-lg leading-relaxed">
            The circle is split diagonally at an angle matching the S motif.
            Two brand colours meet at the cut, giving each icon a distinctive,
            on-brand housing instead of a plain solid circle.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            <IconCard label="Built for reliability">
              <SplitCircleIcon
                size={64}
                colorA={COLORS.teal}
                colorB={COLORS.blue}
                angle={35}
              >
                <Shield className="h-6 w-6" strokeWidth={1.75} />
              </SplitCircleIcon>
            </IconCard>

            <IconCard label="Clear process">
              <SplitCircleIcon
                size={64}
                colorA={COLORS.coral}
                colorB={COLORS.teal}
                angle={35}
              >
                <ClipboardCheck className="h-6 w-6" strokeWidth={1.75} />
              </SplitCircleIcon>
            </IconCard>

            <IconCard label="Immersive storytelling">
              <SplitCircleIcon
                size={64}
                colorA={COLORS.pink}
                colorB={COLORS.coral}
                angle={35}
              >
                <Sparkles className="h-6 w-6" strokeWidth={1.75} />
              </SplitCircleIcon>
            </IconCard>

            <IconCard label="Operator handover">
              <SplitCircleIcon
                size={64}
                colorA={COLORS.blue}
                colorB={COLORS.pink}
                angle={35}
              >
                <Wrench className="h-6 w-6" strokeWidth={1.75} />
              </SplitCircleIcon>
            </IconCard>
          </div>

          {/* Angle variations */}
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Angle variations
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              {[20, 35, 50, 65].map((angle) => (
                <div key={angle} className="flex flex-col items-center gap-2">
                  <SplitCircleIcon
                    size={56}
                    colorA={COLORS.teal}
                    colorB={COLORS.coral}
                    angle={angle}
                  >
                    <Star className="h-5 w-5" strokeWidth={1.75} />
                  </SplitCircleIcon>
                  <span className="text-xs text-muted-foreground">{angle}°</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Split-Circle Number Badges ─────── */}
        <section>
          <SectionLabel>Split-Circle Step Numbers</SectionLabel>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-lg leading-relaxed">
            Process step badges using the same split-circle motif. These replace the
            plain primary-colour circles in the Steps modular block.
          </p>

          <div className="flex flex-wrap gap-6 items-end">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex flex-col items-center gap-3">
                <SplitCircleNumber
                  number={n}
                  size={72}
                  colorA="var(--color-primary)"
                  colorB="var(--color-secondary)"
                  angle={35}
                />
                <span className="text-xs text-muted-foreground">Step {n}</span>
              </div>
            ))}
          </div>

          {/* Colour cycle across theme colours */}
          <div className="mt-8 rounded-xl border border-border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Theme colour pairings
            </p>
            <div className="flex flex-wrap gap-8 items-end">
              <NumberDemo n={1} a={COLORS.blue}   b={COLORS.teal}  label="Blue / Teal" />
              <NumberDemo n={2} a={COLORS.teal}   b={COLORS.coral} label="Teal / Coral" />
              <NumberDemo n={3} a={COLORS.coral}  b={COLORS.pink}  label="Coral / Pink" />
              <NumberDemo n={4} a={COLORS.pink}   b={COLORS.blue}  label="Pink / Blue" />
              <NumberDemo n={5} a={COLORS.yellow} b={COLORS.coral} label="Yellow / Coral" />
            </div>
          </div>
        </section>

        {/* ── Section 5: In-context feature strip ───────── */}
        <section>
          <SectionLabel>In-Context Preview</SectionLabel>
          <p className="mt-2 mb-8 text-sm text-muted-foreground max-w-lg leading-relaxed">
            How the components look together in a typical features-with-icons layout.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { icon: Shield,        label: "Built for reliability",         body: "Design decisions are made with durability, reset time, and day-to-day operation in mind.", a: COLORS.teal,  b: COLORS.blue  },
              { icon: ClipboardCheck,label: "Clear process, fewer surprises", body: "We scope projects carefully and keep the build practical.",                                 a: COLORS.coral, b: COLORS.teal  },
              { icon: Sparkles,      label: "Immersion that serves the game", body: "Story, puzzles, and set design work together so players stay engaged.",                     a: COLORS.pink,  b: COLORS.coral },
              { icon: Wrench,        label: "Operator-friendly handover",     body: "You get clear documentation, training, and systems that staff can run confidently.",         a: COLORS.blue,  b: COLORS.pink  },
            ].map(({ icon: Icon, label, body, a, b }) => (
              <div key={label} className="flex flex-col items-center text-center gap-4">
                <SplitCircleIcon size={64} colorA={a} colorB={b} angle={35}>
                  <Icon className="h-6 w-6" strokeWidth={1.75} />
                </SplitCircleIcon>
                <h3 className="font-semibold text-foreground text-sm leading-snug text-balance">
                  {label}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          {/* Bullet list in context */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <h3 className="text-2xl font-semibold text-foreground text-balance mb-6">
                What we bring to every project
              </h3>
              <LogoBulletList
                bulletColor={COLORS.teal}
                items={[
                  "Durable, reset-proof set construction",
                  "Integrated puzzle and tech systems",
                  "Full documentation and staff training",
                  "On-site installation and sign-off",
                  "Post-opening support and maintenance advice",
                ]}
              />
            </div>
            <div className="rounded-xl bg-muted p-6 flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Arrow embellishment
              </p>
              <div className="flex items-center gap-3 text-foreground font-medium">
                <FDiamond size="sm" color={COLORS.coral} />
                <span>Explore our services</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 text-foreground font-medium">
                <SHalfCircle size="sm" color={COLORS.teal} />
                <span>View past projects</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 text-foreground font-medium">
                <LOblong size="xs" color={COLORS.blue} />
                <span>Get in touch</span>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}

// ─── Small local helper components ───────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-serif text-2xl text-foreground flex items-center gap-3">
      <FDiamond size="xs" color="var(--color-primary)" />
      {children}
    </h2>
  )
}

function ShapeCard({
  label,
  note,
  children,
}: {
  label: string
  note: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
      <div>
        <p className="font-semibold text-foreground text-sm">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{note}</p>
      </div>
      {children}
    </div>
  )
}

function IconCard({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center gap-3 text-center">
      {children}
      <p className="text-xs text-muted-foreground leading-snug">{label}</p>
    </div>
  )
}

function NumberDemo({
  n,
  a,
  b,
  label,
}: {
  n: number
  a: string
  b: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <SplitCircleNumber number={n} size={60} colorA={a} colorB={b} angle={35} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
