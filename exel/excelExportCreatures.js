import {store} from "../store/store.js"


// creature id/number, name, parent1Id, parent2Id, gen, fragmentListByGen
function exportCreatures(){
    let creatures = store.bitmasks.map((b,i) => {
        const creature = {
            id: i+1,
            name: b.name,
            parent1: null,
            parent2: null,
            gen: 0,
            fragments: b.fragments.map(f => f.id)
        }
        return creature;
    })
    console.log(creatures);
}

exportCreatures();