export function run(creep: Creep, fullEnergyStructures : AnyOwnedStructure[]): void
{
/////////// Write stuff
    if ((creep.store.getUsedCapacity() == 0) && !(fullEnergyStructures.length == 0)){
        creep.memory.working = true
        _moveToSpawnWithdraw(creep, fullEnergyStructures)
    } else if((creep.room.controller) && (creep.store.getUsedCapacity() > 0)) {
        {
            creep.memory.working = true
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    } else {
        creep.memory.working = false
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

function _moveToSpawnWithdraw(creep: Creep, target: any): void
{
    if (creep.withdraw(target[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)
    {
        creep.moveTo(target[0].pos);
    }
}

function _moveToCtrl(creep: Creep, target: any): void
{
    creep.moveTo(target.pos);
}
