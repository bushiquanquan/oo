var RandomUtil = {};
RandomUtil.pick = function(pool, exceptions)
{
	if (exceptions != null)
	{
		var pool2 = [];
		var n = pool.length;
		for (var i = 0; i < n; i++)
		{
			var item = pool[i];
			if (exceptions.indexOf(item) == -1) pool2.push(item);
		}
		pool = pool2;
	}
	return pool[Math.floor(Math.random() * pool.length)];
}
RandomUtil.pickWeighted = function(weights, values)
{
	//create cumulative weights
	var cw = [];
	var sum = 0;
	for (var i = 0; i < weights.length; i++)
	{
		sum += weights[i];
		cw.push(sum);
	}
	var idx = ArrayUtil.indexOfClosest(cw, Math.random() * sum, ArrayUtil.HIGHER);
	return values ? values[idx] : idx;
}
RandomUtil.pickWeightedFunction = function(values, weightFunction)
{
	//create cumulative weights
	var cw = [];
	var sum = 0;
	for (var i = 0; i < values.length; i++)
	{
		sum += weightFunction(values[i]);
		cw.push(sum);
	}
	var idx = ArrayUtil.indexOfClosest(cw, Math.random() * sum, ArrayUtil.HIGHER);
	return values[idx];
}
RandomUtil.between = function(min, max, integer, extremeFactor)
{
	var p = Math.random();
	if (extremeFactor)
	{
		var f = Math.pow((p < .5) ? p * 2 : (1 - p) * 2, extremeFactor);
		p = (p < .5) ? f / 2 : 1 - (f / 2);
	}
	var n = min + p * (max-min);
	if (integer) return Math.floor(n);
	else return n;
}

var Zone = {};
Zone.NONE = -1;
Zone.OUTSIDE = 0;
Zone.OVER = 1;
Zone.IN = 2;

var State = {};
State.NONE = -1;
State.DRAGGING = 0;
State.DROPPING = 1;
State.DROPPED_IN = 2;
State.SPITTING = 3;

var pnt0 = new Point();
var pnt1 = new Point();
function localToGlobalRect(object,rect,rectOut)
{
	object.localToGlobal(rect.x,rect.y,pnt0);
	object.localToGlobal(rect.x+rect.width,rect.y+rect.height,pnt1);
	rectOut = rectOut || new Rectangle();
	rectOut.setValues(pnt0.x,pnt0.y,pnt1.x-pnt0.x,pnt1.y-pnt0.y);
	return rectOut;
}