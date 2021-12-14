export function run(creep: Creep): void
{
/////////// Write stuff

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
