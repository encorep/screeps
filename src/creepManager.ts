import { spawn } from "child_process";
import { isEmpty } from "lodash"
import { memoryUsage } from "process";
import * as Harvester from "./role.harvester";
import * as Builder from "./role.builder";
import * as Upgrader from "./role.upgrader";
import * as Collector from "./role.collector";
export let creeps: Creep[];
export let creepCount: number = 0;
export let harvesters: Creep[] = [];
export let harvestersSrc: Creep[] = [];
export let harvestersSrc2: Creep[] = [];
export let upgraders: Creep[] = [];
export let builders: Creep[] = [];
export let collectors: Creep[] = [];
export let creepSources: Creep[] = [];
export let harvestersSum: number = 0;
export let eneSrcNum: number = 0;
const creepsOfRole: {[key: string]: number} = {
}
export function run(room: Room): void
{

    creeps = room.find(FIND_MY_CREEPS)
    const spwns = room.find(FIND_MY_SPAWNS)
    const sources = room.find(FIND_SOURCES_ACTIVE)
    let totalCapEnergy = room.energyCapacityAvailable
    let totalEnergy = room.energyAvailable
    let randInt = (getRandomIntInclusive(1,100).toString())

    harvesters = _.filter(creeps, (creep) => creep.memory.role === "Harvester");
    harvestersSrc = _.filter(creeps, (creep) => creep.memory.role === "Harvester" && creep.memory.source == 0);
    harvestersSrc2 = _.filter(creeps, (creep) => creep.memory.role === "Harvester" && creep.memory.source == 1);
    upgraders = _.filter(creeps, (creep) => creep.memory.role === "Upgrader");
    builders = _.filter(creeps, (creep) => creep.memory.role === "Builder");
    collectors = _.filter(creeps, (creep) => creep.memory.role === "Collector");

    let maxUpgraderCount = 3
    var minHarvesterCount = 8
    var maxCollectorsCount = 4
    let maxBuilderCount = 2
    if (collectors.length >= 3){
        minHarvesterCount = 4
        maxBuilderCount = 4
    }

    var tick = Game.time
    if ((tick % 10) == 0){
        if(totalEnergy < totalCapEnergy){
            console.log(`Storage Energy: ${totalEnergy}/${totalCapEnergy}`);
            console.log(`Upgraders: ${upgraders.length}/${maxUpgraderCount}`);
            console.log(`Harvesters: ${harvesters.length}/${minHarvesterCount}`);
            console.log(`Builders: ${builders.length}/${maxBuilderCount}`);
            console.log(`Collectors: ${collectors.length}/${maxCollectorsCount}`);
        }
        if (totalEnergy == totalCapEnergy){
            console.log("Energy of Storage is full!");
        }
    }
    eneSrcNum = getRandomIntInclusive(0,1)
    if (harvestersSrc.length > harvestersSrc2.length){
        eneSrcNum = 1
    } else {
        eneSrcNum = 0
    }


    const harvestersSum = creeps.filter(function(c){
        return c.memory.role == 'Harvester'
    })
    if (creeps.length < 20) {
        if (harvesters.length < minHarvesterCount) {
            if (collectors.length < 3) {
                Game.spawns[spwns[0].name].spawnCreep([WORK,WORK,CARRY,MOVE],('H' + randInt),{
                    memory : {
                        role : 'Harvester',
                        working : false,
                        room : room.name,
                        source : eneSrcNum
                        }
                    }
                )
            } else if ((totalEnergy >= 500) && (collectors.length >= 3)) {
                Game.spawns[spwns[0].name].spawnCreep([WORK,WORK,WORK,WORK,MOVE,MOVE],('HBig' + randInt),{
                    memory : {
                        role : 'Harvester',
                        working : false,
                        room : room.name,
                        source : eneSrcNum
                        }
                    }
                )
            }
            if (Game.spawns[spwns[0].name].spawning != null) {
                console.log('Spawning Harvester!')
            }
        } else if (upgraders.length < maxUpgraderCount){
            Game.spawns[spwns[0].name].spawnCreep([WORK,WORK,CARRY,MOVE],('U' + randInt),{
                memory : {
                    role : 'Upgrader',
                    working : false,
                    room : room.name,
                    source: 0
                    }
                }
            )
        } else if (builders.length < maxBuilderCount){
            Game.spawns[spwns[0].name].spawnCreep([WORK,WORK,CARRY,MOVE],('B' + randInt),{
                memory : {
                    role : 'Builder',
                    working : false,
                    room : room.name,
                    source: 0
                    }
                }
            )
        } else if (collectors.length < maxCollectorsCount) {
            if ((totalEnergy > 500) && (collectors.length == (maxCollectorsCount-1))) {
                Game.spawns[spwns[0].name].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],('Cbig' + randInt),{
                    memory : {
                        role : 'Collector',
                        working : false,
                        room : room.name,
                        source: 0
                        }
                    }
                )
            } else {
                Game.spawns[spwns[0].name].spawnCreep([CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],('C' + randInt),{
                    memory : {
                        role : 'Collector',
                        working : false,
                        room : room.name,
                        source: 0
                        }
                    }
                )
            }
        }
    }
    const emptyEnergyStructures : AnyOwnedStructure[] = emptyEnergyStruct(room)
    const fullEnergyStructures : AnyOwnedStructure[] = fullEnergyStruct(room)
    for (var creep of creeps.sort()) {
        if (creep.memory.role == 'Harvester') {
            Harvester.run(creep, sources, emptyEnergyStructures);
        }
        if (creep.memory.role == 'Upgrader'&& (harvesters.length >= minHarvesterCount)) {
            Upgrader.run(creep, fullEnergyStructures);
        }
        if (creep.memory.role == 'Builder' && (harvesters.length >= minHarvesterCount)) {
            Builder.run(creep, fullEnergyStructures);
        }
        if (creep.memory.role == 'Collector') {
            Collector.run(creep, emptyEnergyStructures);
        }
    }
}

function emptyEnergyStruct(room: Room): AnyOwnedStructure[] {
    const empEneStr : AnyOwnedStructure[]  = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)
        && s.store.getUsedCapacity(RESOURCE_ENERGY) < s.store.getCapacity(RESOURCE_ENERGY)})
    return empEneStr
}

function fullEnergyStruct(room: Room): AnyOwnedStructure[] {
    const fulEneStr : AnyOwnedStructure[]  = Game.rooms[room.name].find(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)
        && s.store.getUsedCapacity(RESOURCE_ENERGY) == s.store.getCapacity(RESOURCE_ENERGY)})
    return fulEneStr
}

function _tryHarvest(creep: Creep, target: Source): number{
    return creep.harvest(target);
}

function _moveToHarvest(creep: Creep, target: Source): void{
    if (_tryHarvest(creep, target) === ERR_NOT_IN_RANGE){
        creep.moveTo(target.pos);
    }
}

function getRandomIntInclusive(min : any, max : any) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
  }

