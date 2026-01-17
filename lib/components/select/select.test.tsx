import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Select from "@/lib/components/select";

const options = [
  { label: "Risotto", value: "risotto" },
  { label: "Sandwich", value: "sandwich" },
  { label: "Rice", value: "rice" },
  { label: "Beans", value: "beans" },
  { label: "Donut", value: "donut" },
];

describe("select", () => {
  it("shows empty text", async () => {
    render(<Select />);

    await userEvent.click(screen.getByRole("combobox"));

    expect(await screen.findByText(/No options/i)).toBeInTheDocument();
  });

  it("shows options", async () => {
    render(<Select options={options} />);

    await userEvent.click(screen.getByRole("combobox"));

    expect(await screen.findByText(/Risotto/i)).toBeInTheDocument();
    expect(await screen.findByText(/Sandwich/i)).toBeInTheDocument();
    expect(await screen.findByText(/Rice/i)).toBeInTheDocument();
    expect(await screen.findByText(/Beans/i)).toBeInTheDocument();
    expect(await screen.findByText(/Donut/i)).toBeInTheDocument();
  });
});
