import { eneSrcNum } from "creepManager";
import { room } from "main";
export let output: Source[] = [];

export function run(creep: Creep, emptyEnergyStructures: AnyOwnedStructure[]): void
{
    // Declare variables

    const creepCap = creep.store.getCapacity()
    const creepUsedCap = creep.store.getUsedCapacity()
    const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter : (ene : Resource) => ene.amount >=50});
    if ((creepUsedCap <= creepCap) && (creep.memory.working == false )) {
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        if(creepUsedCap == creepCap) {
            creep.memory.working = true
        }
    }

    if ((creep.memory.working == true ) && (emptyEnergyStructures.length != 0)){
        const target = creep.pos.findClosestByRange(emptyEnergyStructures)

        _moveToSpawn(creep, target)
        if (creepUsedCap == 0){
            creep.memory.working = false
        }
    }
}


function _moveToSpawn(creep: Creep, target: any): void
{
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target.pos);
    }
}
