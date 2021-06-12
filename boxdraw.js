function createBox(box) {
    return svg.append('rect').attr('x',box[0]).attr('y',box[1]).attr('width',box[2]).attr('height',box[3]).attr('rx',20).attr('ry',20)
}
//splits text into rows, minimizing the total width
function splitRows(parts, rows, index) {
    var res = []
    var T = parts.length
    for(var i = 0; i < rows; i++) {
        var b = Math.floor(1*parts.length/(rows-i))
        var a = parts.slice(0,b)
        var t = parts.slice(b).split(" ")
        parts = t.slice(1).join(" ")
        res.push(a+t[0])
    }
    var m = Math.max(...(res.map(d=>d.length)))
    //res = res.map(d=>{var t = d.length-d.replaceAll(" ","").length; return d.replaceAll(" "," ".repeat(1+Math.floor((m-d.length)/t)))})
    return [m,res]
}
function createLineText(box, text) {
    var t = textg.append('text').attr("font-family","Arial").attr('x',box[0]+box[2]/2).attr("text-anchor","middle").attr('y',box[1]+box[3]/2).attr("font-size",box[3]).attr("dominant-baseline","middle").attr("fill","black").text(text)
    return t
}
function createText(box, text, padding, color) {
    text = (LANGUAGES[text]||({curlang: "ERROR"}))[curlang]
    box = [box[0]+padding, box[1],box[2]-2*padding,box[3]]
    var multiplier=2.1
    var parts = text.split(" ");
    var best = [text.length, [text]];
    var vbest = Math.min(box[3],multiplier*box[2]/best[0])
    for(var r = 2; r<parts.length; r++)
    {
        var ta = splitRows(text, r, 0)
        var V = multiplier*box[2]/ta[0]
        if(V*r >= box[3])
            break
        vbest = V
        best = ta
    }
    var RH = box[3]/best[1].length
    var dif = RH - vbest
    res = []
    for(var i = 0; i < best[1].length; i++)
    {
        t = createLineText([box[0],box[1]+RH*i+dif/2, box[2], vbest], best[1][i])
        if(color != undefined)
            t.attr('fill',color)
        res.push(t)
    }
    return [res,vbest]
} 
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}
function describeArc(x, y, radius, startAngle, endAngle){
        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", x, y, 
            "L", start.x, start.y, 
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");

        return d;       
}
function createSemicircle (bounds, pct){
    cr = Math.min(bounds[2], bounds[3])/2;
    cx = bounds[0]+cr
    cy = bounds[1]+cr
    if(pct > 999) return svg.append('circle').attr('cy',cy).attr('cx',cx).attr('r',cr)
    path = svg.append('path').attr('d',describeArc(cx,cy,cr,(1000-pct)*360/1000,360))
    return path
}
