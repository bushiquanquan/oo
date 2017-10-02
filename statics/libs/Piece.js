(function(window) {
	var Piece = function(canvas, config)
	{
		this.initialize(canvas, config);
	}
	var p = Piece.prototype = new BasePiece();
	//
	p.initialize = function(canvas, config)
	{
		BasePiece.prototype.initialize.apply(this, [canvas, config]);
		this.stage.enableMouseOver(0);
		createjs.MotionGuidePlugin.install();
		//
		if (isMobile)
		{
			Config.canScale = Config.canScaleMobile;
			Config.paperScale = Config.paperScaleMobile;
		}
		//
		this.stage.regX = this.stage.regY = 0;
		this.container = new Container();
		this.stage.addChild(this.container);
		//
		this.bg = new Shape();
		this.container.addChild(this.bg);
		//
		this.canBack = new Shape();
		this.container.addChild(this.canBack);
		this.canFront = new Shape();
		this.container.addChild(this.canFront);
		this.paper = new Shape();
		this.container.addChild(this.paper);
		this.paper._rotation = this.paper.rotation;
		//
		this.shapeDbg = new Shape();
		this.container.addChild(this.shapeDbg);
		//
		this.ratios = [0,1];
		//
		this.paperBounds = new Rectangle();
		this.holeBounds = new Rectangle();
		this.canBounds = new Rectangle();
		//
		this.dragSpeed = new Point();
		this.dragOffset = new Point();
		this.dragPos = new Point();
		this.goal = new Point();
		//
		//this.debugLinesOn = this.config.debug;
		//
		this.initInteraction();
		this.initSound();
	}

	p.onKeyUp = function(e)
	{
		BasePiece.prototype.onKeyUp.apply(this, [e]);
		if (!this.config.debug) return;
		var c = String.fromCharCode(e.which);
		if (c=="R") this.reset();
		else if (c=="D") this.toggleDebugLines();
		else if (c=="M") SoundManager.toggleMute();
	}
	p.toggleDebugLines = function()
	{
		this.debugLinesOn = !this.debugLinesOn;
		this.shapeDbg.visible = this.debugLinesOn;
		this.drawDebug();
	}

	p.initSound = function()
	{
		SoundManager.init([this.config.soundDrop, this.config.soundSpit]);
		this.soundStarted = !isMobile;
	}
	p.startSound = function()
	{
		if (!this.soundStarted)
		{
			log("startSound");
			SoundManager.play(this.config.soundSpit);
			SoundManager.stop();
			this.soundStarted = true;
			this.paper.y -= 100;
		}
	}

	p.initInteraction = function()
	{
		this.handleMouseDownBound = this.handleMouseDown.bind(this);
		this.handleMouseMoveBound = this.handleMouseMove.bind(this);
		this.handleMouseUpBound = this.handleMouseUp.bind(this);
		this.paper.addEventListener("mousedown", this.handleMouseDownBound);
	}

	p.handleMouseDown = function(e)
	{
		this.startSound();
		if (this.state!=State.NONE) return;
		this.state = State.DRAGGING;
		var x = e.stageX, y = e.stageY;
		this.dragOffset.setValues(x - this.paper.x, y - this.paper.y);
		this.dragPos.setValues(x,y);
		this.dragSpeed.setValues(0,0);
		this.dragStartY = this.paper.y;
		this.dragTime = Date.now();
		this.paper.addEventListener("pressmove", this.handleMouseMoveBound);
		this.paper.addEventListener("pressup", this.handleMouseUpBound);
	}
	p.handleMouseMove = function(e)
	{
		var x = e.stageX, y = e.stageY;
		this.setPaperPos(x - this.dragOffset.x, y - this.dragOffset.y);
		var t = Date.now(), dt = t-this.dragTime;
		if (dt>0)
		{
			this.dragSpeed.x = (2*(x-this.dragPos.x)/dt + this.dragSpeed.x)/3;
			this.dragSpeed.y = (2*(y-this.dragPos.y)/dt + this.dragSpeed.y)/3;
			this.dragPos.setValues(x,y);
			this.dragTime = t;
		}
	}
	p.handleMouseUp = function(e)
	{
		this.stopDrag();
	}
	p.stopDrag = function()
	{
		this.paper.removeEventListener("pressmove", this.handleMouseMoveBound);
		this.paper.removeEventListener("pressup", this.handleMouseUpBound);
		this.state = State.NONE;
		if (Math.pow(this.dragSpeed.x,2) + Math.pow(this.dragSpeed.y,2) < .7) this.drop();
		else this.fly();
	}

	p.setSize = function(w,h,dpr)
	{
		var cfg = this.config;
		this.dpr = dpr;
		w = this.width = Math.floor(w*dpr);
		h = this.height = Math.floor(h*dpr);
		var diag = Math.sqrt(w*w+h*h);
		var s = (diag)/625;
		s = Math.max(cfg.minScale,s);
		log("setSize",w,h, dpr, s);
		this.scale = s;
		//relative offset of can from corner:
		var dx = cfg.canX * w, dy = cfg.canY * h;
		var s2 = s * cfg.canScale;
		this.canFront.setTransform(dx,dy-69.3*s2,s2,s2);
		this.canBack.setTransform(dx,dy-140.1*s2,s2,s2);
		var s2 = s * cfg.paperScale;
		this.paper.setTransform(dx,100,s2,s2,0);
		//
		var bc = this.canBounds, bh = this.holeBounds, bp = this.paperBounds;
		localToGlobalRect(this.canBack,this.config.holeBounds, bh);
		localToGlobalRect(this.canFront,this.config.canBounds, bc);
		localToGlobalRect(this.canFront,this.config.paperBounds, bp);
		var cx = this.cornerX = cfg.cornerX * w, cy = this.cornerY = cfg.cornerY * h, dy = (w-cx) * cfg.tanAngle;
		var cl = bc.x-bp.width/2-1, cr = bc.x+bc.width+bp.width/2+1, cb = bc.y+bc.height+1;
		var clipXYs = [0,h,0,cy, cx,cy];
		if (cy+dy<h) clipXYs.push(w,cy+dy,w,h);
		else clipXYs.push((h-cy)/cfg.tanAngle+cx, h);
		var xys = [-1,-1,cl,-1,cl,cy, cl,cb,cr,cb, cr,-1, w+1,-1, w+1,h+1, -1,h+1];
		var clipPoly = Polygon.fromXYArray(clipXYs).transform(0,0,0,1-cfg.spitMargin);
		this.polyFloor = Polygon.fromXYArray(xys).clip(clipPoly);
		//
		this.drawElements();
		if (this.tickLast) this.reset();
	}

	p.start = function()
	{
		BasePiece.prototype.start.apply(this);
		log("start",this.width,this.height);
		if (this.width) this.reset();
	}

	p.reset = function()
	{
		this.paper.parent.addChild(this.paper);//paper on top
		var p = this.calcRandomPaperPos();
		this.zone = Zone.OUTSIDE;
		this.state = State.NONE;
		this.setPaperPos(p.x,p.y);
	}

	p.calcRandomPaperPos = function(p)
	{
		p = p || new Point();
		//var x = RandomUtil.between(this.config.randomXMin, this.config.randomXMax) * this.width;
		//var y = RandomUtil.between(this.canBounds.y+this.canBounds.height, this.height+this.config.bottom);
		////tests:var x = this.config.randomXMax * this.width, y = this.canBounds.y+this.canBounds.height;
		//p.x = x;
		//p.y = y;
		this.polyFloor.getRandomPoint(p);
		return p;
	}


	p.setPaperPos = function(x,y)
	{
		var xPrev = this.paper.x;
		this.paper.x = x;
		this.paper.y = y;
		this.goal.x = x;
		//
		var z = this.zone;
		var bc = this.canBounds, bh = this.holeBounds, bp = this.paperBounds;
		this.updatePaperBounds();
		//
		this.zone = Zone.OUTSIDE;
		var left = bp.x<bc.x, right = bp.x+bp.width>bc.x+bc.width;
		if (!left && !right)
		{
			//hor2d overlap
			if (bp.y+bp.height<bc.y)
			{
				this.zone = Zone.OVER;//above2d/3d
			}
			else if (z!=Zone.OUTSIDE)
			{
				this.zone = Zone.IN;
				if (bp.y>bh.y+bh.height) this.drop();//top below hole: drop
			}
			//else in front: OUTSIDE by default
		}
		else
		{
			//no hor overlap
			if (z==Zone.IN)
			{
				//previously in hole: correct x and drop
				this.paper.x = xPrev;
				this.zone = Zone.IN;
				this.drop();
			}
		}
		//
		if (this.zone == Zone.OUTSIDE) this.paper.parent.addChild(this.paper);//on top
		else this.canFront.parent.addChild(this.canFront);//on top
		//
		this.updateGoal();
	}
	p.updatePaperBounds = function()
	{
		this.paperBounds.x = this.config.paperBounds.x * this.paper.scaleX + this.paper.x;
		this.paperBounds.y = this.config.paperBounds.y * this.paper.scaleY + this.paper.y;
		//localToGlobalRect(this.paper,this.config.paperBounds, this.paperBounds);
	}

	p.updateGoal = function(randomize)
	{
		var bc = this.canBounds, bh = this.holeBounds, bp = this.paperBounds;
		var canY = bc.y+bc.height, py = this.paper.y;
		var y;
		if (this.zone == Zone.OUTSIDE)
		{
			if (py>canY) //below can
			{
				y = py;
				if (this.dragStartY>py) y += .5 * (this.dragStartY-py);
			}
			else //above/in front of can
			{
				if (!randomize) y = .5 * (this.dragStartY+canY);//canY + .5*dy;
				else y = RandomUtil.between(canY, this.height+this.config.bottom);
			}
		}
		else //OVER or IN
		{
			y = canY - bp.height;
		}
		this.goal.y = y;
	}
	p.updateRotationSpeed = function(duration, dir)
	{
		dir = dir || Math.random()<.5?1:-1;
		var rot = (this.paper._rotation+ 360) %360;
		var rotations = this.config.rotationSpeed*(dir * duration/1000) * 360;
		var goal = ((rot + rotations) % 360 + 360) %360;
		var best = this.findBestRotation(goal);
		var f = duration/1000 * this.config.framerate;
		this.rotationOffset = (rotations + (best - goal) ) / f;
		//log(duration, dir, rotations, rot, goal, best, rot+(rotations + (best - goal)), this.rotationOffset);
	}
	p.findBestRotation = function(rot)
	{
		rot = (rot % 360 +360) % 360;
		var rots = this.config.rotations, best = -1, bestD = Infinity;
		for (var i=0;i<rots.length;i++)
		{
			var r = rots[i];
			var d = Math.abs(r-rot);
			if (d<bestD)
			{
				bestD = d;
				best = r;
			}
		}
		return best;
	}

	p.fly = function()
	{
		this.zone = Zone.OUTSIDE;
		this.paper.parent.addChild(this.paper);//on top
		//calc floor y and fly to goal
		var bc = this.canBounds, bh = this.holeBounds, bp = this.paperBounds;
		this.updatePaperBounds();
		this.updateGoal(true);
		var speedx = this.dragSpeed.x, speedy = this.dragSpeed.y;
		var sx = this.paper.x, sy = this.paper.y, ex = this.goal.x, ey = this.goal.y;
		var gf = this.config.gravityFactor / Math.pow(this.config.framerate,2);
		var v = speedy, y = sy, t = 0;
		while(y<ey+.001)
		{
			y += v;
			v += gf;
			t ++;
		}
		ex = sx + t * speedx;
		var p = this.polyFloor.getClosestPoint(ex,ey);
		ex = p.x;
		ey = p.y;
		var cx = sx+(ex-sx)*.5;
		var cy = sy + Math.abs(cx-sx)/speedx * speedy;
		var path = [sx,sy, cx,cy, ex,ey];
		log("fly",t,path.join(", "));
		var d = this.config.throwDuration*t/this.config.framerate;
		this.state = State.DROPPING;
		Tween.get(this.paper, {onChange:this.onFlyChange.bind(this)})
		.to({guide:{ path:path }}, d, Ease.linear)
		.call(this.onFlyComplete.bind(this));
		//
		this.updateRotationSpeed(d, ex-sx>0?1:-1);
	}
	p.onFlyChange = function(e)
	{
		var bc = this.canBounds, bp = this.paperBounds;
		this.updatePaperBounds();
		var left = bp.x<bc.x, right = bp.x+bp.width>bc.x+bc.width;
		if (!left && !right)
		{
			if (bp.y+bp.height>=bc.y && bp.y<bc.y)
			{
				this.paper.parent.addChild(this.canFront);
				Tween.removeTweens(this.paper);
				this.zone = Zone.IN;
				this.goal.x = this.paper.x;
				var tween = e.target;
				this.drop(tween.duration-tween.position, Ease.linear);
			}
		}
	}
	p.onFlyComplete = function()
	{
		this.updatePaperBounds();
		this.paper._rotation = this.findBestRotation(this.paper._rotation);
		this.state = State.NONE;
	}

	p.drop = function(duration, ease)
	{
		ease = ease || Ease.quadIn;
		this.paper.removeEventListener("pressmove", this.handleMouseMoveBound);
		this.paper.removeEventListener("pressup", this.handleMouseUpBound);
		//calc floor y and drop
		var bc = this.canBounds, bh = this.holeBounds, bp = this.paperBounds;
		this.updatePaperBounds();
		this.updateGoal(true);
		//when dropping just inside the can, correct last part of path so paper ends up completely in can
		var sx = this.paper.x, sy = this.paper.y, ex = this.goal.x, ey = this.goal.y;
		if (sy==ey) return;
		var path = [sx, sy];
		var xCorr = 0;
		if (!duration)
		{
			var dy = (this.goal.y - this.paper.y)/this.scale;
			duration = this.config.dropDuration * Math.sqrt(dy)/10;
		}
		if (this.zone==Zone.OVER || this.zone==Zone.IN)
		{
			var m = (.5-.5*this.config.canBaseWidth) * bc.width;
			if (bp.x+bp.width > bc.x+bc.width-m) xCorr = bc.x+bc.width-m - (bp.x+bp.width);
			else if (bp.x < bc.x+m) xCorr = bc.x+m - bp.x;
		}
		if (xCorr!=0)
		{
			if (bp.y+bp.height<bc.y)
			{
				path.push((sx+ex)/2, (sy+bc.y)/2, ex, bc.y);
				sy = bc.y;
			}
			ex += xCorr;
		}
		path.push((ex+sx)/2,(ey+sy)/2, ex,ey);
		log("drop",path.join(", "));
		this.state = State.DROPPING;
		Tween.get(this.paper, {onChange:this.onDropChange.bind(this)})
		.to({guide:{ path:path }}, duration, ease)
		.call(this.onDropComplete.bind(this));
		this.soundDropToPlay = this.zone == Zone.IN || this.zone == Zone.OVER;
		//
		this.updateRotationSpeed(duration);
	}
	p.onDropChange = function()
	{
		if (this.soundDropToPlay && this.paper.y>this.canBounds.y)
		{
			this.soundDropToPlay = false;
			SoundManager.play(this.config.soundDrop);
		}
	}
	p.onDropComplete = function()
	{
		this.updatePaperBounds();
		this.paper._rotation = this.findBestRotation(this.paper._rotation);
		if (this.zone == Zone.IN || this.zone == Zone.OVER)
		{
			var f = RandomUtil.between(this.config.intervalMin, this.config.intervalMax) / this.config.framerate;
			this.nextSpitAt = this.tickCount + f;
			this.state = State.DROPPED_IN;
		}
		else
		{
			this.state = State.NONE;
		}
	}


	p.spitRandom = function()
	{
		this.paper.x = this.canBounds.x+this.canBounds.width/2;
		this.paper.y = this.canBounds.y+this.holeBounds.height/2 + this.paperBounds.height/2;
		var p = this.calcRandomPaperPos(this.goal);
		log("spitRandom",p.x,p.y);
		var cx = .5 * (p.x + this.paper.x);
		var cy = .5 * (p.y + this.paper.y) - 3*this.canBounds.height;
		var obj = this.paper;
		var path = [obj.x,obj.y, cx,cy,p.x,p.y];
		Tween.get(obj, {onChange:this.onSpitChange.bind(this)})
		.to({guide:{ path:path }}, this.config.spitDuration, Ease.quadIn)
		.call(this.onSpitComplete.bind(this));
		SoundManager.play(this.config.soundSpit);
		//
		this.updateRotationSpeed(this.config.spitDuration);
	}
	p.onSpitChange = function()
	{
		var bc = this.canBounds, bp = this.paperBounds;
		this.updatePaperBounds();
		if (bp.y+bp.height<bc.y) this.paper.parent.addChild(this.paper);//on top
	}
	p.onSpitComplete = function()
	{
		this.paper._rotation = this.findBestRotation(this.paper._rotation);
		this.zone = Zone.OUTSIDE;
		this.state = State.NONE;
	}


	p.update = function()
	{
		switch(this.state)
		{
			case State.SPITTING:
			case State.DROPPING:
				this.paper._rotation += this.rotationOffset;
				this.paper.rotation = this.paper._rotation;
				break;
			case State.DROPPED_IN:
				if (this.nextSpitAt<this.tickCount)
				{
					this.state = State.SPITTING;
					this.spitRandom();
				}
				break;
		}
		this.drawDebug();
		this.stage.update();
		this.paper.rotation = this.paper._rotation;
		return false;
	}

	p.drawElements = function()
	{
		var cfg = this.config, w = this.width, h = this.height;
		var cx = this.cornerX, cy = cfg.cornerY * h;
		var dy = (w-cx) * cfg.tanAngle;
		this.bg.graphics.c()
		//walls
		.lf(cfg.colors, this.ratios,0,0,cx,0).r(0,0,cx,cy)
		.lf(cfg.colors, this.ratios,w,0,cx,0).mt(cx,cy).lt(cx,0).lt(w,0).lt(w,cy+dy);
		this.bg.cache(0,0,w,cy+dy);
		//trashcan back
		this.canBack.graphics.c().lf(cfg.colors,this.ratios,-63.1,0,63.2,0).p("Am+BuQi5guAAhAQAAg/C5guQC5gtEFAAQEFAAC5AtQC6AuAAA/QAABAi6AuQi5AtkFAAQkFAAi5gtg");
		//trashcan fore
		var bc = this.config.canBounds;
		this.canFront.graphics.c().lf(cfg.colors,this.ratios,63.2,-0.3,-63.1,-0.3).p("AlkKZQiUgkAAgzIh+z/QAMA7CsArQC5AtEFAAQEFAAC5gtQCtgrAMg7Ih+T/QAAAziUAkQiUAljRAAQjQAAiUglg");
		//paper
		this.paper.graphics.c().f("#FFFFFF").p("AizBiIAAhWIgQg8IBuiJIBVgUIA+ArIBCAFIATA0IAxAoIgdAdIAdA9IAACHIhxAIIhwAlg");
		if (isMobile)
		{
			this.paper.graphics.f('rgba(80,80,80,.01)').dc(0,0,cfg.paperBounds.width*1.2);
		}
	}

	p.drawDebug = function()
	{
		if (this.debugLinesOn)
		{
			var bc = this.canBounds, bh = this.holeBounds, bp = this.paperBounds;
			var pcx = bp.x+bp.width/2, pcy = bp.y+bp.height/2;
			var hcx = bh.x+bh.width/2, hcy = bh.y+bh.height/2;
			var m = (.5-.5*this.config.canBaseWidth) * bc.width;
			this.shapeDbg.parent.addChild(this.shapeDbg);//on top
			var c = ['#fff','#0f0','#f00'][Math.max(0,this.zone)];
			var g = this.shapeDbg.graphics.c()
			.s('#00f').r(bc.x,bc.y,bc.width,bc.height)
			.s('#00f').r(bc.x+m,bc.y,bc.width-2*m,bc.height)
			.s('#0f0').r(bh.x,bh.y,bh.width,bh.height)
			.s(c).r(bp.x,bp.y,bp.width,bp.height)
			//angle paper/can
			//.s('#8f8').mt(hcx,hcy).lt(pcx,pcy)
			//vector paper-floor
			.s('#88f').mt(this.goal.x,this.goal.y).lt(pcx,pcy)
			//dragStartY
			.s('#f00').de(pcx-3,this.dragStartY-2,6,4)
			;
			var xys = this.polyFloor.getPoints(), n = xys.length;
			g.s('#8f8').mt(xys[n-2],xys[n-1]);
			for (var i=0;i<n;i+=2)
			{
				g.lt(xys[i],xys[i+1]);
			}
		}
	}

	window.Piece = Piece;

}(window));

