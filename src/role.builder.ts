import { room } from "main";

export function run(creep: Creep, fullEnergyStructures: AnyOwnedStructure[]): void
{
/////////// Write stuff
    const constrSitesExt = room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (cs : ConstructionSite) => cs.structureType == STRUCTURE_EXTENSION})

        const constrSitesAll= room.find(FIND_MY_CONSTRUCTION_SITES, {
        filter: (cs : ConstructionSite) => (cs.structureType != STRUCTURE_EXTENSION)})

    const target2 = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    const target = creep.pos.findClosestByRange(fullEnergyStructures)
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0 && (room.energyAvailable > 350)) {
        _moveToSpawnWithdraw(creep, target)
        creep.memory.working == true;
    } else if ((creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) && (constrSitesExt.length > 0)){
        creep.say('Build Extension!')
        if (creep.pos.inRangeTo(constrSitesExt[0].pos, 2)){
            creep.build(constrSitesExt[0])
        } else {
            creep.moveTo(constrSitesExt[0].pos)
        }
        creep.memory.working == true;
    } else if ((creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) && (constrSitesAll.length > 0)){
        if(target2) {
            if(creep.build(target2) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target2);
            }
        }
        creep.memory.working == true;
    } else {
        creep.memory.working == false;
    }
}


function _moveToSpawnWithdraw(creep: Creep, target: any): void
{
    if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target.pos);
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
