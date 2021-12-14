export let output: Source[] = [];
export let creeps: Creep[];
import { room } from "main";
export function run(creep: Creep, source : any, emptyEnergyStructures: AnyOwnedStructure[]): void
{
    // Declare variables
    creeps = room.find(FIND_MY_CREEPS)
    const creepCap = creep.store.getCapacity()
    const creepUsedCap = creep.store.getUsedCapacity()
    const collectors = _.filter(creeps, (creep) => creep.memory.role === "Collector");
    // Main script for harvester
    if (collectors.length < 3) {
        if ((creepUsedCap <= creepCap) && (creep.memory.working == false )) {
            _moveToHarvest(creep, source[creep.memory.source])
            if(creepUsedCap == creepCap) {
                creep.memory.working = true
            }
        }
        if ((creep.memory.working == true ) && (emptyEnergyStructures.length != 0)){
            _moveToSpawn(creep, emptyEnergyStructures[0])
            if (creepUsedCap == 0){
                creep.memory.working = false
            }
        }
    } else if (collectors.length >= 3){
        _moveToHarvest(creep, source[creep.memory.source])
        creep.memory.working = true
    }
}

function isSpawn(s : Structure) : s is StructureSpawn {

    return s.structureType == STRUCTURE_SPAWN

}

function isExtension(s : Structure) : s is StructureExtension {

    return s.structureType == STRUCTURE_EXTENSION

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

function _moveToSpawn(creep: Creep, target: any): void
{
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target.pos);
    }
}
