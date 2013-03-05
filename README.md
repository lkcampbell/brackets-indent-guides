Indent Guides for Brackets
==========
An extension for [Brackets](https://github.com/adobe/brackets/) to show indent guides in the code editor.

How to Install
==============
To use this extension:

1. [Download](https://github.com/lkcampbell/brackets-indent-guides/archive/master.zip)
2. Unzip in **user** folder in **Brackets > Help > Show Extensions Folder**
3. Restart Brackets
4. Toggle the extension with **Brackets > View > Show Indent Guides** or use the
shortcut keys: **Ctrl-Alt-I** on Windows or **Command-Alt-I** on Mac.

Known Issues
============

**Indent guides do not show up on empty lines:**
This extension uses a CodeMirror overlay to create the indent guides.  Unfortunately, CodeMirror does
not currently allow overlays to assign styles to empty lines.  If I can get this added to the CodeMirror
codebase, I will fix this problem in the near future.

License
=======
MIT-licensed -- see `main.js` for details.

Compatibility
=============
Brackets Sprint 21 or later.
