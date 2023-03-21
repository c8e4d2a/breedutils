function getLandingTransformation(copter, pad, copterPoint, padPoint){
    if(!isNaN(copter?.r1_p1_x)){
        copter.r1_p1_x = Math.min(copter.r1_p1_x, copter.r1_p2_x, copter.r1_p3_x, copter.r1_p4_x)
        copter.r1_p2_x = Math.max(copter.r1_p1_x, copter.r1_p2_x, copter.r1_p3_x, copter.r1_p4_x)
        copter.r1_p3_x = Math.max(copter.r1_p1_x, copter.r1_p2_x, copter.r1_p3_x, copter.r1_p4_x)
        copter.r1_p4_x = Math.min(copter.r1_p1_x, copter.r1_p2_x, copter.r1_p3_x, copter.r1_p4_x)

        copter.r1_p1_y = Math.min(copter.r1_p1_y, copter.r1_p2_y, copter.r1_p3_y, copter.r1_p4_y)
        copter.r1_p2_y = Math.min(copter.r1_p1_y, copter.r1_p2_y, copter.r1_p3_y, copter.r1_p4_y)
        copter.r1_p3_y = Math.max(copter.r1_p1_y, copter.r1_p2_y, copter.r1_p3_y, copter.r1_p4_y)
        copter.r1_p4_y = Math.max(copter.r1_p1_y, copter.r1_p2_y, copter.r1_p3_y, copter.r1_p4_y)
    }
    if(!isNaN(pad?.r1_p1_x)){
        pad.r1_p1_x = Math.min(pad.r1_p1_x, pad.r1_p2_x, pad.r1_p3_x, pad.r1_p4_x)
        pad.r1_p2_x = Math.max(pad.r1_p1_x, pad.r1_p2_x, pad.r1_p3_x, pad.r1_p4_x)
        pad.r1_p3_x = Math.max(pad.r1_p1_x, pad.r1_p2_x, pad.r1_p3_x, pad.r1_p4_x)
        pad.r1_p4_x = Math.min(pad.r1_p1_x, pad.r1_p2_x, pad.r1_p3_x, pad.r1_p4_x)

        pad.r1_p1_y = Math.min(pad.r1_p1_y, pad.r1_p2_y, pad.r1_p3_y, pad.r1_p4_y)
        pad.r1_p2_y = Math.min(pad.r1_p1_y, pad.r1_p2_y, pad.r1_p3_y, pad.r1_p4_y)
        pad.r1_p3_y = Math.max(pad.r1_p1_y, pad.r1_p2_y, pad.r1_p3_y, pad.r1_p4_y)
        pad.r1_p4_y = Math.max(pad.r1_p1_y, pad.r1_p2_y, pad.r1_p3_y, pad.r1_p4_y)
    }
    if(!pad && !padPoint){
        return {
            scale:  1,
            offsetX: 0,
            offsetY: 0,
        }
    }
    if(!copter && copterPoint && padPoint){
        return {
            scale:  1,
            offsetX: (padPoint.p1_x - copterPoint.p1_x),
            offsetY: (padPoint.p1_y - copterPoint.p1_y),
        }
    }
    if(!copter && !pad && (padPoint?.p1_x && copterPoint?.p1_x || padPoint?.p1_y && copterPoint?.p1_y)){
        return {
            scale:  1,
            offsetX: (padPoint.p1_x - copterPoint.p1_x),
            offsetY: (padPoint.p1_y - copterPoint.p1_y),
        }
    }
    if(!pad && !copterPoint){
        return {
            scale:  1,
            offsetX: (padPoint.p1_x - (copter.r1_p1_x +(copter.r1_p2_x - copter.r1_p1_x)/2)),
            offsetY: (padPoint.p1_y - (copter.r1_p1_y +(copter.r1_p4_y - copter.r1_p1_y)/2)),
        }
    }
    if(!copter && !padPoint && copterPoint && pad){
        return {
            scale:  1,
            offsetX: ((pad.r1_p1_x +(pad.r1_p2_x - pad.r1_p1_x)/2) - copterPoint.p1_x),
            offsetY: ((pad.r1_p1_y +(pad.r1_p3_y - pad.r1_p1_y)/2) - copterPoint.p1_y),
        }
    }
    if(pad && !padPoint){
        padPoint = {
            p1_x:(pad.r1_p1_x +(pad.r1_p2_x - pad.r1_p1_x)/2),
            p1_y: (pad.r1_p1_y +(pad.r1_p3_y - pad.r1_p1_y)/2),
        };
    }
    if(!pad && padPoint){
        if(copterPoint){
            return {
                scale:  1,
                offsetX: (padPoint.p1_x - copterPoint.p1_x),
                offsetY: (padPoint.p1_y - copterPoint.p1_y),
            }
        }else{
            return {
                scale:  1,
                offsetX: (padPoint.p1_x - (copter.r1_p1_x +(copter.r1_p2_x - copter.r1_p1_x)/2)),
                offsetY: (padPoint.p1_y - (copter.r1_p1_y +(copter.r1_p4_y - copter.r1_p1_y)/2)),
            }
        }
    }
    if(copter && !copterPoint){
        copterPoint = {
            p1_x:(copter.r1_p1_x +(copter.r1_p2_x - copter.r1_p1_x)/2),
            p1_y: (copter.r1_p1_y +(copter.r1_p3_y - copter.r1_p1_y)/2),
        };
    }

    const copterW = copter.r1_p2_x - copter.r1_p1_x;
    const copterH = copter.r1_p4_y - copter.r1_p1_y;
   
    const padW  = pad.r1_p2_x - pad.r1_p1_x;
    const padH  = pad.r1_p4_y - pad.r1_p1_y;
   
    const copterPadWRatio  = copterW / padW;
    const copterPadHRatio  = copterH / padH;

    let copterPadTotalRatio = Math.max(copterPadWRatio, copterPadHRatio);
   
    const copterBiggerThanPad =  1.0 < copterPadTotalRatio;
    
    let scaledCopter = Object.assign({}, copter)

    if(copterBiggerThanPad){
        // scale down copter, top right as anchor
        scaledCopter.r1_p2_x = scaledCopter.r1_p1_x + ( copterW / copterPadTotalRatio);
        scaledCopter.r1_p3_x = scaledCopter.r1_p2_x;
        scaledCopter.r1_p3_y = scaledCopter.r1_p1_y + ( copterH / copterPadTotalRatio);
        scaledCopter.r1_p4_y = scaledCopter.r1_p3_y;
    }else{
        copterPadTotalRatio = 1;
    }
    // we don't scale up
    
    // align copter inside
    const deltaFreeSpaceX = (pad.r1_p2_x - pad.r1_p1_x) - (scaledCopter.r1_p2_x - scaledCopter.r1_p1_x)
    const deltaFreeSpaceY = (pad.r1_p4_y - pad.r1_p1_y) - (scaledCopter.r1_p4_y - scaledCopter.r1_p1_y)

    const scaledCopterW = scaledCopter.r1_p2_x - scaledCopter.r1_p1_x;
    const scaledCopterH = scaledCopter.r1_p4_y - scaledCopter.r1_p1_y;

    
    scaledCopter.r1_p1_x = pad.r1_p1_x + deltaFreeSpaceX/2;
    scaledCopter.r1_p1_y = pad.r1_p1_y + deltaFreeSpaceY/2;
    
    scaledCopter.r1_p2_x = scaledCopter.r1_p1_x + scaledCopterW;
    scaledCopter.r1_p2_y = pad.r1_p2_y + deltaFreeSpaceY/2;
        
    scaledCopter.r1_p3_x = scaledCopter.r1_p1_x + scaledCopterW;
    scaledCopter.r1_p3_y = scaledCopter.r1_p1_y + scaledCopterH;

    scaledCopter.r1_p4_x = scaledCopter.r1_p1_x;
    scaledCopter.r1_p4_y = scaledCopter.r1_p3_y;

    let transform = {
        scale: copterBiggerThanPad ? 1 / copterPadTotalRatio : 1,
        offsetX: (scaledCopter.r1_p1_x - copter.r1_p1_x * (scaledCopterW / copterW)),
        offsetY: (scaledCopter.r1_p1_y - copter.r1_p1_y * (scaledCopterH / copterH)),
    };

    // use points
    const scaledCenterCopter = {
        p1_x: scaledCopter.r1_p1_x + scaledCopterW / 2,
        p1_y: scaledCopter.r1_p1_y + scaledCopterH / 2,
    }

    const centerPad = {
        p1_x: !isNaN(padPoint?.p1_x) ? padPoint.p1_x : pad.r1_p1_x + padW / 2,
        p1_y: !isNaN(padPoint?.p1_y) ? padPoint.p1_y : pad.r1_p1_y + padH / 2,
    }

    let desiredCopterTranslate = {
        moveX: !isNaN(copterPoint?.p1_x) ? centerPad.p1_x - scaledCenterCopter.p1_x + (copter.r1_p1_x + copterW/2 - copterPoint.p1_x) * scaledCopterW/copterW : centerPad.p1_x - scaledCenterCopter.p1_x,
        moveY: !isNaN(copterPoint?.p1_y) ? centerPad.p1_y - scaledCenterCopter.p1_y + (copter.r1_p1_y + copterH/2 - copterPoint.p1_y) * scaledCopterH/copterH : centerPad.p1_y - scaledCenterCopter.p1_y,
    }

    // try to move but respect bounds deltaFreeSpaceX/2 is the max movement on X Axis
    let actualCopterTranslate = {
        moveX: Math.min(Math.abs(desiredCopterTranslate.moveX), deltaFreeSpaceX/2) * Math.sign(desiredCopterTranslate.moveX),
        moveY: Math.min(Math.abs(desiredCopterTranslate.moveY), deltaFreeSpaceY/2) * Math.sign(desiredCopterTranslate.moveY),
    }

    scaledCopter.r1_p1_x += actualCopterTranslate.moveX
    scaledCopter.r1_p2_x += actualCopterTranslate.moveX
    scaledCopter.r1_p3_x += actualCopterTranslate.moveX
    scaledCopter.r1_p4_x += actualCopterTranslate.moveX
    scaledCopter.r1_p1_y += actualCopterTranslate.moveY
    scaledCopter.r1_p2_y += actualCopterTranslate.moveY
    scaledCopter.r1_p3_y += actualCopterTranslate.moveY
    scaledCopter.r1_p4_y += actualCopterTranslate.moveY

    let transformWithPivots = {
        scale: transform.scale,
        offsetX: (scaledCopter.r1_p1_x - copter.r1_p1_x * (scaledCopterW / copterW)),
        offsetY: (scaledCopter.r1_p1_y - copter.r1_p1_y * (scaledCopterH / copterH)),
    };

    return transformWithPivots;
}

