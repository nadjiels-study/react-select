import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Select from "@/lib/components/select";

describe("select", () => {
  it("shows options", async () => {
    render(<Select />);

    await userEvent.click(screen.getByRole("combobox"));

    expect(await screen.findByText(/No options/i)).toBeInTheDocument();
  });
});
