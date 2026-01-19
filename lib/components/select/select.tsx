"use client";

import CreatableSelect from "react-select/creatable";
import { useState, useEffect } from "react";
import search from "@/lib/util/search";

import { isLabelledOption, type Props } from "./types";
import type { GroupBase, FilterOptionOption } from "react-select";

/**
 * Allows new option creation when the input
 * actually has some content.
 */
function defaultIsValidNewOption(inputValue: string) {
  return inputValue.trim().length > 0;
}

export default function Select<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>({
  options: propOptions,
  creatable = true,
  defaultOptions: propDefaultOptions,
  isValidNewOption,
  loadOptions,
  autoload = true,
  filterOption,
  isLoading: propIsLoading = false,
  ...props
}: Props<Option, IsMulti, Group>) {
  type P = Props<Option, IsMulti, Group>;

  const [defaultOptions, setDefaultOptions] = useState(propDefaultOptions);
  const [options, setOptions] = useState(propOptions);
  const [isLoading, setIsLoading] = useState(propIsLoading);

  useEffect(() => {
    if(!options?.length) setOptions(defaultOptions);
    if(autoload) wrapperLoadOptions("");
  }, []);
  
  const defaultFilterOption = (
    option: FilterOptionOption<Option>,
    inputValue: string
  ) => isLabelledOption(option) ? search(option.label, inputValue) : true;

  const wrapperLoadOptions = (inputValue: string) => {
    if(!loadOptions) return;

    setIsLoading(true);

    loadOptions(inputValue, setOptions)
      ?.then(setOptions)
      .finally(() => setIsLoading(false));
  }

  const defaultOnInputChange: P["onInputChange"] = (newValue, actionMeta) => {
    if(actionMeta.action !== "input-change") return;
    
    wrapperLoadOptions(newValue);
  }
  
  /**
   * Automatically enables creation when `creatable` is `true`,
   * unless `isValidNewOption` tells otherwise. Else, disables it.
   */
  const wrapperIsValidNewOption: P["isValidNewOption"] = (
    inputValue, value, options, accessors
  ) =>
    creatable && (
      isValidNewOption?.(inputValue, value, options, accessors)
      ?? defaultIsValidNewOption(inputValue)
    );

  return <CreatableSelect
    {...props}
    options={options}
    filterOption={filterOption ?? defaultFilterOption}
    isValidNewOption={wrapperIsValidNewOption}
    onInputChange={defaultOnInputChange}
    isLoading={isLoading}
  />;
}
