import  fs from 'fs';
const IMPORT_FROM_FILE = '../xxx.txt';

function lineToStuct(line, attributeKeys){
    let obj = {}
    line.split('\t').forEach((e,i)=>{
        if(attributeKeys[i]){
            obj[attributeKeys[i]] = e;
        }
    })
    return obj;
}

function parseAttributeKeys(line){
    return line.split('\t').map(l => l.trim()).map(l=>{
        if(l.length > 0){
            return l.replaceAll(' ','_')
        }else{
            return l
        }
    })
}

const data = fs.readFileSync(IMPORT_FROM_FILE, {encoding:'utf8', flag:'r'}).replaceAll('\r','');
const lines = data.split('\n').map(x=> x.trim()).filter(x=>x);
let attributeKeys = parseAttributeKeys(lines[0])

const json = lines.map((line,i) => {
    if(i == 0){ return null}
    return lineToStuct(line, attributeKeys);
}).filter(x=>x);

console.dir("export const fragments = ");
console.dir(json,{'maxArrayLength': null});