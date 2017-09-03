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
        MainViewManager     = brackets.getModule("view/MainViewManager");
    
    // Local modules
    var Strings = require("strings");
    
    // SVG support
    var Snap = require("snap.svg-min");
    
    // Constants
    var COMMAND_NAME    = Strings.COMMAND_NAME,
        COMMAND_ID      = "lkcampbell.toggleIndentGuides",
        GUIDE_CLASS     = "lkcampbell-indent-guides";
    
    var guideSVG    = null,
        guideRect   = null;
    
    // Define extension preferences
    var enabled     = false,
        hideFirst   = false,
        guideColor  = "rgba(128, 128, 128, 0.5)",
        guideStyle  = "solid",
        prefs       = PreferencesManager.getExtensionPrefs("brackets-indent-guides");
    
    prefs.definePreference("enabled", "boolean", enabled, {
        description: Strings.DESCRIPTION_ENABLED
    });
    
    prefs.definePreference("hideFirst", "boolean", hideFirst, {
        description: Strings.DESCRIPTION_HIDE_FIRST
    });
    
    prefs.definePreference("guideColor", "string", guideColor, {
        description: Strings.DESCRIPTION_GUIDE_COLOR
    });
    
    prefs.definePreference("guideStyle", "string", guideStyle, {
        description: Strings.DESCRIPTION_GUIDE_STYLE,
        values: ["solid", "dotted"]
    });
    
    function updateStyleRules() {
        var svgStr  = "",
            imgStr  = "",
            cssStr  = "";
        
        if ($("#lkcampbell-indent-guides-css").length) {
            $("#lkcampbell-indent-guides-css").remove();
        }
        
        svgStr  = window.btoa(guideSVG.toString());
        imgStr  = "url(data:image/svg+xml;base64," + svgStr + ")";
        
        cssStr =    ".cm-lkcampbell-indent-guides { ";
        cssStr +=   "position: relative; ";
        cssStr +=   "background-repeat: repeat-y; ";
        cssStr +=   "background-image: " + imgStr + "; ";
        cssStr +=   "}";
        
        $("<style id='lkcampbell-indent-guides-css'>").text(cssStr).appendTo("head");
    }
    
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
                return GUIDE_CLASS;
            }
            
            if (char !== " ") {
                stream.skipToEnd();
                return null;
            }
            
            spaceUnits = Editor.getSpaceUnits();
            isTabStart = (colNum % spaceUnits) ? false : true;
            
            if ((char === " ") && (isTabStart)) {
                return GUIDE_CLASS;
            } else {
                return null;
            }
        },
        flattenSpans: false
    };
    
    function applyPreferences() {
        enabled     = prefs.get("enabled");
        hideFirst   = prefs.get("hideFirst");
        guideColor  = prefs.get("guideColor");
        guideStyle  = prefs.get("guideStyle");
        
        // Set Guide Color
        guideRect.attr({ style: "fill:" + guideColor + ";" });
        
        // Set Guide Line Style
        switch (guideStyle) {
        case "solid":
            guideSVG.attr({ height: "1px" });
            break;
        case "dotted":
            guideSVG.attr({ height: "2px" });
            break;
        default:
        }
        
        updateStyleRules();
    }
    
    function updateUI() {
        var editor  = EditorManager.getActiveEditor(),
            cm      = editor ? editor._codeMirror : null;
        
        // Update CodeMirror overlay if editor is available
        if (cm) {
            cm.removeOverlay(indentGuidesOverlay);
            if (enabled) {
                cm.addOverlay(indentGuidesOverlay);
                updateStyleRules();
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
        // Register command and add to menu
        CommandManager.register(COMMAND_NAME, COMMAND_ID, handleToggleGuides);
        Menus.getMenu(Menus.AppMenuBar.VIEW_MENU).addMenuItem(COMMAND_ID);
        
        // Set up event listeners
        prefs.on("change", function () {
            applyPreferences();
            updateUI();
        });
        
        MainViewManager.on("currentFileChange", updateUI);
        EditorManager.on("activeEditorChange", updateUI);
        
        // Initialize guide SVG
        guideSVG    = new Snap();
        guideRect   = guideSVG.rect(0, 0, 1, 1);
        
        guideSVG.attr({ height: "1px", width: "1px" });
        guideRect.attr({ style: "fill:" + guideColor + ";" });
        
        // Apply preferences and draw indent guides
        applyPreferences();
        updateUI();
    });
});
