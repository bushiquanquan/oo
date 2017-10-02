/**
 * Simple SoundManager for playing event sounds, not streams.
 * Developed for RR.
 *
 * Dependencies:
 * Uses soundjs v0.6.0 or higher.
 * Uses method 'log' for logging.
 *
 * Usage:
 *
 * Preload sounds:
 * SoundManager.init(["sounds/sound1","sounds/sound2"]);
 * where sound1 is base filename of sound1.ogg and sound1.mp3
 *
 * On iOS, sound can only be played on user interaction.
 * So in a mouseup/click handler start a sound and stop it right away.
 * After this, sounds can be played without user interaction.
 * Example:
 * p.handleClick = function()
 * {
 *	if (!this.soundStarted)
 *	{
 *		SoundManager.play(aSoundId);
 *		SoundManager.stop();
 *		this.soundStarted = true;
 *	}
 * }
 *
 * WISH:
 * make prototype + event dispatching + destroy/cleanup
 **/

var SoundManager = {};

SoundManager.lastPlayed = null;
SoundManager.loaded = [];
SoundManager.toLoad = [];
SoundManager.activeInstances = [];//instances!
SoundManager.max = 0;//max simultaneous

SoundManager.init = function(sounds)
{
	//Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashPlugin, createjs.HTMLAudioPlugin]);
	Sound.alternateExtensions = ["mp3"];
	SoundManager.toLoad.length = 0;
	var manifest = [];
	for (var i=0;i<sounds.length;i++)
	{
		var id = sounds[i];
		SoundManager.toLoad.push(id);
		manifest.push({src:id+".ogg", id:id});
	}
	Sound.addEventListener("fileload", SoundManager.handleSoundLoaded);
	//soundjs-0.6.0+ : registerSounds
	if (Sound.registerSounds) Sound.registerSounds(manifest, "");
	else Sound.registerManifest(manifest, "");
}

SoundManager.handleSoundLoaded = function(e)
{
	log("SoundManager.handleSoundLoaded",e.id);
	SoundManager.loaded.push(e.id);
	var idx = SoundManager.toLoad.indexOf(e.id);
	if (idx>-1) SoundManager.toLoad.splice(idx,1);
	if (SoundManager.toLoad.length==0) log("SoundManager.handleSoundLoaded ALL COMPLETE");
}

SoundManager.stop = function()
{
	Sound.stop();
}

SoundManager.play = function(id)
{
	//var soundInstance = Sound.play(id);//play(src, interrupt, delay, offset, loop, volume, pan)
	var soundInstance = Sound.play(id, Sound.INTERRUPT_NONE, 0, 0, false, 1);
	if (soundInstance == null || soundInstance.playState == Sound.PLAY_FAILED) return;
	SoundManager.activeInstances.push(soundInstance);
	soundInstance.on("interrupted", SoundManager.handleSoundEnd, null, true);
	soundInstance.on("complete", SoundManager.handleSoundEnd, null, true);
	soundInstance.__id = id;
	SoundManager.lastPlayed = id;
	if (SoundManager.max>0 && SoundManager.activeInstances.length>SoundManager.max)
	{
		SoundManager.stopSoundByIdx(0);
	}
	log("SoundManager.playSound: ",id, SoundManager.max, SoundManager.activeInstances.length);
	return soundInstance;
}

SoundManager.handleSoundEnd = function(e)
{
	SoundManager.stopSound(e.currentTarget);
}

SoundManager.stopSoundById = function(id)
{
	//stop all sounds with this id
	var all = SoundManager.activeInstances;
	for (var i=all.length-1;i>=0;i--)
	{
		if (all[i].__id==id) SoundManager.stopSound(all[i]);
	}
}

SoundManager.stopSoundByIdx = function(idx)
{
	//stop instance at this idx in activeInstances
	if (SoundManager.activeInstances.length<=idx) return;
	SoundManager.stopSound(SoundManager.activeInstances[0]);

}

SoundManager.stopSound = function(soundInstance)
{
	if (soundInstance)
	{
		soundInstance.stop();
		var idx = SoundManager.activeInstances.indexOf(soundInstance);
		if (idx>-1) SoundManager.activeInstances.splice(idx,1);
	}
	log("SoundManager.stopSound: "+soundInstance.__id, SoundManager.activeInstances.length);
}

SoundManager.playRandom = function()
{
	if (!SoundManager.loaded.length) return;
	var id = RandomUtil.pick(SoundManager.loaded, [SoundManager.lastPlayed])
	SoundManager.play(id);
}

SoundManager.setMute = function(value)
{
	Sound.setMute(value);
}
SoundManager.getMute = function()
{
	return Sound.getMute();
}
SoundManager.toggleMute = function()
{
	Sound.setMute(!Sound.getMute());
}