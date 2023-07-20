(() => {
  if (typeof jsToolBar === "undefined") return;

  const supportedTextFormatting = ["textile", "markdown", "common_mark"];
  // Caution:
  //   If you are using "textile" or "markdown", you will need to manually
  //   update the source code to support html SPAN tag in the wiki.
  //   Reference(Japanese): https://redmine.jp/faq/wiki/use-html-tag-in-wiki/

  if (
    !supportedTextFormatting.includes(
      WikiTextColorizer["settings"]["textFormatting"]
    )
  ) {
    // Unsupported text format
    return;
  }

  const resources = WikiTextColorizer["resources"] || {};
  resources.text = resources.text || {};

  /**
   * Add buttons to the jsToolBar.
   */
  function addButtonsToJsToolBar() {
    const textColorButton = {
      type: "button",
      title: resources.text.textColor,
      fn: {
        wiki: function () {
          const jstbButton = $(this.toolbar).find(".jstb_text_color")[0];
          formatTextColor(jstbButton, null);
          $(jstbButton).spectrum("destroy");
        },
      },
    };

    const jstbElements = {};
    for (const e in jsToolBar.prototype.elements) {
      jstbElements[e] = jsToolBar.prototype.elements[e];
      if (e === "em") {
        // Insert button to apply color to text after em
        jstbElements["text_color"] = textColorButton;
      }
    }
    jsToolBar.prototype.elements = jstbElements;
  }
  addButtonsToJsToolBar();

  /**
   * Format the text color of textarea with jstb button.
   * @param {*} jstbButton
   * @param {*} color
   */
  function formatTextColor(jstbButton, color) {
    if (color === null) {
      color = $(jstbButton).spectrum("get");
    }

    const $textArea = $(jstbButton)
      .closest(".jstBlock")
      .find(".jstEditor > textarea");

    if ($textArea.length === 0) {
      console.warn("Textarea not found.");
      return;
    }

    const textArea = $textArea[0];
    const text = textArea.value;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selected = text.substring(start, end);
    const colorString = color.toName() || color.toHexString();
    const prefix = `<span style="color:${colorString};">`;
    const suffix = "</span>";

    // Update textarea
    textArea.setRangeText(prefix + selected + suffix);

    // Move cursor
    if (start === end) {
      textArea.selectionStart = start + prefix.length;
    }

    // Update button color
    $(jstbButton).css("color", colorString);

    // Postprocessing
    $textArea.change().focus();
  }

  $(() => {
    $(document)
      .on("mouseover", ".jstb_text_color", function () {
        // When the mouse over the button, generate the palette.
        $(this)
          .spectrum({
            color: $(this).val(),
            clickoutFiresChange: false,
            togglePaletteOnly: true,
            showPaletteOnly: true,
            togglePaletteMoreText: resources.text.togglePaletteMoreText,
            togglePaletteLessText: resources.text.togglePaletteLessText,
            hideAfterPaletteSelect: true,
            showAlpha: false,
            showInput: true,
            localStorageKey: "wiki-text-colorizer-spectrum-selection-palette",
            change: function (color) {
              formatTextColor(this, color);
            },
          })
          .spectrum("show");
      })
      .on("mouseleave", ".jstb_text_color", function () {
        // If the mouse leaves the button and the focus is somewhere other than
        // the palette, remove the palette.
        if (!$("div.sp-container:hover").length > 0) {
          $(this).spectrum("destroy");
        }
      })
      .on("mouseleave", ".sp-container", function () {
        // When the mouse leaves the palette, remove the palette.
        $(this).remove();
      });
  });
})();
