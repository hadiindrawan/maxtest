import Icon from "@/components/ui/Icon";

type Item = { question: string; answer: string };

/** Native <details>: keyboard accessible and works without JavaScript. */
export default function Faq({ items }: { items: readonly Item[] }) {
  return (
    <div className="max-w-3xl">
      {items.map((item) => (
        <details key={item.question} className="group border-t border-hairline py-4 last:border-b">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="text-primary">
              <Icon name="plus" className="group-open:hidden" />
              <Icon name="minus" className="hidden group-open:block" />
            </span>
          </summary>
          <p className="mt-3 max-w-2xl leading-relaxed text-paper/70">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
