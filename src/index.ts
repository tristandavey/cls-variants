export type Style = string | null | undefined;
export type NestedStyle = Array<Style | NestedStyle>;
export type GeneratedStyles<T extends string> = Record<T | "base", NestedStyle>;

export type RootStyle<T> = (T extends string
  ? {
      [K in T]?: string;
    }
  : {}) & {
  base?: string;
  variants?: Record<string, StyleVariant<T>>;
};

export type StyleVariant<T> = Record<
  string,
  | Style
  | ((T extends string
      ? {
          [K in T]?: string;
        }
      : {}) & {
      base?: string;
      variants?: Record<string, StyleVariant<T>>;
    })
>;

export type StyleFunc<T> = (args?: T, className?: string) => string;

type KeyOfOrBoolean<V> = keyof V extends "true" | "false" ? boolean : keyof V;

type MappedVariants<T> = T extends object
  ? {
      [K in keyof T]?:
        | (K extends "variants"
            ? {
                [L in keyof T[K]]?: KeyOfOrBoolean<T[K][L]>;
              }
            : undefined)
        | MappedVariants<T[K]>;
    }[keyof T]
  : never;

function generateStyles<T extends string>(
  fields: T[],
  styles: RootStyle<T>,
  results: GeneratedStyles<T>,
  args?: MappedVariants<RootStyle<T>>
): void {
  ["base"].concat(fields).forEach((field) => {
    if (!results[field]) {
      results[field] = [];
    }

    if (styles[field]) {
      results[field].push(styles[field]);
    }
  });

  if (styles.variants && args) {
    for (let variant in styles.variants) {
      if (styles.variants[variant]) {
        const variantStyle = styles.variants[variant];
        const selectedStyle = args[variant];

        if (selectedStyle in variantStyle) {
          const value = variantStyle[selectedStyle];

          if (typeof value === "string") {
            results.base.push(value);
          } else if (value.variants) {
            generateStyles(fields, value, results, args);
          }
        }
      }
    }
  }
}

function nestedFlatten(result: NestedStyle, acc: string[]): string[] {
  for (let value of result) {
    if (Array.isArray(value)) {
      acc.concat(nestedFlatten(value, acc));
    }

    if (typeof value === "string") {
      acc.push(value);
    }
  }

  return acc;
}

/**
 * Combine variations into a single class and remove any
 * additional whitespace
 * @param result
 * @returns
 */
export function flattenStyles(...result: NestedStyle): string {
  return nestedFlatten(result, [])
    .join(" ")
    .replace(/\n\s/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");
}

/**
 * Create a style builder function
 * @param styles
 * @returns
 */
export function buildCreateStyles<T extends string>(fields: T[]) {
  return <S extends RootStyle<T>>(styles: S) =>
    (args?: MappedVariants<S>, className?: string) => {
      const results = { base: [] as NestedStyle } as GeneratedStyles<T>;

      generateStyles(fields, styles, results, args);

      Object.keys(results).forEach((field) => {
        results[field] = flattenStyles(
          results[field],
          field === "base" ? className : ""
        );
      });

      const { base, ...rest } = results;

      return { className: base, ...rest };
    };
}

const createStylesInternal = buildCreateStyles([]);

/**
 * Create styles
 * @param styles
 * @returns
 */
export function createStyles<T>(styles: T) {
  const func = createStylesInternal(styles);
  return (args?: MappedVariants<T>, className?: string) =>
    func(args, className).className;
}

export { buildCreateStyles as bcs, createStyles as cs, flattenStyles as fs };
