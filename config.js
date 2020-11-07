"use strict";

// GLOBALS 
const _landedHits = ["hit", "crit", "block", "crit block"];
const _timeStep = 25; // Timestep used for each fight

// Calc Settings
let _simDuration = 12; // Fight duration in seconds
let _iterations = 10000; // Number of fights simulated
let _snapshotLen = 400;
let _config = {}; // tank and boss settings
let _breakpointValue = 0;
let _breakpointTime = 0;
//let _firstBatch = 0;

// Tank Settings
let _startRage = 0;
let _deathwish = true;
let _crusaderMH = true;
let _crusaderOH = false;
let _thunderfuryMH = true;
let _thunderfuryOH = true;
let _windfury = false;
let _wcb = false;
let _dmf = false;

// Talents
let _impHS = 3;
let _impSA = 0;
let _defiance = 5;
let _impale = 0;
let _dwspec = 5;

// Trinkets
let _kots = false;
let _diamondflask = false;
let _earthstrike = false;
let _slayerscrest = false;
let _jomgabbar = false;
let _lgg = false; 

// Other Bonuses
let _twoPieceDreadnaught = false;
let _fivePieceWrath = false;
let _threatenchant = false;

// Fight config
let _debuffDelay = 0;

/*

{
    strength: 0,
    stamina: 0,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},

*/

let races = {
    "Dwarf": {
    strength: 122,
    stamina: 113,
    agility: 76,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Gnome": {
    strength: 115,
    stamina: 109,
    agility: 83,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Human": {
    strength: 120,
    stamina: 110,
    agility: 80,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 5,
    skilltype: ["Swords", "Maces"],
},
    "Night Elf": {
    strength: 117,
    stamina: 109,
    agility: 85,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 1,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Orc": {
    strength: 123,
    stamina: 112,
    agility: 77,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 5,
    skilltype: ["Axes"]
},
    "Tauren": {
    strength: 125,
    stamina: 112,
    agility: 75,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Troll": {
    strength: 121,
    stamina: 111,
    agility: 82,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Undead": {
    strength: 119,
    stamina: 111,
    agility: 78,

    hit: 0,
    crit: 0,
    attackpower: 160,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},

}

