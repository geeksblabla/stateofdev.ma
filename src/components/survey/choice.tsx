import { type ChangeEvent } from "react";

type ChoiceProps = {
  text: string;
  id: string;
  index: number;
  name: string;
  required: boolean;
  multiple: boolean;
  checked: boolean;
  onChange: (index: number, checked: boolean) => void;
};

export const Choice = ({
  text,
  id,
  index,
  name,
  multiple,
  checked,
  onChange
}: ChoiceProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(index, e.target.checked);
  };

  return (
    <div className="relative w-full overflow-hidden flex items-center bg-card p-3 pl-14 mb-2 cursor-pointer transition-all duration-200 hover:translate-x-1">
      <input
        className="peer hidden"
        type={multiple ? "checkbox" : "radio"}
        id={id}
        name={name}
        value={index}
        checked={checked}
        onChange={handleChange}
        data-testid={id}
      />
      <label
        className="absolute inset-0 cursor-pointer
          peer-checked:border-primary peer-checked:bg-gradient-to-r peer-checked:from-primary/15 peer-checked:to-primary/5
          peer-checked:ring-2 peer-checked:ring-primary/30 peer-checked:ring-offset-2 peer-checked:ring-offset-background
          border-2 border-input
          hover:border-primary/50
          transition-all duration-200"
        htmlFor={id}
      ></label>
      <div
        className="absolute pointer-events-none left-4 h-5 w-5 border-2 border-input bg-muted
        peer-checked:border-primary peer-checked:bg-primary peer-checked:shadow-md peer-checked:shadow-primary/50
        transition-all duration-200"
      ></div>
      <span
        className="pointer-events-none z-10 text-foreground
        peer-checked:font-medium
        transition-all duration-200"
      >
        {text}
      </span>
    </div>
  );
};
