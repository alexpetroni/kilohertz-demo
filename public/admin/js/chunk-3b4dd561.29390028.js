(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3b4dd561"],{"0fd9b":function(t,e,n){"use strict";n("99af"),n("4160"),n("caad"),n("13d5"),n("4ec9"),n("b64b"),n("d3b7"),n("ac1f"),n("2532"),n("3ca3"),n("5319"),n("159b"),n("ddb0");var i=n("ade3"),a=n("5530"),s=(n("4b85"),n("2b0e")),o=n("d9f7"),r=n("80d2"),c=["sm","md","lg","xl"],l=["start","end","center"];function u(t,e){return c.reduce((function(n,i){return n[t+Object(r["F"])(i)]=e(),n}),{})}var d=function(t){return[].concat(l,["baseline","stretch"]).includes(t)},h=u("align",(function(){return{type:String,default:null,validator:d}})),p=function(t){return[].concat(l,["space-between","space-around"]).includes(t)},f=u("justify",(function(){return{type:String,default:null,validator:p}})),v=function(t){return[].concat(l,["space-between","space-around","stretch"]).includes(t)},m=u("alignContent",(function(){return{type:String,default:null,validator:v}})),b={align:Object.keys(h),justify:Object.keys(f),alignContent:Object.keys(m)},g={align:"align",justify:"justify",alignContent:"align-content"};function C(t,e,n){var i=g[t];if(null!=n){if(e){var a=e.replace(t,"");i+="-".concat(a)}return i+="-".concat(n),i.toLowerCase()}}var y=new Map;e["a"]=s["a"].extend({name:"v-row",functional:!0,props:Object(a["a"])(Object(a["a"])(Object(a["a"])({tag:{type:String,default:"div"},dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:d}},h),{},{justify:{type:String,default:null,validator:p}},f),{},{alignContent:{type:String,default:null,validator:v}},m),render:function(t,e){var n=e.props,a=e.data,s=e.children,r="";for(var c in n)r+=String(n[c]);var l=y.get(r);return l||function(){var t,e;for(e in l=[],b)b[e].forEach((function(t){var i=n[t],a=C(e,t,i);a&&l.push(a)}));l.push((t={"no-gutters":n.noGutters,"row--dense":n.dense},Object(i["a"])(t,"align-".concat(n.align),n.align),Object(i["a"])(t,"justify-".concat(n.justify),n.justify),Object(i["a"])(t,"align-content-".concat(n.alignContent),n.alignContent),t)),y.set(r,l)}(),t(n.tag,Object(o["a"])(a,{staticClass:"row",class:l}),s)}})},"1f5b":function(t,e,n){},5311:function(t,e,n){"use strict";var i=n("5607"),a=n("2b0e");e["a"]=a["a"].extend({name:"rippleable",directives:{ripple:i["a"]},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),t.on=Object.assign({click:this.onChange},this.$listeners),this.$createElement("div",t)):null},onChange:function(){}}})},"6ca7":function(t,e,n){},8547:function(t,e,n){"use strict";var i=n("2b0e"),a=n("80d2");e["a"]=i["a"].extend({name:"comparable",props:{valueComparator:{type:Function,default:a["k"]}}})},aaf8:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{staticClass:"fill-height justify-center",attrs:{id:"register",tag:"section"}},[n("v-row",{attrs:{justify:"center"}},[n("v-col",{attrs:{cols:"12",md:"9"}},[n("v-slide-y-transition",{attrs:{appear:""}},[n("v-card",{staticClass:"pa-3 pa-md-5 mx-auto",attrs:{light:""}},[n("pages-heading",{staticClass:"text-center display-3"},[t._v(" Register ")]),n("v-row",[n("v-col",{attrs:{cols:"12",md:"6"}},[n("v-row",{attrs:{"no-gutters":""}},t._l(t.sections,(function(e,i){return n("v-col",{key:i,attrs:{cols:"12"}},[n("v-list-item",{attrs:{"three-line":""}},[n("v-list-item-icon",{staticClass:"mr-4 mt-5 mt-md-4"},[n("v-icon",{attrs:{large:t.$vuetify.breakpoint.mdAndUp,color:e.iconColor},domProps:{textContent:t._s(e.icon)}})],1),n("v-list-item-content",[n("v-list-item-title",{staticClass:"font-weight-light mb-4 mt-3",domProps:{textContent:t._s(e.title)}}),n("v-list-item-subtitle",{domProps:{textContent:t._s(e.text)}})],1)],1)],1)})),1)],1),n("v-col",{attrs:{cols:"12",md:"6"}},[n("div",{staticClass:"text-center"},[t._l(t.socials,(function(e,i){return n("v-btn",{key:i,staticClass:"my-2 mr-1",attrs:{color:e.iconColor,dark:"",depressed:"",fab:"",small:""}},[n("v-icon",{domProps:{textContent:t._s(e.icon)}})],1)})),n("div",{staticClass:"my-2"}),n("div",{staticClass:"text-center grey--text body-1 font-weight-light"},[t._v(" Or Be Classical ")]),n("v-text-field",{attrs:{color:"secondary",label:"First Name...","prepend-icon":"mdi-face"}}),n("v-text-field",{attrs:{color:"secondary",label:"Email...","prepend-icon":"mdi-email"}}),n("v-text-field",{staticClass:"mb-8",attrs:{color:"secondary",label:"Password...","prepend-icon":"mdi-lock-outline"}}),n("v-checkbox",{attrs:{"input-value":!0,color:"secondary"},scopedSlots:t._u([{key:"label",fn:function(){return[n("span",{staticClass:"text-no-wrap"},[t._v("I agree to the ")]),n("a",{staticClass:"secondary--text ml-6 ml-sm-0",attrs:{href:"#"}},[t._v(" terms and conditions ")]),t._v(". ")]},proxy:!0}])}),n("pages-btn",{attrs:{color:"success"}},[t._v(" Get Started ")])],2)])],1)],1)],1)],1)],1)],1)},a=[],s=(n("d3b7"),{name:"PagesRegister",components:{PagesBtn:function(){return n.e("chunk-2d0c4bbd").then(n.bind(null,"3ba9"))},PagesHeading:function(){return n.e("chunk-2d0b2927").then(n.bind(null,"254b"))}},data:function(){return{sections:[{icon:"mdi-chart-timeline-variant",iconColor:"primary",title:"Marketing",text:"We've created the marketing campaign of the website. It was a very interesting collaboration."},{icon:"mdi-code-tags",iconColor:"secondary",title:"Fully Coded in HTML5",text:"We've developed the website with HTML5 and CSS3. The client has access to the code using GitHub."},{icon:"mdi-account-multiple",iconColor:"cyan",title:"Built Audience",text:"There is also a Fully Customizable CMS Admin Dashboard for this product."}],socials:[{href:"#",icon:"mdi-twitter",iconColor:"#1DA1F2"},{href:"#",icon:"mdi-dribbble",iconColor:"#ea4c89"},{href:"#",icon:"mdi-facebook",iconColor:"#3B5998"}]}}}),o=s,r=(n("fb8f"),n("2877")),c=n("6544"),l=n.n(c),u=n("8336"),d=n("b0af"),h=n("ac7c"),p=n("62ad"),f=n("a523"),v=n("132d"),m=n("da13"),b=n("5d23"),g=n("34c3"),C=n("0fd9b"),y=n("0789"),x=n("8654"),k=Object(r["a"])(o,i,a,!1,null,null,null);e["default"]=k.exports;l()(k,{VBtn:u["a"],VCard:d["a"],VCheckbox:h["a"],VCol:p["a"],VContainer:f["a"],VIcon:v["a"],VListItem:m["a"],VListItemContent:b["a"],VListItemIcon:g["a"],VListItemSubtitle:b["b"],VListItemTitle:b["c"],VRow:C["a"],VSlideYTransition:y["g"],VTextField:x["a"]})},ac7c:function(t,e,n){"use strict";n("d3b7"),n("25f0");var i=n("5530"),a=(n("6ca7"),n("ec29"),n("9d26")),s=n("c37a"),o=n("fe09");e["a"]=o["a"].extend({name:"v-checkbox",props:{indeterminate:Boolean,indeterminateIcon:{type:String,default:"$checkboxIndeterminate"},offIcon:{type:String,default:"$checkboxOff"},onIcon:{type:String,default:"$checkboxOn"}},data:function(){return{inputIndeterminate:this.indeterminate}},computed:{classes:function(){return Object(i["a"])(Object(i["a"])({},s["a"].options.computed.classes.call(this)),{},{"v-input--selection-controls":!0,"v-input--checkbox":!0,"v-input--indeterminate":this.inputIndeterminate})},computedIcon:function(){return this.inputIndeterminate?this.indeterminateIcon:this.isActive?this.onIcon:this.offIcon},validationState:function(){if(!this.disabled||this.inputIndeterminate)return this.hasError&&this.shouldValidate?"error":this.hasSuccess?"success":null!==this.hasColor?this.computedColor:void 0}},watch:{indeterminate:function(t){var e=this;this.$nextTick((function(){return e.inputIndeterminate=t}))},inputIndeterminate:function(t){this.$emit("update:indeterminate",t)},isActive:function(){this.indeterminate&&(this.inputIndeterminate=!1)}},methods:{genCheckbox:function(){return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.$createElement(a["a"],this.setTextColor(this.validationState,{props:{dense:this.dense,dark:this.dark,light:this.light}}),this.computedIcon),this.genInput("checkbox",Object(i["a"])(Object(i["a"])({},this.attrs$),{},{"aria-checked":this.inputIndeterminate?"mixed":this.isActive.toString()})),this.genRipple(this.setTextColor(this.rippleState))])},genDefaultSlot:function(){return[this.genCheckbox(),this.genLabel()]}}})},ec29:function(t,e,n){},fb8f:function(t,e,n){"use strict";var i=n("1f5b"),a=n.n(i);a.a},fe09:function(t,e,n){"use strict";n("4de4"),n("45fc"),n("d3b7"),n("25f0");var i=n("c37a"),a=n("5311"),s=n("8547"),o=n("58df");e["a"]=Object(o["a"])(i["a"],a["a"],s["a"]).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data:function(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor:function(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple:function(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive:function(){var t=this,e=this.value,n=this.internalValue;return this.isMultiple?!!Array.isArray(n)&&n.some((function(n){return t.valueComparator(n,e)})):void 0===this.trueValue||void 0===this.falseValue?e?this.valueComparator(e,n):Boolean(n):this.valueComparator(n,this.trueValue)},isDirty:function(){return this.isActive},rippleState:function(){return this.disabled||this.validationState?this.validationState:void 0}},watch:{inputValue:function(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel:function(){var t=this,e=i["a"].options.methods.genLabel.call(this);return e?(e.data.on={click:function(e){e.preventDefault(),t.onChange()}},e):e},genInput:function(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown},ref:"input"})},onBlur:function(){this.isFocused=!1},onChange:function(){var t=this;if(!this.isDisabled){var e=this.value,n=this.internalValue;if(this.isMultiple){Array.isArray(n)||(n=[]);var i=n.length;n=n.filter((function(n){return!t.valueComparator(n,e)})),n.length===i&&n.push(e)}else n=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(n,this.trueValue)?this.falseValue:this.trueValue:e?this.valueComparator(n,e)?null:e:!n;this.validate(!0,n),this.internalValue=n,this.hasColor=n}},onFocus:function(){this.isFocused=!0},onKeydown:function(t){}}})}}]);
//# sourceMappingURL=chunk-3b4dd561.29390028.js.map