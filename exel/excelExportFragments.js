import {store} from "../store/store.mjs"
import {bitmasks} from "../store/bitmasks.mjs"

//frament1, name1, category from tags, main/additional
const frags = store.fragments.filter(f => !bitmasks.fragments.some(fx=> fx.id == f.id));

function getCategoryFromTagList(tl){
    if(tl.includes('eyes')){
        return 'eyes'
    }else if(tl.includes('head')){
        return 'head'
    }else if(tl.includes('mouth')){
        return 'mouth'
    }else if(tl.includes('env')){
        return 'env'
    }else if(tl.includes('costume')){
        return 'costume'
    }else if(tl.includes('decor')){
        return 'decor'
    }else{
        return '';
    }
}

function fragmentIsInGenesis(fId){
    return store.bitmasks.flatMap(b => b.fragments.flatMap(f => f.id)).some(x => x ==fId)
}

function exportFragmentsToExel(){
    frags.forEach((f,i) =>{
        const category = getCategoryFromTagList(f.tags);
        const isGenesis = fragmentIsInGenesis(f.id);
        console.log(`${i}\t${f.id}\t${category}\t${isGenesis}`)
    })
}

exportFragmentsToExel();
//console.log(frags.filter(f => fragmentIsInGenesis(f.id)).length)
//console.log(store.bitmasks.flatMap(b => b.fragments.flatMap(f => f.id)).length)