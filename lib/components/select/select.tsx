"use client";

import CreatableSelect from "react-select/creatable";
import { useState, useEffect, useRef } from "react";
import search from "@/lib/util/search";

import { type Props } from "./types";
import type { GroupBase, FilterOptionOption, OptionsOrGroups, PropsValue } from "react-select";

/**
 * Allows new option creation when the input
 * actually has some content.
 */
function defaultIsValidNewOption(inputValue: string) {
  return inputValue.trim().length > 0;
}

/**
 * A wrapper around {@link CreatableSelect react-select}'s `CreatableSelect`
 * component that adds async features and easier integration with
 * form libraries.
 * 
 * - Note: apparently, the options have to follow a `{ label, value }` shape.
 */
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
  isLoading: propIsLoading,
  cacheOptions = true,
  uncacheOnCreate = true,
  onCreateOption,
  loadDefaultValue,
  defaultValue,
  value: propValue,
  onChange,
  onMenuOpen,
  ...props
}: Props<Option, IsMulti, Group>) {
  type P = Props<Option, IsMulti, Group>;
  
  const cache = useRef(new Map<string, OptionsOrGroups<Option, Group>>());
  const wasSelected = useRef(false);

  const initialOptions = propOptions?.length ? propOptions : defaultOptions;
  const initialValue = propValue ?? defaultValue;

  const [options, setOptions] = useState(initialOptions);
  const [value, setValue] = useState(initialValue);
  const [isLoadingDefaultValue, setIsLoadingDefaultValue] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    if(autoload) wrapperLoadOptions("");
    else if(cacheOptions) cache.current.set("", options ?? []);

    wrapperLoadDefaultValue();
  }, []);
  
  const defaultFilterOption = (
    option: FilterOptionOption<Option>,
    inputValue: string
  ) => search(option.label, inputValue);

  const wrapperLoadDefaultValue = () => {
    if(!loadDefaultValue || propValue !== undefined) return;

    if(propIsLoading === undefined) setIsLoadingDefaultValue(true);

    const updateValue = (value: PropsValue<Option>) => {
      if(wasSelected.current) return;

      setValue(value);
    }

    loadDefaultValue(updateValue)
      ?.then(updateValue)
      .finally(() => {
        if(propIsLoading === undefined) setIsLoadingDefaultValue(false)
      });
  }

  const wrapperLoadOptions = (inputValue: string) => {
    if(!loadOptions) return;

    if(cacheOptions && cache.current.has(inputValue)) {
      return setOptions(cache.current.get(inputValue));
    }

    if(propIsLoading === undefined) setIsLoadingOptions(true);

    const updateOptions = (options: OptionsOrGroups<Option, Group>) => {
      setOptions(options);

      if(cacheOptions) cache.current.set(inputValue, options);
    }

    loadOptions(inputValue, updateOptions)
      ?.then(updateOptions)
      .finally(() => {
        if(propIsLoading === undefined) setIsLoadingOptions(false)
      });
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

  const wrapperOnMenuOpen = () => {
    setOptions(initialOptions);

    if(autoload) wrapperLoadOptions("");

    onMenuOpen?.();
  }

  const wrapperOnCreateOption = (inputValue: string) => {
    if(uncacheOnCreate) cache.current.clear();

    onCreateOption?.(inputValue);
  }

  const wrapperOnChange: P["onChange"] = (newValue, actionMeta) => {
    if(propValue === undefined) setValue(newValue);

    onChange?.(newValue, actionMeta);
    
    wasSelected.current = true;
  }

  return <CreatableSelect
    {...props}
    options={options}
    filterOption={filterOption ?? defaultFilterOption}
    isValidNewOption={wrapperIsValidNewOption}
    onInputChange={defaultOnInputChange}
    isLoading={propIsLoading ?? (isLoadingOptions || isLoadingDefaultValue)}
    onMenuOpen={wrapperOnMenuOpen}
    onCreateOption={wrapperOnCreateOption}
    value={value}
    onChange={wrapperOnChange}
  />;
}
