"use strict";

/*sugar*/
Array.prototype.contains_ws_ = function() {
	var ret = false, args = arguments;
	for (var k in args) {
		this.forEach(function( val ){
			if ( this.indexOf( args[k] ) >= 0 ) {
				ret = true;
			}
		}, this);
	}
	return ret;
};
/*sugar*/

function WS_DOM_Animatable ( tag, css, attribs ) {
	// call super html
	WS_DOM_Element.call(this, tag, css, attribs);
	this.animClass = ''; 
	this.animTrClass = ''; 
	this.animTimer = []; //[start, end]
	this.animClear = Boolean(true);
	this.parentVideo;
}

function WS_DOM_Media ( tag, css, attribs ) {
	WS_DOM_Element.call(this, tag, css, attribs);
	this.video;
}

function WS_DOM_Element ( tag, css, attribs ) {
	this.html_element = document.createElement(tag);
	this.applyCss(css, this.html_element);
	this.applyAttributes(attribs, this.html_element);
}

WS_DOM_Animatable.prototype.animate = function() {
	var html = this.html_element, aCls = this.animationClass, tCls = this.transitionClass;
	// used by  animatable
	this.transitionend = false;
	if (html.className.indexOf(aCls) === -1) {	
		html.className = ' '+aCls+' '+tCls;
	} else {
		html.className = ' '+tCls;
	}
};

// Creates a style sheet with a class that can then be applied to the element {anim_timer = [start,end]}
WS_DOM_Animatable.prototype.setAnimation = function( anim_class, transform_class, timer ) { 
	var html = this.html_element;
	html.className = anim_class+' '+transform_class;
	html.addEventListener("transitionend", function(){
		this.transitionend = true;
	});
	this.animTimer = timer;
	this.animationClass = anim_class;
	this.transitionClass = transform_class;
};

WS_DOM_Animatable.prototype.checkVideoTimer = function( duration ) {
	var duration_round = Math.round(duration);
	if (this.animTimer[1] > duration_round) {
		this.animTimer[1] = duration_round; 
	}
};

WS_DOM_Element.prototype.getElement = function() {
	return this.html_element;
};

WS_DOM_Element.prototype.setRatio = function() {
	var html = this.html_element;
	if (html instanceof HTMLVideoElement) {
		this.ratio = [1, html.videoHeight/html.videoWidth];
	} else {
		this.ratio = [1, html.offsetHeight/html.offsetWidth];
	}
};

WS_DOM_Element.prototype.applyCss = function( css ) {
	var html = this.html_element;
	for ( var key in css ) {
		html.style[key] = css[key];
	}
};

WS_DOM_Element.prototype.removeCss = function( css ) {
	var html = this.html_element;
	for (var key in css) {
		html.style[key] = '';
	}
};

WS_DOM_Element.prototype.applyAttributes = function( attributes ) {
	var html = this.html_element;
	for ( var key in attributes ) {
		html.setAttribute(key, attributes[key]);
	}
};
// Somewhat modified function, same as from here: http://www.quirksmode.org/js/findpos.html
WS_DOM_Element.prototype.getPosition = function( ) {
	var html = this.html_element;
	var curleft = 0, curtop = 0;
	while (html.offsetParent !== null){
		curleft += html.offsetLeft;
		curtop += html.offsetTop;
		html = html.offsetParent;
	}
	return [curleft, curtop];
};

