export function run(creep: Creep): void
{

/*  // Filter Arrow function
    const emptyEnergyStructures : AnyOwnedStructure[]  = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)
        && s.store.getUsedCapacity(RESOURCE_ENERGY) < s.store.getCapacity(RESOURCE_ENERGY)})
*/

/*  // Filter function normal as parameter
    const fullEnergyStructures : AnyOwnedStructure[] = Game.rooms[room.name].find(FIND_MY_STRUCTURES,
        {filter:function(s) {
            return (s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && s.store.getUsedCapacity(RESOURCE_ENERGY) == s.store.getCapacity(RESOURCE_ENERGY)
        }
    })
*/

/*  // Normal Filter function
    const test122 : AnyOwnedStructure[] = fullEnergyStructures.filter(function(s){
        return s.structureType == STRUCTURE_SPAWN
    })
*/

/* function isSpawn(s : Structure) : s is StructureSpawn {

    return s.structureType == STRUCTURE_SPAWN

}

function isExtension(s : Structure) : s is StructureExtension {

    return s.structureType == STRUCTURE_EXTENSION

} */

/* const removeConstructions = room.find(FIND_MY_CONSTRUCTION_SITES)
for (let i in removeConstructions) {
    removeConstructions[i].remove()
    console.log('Removed Construction site: ' + removeConstructions[i])
} */

const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
if(target) {
    if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
    }
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
