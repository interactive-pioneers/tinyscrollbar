# Tiny Scrollbar

Fork of Maarten Baijs' Tiny Scrollbar http://www.baijs.com/tinyscrollbar

Tiny Scrollbar is a nice and elegant way to enable the scrolling of content on
mobile and desktop devices.

Fork adds support for detecting the near-the-end of the scroll, more precisely
at reaching 90% of content (`options.enddetection: 0.9`).

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/interactive-pioneers/tinyscrollbar/master/dist/jquery.tinyscrollbar.min.js
[max]: https://raw.github.com/interactive-pioneers/tinyscrollbar/master/dist/jquery.tinyscrollbar.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.tinyscrollbar.min.js"></script>
<script>
jQuery(function($) {
  $('#scrollbarId').tinyscrollbar();
  // Listen to the scroll reaching the end
  $('#scrollbarId').on('enddetected', function() {
    // Handle the scrollable area, e.g. load additional data
  });
</script>
```

## Documentation
_(Coming soon)_

## Examples
See files at [example/](https://github.com/interactive-pioneers/tinyscrollbar/tree/master/example).

## Release History
See [releases](https://github.com/interactive-pioneers/tinyscrollbar/releases).
