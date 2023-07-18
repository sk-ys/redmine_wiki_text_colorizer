(() => {
  if (typeof jsToolBar === "undefined") return;

  const textColorButton = {
    type: "button",
    title: "Text Color",
    fn: {
      wiki: function () {
        console.log("action");
      },
    },
  };

  // Recreate toolbar
  const elements = {};
  for (const e in jsToolBar.prototype.elements) {
    elements[e] = jsToolBar.prototype.elements[e];
    if (e === "em") {
      // Insert button to apply color to text after em
      elements["text_color"] = textColorButton;
    }
  }
  jsToolBar.prototype.elements = elements;
})();
