"use client";

import AsyncCreatableSelect from "react-select/async-creatable";

import { isLabelledOption, type Props } from "./types";
import type { GroupBase } from "react-select";

export default function Select<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>({
  options,
  ...props
}: Props<Option, IsMulti, Group>) {
  const loadOptions = async (inputValue: string) => (options ?? []).filter(
    o => isLabelledOption(o)
      ? o.label.toLowerCase().includes(inputValue.toLowerCase())
      : true
  );

  return <AsyncCreatableSelect
    loadOptions={loadOptions}
    defaultOptions
    {...props}
  />;
}
