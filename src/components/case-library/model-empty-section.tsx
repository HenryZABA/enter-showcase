import { Layers3, LayoutGrid } from "lucide-react";

type Props = { id: string; index: string; title: string; label: string; message: string; kind: "cases" | "prompts" };

export function ModelEmptySection({ id, index, title, label, message, kind }: Props) {
  const Icon = kind === "cases" ? LayoutGrid : Layers3;
  return (
    <section id={id} className="model-section model-empty-section" aria-labelledby={`${id}-title`}>
      <div className="model-section-heading">
        <div className="model-section-title"><span className="model-section-index" aria-hidden="true">{index}</span><h2 id={`${id}-title`}>{title}</h2></div>
        <span className="model-soon-label">{label}</span>
      </div>
      <div className="model-empty-panel"><Icon size={26} strokeWidth={1.25} aria-hidden="true" /><p>{message}</p></div>
    </section>
  );
}
