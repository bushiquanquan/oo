(function(window) {

var Polygon = function()
{
	//Polygon.points is array x0,y0,x1,y1,....,xN,yN
	//points should be ordered clockwise by convention
	this.invalidate();
}

Polygon.prototype.invalidate = function()
{
	//clear all but points
	this._bounds = null;
	this._centroid = null;
	this._polars = null;
	this._perimeter = null;
	this._area = null;
}

/**
 * Returns x,y array [x0,y0,x1,y1,...,xN,yN]
 **/
Polygon.prototype.getPoints = function(dirty)
{
	if (!this._points || dirty)
	{
		this._points = [];
		var c = this.getCentroid();
		for (var i=0;i<this._polars.length;i+=2)
		{
			this._points.push(c.x + Math.cos(this._polars[i+1])*this._polars[i], c.y + Math.sin(this._polars[i+1])*this._polars[i]);
		}
	}
	return this._points;
}

Polygon.prototype.getCentroid = function(dirty)
{
	//centroid is average of all points
	if (!this._centroid || dirty)
	{
		var sumx = 0;
		var sumy = 0;
		var len = this._points.length/2;
		for (var i=0;i<this._points.length;i+=2)
		{
			sumx += this._points[i];
			sumy += this._points[i+1];
		}
		this._centroid = {x:sumx/len, y:sumy/len};
	}
	return this._centroid;
}

Polygon.prototype.getBounds = function(dirty)
{
	//centroid is average of all points
	if (!this._bounds || dirty)
	{
		var ps = this.getPoints();
		this._bounds = {xMin:ps[0],yMin:ps[1],xMax:ps[0],yMax:ps[1]};
		for (var i=2;i<ps.length;i+=2)
		{
			if (this._bounds.xMin>ps[i]) this._bounds.xMin = ps[i];
			else if (this._bounds.xMax<ps[i]) this._bounds.xMax = ps[i];
			if (this._bounds.yMin>ps[i+1]) this._bounds.yMin = ps[i+1];
			else if (this._bounds.yMax<ps[i+1]) this._bounds.yMax = ps[i+1];
		}
	}
	return this._bounds;
}

/**
 * Returns area of poly
 * From: http://www.mathopenref.com/coordpolygonarea2.html
 */
Polygon.prototype.getArea = function(dirty)
{
	if (!this._area || dirty)
	{
		var ps = this.getPoints(dirty);
		var n = ps.length;
		var sum = 0;
		var idx = n-2;
		for (var i=0; i<n; i+=2)
		{
			sum += (ps[idx]+ps[i]) * (ps[idx+1]-ps[i+1]);
			idx = i;
		}
		this._area = -sum/2;
	}
	return this._area;
}

Polygon.prototype.getPerimeter = function(dirty)
{
	if (!this._perimeter || dirty)
	{
		var ps = this.getPoints(dirty);
		var n = ps.length;
		var sum = 0;
		var x = ps[n-2], y = ps[n-1];
		for (var i=0; i<n; i+=2)
		{
			sum += Math.sqrt(Math.pow(x-ps[i],2)+Math.pow(y-ps[i+1],2));
			x = ps[i];
			y = ps[i+1];
		}
		this._perimeter = sum;
	}
	return this._perimeter;
}

Polygon.prototype.getPolars = function(dirty)
{
	if (!this._polars || dirty)
	{
		var c = this.getCentroid();
		this._polars = this.getPolarsForXY(c.x,c.y);
	}
	return this._polars;
}

Polygon.prototype.getPolarsForXY = function(regX,regY)
{
	var polars = [];
	for (var i=0;i<this._points.length;i+=2)
	{
		var x = this._points[i] - regX;
		var y = this._points[i+1] - regY;
		polars.push(Math.sqrt(x*x+y*y), Math.atan2(y,x));
	}
	return polars;
}


Polygon.prototype.transform = function(translateX, translateY, angle, scale)
{
	//return new Polygon with translated, rotated and scaled points
	if (angle==null) angle = 0;
	if (scale==null) scale = 1;
	//rotate all points around centroid
	var c = this.getCentroid();
	var polars = this.getPolars();
	//add angle to polars
	var res = [];
	for (var i=0;i<polars.length;i+=2)
	{
		res.push(polars[i] * scale, polars[i+1] + angle);
	}
	var poly = Polygon.fromPolars({x:c.x+translateX,y:c.y+translateY}, res);
	poly.getPoints();
	return poly;
}

Polygon.prototype.transformAroundXY = function(regX,regY, translateX, translateY, angle, scale)
{
	//return new Polygon with translated, rotated and scaled points using reg as registration point
	if (angle==null) angle = 0;
	if (scale==null) scale = 1;
	//reg is registration Point to transform around.
	var polars = this.getPolarsForXY(regX,regY);
	//apply angle and scale to polars
	for (var i=0;i<polars.length;i+=2)
	{
		polars[i] *= scale;
		polars[i+1] += angle;
	}
	//apply translation
	regX += translateX;
	regY += translateY;
	//now turn polars back into regular points
	var xys = [];
	for (i=0;i<polars.length;i+=2)
	{
		xys.push(regX + Math.cos(polars[i+1])*polars[i], regY + Math.sin(polars[i+1])*polars[i]);
	}
	return Polygon.fromXYArray(xys);
}

/**
 * Tests whether point p is contained in polygon
 **/
Polygon.prototype.containsPoint = function(point)
{
	return this.containsXY(point.x,point.y);
}

/**
 * Tests whether x,y is contained in polygon
 **/
Polygon.prototype.containsXY = function(x,y)
{
	//http://stackoverflow.com/questions/217578/point-in-polygon-aka-hit-test
	//http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	var p = this.getPoints();//xy array
	var n = p.length;
	var res = false;
	var j=n-2;
	for (var i=0; i < n; i+=2)
	{
		if ( ((p[i+1]>y) != (p[j+1]>y)) && x < p[i] + (p[j]-p[i]) * (y-p[i+1]) / (p[j+1]-p[i+1]) )
		{
			res = !res;
		}
		j = i;
	}
	return res;
}

/**
 * Returns random point on poly
 */
Polygon.prototype.getRandomPoint = function(p, attempts)
{
	if (!p) p = new Point();
	if (!attempts) attempts = 99;
	var b = this.getBounds();
	var w = b.xMax-b.xMin, h = b.yMax-b.yMin;
	for (var i=0;i<attempts;i++)
	{
		var x = Math.random()*w+b.xMin;
		var y = Math.random()*h+b.yMin;
		if (this.containsXY(x,y)) return p.setValues(x,y);
	}
	//when too many attempts have failed, return centroid...
	//This is a bit weak.
	var c = this.getCentroid();
	return p.setValues(c.x,c.y);
}

/**
 * Returns point on polygon that is closest to x,y
 */
Polygon.prototype.getClosestPoint = function(x, y, p)
{
	if (!p) p = new Point();
	if (this.containsXY(x,y)) return p.setValues(x,y);
	//find segment with closest distance to p
	var ps = this._points;
	var n = ps.length;
	var bestDistSq = Infinity;
	var bestX0, bestY0, bestX1, bestY1;
	var bestDot;
	for (var i=0;i<n;i+=2)
	{
		var i2 = (i+2)%n;
		var x0 = ps[i], y0 = ps[i+1];
		var x1 = ps[i2], y1 = ps[i2+1];
		var dx = x1-x0;
		var dy = y1-y0;
		var dot = (dx * (x-x0) + dy * (y-y0)) / (dx*dx+dy*dy);
		var distSq;
		if (dot<=0) distSq = Math.pow(x-x0,2) + Math.pow(y-y0,2);
		else if (dot>=1) distSq = Math.pow(x-x1,2) + Math.pow(y-y1,2);
		else distSq = Math.pow(x- (x0 + dot * dx),2) + Math.pow(y- (y0 + dot * dy),2);
		//
		if (distSq<bestDistSq)
		{
			bestDistSq = distSq;
			bestX0 = x0;
			bestY0 = y0;
			bestX1 = x1;
			bestY1 = y1;
			bestDot = dot;
		}
	}
	if (bestDot<=0) return p.setValues(bestX0,bestY0);
	if (bestDot>=1) return p.setValues(bestX1,bestY1);
	return p.setValues(bestX0 + bestDot * (bestX1-bestX0), bestY0 + bestDot * (bestY1-bestY0));
}

/**
 * Returns smallest distance of point to poly
 * See: http://stackoverflow.com/questions/10983872/distance-from-a-point-to-a-polygon
 */
Polygon.prototype.getDistanceToXY = function(x, y, toEdge)
{
	if (!toEdge && this.containsXY(x,y)) return 0;
	//find segment with closest distance to p
	var ps = this.getPoints();
	var n = ps.length;
	var bestDistSq = Infinity;
	for (var i=0;i<n;i+=2)
	{
		var i2 = (i+2)%n;
		var x0 = ps[i], y0 = ps[i+1];
		var x1 = ps[i2], y1 = ps[i2+1];
		var dx = x1-x0;
		var dy = y1-y0;
		var dot = (dx * (x-x0) + dy * (y-y0)) / (dx*dx+dy*dy);
		var distSq;
		if (dot<=0) distSq = Math.pow(x-x0,2) + Math.pow(y-y0,2);
		else if (dot>=1) distSq = Math.pow(x-x1,2) + Math.pow(y-y1,2);
		else distSq = Math.pow(x- (x0 + dot * dx),2) + Math.pow(y- (y0 + dot * dy),2);
		//
		if (distSq<bestDistSq) bestDistSq = distSq;
	}
	return Math.sqrt(bestDistSq);
}

/**
 * Returns point on perimeter for 'progress' value [0..1]
 */
Polygon.prototype.getPointForProgress = function(value)
{
	var ps = this.getPoints();
	var peri = this.getPerimeter();
	var p = peri * value;
	//find correct segment
	var n = ps.length;
	var sum = 0;
	for (var i=0; i<n; i+=2)
	{
		var dx = ps[(i+2)%n]-ps[i];
		var dy = ps[(i+3)%n]-ps[i+1];
		var d = Math.sqrt(dx*dx+dy*dy);
		if (p<=sum+d)
		{
			//interpolate
			var t = (p-sum)/d;
			var x = ps[i]+t*dx;
			var y = ps[i+1]+t*dy;
			var pnt = new Point(x,y);
			pnt.index = i/2;//as a bonus we return the index of the vertex preceding pnt. NB: /2 !
			return pnt;
		}
		sum += d;
	}
}

/**
 * Clip this with convex clipPolygon.
 * Result will be the polygon containing all points that are in both this and clipPolygon
 * http://en.wikipedia.org/wiki/Sutherland-Hodgman_algorithm
 * http://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping
 * http://jsfiddle.net/elisherer/y6RDB/
 **/
Polygon.prototype.clip = function(clipPolygon)
{
	return this.clipXY(clipPolygon.getPoints());
}
Polygon.prototype.clipXY = function(clipXYArray)
{
	var cps = clipXYArray, nc = cps.length;
	var cp0 = new Point(), cp1 = new Point(), p0 = new Point(), p1 = new Point();
	var dc = new Point(), dp = new Point(), ip = new Point();//reusable points
	var m = .000001;
	var inside = function (p)
	{
		//return (cp1.x-cp0.x)*(p.y-cp0.y) > (cp1.y-cp0.y)*(p.x-cp0.x);
		return (cp1.x-cp0.x)*(p.y-cp0.y) - (cp1.y-cp0.y)*(p.x-cp0.x) > -m;
	}
	var intersection = function ()
	{
		dc.setValues(cp0.x - cp1.x, cp0.y - cp1.y);
		dp.setValues(p0.x - p1.x, p0.y - p1.y);
		var	n1 = cp0.x * cp1.y - cp0.y * cp1.x,
				n2 = p0.x * p1.y - p0.y * p1.x,
				n3 = 1.0 / (dc.x * dp.y - dc.y * dp.x);
		return ip.setValues((n1*dp.x - n2*dc.x) * n3, (n1*dp.y - n2*dc.y) * n3);
	}
	var outputList = this.getPoints();
	cp0.setValues(cps[nc - 2], cps[nc - 1]);
	for (var j = 0; j < nc; j+=2)
	{
		cp1.setValues(cps[j], cps[j+1]);
		var inputList = outputList;
		outputList = [];
		var ni = inputList.length;
		p0.setValues(inputList[ni-2],inputList[ni-1]);
		for (var i = 0; i < ni; i+=2)
		{
			p1.setValues(inputList[i], inputList[i+1]);
			if (inside(p1))
			{
				if (!inside(p0))
				{
					var p = intersection();
					outputList.push(p.x,p.y);
				}
				outputList.push(p1.x,p1.y);
			}
			else if (inside(p0))
			{
				var p = intersection();
				outputList.push(p.x,p.y);
			}
			p0.setValues(p1.x, p1.y);
		}
		cp0.setValues(cp1.x,cp1.y);
	}
	return Polygon.fromXYArray(outputList);
}


Polygon.prototype.clone = function()
{
	return Polygon.fromXYArray(this.getPoints().concat([]));
}

//static methods
Polygon.fromPolars = function(centroid, polars)
{
	var res = new Polygon();
	res._centroid = centroid;//Point
	res._polars = polars;//XY Array: radius,angle,radius,angle,....
	return res;
}
Polygon.fromXYArray = function(array, centerOnOrigin)
{
	var res = new Polygon();
	res._points = array;
	if (centerOnOrigin)
	{
		var c = res.getCentroid();
		res = res.transform(-c.x,-c.y,0,1);
	}
	return res;
}
Polygon.fromPoints = function(points, centerOnOrigin)
{
	var xys = [];
	for (var i=0;i<points.length;i++) xys.push(points[i].x,points[i].y);
	return Polygon.fromXYArray(xys,centerOnOrigin);
}

//easeljs 0.8.0 backward compatibility fix
if (Point.prototype.setValues==undefined) Point.prototype.setValues = Point.prototype.initialize;

window.Polygon = Polygon;
}(window));
