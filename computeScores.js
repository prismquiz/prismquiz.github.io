    function vectorize(a) {
        t = {}
        a[0].split("/").forEach(d=>{t[d] = (t[d] || 0) + a[1];})
        return t;
    } 
    function vadd(a, b) {
        res = {}
        for( key in a) {
            if(b[key+"*"])
                res[key+"*"] = a[key];
            else
                res[key] = a[key];
        }
        for( key in b) {
            if(res[key+"*"])
                res[key+"*"] = Math.max(0, res[key+"*"]+b[key]);
            else
                res[key] = Math.max(0, (res[key] || 0)+b[key]);
        }
        return res;
    }
    function vdot(a, b) {
        res = {}
        for( key in a) {
            if(key.endsWith("*"))
                res[key] = a[key] * ((b[key] || 0)+(b[key.replaceAll("*","")] || 0));
            else
            {
                if(b[key+"*"])
                    res[key+"*"] = a[key] * b[key+"*"];
                else
                    res[key] = a[key] * (b[key] || 0);
            }
        }
        return res
    }
    function vtimes(v, tms) {
        res = {}
        for(key in v)
            res[key] = v[key] * tms;
        return res;
    }
    function normalize(v) {
        total = 0;
        for(key in v)
            total+=v[key];
        return vtimes(v, 1/total);
    }
    function flatten(v, multiplier) {
        m = 0;
        for(key in v)
            m=Math.max(m,v[key]);
        if(m == 0)
            return v;
        return vtimes(v, multiplier/m);
    }
    function compress(nums, glob, amt) {
        return normalize(vadd(vadd(nums, vtimes(glob, -amt)), {"cent": epsilon}))
    }
    function compute(nums, glob) {
        epsilon = 0.000000001;
        mono = nums.filter(d=>!d[0].includes("/")).map(vectorize).reduce(vadd, vtimes(glob, epsilon));
        poly = nums.filter(d=>d[0].includes("/")).map(d=>[vectorize(d),d[1]]).map(d=>flatten(vdot(d[0], vadd(mono, vtimes(glob, epsilon))),d[1])).reduce(vadd, vtimes(glob, epsilon))
        temp = normalize(vadd(mono, poly));
        s = compress(compress(temp, glob, 0.08), glob, 0.2);
        res = {}
        sol = [];
        count = 0;
        for(key in s)
        {
            if(s[key] > 0.005)
            {
                count+=1;
                res[key] = Math.round(s[key]*1000);
                sol.push([key, res[key]]);
            }   
        }
        if(count >= 4)
            return [['cent', 1000]];
        if(sol.length == 3)
			sol[0][1] = 1000-(sol[1][1]+sol[2][1])
		else if(sol.length == 2)
			sol[0][1] = 1000-(sol[1][1])
		else
			sol[0][1] = 1000
        return sol;
    }
