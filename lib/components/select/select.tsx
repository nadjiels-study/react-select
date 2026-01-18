"use client";

import AsyncCreatableSelect from "react-select/async-creatable";

import { isLabelledOption, type Props } from "./types";
import type { GroupBase } from "react-select";

function defaultIsValidNewOption(inputValue: string) {
  return inputValue.trim().length > 0;
}

export default function Select<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>({
  options,
  creatable = true,
  defaultOptions = true,
  isValidNewOption,
  loadOptions,
  ...props
}: Props<Option, IsMulti, Group>) {
  type P = Props<Option, IsMulti, Group>;

  const defaultLoadOptions = async (inputValue: string) =>
    (options ?? []).filter(
      o => isLabelledOption(o)
        ? o.label.toLowerCase().includes(inputValue.toLowerCase())
        : true
    );
  
  const wrapperLoadOptions: P["loadOptions"] = loadOptions ?? defaultLoadOptions;
  const wrapperIsValidNewOption: P["isValidNewOption"] = (
    inputValue, value, options, accessors
  ) =>
    creatable && (
      isValidNewOption?.(inputValue, value, options, accessors)
      ?? defaultIsValidNewOption(inputValue)
    );

  return <AsyncCreatableSelect
    {...props}
    loadOptions={wrapperLoadOptions}
    isValidNewOption={wrapperIsValidNewOption}
    defaultOptions={options && defaultOptions ? true : defaultOptions}
  />;
}
