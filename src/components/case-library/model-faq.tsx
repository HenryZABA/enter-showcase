import { Plus, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ModelFaq as FaqItem } from "@/data/model-pages/gpt-6-astra";

type Props = { title: string; faqs: FaqItem[]; libraryHref: string; libraryLabel: string };

export function ModelFaq({ title, faqs, libraryHref, libraryLabel }: Props) {
  return (
    <section className="model-section model-faq" aria-labelledby="model-faq-title">
      <div className="model-faq-intro"><span className="model-section-index" aria-hidden="true">03 / FAQ</span><h2 id="model-faq-title">{title}</h2></div>
      <div className="model-faq-list">
        {faqs.map(faq => (
          <details className="model-faq-item" key={faq.id}>
            <summary>{faq.question}<Plus size={20} strokeWidth={1.5} aria-hidden="true" /></summary>
            <div className="model-faq-answer"><p>{faq.answer}</p>{faq.id === "ideas" && <Link className="model-text-link" to={libraryHref}>{libraryLabel}<ArrowUpRight size={15} aria-hidden="true" /></Link>}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
