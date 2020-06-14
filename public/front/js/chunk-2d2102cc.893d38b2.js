(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d2102cc"],{b789:function(t,e,r){"use strict";r.r(e);var c=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",[r("v-row",{attrs:{justify:"center"}},[r("v-col",{attrs:{sm:"12",md:"8"}},[r("base-material-card",{staticClass:"px-5 py-3",attrs:{color:"success",icon:"mdi-cart-outline",title:t.cartTitle}},[r("v-container",{attrs:{fluid:""}},[t.cartIsEmpty?[r("div",{staticClass:"headline text-center pa-12"},[t._v(" Leg los und fülle deinen Warenkorb. ")])]:t._l(t.cartItems,(function(e){return r("CartItemCard",{key:e.sku,attrs:{product:e.product,qty:e.qty},on:{"remove-item":t.removeFromCart}})}))],2),r("v-card-actions",[r("v-spacer"),r("v-btn",{attrs:{color:"primary"},on:{click:t.backToShop}},[t._v("Entdecke mehr")]),r("v-spacer"),r("v-btn",{attrs:{color:"primary",disabled:t.cartIsEmpty}},[t._v("Zur Kasse")]),r("v-spacer")],1)],1)],1)],1)],1)},a=[],i=(r("13d5"),r("5530")),n=r("2f62"),s=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-container",[r("v-row",[r("v-col",{attrs:{sm:"3",md:"2"}},[r("ImgKit",{staticStyle:{"max-width":"100%"},attrs:{path:t.product.image,transform:[{w:150,h:150}]}})],1),r("v-col",{attrs:{sm:"6",md:"8"}},[r("div",{staticClass:"display-2"},[t._v(t._s(t.product.name))]),t.isProductVariation?t._l(t.productFeatures,(function(e,c){return r("div",{key:c},[t._v(" "+t._s(e.vfName)+" : "+t._s(e.fiName)+" ")])})):t._e(),r("div",{staticClass:"display-1"},[t._v(t._s(t.product.name))]),r("div",{staticClass:"del"},[r("v-btn",{attrs:{icon:"",small:""},on:{click:function(e){return t.$emit("remove-item",t.product.sku)}}},[r("v-icon",{attrs:{small:"",grey:""}},[t._v("mdi-trash-can-outline")]),t._v(" Entfernen")],1)],1)],2),r("v-col",{attrs:{sm:"3",md:"2"}},[r("div",{staticStyle:{width:"5em"}},[r("v-text-field",{attrs:{label:"Qty.",value:t.qty,type:"number"},on:{change:t.onQtyChange}})],1),r("div",{class:t.priceStyle},[t._v(t._s(t.formatedPrice))]),t.priceObj.discountAmount?[r("div",{staticClass:"regularPrice"},[t._v(t._s(t.formatedRegularPrice))]),r("div",{staticClass:"discount"},[t._v("-"+t._s(t.priceObj.discountPercent)+"%")])]:t._e()],2),r("v-col",{attrs:{cols:"12",dense:""}},[r("v-divider")],1)],1)],1)},o=[],u=(r("a9e3"),r("dd09")),d=r("34ce"),l={components:{ImgKit:u["a"]},directives:{},filters:{},extends:{},mixins:[],model:{},props:{product:{type:Object},qty:{type:Number}},data:function(){return{}},computed:Object(i["a"])(Object(i["a"])({},Object(n["c"])(["currencySymbol"])),{},{isProductVariation:function(){return Object(d["i"])(this.product)},productFeatures:function(){return Object(d["p"])(this.product.featuresConfig,this.product.variableFeatures)},priceObj:function(){return Object(d["o"])(this.product,this.qty)},priceStyle:function(){return this.priceObj.discountAmount?"salePrice":""},formatedPrice:function(){return Object(d["e"])(this.priceObj.price,this.currencySymbol)},formatedRegularPrice:function(){return Object(d["e"])(this.priceObj.regularPrice,this.currencySymbol)}}),watch:{},methods:Object(i["a"])(Object(i["a"])({},Object(n["b"])(["addToCart"])),{},{onQtyChange:function(t){(isNaN(t)||t<0)&&(t=1),t=parseInt(t),this.addToCart({product:this.product,qty:t})}})},m=l,p=r("2877"),v=r("6544"),b=r.n(v),f=r("8336"),h=r("62ad"),y=r("a523"),j=r("ce7e"),C=r("132d"),O=r("0fd9b"),_=r("8654"),I=Object(p["a"])(m,s,o,!1,null,"009a6fcc",null),g=I.exports;b()(I,{VBtn:f["a"],VCol:h["a"],VContainer:y["a"],VDivider:j["a"],VIcon:C["a"],VRow:O["a"],VTextField:_["a"]});var k={components:{CartItemCard:g},directives:{},filters:{},extends:{},mixins:[],model:{},props:{},data:function(){return{}},computed:Object(i["a"])(Object(i["a"])({},Object(n["c"])(["cartItems"])),{},{cartIsEmpty:function(){return!this.cartItems.length},itemsInCart:function(){return this.cartIsEmpty?0:this.cartItems.reduce((function(t,e){return t+e.qty}),0)},cartTitle:function(){var t="Warenkorb";return this.itemsInCart&&(t+=" (".concat(this.itemsInCart," Artikel)")),t}}),watch:{},methods:Object(i["a"])(Object(i["a"])({},Object(n["b"])(["removeFromCart"])),{},{backToShop:function(){this.$router.go(-1)}})},w=k,V=r("99d9"),x=r("2fa4"),P=Object(p["a"])(w,c,a,!1,null,"892f8e92",null);e["default"]=P.exports;b()(P,{VBtn:f["a"],VCardActions:V["a"],VCol:h["a"],VContainer:y["a"],VRow:O["a"],VSpacer:x["a"]})}}]);
//# sourceMappingURL=chunk-2d2102cc.893d38b2.js.map