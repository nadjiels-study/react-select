"use client";

import CreatableSelect from "react-select/creatable";
import { useState, useEffect, useRef } from "react";
import search from "@/lib/util/search";

import { isLabelledOption, type Props } from "./types";
import type { GroupBase, FilterOptionOption, OptionsOrGroups } from "react-select";

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
  defaultOptions,
  isValidNewOption,
  loadOptions,
  autoload = true,
  filterOption,
  isLoading: propIsLoading = false,
  cacheOptions = true,
  ...props
}: Props<Option, IsMulti, Group>) {
  type P = Props<Option, IsMulti, Group>;
  
  const cache = useRef(new Map<string, OptionsOrGroups<Option, Group>>());

  const initialOptions = propOptions?.length ? propOptions : defaultOptions;

  const [options, setOptions] = useState(initialOptions);
  const [isLoading, setIsLoading] = useState(propIsLoading);

  useEffect(() => {
    if(autoload) wrapperLoadOptions("");
    else if(cacheOptions) cache.current.set("", options ?? []);
  }, []);
  
  const defaultFilterOption = (
    option: FilterOptionOption<Option>,
    inputValue: string
  ) => isLabelledOption(option) ? search(option.label, inputValue) : true;

  const wrapperLoadOptions = (inputValue: string) => {
    if(!loadOptions) return;

    if(cacheOptions && cache.current.has(inputValue)) {
      return setOptions(cache.current.get(inputValue));
    }

    setIsLoading(true);

    const updateOptions = (options: OptionsOrGroups<Option, Group>) => {
      setOptions(options);

      if(cacheOptions) cache.current.set(inputValue, options);
    }

    loadOptions(inputValue, updateOptions)
      ?.then(updateOptions)
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
  
  const onMenuClose = () => {
    setOptions(initialOptions);
  }

  return <CreatableSelect
    {...props}
    options={options}
    filterOption={filterOption ?? defaultFilterOption}
    isValidNewOption={wrapperIsValidNewOption}
    onInputChange={defaultOnInputChange}
    isLoading={isLoading}
    onMenuClose={onMenuClose}
  />;
}
