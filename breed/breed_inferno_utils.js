import { fragmentProbabilities as fragments} from "../store/fragmentProbabilities.js";

export const CATEGORIES = [
  'costume',
  'decor',
  'env',
  'eyes',
  'head',
  'mouth',
]

export const MANDATORY_CATEGORIES = [
  'eyes',
  'head',
  'mouth',
]

export const minRand = {
  costume: 0.05,
  decor: 0.075,
  env: 0.12,
  eyes: 0.398,
  head: 0.05,
  mouth: 0.25,
}

export function selectDicedFragment(category, prob){
  const items = fragments.filter(f => f.category == category && !f.inGenesis).sort((a, b) => 0.5 - Math.random());
  const probs = items.map(i => parseFloat(i.Apperance_Prob))

  let sum = 0;
  let index = -1;
  for(let i = 0; i < probs.length; i++){
      sum = sum + probs[i];
      if(prob <= sum){
          index = i;
          break;
      }
  }
  return items[index]?.id??items[items.length-1].id;
}

export function selectDicedFragmentFromCandidates(prob, items, factor){
  const items2 = items.sort((a, b) => 0.5 - Math.random())
  const probs = items2.map(i => i.prob*factor)

  let sum = 0;
  let index = -1;
  for(let i = 0; i < probs.length; i++){
      sum = sum + probs[i];
      if(prob <= sum){
          index = i;
          break;
      }
  }
  if(index == -1){
      return null
  }else{
      return items2[index].id;
  }
}

export function deleteConflictingEyes(fragmentProbs){
  const jointeyeProb = fragmentProbs.filter(x => x.eyeType == 'jointeye').reduce((acc, e)=>acc + e.prob,0);
  const eyeProb = fragmentProbs.filter(x => x.eyeType == 'righteye' || x.eyeType == 'lefteye').reduce((acc, e)=>acc + e.prob,0);
  if(jointeyeProb > 0){
    if(eyeProb > 0){
      const x = Math.random()*(jointeyeProb+eyeProb)
      if(x < jointeyeProb){
        return fragmentProbs.filter(f => !(f.eyeType == 'righteye' || f.eyeType == 'lefteye'))
      }else{
        return fragmentProbs.filter(f => !f.eyeType || f.eyeType != 'jointeye')
      }
    }
  }
  return fragmentProbs;
}

export function keepWinningFragments(fragmentProbs){
  const CATEGORIES = [
    'costume',
    'decor',
    'env',
    'eyes',
    'head',
    'mouth',
  ]
  function deleteShit(c, frags, eyeType){
    if(frags.length == 0){
      return;
    }
    const probSum = frags.reduce((acc, e)=>acc + e.prob,0);
    const probs = frags.map(x => x.prob)

    const x = Math.random()*probSum

    let sum = 0;
    for(let i = 0; i < probs.length; i++){
        sum = sum + probs[i];
        if(x <= sum){
            if(eyeType){
              fragmentProbs = fragmentProbs.filter((e,j) => fragmentProbs[j].id == frags[i].id || e.category != c || e.eyeType != eyeType)
            }else{
              fragmentProbs = fragmentProbs.filter((e,j) => fragmentProbs[j].id == frags[i].id || e.category != c)
            }
            break;
        }
    }
  }
  
  CATEGORIES.filter(c=> c != 'eyes').forEach(c =>{
    let frags   = fragmentProbs.filter(f => f.category == c);
    deleteShit(c, frags);

  })
    const c = 'eyes';
    let frags   = fragmentProbs.filter(f => f.eyeType == 'jointeye');
    deleteShit(c, frags, 'jointeye');
    frags   = fragmentProbs.filter(f => f.eyeType == 'lefteye');
    deleteShit(c, frags, 'lefteye');
    frags   = fragmentProbs.filter(f => f.eyeType == 'righteye');
    deleteShit(c, frags, 'righteye');
  
  return fragmentProbs;
}
