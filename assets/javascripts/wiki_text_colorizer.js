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
      type: "text_color_button",
      title: resources.text.textColor,
      fn: {
        wiki: function () {
          const jstbButton = $(this.toolbar).find(".jstb_text_color")[0];
          formatTextColor(jstbButton, null);
          $(jstbButton).spectrum("destroy");
        },
      },
    };

    const textBGColorButton = {
      type: "text_color_button",
      title: resources.text.textBGColor,
      fn: {
        wiki: function () {
          const jstbButton = $(this.toolbar).find(".jstb_text_bgcolor")[0];
          formatTextColor(jstbButton, null, true);
          $(jstbButton).spectrum("destroy");
        },
      },
    };

    const jstbElements = {};
    for (const e in jsToolBar.prototype.elements) {
      jstbElements[e] = jsToolBar.prototype.elements[e];
      if (e === "del") {
        // Insert button to apply color to text after del
        jstbElements["text_color"] = textColorButton;
        jstbElements["text_bgcolor"] = textBGColorButton;
      }
    }
    jsToolBar.prototype.elements = jstbElements;

    jsToolBar.prototype.text_color_button = function (toolName) {
      const b = jsToolBar.prototype.button(toolName);
      const bDrawOrg = b.draw;
      b.draw = () => {
        const button = bDrawOrg.call(b);
        if (toolName === "text_color") {
          $(button).append($("<span/>").addClass("label").text("A"));
        } else {
          $(button).append(
            $("<div/>")
              .addClass("label-box")
              .append($("<span/>").addClass("label").text("A"))
          );
        }
        return button;
      };
      return b;
    };

    jsToolBar.prototype.text_bgcolor_button = function (toolName) {};
  }
  addButtonsToJsToolBar();

  /**
   * Apply style to selected text of textarea
   * @param {*} jstbButton
   * @param {*} key
   * @param {*} value
   */
  function applyStyle(jstbButton, key, value) {
    if (value === null) {
      value = $(jstbButton).spectrum("get");
    }

    const $textArea = $(jstbButton)
      .closest(".jstBlock")
      .find(".jstEditor > textarea");

    if ($textArea.length === 0) {
      console.warn("Textarea not found.");
      return false;
    }

    const textArea = $textArea[0];
    const text = textArea.value;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selected = text.substring(start, end);
    const prefix = `<span style="${key}:${value};">`;
    const suffix = "</span>";

    // Update textarea
    textArea.setRangeText(prefix + selected + suffix);

    // Move cursor
    if (start === end) {
      textArea.selectionStart = start + prefix.length;
    }

    // Postprocessing
    $textArea.change().focus();

    return true;
  }

  /**
   * Format text color or text background color of textarea with jstb button.
   * @param {*} jstbButton
   * @param {*} color
   */
  function formatTextColor(jstbButton, color, background = false) {
    if (color === null) {
      color = $(jstbButton).spectrum("get");
    }

    const colorString = color.toName() || color.toHexString();

    if (
      applyStyle(
        jstbButton,
        (background ? "background-" : "") + "color",
        colorString
      )
    ) {
      if (background) {
        $(jstbButton)
          .children("div.label-box")
          .css({
            backgroundColor: colorString,
            color: color.isDark() ? "#EEE" : "#111",
          });
      } else {
        $(jstbButton).children("span.label").css("color", colorString);
      }
    }
  }

  $(() => {
    // Add empty style tags
    $("head")
      .append($("<style/>").addClass("jstb_text_color"))
      .append($("<style/>").addClass("jstb_text_bgcolor"));

    // Event settings
    $(document)
      .on("mouseover", ".jstb_text_color, .jstb_text_bgcolor", function () {
        const color =
          $(this).val() ||
          ($(this).hasClass("jstb_text_bgcolor") ? "white" : "black");

        // When the mouse over the button, generate the palette.
        $(this)
          .spectrum({
            color: color,
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
              formatTextColor(
                this,
                color,
                $(this).hasClass("jstb_text_bgcolor")
              );
            },
          })
          .spectrum("show");
      })
      .on("mouseleave", ".jstb_text_color, .jstb_text_bgcolor", function () {
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