let heads = {
    "Circlet of Restless Dreams": {
    strength: 0,
    stamina: 38,
    agility: 21,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 175,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 6,
    skilltype: ["Daggers"],
},
    "Conqueror's Crown": {
    strength: 29,
    stamina: 34,
    agility: 18,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 739,
    parry: 0,
    dodge: 0,
    defense: 6,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Crown of Destruction": {
    strength: 0,
    stamina: 23,
    agility: 0,

    hit: 0,
    crit: 2,
    attackpower: 44,

    armor: 392,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Dreadnaught Helm": {
    strength: 21,
    stamina: 45,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 800,
    parry: 0,
    dodge: 1,
    defense: 14,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Expert Goldminer's Helmet": {
    strength: 0,
    stamina: 6,
    agility: 5,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 95,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 7,
    skilltype: ["Axes"]
},
    "Eye of Rend": {
    strength: 13,
    stamina: 7,
    agility: 0,

    hit: 0,
    crit: 2,
    attackpower: 0,

    armor: 143,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Fury Visor": {
    strength: 18,
    stamina: 0,
    agility: 0,

    hit: 1,
    crit: 1,
    attackpower: 0,

    armor: 445,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Helm of Domination": {
    strength: 21,
    stamina: 28,
    agility: 11,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 661,
    parry: 1,
    dodge: 0,
    defense: 7,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Helm of Endless Rage": {
    strength: 26,
    stamina: 29,
    agility: 26,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 679,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Helm of Heroism": {
    strength: 18,
    stamina: 32,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 0,

    armor: 556,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Helm of Might": {
    strength: 15,
    stamina: 35,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 608,
    parry: 0,
    dodge: 1,
    defense: 7,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Helm of the Executioner": {
    strength: 14,
    stamina: 20,
    agility: 0,

    hit: 2,
    crit: 0,
    attackpower: 0,

    armor: 534,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Helm of Valor": {
    strength: 15,
    stamina: 23,
    agility: 9,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 526,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Helm of Wrath": {
    strength: 17,
    stamina: 40,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 696,
    parry: 0,
    dodge: 0,
    defense: 11,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Lionheart Helm":{
    strength: 18,
    stamina: 0,
    agility: 0,

    hit: 2,
    crit: 2,
    attackpower: 0,

    armor: 565,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Mask of the Unforgiven": {
    strength: 0,
    stamina: 12,
    agility: 0,

    hit: 2,
    crit: 1,
    attackpower: 0,

    armor: 123,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "R10 Plate Helm": {
    strength: 21,
    stamina: 24,
    agility: 0,

    hit: 1,
    crit: 1,
    attackpower: 0,

    armor: 598,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "R13 Plate Helm": {
    strength: 28,
    stamina: 34,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 0,

    armor: 719,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Raging Berserker's Helm": {
    strength: 13,
    stamina: 8,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 0,

    armor: 213,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
}

let necks = {
    "Amulet of the Darkmoon" : {
    strength: 10,
    stamina: 10,
    agility: 19,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Barbed Choker" : {
    strength: 0,
    stamina: 10,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 44,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Beads of Ogre Might" : {
    strength: 0,
    stamina: 7,
    agility: 0,

    hit: 1,
    crit: 0,
    attackpower: 24,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Blazefury Medallion" : {
    strength: 0,
    stamina: 13,
    agility: 14,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Choker of the Shifting Sands" : {
    strength: 0,
    stamina: 16,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 42,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Eskhandar's Collar" : {
    strength: 0,
    stamina: 17,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 1,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Fury of the Forgotten Swarm" : {
    strength: 8,
    stamina: 0,
    agility: 0,

    hit: 1,
    crit: 1,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Imperial Jewel" : {
    strength: 0,
    stamina: 7,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 32,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Mark of Fordring" : {
    strength: 0,
    stamina: 0,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 26,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Onyxia Tooth Pendant" : {
    strength: 0,
    stamina: 9,
    agility: 12,

    hit: 1,
    crit: 1,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Pendant of Celerity" : {
    strength: 0,
    stamina: 0,
    agility: 15,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Prestor's Talisman of Connivery" : {
    strength: 0,
    stamina: 0,
    agility: 30,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Sadist's Collar" : {
    strength: 0,
    stamina: 24,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 20,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Stormrage's Talisman of Seething" : {
    strength: 0,
    stamina: 12,
    agility: 0,

    hit: 0,
    crit: 2,
    attackpower: 26,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Zealous Shadowshard Pendant" : {
    strength: 0,
    stamina: 0,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 20,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "The Eye of Hakkar" : {
    strength: 0,
    stamina: 0,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 40,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Will of the Martyr" : {
    strength: 0,
    stamina: 10,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 30,

    armor: 0,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
}

let chests = {
    "Black Dragonscale Breastplate": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 8,
       "agility": 0,
       "attackpower": 50,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 344,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bloodsoul Breastplate": {
       "crit": 2,
       "hit": 0,
       "strength": 0,
       "stamina": 13,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 381,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Breastplate of Annihilation": {
       "crit": 1,
       "hit": 1,
       "strength": 37,
       "stamina": 13,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 824,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Breastplate of Bloodthirst": {
       "crit": 2,
       "hit": 0,
       "strength": 13,
       "stamina": 20,
       "agility": 0,
       "attackpower": 0,
       "dodge": 1,
       "parry": 0,
       "defense": 0,
       "armor": 190,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Breastplate of Heroism": {
       "crit": 0,
       "hit": 1,
       "strength": 21,
       "stamina": 26,
       "agility": 13,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 684,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Breastplate of Might": {
       "crit": 0,
       "hit": 0,
       "strength": 20,
       "stamina": 28,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 7,
       "armor": 749,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 3
    },
    "Breastplate of the Chromatic Flight": {
       "crit": 0,
       "hit": 0,
       "strength": 20,
       "stamina": 30,
       "agility": 10,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 706,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Breastplate of Valor": {
       "crit": 0,
       "hit": 0,
       "strength": 15,
       "stamina": 24,
       "agility": 10,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 657,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Breastplate of Wrath": {
       "crit": 0,
       "hit": 0,
       "strength": 17,
       "stamina": 40,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 11,
       "armor": 857,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Cadaverous Armor": {
       "crit": 0,
       "hit": 0,
       "strength": 8,
       "stamina": 0,
       "agility": 8,
       "attackpower": 60,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 172,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Conqueror's Breastplate": {
       "crit": 0,
       "hit": 0,
       "strength": 34,
       "stamina": 38,
       "agility": 24,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 6,
       "armor": 985,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Deathdealer Breastplate": {
       "crit": 2,
       "hit": 0,
       "strength": 8,
       "stamina": 8,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 338,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dreadnaught Breastplate": {
       "crit": 0,
       "hit": 2,
       "strength": 21,
       "stamina": 43,
       "agility": 0,
       "attackpower": 0,
       "dodge": 1,
       "parry": 0,
       "defense": 13,
       "armor": 1027,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ghoul Skin Tunic": {
       "crit": 2,
       "hit": 0,
       "strength": 40,
       "stamina": 22,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 411,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Malfurion's Blessed Bulwark": {
       "crit": 0,
       "hit": 0,
       "strength": 40,
       "stamina": 22,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 814,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Obsidian Mail Tunic": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 76,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 311,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ogre Forged Hauberk": {
       "crit": 1,
       "hit": 0,
       "strength": 8,
       "stamina": 13,
       "agility": 20,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 365,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Plated Abomination Ribcage": {
       "crit": 1,
       "hit": 1,
       "strength": 45,
       "stamina": 25,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 953,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R13 Plate Armor": {
       "crit": 1,
       "hit": 0,
       "strength": 16,
       "stamina": 33,
       "agility": 14,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 875,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R8 Plate Armor": {
       "crit": 1,
       "hit": 0,
       "strength": 21,
       "stamina": 23,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 706,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Runed Bloodstained Hauberk": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 19,
       "agility": 0,
       "attackpower": 58,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 416,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Savage Gladiator Chain": {
       "crit": 2,
       "hit": 0,
       "strength": 13,
       "stamina": 13,
       "agility": 14,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 369,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Zandalar Vindicator's Breastplate": {
       "crit": 0,
       "hit": 0,
       "strength": 23,
       "stamina": 24,
       "agility": 15,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 4,
       "armor": 828,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Tombstone Breastplate": {
       "crit": 2,
       "hit": 0,
       "strength": 10,
       "stamina": 10,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 174,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Traphook Jerkin": {
       "crit": 0,
       "hit": 0,
       "strength": 5,
       "stamina": 0,
       "agility": 24,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 152,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Vest of Swift Execution": {
       "crit": 0,
       "hit": 0,
       "strength": 21,
       "stamina": 20,
       "agility": 41,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 229,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    }
 }

let shoulders = {
    "Abyssal Plate Epaulets" : {
    strength: 13,
    stamina: 13,
    agility: 13,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 530,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Arathi Plate Spaulders" : {
    strength: 18,
    stamina: 20,
    agility: 17,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 553,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Black Dragonscale Shoulders" : {
    strength: 0,
    stamina: 9,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 40,

    armor: 266,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Bloodsoaked Pauldrons" : {
    strength: 16,
    stamina: 16,
    agility: 11,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 552,
    parry: 0,
    dodge: 0,
    defense: 3,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Conqueror's Spaulders" : {
    strength: 20,
    stamina: 21,
    agility: 16,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 659,
    parry: 0,
    dodge: 0,
    defense: 4,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Drake Talon Pauldrons" : {
    strength: 20,
    stamina: 17,
    agility: 20,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 634,
    parry: 0,
    dodge: 1,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Dreadnaught Pauldrons" : {
    strength: 16,
    stamina: 29,
    agility: 0,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 722,
    parry: 0,
    dodge: 0,
    defense: 9,
    block: 0,
    blockvalue: 21,

    skill: 0,
    skilltype: 'none'
},
    "Pauldrons of Might" : {
    strength: 15,
    stamina: 22,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 562,
    parry: 0,
    dodge: 0,
    defense: 5,
    block: 2,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Pauldrons of the Unrelenting" : {
    strength: 11,
    stamina: 30,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 650,
    parry: 0,
    dodge: 1,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Pauldrons of Wrath" : {
    strength: 13,
    stamina: 27,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 642,
    parry: 0,
    dodge: 0,
    defense: 7,
    block: 0,
    blockvalue: 27,

    skill: 0,
    skilltype: 'none'
},
    "Polished Obsidian Pauldrons" : {
    strength: 16,
    stamina: 17,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 530,
    parry: 0,
    dodge: 0,
    defense: 7,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "R10 Plate Shoulders" : {
    strength: 17,
    stamina: 18,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 0,

    armor: 552,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "R13 Plate Shoulders" : {
    strength: 18,
    stamina: 23,
    agility: 16,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 626,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Razorsteel Shoulders" : {
    strength: 10,
    stamina: 9,
    agility: 10,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 410,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Spaulders of Heroism" : {
    strength: 12,
    stamina: 18,
    agility: 12,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 507,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Spaulders of Valor" : {
    strength: 11,
    stamina: 17,
    agility: 9,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 470,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Truestrike Shoulders" : {
    strength: 0,
    stamina: 0,
    agility: 0,

    hit: 2,
    crit: 0,
    attackpower: 24,

    armor: 129,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Wyrmhide Spaulders" : {
    strength: 0,
    stamina: 0,
    agility: 0,

    hit: 2,
    crit: 0,
    attackpower: 0,

    armor: 113,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
}

let capes = {

    "Blackveil Cape": {
    strength: 6,
    stamina: 0,
    agility: 14,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 38,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cape of the Black Baron": {
    strength: 0,
    stamina: 0,
    agility: 15,

    hit: 0,
    crit: 0,
    attackpower: 20,

    armor: 45,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of Concentrated Hatred": {
    strength: 11,
    stamina: 15,
    agility: 16,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 56,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of Draconic Might": {
    strength: 16,
    stamina: 4,
    agility: 16,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 54,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of Firemaw": {
    strength: 0,
    stamina: 12,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 50,

    armor: 57,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of the Fallen God": {
    strength: 11,
    stamina: 15,
    agility: 26,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 66,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of the Golden Hive": {
    strength: 13,
    stamina: 19,
    agility: 10,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 59,
    parry: 0,
    dodge: 0,
    defense: 6,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of the Honor Guard": {
    strength: 0,
    stamina: 11,
    agility: 5,

    hit: 0,
    crit: 0,
    attackpower: 34,

    armor: 50,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of the Scourge": {
    strength: 0,
    stamina: 23,
    agility: 0,

    hit: 1,
    crit: 0,
    attackpower: 30,

    armor: 63,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Cloak of the Shrouded Mists": {
    strength: 0,
    stamina: 12,
    agility: 22,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 57,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Dragon's Blood Cape": {
    strength: 9,
    stamina: 22,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 116,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Drape of Unyielding Strength": {
    strength: 15,
    stamina: 9,
    agility: 9,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 52,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Earthweave Cloak": {
    strength: 0,
    stamina: 0,
    agility: 15,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 44,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Eskhandar's Pelt": {
    strength: 0,
    stamina: 20,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 0,

    armor: 51,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Onyxia Scale Cloak": {
    strength: 0,
    stamina: 7,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 43,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Phantasmal Cloak": {
    strength: 12,
    stamina: 11,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 114,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Puissant Cape": {
    strength: 0,
    stamina: 12,
    agility: 0,

    hit: 1,
    crit: 0,
    attackpower: 40,

    armor: 54,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Sandstorm Cloak": {
    strength: 12,
    stamina: 12,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 135,
    parry: 0,
    dodge: 1,
    defense: 6,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Shroud of Dominion": {
    strength: 0,
    stamina: 11,
    agility: 0,

    hit: 0,
    crit: 1,
    attackpower: 50,

    armor: 68,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Stoneskin Gargoyle Cape": {
    strength: 7,
    stamina: 14,
    agility: 8,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 43,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Stormpike Soldier's Cloak": {
    strength: 0,
    stamina: 11,
    agility: 0,

    hit: 0,
    crit: 0,
    attackpower: 24,

    armor: 43,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Zulian Tigerhide Cloak": {
    strength: 0,
    stamina: 10,
    agility: 13,

    hit: 1,
    crit: 0,
    attackpower: 0,

    armor: 48,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
    "Windshear Cape": {
    strength: 8,
    stamina: 14,
    agility: 15,

    hit: 0,
    crit: 0,
    attackpower: 0,

    armor: 50,
    parry: 0,
    dodge: 0,
    defense: 0,
    block: 0,
    blockvalue: 0,

    skill: 0,
    skilltype: 'none'
},
}

let wrists = {
    "Abyssal Plate Vambraces": {
       "strength": 11,
       "stamina": 11,
       "agility": 12,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 309,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Battleborn Armbraces": {
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 1,
       "crit": 1,
       "attackpower": 0,
       "armor": 287,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Berserker Bracers": {
       "strength": 19,
       "stamina": 11,
       "agility": 8,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 323,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Blackmist Armguards": {
       "strength": 5,
       "stamina": 13,
       "agility": 0,
       "hit": 1,
       "crit": 0,
       "attackpower": 0,
       "armor": 77,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Bracelets of Wrath": {
       "strength": 13,
       "stamina": 27,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 375,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Bracers of Brutality": {
       "strength": 21,
       "stamina": 9,
       "agility": 12,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 356,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Bracers of Heroism": {
       "strength": 9,
       "stamina": 14,
       "agility": 5,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 296,
       "parry": 0,
       "dodge": 0,
       "defense": 3,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Bracers of Might": {
       "strength": 11,
       "stamina": 23,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 328,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Bracers of Valor": {
       "strength": 7,
       "stamina": 14,
       "agility": 3,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 261,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Deepfury Bracers": {
       "strength": 4,
       "stamina": 4,
       "agility": 15,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 69,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Deeprock Bracers": {
       "strength": 19,
       "stamina": 8,
       "agility": 10,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 309,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Dreadnaught Bracers": {
       "strength": 14,
       "stamina": 28,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 431,
       "parry": 0,
       "dodge": 0,
       "defense": 5,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Gordok Bracers of Power": {
       "strength": 17,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 287,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Hive Defiler Wristguards": {
       "strength": 23,
       "stamina": 0,
       "agility": 18,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 384,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Qiraji Execution Bracers": {
       "strength": 15,
       "stamina": 14,
       "agility": 16,
       "hit": 1,
       "crit": 0,
       "attackpower": 0,
       "armor": 103,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Scaled Bracers of the Gorger": {
       "strength": 10,
       "stamina": 8,
       "agility": 15,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 87,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Slashclaw Bracers": {
       "strength": 0,
       "stamina": 7,
       "agility": 7,
       "hit": 1,
       "crit": 0,
       "attackpower": 0,
       "armor": 155,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Zandalar Vindicator's Armguards": {
       "strength": 13,
       "stamina": 13,
       "agility": 13,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 304,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Vambraces of the Sadist": {
       "strength": 6,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 270,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Wristguards of Stability": {
       "strength": 24,
       "stamina": 8,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 86,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Wristguards of True Flight": {
       "strength": 0,
       "stamina": 11,
       "agility": 19,
       "hit": 1,
       "crit": 0,
       "attackpower": 0,
       "armor": 198,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    },
    "Wristguards of Vengeance": {
       "strength": 24,
       "stamina": 10,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 407,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "block": 0,
       "blockvalue": 0,
       "skill": 0,
       "skilltype": 0
    }
}

let hands = {
    "Aged Core Leather Gloves": {
       "crit": 1,
       "hit": 0,
       "strength": 15,
       "stamina": 15,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 130,
       "skill": 5,
       "skilltype": ["Daggers"],
       "blockvalue": 0,
       "block": 0
    },
    "Devilsaur Gauntlets": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "attackpower": 28,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 103,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dreadnaught Gauntlets": {
       "crit": 0,
       "hit": 0,
       "strength": 17,
       "stamina": 27,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 9,
       "armor": 615,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 21,
       "block": 3
    },
    "Edgemaster's Handguards": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 201,
       "skill": 7,
       "skilltype": ["Daggers", "Swords", "Axes"],
       "blockvalue": 0,
       "block": 0
    },
    "Flameguard Gauntlets": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 13,
       "agility": 0,
       "attackpower": 54,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 488,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gargoyle Slashers": {
       "crit": 1,
       "hit": 0,
       "strength": 10,
       "stamina": 12,
       "agility": 5,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 107,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gauntlets of Annihilation": {
       "crit": 1,
       "hit": 1,
       "strength": 35,
       "stamina": 15,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 615,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gauntlets of Heroism": {
       "crit": 1,
       "hit": 0,
       "strength": 18,
       "stamina": 12,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 393,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gauntlets of Might": {
       "crit": 0,
       "hit": 1,
       "strength": 22,
       "stamina": 17,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 5,
       "armor": 468,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gauntlets of Steadfast Determination": {
       "crit": 0,
       "hit": 0,
       "strength": 19,
       "stamina": 20,
       "agility": 18,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 9,
       "armor": 535,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gauntlets of the Immovable": {
       "crit": 0,
       "hit": 0,
       "strength": 15,
       "stamina": 18,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 1,
       "defense": 5,
       "armor": 482,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gauntlets of Valor": {
       "crit": 0,
       "hit": 0,
       "strength": 17,
       "stamina": 10,
       "agility": 3,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 386,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gauntlets of Wrath": {
       "crit": 0,
       "hit": 0,
       "strength": 15,
       "stamina": 20,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 1,
       "defense": 7,
       "armor": 535,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gloves of Enforcement": {
       "crit": 0,
       "hit": 1,
       "strength": 28,
       "stamina": 6,
       "agility": 20,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 140,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R12 Gauntlets": {
       "crit": 1,
       "hit": 0,
       "strength": 20,
       "stamina": 23,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 532,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R7 Gauntlets": {
       "crit": 0,
       "hit": 0,
       "strength": 17,
       "stamina": 17,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 429,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Reiver Claws": {
       "crit": 1,
       "hit": 0,
       "strength": 9,
       "stamina": 15,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 398,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sacrificial Gauntlets": {
       "crit": 1,
       "hit": 1,
       "strength": 19,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 441,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Stronghold Gauntlets": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 12,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 1,
       "defense": 0,
       "armor": 441,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Voone's Vice Grips": {
       "crit": 0,
       "hit": 2,
       "strength": 0,
       "stamina": 6,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 221,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    }
}

let waists = {
    "Arathi Plate Girdle": {
       "crit": 1,
       "hit": 0,
       "strength": 17,
       "stamina": 10,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 369,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Belt of Heroism": {
       "crit": 0,
       "hit": 0,
       "strength": 15,
       "stamina": 12,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 7,
       "armor": 380,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Belt of Might": {
       "crit": 0,
       "hit": 0,
       "strength": 21,
       "stamina": 15,
       "agility": 0,
       "attackpower": 0,
       "dodge": 1,
       "parry": 0,
       "defense": 5,
       "armor": 412,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Belt of Never-ending Agony": {
       "crit": 1,
       "hit": 1,
       "strength": 0,
       "stamina": 20,
       "agility": 0,
       "attackpower": 64,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 142,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Belt of Preserved Heads": {
       "crit": 0,
       "hit": 1,
       "strength": 14,
       "stamina": 11,
       "agility": 15,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 108,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Belt of Shrunken Heads": {
       "crit": 0,
       "hit": 0,
       "strength": 23,
       "stamina": 11,
       "agility": 7,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 408,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Belt of the Sand Reaver": {
       "crit": 0,
       "hit": 0,
       "strength": 17,
       "stamina": 18,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 5,
       "armor": 494,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Belt of Valor": {
       "crit": 0,
       "hit": 0,
       "strength": 14,
       "stamina": 8,
       "agility": 7,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 341,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Brigam Girdle": {
       "crit": 0,
       "hit": 1,
       "strength": 15,
       "stamina": 16,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 369,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Cloudrunner Girdle": {
       "crit": 0,
       "hit": 0,
       "strength": 14,
       "stamina": 0,
       "agility": 15,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 185,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dreadnaught Waistguard": {
       "crit": 0,
       "hit": 0,
       "strength": 20,
       "stamina": 26,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 9,
       "armor": 554,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 18,
       "block": 3
    },
    "Girdle of the Mentor": {
       "crit": 1,
       "hit": 1,
       "strength": 21,
       "stamina": 21,
       "agility": 20,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 536,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Mugger's Belt": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 16,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 98,
       "skill": 5,
       "skilltype": ["Daggers"],
       "blockvalue": 0,
       "block": 0
    },
    "Omokk's Girth Restrainer": {
       "crit": 1,
       "hit": 0,
       "strength": 15,
       "stamina": 9,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 353,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Onslaught Girdle": {
       "crit": 1,
       "hit": 1,
       "strength": 31,
       "stamina": 11,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 494,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ossirian's Binding": {
       "crit": 1,
       "hit": 1,
       "strength": 0,
       "stamina": 19,
       "agility": 20,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 258,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Royal Qiraji Belt": {
       "crit": 0,
       "hit": 0,
       "strength": 13,
       "stamina": 22,
       "agility": 13,
       "attackpower": 0,
       "dodge": 0,
       "parry": 1,
       "defense": 8,
       "armor": 512,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Zandalar Vindicator's Belt": {
       "crit": 1,
       "hit": 0,
       "strength": 25,
       "stamina": 10,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 391,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Therazane's Link": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 22,
       "agility": 0,
       "attackpower": 44,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 295,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Triad Girdle": {
       "crit": 0,
       "hit": 0,
       "strength": 26,
       "stamina": 17,
       "agility": 19,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 476,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Waistband of Wrath": {
       "crit": 0,
       "hit": 0,
       "strength": 20,
       "stamina": 20,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 7,
       "armor": 482,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 3
    }
}

let legs = {
    "Abyssal Plate Legplates": {
       "crit": 1,
       "hit": 0,
       "strength": 15,
       "stamina": 15,
       "agility": 15,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 566,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Black Dragonscale Leggings": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 8,
       "agility": 0,
       "attackpower": 54,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 320,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blademaster Leggings": {
       "crit": 1,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 5,
       "attackpower": 0,
       "dodge": 2,
       "parry": 0,
       "defense": 0,
       "armor": 154,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bloodsoaked Legplates": {
       "crit": 0,
       "hit": 0,
       "strength": 36,
       "stamina": 21,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 10,
       "armor": 674,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Cadaverous Leggings": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 18,
       "agility": 0,
       "attackpower": 52,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 150,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Cloudkeeper Legplates": {
       "crit": 0,
       "hit": 0,
       "strength": 20,
       "stamina": 20,
       "agility": 20,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 617,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Conqueror's Legguards": {
       "crit": 0,
       "hit": 1,
       "strength": 33,
       "stamina": 24,
       "agility": 21,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 6,
       "armor": 796,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dark Heart Pants": {
       "crit": 2,
       "hit": 0,
       "strength": 0,
       "stamina": 20,
       "agility": 0,
       "attackpower": 48,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 296,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Devilsaur Leggings": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 12,
       "agility": 0,
       "attackpower": 46,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 148,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dreadnaught Legplates": {
       "crit": 0,
       "hit": 0,
       "strength": 23,
       "stamina": 37,
       "agility": 0,
       "attackpower": 0,
       "dodge": 1,
       "parry": 0,
       "defense": 13,
       "armor": 861,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 32,
       "block": 0
    },
    "Eldritch Reinforced Legplates": {
       "crit": 1,
       "hit": 0,
       "strength": 15,
       "stamina": 20,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 566,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Handcrafted Mastersmith Leggings": {
       "crit": 0,
       "hit": 0,
       "strength": 29,
       "stamina": 12,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 548,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Leggings of the Apocalypse": {
       "crit": 2,
       "hit": 0,
       "strength": 15,
       "stamina": 23,
       "agility": 31,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 211,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Leggings of the Ursa": {
       "crit": 1,
       "hit": 0,
       "strength": 17,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 459,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Legguards of the Fallen Crusader": {
       "crit": 0,
       "hit": 0,
       "strength": 28,
       "stamina": 22,
       "agility": 22,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 740,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Legplates of Carnage": {
       "crit": 2,
       "hit": 0,
       "strength": 42,
       "stamina": 18,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 815,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Legplates of Heroism": {
       "crit": 0,
       "hit": 0,
       "strength": 25,
       "stamina": 16,
       "agility": 11,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 5,
       "armor": 601,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Legplates of Might": {
       "crit": 0,
       "hit": 0,
       "strength": 24,
       "stamina": 23,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 1,
       "defense": 7,
       "armor": 655,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Legplates of the Qiraji Command": {
       "crit": 2,
       "hit": 0,
       "strength": 20,
       "stamina": 13,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 644,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Legplates of Valor": {
       "crit": 0,
       "hit": 0,
       "strength": 23,
       "stamina": 15,
       "agility": 11,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 557,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Legplates of Wrath": {
       "crit": 0,
       "hit": 0,
       "strength": 19,
       "stamina": 27,
       "agility": 0,
       "attackpower": 0,
       "dodge": 2,
       "parry": 0,
       "defense": 11,
       "armor": 749,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R12 Plate Legguards": {
       "crit": 2,
       "hit": 1,
       "strength": 20,
       "stamina": 28,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 743,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R8 Plate Leggings": {
       "crit": 2,
       "hit": 0,
       "strength": 12,
       "stamina": 17,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 618,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Scaled Sand Reaver Leggings": {
       "crit": 2,
       "hit": 0,
       "strength": 0,
       "stamina": 23,
       "agility": 0,
       "attackpower": 62,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 427,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sentinel's Plate Legguards": {
       "crit": 1,
       "hit": 1,
       "strength": 28,
       "stamina": 27,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 646,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Titanic Leggings": {
       "crit": 1,
       "hit": 2,
       "strength": 30,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 598,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    }
}

let feet = {
    "Arathi Plate Greaves": {
       "crit": 0,
       "hit": 0,
       "strength": 14,
       "stamina": 12,
       "agility": 12,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 452,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Battlechaser's Greaves": {
       "crit": 0,
       "hit": 0,
       "strength": 14,
       "stamina": 8,
       "agility": 13,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 397,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Black Dragonscale Boots": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 10,
       "agility": 0,
       "attackpower": 28,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 270,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blooddrenched Footpads": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 10,
       "agility": 21,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 129,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bloodmail Boots": {
       "crit": 0,
       "hit": 1,
       "strength": 9,
       "stamina": 10,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 247,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Boots of Heroism": {
       "crit": 0,
       "hit": 1,
       "strength": 20,
       "stamina": 20,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 470,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Boots of the Fallen Hero": {
       "crit": 0,
       "hit": 1,
       "strength": 20,
       "stamina": 22,
       "agility": 14,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 581,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Boots of the Shadow Flame": {
       "crit": 0,
       "hit": 2,
       "strength": 0,
       "stamina": 22,
       "agility": 0,
       "attackpower": 44,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 286,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Boots of the Vanguard": {
       "crit": 0,
       "hit": 0,
       "strength": 22,
       "stamina": 11,
       "agility": 22,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 138,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Boots of Unwavering Will": {
       "crit": 0,
       "hit": 0,
       "strength": 12,
       "stamina": 29,
       "agility": 8,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 5,
       "armor": 647,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Boots of Valor": {
       "crit": 0,
       "hit": 0,
       "strength": 8,
       "stamina": 20,
       "agility": 4,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 424,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Chromatic Boots": {
       "crit": 0,
       "hit": 1,
       "strength": 20,
       "stamina": 19,
       "agility": 20,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 596,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Conqueror's Greaves": {
       "crit": 0,
       "hit": 0,
       "strength": 21,
       "stamina": 23,
       "agility": 17,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 4,
       "armor": 604,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dreadnaught Sabatons": {
       "crit": 0,
       "hit": 0,
       "strength": 15,
       "stamina": 34,
       "agility": 0,
       "attackpower": 0,
       "dodge": 1,
       "parry": 0,
       "defense": 9,
       "armor": 662,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Pads of the Dread Wolf": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 14,
       "agility": 0,
       "attackpower": 40,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 116,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R12 Plate Boots": {
       "crit": 0,
       "hit": 1,
       "strength": 18,
       "stamina": 24,
       "agility": 12,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 592,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R7 Plate Boots": {
       "crit": 0,
       "hit": 0,
       "strength": 10,
       "stamina": 23,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 472,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sabatons of Might": {
       "crit": 0,
       "hit": 0,
       "strength": 15,
       "stamina": 26,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 5,
       "armor": 515,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sabatons of Wrath": {
       "crit": 0,
       "hit": 0,
       "strength": 13,
       "stamina": 30,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 7,
       "armor": 589,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 14,
       "block": 0
    },
    "Sapphiron's Scale Boots": {
       "crit": 0,
       "hit": 0,
       "strength": 14,
       "stamina": 14,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 417,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Savage Gladiator Greaves": {
       "crit": 0,
       "hit": 0,
       "strength": 10,
       "stamina": 13,
       "agility": 15,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 233,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Slime Kickers": {
       "crit": 0,
       "hit": 1,
       "strength": 18,
       "stamina": 12,
       "agility": 12,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 519,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Swiftwalker Boots": {
       "crit": 0,
       "hit": 0,
       "strength": 4,
       "stamina": 7,
       "agility": 21,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 115,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Windreaver Greaves": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 20,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 247,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    }
}

let rings = {
    "Archimtiros' Ring of Reckoning": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 28,
       "agility": 14,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Band of Accuria": {
       "crit": 0,
       "hit": 2,
       "strength": 0,
       "stamina": 10,
       "agility": 16,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Band of Earthen Might": {
       "crit": 1,
       "hit": 1,
       "strength": 6,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Band of Jin": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 8,
       "agility": 14,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Band of Reanimation": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 22,
       "agility": 23,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Band of the Ogre King": {
       "crit": 0,
       "hit": 0,
       "strength": 14,
       "stamina": 13,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Band of the Penitent": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Band of Unnatural Forces": {
       "crit": 1,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 52,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blackstone Ring": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 6,
       "agility": 0,
       "attackpower": 20,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Circle of Applied Force": {
       "crit": 0,
       "hit": 0,
       "strength": 12,
       "stamina": 9,
       "agility": 22,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Don Julio's Band": {
       "crit": 1,
       "hit": 1,
       "strength": 0,
       "stamina": 11,
       "agility": 0,
       "attackpower": 16,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Magni's Will": {
       "crit": 1,
       "hit": 0,
       "strength": 6,
       "stamina": 7,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Master Dragonslayer's Ring": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 14,
       "agility": 0,
       "attackpower": 48,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Might of Cenarius": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 8,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Naglering": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 10,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 5,
       "armor": 50,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Painweaver Band": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "attackpower": 16,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Protector's Band": {
       "crit": 0,
       "hit": 0,
       "strength": 12,
       "stamina": 8,
       "agility": 11,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Quick Strike Ring": {
       "crit": 1,
       "hit": 0,
       "strength": 5,
       "stamina": 8,
       "agility": 0,
       "attackpower": 30,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ring of Emperor Vek'lor": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 18,
       "agility": 12,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 9,
       "armor": 100,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ring of Fury": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "attackpower": 30,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ring of the Dreadnaught": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 27,
       "agility": 0,
       "attackpower": 0,
       "dodge": 1,
       "parry": 0,
       "defense": 10,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ring of the Godslayer": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 17,
       "agility": 27,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ring of the Qiraji Fury": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 12,
       "agility": 0,
       "attackpower": 40,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Seal of Jin": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 8,
       "agility": 0,
       "attackpower": 20,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Seal of the Gurubashi Berserker": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 13,
       "agility": 0,
       "attackpower": 40,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Signet of the Fallen Defender": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 24,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 140,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Signet of Unyielding Strength": {
       "crit": 1,
       "hit": 0,
       "strength": 11,
       "stamina": 14,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Signet Ring of the Bronze Dragonflight": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 13,
       "agility": 24,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Tarnished Elven Ring": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 15,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    }
}

let trinkets = {
    "Badge of the Swarmguard": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blackhand's Breadth": {
       "crit": 2,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Counterattack Lodestone": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 22,
       "dodge": 0,
       "parry": 1,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Darkmoon Card: Maelstrom": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Diamond Flask": {
       "crit": 0,
       "hit": 0,
       "strength": 75,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Drake Fang Talisman": {
       "crit": 0,
       "hit": 2,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 56,
       "dodge": 1,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Earthstrike": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Hand of Justice": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 20,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Heart of Wyrmthalak": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Jom Gabbar": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Kiss of the Spider": {
       "crit": 1,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Rune of the Guard Captain": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 20,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Seal of the Dawn": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 81,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Slayer's Crest": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 64,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "blockvalue": 0,
       "block": 0
    }
}

let rangedweps = {
    "Ancient Bone Bow": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 11,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blackcrow": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 3,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blastershot Launcher": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 6,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bloodseeker": {
       "crit": 0,
       "hit": 0,
       "strength": 8,
       "stamina": 0,
       "agility": 7,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bow of Taut Sinew": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 22,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Burstshot Harquebus": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 8,
       "agility": 0,
       "attackpower": 10,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Carapace Spine Crossbow": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 9,
       "agility": 4,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Crossbow of Imminent Doom": {
       "crit": 0,
       "hit": 1,
       "strength": 5,
       "stamina": 5,
       "agility": 7,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Crystal Slugthrower": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 4,
       "agility": 0,
       "attackpower": 20,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Custom Item": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dragonbreath Hand Cannon": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 7,
       "agility": 14,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Fahrad's Reloading Repeater": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 4,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gorewood Bow": {
       "crit": 0,
       "hit": 0,
       "strength": 2,
       "stamina": 9,
       "agility": 3,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gurubashi Dwarf Destroyer": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 30,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Guttbuster": {
       "crit": 0,
       "hit": 0,
       "strength": 3,
       "stamina": 0,
       "agility": 8,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Heartseeking Crossbow": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 4,
       "agility": 9,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Heartstriker": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "attackpower": 24,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Hoodoo Hunting Bow": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 4,
       "agility": 10,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Huhuran's Stinger": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 18,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Larvae of the Great Worm": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 18,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Malgen's Long Bow": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 4,
       "agility": 0,
       "attackpower": 20,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Mandokir's Sting": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 8,
       "agility": 11,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Nerubian Slavemaker": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 24,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "None": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Outrunner's Bow": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 10,
       "agility": 4,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Polished Ironwood Crossbow": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 5,
       "agility": 0,
       "attackpower": 24,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Riphook": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 22,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Satyr's Bow": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 3,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Silithid Husked Launcher": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 10,
       "agility": 4,
       "attackpower": 0,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Skull Splitting Crossbow": {
       "crit": 0,
       "hit": 0,
       "strength": 3,
       "stamina": 0,
       "agility": 0,
       "attackpower": 14,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Soulstring": {
       "crit": 1,
       "hit": 0,
       "strength": 0,
       "stamina": 6,
       "agility": 0,
       "attackpower": 16,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Striker's Mark": {
       "crit": 0,
       "hit": 1,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "attackpower": 22,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Toxin Injector": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 10,
       "agility": 0,
       "attackpower": 28,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Willey's Portable Howitzer": {
       "crit": 0,
       "hit": 0,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "attackpower": 8,
       "dodge": 0,
       "parry": 0,
       "defense": 0,
       "armor": 0,
       "skill": 0,
       "skilltype": 0,
       "blockvalue": 0,
       "block": 0
    }
 }

let weapons = {
    "Ancient Hakkari Manslayer": {
       "min": 69,
       "max": 130,
       "swingtimer": 2,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Annihilator": {
       "min": 49,
       "max": 92,
       "swingtimer": 1.7,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Axe of the Deep Woods": {
       "min": 78,
       "max": 146,
       "swingtimer": 2.7,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blessed Qiraji War Axe": {
       "min": 110,
       "max": 205,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 14,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bone Slicing Hatchet": {
       "min": 48,
       "max": 90,
       "swingtimer": 1.7,
       "strength": 0,
       "stamina": 5,
       "agility": 13,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Crul'Shorukh, Edge of Chaos": {
       "min": 101,
       "max": 188,
       "swingtimer": 2.3,
       "strength": 0,
       "stamina": 13,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 36,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dark Iron Destroyer": {
       "min": 71,
       "max": 134,
       "swingtimer": 2.4,
       "strength": 10,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Deathbringer": {
       "min": 114,
       "max": 213,
       "swingtimer": 2.9,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Doom's Edge": {
       "min": 83,
       "max": 154,
       "swingtimer": 2.3,
       "strength": 9,
       "stamina": 7,
       "agility": 16,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Flurry Axe": {
       "min": 37,
       "max": 69,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Frostbite": {
       "min": 80,
       "max": 150,
       "swingtimer": 2.7,
       "strength": 15,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Hatchet of Sundered Bone": {
       "min": 119,
       "max": 221,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 36,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Iceblade Hacker": {
       "min": 58,
       "max": 111,
       "swingtimer": 2,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R14 Axe": {
       "min": 138,
       "max": 207,
       "swingtimer": 2.9,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Rivenspike": {
       "min": 77,
       "max": 144,
       "swingtimer": 2.9,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Serathil": {
       "min": 53,
       "max": 99,
       "swingtimer": 1.9,
       "strength": 9,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 100,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sickle of Unyielding Strength": {
       "min": 75,
       "max": 141,
       "swingtimer": 2.1,
       "strength": 15,
       "stamina": 9,
       "agility": 6,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 4,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Soulrender": {
       "min": 71,
       "max": 133,
       "swingtimer": 2.5,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Zulian Hacker of Strength": {
       "min": 71,
       "max": 134,
       "swingtimer": 2.4,
       "strength": 12,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 2,
       "skilltype": ["Axes"],
       "blockvalue": 0,
       "block": 0
    },
    "Zulian Hacker of the Tiger": {
       "min": 71,
       "max": 134,
       "swingtimer": 2.4,
       "strength": 8,
       "stamina": 0,
       "agility": 8,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 2,
       "skilltype": ["Axes"],
       "blockvalue": 0,
       "block": 0
    },
    "Alcor's Sunrazor": {
       "min": 41,
       "max": 77,
       "swingtimer": 1.3,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Black Amnesty": {
       "min": 53,
       "max": 100,
       "swingtimer": 1.6,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blessed Qiraji Pugio": {
       "min": 72,
       "max": 134,
       "swingtimer": 1.7,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 1,
       "crit": 1,
       "attackpower": 18,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bonescraper": {
       "min": 40,
       "max": 74,
       "swingtimer": 1.4,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 30,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Core Hound Tooth": {
       "min": 57,
       "max": 107,
       "swingtimer": 1.6,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 20,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Darrowspike": {
       "min": 43,
       "max": 81,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Death's Sting": {
       "min": 95,
       "max": 144,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 10,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 38,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 3,
       "skilltype": ["Daggers"],
       "blockvalue": 0,
       "block": 0
    },
    "Distracting Dagger": {
       "min": 42,
       "max": 64,
       "swingtimer": 1.3,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 6,
       "skilltype": ["Daggers"],
       "blockvalue": 0,
       "block": 0
    },
    "Dragonfang Blade": {
       "min": 69,
       "max": 130,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 13,
       "agility": 16,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Emerald Dragonfang": {
       "min": 66,
       "max": 123,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 0,
       "agility": 12,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Fang of the Faceless": {
       "min": 66,
       "max": 123,
       "swingtimer": 1.9,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Felstriker": {
       "min": 54,
       "max": 101,
       "swingtimer": 1.7,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Finkle's Skinner": {
       "min": 37,
       "max": 70,
       "swingtimer": 1.3,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Glacial Blade": {
       "min": 53,
       "max": 100,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 0,
       "agility": 10,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gutgore Ripper": {
       "min": 63,
       "max": 119,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Harbinger of Doom": {
       "min": 83,
       "max": 126,
       "swingtimer": 1.6,
       "strength": 0,
       "stamina": 8,
       "agility": 8,
       "hit": 1,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Heartseeker": {
       "min": 49,
       "max": 92,
       "swingtimer": 1.7,
       "strength": 4,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R14 Dagger": {
       "min": 95,
       "max": 143,
       "swingtimer": 2,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Kingsfall": {
       "min": 105,
       "max": 158,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 0,
       "agility": 16,
       "hit": 1,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Maexxna's Fang": {
       "min": 94,
       "max": 141,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 8,
       "agility": 0,
       "hit": 1,
       "crit": 0,
       "attackpower": 36,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Perdition's Blade": {
       "min": 73,
       "max": 137,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Qiraji Sacrificial Dagger": {
       "min": 64,
       "max": 119,
       "swingtimer": 1.9,
       "strength": 0,
       "stamina": 15,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 20,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Scarlet Kris": {
       "min": 43,
       "max": 81,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 10,
       "agility": 10,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Scout's Blade": {
       "min": 49,
       "max": 92,
       "swingtimer": 1.7,
       "strength": 0,
       "stamina": 5,
       "agility": 13,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Shadowsong's Sorrow": {
       "min": 68,
       "max": 127,
       "swingtimer": 1.7,
       "strength": 9,
       "stamina": 14,
       "agility": 13,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "The Lobotomizer": {
       "min": 59,
       "max": 111,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "The Thunderwood Poker": {
       "min": 53,
       "max": 100,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 6,
       "agility": 13,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Arlokk's Grasp": {
       "min": 41,
       "max": 84,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Claw of the Black Drake": {
       "min": 102,
       "max": 191,
       "swingtimer": 2.6,
       "strength": 13,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Claw of the Frost Wyrm": {
       "min": 75,
       "max": 140,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 8,
       "agility": 0,
       "hit": 1,
       "crit": 1,
       "attackpower": 22,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Eskhandar's Left Claw": {
       "min": 50,
       "max": 94,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 0,
       "agility": 4,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Eskhandar's Right Claw": {
       "min": 50,
       "max": 94,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 0,
       "agility": 4,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R14 Claw": {
       "min": 138,
       "max": 207,
       "swingtimer": 2.9,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Lefty's Brass Knuckle": {
       "min": 42,
       "max": 78,
       "swingtimer": 1.5,
       "strength": 5,
       "stamina": 0,
       "agility": 12,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Silithid Claw": {
       "min": 64,
       "max": 120,
       "swingtimer": 1.6,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 30,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Thekal's Grasp": {
       "min": 72,
       "max": 135,
       "swingtimer": 2.2,
       "strength": 0,
       "stamina": 13,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Willey's Back Scratcher": {
       "min": 73,
       "max": 136,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 12,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 10,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Anubisath Warhammer": {
       "min": 66,
       "max": 123,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 32,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 4,
       "skilltype": ["Maces"],
       "blockvalue": 0,
       "block": 0
    },
    "Blessed Qiraji War Hammer": {
       "min": 89,
       "max": 166,
       "swingtimer": 2.1,
       "strength": 10,
       "stamina": 12,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 70,
       "parry": 0,
       "dodge": 0,
       "defense": 8,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ebon Hand": {
       "min": 83,
       "max": 154,
       "swingtimer": 2.3,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Empyrean Demolisher": {
       "min": 94,
       "max": 175,
       "swingtimer": 2.8,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ironfoe": {
       "min": 73,
       "max": 136,
       "swingtimer": 2.4,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Hammer of Bestial Fury": {
       "min": 69,
       "max": 130,
       "swingtimer": 1.9,
       "strength": 13,
       "stamina": 12,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 90,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R14 Hammer": {
       "min": 138,
       "max": 207,
       "swingtimer": 2.9,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Mass of McGowan": {
       "min": 80,
       "max": 149,
       "swingtimer": 2.8,
       "strength": 10,
       "stamina": 10,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Misplaced Servo Arm": {
       "min": 128,
       "max": 238,
       "swingtimer": 2.8,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Persuader": {
       "min": 86,
       "max": 161,
       "swingtimer": 2.7,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 1,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sand Polished Hammer": {
       "min": 97,
       "max": 181,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 20,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sceptre of Smiting": {
       "min": 77,
       "max": 145,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 2,
       "skilltype": ["Maces"],
       "blockvalue": 0,
       "block": 0
    },
    "Spineshatter": {
       "min": 99,
       "max": 184,
       "swingtimer": 2.6,
       "strength": 9,
       "stamina": 16,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 5,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Stormstrike Hammer": {
       "min": 80,
       "max": 150,
       "swingtimer": 2.7,
       "strength": 15,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "The Castigator": {
       "min": 119,
       "max": 221,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "hit": 1,
       "crit": 1,
       "attackpower": 16,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Timeworn Mace": {
       "min": 62,
       "max": 117,
       "swingtimer": 2.2,
       "strength": 7,
       "stamina": 11,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 120,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ancient Qiraji Ripper": {
       "min": 114,
       "max": 214,
       "swingtimer": 2.8,
       "strength": 0,
       "stamina": 11,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 20,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Blackguard": {
       "min": 65,
       "max": 121,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 1,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Bloodlord's Defender": {
       "min": 64,
       "max": 119,
       "swingtimer": 1.9,
       "strength": 0,
       "stamina": 15,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 80,
       "parry": 0,
       "dodge": 0,
       "defense": 4,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Brutality Blade": {
       "min": 90,
       "max": 168,
       "swingtimer": 2.5,
       "strength": 9,
       "stamina": 0,
       "agility": 9,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Cho'Rush's Blade": {
       "min": 67,
       "max": 125,
       "swingtimer": 2.4,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Chromatically Tempered Sword": {
       "min": 106,
       "max": 198,
       "swingtimer": 2.6,
       "strength": 14,
       "stamina": 7,
       "agility": 14,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Cold Forged Blade": {
       "min": 75,
       "max": 140,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 13,
       "agility": 5,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dal'Rend's Sacred Charge": {
       "min": 81,
       "max": 151,
       "swingtimer": 2.8,
       "strength": 4,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dal'Rend's Tribal Guardian": {
       "min": 52,
       "max": 97,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 100,
       "parry": 0,
       "dodge": 0,
       "defense": 7,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Dark Iron Reaver": {
       "min": 71,
       "max": 134,
       "swingtimer": 2.4,
       "strength": 0,
       "stamina": 10,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Fiery Retributor": {
       "min": 56,
       "max": 105,
       "swingtimer": 1.8,
       "strength": 7,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 60,
       "parry": 0,
       "dodge": 0,
       "defense": 5,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Gressil, Dawn of Ruin": {
       "min": 138,
       "max": 257,
       "swingtimer": 2.7,
       "strength": 0,
       "stamina": 15,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 40,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Iblis, Blade of the Fallen Seraph (Naxx)": {
       "min": 70,
       "max": 131,
       "swingtimer": 1.6,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 1,
       "crit": 1,
       "attackpower": 26,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Krol Blade": {
       "min": 80,
       "max": 149,
       "swingtimer": 2.8,
       "strength": 7,
       "stamina": 5,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Lord General's Sword": {
       "min": 67,
       "max": 125,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": "Err:502",
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Maladath": {
       "min": 86,
       "max": 162,
       "swingtimer": 2.2,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 1,
       "dodge": 0,
       "defense": 0,
       "skill": 4,
       "skilltype": ["Swords"],
       "blockvalue": 0,
       "block": 0
    },
    "Mirah's song": {
       "min": 57,
       "max": 87,
       "swingtimer": 1.8,
       "strength": 9,
       "stamina": 0,
       "agility": 9,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Nightmare Blade": {
       "min": 99,
       "max": 185,
       "swingtimer": 2.7,
       "strength": 0,
       "stamina": 9,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 32,
       "armor": 70,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Quel'Serrar": {
       "min": 84,
       "max": 126,
       "swingtimer": 2,
       "strength": 0,
       "stamina": 12,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R14 Longsword": {
       "min": 138,
       "max": 207,
       "swingtimer": 2.9,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "R14 Swift Blade": {
       "min": 85,
       "max": 129,
       "swingtimer": 1.8,
       "strength": 0,
       "stamina": 7,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ravencrest's Legacy": {
       "min": 84,
       "max": 157,
       "swingtimer": 2.1,
       "strength": 13,
       "stamina": 14,
       "agility": 9,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Ravenholdt Slicer": {
       "min": 83,
       "max": 156,
       "swingtimer": 2.8,
       "strength": 0,
       "stamina": 6,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 26,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Skullforge Reaver": {
       "min": 72,
       "max": 135,
       "swingtimer": 2.5,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Sword of Zeal": {
       "min": 81,
       "max": 151,
       "swingtimer": 2.8,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Zulian Slicer": {
       "min": 78,
       "max": 146,
       "swingtimer": 2.5,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 12,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Teebu's Blazing Longsword": {
       "min": 96,
       "max": 178,
       "swingtimer": 2.9,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "The Hungering Cold": {
       "min": 76,
       "max": 143,
       "swingtimer": 1.5,
       "strength": 0,
       "stamina": 14,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 140,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 6,
       "skilltype": ["Swords"],
       "blockvalue": 0,
       "block": 0
    },
    "Thrash Blade": {
       "min": 66,
       "max": 124,
       "swingtimer": 2.7,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Thunderfury": {
       "min": 60,
       "max": 145,
       "swingtimer": 1.9,
       "strength": 0,
       "stamina": 8,
       "agility": 5,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Warblade of the Hakkari(MH)": {
       "min": 59,
       "max": 110,
       "swingtimer": 1.7,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 1,
       "attackpower": 28,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Warblade of the Hakkari(OH)": {
       "min": 57,
       "max": 106,
       "swingtimer": 1.7,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 40,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Widow's Remorse": {
       "min": 70,
       "max": 131,
       "swingtimer": 1.6,
       "strength": 0,
       "stamina": 17,
       "agility": 0,
       "hit": 1,
       "crit": 0,
       "attackpower": 0,
       "armor": 100,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "Vis'kag the Bloodletter": {
       "min": 100,
       "max": 187,
       "swingtimer": 2.6,
       "strength": 0,
       "stamina": 0,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    },
    "WSG Sword": {
       "min": 78,
       "max": 146,
       "swingtimer": 2.7,
       "strength": 13,
       "stamina": 5,
       "agility": 0,
       "hit": 0,
       "crit": 0,
       "attackpower": 0,
       "armor": 0,
       "parry": 0,
       "dodge": 0,
       "defense": 0,
       "skill": 0,
       "blockvalue": 0,
       "block": 0
    }
}

let weaponlists = {
    "Axes": `<option value="Ancient Hakkari Manslayer">Ancient Hakkari Manslayer</option>
    <option value="Annihilator">Annihilator</option>
    <option value="Axe of the Deep Woods">Axe of the Deep Woods</option>
    <option value="Blessed Qiraji War Axe">Blessed Qiraji War Axe</option>
    <option value="Bone Slicing Hatchet">Bone Slicing Hatchet</option>
    <option value="Crul'Shorukh, Edge of Chaos">Crul'Shorukh, Edge of Chaos</option>
    <option value="Dark Iron Destroyer">Dark Iron Destroyer</option>
    <option value="Deathbringer">Deathbringer</option>
    <option value="Doom's Edge">Doom's Edge</option>
    <option value="Flurry Axe">Flurry Axe</option>
    <option value="Frostbite">Frostbite</option>
    <option value="Hatchet of Sundered Bone">Hatchet of Sundered Bone</option>
    <option value="Iceblade Hacker">Iceblade Hacker</option>
    <option value="R14 Axe">R14 Axe</option>
    <option value="Rivenspike">Rivenspike</option>
    <option value="Serathil">Serathil</option>
    <option value="Sickle of Unyielding Strength">Sickle of Unyielding Strength</option>
    <option value="Soulrender">Soulrender</option>
    <option value="Zulian Hacker of Strength">Zulian Hacker of Strength</option>
    <option value="Zulian Hacker of the Tiger">Zulian Hacker of the Tiger</option>`,

    "Daggers": `<option value="Alcor's Sunrazor">Alcor's Sunrazor</option>
    <option value="Black Amnesty">Black Amnesty</option>
    <option value="Blessed Qiraji Pugio">Blessed Qiraji Pugio</option>
    <option value="Bonescraper">Bonescraper</option>
    <option value="Core Hound Tooth">Core Hound Tooth</option>
    <option value="Darrowspike">Darrowspike</option>
    <option value="Death's Sting">Death's Sting</option>
    <option value="Distracting Dagger">Distracting Dagger</option>
    <option value="Dragonfang Blade">Dragonfang Blade</option>
    <option value="Emerald Dragonfang">Emerald Dragonfang</option>
    <option value="Fang of the Faceless">Fang of the Faceless</option>
    <option value="Felstriker">Felstriker</option>
    <option value="Finkle's Skinner">Finkle's Skinner</option>
    <option value="Glacial Blade">Glacial Blade</option>
    <option value="Gutgore Ripper">Gutgore Ripper</option>
    <option value="Harbinger of Doom">Harbinger of Doom</option>
    <option value="Heartseeker">Heartseeker</option>
    <option value="R14 Dagger">R14 Dagger</option>
    <option value="Kingsfall">Kingsfall</option>
    <option value="Maexxna's Fang">Maexxna's Fang</option>
    <option value="Perdition's Blade">Perdition's Blade</option>
    <option value="Qiraji Sacrificial Dagger">Qiraji Sacrificial Dagger</option>
    <option value="Scarlet Kris">Scarlet Kris</option>
    <option value="Scout's Blade">Scout's Blade</option>
    <option value="Shadowsong's Sorrow">Shadowsong's Sorrow</option>
    <option value="The Lobotomizer">The Lobotomizer</option>
    <option value="The Thunderwood Poker">The Thunderwood Poker</option>`,

    "Fists": `<option value="Arlokk's Grasp">Arlokk's Grasp</option>
    <option value="Claw of the Black Drake">Claw of the Black Drake</option>
    <option value="Claw of the Frost Wyrm">Claw of the Frost Wyrm</option>
    <option value="Eskhandar's Left Claw">Eskhandar's Left Claw</option>
    <option value="Eskhandar's Right Claw">Eskhandar's Right Claw</option>
    <option value="R14 Claw">R14 Claw</option>
    <option value="Lefty's Brass Knuckle">Lefty's Brass Knuckle</option>
    <option value="Silithid Claw">Silithid Claw</option>
    <option value="Thekal's Grasp">Thekal's Grasp</option>
    <option value="Willey's Back Scratcher">Willey's Back Scratcher</option>`,

    "Maces": `<option value="Anubisath Warhammer">Anubisath Warhammer</option>
    <option value="Blessed Qiraji War Hammer">Blessed Qiraji War Hammer</option>
    <option value="Ebon Hand">Ebon Hand</option>
    <option value="Empyrean Demolisher">Empyrean Demolisher</option>
    <option value="Ironfoe">Ironfoe</option>
    <option value="Hammer of Bestial Fury">Hammer of Bestial Fury</option>
    <option value="R14 Hammer">R14 Hammer</option>
    <option value="Mass of McGowan">Mass of McGowan</option>
    <option value="Misplaced Servo Arm">Misplaced Servo Arm</option>
    <option value="Persuader">Persuader</option>
    <option value="Sand Polished Hammer">Sand Polished Hammer</option>
    <option value="Sceptre of Smiting">Sceptre of Smiting</option>
    <option value="Spineshatter">Spineshatter</option>
    <option value="Stormstrike Hammer">Stormstrike Hammer</option>
    <option value="The Castigator">The Castigator</option>
    <option value="Timeworn Mace">Timeworn Mace</option>`,

    "Swords": `<option value="Ancient Qiraji Ripper">Ancient Qiraji Ripper</option>
    <option value="Blackguard">Blackguard</option>
    <option value="Bloodlord's Defender">Bloodlord's Defender</option>
    <option value="Brutality Blade">Brutality Blade</option>
    <option value="Cho'Rush's Blade">Cho'Rush's Blade</option>
    <option value="Chromatically Tempered Sword">Chromatically Tempered Sword</option>
    <option value="Cold Forged Blade">Cold Forged Blade</option>
    <option value="Dal'Rend's Sacred Charge">Dal'Rend's Sacred Charge</option>
    <option value="Dal'Rend's Tribal Guardian">Dal'Rend's Tribal Guardian</option>
    <option value="Dark Iron Reaver">Dark Iron Reaver</option>
    <option value="Fiery Retributor">Fiery Retributor</option>
    <option value="Gressil, Dawn of Ruin">Gressil, Dawn of Ruin</option>
    <option value="Iblis, Blade of the Fallen Seraph (Naxx)">Iblis, Blade of the Fallen Seraph (Naxx)</option>
    <option value="Krol Blade">Krol Blade</option>
    <option value="Lord General's Sword">Lord General's Sword</option>
    <option value="Maladath">Maladath</option>
    <option value="Mirah's song">Mirah's song</option>
    <option value="Nightmare Blade">Nightmare Blade</option>
    <option value="Quel'Serrar">Quel'Serrar</option>
    <option value="R14 Longsword">R14 Longsword</option>
    <option value="R14 Swift Blade">R14 Swift Blade</option>
    <option value="Ravencrest's Legacy">Ravencrest's Legacy</option>
    <option value="Ravenholdt Slicer">Ravenholdt Slicer</option>
    <option value="Skullforge Reaver">Skullforge Reaver</option>
    <option value="Sword of Zeal">Sword of Zeal</option>
    <option value="Zulian Slicer">Zulian Slicer</option>
    <option value="Teebu's Blazing Longsword">Teebu's Blazing Longsword</option>
    <option value="The Hungering Cold">The Hungering Cold</option>
    <option value="Thrash Blade">Thrash Blade</option>
    <option value="Thunderfury">Thunderfury</option>
    <option value="Warblade of the Hakkari(MH)">Warblade of the Hakkari(MH)</option>
    <option value="Warblade of the Hakkari(OH)">Warblade of the Hakkari(OH)</option>
    <option value="Widow's Remorse">Widow's Remorse</option>
    <option value="Vis'kag the Bloodletter">Vis'kag the Bloodletter</option>
    <option value="WSG Sword">WSG Sword</option>`,
}




//1,13,14,15,4,5,6,3,2,7,11,9,8,10,12,16,17
/*
function updateWeaponList()
{
    let mhselect = document.getElementById("mainhand")
    let weapontype = document.getElementById("mhweptypelist").value

    mhselect.innerHTML = weaponlists[weapontype]

    let ohselect = document.getElementById("offhand")
    weapontype = document.getElementById("ohweptypelist").value

    ohselect.innerHTML = weaponlists[weapontype]
    updateStats();
}*/

function updateMHWeaponList(doUpdateStats)
{
    let mhselect = document.getElementById("mainhand")
    let weapontype = document.getElementById("mhweptypelist").value

    mhselect.innerHTML = weaponlists[weapontype]
    if(doUpdateStats) updateStats();
}
function updateOHWeaponList(doUpdateStats)
{
    let ohselect = document.getElementById("offhand")
    let weapontype = document.getElementById("ohweptypelist").value

    ohselect.innerHTML = weaponlists[weapontype]
    if(doUpdateStats) updateStats();
}


function updateStats()
{
    let race = document.querySelector("#race").value
    let head = document.querySelector("#head").value
    let neck = document.querySelector("#neck").value
    let shoulder = document.querySelector("#shoulder").value
    let cape = document.querySelector("#cape").value
    let chest = document.querySelector("#chest").value
    let wrist = document.querySelector("#wrist").value
    let hand = document.querySelector("#hands").value
    let waist = document.querySelector("#waist").value
    let leg = document.querySelector("#legs").value
    let ringone = document.querySelector("#ringone").value
    let ringtwo = document.querySelector("#ringtwo").value
    let trinketone = document.querySelector("#trinketone").value
    let trinkettwo = document.querySelector("#trinkettwo").value
    let ranged = document.querySelector("#ranged").value
    let mainhand = document.querySelector("#mainhand").value
    let offhand = document.querySelector("#offhand").value

    let gear = [
        races[race],
        heads[head],
        necks[neck],
        shoulders[shoulder],
        capes[cape],
        chests[chest],
        wrists[wrist],
        hands[hand],
        waists[waist],
        legs[leg],
        rings[ringone],
        rings[ringtwo],
        trinkets[trinketone],
        trinkets[trinkettwo],
        rangedweps[ranged],
        weapons[mainhand],
        weapons[offhand],
    ]

    let strength = 0;
    let stamina = 0;
    let agility = 0;
    let hit = 0;
    let crit = 0;
    let attackpower = 0;
    let armor = 0;
    let parry = 0;
    let dodge = 0;
    let defense = 0;
    let block = 0;
    let blockvalue = 0;

    gear.forEach(item => {
        strength += item.strength;
        stamina += item.stamina;
        agility += item.agility;
        hit += item.hit;
        crit += item.crit;
        attackpower += item.attackpower;
        armor += item.armor;
        parry += item.parry;
        dodge += item.dodge;
        defense += item.defense;
        block += item.block;
        blockvalue += item.blockvalue;
    })

    let mhwepskill = 300;
    let ohwepskill = 300;
    let mhweapontype = document.getElementById("mhweptypelist").value
    let ohweapontype = document.getElementById("ohweptypelist").value

    gear.forEach(item => {
        if(item.skilltype && item.skilltype != 'none') {
            if(item.skilltype.includes(mhweapontype))
                mhwepskill += item.skill;
        }
    })

    gear.forEach(item => {
        if(item.skilltype && item.skilltype != 'none') {
            if(item.skilltype.includes(ohweapontype))
                ohwepskill += item.skill;
        }
    })
    playermhskill
    document.getElementById("playerstrength").innerHTML = `${strength} + `;
    document.getElementById("playerstamina").innerHTML = `${stamina} + `;
    document.getElementById("playeragility").innerHTML = `${agility} + `;
    document.getElementById("playerhit").innerHTML = `${hit} + `;
    document.getElementById("playercrit").innerHTML = `${crit} + `;
    document.getElementById("playerattackpower").innerHTML = `${attackpower} + `;
    document.getElementById("playerarmor").innerHTML = `${armor} + `;
    document.getElementById("playerparry").innerHTML = `${parry} + `;
    document.getElementById("playerdodge").innerHTML = `${dodge} + `;
    document.getElementById("playerdefense").innerHTML = `${defense} + `;
    document.getElementById("playerblock").innerHTML = `${block} + `;
    document.getElementById("playerblockvalue").innerHTML = `${blockvalue} + `;
    document.getElementById("playermhskill").innerHTML = `${mhwepskill} + `;
    document.getElementById("playerohskill").innerHTML = `${ohwepskill} + `;






    // *** OLD STUFF ***

    let tankSettings = document.querySelector("#tankSettings");
    let bossSettings = document.querySelector("#bossSettings");
    let calcSettings = document.querySelector("#calcSettings");
    let talents = document.querySelector("#talents");
    //let trinkets = document.querySelector("#trinkets");
    let bonuses = document.querySelector("#bonuses");

    // Boss Settings
    _debuffDelay = Number(bossSettings.querySelector("#debuffdelay").value)

    // Calc Settings
    _iterations = Number(calcSettings.querySelector("#iterations").value)
    _simDuration = Math.round(Math.ceil(Number(calcSettings.querySelector("#fightLength").value)*2.5)*4)/10
    _breakpointValue = Number(calcSettings.querySelector("#TBPvalue").value)
    _breakpointTime = Number(calcSettings.querySelector("#TBPtime").value)
    _breakpointTime = Math.round(_breakpointTime*1000/_timeStep)*_timeStep;
    
    // Tank Settings
    _startRage = Number(tankSettings.querySelector("#startRage").value)
    _deathwish = tankSettings.querySelector("#deathwish").checked
    _crusaderMH = tankSettings.querySelector("#crusaderMH").checked
    _crusaderOH = tankSettings.querySelector("#crusaderOH").checked
    _thunderfuryMH = tankSettings.querySelector("#thunderfuryMH").checked
    _thunderfuryOH = tankSettings.querySelector("#thunderfuryOH").checked
    _windfury = tankSettings.querySelector("#windfury").checked
    _wcb = tankSettings.querySelector("#wcb").checked
    _dmf = tankSettings.querySelector("#dmf").checked

    // Talents 
    _impHS = Number(talents.querySelector("#impHS").value) 
    _impSA = Number(talents.querySelector("#impSA").value) 
    _defiance = Number(talents.querySelector("#defiance").value) 
    _impale = Number(talents.querySelector("#impale").value) 
    _dwspec = Number(talents.querySelector("#dwspec").value) 

    // Trinkets
    _kots = document.querySelector("#kots").checked
    _earthstrike = document.querySelector("#earthstrike").checked
    _diamondflask = document.querySelector("#diamondflask").checked
    _jomgabbar = document.querySelector("#jomgabbar").checked
    _slayerscrest = document.querySelector("#slayerscrest").checked

    // Other Bonuses
    _twoPieceDreadnaught = bonuses.querySelector("#twoPieceDreadnaught").checked
    _fivePieceWrath = bonuses.querySelector("#fivePieceWrath").checked
    _threatenchant = bonuses.querySelector("#threatenchant").checked
    //_lgg = trinkets.querySelector("#lgg").checked
    
    _config = {
        tankStats: new StaticStats({
            type: "tank",
            level: 60,

            MHMin: weapons[mainhand].min,
            MHMax: weapons[mainhand].max,
            MHSwing: weapons[mainhand].swingtimer*1000,

            OHMin: weapons[offhand].min,
            OHMax: weapons[offhand].max,
            OHSwing: weapons[offhand].swingtimer*1000,

            MHWepSkill: mhwepskill,
            OHWepSkill: ohwepskill,
            damageMod: _dmf ? 0.99 : 0.9, // Defensive Stance + dmf
            hastePerc: _wcb ? 10 : 0, 
            AP: strength*2 + attackpower,
            crit: agility/20 + crit, // TODO: add wepskill
            hit: hit,
            
            parry: parry + 5, // TODO talents, defense, check formula
            dodge: agility/20 + dodge, // TODO: talents, defense
            block: 0, // TODO: add shield funcitonality...
            blockValue: 0,
            defense: 300 + defense, // TODO: talents
            baseArmor: agility*2 + armor, // TODO: talents
            baseHealth: stamina*10, // TODO: basehealth

            threatMod: 1.3 * (1 + 0.03*_defiance) * (_threatenchant ? 1.02 : 1),
            critMod: 2 + _impale*0.1,
            startRage: _startRage,

            twoPieceDreadnaught: _twoPieceDreadnaught,
            fivePieceWrath: _fivePieceWrath,
        }),

        bossStats: new StaticStats({
            type: "boss",
            level: 63,

            MHMin: Number(bossSettings.querySelector("#swingMin").value),
            MHMax: Number(bossSettings.querySelector("#swingMax").value),
            MHSwing: Number(bossSettings.querySelector("#swingTimer").value)*1000,

            MHWepSkill: 315,
            damageMod: 0.9, // Defensive Stance
            hastePerc: 0,
            AP: 0, //TODO: AP needs to scale correctly for npc vs players, add APScaling, also 270 base
            crit: 5,
            blockValue: 47,

            parry: 12.5, // 14%  with skilldiff
            dodge: 5,    // 6.5% with skilldiff
            block: 5,
            defense: 315,
            baseArmor: Number(bossSettings.querySelector("#bossarmor").value),

            critMod: 2,
            threatMod: 0,
            startRage: 0,
        }),
        debuffDelay: _debuffDelay*1000, // seconds -> ms
    }
}


class StaticStats {
    constructor(stats) {
        this.type = stats.type;
        this.level = stats.level;

        this.MHMin = stats.MHMin;
        this.MHMax = stats.MHMax;
        this.MHSwing = stats.MHSwing;
        this.OHMin = stats.OHMin;
        this.OHMax = stats.OHMax;
        this.OHSwing = stats.OHSwing;

        this.MHWepSkill = stats.MHWepSkill;
        this.OHWepSkill = stats.OHWepSkill;
        this.damageMod = stats.damageMod;
        this.hastePerc = stats.hastePerc;
        this.crit = stats.crit;
        this.AP = stats.AP;
        this.blockValue = stats.blockValue;
        this.hit = stats.hit;

        this.parry = stats.parry;
        this.dodge = stats.dodge;
        this.block = stats.block;
        this.defense = stats.defense;
        this.baseArmor = stats.baseArmor;
        this.baseHealth = stats.baseHealth;

        this.critMod = stats.critMod;
        this.threatMod = stats.threatMod;
        this.startRage = stats.startRage;

        this.twoPieceDreadnaught = stats.twoPieceDreadnaught;
        this.fivePieceWrath = stats.fivePieceWrath;
        this.threatenchant = stats.threatenchant;
    }
}
/*
function fetchSettings() {

    let tankSettings = document.querySelector("#tankSettings");
    let bossSettings = document.querySelector("#bossSettings");
    let calcSettings = document.querySelector("#calcSettings");
    let talents = document.querySelector("#talents");
    let trinkets = document.querySelector("#trinkets");
    let bonuses = document.querySelector("#bonuses");

    // Boss Settings
    _debuffDelay = Number(bossSettings.querySelector("#debuffdelay").value)

    // Calc Settings
    _iterations = Number(calcSettings.querySelector("#iterations").value)
    _simDuration = Math.round(Math.ceil(Number(calcSettings.querySelector("#fightLength").value)*2.5)*4)/10
    _breakpointValue = Number(calcSettings.querySelector("#TBPvalue").value)
    _breakpointTime = Number(calcSettings.querySelector("#TBPtime").value)
    _breakpointTime = Math.round(_breakpointTime*1000/_timeStep)*_timeStep;
    
    // Tank Settings
    _startRage = Number(tankSettings.querySelector("#startRage").value)
    _deathwish = tankSettings.querySelector("#deathwish").checked
    _crusaderMH = tankSettings.querySelector("#crusaderMH").checked
    _crusaderOH = tankSettings.querySelector("#crusaderOH").checked
    _thunderfuryMH = tankSettings.querySelector("#thunderfuryMH").checked
    _thunderfuryOH = tankSettings.querySelector("#thunderfuryOH").checked
    _windfury = tankSettings.querySelector("#windfury").checked
    _wcb = tankSettings.querySelector("#wcb").checked
    _dmf = tankSettings.querySelector("#dmf").checked

    // Talents 
    _impHS = Number(talents.querySelector("#impHS").value) 
    _impSA = Number(talents.querySelector("#impSA").value) 
    _defiance = Number(talents.querySelector("#defiance").value) 
    _impale = Number(talents.querySelector("#impale").value) 
    _dwspec = Number(talents.querySelector("#dwspec").value) 

    // Trinkets
    _kots = trinkets.querySelector("#kots").checked
    _earthstrike = trinkets.querySelector("#earthstrike").checked
    _diamondflask = trinkets.querySelector("#diamondflask").checked
    _jomgabbar = trinkets.querySelector("#jomgabbar").checked
    _slayerscrest = trinkets.querySelector("#slayerscrest").checked

    // Other Bonuses
    _twoPieceDreadnaught = bonuses.querySelector("#twoPieceDreadnaught").checked
    _fivePieceWrath = bonuses.querySelector("#fivePieceWrath").checked
    _threatenchant = bonuses.querySelector("#threatenchant").checked
    //_lgg = trinkets.querySelector("#lgg").checked
    
    _config = {
        tankStats: new StaticStats({
            type: "tank",
            level: 60,

            MHMin: Number(tankSettings.querySelector("#MHMin").value),
            MHMax: Number(tankSettings.querySelector("#MHMax").value),
            MHSwing: Number(tankSettings.querySelector("#MHSwing").value)*1000,

            OHMin: Number(tankSettings.querySelector("#OHMin").value),
            OHMax: Number(tankSettings.querySelector("#OHMax").value),
            OHSwing: Number(tankSettings.querySelector("#OHSwing").value)*1000,

            MHWepSkill: Number(tankSettings.querySelector("#MHWepSkill").value),
            OHWepSkill: Number(tankSettings.querySelector("#OHWepSkill").value),
            damageMod: _dmf ? 0.99 : 0.9, // Defensive Stance + dmf
            hastePerc: _wcb ? 10 : 0, 
            AP: Number(tankSettings.querySelector("#AP").value),
            crit: Number(tankSettings.querySelector("#crit").value),
            hit: Number(tankSettings.querySelector("#hit").value),
            
            parry: Number(tankSettings.querySelector("#parry").value),
            dodge: Number(tankSettings.querySelector("#dodge").value),
            block: 0, //Number(tankSettings.querySelector("#block").value),
            blockValue: 0,
            defense: Number(tankSettings.querySelector("#defense").value),
            baseArmor: Number(tankSettings.querySelector("#tankarmor").value),
            baseHealth: 0, //Number(tankSettings.querySelector("#health").value),

            threatMod: 1.3 * (1 + 0.03*_defiance) * (_threatenchant ? 1.02 : 1),
            critMod: 2 + _impale*0.1,
            startRage: _startRage,

            twoPieceDreadnaught: _twoPieceDreadnaught,
            fivePieceWrath: _fivePieceWrath,
        }),

        bossStats: new StaticStats({
            type: "boss",
            level: 63,

            MHMin: Number(bossSettings.querySelector("#swingMin").value),
            MHMax: Number(bossSettings.querySelector("#swingMax").value),
            MHSwing: Number(bossSettings.querySelector("#swingTimer").value)*1000,

            MHWepSkill: 315,
            damageMod: 0.9, // Defensive Stance
            hastePerc: 0,
            AP: 0, //TODO: AP needs to scale correctly for npc vs players, add APScaling, also 270 base
            crit: 5,
            blockValue: 47,

            parry: 12.5, // 14%  with skilldiff
            dodge: 5,    // 6.5% with skilldiff
            block: 5,
            defense: 315,
            baseArmor: Number(bossSettings.querySelector("#bossarmor").value),

            critMod: 2,
            threatMod: 0,
            startRage: 0,
        }),
        debuffDelay: _debuffDelay*1000, // seconds -> ms
    }
}*/
