/*! 版权所有，翻版必究 */
webpackJsonp([0],{107:function(e,t,n){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"page-wrap"},[n("transition",{attrs:{name:"router-fade",mode:"out-in"}},[n("router-view")],1)],1)},staticRenderFns:[]},e.exports.render._withStripped=!0},108:function(e,t,n){function o(e){r||n(109)}var r=!1,u=n(26)(n(111),n(112),o,"data-v-61db4c92",null);u.options.__file="/Users/glory/code/oo/src/view/Main.vue",u.esModule&&Object.keys(u.esModule).some(function(e){return"default"!==e&&"__"!==e.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),u.options.functional&&console.error("[vue-loader] Main.vue: functional components are not supported with templates, they should use render functions."),e.exports=u.exports},109:function(e,t,n){var o=n(110);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);n(25)("6571290e",o,!1)},110:function(e,t,n){t=e.exports=n(24)(void 0),t.push([e.i,"\n.main[data-v-61db4c92] {\n  padding: 10px 20px;\n}\n.main p[data-v-61db4c92] {\n    color: darkgreen;\n}\n",""])},111:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={data:function(){return console.log(""),{test:"hello"}},beforeRouteEnter:function(e,t,n){e.meta.canEnter?n():n({path:"/unauthorized"})},methods:{},mounted:function(){}}},112:function(e,t,n){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"main"},[e._v("\n    "+e._s(e.test)+"\n    "),n("p",[e._v("world")])])},staticRenderFns:[]},e.exports.render._withStripped=!0},113:function(e,t,n){function o(e){r||n(114)}var r=!1,u=n(26)(n(116),n(117),o,"data-v-12f2b481",null);u.options.__file="/Users/glory/code/oo/src/view/sick/sick.vue",u.esModule&&Object.keys(u.esModule).some(function(e){return"default"!==e&&"__"!==e.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),u.options.functional&&console.error("[vue-loader] sick.vue: functional components are not supported with templates, they should use render functions."),e.exports=u.exports},114:function(e,t,n){var o=n(115);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);n(25)("6ad2741f",o,!1)},115:function(e,t,n){t=e.exports=n(24)(void 0),t.push([e.i,"\n.main[data-v-12f2b481] {\n  padding: 10px 20px;\n}\n",""])},116:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={data:function(){return{test:"hello"}},beforeRouteEnter:function(e,t,n){e.meta.canEnter?n():n({path:"/unauthorized"})},methods:{},mounted:function(){window.init("myCanvas",window.Piece,window.Config)}}},117:function(e,t,n){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("canvas",{staticStyle:{position:"absolute","z-index":"2",left:"0px",top:"0px",width:"1440px",height:"150px"},attrs:{id:"myCanvas",resize:"true",width:"2880",height:"300"}})])}]},e.exports.render._withStripped=!0},27:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(14),u=o(r),a=n(28),s=o(a),i=n(48),c=o(i),d=n(85),f=o(d),l=n(86),p=o(l);u.default.use(s.default);var v={userInfo:{}};t.default=new s.default.Store({state:v,getters:f.default,actions:c.default,mutations:p.default})},45:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_STATE="INIT_STATE"},46:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var r=n(14),u=o(r),a=n(27),s=o(a),i=n(91),c=o(i);!function(){new u.default({router:c.default,store:s.default}).$mount("#app")}()},48:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(49),u=o(r),a=n(52),s=o(a),i=n(45);t.default={initState:function(e){var t=this,n=e.commit;return(0,s.default)(u.default.mark(function e(){var o;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:o={id:"22222"},n(i.INIT_STATE,{userInfo:o});case 2:case"end":return e.stop()}},e,t)}))()}}},85:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.account=function(e){return e.userInfo.id?e.userInfo:{}}},86:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(87),r=function(e){return e&&e.__esModule?e:{default:e}}(o),u=n(45);t.default=(0,r.default)({},u.INIT_STATE,function(e,t){var n=t.userInfo;e.userInfo=n})},91:function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(14),u=o(r),a=n(92),s=o(a),i=n(93),c=o(i),d=n(94),f=o(d),l=n(27),p=o(l),v=n(95),_=o(v),m=n(108),h=o(m),x=n(113),b=o(x);u.default.use(s.default);var y=new s.default({routes:[{path:"/room",component:_.default,redirect:"/room",children:[{path:"/",name:"vv-main",component:h.default,meta:{canEnter:!0}}]},{path:"/我想问问你/你到底是不是个神经病",component:_.default,children:[{path:"/",name:"sick",component:b.default,meta:{canEnter:!0}}]}]}),w=(0,c.default)(p.default);y.afterEach(f.default),y.beforeEach(w),t.default=y},93:function(e,t,n){"use strict";function o(e){return function(e,t,n){n()}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o},94:function(e,t,n){"use strict";function o(e){console.log("afterEach")}Object.defineProperty(t,"__esModule",{value:!0}),t.default=o},95:function(e,t,n){function o(e){r||n(96)}var r=!1,u=n(26)(n(99),n(107),o,"data-v-7a37c206",null);u.options.__file="/Users/glory/code/oo/src/index.vue",u.esModule&&Object.keys(u.esModule).some(function(e){return"default"!==e&&"__"!==e.substr(0,2)})&&console.error("named exports are not supported in *.vue files."),u.options.functional&&console.error("[vue-loader] index.vue: functional components are not supported with templates, they should use render functions."),e.exports=u.exports},96:function(e,t,n){var o=n(97);"string"==typeof o&&(o=[[e.i,o,""]]),o.locals&&(e.exports=o.locals);n(25)("5c3bdf7a",o,!1)},97:function(e,t,n){t=e.exports=n(24)(void 0),t.push([e.i,"\n.router-fade-enter-active[data-v-7a37c206], .router-fade-leave-active[data-v-7a37c206] {\n  transition: opacity 0.3s;\n}\n.router-fade-enter[data-v-7a37c206], .router-fade-leave-active[data-v-7a37c206] {\n  opacity: 0;\n}\n.page-wrap[data-v-7a37c206] {\n  height: 100%;\n}\n",""])},99:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(100),r=function(e){return e&&e.__esModule?e:{default:e}}(o),u=n(28);t.default={components:{},computed:(0,r.default)({},(0,u.mapGetters)(["account"]),(0,u.mapState)({userInfo:function(e){return e.userInfo}}))}}},[46]);