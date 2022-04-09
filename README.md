# cls-variants
cls-variants is a small library to compose style variations for your components. It's inspired by stitches or cva but takes a nested approach to composing compound variants.

## Installation
```
npm install cls-variants
yarn add cls-variants
```

## Usage
### Basic 
```
import { createStyles } from 'cls-variants'; // or aliased as cs

const button = createStyles({
  base: 'button-style'
});


button();
// button-style
```

_*Formatting:*_
Styles will be flattened and trimmed by default so you can use template literals for organisation:
```
const button = createStyles({
  base: `
    px-2 py-1 rounded bg-red-500 text-white
    disabled:bg-zinc-300
    focus:border-2 focus:border-black
  `
});

button()
// px-2 py-1 rounded bg-red-500 text-white disabled:bg-zinc-300 focus:border-2 focus:border-black
```

### Variants
```
const button = createStyles({
  base: 'button-style',
  variants: {
    foo: {
      bar: 'bar-style',
      baz: 'baz-style',
    }
  }
});


button({ foo: 'bar' });
// button-style bar-style
```

_*Booleans:*_
If a variation value is true / false, you can pass a boolean by default.
### Compound Variants
Compound variants are performed by nesting:
```
const button = createStyles({
  base: 'button-style',
  variants: {
    style: {
      solid: {
        base: 'solid-style',
        variants: {
          colour: {
            red: 'solid-red-style',
            green: 'solid-green-style',
          }
        }
      },
      outline: {
        base: 'outline-style',
        variants: {
          colour: {
            red: 'outline-red-style',
            green: 'outline-green-style',
          }
        }
      }
    }
  }
});


button({ style: 'solid', colour: 'red' });
// button-style solid-style solid-red-style
```

### Merging Styles
Merging styles is done via the `mergeStyles` function. You can add additional variants or extend existing ones.
```
import { createStyles, mergeStyles } from 'cls-variants'; // or aliased as ms

const button = createStyles({
  base: 'button-style'
  variants: {
    size: {
      small: 'small-style',
      medium: 'medium-style'
    }
  }
});

const jumboButton = mergeStyles(
  button,
  createStyles({
    base: 'jumbo-button-style'
    variants: {
      size: {
        jumbo: 'jumbo-style',
      }
    }
  })
);

jumboButton({ size: 'jumbo-style' });
// button-style jumbo-button-style jumbo-style
```
## Utils
The function for flattening and formatting styles is also exported for your own use:

```
import { flattenStyles } from 'cls-variants'; // or aliased as fs

flattenStyles(`
  style-a
  style-b
  style-c
);
// style-a style-b style-c
```