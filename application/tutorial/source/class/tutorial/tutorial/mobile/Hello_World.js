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
qx.Class.define("tutorial.tutorial.mobile.Hello_World", 
{
  statics :
  {
    description : "One page showing a button", 

    steps: [
      function() {
        var page = new qx.ui.mobile.page.NavigationPage();
        page.setTitle("Hello World");

        this.getManager().addDetail(page);
        page.show();
      },

      /**
       * @lint ignoreDeprecated(alert)
       */
      function() {
        var page = new qx.ui.mobile.page.NavigationPage();
        page.setTitle("Hello World");
        page.addListener("initialize", function() {
          var button = new qx.ui.mobile.form.Button(
            "Hello..."
          );
          page.getContent().add(button);

          button.addListener("tap", function() {
            alert("... World!");
          }, this);
        },this);

        this.getManager().addDetail(page);
        page.show();
      }
    ]
  }
});