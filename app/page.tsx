"use client";

import Select from "@/lib/components/select";

const options = [
  { label: "Risotto", value: "risotto" },
  { label: "Sandwich", value: "sandwich" },
  { label: "Rice", value: "rice" },
  { label: "Beans", value: "beans" },
  { label: "Donut", value: "donut" },
];

export default function Home() {
  return (
    <Select
      options={options}
      formatCreateLabel={() => <></>}
      creatable={false}
      onMenuClose={() => {}}
    />
  );
}
