def readF(fname):
    with open(fname, 'r') as fh:
        return [i for i in fh.read().split("\n")[1:] if len(i) > 1]

def extractColumn(lines, index):
    return [l.split("\t")[index] for l in lines]

keys = ["".join(i.split("\t")[:2]) for i in readF("translations/translations.tsv")]
for i in keys:
    if keys.count(i) > 1:
        print("Error: Duplicate key -", i)
filler = 3
#pre-load keys that are static; not in data files
keysused = "nota,idc,prev,cent,o,a,notadesc,idcdesc,centdesc,quizname,A,BL,BR,all,home,values".split(",")
questions = readF("data/questions.tsv")
vals = {"rel": "theo,hybr,athe,sec,athe*", "soct":"perf,free,prog,trad,just","legal":"proced,decn,lao,hum,hum*,prot,prot*","econ":"ordo,opt,soc,marksoc,cap,socdem,clas,com", "gov":"repub,auth,rep,techno,dir,plut,strato,anar,rep*,dir*,repub*,auth*","for":"sov,asim,nat,open,iso,pop,glob,glob*,open*,nat*"}
for i in vals:
    vals[i] = vals[i].split(",")
    keysused.append(i)
    for i in vals[i]:
        keysused.append(i)
        keysused.append(i+"desc")
for q in questions:
    t = q.split("\t")
    keysused.append(t[0])
    for i in range(10):
        if t[i+filler]!="":
            keysused.append(t[0]+str(i))
    found = False
    j = vals[t[1]]
    tmp = []
    for t2 in t[filler:]:
        for v in t2.split("/"):
            if v != "" and not v in j:
                print("Warning:",v,"not in",t[1])
            else:
                tmp.append(v)
    for i in j:
        if not i.replace("*","") in tmp:
            print("Warning:",i.replace("*",""),"not in",t[0])
for i in set(keysused):
    if i in keys:
        keys.remove(i)
    else:
        print("Error: no key",i)
    
for i in keys:
    print("Warning: key",i,"not used")

