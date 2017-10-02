var Point3d = function(x,y,z)
{
	this.setValues(x,y,z);
}

Point3d.prototype.setValues = function(x,y,z)
{
	this.x = x||0;
	this.y = y||0;
	this.z = z||0;
}
Point3d.prototype.subtract = function(p)
{
	return new Point3d(this.x-p.x,this.y-p.y, this.z-p.z);
}
Point3d.prototype.add = function(p)
{
	return new Point3d(this.x+p.x,this.y+p.y, this.z+p.z);
}
Point3d.prototype.multiply = function(s)
{
	return new Point3d(this.x*s,this.y*s, this.z*s);
}

Point3d.prototype.getLength = function()
{
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
}

Point3d.prototype.normalize = function()
{
	// p / |p|
	var len = this.getLength();
	return new Point3d(this.x/len, this.y/len, this.z/len);
}

/**
 * Method for calcíng dot product of 2 vectors
 */	
Point3d.prototype.dot	= function(p1)
{
	//http://www.falstad.com/dotproduct/
	//DotProduct = (x1*x2 + y1*y2 + z1*z2)
	var p0 = this;
	return p0.x*p1.x + p0.y*p1.y + p0.z*p1.z;
}

/**
 * Method for calcíng cross product of 2 vectors
 */	
Point3d.prototype.cross	= function(p1)
{
	var p0 = this;
	var x = (p0.y * p1.z) - (p1.y * p0.z);
	var y = (p0.z * p1.x) - (p1.z * p0.x);
	var z = (p0.x * p1.y) - (p1.x * p0.y);
	return new Point3d(x,y,z);
}