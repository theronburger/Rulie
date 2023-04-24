
# Basic setup


## CSS Relative Color Syntax
https://www.w3.org/TR/css-color-5/#relative-colors
```css
html { --bg-color: blue; }
.overlay {
  background: rgb(from var(--bg-color) r g b / 80%);
}
```
