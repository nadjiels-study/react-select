import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Select from "@/lib/components/select";
import { createOption } from "./lib";
import search from "@/lib/util/search";
import type { DefaultOption, DefaultGroup } from "./types";

interface PromiseController<R, E> {
  resolve: (res: R) => void;
  reject: (err: E) => void;
  commit: (callback?: () => void) => void;
}

function createPromiseController<R, E>(): PromiseController<R, E> {
  return {
    resolve: () => {},
    reject: () => {},
    commit: function(callback) {
      return new Promise<R>((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;

        callback?.();
      });
    }
  }
}

const promise = createPromiseController();

new Promise((resolve) => promise.resolve = resolve)

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
        loadOptions={() => promise.commit()}
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
        loadOptions={() => promise.commit()}
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

  it("indicates autoloading", async () => {
    // Arrange
    const promise = createPromiseController<DefaultOption[], unknown>();

    // Act
    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={() => promise.commit()}
        autoload
        components={{
          LoadingIndicator: () => <span>Loading</span>
        }}
      />
    );
    
    // Assert
    const loadingIndicator = await screen.findByText("Loading");

    expect(loadingIndicator).toBeInTheDocument();

    promise.resolve(options);
    
    await waitForElementToBeRemoved(loadingIndicator);

    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("doesn't load on close", async () => {
    // Arrange
    const loadOptions = vi.fn();

    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={loadOptions}
        autoload={false}
        components={{
          LoadingIndicator: () => <span>Loading</span>
        }}
      />
    );

    const select = screen.getByRole("combobox")

    // Act
    await userEvent.click(select);
    await userEvent.click(document.body);
    
    // Assert
    expect(loadOptions).not.toBeCalled();
  });

  it("resets options on menu close", async () => {
    // Arrange
    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={inputValue => Promise.resolve(
          options.filter(o => search(o.label, inputValue))
        )}
        filterOption={() => true}
        autoload={false}
      />
    );

    const select = screen.getByRole("combobox")

    // Act
    await userEvent.type(select, "d");
    await userEvent.click(document.body);
    await userEvent.click(select);
    
    // Assert
    expect(await screen.findByText(/No options/i)).toBeInTheDocument();
  });

  it("caches options", async () => {
    const loadOptions = vi.fn();

    // Arrange
    render(
      <Select
        loadOptions={loadOptions}
        autoload={false}
        cacheOptions
      />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.type(select, "d");
    await userEvent.clear(select);
    await userEvent.type(select, "d");
    
    // Assert
    expect(loadOptions).toBeCalledTimes(2);
  });

  it("ignores cache", async () => {
    const loadOptions = vi.fn();

    // Arrange
    render(
      <Select
        loadOptions={loadOptions}
        autoload={false}
        cacheOptions={false}
      />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.type(select, "d");
    await userEvent.clear(select);
    await userEvent.type(select, "d");
    
    // Assert
    expect(loadOptions).toBeCalledTimes(3);
  });

  it("removes cache on creation", async () => {
    const loadOptions = vi.fn().mockResolvedValue([]);

    // Arrange
    render(
      <Select
        loadOptions={loadOptions}
        uncacheOnCreate
      />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.type(select, "Rocambolli");
    await userEvent.click(await screen.findByText(/Create/i));

    loadOptions.mockClear();

    await userEvent.type(select, "Rocambolli");
    
    // Assert
    expect(loadOptions).toBeCalledTimes(11);
  });

  it("keeps cache on creation", async () => {
    const loadOptions = vi.fn().mockResolvedValue([]);

    // Arrange
    render(
      <Select
        loadOptions={loadOptions}
        uncacheOnCreate={false}
      />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.type(select, "Rocambolli");
    await userEvent.click(await screen.findByText(/Create/i));

    loadOptions.mockClear();

    await userEvent.type(select, "Rocambolli");
    
    // Assert
    expect(loadOptions).toBeCalledTimes(0);
  });

  it("allows initial controlled isLoading", async () => {
    // Arrange
    render(
      <Select
        isLoading
        components={{
          LoadingIndicator: () => <span>Loading</span>
        }}
      />
    );
    
    // Assert
    expect(await screen.findByText("Loading")).toBeInTheDocument();
  });

  it("allows controlled isLoading", async () => {
    // Arrange
    const promise = createPromiseController<DefaultOption[], unknown>();
    
    render(
      <Select<DefaultOption, false, DefaultGroup>
        loadOptions={() => promise.commit()}
        isLoading
        components={{
          LoadingIndicator: () => <span>Loading</span>
        }}
      />
    );

    // Act
    promise.resolve([]);
    
    // Assert
    expect(await screen.findByText("Loading")).toBeInTheDocument();
  });

  it("allows custom creation", async () => {
    // Arrange
    const onCreateOption = vi.fn();
    
    render(
      <Select
        onCreateOption={onCreateOption}
      />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.type(select, "Rocambolli");
    await userEvent.click(await screen.findByText(/Create/i));
    
    // Assert
    expect(onCreateOption).toHaveBeenCalledWith("Rocambolli");
  });

  it("uses controlled value", async () => {
    // Arrange
    const value = createOption("Waffles");
    
    render(
      <Select options={options} value={value} />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.click(select);
    await userEvent.click(await screen.findByText("Beans"));
    
    // Assert
    expect(screen.queryByText("Waffles")).toBeInTheDocument();
  });

  it("triggers onChange", async () => {
    // Arrange
    const onChange = vi.fn();
    
    render(
      <Select options={options} onChange={onChange} />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.click(select);
    await userEvent.click(await screen.findByText("Beans"));
    
    // Assert
    expect(onChange).toHaveBeenCalledWith(
      options.find(o => o.label === "Beans"),
      expect.anything()
    );
  });

  it("uses defaultValue", async () => {
    // Arrange
    const defaultValue = createOption("Waffles");
    
    // Act
    render(
      <Select defaultValue={defaultValue} />
    );
    
    // Assert
    expect(screen.queryByText("Waffles")).toBeInTheDocument();
  });

  it("loads defaultValue", async () => {
    // Arrange
    const loadDefaultValue = () =>
      Promise.resolve(createOption("Waffles"));
    
    // Act
    render(
      <Select loadDefaultValue={loadDefaultValue} />
    );
    
    // Assert
    expect(await screen.findByText("Waffles")).toBeInTheDocument();
  });

  it("keeps loadings independent", async () => {
    // Arrange
    const defaultValuePromise = createPromiseController();
    const optionsPromise = createPromiseController();
    
    render(
      <Select
        loadDefaultValue={() => defaultValuePromise.commit()}
        loadOptions={() => optionsPromise.commit()}
        autoload
        components={{
          LoadingIndicator: () => <span>Loading</span>
        }}
      />
    );

    const loadingIndicator = await screen.findByText("Loading");

    // Act
    defaultValuePromise.resolve(createOption("Waffles"));
    
    // Assert
    expect(loadingIndicator).toBeInTheDocument();

    optionsPromise.resolve(options);
    
    await waitForElementToBeRemoved(loadingIndicator);

    expect(screen.queryByText("Loading")).not.toBeInTheDocument();
  });

  it("keeps options on reopening", async () => {
    // Arrange
    render(
      <Select
        loadOptions={() => Promise.resolve(options)}
      />
    );

    const select = screen.getByRole("combobox");

    // Act
    await userEvent.click(select);

    // Assert
    await Promise.all(
      options.map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument())
    );

    await userEvent.click(document.body);
    await userEvent.click(select);

    await Promise.all(
      options.map(async o => expect(await screen.findByText(o.label)).toBeInTheDocument())
    );
  });

  it("executes onMenuOpen", async () => {
    // Arrange
    const onMenuOpen = vi.fn();

    render(
      <Select onMenuOpen={onMenuOpen} />
    );

    // Act
    await userEvent.click(screen.getByRole("combobox"));

    // Assert
    expect(onMenuOpen).toHaveBeenCalled();
  });

  it("loads while creating", async () => {
    // Arrange
    const promise = createPromiseController<void, unknown>();

    render(
      <Select
        onCreateOption={() => promise.commit()}
        components={{
          LoadingIndicator: () => <span>Loading</span>
        }}
      />
    );

    // Act
    await userEvent.type(screen.getByRole("combobox"), "Lasagnna");
    await userEvent.click(await screen.findByText(/Create/));

    // Assert
    const loadingIndicator = await screen.findByText("Loading");
    expect(loadingIndicator).toBeInTheDocument();

    promise.resolve();

    await waitForElementToBeRemoved(loadingIndicator);

    expect(loadingIndicator).not.toBeInTheDocument();
  });
});
