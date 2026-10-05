"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { isPlaceholder, PLANS, ROWS, YEARLY_DISCOUNT_LABEL, type Plan } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function Cell({ value }: { value: string }) {
  if (value === "yes") return <Icon name="check" size={16} label="Included" className="text-primary" />;
  if (value === "no") return <span aria-label="Not included">-</span>;
  if (isPlaceholder(value)) {
    return (
      <span className="border-b border-dashed border-primary" title="Placeholder, to be confirmed">
        {value}
      </span>
    );
  }
  return <>{value}</>;
}

const toggleBase = "px-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function PricingLedger({ signupHref }: { signupHref: string }) {
  const [yearly, setYearly] = useState(false);
  const period = yearly ? "yearly" : "monthly";
  const href = (plan: Plan) => (plan.cta.href === "signup" ? signupHref : plan.cta.href);
  const external = (plan: Plan) => /^(https?:|mailto:)/.test(href(plan));
  const priceUnit = (plan: Plan) => (plan.price.monthly.startsWith("Rp") ? "/mo" : "");

  return (
    <div>
      <div role="group" aria-label="Billing period" className="inline-flex overflow-hidden rounded-lg border-2 border-paper text-sm font-bold">
        <button type="button" aria-pressed={!yearly} onClick={() => setYearly(false)} className={cn(toggleBase, !yearly ? "bg-paper text-ink" : "text-paper")}>
          Monthly
        </button>
        <button type="button" aria-pressed={yearly} onClick={() => setYearly(true)} className={cn(toggleBase, yearly ? "bg-paper text-ink" : "text-paper")}>
          Yearly <span className={yearly ? "text-ink" : "text-primary"}>{YEARLY_DISCOUNT_LABEL}</span>
        </button>
      </div>

      {/* Wide screens: one comparison ledger */}
      <div className="mt-8 hidden grid-cols-[minmax(10rem,1.1fr)_repeat(3,minmax(0,1fr))] md:grid">
        <div />
        {PLANS.map((plan) => (
          <div key={plan.id} className={cn("px-4 pb-4 pt-3", plan.recommended ? "border-t-[3px] border-primary bg-panel" : "border-t-2 border-paper")}>
            <div className="flex items-baseline gap-2">
              <h3 className="font-bold text-paper">{plan.name}</h3>
              {plan.recommended && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Most teams</span>}
            </div>
            <p className="mt-2 font-headline text-2xl font-extrabold tracking-tight text-paper">
              {plan.price[period]}
              <span className="font-body text-sm font-normal text-paper/55">{priceUnit(plan)}</span>
            </p>
            <p className="h-4 text-xs text-paper/50">{plan.usd?.[period]}</p>
          </div>
        ))}
        {ROWS.map((row) => (
          <div key={row.id} className="contents">
            <div className="border-t border-hairline py-3 pr-4 text-sm text-paper/75">
              {row.label}
              {row.note && <span className="mt-1 block text-xs leading-relaxed text-paper/50">{row.note}</span>}
            </div>
            {PLANS.map((plan) => (
              <div key={plan.id} className={cn("border-t border-hairline px-4 py-3 text-sm text-paper", plan.recommended && "bg-panel")}>
                <Cell value={plan.values[row.id]} />
              </div>
            ))}
          </div>
        ))}
        <div />
        {PLANS.map((plan) => (
          <div key={plan.id} className={cn("border-t border-hairline px-4 py-5", plan.recommended && "bg-panel")}>
            <Button href={href(plan)} external={external(plan)} variant={plan.recommended ? "primary" : "ghost"}>
              {plan.cta.label}
            </Button>
          </div>
        ))}
      </div>

      {/* Small screens: one stacked section per plan */}
      <div className="mt-8 space-y-8 md:hidden">
        {PLANS.map((plan) => (
          <section key={plan.id} className={cn("pt-3", plan.recommended ? "border-t-[3px] border-primary" : "border-t-2 border-paper")}>
            <div className="flex items-baseline gap-2">
              <h3 className="font-bold text-paper">{plan.name}</h3>
              {plan.recommended && <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-primary">Most teams</span>}
            </div>
            <p className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-paper">
              {plan.price[period]}
              <span className="font-body text-sm font-normal text-paper/55">{priceUnit(plan)}</span>
            </p>
            {plan.usd && <p className="text-xs text-paper/50">{plan.usd[period]}</p>}
            <dl className="mt-4">
              {ROWS.map((row) => (
                <div key={row.id} className="flex items-baseline justify-between gap-4 border-t border-hairline py-2 text-sm">
                  <dt className="text-paper/70">
                    {row.label}
                    {row.note && <span className="mt-1 block text-xs leading-relaxed text-paper/50">{row.note}</span>}
                  </dt>
                  <dd className="text-right text-paper">
                    <Cell value={plan.values[row.id]} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <Button href={href(plan)} external={external(plan)} variant={plan.recommended ? "primary" : "ghost"}>
                {plan.cta.label}
              </Button>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
