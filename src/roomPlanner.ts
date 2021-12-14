
export function run(room: Room): void
{
    // Roads around Spawn
    const spwn = room.find(FIND_MY_SPAWNS)
    const spwnPos = spwn[0].pos
    let spwnX = (spwnPos.x - 1)
    let spwnY = (spwnPos.y - 1)
    let roadCoords : any[] = []
    for (let y = spwnY; y <= (spwnY+2); y++) {
        for (let x = spwnX; x <= (spwnX+2); x++) {
            if (!(x == spwnPos.x && y == spwnPos.y)) {
                storeCoordinate(x, y, roadCoords)
            }
        }
    }
    const constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES)

    for (let i = 0; i < roadCoords.length; i+=2) {
        let x = roadCoords[i];
        let y = roadCoords[i+1];
        if (!(constructionSites.filter(cs => cs.pos.x == x && cs.pos.y == y))){
            Game.rooms[room.name].createConstructionSite(x, y, STRUCTURE_ROAD);
        }
    }
    const sources = room.find(FIND_SOURCES)
    const controller = room.find(FIND_MY_STRUCTURES, {filter : s => s.structureType == STRUCTURE_CONTROLLER})
    //const walls = room.find(FIND_STRUCTURES, {filter : wall => wall.structureType == STRUCTURE_WALL})
    const sourcePath = room.findPath(spwn[0].pos,sources[0].pos,{
        ignoreCreeps : true,
        ignoreRoads : true
    })
    const sourcePath2 = room.findPath(spwn[0].pos,sources[1].pos,{
        ignoreCreeps : true,
        ignoreRoads : true
    })
    const controllerPath = room.findPath(spwn[0].pos,controller[0].pos,{
        ignoreCreeps : true,
        ignoreRoads : true
    })
    // Square around Spawn
    let roadCoords2 : any[] = []
    spwnX = (spwnPos.x - 2)
    spwnY = (spwnPos.y - 2)
    let extensionCoords : any[] = []
    for (let y = spwnY; y <= (spwnY+4); y++) {
        for (let x = spwnX; x <= (spwnX+4); x++) {
            if ((y == (spwnY)) || (y == spwnY+2) || (y == spwnY+4)) {
                if((x == (spwnX)) || (x == (spwnX+2)) || (x == (spwnX+4))) {
                    if (!(x == spwnPos.x && y == spwnPos.y)) {
                        storeCoordinate(x, y, roadCoords2)
                    }
                } else if ((y == spwnY+2) && (x == (spwnX+1) || (x == (spwnX+3)))) {
                    storeCoordinate(x, y, roadCoords2)
                } else {
                    storeCoordinate(x, y, extensionCoords)
                }
            } else {
                if ((x == (spwnX+1)) || (x == (spwnX+2)) ||(x == (spwnX+3))) {
                    storeCoordinate(x, y, roadCoords2)
                } else {
                    storeCoordinate(x, y, extensionCoords)
                }
            }
        }
    }
    for (let i = 0; i < roadCoords2.length; i+=2) {
        let x = roadCoords2[i];
        let y = roadCoords2[i+1];
        Game.rooms[room.name].createConstructionSite(x, y, STRUCTURE_ROAD);
    }
    for (let i = 0; i < extensionCoords.length; i+=2) {
        let x = extensionCoords[i];
        let y = extensionCoords[i+1];
        Game.rooms[room.name].createConstructionSite(x, y, STRUCTURE_EXTENSION);
    }
/*
    for (let i = 0; i < sourcePath.length; i+=1) {
        Game.rooms[room.name].createConstructionSite(sourcePath[i].x, sourcePath[i].y, STRUCTURE_ROAD);
    }

    for (let i = 0; i < sourcePath2.length; i+=1) {
        Game.rooms[room.name].createConstructionSite(sourcePath2[i].x, sourcePath2[i].y, STRUCTURE_ROAD);
    }

    for (let i = 0; i < controllerPath.length; i+=1) {
        Game.rooms[room.name].createConstructionSite(controllerPath[i].x, controllerPath[i].y, STRUCTURE_ROAD);
    } */

/*     for (let i = 0; i < sourcePath2.path.length; i+=1) {
        Game.rooms[room.name].createConstructionSite(sourcePath2.path[i].x, sourcePath2.path[i].y, STRUCTURE_ROAD);
    } */
/*     const removeConstructions = room.find(FIND_MY_CONSTRUCTION_SITES)
    for (let i in removeConstructions) {
        removeConstructions[i].remove()
        console.log('Removed Construction site: ' + removeConstructions[i])
    } */


}



// Position of spawn => -2 -2
// for loop on 1st iteration and 5th iteration -> 5x from 11, 19 till 15,19
// put all top into an array then nested for loop get 1st position and 5th position
function storeCoordinate(x : number, y : number, array : any[]) {
    array.push(x);
    array.push(y);
}

function _moveToSpawnWithdraw(creep: Creep, target: any): void
{
    if (creep.withdraw(target[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target[0].pos);
    }
}

function _tryHarvest(creep: Creep, target: Source): number
{
    return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void
{
    if (_tryHarvest(creep, target) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target.pos);
    }
}
