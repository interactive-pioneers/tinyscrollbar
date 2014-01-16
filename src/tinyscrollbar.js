(function(a) {
  a.tiny = a.tiny || {};
  a.tiny.scrollbar = {
    options: {
      axis: "y",
      wheel: 40,
      scroll: true,
      lockscroll: true,
      size: "auto",
      sizethumb: "auto",
      invertscroll: false,
      enddetection: 0.9
    }
  };
  a.fn.tinyscrollbar = function(d) {
    var c = a.extend({}, a.tiny.scrollbar.options, d);
    this.each(function() {
      a(this).data("tsb", new B(a(this), c));
    });
    return this;
  };
  a.fn.tinyscrollbar_update = function(c) {
    return a(this).data("tsb").update(c);
  };

  function B(q, g) {
    var k = this,
            endDetectionLock = false,
            contentChangeDetector,
            t = q,
            j = {
              obj: a(".viewport", q)
            }, h = {
      obj: a(".overview", q)
    }, d = {
      obj: a(".scrollbar", q)
    }, m = {
      obj: a(".track", d.obj)
    }, p = {
      obj: a(".thumb", d.obj)
    }, l = g.axis === "x",
            n = l ? "left" : "top",
            v = l ? "Width" : "Height",
            r = 0,
            y = {
              start: 0,
              now: 0
            }, o = {}, e = "ontouchstart" in document.documentElement;

    function c() {
      k.update();
      s();
      return k;
    }
    this.update = function(z) {
      j[g.axis] = j.obj[0]["offset" + v];
      h[g.axis] = h.obj[0]["scroll" + v];
      h.ratio = j[g.axis] / h[g.axis];
      d.obj.toggleClass("disable", h.ratio >= 1);
      m[g.axis] = g.size === "auto" ? j[g.axis] : g.size;
      p[g.axis] = Math.min(m[g.axis], Math.max(0, (g.sizethumb === "auto" ? (m[g.axis] * h.ratio) : g.sizethumb)));
      d.ratio = g.sizethumb === "auto" ? (h[g.axis] / m[g.axis]) : (h[g.axis] - j[g.axis]) / (m[g.axis] - p[g.axis]);
      r = (z === "relative" && h.ratio <= 1) ? Math.min((h[g.axis] - j[g.axis]), Math.max(0, r)) : 0;
      r = (z === "bottom" && h.ratio <= 1) ? (h[g.axis] - j[g.axis]) : isNaN(parseInt(z, 10)) ? r : parseInt(z, 10);
      w();
    };

    function w() {
      var z = v.toLowerCase();
      p.obj.css(n, r / d.ratio);
      h.obj.css(n, -r);
      o.start = p.obj.offset()[n];
      d.obj.css(z, m[g.axis]);
      m.obj.css(z, m[g.axis]);
      p.obj.css(z, p[g.axis]);
    }

    function s() {
      if (!e) {
        p.obj.on("mousedown", i);
        m.obj.on("mouseup", u);
      } else {
        j.obj[0].ontouchstart = function(z) {
          if (1 === z.touches.length) {
            i(z.touches[0]);
            z.stopPropagation();
          }
        };
      }
      if (g.scroll && window.addEventListener) {
        t[0].addEventListener("DOMMouseScroll", x, false);
        t[0].addEventListener("mousewheel", x, false);
      } else {
        if (g.scroll) {
          t[0].onmousewheel = x;
        }
      }
    }

    function i(A) {
      a("body").addClass("noSelect");
      var z = parseInt(p.obj.css(n), 10);
      o.start = l ? A.pageX : A.pageY;
      y.start = z === "auto" ? 0 : z;
      if (!e) {
        a(document).on("mousemove", u);
        a(document).on("mouseup", f);
        p.obj.on("mouseup", f);
      } else {
        document.ontouchmove = function(B) {
          B.preventDefault();
          u(B.touches[0]);
        };
        document.ontouchend = f;
      }
    }

    function x(B) {
      if (h.ratio < 1) {
        var A = B || window.event,
                z = A.wheelDelta ? A.wheelDelta / 120 : -A.detail / 3;
        r -= z * g.wheel;
        r = Math.min((h[g.axis] - j[g.axis]), Math.max(0, r));
        p.obj.css(n, r / d.ratio);
        h.obj.css(n, -r);
        detectEnd();
        if (g.lockscroll || (r !== (h[g.axis] - j[g.axis]) && r !== 0)) {
          A = a.event.fix(A);
          A.preventDefault();
        }
      }
    }

    /**
     * Detect the end of the scroll.
     * Use the enddetection ratio from options to trigger slightly earlier.
     * @todo Remove setTimeout call added for content load simulation.
     * @todo Trigger event to which externals could hook to.
     * @returns {Boolean} false on scroll end detection lock, true otherwise.
     */
    function detectEnd() {
      if (endDetectionLock) {
        return false;
      }
      var wholeHeight = h[g.axis];
      var scrollHeight = wholeHeight - j[g.axis];
      var endDetectionPoint = scrollHeight * g.enddetection;
      if (r > endDetectionPoint && r < scrollHeight) {
        endDetectionLock = true;
        dispatchEndDetected();
        contentChangeDetector = setInterval(function() {
          if (wholeHeight < h[g.axis]) {
            clearInterval(contentChangeDetector);
            endDetectionLock = false;
          }
        }, 400);
      }
    }

    /**
     * Dispatch scroll end detection event on the scrollable area.
     */
    function dispatchEndDetected() {
      a(q).trigger(a.Event('enddetected'));
    }

    function u(z) {
      if (h.ratio < 1) {
        if (g.invertscroll && e) {
          y.now = Math.min((m[g.axis] - p[g.axis]), Math.max(0, (y.start + (o.start - (l ? z.pageX : z.pageY)))));
        } else {
          y.now = Math.min((m[g.axis] - p[g.axis]), Math.max(0, (y.start + ((l ? z.pageX : z.pageY) - o.start))));
        }
        r = y.now * d.ratio;
        h.obj.css(n, -r);
        p.obj.css(n, y.now);
        detectEnd();
      }
    }

    function f() {
      a("body").removeClass("noSelect");
      a(document).off("mousemove", u);
      a(document).off("mouseup", f);
      p.obj.off("mouseup", f);
      document.ontouchmove = document.ontouchend = null;
    }
    return c();
  }
}(jQuery));