function parseWhitelistOrBlackList(text){
    if(!text) text = ''
    return text.replace(/\r?\n|\r/g, ' ').replace(/ +/g,' ').trim().split(' ').map(l => l.split('_'))
}

export function landCopters(fragments) {
    
    // TODO: tags need to be attached to layers
    // avoid using fake ids inside layer
    let allAnchors = fragments
        .filter((f) => !f.hidden)
        .filter((x) => x)
        .flatMap((f) => f.layers.map(l=>{l.fID = f.id; return l}))
        .flatMap((l) =>
            l.anchors?.map((a) => {
                a.order = l.order;
                a.layerOutline = l.outline;
                a.tags = l.tags;
                a.fID = l.fID;
                return a;
            })
        )
        .filter((x) => x);

    let copterPoints = allAnchors.filter(
        (a) => a.type == "Point2D" && a.padOrCopter == "Helicopter"
    );
    let copterPolygons = allAnchors.filter(
        (a) =>
            a.type == "Polygon4P" && a.padOrCopter == "Helicopter"
    );
    let padPoints = allAnchors.filter(
        (a) => a.type == "Point2D" && a.padOrCopter == "Helipad"
    );
    let padPolygons = allAnchors.filter(
        (a) => a.type == "Polygon4P" && a.padOrCopter == "Helipad"
    );
    let landingParams = [];

    let copterGroups = [];

    function anchorsToCopterGroups() {
        let groups = copterPolygons.map((copterPoly) => {
            return {
                tags: copterPoly.tags,
                fID: copterPoly.fID,
                layerOutline: copterPoly.layerOutline,
                pad: undefined,
                padPoint: undefined,
                copter: copterPoly,
                copterPoint: copterPoints.find(
                    (copterPoint) =>
                        copterPoint.layerOutline == copterPoly.layerOutline
                ),
            };
        });

        copterPoints = copterPoints.filter(
            (copterPoint) =>
                !groups.some(
                    (g) =>
                        g.copterPoint?.layerOutline ==
                        copterPoint.layerOutline
                )
        );
        groups = [
            ...groups,
            ...copterPoints
                .map((copterPoint) => {
                    return {
                        tags: copterPoint.tags,
                        fID: copterPoint.fID,
                        layerOutline: copterPoint.layerOutline,
                        pad: undefined,
                        padPoint: undefined,
                        copter: undefined,
                        copterPoint: copterPoint,
                    };
                })
                .filter((x) => x),
        ];
        return groups;
    }

    copterGroups = anchorsToCopterGroups();

    function addLandingToGroup(copterGroup) {
        function isWider(a, b) {
            const aw =
                Math.max(a.r1_p1_x, a.r1_p2_x, a.r1_p3_x, a.r1_p4_x) -
                Math.min(a.r1_p1_x, a.r1_p2_x, a.r1_p3_x, a.r1_p4_x);
            const bw =
                Math.max(b.r1_p1_x, b.r1_p2_x, b.r1_p3_x, b.r1_p4_x) -
                Math.min(b.r1_p1_x, b.r1_p2_x, b.r1_p3_x, b.r1_p4_x);
            return aw < bw ? 1 : -1;
        }

        const padCandidates = padPolygons.filter((pad) =>
            copterTagsMatchWhiteAndBlacklist(copterGroup, pad)
        );
        const padPointsCandidates = padPoints.filter((pad) =>
            copterTagsMatchWhiteAndBlacklist(copterGroup, pad)
        );
        const minPadOrder = Math.min(...padCandidates.map((p) => p.order));
        const minPointOrder = Math.min(
            ...padPointsCandidates.map((p) => p.order)
        );
        const maxPadOrder = Math.max(...padCandidates.map((p) => p.order));
        const maxPadPointOrder = Math.max(
            ...padPointsCandidates.map((p) => p.order)
        );

        if (copterGroup.copter?.isBack || copterGroup.copterPoint?.isBack) {
            if (minPadOrder < minPointOrder) {
                // add min pad and mb find a padPoint
                copterGroup.pad = padCandidates.find(
                    (c) => c.order == minPadOrder
                );
                copterGroup.padPoint = padPointsCandidates.find(
                    (c) =>
                        c.order == minPadOrder &&
                        copterGroup.pad?.layerOutline == c.layerOutline
                );
            } else {
                // add min padPoint and mb find a pad
                copterGroup.padPoint = padPointsCandidates.find(
                    (c) => c.order == minPointOrder
                );
                copterGroup.pad = padCandidates.find(
                    (c) =>
                        c.order == minPointOrder &&
                        copterGroup.padPoint?.layerOutline == c.layerOutline
                );
            }
        } else if (
            copterGroup.copter?.isOnWidest ||
            copterGroup.copterPoint?.isOnWidest
        ) {
            copterGroup.pad = padCandidates.sort(isWider)[0];
            copterGroup.padPoint = padPointsCandidates.find(
                (c) => copterGroup.pad.layerOutline == c.layerOutline
            );
        } else {
            if (maxPadOrder > maxPadPointOrder) {
                // add min pad and mb find a padPoint
                copterGroup.pad = padCandidates.find(
                    (c) => c.order == maxPadOrder
                );
                copterGroup.padPoint = padPointsCandidates.find(
                    (c) =>
                        c.order == maxPadPointOrder &&
                        copterGroup.pad?.layerOutline == c.layerOutline
                );
            } else {
                // add min padPoint and mb find a pad
                copterGroup.padPoint = padPointsCandidates.find(
                    (c) => c.order == maxPadPointOrder
                );
                copterGroup.pad = padCandidates.find(
                    (c) =>
                        c.order == maxPadPointOrder &&
                        copterGroup.padPoint?.layerOutline == c.layerOutline
                );
            }
        }
        if (!copterGroup.pad && !copterGroup.padPoint) {
            return null;
        } else {
            return copterGroup;
        }
    }

    copterGroups = copterGroups.map(addLandingToGroup).filter((x) => x);

    landingParams = copterGroups;

    //console.dir({
    //    allAnchors,
    //    copterPoints,
    //    copterPolygons,
    //    padPoints,
    //    padPolygons,
    //    landingParams,
    //},{depth:null,maxArrayLength:null});

    landingParams.forEach((cp) => {
        landCopterForLayerByOutline(
            fragments,
            cp.fID,
            cp.layerOutline,
            cp.copter,
            cp.pad,
            cp.copterPoint,
            cp.padPoint
        );
    });

    function translateChildToParent(childLayerOutline, parentLayerOutline) {
        const child = fragments
            .flatMap((f) => f.layers)
            .find((l) => l.outline == childLayerOutline);
        const parent = fragments
            .flatMap((f) => f.layers)
            .find((l) => l.outline == parentLayerOutline);

        child.copterScale = child.copterScale * parent.copterScale;
        child.copterOffsetX = child.copterOffsetX + parent.copterOffsetX;
        child.copterOffsetY = child.copterOffsetY + parent.copterOffsetY;
    }

    //transitive landing
    function getLandingPath(l, landingParams) {
        landingParams = JSON.parse(
            JSON.stringify(
                landingParams.filter(
                    (x) => x.layerOutline != l.layerOutline
                )
            )
        );
        let outline = l.layerOutline;
        let padLayerOutline = l.pad
            ? l.pad.layerOutline
            : l.padPoint.layerOutline;
        let parent = landingParams.find(
            (f) => f.layerOutline == padLayerOutline
        );
        if (parent) {
            translateChildToParent(outline, parent.layerOutline);
        }
    }

    landingParams.forEach((p) => getLandingPath(p, landingParams));
    return fragments;
}

