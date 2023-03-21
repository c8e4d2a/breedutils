import { fragmentProbabilities } from "../store/fragmentProbabilities.js";
import { MANDATORY_CATEGORIES, CATEGORIES, minRand, selectDicedFragment, selectDicedFragmentFromCandidates, deleteConflictingEyes, keepWinningFragments} from "./breed_inferno_utils.js"

// prepare lazy imported data
const fragments = fragmentProbabilities.map(x=>{
    x.Apperance_Prob = x.Apperance_Prob.replace('%','').replace(',','.')/100
    x.Gen0_Prob = x.Gen0_Prob.replace('%','').replace(',','.')/100
    x.Gen1_Prob = x.Gen1_Prob.replace('%','').replace(',','.')/100
    x.Gen2_Prob = x.Gen2_Prob.replace('%','').replace(',','.')/100
    x.Gen3_Prob = x.Gen3_Prob.replace('%','').replace(',','.')/100
    x.Gen4_Prob = x.Gen4_Prob.replace('%','').replace(',','.')/100
    x.Gen5_Prob = x.Gen5_Prob.replace('%','').replace(',','.')/100
    x.Gen6_Prob = x.Gen6_Prob.replace('%','').replace(',','.')/100
    x.Gen7_Prob = x.Gen7_Prob.replace('%','').replace(',','.')/100
    x.Gen8_Prob = x.Gen8_Prob.replace('%','').replace(',','.')/100
    return x;
});


// start breeding

function expandFragments(fList, scrollId){
    return fList.map(fId=>{
        return {
            gen: 0,
            id: fId,
            nftId: scrollId,
            prob: 1,
        }
    })
}

const MAX_DEPTH=8;

function nftToFragmentList(nft, gen){
    return nft?.fragments?.map(fId =>{
        const f = fragments.find(f => f.id == fId);
        return {
            gen,
            id: fId,
            nftId: nft.id,
            prob: f?f[`Gen${gen}_Prob`]:1,
        }
    })??[];
}

function getParentFragmentsByFList(list, gen, creatures){
    let parents = [...new Set( list.flatMap(nft => {
        return [
            creatures.find(c => c.id == creatures.find(c => c.id == nft.nftId).parent1), 
            creatures.find(c => c.id == creatures.find(c => c.id == nft.nftId).parent2)
        ]
    }))].filter(x=>x);
    return parents.flatMap(p => nftToFragmentList(p, gen))
}

function getAllParents(alice, bob, creatures){

    let allFragments = [
        [...nftToFragmentList(alice, 0), ...nftToFragmentList(bob, 0)]
    ]

    for(let i=1; i<MAX_DEPTH; i++){
        allFragments[i] = getParentFragmentsByFList(allFragments[i-1], i, creatures)
    }
    return allFragments.flatMap(x=>x);
}

function rand(items) {
    return items[Math.floor(Math.random()*items.length)];
}

export function breedWooden(aliceId, bobId, scrollId, creatures, scrolls){
    const alice = creatures.find(x=> x.id == aliceId);
    const bob   = creatures.find(x=> x.id == bobId);
    
    const allEyes = [...alice.fragments.filter(f => f.includes('eyes')), ...bob.fragments.filter(f => f.includes('eyes'))]
    const allMouth = [...alice.fragments.filter(f => f.includes('mouth')), ...bob.fragments.filter(f => f.includes('mouth'))]
    const allHead = [...alice.fragments.filter(f => f.includes('head')), ...bob.fragments.filter(f => f.includes('head'))]
    const allDecor = [...alice.fragments.filter(f => f.includes('decor')), ...bob.fragments.filter(f => f.includes('decor'))]
    const frags = [
        'w-body.png',
        rand(allDecor),
        rand(allHead),
        rand(allEyes),
        rand(allEyes),
        rand(allMouth),
    ]
    const john = {
        scrollId: scrollId,
        name: 'Wilder #'+scrollId,
        gen: Math.max(alice.gen, bob.gen)+1,
        parent1: aliceId,
        parent2: bobId,
        parents: `${aliceId} ${bobId}`,
        project: 'wooden',
        cd_minutes: 10 + 5*(Math.max(alice.gen, bob.gen)+1),
        fragments: frags,
    }

    return john;
}

