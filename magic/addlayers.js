import { landCopters } from "./landCopters.js";
import { store } from "../store/store.js";
import { v4 } from 'uuid';

export function addLayersToBob(bob){
    const fragments = JSON.parse(JSON.stringify(bob.fragments.map(fId => {
        return store.fragments.find(f => f.id == fId)
    }))).map(f => {
        f.fakeId = v4();
        f.left = 0;
        f.top = 0;
        f.scale = 100;
        return f;
    })
    const landedFragments = landCopters(fragments);
    bob.layers = landedFragments.flatMap(f => f.layers);
    bob.layers.forEach(l => {
        delete l.anchors;
        l.order = +l.order;
    });
    return bob
}

// cd ~/repos/scripts-inferno/ && node addlayers.js > moneken.js