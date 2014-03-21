/*
 * The MIT License (MIT)
 * Copyright (c) 2013-2014 Lance Campbell. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jslint vars: true, plusplus: true, devel: true, regexp: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
    
    // Brackets modules
    var PreferencesManager  = brackets.getModule("preferences/PreferencesManager"),
        Menus               = brackets.getModule("command/Menus"),
        Editor              = brackets.getModule("editor/Editor").Editor,
        EditorManager       = brackets.getModule("editor/EditorManager"),
        AppInit             = brackets.getModule("utils/AppInit"),
        CommandManager      = brackets.getModule("command/CommandManager"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils");
    
    // Constants
    var COMMAND_NAME    = "Indent Guides",
        COMMAND_ID      = "lkcampbell.toggleIndentGuides";
    
    var enabled     = false,
        hideFirst   = false,
        prefs       = PreferencesManager.getExtensionPrefs("brackets-indent-guides");

    // Set up extension preferences
    prefs.definePreference("enabled", "boolean", false);
    prefs.definePreference("hideFirst", "boolean", false);
    
    // CodeMirror overlay code
    var indentGuidesOverlay = {
        token: function (stream, state) {
            var char        = "",
                colNum      = 0,
                spaceUnits  = 0,
                isTabStart  = false;
            
            char    = stream.next();
            colNum  = stream.column();
            
            // Check for "hide first guide" preference
            if ((hideFirst) && (colNum === 0)) {
                return null;
            }
            
            if (char === "\t") {
                return "lkcampbell-indent-guides";
            }
            
            if (char !== " ") {
                stream.skipToEnd();
                return null;
            }
            
            spaceUnits = Editor.getSpaceUnits();
            isTabStart = (colNum % spaceUnits) ? false : true;
            
            if ((char === " ") && (isTabStart)) {
                return "lkcampbell-indent-guides";
            } else {
                return null;
            }
        },
        flattenSpans: false
    };
    
    function applyPreferences() {
        enabled     = prefs.get("enabled");
        hideFirst   = prefs.get("hideFirst");
    }
    
    function updateUI() {
        var editor  = EditorManager.getCurrentFullEditor(),
            cm      = editor ? editor._codeMirror : null;
        
        // Update CodeMirror overlay if editor is available
        if (cm) {
            cm.removeOverlay(indentGuidesOverlay);
            if (enabled) {
                cm.addOverlay(indentGuidesOverlay);
            }
            cm.refresh();
        }
        
        // Update menu
        CommandManager.get(COMMAND_ID).setChecked(enabled);
    }
    
    // Event handlers
    function handleToggleGuides() {
        enabled = !enabled;
        prefs.set("enabled", enabled);
        prefs.save();
    }
    
    // Initialize extension
    AppInit.appReady(function () {
        // Register toggle command and add it to View menu
        CommandManager.register(COMMAND_NAME, COMMAND_ID, handleToggleGuides);
        Menus.getMenu(Menus.AppMenuBar.VIEW_MENU).addMenuItem(COMMAND_ID);
        
        // Set up event listeners
        prefs.on("change", "enabled", function () {
            applyPreferences();
            updateUI();
        });
        
        $(DocumentManager).on("currentDocumentChange", updateUI);
        
        // Load style sheet, then update the UI
        ExtensionUtils.loadStyleSheet(module, "main.css")
            .done(function () {
                applyPreferences();
                updateUI();
            });
    });
});
