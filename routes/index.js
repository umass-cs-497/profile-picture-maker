var Canvas = require('canvas')
var Image = Canvas.Image;


var CANVAS_HEIGHT = 64;
var CANVAS_WIDTH = 64;

/*
 * GET home page.
 */

exports.index = function(req, res)
{
	/*
		Not the cleanest implementation but it works. It generates a data url for each image and puts it
		in an img tag. These are all concatenated for however many you want to make and display. Finally,
		the html, with images in it, is send to the client.
	*/

	//stores html with all images in it
	var images = "";

	//How many images you want to make and show
	var numberOfImages = 100;
	
	for(var i = 0;i<numberOfImages;i++)
	{
		//50/50 chance it generates an image with lines or dots
		if(Math.random() > .5)
		{
			var canvas = createLines(5,10);
		}else{
			var canvas = createDots(10,10);
		}

		//Adds image to html
		images += '<img style="border:1px solid; margin:5px" src="' + canvas.toDataURL() + '" />';
	}

	res.send(images);
};


/*
Will create however many lines you specify with a width you also specify. Color is hardcoded to be randomly generated
*/
var createLines = function(lines, width)
{
  canvas = new Canvas(CANVAS_WIDTH,CANVAS_HEIGHT);
  ctx = canvas.getContext('2d');

  //Determines what color to start with and how much each line changes in hue
  var startHue = Math.random()*360;
  var incrementHue = Math.random() * 12 + 8;


  for(var i = 0;i<lines;i++)
  {
  	var rgb = hsvToRgb((startHue + i*incrementHue) %360 , 100, 100);

  	ctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] +',' + rgb[2] +',0.5)';//'//'rgba(' + Math.round(Math.random()*255)+ ',' + Math.round(Math.random()*255)+',' + Math.round(Math.random()*255)+',0.5)';
  	ctx.lineWidth=width;
  	ctx.beginPath();

  	//50/50 chance lines go from left to right or top to bottom
  	if(Math.random() > .5)
  	{
		ctx.moveTo(0,Math.random()*CANVAS_HEIGHT);	
		ctx.lineTo(CANVAS_WIDTH, Math.random()*CANVAS_HEIGHT);
	}else{
		ctx.moveTo(Math.random()*CANVAS_WIDTH,0);	
		ctx.lineTo( Math.random()*CANVAS_WIDTH, CANVAS_HEIGHT);
	}

	ctx.stroke();
  }	

	return canvas;
}

/*
Will create however many dots you specify with a width you also specify. Color is hardcoded to be randomly generated
*/
var createDots = function(dots, width)
{
  canvas = new Canvas(CANVAS_WIDTH,CANVAS_HEIGHT);
  ctx = canvas.getContext('2d');

  //Determines what color to start with and how much each line changes in hue
  var startHue = Math.random()*360;
  var incrementHue = Math.random() * 12 + 8;

  for(var i = 0;i<dots;i++)
  {
  	var rgb = hsvToRgb(  (startHue + i*incrementHue) %360 , 100, 100);

  	ctx.beginPath();
    ctx.arc(Math.random()*CANVAS_WIDTH, Math.random()*CANVAS_HEIGHT, width, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] +',' + rgb[2] +',0.5)';
    ctx.fill();
  }	

	return canvas;
}



//Helper functions (Borrowed from interwebs)

/**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 * 
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
function hsvToRgb(h, s, v) {
	var r, g, b;
	var i;
	var f, p, q, t;
	
	// Make sure our arguments stay in-range
	h = Math.max(0, Math.min(360, h));
	s = Math.max(0, Math.min(100, s));
	v = Math.max(0, Math.min(100, v));
	
	// We accept saturation and value arguments from 0 to 100 because that's
	// how Photoshop represents those values. Internally, however, the
	// saturation and value are calculated from a range of 0 to 1. We make
	// That conversion here.
	s /= 100;
	v /= 100;
	
	if(s == 0) {
		// Achromatic (grey)
		r = g = b = v;
		return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
	}
	
	h /= 60; // sector 0 to 5
	i = Math.floor(h);
	f = h - i; // factorial part of h
	p = v * (1 - s);
	q = v * (1 - s * f);
	t = v * (1 - s * (1 - f));

	switch(i) {
		case 0:
			r = v;
			g = t;
			b = p;
			break;
			
		case 1:
			r = q;
			g = v;
			b = p;
			break;
			
		case 2:
			r = p;
			g = v;
			b = t;
			break;
			
		case 3:
			r = p;
			g = q;
			b = v;
			break;
			
		case 4:
			r = t;
			g = p;
			b = v;
			break;
			
		default: // case 5:
			r = v;
			g = p;
			b = q;
	}
	
	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}