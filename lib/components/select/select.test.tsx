import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Select from "@/lib/components/select";

interface PromiseController<
  R extends unknown,
  E extends unknown
> {
  resolve: (res: R) => void;
  reject: (err: E) => void;
}

interface Option {
  label: string;
  value: string;
}

interface Group {
  label: string;
  options: Option[];
}

function createPromiseController<
  R extends unknown,
  E extends unknown
>(): PromiseController<R, E> {
  return {
    resolve: () => {},
    reject: () => {},
  }
}

function createOption(label: string, value?: string): Option {
  return {
    label,
    value: value ?? label.trim().toLowerCase(),
  }
}

const options = [
  createOption("Risotto"),
  createOption("Sandwich"),
  createOption("Rice"),
  createOption("Beans"),
  createOption("Donut"),
];

describe("select", () => {
  it("shows empty text", async () => {
    // Arrange
    render(<Select />);

    // Act
    await userEvent.click(screen.getByRole("combobox"));

    // Assert
    expect(await screen.findByText(/No options/i)).toBeInTheDocument();
  });

  it("shows options", async () => {
    // Arrange
    render(<Select options={options} />);

    // Act
    await userEvent.click(screen.getByRole("combobox"));

    // Assert
    expect(await screen.findByText("Risotto")).toBeInTheDocument();
    expect(await screen.findByText("Sandwich")).toBeInTheDocument();
    expect(await screen.findByText("Rice")).toBeInTheDocument();
    expect(await screen.findByText("Beans")).toBeInTheDocument();
    expect(await screen.findByText("Donut")).toBeInTheDocument();
  });

  it("loads options", async () => {
    // Arrange
    const promise = createPromiseController<Option[], unknown>();

    render(<Select<Option, false, Group>
      loadOptions={() => new Promise(
        (resolve) => promise.resolve = resolve
      )} />
    );

    // Act
    await userEvent.click(screen.getByRole("combobox"));

    promise.resolve(options);

    // Assert
    expect(await screen.findByText("Risotto")).toBeInTheDocument();
    expect(await screen.findByText("Sandwich")).toBeInTheDocument();
    expect(await screen.findByText("Rice")).toBeInTheDocument();
    expect(await screen.findByText("Beans")).toBeInTheDocument();
    expect(await screen.findByText("Donut")).toBeInTheDocument();
  });

  it("filters options", async () => {
    // Arrange
    render(<Select options={options} />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "i");

    // Assert
    expect(await screen.findByText("Risotto")).toBeInTheDocument();
    expect(await screen.findByText("Sandwich")).toBeInTheDocument();
    expect(await screen.findByText("Rice")).toBeInTheDocument();
    expect(screen.queryByText("Beans")).not.toBeInTheDocument();
    expect(screen.queryByText("Donut")).not.toBeInTheDocument();
  });

  it("loads filtered options", async () => {
    // Arrange
    const promise = createPromiseController<Option[], unknown>();

    render(<Select<Option, false, Group>
      loadOptions={(inputValue: string) => new Promise(
        (resolve) =>
          promise.resolve = (options) => resolve(
            options.filter(
              o => o.label.toLowerCase().includes(inputValue)
            )
          )
      )} />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "i");

    promise.resolve(options);

    // Assert
    expect(await screen.findByText("Risotto")).toBeInTheDocument();
    expect(await screen.findByText("Sandwich")).toBeInTheDocument();
    expect(await screen.findByText("Rice")).toBeInTheDocument();
    expect(screen.queryByText("Beans")).not.toBeInTheDocument();
    expect(screen.queryByText("Donut")).not.toBeInTheDocument();
  });

  it("is creatable", async () => {
    // Arrange
    render(<Select />);

    // Act
    await userEvent.type(screen.getByRole("combobox"), "A");

    // Assert
    expect(await screen.findByText(/Create/i)).toBeInTheDocument();
  });

  it("is not creatable", async () => {
    // Arrange
    render(<Select creatable={false} />);

    // Act
    await userEvent.type(screen.getByRole("combobox"), "A");

    // Assert
    expect(screen.queryByText(/Create/i)).not.toBeInTheDocument();
  });

  it("keeps state between creatable change", async () => {
    // Arrange
    const { rerender } = render(<Select options={options} />);

    await userEvent.type(screen.getByRole("combobox"), "A");

    // Act
    expect(await screen.findByText(/Create/i)).toBeInTheDocument();
    expect(await screen.findByText("Sandwich")).toBeInTheDocument();
    expect(await screen.findByText("Beans")).toBeInTheDocument();
    expect(screen.queryByText("Rice")).not.toBeInTheDocument();
    expect(screen.queryByText("Risotto")).not.toBeInTheDocument();
    expect(screen.queryByText("Donut")).not.toBeInTheDocument();

    rerender(<Select options={options} creatable={false} />)
    
    // Assert
    expect(screen.queryByText(/Create/i)).not.toBeInTheDocument();
    expect(await screen.findByText("Sandwich")).toBeInTheDocument();
    expect(await screen.findByText("Beans")).toBeInTheDocument();
    expect(screen.queryByText("Rice")).not.toBeInTheDocument();
    expect(screen.queryByText("Risotto")).not.toBeInTheDocument();
    expect(screen.queryByText("Donut")).not.toBeInTheDocument();
  });
});
