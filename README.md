VUnit
======

## A vanilla JS alternative to buggy vh/vw & vmin/vmax CSS units.
Viewport relative units are awesome, except they're not - they are [buggy, unreliable and have inconsistent implementation across browsers](http://caniuse.com/#feat=viewport-units). `vUnit.js` offers a lightweight, robust alternative for them and weighs ~600 bytes after gzip.

`vUnit.js` calculates the browser viewport dimensions and creates CSS rules ranging from 1% to 100% of its size. These rules are then inserted into a stylesheet which is injected on the fly to the `<head>` tag.

An observer running every 100ms checks if the viewport has been resized and regenerates the CSS rules accordingly. It's a cross-device, event-less solution to keep track of everything that would trigger a resize on the viewport, namely:

- Window resizing on desktop;
- Orientation change on mobile;
- Scrollbars appearing/disappearing on desktop;
- Navigation bars appearing/disappearing on mobile;
- Zooming on mobile and desktop;
- Download bar on desktop;
- Password saving prompt on desktop;
- Etc.

## [Live example](http://joaocunha.github.io/vunit/)
Could do with some love but it shows the point.

## Pro tips
- Load vUnit on the head tag to avoid FOUC.
- Add a CSS transition on mobile, so it doesn't jitter as the address bar appears/disappears.
- vUnit is pretty fast, but avoid bloating your CSSMap with properties you won't gonna use.
- vUnit is not supposed to replace your grid, just to enhance your design.
- Always consider non-JS users.

## Support
So far, tested on:
- IE8+
- Chrome
- Firefox
- Chrome for Android
- Android Browser 4.3

More to come.

## TODO
- The [issues](https://github.com/joaocunha/vunit/issues) page is your friend.
