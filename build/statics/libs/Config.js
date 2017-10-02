var Config = {};

//base:
Config.debug = false;
Config.framerate = 60;
Config.backgroundColor = '#000';

//piece:
Config.colors = ["#ffffff","#000000"];

Config.cornerX = .63;
Config.cornerY = .59;
Config.tanAngle = 178/428;//tangent of angle of side wall
Config.canX = .53;
Config.canY = .71;
Config.canBaseWidth = .75;//width of base relative to width of top

Config.minScale = .4;//scene will never be scaled smaller than this value

Config.canScale = .4;//relative to screensize
Config.paperScale = .4;
Config.canScaleMobile = .7;//relative to screensize
Config.paperScaleMobile = .7;

Config.spitMargin = .1;//x position in screen where paper can be spit to, relative to width

Config.bottom = -30;

Config.intervalMin = 4000;//in msecs, interval between drop and spit
Config.intervalMax = 9000;

Config.dropDuration = 400;//msecs, relative to drop height
Config.spitDuration = 400;//msecs
Config.throwDuration = 400;//msecs

Config.gravityFactor = 900;

Config.soundDrop = "statics/paper-drop";
Config.soundSpit = "statics/trash-spit";

Config.paperBounds = new Rectangle(-19.5,-20.5,39.2,41.2);
Config.canBounds = new Rectangle(-63.1,-70.5,126.3,140.5-10);
Config.holeBounds = new Rectangle(-63.1,-15.5,126.3,31);

Config.rotationSpeed = 1.5;//in rotations per second
Config.rotations = [0, 92, 103, 233, 274, 326];//in degrees
