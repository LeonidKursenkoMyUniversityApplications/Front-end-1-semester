String.prototype.toDashed = function() {
  return this.replace(/([A-Z])/g, function($1) {
    return "-" + $1.toLowerCase();
  });
};

$ = function(selector) {
  return {
    elements: document.querySelectorAll(selector),
    css: function() {
      let args = arguments;
      let applyStyle = (e, params) => {
        var style = e.hasAttribute("style")
          ? e
              .getAttribute("style")
              .split(";")
              .map(e => {
                var splitted = e.split(":");
                return {
                  name: splitted[0].trim(),
                  value: splitted[1].trim()
                };
              })
          : [];

        for (p in params) {
          let paramName = p.trim().toDashed();
          if (style.some(s => s.name === paramName)) {
            style
              .filter(s => s.name === paramName)
              .forEach(v => (v.value = params[p]));
          } else {
            style.push({
              name: paramName,
              value: params[p].trim()
            });
          }
        }
        e.setAttribute(
          "style",
          style.map(e => `${e.name}:${e.value}`).join(";")
        );
      };

      if (typeof args[0] === "object") {
        this.elements.forEach(e => applyStyle(e, args[0]));
      } else if (typeof args[0] === "string" && typeof args[1] === "string") {
        this.elements.forEach(e =>
          applyStyle(e, {
            [args[0]]: args[1]
          })
        );
      }

      return this;
    }
  };
};
