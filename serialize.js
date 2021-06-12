function binarize(number, digits){
    number = number.toString(2)
    while(number.length < digits)
        number = "0"+number;
    return number
}
function same(tv, sv) {
    if(typeof tv != "string")
        return [false]
    if(tv.endsWith("*")) {
        if(tv == sv)
            return [true, "1"]
        if(tv == (sv+"*"))
            return [true, "0"]
    }
    else if(tv == sv)
        return [true, ""]
    return [false]
}
function findAndPrune(tree, find) {
    if(typeof tree == "string") {
        return -1;
    }
    if(same(tree[0], find)[0]){
        return ["0"+same(tree[0], find)[1], tree[1]]
    }
    else if(same(tree[1], find)[0]){
        return ["1"+same(tree[1], find)[1], tree[0]]
    } else {
        var a = findAndPrune(tree[0], find)
        if(a == -1)
        {
            var b = findAndPrune(tree[1], find)
            if(b == -1)
                return -1;
            return ["1"+b[0], [tree[0], b[1]]]
        }
        return ["0"+a[0], [a[1],tree[1]]]
    }
}
function parseAndPruneWrapped(tree) {
    if(typeof tree == "string") {
        if(tree.endsWith("*")) {
            if(readBit() == 0) {
                return [tree.replace("*",""),-1]
            }
            return [tree,-1]
        }
        return [tree,-1]
    }
    var B = readBit();
    var tmp = parseAndPruneWrapped(tree[B]);
    if(tmp[1] == -1)
    {
        return [tmp[0], tree[1-B]];
    }
    if(B == 0)
        return [tmp[0], [tmp[1], tree[1]]]
    return [tmp[0], [tree[0], tmp[1]]]
}
function parseAndPrune(tree) {
    var T = parseAndPruneWrapped(tree)
    return T
}
TREES = [
            [["repub*",["rep*",["dir*","anar*"]]],[["techno","auth*"],[["plut","strato"],["nota",["idc","cent"]]]]],
            [["soc",["opt",["socdem",["com","marksoc"]]]],["ordo",["clas",[["cap","nota"],["idc","cent"]]]]],
            [[["free","trad"],["just","prog"]],[["perf","idc"],["nota","cent"]]],
            ["hybr",[["sec","athe*"],[["theo","nota"],["idc","cent"]]]],
            ["hum*",[["proced","decn"],["proc",[["lao","prot*"],["nota",["idc","cent"]]]]]],
            [["open*","glob*"],[["asim","sov"],[["nat*","pop"],[["idc","nota"],["cent","iso"]]]]]
        ]
function encode(data) {
    bits = ["0"]
    encodings = []
    for(var i = 0; i < data.length; i++) {
        var curres = data[i].sort((a,b)=>b[1]-a[1])
        var order = [[], [0], [1,0], [1,2,0]]
        var curtree = TREES[i];
        M = 500
        for(var j = 0; j < curres.length; j++)
        {
            index = order[curres.length][j]
            var encoding = ""
            var temp = findAndPrune(curtree, curres[index][0])
            encoding = temp[0];
            curtree = temp[1];
            bits.push(encoding)
            if(index == 0 && 3 != curres.length)
                bits.push("1")
            else if (index != 0){
                bits.push("0")
                var t = (M+1).toString(2);
                var l = t.length;
                var maxv = parseInt((t.replaceAll("0","1")),2)
                var curv = Math.round(curres[index][1])
                bits.push(binarize(Math.round(maxv*curv/M),l))
                M = Math.round(Math.min(curv, 1000-2*curv))
            }
        }
    }
    bits = bits.join("").split("").map(d=>1*d);
    return fromBits(packbits(XOR(bits)))
}
function readBit() {
    var bit = ENCODING[ENCIDX]
    ENCIDX+=1;
    return bit*1;
}
function readBits(num) {
    var bits = parseInt(ENCODING.substr(ENCIDX, num),2)
    ENCIDX+=num;
    return bits*1;
}
function decode(encoded) {
    ENCODING = unXOR(unpackbits(toBits(encoded))).join("")
    ENCIDX = 1;
    var results = []
    for(var i = 0; i < 6; i++) {
        dimension = [0];
        results.push(dimension)
        curTree = TREES[i]
        value = parseAndPrune(curTree);
        curTree = value[1];
        value = value[0];
        if(readBit() == 1) {
            dimension[0] =[value,1000]
            continue
        }
        number = Math.round(500*readBits(9)/511);
        M = Math.round(Math.min(number, 1000-2*number))
        dimension.push([value,number])
        value = parseAndPrune(curTree);
        curTree = value[1];
        value = value[0];
        if(readBit() == 1) {
            dimension[0] =[value,1000-number]
            continue
        }
        var curbin = (M+1).toString(2)
        number2 = Math.round(M*readBits(curbin.length)/parseInt(curbin.replaceAll("0","1"),2))
        dimension.push([value, number2])
        value = parseAndPrune(curTree);
        curTree = value[1];
        value = value[0];
        dimension[0] = [value, 1000-(number+number2)]
    }
    return results
}
encodestr = "glFdO8VTvCSiWMnfq12mpHRUs73KZQuPkyjIYBe45cJbN-woDLAE9h_X0zxtarG6"
function toBits(encoded) {
    t = 0;
    bits = [];
    for(i = 0; i < encoded.length; i++)
    {
        n = encodestr.indexOf(encoded[i]);
        c = i%2
        r = []
        for(j = 0; j < 6; j++) {
            v = n%2
            n = Math.floor(n/2);
            r.push(v)
        }
        for(j = 5; j >= 0; j--) {
            bits.push(r[j])
        }
    }
    return bits
}
function fromBits(bits) {
    while(bits.length%6 > 0)
        bits.push(0)
    t = 0;
    var res = []
    for(var i = 0; i < bits.length; i+=6)
    {
        r = 0;
        for(j = 0; j < 6; j++) {
            r = r * 2 + bits[i+j]
        }
        res.push(encodestr[r]);
    }
    return res.join("")
}
function XOR(bits) {
    cur = 0;
    for(i = 0; i < bits.length; i++){
        cur = (cur+bits[i])%2
        bits[i] = cur;
    }
    return bits;
}
function unXOR(bits) {
    cur = 0;
    for(i = 0; i < bits.length; i++){
        t = bits[i]
        bits[i] = (cur+bits[i])%2;
        cur = t
    }
    return bits;
}
function packbits(bits) {
    while(bits.length%6 > 0)
        bits.push(0)
    var res = []
    for(k = 0; k < 6; k++)
    {
        j = (k+3)%6
        for(i = 0; i < bits.length; i+=6)
            res.push(bits[i+j])
    }
    return res
}
function unpackbits(bits) {
    var res = []
    for(i = 0; i < bits.length; i++)
        res.push(0);
    count = 0;
    for(k = 0; k < 6; k++) {
        j = (k+3)%6
        for(i = 0; i < bits.length; i+=6)
        {
            res[i+j] = bits[count]
            count+=1;
        }
    }
    return res
}
