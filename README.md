# Indent Guides for Brackets
An extension for [Brackets](https://github.com/adobe/brackets/) to show indent guides in the code editor.

### How to Install
1. Select **Brackets > File > Extension Manager...**
2. Search for this extension.
3. Click on the **Install** button.

### How to Use Extension
Toggle the extension with **View > Indent Guides**.

### Extension Preferences

**`brackets-indent-guides.enabled`** *(boolean)*:
Determines if Indent Guides will be enabled.


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
Tested on Brackets Sprint 37 Mac OSX (Mavericks).
