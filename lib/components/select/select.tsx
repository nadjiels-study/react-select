"use client";

import AsyncCreatableSelect from "react-select/async-creatable";

import type { Props } from "./types";
import type { GroupBase } from "react-select";

export default function Select<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>({
  options,
  ...props
}: Props<Option, IsMulti, Group>) {
  const loadOptions = async () => options ?? [];

  return <AsyncCreatableSelect
    loadOptions={loadOptions}
    defaultOptions
    {...props}
  />;
}
