"use client";

import AsyncCreatableSelect from "react-select/async-creatable";
import AsyncSelect from "react-select/async";

import { isLabelledOption, type Props } from "./types";
import type { GroupBase } from "react-select";

export default function Select<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>({
  options,
  creatable = true,
  ...props
}: Props<Option, IsMulti, Group>) {
  const loadOptions = async (inputValue: string) => (options ?? []).filter(
    o => isLabelledOption(o)
      ? o.label.toLowerCase().includes(inputValue.toLowerCase())
      : true
  );

  function renderSelect() {
    return creatable
      ? <AsyncCreatableSelect
        loadOptions={loadOptions}
        defaultOptions
        {...props}
      />
      : <AsyncSelect
        loadOptions={loadOptions}
        defaultOptions
        {...props}
      />
  }

  return renderSelect();
}
