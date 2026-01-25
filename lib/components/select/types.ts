import { ComponentProps } from "react";
import type { GroupBase, OptionsOrGroups, PropsValue } from "react-select";
import CreatableSelect from "react-select/creatable";

type CreatableSelectProps<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> = ComponentProps<typeof CreatableSelect<Option, IsMulti, Group>>;

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

export type LoadDefaultValue<Option> = (
  callback: (value: PropsValue<Option>) => void,
) => void | Promise<PropsValue<Option>>

export type OnCreateOption = (inputValue: string) => void | Promise<void>;

export interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
> extends Omit<CreatableSelectProps<Option, IsMulti, Group>, "isDisabled"> {
  creatable?: boolean;
  defaultOptions?: OptionsOrGroups<Option, Group>;
  autoload?: boolean;
  loadOptions?: LoadOptions<Option, Group>;
  cacheOptions?: boolean;
  uncacheOnCreate?: boolean;
  loadDefaultValue?: LoadDefaultValue<Option>;
  onCreateOption?: OnCreateOption;
  disabled?: boolean;
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
