(function(){"use strict";var t={3160:function(t,e,n){var r=n(9963),i=n(6252),o=n(1457),s=n(941);function a(t,e,n,r,a,u){const l=(0,i.up)("SynthController");return(0,i.wg)(),(0,i.j4)(o.q,null,{default:(0,i.w5)((()=>[(0,i.Wm)(s.O,null,{default:(0,i.w5)((()=>[(0,i.Wm)(l)])),_:1})])),_:1})}var u=n(3577),l=n(1300),c=n(1669),h=n(9003),f=n(3379),d=n(2953);const m=(0,i._)("h1",null,"Fluid Synth",-1),p={key:0},g={key:1},b={key:2},y={key:3},k=["onChange","onUpdate:modelValue"];function v(t,e,n,o,s,a){return this.bankList?((0,i.wg)(),(0,i.j4)(c.K,{key:0,class:"fill-height"},{default:(0,i.w5)((()=>[(0,i.Wm)(h.o,{class:"topbar"},{default:(0,i.w5)((()=>[m,(0,i.Wm)(l.T,{class:"shutdownButton",right:"",icon:"mdi-power",color:"secondary",onClick:this.shutdownSynth},null,8,["onClick"])])),_:1}),(0,i.Wm)(h.o,{class:"statusBar"},{default:(0,i.w5)((()=>[(0,i.Wm)(f.D,{cols:"12"},{default:(0,i.w5)((()=>[(0,i.Uk)(" Current bank "),this.currentBankName?((0,i.wg)(),(0,i.iD)("h2",p,(0,u.zw)(this.currentBankName.split(".")[0])+" ("+(0,u.zw)(this.currentBankNumber+1)+"/"+(0,u.zw)(this.bankList.length)+") ",1)):((0,i.wg)(),(0,i.iD)("div",g,"Loading..")),(0,i.Uk)(" Current patch "),this.currentPatchName?((0,i.wg)(),(0,i.iD)("div",b,[(0,i._)("h2",null,(0,u.zw)(this.currentPatchName)+" ("+(0,u.zw)(this.currentPatchNumber+1)+"/"+(0,u.zw)(this.patchList.length)+") ",1)])):((0,i.wg)(),(0,i.iD)("div",y,"Loading.."))])),_:1})])),_:1}),(0,i.Wm)(h.o,{class:"settings"},{default:(0,i.w5)((()=>[(0,i.Wm)(f.D,{cols:"12"},{default:(0,i.w5)((()=>[(0,i.Uk)(" Synth Settings "),((0,i.wg)(!0),(0,i.iD)(i.HY,null,(0,i.Ko)(this.settingsArr,((t,e)=>((0,i.wg)(),(0,i.iD)("div",{key:e},[(0,i.Uk)((0,u.zw)(t[0].split(".")[0].toUpperCase())+" "+(0,u.zw)(t[0].split(".")[1].toUpperCase())+": ",1),(0,i._)("b",null,(0,u.zw)(t[1]),1),(0,i.wy)((0,i._)("input",{class:"slider",type:"range",onChange:e=>a.setSettingValue(t[0]),min:"0",max:"1",step:"0.05","onUpdate:modelValue":e=>t[1]=e},null,40,k),[[r.nr,t[1]]])])))),128))])),_:1})])),_:1}),(0,i.Wm)(h.o,{class:"selector"},{default:(0,i.w5)((()=>[(0,i.Wm)(d.r,{modelValue:s.select,"onUpdate:modelValue":e[0]||(e[0]=t=>s.select=t),label:"Select Patch",items:this.patchList,variant:"underlined"},null,8,["modelValue","items"])])),_:1}),(0,i.Wm)(h.o,{class:"selector"},{default:(0,i.w5)((()=>[(0,i.Wm)(d.r,{modelValue:s.selectB,"onUpdate:modelValue":e[1]||(e[1]=t=>s.selectB=t),label:"Select Bank",items:this.bankList,variant:"underlined"},null,8,["modelValue","items"])])),_:1})])),_:1})):((0,i.wg)(),(0,i.j4)(c.K,{key:1},{default:(0,i.w5)((()=>[(0,i.Uk)(" Big Loader... ")])),_:1}))}const w="http://192.168.1.143:5000/api";function N(){const t=w+"/";return fetch(t)}function P(t){const e=w+"/select_patch/"+t;return fetch(e)}function _(t){const e=w+"/select_bank/"+t;return fetch(e)}function j(){const t=w+"/shutdown/";return fetch(t)}function B(t){const e=w+"/fluid_setting/synth."+t;return fetch(e)}function S(t,e){const n=w+"/fluid_setting/synth."+t,r={method:"POST",mode:"no-cors",headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*"},body:e.toString()};return fetch(n,r)}var L={name:"SynthController",data(){return{select:null,selectB:null,reverbSlider:null,patchList:null,patchKeys:null,bankList:null,currentPatchName:null,currentPatchNumber:null,currentBankName:null,currentBankNumber:null,reverb:null,settingsArr:[["reverb.level",.5],["reverb.width",.2],["reverb.room-size",.5]]}},mounted(){N().then((t=>t.json())).then(this.setAllValuesFromData),this.getSettingValues()},watch:{select(t){console.log(t[0]),this.currentPatchName=null,this.currentPatchNumber=null,P(t[0]-1).then((t=>t.json())).then(this.setPatchFromData),this.getSettingValues()},selectB(t){let e=this.bankList.findIndex((e=>e===t));this.patchList=null,this.patchKeys=null,this.currentPatchName=null,this.currentPatchNumber=null,this.currentBankName=null,this.currentBankNumber=null,_(e).then((t=>t.json())).then(this.setBankFromData)}},methods:{getSettingValues(){this.settingsArr.forEach((t=>{this.getSettingValue(t[0])}))},getSettingValue(t){let e=this.settingsArr.findIndex((e=>e[0]===t));B(t).then((t=>t.json())).then((t=>this.settingsArr[e][1]=t)).then((()=>console.log(t+" updated from API to be: "+this.settingsArr[e][1])))},setSettingValue(t){console.log("changed slider for "+t);let e=this.settingsArr.find((e=>e[0]===t))[1];S(t,e).then((()=>this.getSettingValue(t)))},shutdownSynth(){console.log("shutting down"),j()},setAllValuesFromData(t){this.patchList=t[0],this.patchKeys=Array.from(Array(this.patchList.length).keys()),this.bankList=t[1],this.currentPatchNumber=t[2],this.currentPatchName=this.patchList[this.currentPatchNumber][1].slice(2),this.currentBankName=t[3],this.currentBankNumber=t[4]},setPatchFromData(t){console.log(t),this.currentPatchNumber=t[2],this.currentPatchName=this.patchList[this.currentPatchNumber][1].slice(2)},setBankFromData(t){this.patchList=t[0],this.patchKeys=Array.from(Array(this.patchList.length).keys()),this.currentPatchNumber=t[2],this.currentPatchName=this.patchList[this.currentPatchNumber][1].slice(2),this.currentBankName=t[3],this.currentBankNumber=t[4]},setBank(t){let e=t+this.currentBankNumber;console.log("changeto",e),e<0&&(e=this.bankList.length-1,console.log("triggered",e)),e>this.bankList.length-1&&(e=0),this.patchList=null,this.patchKeys=null,this.currentPatchName=null,this.currentPatchNumber=null,this.currentBankName=null,this.currentBankNumber=null,_(e).then((t=>t.json())).then(this.setBankFromData)}}},O=n(3744);const A=(0,O.Z)(L,[["render",v]]);var C=A,V={name:"App",components:{SynthController:C},data:()=>({})};const D=(0,O.Z)(V,[["render",a]]);var W=D,U=(n(9773),n(1291)),z=(0,U.Rd)();async function F(){const t=await n.e(461).then(n.t.bind(n,5933,23));t.load({google:{families:["Roboto:100,300,400,500,700,900&display=swap"]}})}F(),(0,r.ri)(W).use(z).mount("#app")}},e={};function n(r){var i=e[r];if(void 0!==i)return i.exports;var o=e[r]={exports:{}};return t[r](o,o.exports,n),o.exports}n.m=t,function(){var t=[];n.O=function(e,r,i,o){if(!r){var s=1/0;for(c=0;c<t.length;c++){r=t[c][0],i=t[c][1],o=t[c][2];for(var a=!0,u=0;u<r.length;u++)(!1&o||s>=o)&&Object.keys(n.O).every((function(t){return n.O[t](r[u])}))?r.splice(u--,1):(a=!1,o<s&&(s=o));if(a){t.splice(c--,1);var l=i();void 0!==l&&(e=l)}}return e}o=o||0;for(var c=t.length;c>0&&t[c-1][2]>o;c--)t[c]=t[c-1];t[c]=[r,i,o]}}(),function(){var t,e=Object.getPrototypeOf?function(t){return Object.getPrototypeOf(t)}:function(t){return t.__proto__};n.t=function(r,i){if(1&i&&(r=this(r)),8&i)return r;if("object"===typeof r&&r){if(4&i&&r.__esModule)return r;if(16&i&&"function"===typeof r.then)return r}var o=Object.create(null);n.r(o);var s={};t=t||[null,e({}),e([]),e(e)];for(var a=2&i&&r;"object"==typeof a&&!~t.indexOf(a);a=e(a))Object.getOwnPropertyNames(a).forEach((function(t){s[t]=function(){return r[t]}}));return s["default"]=function(){return r},n.d(o,s),o}}(),function(){n.d=function(t,e){for(var r in e)n.o(e,r)&&!n.o(t,r)&&Object.defineProperty(t,r,{enumerable:!0,get:e[r]})}}(),function(){n.f={},n.e=function(t){return Promise.all(Object.keys(n.f).reduce((function(e,r){return n.f[r](t,e),e}),[]))}}(),function(){n.u=function(t){return"js/webfontloader.8e4a1496.js"}}(),function(){n.miniCssF=function(t){}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={},e="synth-frontend:";n.l=function(r,i,o,s){if(t[r])t[r].push(i);else{var a,u;if(void 0!==o)for(var l=document.getElementsByTagName("script"),c=0;c<l.length;c++){var h=l[c];if(h.getAttribute("src")==r||h.getAttribute("data-webpack")==e+o){a=h;break}}a||(u=!0,a=document.createElement("script"),a.charset="utf-8",a.timeout=120,n.nc&&a.setAttribute("nonce",n.nc),a.setAttribute("data-webpack",e+o),a.src=r),t[r]=[i];var f=function(e,n){a.onerror=a.onload=null,clearTimeout(d);var i=t[r];if(delete t[r],a.parentNode&&a.parentNode.removeChild(a),i&&i.forEach((function(t){return t(n)})),e)return e(n)},d=setTimeout(f.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=f.bind(null,a.onerror),a.onload=f.bind(null,a.onload),u&&document.head.appendChild(a)}}}(),function(){n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var t={143:0};n.f.j=function(e,r){var i=n.o(t,e)?t[e]:void 0;if(0!==i)if(i)r.push(i[2]);else{var o=new Promise((function(n,r){i=t[e]=[n,r]}));r.push(i[2]=o);var s=n.p+n.u(e),a=new Error,u=function(r){if(n.o(t,e)&&(i=t[e],0!==i&&(t[e]=void 0),i)){var o=r&&("load"===r.type?"missing":r.type),s=r&&r.target&&r.target.src;a.message="Loading chunk "+e+" failed.\n("+o+": "+s+")",a.name="ChunkLoadError",a.type=o,a.request=s,i[1](a)}};n.l(s,u,"chunk-"+e,e)}},n.O.j=function(e){return 0===t[e]};var e=function(e,r){var i,o,s=r[0],a=r[1],u=r[2],l=0;if(s.some((function(e){return 0!==t[e]}))){for(i in a)n.o(a,i)&&(n.m[i]=a[i]);if(u)var c=u(n)}for(e&&e(r);l<s.length;l++)o=s[l],n.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return n.O(c)},r=self["webpackChunksynth_frontend"]=self["webpackChunksynth_frontend"]||[];r.forEach(e.bind(null,0)),r.push=e.bind(null,r.push.bind(r))}();var r=n.O(void 0,[998],(function(){return n(3160)}));r=n.O(r)})();
//# sourceMappingURL=app.bc8d9693.js.map