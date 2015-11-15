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

var canvas = d3.select('#canvas').attr({
	width: content.node().getBoundingClientRect().width,
	height: content.node().getBoundingClientRect().height
})

var ctx = canvas.node().getContext('2d')
ctx.font="40px Crimson"
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
	ctx.font="20px Crimson"
	ctx.fillText((new Date()).getTime(),0,0)
	ctx.font="40px Crimson"
	d3.keys(chars).forEach(function(i){
		ctx.fillText(chars[i].c,chars[i].left,chars[i].top)
	})
})

var duration = 400
var sTimeOut
d3.select(window).on('scroll.text',function(){
	if(!sTimeOut){
		console.log('scroll start')
	}

	console.log('scroll')
	var cs = d3.entries(chars)
		.filter(function(c){
			return scrollY<c.value.iTop && c.value.iTop< scrollY+window.innerHeight
		})

	console.log(cs.length)	
	var dc = dataContainer.dataAppend(cs,'char')
	
	dc
	.transition()
	.duration(duration/2)
	.ease("cubic-out")
	.delay(function(d,i) {return i*duration/2*.0025})
	.tween('custom',function(d,i){
		console.log(d.value.id)
		chars[d.value.id].left = chars[d.value.id].left+1
		chars[d.value.id].top = chars[d.value.id].top+rnd()
	})

	clearTimeout(sTimeOut)
	sTimeOut = setTimeout(function(){
		console.log('stopped')
		clearTimeout(sTimeOut)
		sTimeOut = undefined

	},duration*.75)

})
