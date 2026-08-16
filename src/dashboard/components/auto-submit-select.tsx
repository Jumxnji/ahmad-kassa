"use client";

interface AutoSubmitSelectProps {
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  "aria-label": string;
}

/** A plain <select> that submits its parent <form> on change — kept as a small client island so the surrounding list page can stay a Server Component. */
export function AutoSubmitSelect({ name, defaultValue, options, ...rest }: AutoSubmitSelectProps) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className="rounded-full border border-border bg-background px-3.5 py-1.5 text-sm text-foreground"
      aria-label={rest["aria-label"]}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
