import { flattenStyles, createStyles, buildCreateStyles } from "./";

describe("flattenStyles", () => {
  it("handles styles", () => {
    const initial = ["test1", "test2", "test3", "test4"];
    const expected = "test1 test2 test3 test4";

    expect(flattenStyles(initial)).toBe(expected);
  });

  it("handles nested styles", () => {
    const initial = ["test1", ["test2", ["test3", "test4"]]];
    const expected = "test1 test2 test3 test4";

    expect(flattenStyles(initial)).toBe(expected);
  });

  it("handles line breaks", () => {
    const initial = [
      `
        test1
        test2
      `,
      `
        test3
        test4
      `,
    ];
    const expected = "test1 test2 test3 test4";

    expect(flattenStyles(initial)).toBe(expected);
  });
});

describe("createStyles", () => {
  it("handles base styles", () => {
    const style = createStyles({
      base: "base-style",
    });

    expect(style()).toBe("base-style");
  });

  it("handles passing class", () => {
    const style = createStyles({
      base: "base-style",
    });

    expect(style(undefined, "test")).toBe("base-style test");
  });

  describe("handles variants", () => {
    it("handles single variant styles", () => {
      const style = createStyles({
        base: "base-style",
        variants: {
          variant: {
            foo: "foo-style",
            bar: "bar-style",
          },
        },
      });

      expect(style({ variant: "foo" })).toBe("base-style foo-style");
    });

    it("handles multiple variant styles", () => {
      const style = createStyles({
        base: "base-style",
        variants: {
          a: {
            foo: "foo-style",
            bar: "bar-style",
          },
          b: {
            foo: "foo-style",
            bar: "bar-style",
          },
        },
      });

      expect(style({ a: "foo", b: "bar" })).toBe(
        "base-style foo-style bar-style"
      );
    });

    it("handles deep variant styles", () => {
      const style = createStyles({
        base: "base-style",
        variants: {
          a: {
            aFoo: "foo-style",
            aBar: {
              base: "bar-style",
              variants: {
                b: {
                  bFoo: "foo-style",
                  bBaz: "baz-style",
                },
              },
            },
          },
        },
      });

      expect(style({ a: "aFoo", b: "bBaz" })).toBe("base-style foo-style");
      expect(style({ a: "aBar", b: "bBaz" })).toBe(
        "base-style bar-style baz-style"
      );
    });
  });

  describe("buildCreateStyles", () => {
    it("handles custom styles", () => {
      const build = buildCreateStyles(["item"]);

      const style = build({
        base: "base-style",
        item: "base-item",
      });

      expect(style()).toStrictEqual({
        className: "base-style",
        item: "base-item",
      });
    });

    it("handles deep custom styles", () => {
      const build = buildCreateStyles(["item"]);

      const style = build({
        base: "base-style",
        item: "base-item",
        variants: {
          foo: {
            a: {
              item: "base-item-a",
              variants: {
                bar: {
                  b: "bar",
                },
              },
            },
            b: {
              item: "base-item-b",
            },
          },
        },
      });

      expect(style({ foo: "a", bar: "b" })).toStrictEqual({
        className: "base-style bar",
        item: "base-item base-item-a",
      });
    });
  });
});