function landCopterForLayerByOutline(
    fragments,
    fID,
    outline,
    copter,
    pad,
    copterPoint,
    padPoint
) {
    //console.dir({
    //    fragments,
    //    fID,
    //    outline,
    //    copter,
    //    pad,
    //    copterPoint,
    //    padPoint}, {depth:null, maxArrayLength:null})

    const landTransform = getLandingTransformation(
        copter,
        pad,
        copterPoint,
        padPoint
    );
    const f = fragments.find((f) => f.id == fID);
    const layer = f?.layers.find((l) => l.outline == outline);
    if (layer) {
        layer.copterScale = landTransform.scale;
        layer.copterOffsetX = landTransform.offsetX;
        layer.copterOffsetY = landTransform.offsetY;
    }
}


export function layerHasLandCandidates(layer, fragments) {
    const candidates = fragments
        .filter((f) => !f.hidden)
        .filter((x) => x)
        .flatMap((f) => f.layers)
        .flatMap((l) =>
            l.anchors?.map((a) => {
                a.order = l.order;
                a.layerOutline = l.outline;
                a.tags = l.tags;
                a.fID = l.fID;
                return a;
            })
        )
        .filter((x) => x)
        .filter((x) => x.padOrCopter == "Helipad")
        .filter((pad) => copterTagsMatchWhiteAndBlacklist(layer, pad));

    return candidates.length > 0;
}

function copterTagsMatchWhiteAndBlacklist(copter, pad) {
    return (
        layerMatchesWhitelist(copter.tags, pad.whitelist) &&
        layerPassesBlacklist(copter.tags, pad.blacklist)
    );
}

function layerMatchesWhitelist(tags, whitelist) {
    const rules = parseWhitelistOrBlackList(whitelist);
    return rules.some((rule) => rule.every((tag) => tags.includes(tag)));
}

function layerPassesBlacklist(tags, blacklist) {
    const rules = parseWhitelistOrBlackList(blacklist);
    return rules.every((rule) => rule.every((tag) => !tags.includes(tag)));
}