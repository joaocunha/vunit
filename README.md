vUnit
======
vUnit is a vanilla JS microlib (~1000 bytes after gzip) that allows you to size elements based on the viewport dimensions, without relying on the buggy `vh`/`vw`/`vmin`/`vmax` CSS units. [See a live example](http://joaocunha.github.io/vunit/).

> 4x4 panel, 50% height and width:
![4x4 panel, 50% height and width](https://dl.dropboxusercontent.com/u/4533940/vunit/vunit-example.png "4x4 panel, 50% height and width")

## How to use, in 3 steps
**First:** install using [bower](http://bower.io) or [npm](https://www.npmjs.com/package/vunit.js):

`bower install vunit` or `npm install vunit.js`

**Second:** add the script to the `<head>` tag and instantiate `vUnit` passing a `CSSMap` object:
```html
<head>
	<!-- Add vUnit.js to the head to avoid FOUC -->
	<script src="path/to/vunit.js"></script>

	<!-- Instantiate vUnit.js passing a CSSMap with properties you want to play with -->
	<script>
		new vUnit({
			CSSMap: {
				// The selector (VUnit will create rules ranging from .selector1 to .selector100)
				'.vh_height': {
					// The CSS property (any CSS property that accepts px as units)
					property: 'height',
					// What to base the value on (vh, vw, vmin or vmax)
					reference: 'vh'
				},
				// Wanted to have a font-size based on the viewport width? You got it.
				'.vw_font-size': {
					property: 'font-size',
					reference: 'vw'
				},
				// vmin and vmax can be used as well.
				'.vmin_margin-top': {
					property: 'margin-top',
					reference: 'vmin'
				}
			},
			onResize: function() {
				console.log('A screen resize just happened, yo.');
			}
		}).init(); // call the public init() method
	</script>
</head>
<body>
	<h1 class="vw_font-size15">This title font-size is 15% of the viewport width.</h1>
	<p class="vh_height50">This p's height is 50% of the viewport height.</p>
	<p class="vmin_margin-top5">This p has some margin-top<p>
</body>
```

**Third:** Add the generated classes to your HTML elements:
```html
<h1 class="vw_font-size15">This title font-size is 15% of the viewport width.</h1>
<p class="vh_height50">This p's height is 50% of the viewport height.</p>
<p class="vmin_margin-top5">This p has some margin-top.<p>
```

You're done!

## How it works
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

## Pro tips
- **Load vUnit on the `<head>`** tag to avoid FOUC.
- **Add a CSS transition on mobile**, so it doesn't jitter as the address bar appears/disappears.
- vUnit is pretty fast, but **avoid bloating your CSSMap** with properties you won't gonna use.
- **vUnit is not supposed to replace your grid**, but to enhance your design.
- Always **consider non-JS** users.

## Browser support
So far, tested on:
- IE8+
- Chrome
- Firefox
- Safari
- Chrome for Android
- Android Browser 4.3

More to come.

## TODO
- The [issues](https://github.com/joaocunha/vunit/issues) page is your friend.
