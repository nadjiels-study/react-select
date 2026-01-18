import type { CreatableProps } from "react-select/creatable";
import type { GroupBase, OptionsOrGroups } from "react-select";

type OptionOrGroup<
  Option,
  Group extends GroupBase<Option>
> = OptionsOrGroups<Option, Group>[number];

interface LabelledOption {
  label: string;
}

export interface DefaultOption {
  label: string;
  value: string;
}

export interface DefaultGroup {
  label: string;
  options: DefaultOption[];
}

export type LoadOptions<Option, Group extends GroupBase<Option>> = (
  inputValue: string,
  callback: (options: OptionsOrGroups<Option, Group>) => void,
) => void | Promise<OptionsOrGroups<Option, Group>>

export interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> extends CreatableProps<Option, IsMulti, Group> {
  creatable?: boolean;
  defaultOptions?: OptionsOrGroups<Option, Group>;
  autoload?: boolean;
  loadOptions?: LoadOptions<Option, Group>;
}

export function isLabelledOption<
  Option,
  Group extends GroupBase<Option>
>(option: OptionOrGroup<Option, Group>): option is Extract<Option, LabelledOption> {
  return (
    typeof option === "object"
      && option !== null
      && "label" in option
      && typeof option.label === "string"
  )
}
