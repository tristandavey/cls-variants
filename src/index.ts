export type Style = string | null | undefined;
export type NestedStyle = Array<Style | NestedStyle>;

export type RootStyle = {
  base?: string;
  variants?: Record<string, StyleVariant>;
};

export type StyleVariant = Record<
  string,
  | Style
  | {
      base?: string;
      variants: Record<string, StyleVariant>;
    }
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

export type StyleArgs<T extends RootStyle> = MappedVariants<T>;

function generateStyles<V extends RootStyle>(
  styles: V,
  args?: StyleArgs<V>
): NestedStyle {
  const results: NestedStyle = [];

  if (styles.base) {
    results.push(styles.base);
  }

  if (styles.variants && args) {
    for (let variant in styles.variants) {
      if (styles.variants[variant]) {
        const variantStyle = styles.variants[variant];
        const selectedStyle = args[variant];

        if (selectedStyle in variantStyle) {
          const value = variantStyle[selectedStyle];

          if (typeof value === "string") {
            results.push(value);
          } else if (value.variants) {
            results.push(generateStyles<any>(value, args));
          }
        }
      }
    }
  }

  return results;
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
 * Create a style function
 * @param styles
 * @returns
 */
export function createStyles<V extends RootStyle>(
  styles: V
): StyleFunc<StyleArgs<V>> {
  return (args: StyleArgs<V>, className?: string) => {
    return flattenStyles(generateStyles<any>(styles, args), className);
  };
}

type ValueOf<T> = T extends any[] ? T[number] : T[keyof T];
type ExtractArgs<T extends StyleFunc<any>> = Parameters<T>[0];

type MergeStylesArgs<T extends StyleFunc<any>[]> = ExtractArgs<ValueOf<T>>;

/**
 * Merge several style functions into a single one
 * @param styles
 * @returns
 */
export function mergeStyles<T extends StyleFunc<any>[]>(
  ...styles: T
): StyleFunc<MergeStylesArgs<T>> {
  return (args: MergeStylesArgs<T> = {}, className?: string) => {
    return flattenStyles(
      ...styles.map((style) => {
        return style(args);
      }),
      className
    );
  };
}

export { createStyles as cs, mergeStyles as ms, flattenStyles as fs };
