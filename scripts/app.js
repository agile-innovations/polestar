/**
 * @license
 *
 * Copyright (c) 2015, University of Washington Interactive Data Lab.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * * Neither the name of the University of Washington Interactive Data Lab
 *   nor the names of its contributors may be used to endorse or promote products
 *   derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
"use strict";angular.module("polestar",["vlui","ngSanitize","ngTouch","ngDragDrop","zeroclipboard","Chronicle","LocalStorageModule","720kb.tooltips","ngOrderObjectBy","angular-google-analytics"]).constant("_",window._).constant("vl",window.vl).constant("vg",window.vg).constant("ZSchema",window.ZSchema).constant("Tether",window.Tether).constant("Drop",window.Drop).constant("Blob",window.Blob).constant("URL",window.URL).constant("jsondiffpatch",window.jsondiffpatch).config(["consts",function(e){window.vg.util.extend(e,{appId:"polestar",logLevel:"DEBUG",logToWebSql:!0,initialSpec:window.initialSpec||void 0})}]).config(["vl",function(e){e.config.defaultConfig.countTitle="COUNT"}]).config(["uiZeroclipConfigProvider",function(e){e.setZcConf({swfPath:"bower_components/zeroclipboard/dist/ZeroClipboard.swf"})}]).config(["localStorageServiceProvider",function(e){e.setPrefix("polestar")}]).config(["AnalyticsProvider","consts",function(e,t){t.embeddedData||e.setAccount({tracker:"UA-44428446-4",name:"polestar",trackEvent:!0})}]),angular.module("polestar").directive("vlSpecEditor",["Spec",function(e){return{templateUrl:"components/vlSpecEditor/vlSpecEditor.html",restrict:"E",scope:{},link:function(t){t.Spec=e,t.parseVegalite=function(t){e.parseSpec(JSON.parse(t))}}}}]),angular.module("polestar").directive("vgSpecEditor",["Spec",function(e){return{templateUrl:"components/vgSpecEditor/vgSpecEditor.html",restrict:"E",scope:{},link:function(t){t.Spec=e}}}]),angular.module("polestar").directive("lyraExport",function(){return{template:'<a href="#" class="command" ng-click="export()">Export to lyra</a>',restrict:"E",replace:!0,scope:{},controller:["$scope","$timeout","Spec","Alerts",function(e,t,n,a){e["export"]=function(){var e=n.vgSpec;e||a.add("No vega spec present."),e.marks[0]["lyra.groupType"]="layer";var o="http://idl.cs.washington.edu/projects/lyra/app/",r=window.open(o,"_blank");t(function(){a.add("Please check whether lyra loaded the vega spec correctly. This feature is experimental and may not work.",5e3),r.postMessage({spec:e},o)},5e3)}}]}}),angular.module("polestar").directive("jsonInput",["JSON3",function(e){return{restrict:"A",require:"ngModel",scope:{},link:function(t,n,a,o){var r=function(t){return e.stringify(t,null,"  ",80)};o.$formatters.push(r)}}}]),angular.module("polestar").directive("configurationEditor",function(){return{templateUrl:"components/configurationeditor/configurationeditor.html",restrict:"E",scope:{},controller:["$scope","Config",function(e,t){e.Config=t}]}}),angular.module("polestar").service("Spec",["_","vg","vl","cql","ZSchema","Alerts","Config","Dataset","Schema","Pills","Chart","consts","util","FilterManager","ANY","Logger",function(e,t,n,a,o,r,i,c,s,l,d,p,u,g,f,m){function v(){return{data:i.data,transform:{filterInvalid:void 0},mark:f,encoding:E.reduce(function(e,t){return e[t]={},e},{}),config:i.config}}function h(n){for(var a in n)e.isObject(n[a])&&h(n[a]),(null===n[a]||void 0===n[a]||e.isObject(n[a])&&0===t.util.keys(n[a]).length&&"bin"!==a||n[a]===[])&&delete n[a]}function S(t){var a=u.duplicate(t),o=null;if(a){o=(a.transform||{}).filter;var r=e.omit(a.transform||{},"filter");a=e.omit(a,"transform"),r&&(a.transform=r)}var i=n.util.mergeDeep(v(),a);return i.transform.filter=g.reset(o),i}function y(e,n){if(n){e=u.duplicate(e),e.transform&&e.transform.filter&&delete e.transform.filter;var o=g.getVlFilter();o&&(e.transform=e.transform||{},e.transform.filter=o)}return{data:i.data,mark:e.mark===f?"?":e.mark,transform:e.transform,encodings:t.util.keys(e.encoding).reduce(function(n,o){var r=t.util.extend({channel:l.isAnyChannel(o)?"?":o},e.encoding[o],{title:void 0});return a.enumSpec.isEnumSpec(r.field)&&(r.field={name:"f"+o,"enum":r.field["enum"]}),n.push(r),n},[]),config:e.config}}function k(t,n){var o=y(t,n),r=e.some(o.encodings,function(e){return a.enumSpec.isEnumSpec(e.field)}),i=r?["field","aggregate","bin","timeUnit","stack"]:["field","aggregate","bin","timeUnit","stack","channel"];return{spec:o,groupBy:i,orderBy:["aggregationQuality","effectiveness"],chooseBy:"effectiveness",config:{omitTableWithOcclusion:!1}}}function b(e){return{}}function w(e,t,a){var o=t.type,r=n.channel.getSupportedRole(a),i=r.dimension&&!r.measure;t.field&&i?"count"===t.aggregate?t={}:o!==n.type.QUANTITATIVE||t.bin?o!==n.type.TEMPORAL||t.timeUnit||(t.timeUnit=p.defaultTimeFn):(t.aggregate=void 0,t.bin={maxbins:n.bin.MAXBINS_DEFAULT}):t.field||(t={});var c=b(a),l=s.getChannelSchema(a).properties;for(var d in l)t[d]&&("value"===d&&t.field?delete c[d]:c[d]=t[d]);e[a]=c}var E=e.keys(s.schema.definitions.Encoding.properties),C={spec:null,chart:d.getChart(null),isSpecific:!0};return C._removeEmptyFieldDefs=function(t){t.encoding=e.omit(t.encoding,function(e,a){return!e||void 0===e.field&&void 0===e.value||t.mark&&!n.channel.supportMark(a,t.mark)})},C.parseSpec=function(e){C.spec=S(e)},C.reset=function(){var e=v();e.transform.filter=g.reset(),C.spec=e},C.update=function(n){n=e.cloneDeep(n||C.spec),C._removeEmptyFieldDefs(n),h(n),n.transform&&n.transform.filter&&delete n.transform.filter;var o=g.getVlFilter();if(o&&(n.transform=n.transform||{},n.transform.filter=o),"encoding"in n||(n.encoding={}),"config"in n||(n.config={}),t.util.extend(n.config,i.small()),!c.schema)return C;var r=k(n);if(e.isEqual(r,C.cleanQuery))return C;C.cleanQuery=r;var s=a.query(r,c.schema);C.query=s.query;var l=s.result.getTopSpecQueryModel();return C.chart=d.getChart(l),C},l.listener={set:function(e,t){w(C.spec.encoding,t,e)},remove:function(e){w(C.spec.encoding,{},e)},add:function(t){var n=a.enumSpec.isEnumSpec(C.cleanQuery.spec.mark);if(m.logInteraction(m.actions.ADD_FIELD,t,{from:C.chart.shorthand}),C.isSpecific&&!a.enumSpec.isEnumSpec(t.field)){var o=C.cleanQuery.spec,r=e.extend({},t,{channel:a.enumSpec.SHORT_ENUM_SPEC},"count"===t.aggregate?{}:{aggregate:a.enumSpec.SHORT_ENUM_SPEC,bin:a.enumSpec.SHORT_ENUM_SPEC,timeUnit:a.enumSpec.SHORT_ENUM_SPEC});o.encodings.push(r);var i={spec:o,groupBy:["field","aggregate","bin","timeUnit","stack"],orderBy:"aggregationQuality",chooseBy:"effectiveness",config:{omitTableWithOcclusion:!1}},s=a.query(i,c.schema),d=s.result,p=d.getTopSpecQueryModel().toSpec();n&&(p.mark=f),C.parseSpec(p)}else{var u=e.clone(C.spec.encoding),g=l.getEmptyAnyChannelId();w(u,e.clone(t),g);var v=l.getNextAnyChannelId();null!==v&&w(u,{},v),C.spec.encoding=u}},select:function(e){var t=y(e);t.mark="?";var n={spec:t,chooseBy:"effectiveness"},o=a.query(n,c.schema),r=o.result;r.getTopSpecQueryModel().getMark()===e.mark&&(e=u.duplicate(e),e.mark=f),C.parseSpec(e)},parse:function(e){C.parseSpec(e)},update:function(e){C.update(e)},reset:function(){C.reset()},dragDrop:function(t,n){var a=e.clone(C.spec.encoding);n&&w(a,l.get(n)||{},n),w(a,l.get(t)||{},t),C.spec.encoding=a},rescale:function(e,t){var n=C.spec.encoding[e];n.scale?n.scale.type=t:n.scale={type:t}},sort:function(e,t){C.spec.encoding[e].sort=t},transpose:function(){d.transpose(C.spec)},toggleFilterInvalid:function(){C.spec.transform.filterInvalid=!C.spec.transform.filterInvalid||void 0}},C.reset(),c.onUpdate.push(C.reset),C}]),angular.module("polestar").controller("MainCtrl",["$scope","$document","Spec","Dataset","Config","consts","Chronicle","Logger","Bookmarks","Modals","FilterManager",function(e,t,n,a,o,r,i,c,s,l,d){e.Spec=n,e.Dataset=a,e.Config=o,e.Logger=c,e.Bookmarks=s,e.FilterManager=d,e.consts=r,e.showDevPanel=!1,e.embedded=!!r.embeddedData,e.canUndo=!1,e.canRedo=!1,e.showModal=function(e){l.open(e),"bookmark-list"==e&&c.logInteraction(c.actions.BOOKMARK_OPEN)},s.isSupported&&s.load(),e.embedded&&(a.dataset={values:r.embeddedData,name:"embedded"}),a.update(a.dataset).then(function(){o.updateDataset(a.dataset),r.initialSpec&&n.parseSpec(r.initialSpec),e.chron=i.record("Spec.spec",e,!0,["Dataset.dataset","Config.config"]),e.canUndoRedo=function(){e.canUndo=e.chron.canUndo(),e.canRedo=e.chron.canRedo()},e.chron.addOnAdjustFunction(e.canUndoRedo),e.chron.addOnUndoFunction(e.canUndoRedo),e.chron.addOnRedoFunction(e.canUndoRedo),e.chron.addOnUndoFunction(function(){c.logInteraction(c.actions.UNDO)}),e.chron.addOnRedoFunction(function(){c.logInteraction(c.actions.REDO)}),angular.element(t).on("keydown",function(t){return t.keyCode!=="Z".charCodeAt(0)||!t.ctrlKey&&!t.metaKey||t.shiftKey?t.keyCode==="Y".charCodeAt(0)&&(t.ctrlKey||t.metaKey)?(e.chron.redo(),e.$digest(),!1):t.keyCode==="Z".charCodeAt(0)&&(t.ctrlKey||t.metaKey)&&t.shiftKey?(e.chron.redo(),e.$digest(),!1):void 0:(e.chron.undo(),e.$digest(),!1)})})}]),angular.module("polestar").run(["$templateCache",function(e){e.put("app/main/main.html",'<div ng-controller="MainCtrl" class="flex-root vflex full-width full-height"><div class="full-width no-shrink"><div class="card top-card no-right-margin no-top-margin"><div class="hflex"><div id="logo"></div><div class="pane"><div class="controls"><a ng-show="Bookmarks.isSupported" class="command" ng-click="showModal(\'bookmark-list\')"><i class="fa fa-bookmark"></i> Bookmarks ({{Bookmarks.list.length}})</a> <a class="command" ng-click="chron.undo()" ng-class="{disabled: !canUndo}"><i class="fa fa-undo"></i> Undo</a> <a class="command" ng-click="chron.redo()" ng-class="{disabled: !canRedo}"><i class="fa fa-repeat"></i> Redo</a></div></div><div class="absolute-top-right"><a href="https://idl.cs.washington.edu/" target="_blank" class="idl-logo"></a></div></div></div><alert-messages></alert-messages></div><div class="hflex full-width main-panel grow-1"><div class="pane data-pane noselect"><div class="card no-top-margin data-card abs-100"><div class="sidebar-header" ng-if="!embedded"><h2>Data</h2><dataset-selector class="right"></dataset-selector><div class="current-dataset" title="{{Dataset.currentDataset.name}}"><i class="fa fa-database"></i> <span class="dataset-name">{{Dataset.currentDataset.name}}</span></div></div><schema-list field-defs="Dataset.schema.fieldSchemas" order-by="Dataset.fieldOrder" show-count="true" filter-manager="FilterManager" show-add="true"></schema-list><div id="footer"><ul class="menu"><span ng-show="consts.debug"><li><a class="debug" ng-click="showDevPanel = !showDevPanel">Debug</a></li><li><a ng-href="{{ {spec:Spec.chart.vlSpec} | reportUrl }}" target="_blank" class="debug">Report an issue</a></li></span></ul></div></div></div><div class="pane encoding-pane"><shelves spec="Spec.spec" support-auto-mark="true" filter-manager="FilterManager"></shelves></div><div class="pane vis-pane"><vl-plot-group class="card abs-100 no-top-margin no-right-margin full-vl-plot-group" chart="Spec.chart" show-bookmark="true" show-filter-null="true" show-log="true" show-mark-type="true" show-sort="true" show-transpose="true" toggle-shelf="true" config-set="large" show-label="true" tooltip="true" always-scrollable="true"></vl-plot-group></div></div><div class="hflex full-width dev-panel" ng-if="showDevPanel"><div class="pane" ng-show="consts.logToWebSql"><div class="card"><div>userid: {{Logger.userid}}</div><button ng-click="Logger.clear()">Clear logs</button><br><button ng-click="Logger.export()">Download logs</button></div></div><div class="pane config-pane"><div class="card scroll-y abs-100"><configuration-editor></configuration-editor></div></div><div class="pane vl-pane"><vl-spec-editor></vl-spec-editor></div><div class="pane vg-pane"><vg-spec-editor></vg-spec-editor></div></div><bookmark-list highlighted="Fields.highlighted"></bookmark-list><dataset-modal></dataset-modal></div>'),e.put("components/configurationeditor/configurationeditor.html","<form><pre>{{ Config.config | compactJSON }}</pre></form>"),e.put("components/vgSpecEditor/vgSpecEditor.html",'<div class="card scroll-y abs-100 vflex no-right-margin"><div><div class="right"><a class="command" ui-zeroclip="" zeroclip-model="Spec.chart.vgSpec | compactJSON">Copy</a><lyra-export></lyra-export></div><h3>Vega Specification</h3></div><textarea class="vgspec flex-grow-1" json-input="" disabled="disabled" type="text" ng-model="Spec.chart.vgSpec"></textarea></div>'),e.put("components/vlSpecEditor/vlSpecEditor.html",'<div class="card scroll-y abs-100 vflex"><div class="subpane no-shrink"><div class="right command"><a ui-zeroclip="" zeroclip-model="Spec.chart.shorthand">Copy</a></div><h3>Vega-Lite Shorthand</h3><input disabled="" class="shorthand full-width" type="text" ng-model="Spec.chart.shorthand"></div><div class="subpane flex-grow-1 vflex"><div><a ng-click="parseVegalite(Spec.chart.vlSpec)" class="right command">Load</a><div class="right command"><a ui-zeroclip="" zeroclip-model="Spec.chart.cleanSpec | compactJSON">Copy</a></div><h3>Vega-Lite Encoding</h3></div><textarea class="vlspec flex-grow-1 full-height" json-input="" type="text" ng-model="Spec.chart.cleanSpec"></textarea></div></div>')}]);