var video_overlay = {
	extendObj : function( extension, obj ){
	  for ( var key in extension ){
	    obj[key] = extension[key];
	  }
	},
	extendClass : function( sub, base ) {
	  	var origProto = sub.prototype;
		sub.prototype = Object.create(base.prototype);
		for ( var method in origProto ) {
			if ( Object.hasOwnProperty.call(sub.prototype, method) ) {
				throw new Error("Cannot extend: "+sub.toString()+", property is taken");
			} else {
				sub.prototype[method] = origProto[method];
			}
		}
		sub.prototype.constructor = sub;
		Object.defineProperty(sub.prototype, 'constructor', { 
			enumerable: false, 
			value: sub 
		});		
	},
	// Params {classname, cssText}
	makeCss : function ( classnames, css ) {
		var head = document.getElementsByTagName('head')[0],
			cssString = "", stylesheet;
		cssString = classnames+css;
		stylesheet = this.createStyle(cssString);
		head.appendChild(stylesheet);
	},
	// Change naming if class already present in document
	resolveNaming : function ( naming_json ) {
		var query, clsNames, idName;
		for ( var key in naming_json ) {
			var name = naming_json[key];
			// Returns HTMLCollection object not Array
			clsNames = document.getElementsByClassName(name);
			if ( clsNames[0] !== undefined ) {
				naming_json[key] = name+"alt_";
			}
		}
		return naming_json;
	},
	createStyle : function ( cssText ) {
		var v = document.createElement( 'style' );
		v.type = 'text/css';
			// IE
		if (v.styleSheet) {
			v.styleSheet.cssText = cssText;
		} else {
			v.appendChild( document.createTextNode(cssText) );
		}
		return v;
	},
	// applies naming to animation
	applyNaming : function () {
		for (var key in this.animations) {
			this.animations[key][0] = this.naming.animations[key];
		}
	},
	isEmpty : function ( obj ){
		if(Object.getOwnPropertyNames(obj).length === 0){
			return true;
		} else 
			return false
	},
	// Abstracted naming
	naming : {
		animations : {		
			spin : "ws_spin_",
			fade : "ws_fade_"
		},
		canvas: "ws_cvs_"
	},
	animations: {
		spin : ["", "{ -webkit-transform: scale(0) rotateX(360deg) rotateY(-20deg); }"],
		fade : ["", "{ -webkit-transform: scale(0) rotateX(360deg) rotateY(-20deg); }"]
	},
	elements: {
		// Empty until generated
	},	
	generateDomElement : function ( elemConf ) {
		elemConf.type
		var newElem = new WS_DOM_Element();
	},
	// Initializes objects, calculates dimensions
	init: function  ( conf ) {
		this.extendClass(WS_DOM_Animatable, WS_DOM_Element);
		this.extendClass(WS_DOM_Media, WS_DOM_Element);
		var names = this.naming,  anims = this.animations; 
		var overlay = new Object(), video = new Object();
		this.resolveNaming(names.animations);
		this.applyNaming();
		for (var key in conf) {
			elems[key] = generateDomElement( conf[key] );		
		}
	},
	// Append objects to screen, draws the app
	doYourThing: function  () {
		makeCss(".ws_transition_ ", "{ -webkit-transition: -webkit-transform 1s ease-in; }");
	}
};

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false); //remove listener, no longer needed
	var div1, div2;
	div1 = document.createElement('div');
	div2 = document.createElement('div');
	div1.className = video_overlay.naming.animations.spin;
	div2.id = video_overlay.naming.animations.spin;
	document.getElementsByTagName('body')[0].appendChild(div1);	
	div1.appendChild(div2);	
	var width = 300;
	// Execute app last!
	video_overlay.init(
	/**
	 * json spec.
	 * @type {{}}
	 */
		{
			overlay: /* name, must be unique */ {
	 			 type : String('animatable'),
				 tag : String('div'), //default  'div'
				 opacity: Number(0.6), //default 0.6
				 message: String(), //specify message in overlay
				/**
				 * Placement types: 'top', 'bottom', 'left', 'right'.
				 * Specifying banner type defaults x and y to null
				 */
				 placement: {x:Number(50), y:Number(50), type:String()},
				 dimensions: {x:Number(100), y:Number(100)},
				 appearAt : String('video'),
				 imgURI: String(),
				 redirectURL: String(), //string to redirect user if he clicks the overlay 
				/**
				 * Animation types: 'fade', 'spin' and 'none'.
				 */
				 animation: {start:Number(0), end:Number(5), type:String()}, 			 
				// makeCanvas: Boolean(false), // <Proposal> Should the overlay contain a canvas?
				// canvasURI: String() // <Proposal> String to the script executed on the canvas, might be intresting with webgl
			},
			video:  /* name, must be unique */  {
	 			 type : String('video'),
				 tag : String('video'),
				// name of the css selector you want to append this video to
				appendTo : String('body'),
				/**
				 * Specified by width, crops the video element to get the correct aspect ratio
				 */
				 width: Number(),		
				 autoplay: Boolean(true),
				 videoURI: String("mov_bbb.mp4"),
				 controls: Boolean(false), // defaults false, problems working
			}
		}
	);
},false);


			
	// overlay: {
	// 	overlay1: /* name, must be unique */ { 
	// 		 opacity: Number(0.5),
	// 		 dimensions: {x:Number(100), y:Number(100)},
	// 		/**
	// 		 * Placement types: 'top', 'bottom', 'left', 'right'.
	// 		 * Specifying banner type defaults x and y to null
	// 		 */
	// 		placement: {x:Number(), y:Number(), type:String()},
	// 		 imgURI: String(),
	// 		 redirectURL: String(), //string to redirect user if he clicks the overlay 
	// 		/**
	// 		 * Animation types: 'fade', 'spin' and 'none'.
	// 		 */
	// 		 animation: {start:Number(), end:Number(), type:String()}, 			 
	// 		// makeCanvas: Boolean(false), // <Proposal> Should the overlay contain a canvas?
	// 		// canvasURI: String() // <Proposal> String to the script executed on the canvas, might be intresting with webgl
	// 	}
	// },
	// video: {
	// 	video1:  /* name, must be unique */  {
	// 		// name of the css selector you want to append this video to
	// 		appendTo : String('body'),
	// 		linkedTo: String(), // Specify the name of the overlay you want to use on this video
	// 		/**
	// 		 * Specified by width, crops the video element to get the correct aspect ratio
	// 		 */
	// 		 dimensions: {x:undefined, y:undefined},		
	// 		 autoplay: Boolean(true),
	// 		 videoURI: String("mov_bbb.mp4"),
	// 		 controls: Boolean(false),
	// 	}
	// },

	// not used
	// generateOverlays : function(json) {
	// 	var elements = {};
	// 	elements[key].addEventListener("loadedmetadata", function(){			
	// 		overlay.checkVideoTimer(video.duration);
	// 		// Apply default dimensions or custom supplied dimensions
	// 		var vid_dimensions = json.video.video1.dimensions || {};
	// 		vid_dimensions.x = vid_dimensions.x || this.videoWidth;
	// 		vid_dimensions.y = vid_dimensions.y || this.videoHeight;
	// 		for (var k in e){
	// 			e[k].applyCss({ width : vid_dimensions.x+"px", height : vid_dimensions.y+"px" });
	// 		}
	// 		// Show the element after pixels have been drawn.
	// 		video.applyCss({visibility:"visible"});
	// 		// Needs to be called when the metadata has finshed loading.
	// 		video.setRatio();
	// 		container.setRatio();
	// 		// Means that the video is wider than longer
	// 		if (video.ratio[1] < container.ratio[1]) {
	// 		}

	// 		overlay.onclick = function (){
	// 			document.location = "https://www.google.se/";
	// 		}
	// 		// [0] = x , [1] = y 
	// 		video.position = video.getPosition();
	// 		console.log("Video y pos: "+video.position[1]);
	// 		var realHeight = video.offsetHeight;
	// 		var bannerOffset = ( realHeight - realHeight/4) + 1 + video.position[1];
	// 		console.log("Banner offset: "+bannerOffset);
	// 		overlay.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px", position : "absolute", content : "url(http://placehold.it/350x150)"});
	// 		canvas.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px"});
	// 		console.log("Overlay y pos: "+overlay.getPosition()[1]);
	// 	});
	// 	elements[key].addEventListener("timeupdate", function(){
	// 		var curTime = Math.round(this.currentTime);
	// 		for (var key in e) {
	// 			if ( (e[key].animTimer[0] === curTime || e[key].animTimer[1] === curTime) && e[key].transitionend)  {
	// 				e[key].animate();
	// 			}
	// 		}
	// 	});
	// 	return elements;
	// },
	// Params used mostly for testing
	// main: function  () {
	// 	// animation trying to use a unique name
	// 	makeCss(".ws_transition_ ", "{ -webkit-transition: -webkit-transform 1s ease-in; }");
	// 	var e = this.elements;
	// 	e.video.setAttribute("src", json.video.video1.videoURI);
	// 	// e.video.setAttribute("controls", "");
	// 	e.container.id = "ws_json_video";
	// 	e.overlay.className = "overlay";
	// 	try {		
	// 		for (var k in e){
	// 			extend(new WS_DOM_Element(), e[k]);
	// 		}
	// 	} catch (err) {
	// 		console.log(err.message);
	// 	}
	// 	// To avoid black box appearing. 
	// 	e.video.applyCss({visibility:"hidden"});
	// 	// This is overwritten later when the video duration is known
	// 	e.overlay.setAnimation("ws_rotate_", "ws_transition_", [5,20]);
	// 	e.video.addEventListener("loadedmetadata", function(){
	// 		overlay.checkVideoTimer(video.duration);
	// 		// Apply default dimensions or custom supplied dimensions
	// 		var vid_dimensions = json.video.video1.dimensions || {};
	// 		vid_dimensions.x = vid_dimensions.x || this.videoWidth;
	// 		vid_dimensions.y = vid_dimensions.y || this.videoHeight;
	// 		for (var k in e){
	// 			WS[k].applyCss({ width : vid_dimensions.x+"px", height : vid_dimensions.y+"px" });
	// WS 		}
	// 		// Show the element after pixels have been drawn.
	// 		video.applyCss({visibility:"visible"});
	// 		// Needs to be called when the metadata has finshed loading.
	// 		video.setRatioWS
	// 		container.setRatio();
	// 		// Means that the video is wider than longer
	// 		if (video.ratio[1] < container.ratio[1]) {
	// 		}

	// 		overlay.onclick = function (){document.location = "https://www.google.se/";}
	// 		// [0] = x , [1] = y 
	// 		video.position = video.getPosition();
	// 		console.log("Video y pos: "+video.position[1]);
	// 		var realHeight = video.offsetHeight;
	// 		var bannerOffset = ( realHeight - realHeight/4) + 1 + video.position[1];
	// 		console.log("Banner offset: "+bannerOffset);
	// 		overlay.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px", position : "absolute", content : "url(http://placehold.it/350x150)"});
	// 		canvas.applyCss({width : video.offsetWidth+"px", height : realHeight/4+"px", top : bannerOffset+"px"});
	// 		console.log("Overlay y pos: "+overlay.getPosition()[1]);
	// 	});
	// 	// To check when to apply animations
	// 	e.video.addEventListener("timeupdate", function(){
	// 		var curTime = Math.round(this.currentTime);
	// 		for (var key in e) {
	// 			if ( (e[key].animTimer[0] === curTime || e[key].animTimer[1] === curTime) && e[key].transitionend)  {
	// 				e[key].animate();
	// 			}
	// 		}
	// 	});