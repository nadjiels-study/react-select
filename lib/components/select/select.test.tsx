import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Select from "@/lib/components/select";
import { createOption } from "./lib";
import search from "@/lib/util/search";
import type { DefaultOption, DefaultGroup } from "./types";

interface PromiseController<R, E> {
  resolve: (res: R) => void;
  reject: (err: E) => void;
}

function createPromiseController<R, E>(): PromiseController<R, E> {
  return {
    resolve: () => {},
    reject: () => {},
  }
}

const options = [
  createOption("Risotto"),
  createOption("Sandwich"),
  createOption("Rice"),
  createOption("Beans"),
  createOption("Donut"),
];

const defaultOptions = [
  createOption("Salame"),
  createOption("Sandwich"),
  createOption("Mushroom Stew"),
]

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
    await Promise.all(options.map(
      async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
  });

  it("loads options", async () => {
    // Arrange
    render(
      <Select loadOptions={() => Promise.resolve(options)} />
    );

    // Act
    await userEvent.click(screen.getByRole("combobox"));

    // Assert
    await Promise.all(options.map(
      async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
  });

  it("filters options by default", async () => {
    // Arrange
    render(<Select options={options} />);

    // Act
    await userEvent.type(screen.getByRole("combobox"), "i");

    // Assert
    await Promise.all(
      options
        .filter(o => ["Risotto", "Sandwich", "Rice"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Beans", "Donut"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("filters options", async () => {
    // Arrange
    render(
      <Select
        options={options}
        filterOption={(option, inputValue) => !search(option.label, inputValue)}
      />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "i");

    // Assert
    await Promise.all(
      options
        .filter(o => ["Beans", "Donut"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Risotto", "Sandwich", "Rice"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("loads filtered options", async () => {
    // Arrange
    render(
      <Select
        loadOptions={(inputValue: string) => Promise.resolve(
          options.filter(o => search(o.label, inputValue))
        )}
        filterOption={() => true}
      />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "i");

    // Assert
    await Promise.all(
      options
        .filter(o => ["Risotto", "Sandwich", "Rice"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Beans", "Donut"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("filters loaded options", async () => {
    // Arrange
    render(
      <Select
        loadOptions={(inputValue: string) => Promise.resolve(
          options.filter(o => search(o.label, inputValue))
        )}
        filterOption={
          (option, inputValue) =>
            option.label
              .toLocaleLowerCase()
              .startsWith(inputValue.toLocaleLowerCase())
        }
      />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "d");

    // Assert
    await Promise.all(
      options
        .filter(o => ["Donut"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Beans", "Risotto", "Sandwich", "Rice"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("is creatable by default", async () => {
    // Arrange
    render(<Select />);

    // Act
    await userEvent.type(screen.getByRole("combobox"), "A");

    // Assert
    expect(await screen.findByText(/Create/i)).toBeInTheDocument();
  });

  it("is creatable", async () => {
    // Arrange
    render(<Select creatable />);

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
    const { rerender } = render(<Select options={options} creatable />);

    await userEvent.type(screen.getByRole("combobox"), "A");

    // Act
    expect(await screen.findByText(/Create/i)).toBeInTheDocument();
    await Promise.all(
      options
        .filter(o => ["Sandwich", "Beans"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Risotto", "Donut", "Rice"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());

    rerender(<Select options={options} creatable={false} />)
    
    // Assert
    expect(screen.queryByText(/Create/i)).not.toBeInTheDocument();
    await Promise.all(
      options
        .filter(o => ["Sandwich", "Beans"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Risotto", "Donut", "Rice"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("rejects creatability", async () => {
    // Arrange
    render(
      <Select
        isValidNewOption={
          (inputValue) => inputValue.trim().length >= 3
        }
      />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "L");
    
    // Assert
    expect(screen.queryByText(/Create/i)).not.toBeInTheDocument();
  });

  it("approves creatability", async () => {
    // Arrange
    render(
      <Select
        isValidNewOption={
          (inputValue) => inputValue.trim().length >= 3
        }
      />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "Lasagna");
    
    // Assert
    expect(await screen.findByText(/Create/i)).toBeInTheDocument();
  });

  it("shows defaultOptions while autoloads", async () => {
    // Arrange
    const promise = createPromiseController<DefaultOption[], unknown>();

    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={() => new Promise(
          (resolve) => promise.resolve = resolve
        )}
        defaultOptions={defaultOptions}
      />
    );

    // Act
    await userEvent.click(screen.getByRole("combobox"));
    
    // Assert
    await Promise.all(
      options
        .filter(o => ["Salame", "Sandwich", "Mushroom Stew"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));

    promise.resolve(options);

    await Promise.all(
      options
        .filter(o => ["Sandwich", "Beans", "Rice", "Risotto", "Donut"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Salame", "Mushroom Stew"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("allows no autoloading", async () => {
    // Arrange
    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={() => Promise.resolve(options)}
        filterOption={() => true}
        autoload={false}
      />
    );

    // Act
    await userEvent.click(screen.getByRole("combobox"));
    
    // Assert
    expect(await screen.findByText(/No options/i)).toBeInTheDocument();
    
    await userEvent.type(screen.getByRole("combobox"), "i");
    
    await Promise.all(
      options
        .filter(o => ["Sandwich", "Beans", "Rice", "Risotto", "Donut"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
  });

  it("shows defaultOptions", async () => {
    // Arrange
    render(<Select defaultOptions={defaultOptions} />);

    // Act
    await userEvent.click(screen.getByRole("combobox"));
    
    // Assert
    await Promise.all(
      options
        .filter(o => ["Salame", "Sandwich", "Mushroom Stew"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
  });

  it("shows options over defaultOptions", async () => {
    // Arrange
    render(<Select options={options} defaultOptions={defaultOptions} />);

    // Act
    await userEvent.click(screen.getByRole("combobox"));
    
    // Assert
    await Promise.all(
      options
        .filter(o => ["Sandwich", "Beans", "Rice", "Risotto", "Donut"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument()
    ));
    options
      .filter(o => ["Salame", "Mushroom Stew"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("shows defaultOptions while options load", async () => {
    // Arrange
    const promise = createPromiseController<DefaultOption[], unknown>();

    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={() => new Promise(
          (resolve) => promise.resolve = resolve
        )}
        defaultOptions={defaultOptions}
      />
    );

    // Act
    await userEvent.click(screen.getByRole("combobox"));
    
    // Assert
    await Promise.all(
      options
        .filter(o => ["Salame", "Sandwich", "Mushroom Stew"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument())
    );
    options
      .filter(o => ["Beans", "Rice", "Risotto", "Donut"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());

    promise.resolve(options);
    
    await Promise.all(
      options
        .filter(o => ["Sandwich", "Beans", "Rice", "Risotto", "Donut"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument())
    );
    options
      .filter(o => ["Salame", "Mushroom Stew"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });

  it("loads options despite default options", async () => {
    // Arrange
    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={() => Promise.resolve(options)}
        defaultOptions={defaultOptions}
      />
    );

    // Act
    await userEvent.click(screen.getByRole("combobox"));
    
    // Assert
    await Promise.all(
      options
        .filter(o => ["Sandwich", "Beans", "Rice", "Risotto", "Donut"].includes(o.label))
        .map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument())
    );
    options
      .filter(o => ["Salame", "Mushroom Stew"].includes(o.label))
      .map(o => expect(screen.queryByText(o.label)).not.toBeInTheDocument());
  });
});