export function breed(aliceId, bobId, scrollId, creatures, scrolls){

    const alice = creatures.find(x=> x.id == aliceId);
    const bob   = creatures.find(x=> x.id == bobId);

    const dice = {
        costume: Math.random(),
        decor: Math.random(),
        env: Math.random(),
        eyes: Math.random(),
        head: Math.random(),
        mouth: Math.random(),
    }

    let fragmentsDice = []
    Object.keys(dice).forEach(key => {
        if(dice[key] <= minRand[key]){
            const fragment = selectDicedFragment(key, dice[key]);
            fragmentsDice.push(fragment);
        }
    })
    fragmentsDice = expandFragments(fragmentsDice, scrollId);

    const john = {
        name: scrolls.find(s=>s.id == scrollId).name,
        gen: Math.max(alice.gen, bob.gen)+1,
        fragments: [],
        fragmentsParents: getAllParents(alice, bob, creatures),
        fragmentsDice,
        fragmentsScroll: [scrolls.find(s=> s.id == scrollId)?.fId].filter(x=>x),
    }

    if(john.fragmentsScroll.length > 0){
        const sId = john.fragmentsScroll[0];
        const randomedFragment = fragments.find(x=> x.id == sId);

        if(randomedFragment.category != 'eyes' || randomedFragment.eyeType == 'jointeye') {
            john.fragmentsParents = john.fragmentsParents.filter(f => randomedFragment.category != fragments.find(x=> x.id == f.id).category)
            john.fragmentsDice = john.fragmentsDice.filter(f => randomedFragment.category != fragments.find(x=> x.id == f.id).category)
        }else if(randomedFragment.eyeType == 'lefteye' || randomedFragment.eyeType == 'righteye'){
            john.fragmentsParents = john.fragmentsParents.filter(f => randomedFragment.eyeType != fragments.find(x=> x.id == f.id).eyeType && 'jointeye' != fragments.find(x=> x.id == f.id).eyeType)
            john.fragmentsDice = john.fragmentsDice.filter(f => randomedFragment.eyeType != fragments.find(x=> x.id == f.id).eyeType && 'jointeye' != fragments.find(x=> x.id == f.id).eyeType)
        }
    }
    if(john.fragmentsDice.length > 0){
        john.fragmentsDice.forEach(dice =>{
            //john.fragmentsParents = john.fragmentsParents.filter(fId => fragments.find(x=> x.id == fId).category != fragments.find(x=> x.id == sId).category)

            const randomedFragment = fragments.find(x=> x.id == dice.id);
            if(randomedFragment.category != 'eyes' || randomedFragment.eyeType == 'jointeye') {
                john.fragmentsParents = john.fragmentsParents.filter(f => randomedFragment.category != fragments.find(x=> x.id == f.id).category)
            }else if(randomedFragment.eyeType == 'lefteye' || randomedFragment.eyeType == 'righteye'){
                john.fragmentsParents = john.fragmentsParents.filter(f => randomedFragment.eyeType != fragments.find(x=> x.id == f.id).eyeType && 'jointeye' != fragments.find(x=> x.id == f.id).eyeType)
            }
        })
    }

    // now select some fragments
    john.fragments = [...john.fragmentsParents, ...john.fragmentsDice, ...expandFragments(john.fragmentsScroll, scrollId)]

    
    // TODO: fix Gen0_Prob
    const fragmentProbs = john.fragments.map(f => {
        return {
            id:f.id, 
            prob: f.prob,
            category: fragments.find(x=>x.id==f.id).category,
            eyeType: fragments.find(x=>x.id==f.id).eyeType
        }
    })
    const categoryProbs = CATEGORIES.map(c => {
        const sum = fragmentProbs.filter(x => x.category == c).reduce((partialSum,b)=>partialSum+b.prob,0);
        const random = Math.random()*(MANDATORY_CATEGORIES.includes(c)?sum:1);
        return {
            category:c,
            sum: sum*(MANDATORY_CATEGORIES.includes(c)?1:0.5),
            factor: (MANDATORY_CATEGORIES.includes(c)?1:0.5),
            random,
        }
    }).filter(x=>x.sum>0).map(x=>{
        x.fragment = selectDicedFragmentFromCandidates(x.random, fragmentProbs.filter(f=> f.category == x.category), x.factor)
        return x;
    }).filter(x => x.fragment)

    john.fragmentProbs = fragmentProbs;
    john.categoryProbs = categoryProbs;

    john.fragmentProbs = deleteConflictingEyes(john.fragmentProbs);
    john.fragmentProbs = keepWinningFragments(john.fragmentProbs);
    john.nft = {
        id: scrollId,
        scrollId: scrollId,
        name: scrolls.find(s=>s.id == scrollId).name,
        parent1: alice.id,
        parent2: bob.id,
        parents: `${alice.id} ${bob.id}`,
        project: 'inferno',
        gen: john.gen,
        cd_minutes: john.gen*10+15,
        fragments: [...new Set(john.fragmentProbs.map(f=> f.id))]
    };
    
    return john.nft;
}

//const aliceId    = 38;
//const bobId      = 39;
//const scrollId   = 40;
//const john = breed(aliceId, bobId, scrollId, creatures);