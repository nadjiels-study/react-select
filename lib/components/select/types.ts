import type { AsyncCreatableProps } from "react-select/async-creatable";
import type { GroupBase, OptionsOrGroups } from "react-select";

type OptionOrGroup<
  Option,
  Group extends GroupBase<Option>
> = OptionsOrGroups<Option, Group>[number];

interface LabelledOption {
  label: string;
}

export interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> extends AsyncCreatableProps<Option, IsMulti, Group> {

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
