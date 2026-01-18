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
  creatable = true,
  ...props
}: Props<Option, IsMulti, Group>) {
  const loadOptions = async (inputValue: string) => (options ?? []).filter(
    o => isLabelledOption(o)
      ? o.label.toLowerCase().includes(inputValue.toLowerCase())
      : true
  );
  const wrapperIsValidNewOption = (inputValue: string) =>
    creatable && inputValue.trim().length > 0;

  return <AsyncCreatableSelect
    loadOptions={loadOptions}
    isValidNewOption={wrapperIsValidNewOption}
    defaultOptions
    {...props}
  />;
}
