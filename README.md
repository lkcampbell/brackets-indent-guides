# Indent Guides for Brackets
An extension for [Brackets](https://github.com/adobe/brackets/) to show indent guides in the code editor.

### How to Install
1. Select **Brackets > File > Extension Manager...**
2. Click on **Install from URL...**
3. Paste https://github.com/lkcampbell/brackets-indent-guides
into Extension URL field.
4. Click on the **Install** button.

### How to Use Extension
Toggle the extension with **Brackets > View > Toggle Indent Guides** or use the
shortcut key which is **Ctrl-Alt-I** on Windows and **Command-Alt-I** on Mac.

### Known Issues
**Empty lines do not display indent guides**

This is by design. Empty lines have no indentation; therefore, they have no
indent guides. This is the most accurate way to display document indentation
information.

There is also a practical problem.  This extension currently uses CodeMirror
overlays, which do not have the ability to stylize empty lines.  If I can
solve this problem, I will implement an option to display a "no-gap" version
of indent guides.  If you have any solution ideas, please post them in the
issue list.

### License
MIT-licensed -- see `main.js` for details.

### Compatibility
Tested on Brackets Sprint 22 and later, Windows 7.
