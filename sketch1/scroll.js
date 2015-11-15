var ps = d3.selectAll('.hidden p')
var content = d3.select('.content')
ps.each(function(p){
	var p = d3.select(this)
	var chars = p.text().split('')
	content.append('p').dataAppend(chars,'span.char').text(ƒ())
})

var chars = d3.selectAll('.char')

chars.attr('id',function(d,i){return 'c'+i})

var r = d3.scale.linear().domain([0,10]).range([-window.innerWidth/8,window.innerWidth/8])
var s = d3.scale.linear().domain([0,10]).range([0,2])
var rnd = function(){
	return (d3.shuffle(d3.range(2))[0]?1:-1)*r(d3.shuffle(d3.range(11))[0])
}

var duration = 400
var sTimeOut
d3.select(window).on('scroll.text',function(){
	// console.log('scrolling')
	if(!sTimeOut){
	}
	var cs = chars
		.filter(function(){
			var rect = this.getBoundingClientRect()
			return scrollY<rect.top && rect.top< scrollY+window.innerHeight
		})

	cs
	.transition()
	.duration(duration/2)
	.ease("cubic-out")
	.delay(function(d,i) {return i*duration/2*.0025})
	.style('left',function(d,i){return rnd()+'px'})
	.style('top',function(d,i){return rnd()+'px'})

	clearTimeout(sTimeOut)
	sTimeOut = setTimeout(function(){
		// console.log('stopped')
		clearTimeout(sTimeOut)
		sTimeOut = undefined
		chars.transition()
			.duration(duration*1.5)
			.ease("cubic-out")
			.style('left','0px')
			.style('top','0px')
	},duration*.75)

})
