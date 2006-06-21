/* ************************************************************************

   qooxdoo - the new era of web development

   Copyright:
     2004-2006 by Schlund + Partner AG, Germany
     All rights reserved

   License:
     LGPL 2.1: http://creativecommons.org/licenses/LGPL/2.1/

   Internet:
     * http://qooxdoo.org

   Authors:
     * Sebastian Werner (wpbasti)
       <sw at schlund dot de>
     * Andreas Ecker (ecker)
       <ae at schlund dot de>

************************************************************************ */

/* ************************************************************************

#module(color)
#require(qx.manager.object.ImageManager)

************************************************************************ */

qx.OO.defineClass("qx.renderer.theme.WidgetTheme", qx.core.Object, 
function(vId, vTitle)
{
  qx.core.Object.call(this);

  if (qx.util.Validation.isInvalidString(vId)) {
    throw new Error("Each instance of qx.renderer.theme.WidgetTheme need an unique ID!");
  };

  this.setId(vId);
  this.setTitle(qx.util.Validation.isValidString(vTitle) ? vTitle : vId);

  try {
    qx.manager.object.ImageManager.registerWidgetTheme(this);
  } catch(ex) {
    throw new Error("Could not register Theme: " + ex);
  };
});

qx.OO.addProperty({ name : "id", type : qx.constant.Type.STRING, allowNull : false });
qx.OO.addProperty({ name : "title", type : qx.constant.Type.STRING, allowNull : false, defaultValue : qx.constant.Core.EMPTY });
