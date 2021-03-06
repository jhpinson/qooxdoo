/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)

************************************************************************ */

/* ************************************************************************
#asset(tutorial/*)
#require(qx.module.Manipulating)
#require(qx.module.Attribute)
#require(qx.module.Traversing)
************************************************************************ */

/**
 * This is the main application class of your custom application "tutorial"
 */
qx.Class.define("tutorial.Application",
{
  extend : qx.application.Standalone,


  members :
  {
    __header : null,
    __playArea : null,
    __editor : null,
    __description : null,
    __selectionWindow : null,
    __actionArea : null,

    __desktopTutorials : null,
    __mobileTutorials : null,

    __confirmWindow : null,

    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      // Tutorials List
      this.__desktopTutorials = ["Hello_World", "Form", "Single_Value_Binding"];
      this.__mobileTutorials = ["Hello_World", "Pages"];

      // Create main layout
      var mainComposite = new qx.ui.container.Composite(new qx.ui.layout.VBox());
      this.getRoot().add(mainComposite, {edge:0});

      // Create header
      this.__header = new tutorial.view.Header();
      this.__header.addListener("selectTutorial", this.openSelectionWindow, this);
      mainComposite.add(this.__header);

      // create the content
      var content = new qx.ui.splitpane.Pane();
      content.setAppearance("app-splitpane");
      content.setPaddingTop(10);
      mainComposite.add(content, {flex: 1});

      this.__description = new tutorial.view.Description();
      this.__description.addListener("run", this.run, this);
      this.__description.addListener("update", this.updateEditor, this);
      this.__description.addListener("selectTutorial", this.openSelectionWindow, this);

      content.add(this.__description, 1);

      var actionArea = new qx.ui.splitpane.Pane();
      this.__actionArea = actionArea;
      this.__editor = new playground.view.Editor();
      actionArea.add(this.__editor);
      playground.view.Editor.loadAce(function() {
        this.__editor.init();
      }, this);

      this.__playArea = new playground.view.PlayArea();
      this.__playArea.setBackgroundColor("white");

      actionArea.add(this.__playArea);
      this.__playArea.updateCaption("");
      this.__playArea.addListener("toggleMaximize", function(e) {
        if (!this.__editor.isExcluded()) {
          this.__editor.exclude();
          this.__description.exclude();
        } else {
          this.__editor.show();
          this.__description.show();
        }
      }, this);

      content.add(actionArea, 3);

      // set the blocker color
      this.getRoot().setBlockerColor("rgba(0, 0, 0, 0.35)")
    },

    // overridden
    finalize: function() {
      this.loadTutorial("Hello_World", "desktop");
    },


    openSelectionWindow : function() {
      if (!this.__selectionWindow) {
        this.__selectionWindow = new tutorial.view.SelectionWindow(
          this.__desktopTutorials, 
          this.__mobileTutorials
        );
        this.__selectionWindow.addListener("changeTutorial", this.__onChangeTutorial, this);
      }

      this.__selectionWindow.open();
      this.render();  // make sure the DOM object is available for the fade
      this.__selectionWindow.fadeIn(300);
    },


    __onChangeTutorial : function(e) {
      this.loadTutorial(e.getData().name, e.getData().type);
      this.__editor.setCode("");
      this.run();
    },


    updateEditor : function(e) {
      var code = e.getData().toString();
      this.confirm("Is it ok to replace the current code in the editor?", function(ok) {
        if (ok.getData()) {
          code = code.substring(14, code.length -8);
          code = code.replace(/ {8}/g, "");
          this.__editor.setCode(code);
          this.run();
        }
      }, this);
    },


    confirm : function(text, callback, ctx) {
      if (!this.__confirmWindow) {
        this.__confirmWindow = new tutorial.view.Confirm();
      }
      this.__confirmWindow.setMessage(text);
      this.__confirmWindow.open();
      this.render();
      this.__confirmWindow.fadeIn(300);
      this.__confirmWindow.addListenerOnce("confirm", callback, ctx);
    },


    run : function() {
      var code = this.__editor.getCode();

      // don't run if we have no code
      if (code == "") {
        return;
      }

      // reset the play area
      this.__playArea.reset({}, {});

      // try to create a function
      try {
        this.fun = new Function(code);
      } catch(ex) {
        var exc = ex;
      }
      // run the code
      try {
        // run the application
        this.fun.call(this.__playArea.getApp());
      } catch(ex) {
        var exc = ex;
      }
      if (exc) {
        this.__editor.setBackgroundColor("#FFF0F0");
        this.__editor.setError(exc);
        this.error(exc);
      } else {
        this.__editor.setError();
        this.__editor.setBackgroundColor("white");
      }
    },


    loadTutorial : function(name, type) {
      var htmlFileName = qx.util.ResourceManager.getInstance().toUri(
        "tutorial/" + type + "/" + name + ".html"
      );
      var req = new qx.io.request.Xhr(htmlFileName);
      req.addListener("success", function(e) {
        var req = e.getTarget();
        var tutorial = this.parseTutorial(name, type, req.getResponse());
        this.__description.setTutorial(tutorial);
        this.__playArea.updateCaption(name.replace(/_/g, " ") + " (" + type + ")");
        this.__playArea.setMode(type !== "desktop" ? "mobile" : "ria")
        this.__actionArea.setOrientation(type == "desktop" ? "vertical" : "horizontal");
      }, this);
      req.send();
    },


    parseTutorial : function(name, type, html) {
      var tut = {
        name : name,
        type : type,
        steps : [],
        code : qx.Class.getByName("tutorial.tutorial." + type + "." + name).steps
      };
      var div = q.create("<div>").setHtml(html);
      div.getChildren().forEach(function(item) {
        tut.steps.push(q(item).getHtml());
      });
      return tut;
    }
  }
});