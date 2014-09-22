# Indent Guides for Brackets
An extension for [Brackets](https://github.com/adobe/brackets/) to show indent guides in the code editor.

### How to Install
1. Select **Brackets > File > Extension Manager...**
2. Search for this extension.
3. Click on the **Install** button.

### How to Use Extension
Toggle the extension with **View > Indent Guides**.

### Extension Preferences

**`brackets-indent-guides.enabled`** *(boolean)*<br/>
If the value of this preference is `true`, Indent Guides will be visible.
If the value is `false`, Indent Guides will be hidden.

**`brackets-indent-guides.guideColor`** *(string)*<br/>
The color of the indent guides. Can be any valid CSS Color value.

**`brackets-indent-guides.guideStyle`** *(string)*<br/>
This value determines the style of the guide: "solid" or "dotted".

**`brackets-indent-guides.hideFirst`** *(boolean)*<br/>
If the value of this preference is `true` the first Indent Guide will not be drawn.
This is useful if you are using a Brackets Theme that has a vertical border separating
the line numbers from the code.  Set the value to `false` to draw all Indent Guides.

For more information on setting preferences see [How to Use Brackets - Preferences](https://github.com/adobe/brackets/wiki/How-to-Use-Brackets#preferences)

### Known Issues
**Empty lines do not display indent guides**

This is by design. Empty lines have no indentation; therefore, they have no
indent guides. This is the most accurate way to display document indentation
information.

There is also a practical problem.  This extension currently uses CodeMirror
overlays, which do not have the ability to stylize empty lines.  If I can
solve this problem, I will implement a preference to display a "no-gap" version
of indent guides.  If you have any solution ideas, please post them in the
issue list.

### License
MIT-licensed -- see `main.js` for details.

### Compatibility
Tested on Brackets Release 0.43 Mac OSX (Mavericks).
