maxQs = 13
COLORS={maroon:"#cd5d7d",red:"#fb8072",orange:"#fdb462",yellow:"#ffffb3",green:"#7bf1a8",mint:"#60d394",aqua:"#8dd3c7",blue:"#80b1d3",cyan:"#9bf6ff",purple:"#bdb2ff",royal:"#9381ff",pink:"#ffc6ff",black:"#000000",grey:"#888888",white:"#dddddd"}
ID2C = {"nota": "black", "idc": "grey", "com": "maroon", "soc": "red", "socdem": "pink", "cent": "white", "clas": "blue", "ordo": "aqua", "cap": "yellow", "opt": "green", "marksoc": "orange", "prog": "cyan", "trad": "purple", "free": "yellow", "just": "pink", "perf": "orange", "sec": "blue", "athe": "red", "athe*":"orange", "theo": "purple", "hybr": "cyan","dir":"mint","dir*":"cyan", "rep":"pink", "repub": "blue", "repub*":"purple","auth":"orange", "auth*":"royal","techno":"aqua", "anar":"red", "plut":"yellow", "strato":"green", "rep*":"maroon", "asim": "purple", "glob": "pink","glob*": "cyan", "pop": "mint", "sov": "blue", "iso": "orange", "nat": "maroon", "nat*": "royal","open": "aqua", "open*": "yellow","proced":"aqua","decn":"yellow","lao":"blue","hum":"red","hum*":"pink","prot":"maroon","prot*":"orange"}
//create boxes statically once so call stack doesn't grow infinitely every time you click something
function renderFormat() {
    Backgrounds = []
    for(var i = 0; i < maxQs; i++){
        Y = (Boxheight+Boxpadding)*i+Questionsize+2*Questionpadding
        bounds = [100, Y, 800, Boxheight]
        Backgrounds.push(createBox(bounds).attr('fill','#80b1d3'))
    }
    bl = [100, Y, Boxheight, Boxheight]
    leftbox = createBox(bl).attr('fill','#ffff7f')
    br = [900-Boxheight, Y, Boxheight, Boxheight]
    rightbox = createBox(br).attr('fill','#30b364')
    textg = svg.append('g');
    for(var i = 0; i < maxQs; i++){
        Y = (Boxheight+Boxpadding)*i+Questionsize+2*Questionpadding
        bounds = [100, Y, 800, Boxheight]
        createBox(bounds).attr('fill','transparent').datum(i).on('click',d=>{if(ANSWERS[d]=="prev"){previous(d)}else{Answers[questionindex] = d; renderQuestion(d)}})
    }
    leftcbox = createBox(bl).attr('fill','transparent').on("click",function(d){nextq(1)})
    rightcbox = createBox(br).attr('fill','transparent').on("click",d=>{(Selected<ANSWERS.length-OMIT_N)?nextq(1.5):nextq(1)})
}
function renderQuestion(selected){
    Selected = selected
    QUESTION = Qs[questionindex].key
    ANSWERS = []
    for(var i = 0; i < Qs[questionindex].order.length; i++) {
        ANSWERS.push(QUESTION+Qs[questionindex].order[i])
    }
    ANSWERS.push("o")
    ANSWERS.push("a")
    OMIT_N = 2;
    if(questionindex > 0)
    {
        ANSWERS.push("prev")
        OMIT_N = 3;
    }
    svg.attr('height',(Boxheight+Boxpadding)*ANSWERS.length+Questionsize+2*Questionpadding)
    svg.selectAll("text").remove();
    svg.selectAll("image").remove();
    createText([100,Questionpadding, 800,Questionsize],QUESTION,0,"lightgrey")
    createLineText([950,Questionpadding, 100,Questionsize],(questionindex+1)+"/"+Qs.length).attr('fill',"lightgrey")
    SIZE = 1000
    Q = []
    leftbox.attr('y',-1000)
    leftcbox.attr('y',-1000)
    rightbox.attr('y',-1000)
    rightcbox.attr('y',-1000)
    for(var i = 0; i < ANSWERS.length; i++)
    {
        Y = (Boxheight+Boxpadding)*i+Questionsize+2*Questionpadding
        bounds = [100, Y, 800, Boxheight]
        T = createText(bounds, ANSWERS[i],bounds[3])
        SIZE = Math.min(SIZE, T[1])
        Q.push(T[0])
        Backgrounds[i].attr('fill',i==selected?'#5081a3':'#80b1d3')
        if(i == selected)
        {
            if(i < ANSWERS.length-OMIT_N) {
                bl = [100, Y, Boxheight, Boxheight]
                leftbox.attr('y',Y)
                createLineText(bl, "?")
                leftcbox.attr('y',Y)
                
            }
            br = [900-Boxheight, Y, Boxheight, Boxheight]
            rightbox.attr('y',Y)
            createLineText(br, "✓")
            rightcbox.attr('y',Y)
        }
    }
    if(questionindex  == 0) {
        H = svg.attr('height')-80;
        W = 50*H/1056
        W2 = W*0.8;
        CW = 100-W-W2/2;
        CH = 80+H/2;
        if(selected >= 0) {
            createLineText([CW-H/2,CH-W2/2,H,W2],LANGUAGES["BL"][curlang]).attr("transform","rotate(-90,"+CW+","+CH+")").attr('fill','lightgrey')
            svg.append("image").attr("href","data/left.png").attr('x',100-W).attr('y',80).attr('width',W).attr('height',H)
            createLineText([1000-(CW+H/2),CH-W2/2,H,W2],LANGUAGES["BR"][curlang]).attr("transform","rotate(90,"+(1000-CW)+","+CH+")").attr('fill','lightgrey')
            svg.append("image").attr("href","data/right.png").attr('x',900).attr('y',80).attr('width',W).attr('height',H)
        } else {
            //bounds: [10,80,85-W,80,H]
            createLineText([CW-H/2,CH-W2/2,H,W2],LANGUAGES["A"][curlang]).attr("transform","rotate(-90,"+CW+","+CH+")").attr('fill','lightgrey')
            svg.append("image").attr("href","data/left.png").attr('x',100-W).attr('y',80).attr('width',W).attr('height',H)
        }
    }
    for(i = 0; i < Q.length; i++)
        for(j = 0; j < Q[i].length; j++)
            Q[i][j].attr("font-size",SIZE)
}
function renderChart(box, result) {
    pct = 1000;
    for(var i = result.length-1; i >=0; i--)
    {
        createSemicircle(box, pct).attr('fill', COLORS[ID2C[result[i][0]]])
        pct-=result[i][1]
    }
}
function renderInfoBox(box, result) {
    createBox(box).attr('fill', COLORS[ID2C[result[0]]])
    createLineText([box[0]+10, box[1]+10, box[2]-ResultPercentWidth-20, ResultPercentHeight], (result[1]/10)+"% "+LANGUAGES[result[0]][curlang]).attr('fill', result[0]=="nota"?"white":"black")
    createText([box[0]+10, box[1]+20+ResultPercentHeight, box[2]-ResultPercentWidth-20, box[3]-30-ResultPercentHeight], result[0]+"desc",0,result[0]=="nota"?"white":"black")
}
function renderResult(box, result, label) {
    textg = svg
    renderChart([box[0],box[1]+ResultLabelheight,box[3]-ResultLabelheight,box[3]-ResultLabelheight],result)
    createLineText([box[0], box[1]-10, box[3]-ResultLabelheight, ResultLabelheight], LANGUAGES[label][curlang]).attr("fill", 'white')
    var width = (box[2]-box[3]+ResultLabelheight)/3
    for(var k = 0; k < result.length; k++)
        renderInfoBox([box[0]+box[3]+Boxpadding+k*width, box[1]+ResultLabelheight,width-Boxpadding,box[3]-ResultLabelheight], result[k])
}
