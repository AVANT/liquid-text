var rawText = d3.select('.text')
var content = d3.select('.contents')
rawText.selectAll('p').each(function(p){
	var p = d3.select(this)
	var chars = p.text().split('')	
	content
		.append('p')
		.dataAppend(chars,'span.char')
		.text(ƒ())
})

var characters = d3.selectAll('.char')
	characters.attr('id',function(d,i){return 'c'+i})

var r = d3.scale.linear().domain([0,10]).range([-window.innerWidth/8,window.innerWidth/8])
var s = d3.scale.linear().domain([0,10]).range([0,2])
var rnd = function(){
	return (d3.shuffle(d3.range(2))[0]?1:-1)*r(d3.shuffle(d3.range(11))[0])
}

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

var width = content.node().getBoundingClientRect().width
var height = content.node().getBoundingClientRect().height

createHiDPICanvas = function(sel) {
    var w = (!width)?window.innerWidth:width
    var h = (!height)?window.innerHeight:height
    if (!PIXEL_RATIO) var r = 1

    var c = this.append('canvas')
    c.node().width = w * PIXEL_RATIO
    c.node().height = h * PIXEL_RATIO
    c.style('width',w+'px')
     .style('height',h+'px')

    c.node().getContext("2d").setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0)
    return c
}

d3.select('body').call(createHiDPICanvas)
var canvas = d3.select('canvas')

var ctx = canvas.node().getContext('2d')
ctx.font=rawText.style('font-size') + rawText.style('font-family')
ctx.textBaseline = 'top'

var chars = {}

characters.each(function(c,i){
	var r = this.getBoundingClientRect()
	ctx.fillText(c,r.left,r.top)
	chars[i] = {
		id:i,
		c:c,
		iLeft: r.left,
		iTop: r.top,
		left: r.left,
		top: r.top,
		transition:function(){}
	}
})

var detachedContainer = document.createElement("custom")
var dataContainer = d3.select(detachedContainer)

d3.timer(function(){
	ctx.clearRect(0, 0, canvas.node().width, canvas.node().height)
	ctx.font=rawText.style('font-size') + rawText.style('font-family')
	d3.keys(chars).forEach(function(i){
		ctx.fillText(chars[i].c,chars[i].left,chars[i].top)
	})
})

var duration = 400*4
var charInView = d3.entries(chars)
  .filter(function(c){
    return scrollY<c.value.iTop && c.value.iTop< scrollY+window.innerHeight
  })


var isAnimating = false
d3.select(window).on('click.text',function(){
  if(!isAnimating){

    dataContainer.html('')
    var dc = dataContainer.dataAppend(charInView,'char')
    dc
    .transition()
    .duration(duration/2)
    .ease("cubic-out")
    .delay(function(d,i) {return i*duration/4000})
    .tween('custom',function(d,i){
      isAnimating = true
      var x = d3.interpolateString(chars[d.value.id].left, chars[d.value.id].left+rnd());
      var y = d3.interpolateString(chars[d.value.id].top, chars[d.value.id].top+rnd());
      return function(t) {
        chars[d.value.id].left = x(t)
        chars[d.value.id].top = y(t)
      }    
    })
    .each("end",function(d,i) {
      if(i==charInView.length-1){
        console.log('end')
        dc
        .transition()
        .duration(duration/4)
        .ease("cubic-out")
        .delay(function(d,i) {return i*duration/4000})
        .tween('custom',function(d,i){
          var x = d3.interpolateString(chars[d.value.id].left, chars[d.value.id].iLeft);
          var y = d3.interpolateString(chars[d.value.id].top, chars[d.value.id].iTop);
          return function(t) {
            chars[d.value.id].left = x(t)
            chars[d.value.id].top = y(t)
            if(t==1) isAnimating = false
          }    
        })
      }
    })

  }
})

d3.select('body').on('mousemove',function(){
  var m = d3.mouse(this)
  var rad = 100
  charInView = d3.entries(chars)
    .filter(function(c){
      return m[1]-rad<c.value.iTop && c.value.iTop<m[1]+rad && m[0]-rad<c.value.iLeft && c.value.iLeft<m[0]+rad 
    })

  dataContainer.html('')
  var dc = dataContainer.dataAppend(charInView,'char')
  dc
  .transition()
  .duration(duration/2)
  .ease("cubic-out")
  .delay(function(d,i) {return i*duration/4000})
  .tween('custom',function(d,i){
    isAnimating = true
    var x = d3.interpolateString(chars[d.value.id].left, chars[d.value.id].left+rnd());
    var y = d3.interpolateString(chars[d.value.id].top, chars[d.value.id].top+rnd());
    return function(t) {
      chars[d.value.id].left = x(t)
      chars[d.value.id].top = y(t)
    }    
  })
  .each("end",function(d,i) {
    if(i==charInView.length-1){
      console.log('end')
      dc
      .transition()
      .duration(duration/4)
      .ease("cubic-out")
      .delay(function(d,i) {return i*duration/4000})
      .tween('custom',function(d,i){
        var x = d3.interpolateString(chars[d.value.id].left, chars[d.value.id].iLeft);
        var y = d3.interpolateString(chars[d.value.id].top, chars[d.value.id].iTop);
        return function(t) {
          chars[d.value.id].left = x(t)
          chars[d.value.id].top = y(t)
          if(t==1) isAnimating = false
        }    
      })
    }
  })
})


var sTimeOut
d3.select(window).on('scroll.text',function(){
  if(!sTimeOut){
    // console.log('scroll start')
  }

  // console.log('scroll')
  if(!isAnimating){
    charInView = d3.entries(chars)
      .filter(function(c){
        return scrollY<c.value.iTop && c.value.iTop< scrollY+window.innerHeight
      })
  }

  clearTimeout(sTimeOut)
  sTimeOut = setTimeout(function(){
    // console.log('stopped')
    clearTimeout(sTimeOut)
    sTimeOut = undefined

  },duration*.75)

})

