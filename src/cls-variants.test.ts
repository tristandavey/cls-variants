import { flattenStyles, createStyles, mergeStyles } from "./cls-variants";

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

    expect(style({}, "test")).toBe("base-style test");
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
});

describe("mergeStyles", () => {
  it("merges base styles", () => {
    const style1 = createStyles({
      base: "base-style-1",
    });

    const style2 = createStyles({
      base: "base-style-2",
    });

    const merged = mergeStyles(style1, style2);

    expect(merged({})).toBe("base-style-1 base-style-2");
  });

  it("handles passing class", () => {
    const style1 = createStyles({
      base: "base-style-1",
    });

    const style2 = createStyles({
      base: "base-style-2",
    });

    const merged = mergeStyles(style1, style2);

    expect(merged({}, "test")).toBe("base-style-1 base-style-2 test");
  });

  describe("handles variants", () => {
    it("merges variant styles", () => {
      const style1 = createStyles({
        base: "base-style-1",
        variants: {
          foo: {
            a: "base-foo-a",
          },
        },
      });

      const style2 = createStyles({
        base: "base-style-2",
        variants: {
          bar: {
            b: "base-bar-b",
          },
        },
      });

      const merged = mergeStyles(style1, style2);

      expect(
        merged({
          foo: "a",
          bar: "b",
        })
      ).toBe("base-style-1 base-foo-a base-style-2 base-bar-b");
    });

    it("merges variant styles with same keys", () => {
      const style1 = createStyles({
        base: "base-style-1",
        variants: {
          foo: {
            a: "base-foo-a-1",
            b: "base-foo-b-1",
          },
        },
      });

      const style2 = createStyles({
        base: "base-style-2",
        variants: {
          foo: {
            a: "base-foo-b-2",
          },
          bar: {
            a: "base-bar-a-2",
          },
        },
      });

      const merged = mergeStyles(style1, style2);

      expect(
        merged({
          foo: "a",
        })
      ).toBe("base-style-1 base-foo-a-1 base-style-2 base-foo-b-2");
    });

    it("merges deep variant styles", () => {
      const style1 = createStyles({
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

      const style2 = createStyles({
        base: "base-style-2",
        variants: {
          a: {
            aFoo: "foo-style-2",
            aBar: {
              base: "bar-style-2",
              variants: {
                b: {
                  bFoo: "foo-style-2",
                  bBaz: "baz-style-2",
                },
              },
            },
          },
        },
      });

      const merged = mergeStyles(style1, style2);

      expect(merged({ a: "aBar", b: "bBaz" })).toBe(
        "base-style bar-style baz-style base-style-2 bar-style-2 baz-style-2"
      );
    });
  });
});
