"use client";

import { useState } from "react";
import Select from "@/lib/components/select";
import { createOption } from "@/lib/components/select/lib";
import search from "@/lib/util/search";
import CreatableSelect from "react-select/creatable";

import type { DefaultGroup, DefaultOption } from "@/lib/components/select/types";
import { PropsValue } from "react-select";

const defaultOptions = [
  createOption("Salame"),
  createOption("Sandwich"),
  createOption("Mushroom Stew"),
]

export default function Home() {
  const [creatable, setCreatable] = useState(true);
  const [value, setValue] = useState<PropsValue<DefaultOption>>(createOption("Waffle"));
  const [options, setOptions] = useState([
    createOption("Risotto"),
    createOption("Sandwich"),
    createOption("Rice"),
    createOption("Beans"),
    createOption("Donut"),
  ]);

  return (
    <>
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={
          (inputValue) => new Promise(
            (resolve) => setTimeout(
              () => resolve(options),
              2000
            )
          )
        }
        placeholder="Foods"
        autoload={true}
        // defaultOptions={defaultOptions}
        // allowCreateWhileLoading={true}
        // value={createOption("Waffle")}
        styles={{
          container: (base) => ({
            ...base,
            color: "black",
          }),
        }}
        isClearable
        // defaultValue={createOption("Peanuts")}
        loadDefaultValue={
          () => new Promise(
            (resolve) => setTimeout(
              () => resolve(createOption("Butter")),
              1000
            )
          )
        }
      />
      <div>
        <label>Creatable: </label>
        <input
          type="checkbox"
          checked={creatable}
          onChange={e => setCreatable(e.target.checked)}
        />{" "}
        <span>{creatable ? "Yes" : "No" }</span>
      </div>
      <CreatableSelect
        options={options}
        styles={{
          container: (base) => ({
            ...base,
            color: "black",
          }),
        }}
        value={value}
        onChange={(newValue, actionMeta) => {
          setValue(newValue)
          console.log(newValue, actionMeta)
        }}
      />
    </>
  );
}
