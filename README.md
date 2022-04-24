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

## Custom fields
The existing `createStyles` is probably good enough for most scenarios, however you may want to add custom fields. For example maybe you want to create a creator function to handle transitions:

```
import { buildCreateStyles } from 'cls-variants'; // or aliased as bcs

const createTransitionStyles = buildCreateStyles([
  "enter",
  "enterFrom",
  "enterTo",
  "leave",
  "leaveFrom",
  "leaveTo",
]);

const transition = createTransitionStyles({
  base: "base-style",
  enterFrom: "opacity-0",
  enterTo: "opacity-100",
  variants: {
    colour: {
      red: {
        enterFrom: "bg-red-100",
        enterTo: "bg-red-500",
      },
      green: {
        enterFrom: "bg-green-100",
        enterTo: "bg-green-500",
      },
    },
  },
});

// { className: "base-style", enterFrom: "opacity-0 bg-red-100" }
// transition({ "colour": "red" });

<Transition {...transition({ "colour": "red" })} />

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