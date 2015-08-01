var canvas,ctx,img,finalImage;
var renderableHeight, renderableWidth, xStart, yStart;
var iMouseX, iMouseY = 1;
var theSelection;
    
function setCanvasImage(url) {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    img = new Image();
    img.src = url;
    finalImage = new Image();
    
    
    var fitImageOn = function(image) {
	var imageAspectRatio = image.width / image.height;
	var canvasAspectRatio = canvas.width / canvas.height;
	
    
	// If image's aspect ratio is less than canvas's we fit on height
	// and place the image centrally along width
	if(imageAspectRatio < canvasAspectRatio) {
		renderableHeight = canvas.height;
		renderableWidth = image.width * (renderableHeight / img.height);
		//xStart = (canvas.width - renderableWidth) / 2;
        canvas.width = renderableWidth;
        xStart = 0;
		yStart = 0;
	}

	// If image's aspect ratio is greater than canvas's we fit on width
	// and place the image centrally along height
	else if(imageAspectRatio > canvasAspectRatio) {
		renderableWidth = canvas.width
		renderableHeight = image.height * (renderableWidth / img.width);
        canvas.height = renderableHeight;
		xStart = 0;
		//yStart = (canvas.height - renderableHeight) / 2;
        yStart = 0;
	}

	// Happy path - keep aspect ratio
	else {
		renderableHeight = canvas.height;
		renderableWidth = canvas.width;
		xStart = 0;
		yStart = 0;
	}
    ctx.drawImage(image,0,0,renderableWidth,renderableHeight);
    finalImage.src = canvas.toDataURL();
   // drawScene();
    };
    
    img.onload = function() {
       fitImageOn(img);
       //drawScene();
    }
    finalImage.onload = function() {
        theSelection = new Selection(ctx.canvas.width/2, ctx.canvas.height/2, 777, 777);
        drawScene();
    }
    
    $("#canvas").mousemove(function(e) {
        var canvasOffset = $(canvas).offset();
        iMouseX = Math.floor(e.pageX - canvasOffset.left);
        iMouseY = Math.floor(e.pageY - canvasOffset.top);

        // in case of drag of whole selector
        if (theSelection.bDragAll) {
            theSelection.x = iMouseX - theSelection.px;
            theSelection.y = iMouseY - theSelection.py;
        }

        for (i = 0; i < 4; i++) {
            theSelection.bHow[i] = false;
            theSelection.iCSize[i] = theSelection.csize;
        }

        // hovering over resize cubes
        if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
            iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {

            theSelection.bHow[0] = true;
            theSelection.iCSize[0] = theSelection.csizeh;
        }
        if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
            iMouseY > theSelection.y - theSelection.csizeh && iMouseY < theSelection.y + theSelection.csizeh) {

            theSelection.bHow[1] = true;
            theSelection.iCSize[1] = theSelection.csizeh;
        }
        if (iMouseX > theSelection.x + theSelection.w-theSelection.csizeh && iMouseX < theSelection.x + theSelection.w + theSelection.csizeh &&
            iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

            theSelection.bHow[2] = true;
            theSelection.iCSize[2] = theSelection.csizeh;
        }
        if (iMouseX > theSelection.x - theSelection.csizeh && iMouseX < theSelection.x + theSelection.csizeh &&
            iMouseY > theSelection.y + theSelection.h-theSelection.csizeh && iMouseY < theSelection.y + theSelection.h + theSelection.csizeh) {

            theSelection.bHow[3] = true;
            theSelection.iCSize[3] = theSelection.csizeh;
        }

        // in case of dragging of resize cubes
        var iFW, iFH;
        if (theSelection.bDrag[0]) {
            var iFX = iMouseX - theSelection.px;
            var iFY = iMouseY - theSelection.py;
            iFW = theSelection.w + theSelection.x - iFX;
            iFH = theSelection.h + theSelection.y - iFY;
        }
        if (theSelection.bDrag[1]) {
            var iFX = theSelection.x;
            var iFY = iMouseY - theSelection.py;
            iFW = iMouseX - theSelection.px - iFX;
            iFH = theSelection.h + theSelection.y - iFY;
        }
        if (theSelection.bDrag[2]) {
            var iFX = theSelection.x;
            var iFY = theSelection.y;
            iFW = iMouseX - theSelection.px - iFX;
            iFH = iMouseY - theSelection.py - iFY;
        }
        if (theSelection.bDrag[3]) {
            var iFX = iMouseX - theSelection.px;
            var iFY = theSelection.y;
            iFW = theSelection.w + theSelection.x - iFX;
            iFH = iMouseY - theSelection.py - iFY;
        }

        if (iFW > theSelection.csizeh * 2 && iFH > theSelection.csizeh * 2) {
            theSelection.w = iFW;
            theSelection.h = iFH;

            theSelection.x = iFX;
            theSelection.y = iFY;
        }

        drawScene();
    });

    $('#canvas').mousedown(function(e) { // binding mousedown event
        var canvasOffset = $(canvas).offset();
        iMouseX = Math.floor(e.pageX - canvasOffset.left);
        iMouseY = Math.floor(e.pageY - canvasOffset.top);

        theSelection.px = iMouseX - theSelection.x;
        theSelection.py = iMouseY - theSelection.y;

        if (theSelection.bHow[0]) {
            theSelection.px = iMouseX - theSelection.x;
            theSelection.py = iMouseY - theSelection.y;
        }
        if (theSelection.bHow[1]) {
            theSelection.px = iMouseX - theSelection.x - theSelection.w;
            theSelection.py = iMouseY - theSelection.y;
        }
        if (theSelection.bHow[2]) {
            theSelection.px = iMouseX - theSelection.x - theSelection.w;
            theSelection.py = iMouseY - theSelection.y - theSelection.h;
        }
        if (theSelection.bHow[3]) {
            theSelection.px = iMouseX - theSelection.x;
            theSelection.py = iMouseY - theSelection.y - theSelection.h;
        }
        

        if (iMouseX > theSelection.x + theSelection.csizeh && iMouseX < theSelection.x+theSelection.w - theSelection.csizeh &&
            iMouseY > theSelection.y + theSelection.csizeh && iMouseY < theSelection.y+theSelection.h - theSelection.csizeh) {

            theSelection.bDragAll = true;
        }

        for (i = 0; i < 4; i++) {
            if (theSelection.bHow[i]) {
                theSelection.bDrag[i] = true;
            }
        }
    });

    $('#canvas').mouseup(function(e) { // binding mouseup event
        theSelection.bDragAll = false;

        for (i = 0; i < 4; i++) {
            theSelection.bDrag[i] = false;
        }
        theSelection.px = 0;
        theSelection.py = 0;
    });

    drawScene();
}

    // define Selection constructor
	function Selection(x, y, w, h){
	    this.x = x; // initial positions
        this.y = y;
        this.w = w; // and size
	    this.h = h;
	 
	    this.px = x; // extra variables to dragging calculations
	    this.py = y;
	 
	    this.csize = 2; // resize cubes size
        this.csizeh = 4; // resize cubes size (on hover)
	 
	    this.bHow = [false, false, false, false]; // hover statuses
	    this.iCSize = [this.csize, this.csize, this.csize, this.csize]; // resize cubes sizes
	    this.bDrag = [false, false, false, false]; // drag statuses
	    this.bDragAll = false; // drag whole selection
	}
    
    Selection.prototype.draw = function() {
        
        ctx.strokeStyle = '#000';
	    ctx.lineWidth = 2;
	    ctx.strokeRect(this.x, this.y, this.w, this.h);
        
        // draw part of original image
	    if (this.w > 0 && this.h > 0) {
	        ctx.drawImage(finalImage, this.x, this.y, this.w, this.h, this.x, this.y, this.w, this.h);
	    }
        
        // draw resize cubes
	    ctx.fillStyle = '#fff';
	    ctx.fillRect(this.x - this.iCSize[0], this.y - this.iCSize[0], this.iCSize[0] * 2, this.iCSize[0] * 2);
	    ctx.fillRect(this.x + this.w - this.iCSize[1], this.y - this.iCSize[1], this.iCSize[1] * 2, this.iCSize[1] * 2);
	    ctx.fillRect(this.x + this.w - this.iCSize[2], this.y + this.h - this.iCSize[2], this.iCSize[2] * 2, this.iCSize[2] * 2);
	    ctx.fillRect(this.x - this.iCSize[3], this.y + this.h - this.iCSize[3], this.iCSize[3] * 2, this.iCSize[3] * 2);

    }
    
    function drawScene() {
        //clear canvas
        ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
        ctx.drawImage(finalImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // draw selection
	    theSelection.draw();
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById("crop").addEventListener("click",crop);
     });
    
    function crop() {
        ctx.canvas.width = theSelection.w;
        ctx.canvas.height = theSelection.h;
        ctx.drawImage(finalImage,theSelection.x, theSelection.y, theSelection.w, theSelection.h, 0, 0, theSelection.w, theSelection.h);
        finalImage.src = canvas.toDataURL();
        }

