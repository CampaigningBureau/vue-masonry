 import Vue from 'vue'
 import Masonry from 'masonry-layout'
 import imagesLoaded from 'imagesloaded'

 const attributesMap = {
   'column-width': 'columnWidth',
   'transition-duration': 'transitionDuration',
   'item-selector': 'itemSelector',
   'origin-left': 'originLeft',
   'origin-top': 'originTop'
 }
 const EVENT_ADD = 'vuemasonry.itemAdded'
 const EVENT_REMOVE = 'vuemasonry.itemRemoved'

 const stringToBool = (val) => (val + '').toLowerCase() === 'true'

 const collectOptions = (attrs) => {
   let res = {}
   let attrsrray = Array.prototype.slice.call(attrs)
   attrsrray.forEach(function (attr) {
     if (Object.keys(attributesMap).indexOf(attr.name) > -1) {
       res[ attributesMap[ attr.name ] ] = (attr.name.indexOf('origin') > -1) ? stringToBool(attr.value) : attr.value
     }
   })
   return res
 }

 var Events = new Vue({})

 export const masonry = Vue.directive('masonry', {
   props: [ 'transitionDuration', ' itemSelector' ],

   inserted: function (el, nodeObj) {
     if (!Masonry) {
       throw new Error('Masonry plugin is not defined. Please check it\'s connected and parsed correctly.')
     }
     var masonry = new Masonry(el, collectOptions(el.attributes))
     var masonryDraw = () => {
       masonry.reloadItems()
       masonry.layout()
     }
     Vue.nextTick(function () {
       masonryDraw()
     })

     Events.$on(EVENT_ADD, function (eventData) {
       masonryDraw()
     })
     Events.$on(EVENT_REMOVE, function (eventData) {
       masonryDraw()
     })
   }
 })

 export const masonryTile = Vue.directive('masonryTile', {

   inserted: function (el) {
     imagesLoaded(el, () => {
       Events.$emit(EVENT_ADD, { 'element': el })
     })
   },
   beforeDestroy: function (el) {
     imagesLoaded(el, () => {
       Events.$emit(EVENT_REMOVE, { 'element': el })
     })
   }
 })
