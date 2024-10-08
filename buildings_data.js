const gBuildings = {
	"Hangar Bay": {
		name: "Hangar Bay",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "4x4",
		luminite: 150,
		therium: 75,
		buildtime: 45,
		building_requirement: ["Central Command"],
		health: 1000,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor:15,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Mech Bay": {
		name: "Mech Bay",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "4x4",
		luminite: 150,
		therium: 50,
		buildtime: 45,
		building_requirement: ["Barracks"],
		health: 1200,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor: 15,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Barracks": {
		name: "Barracks",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "4x4",
		luminite:150,
		buildtime:40,
		health: 1200,
		building_requirement: ["Command Post"],
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor:15,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Biokinetics Lab": {
		name: "Biokinetics Lab",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "4x4",
		luminite: 100,
		buildtime: 50,
		building_requirement: ["Barracks"],
		health: 800,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor:15,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Machine Lab": {
		name: "Machine Lab",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "4x4",
		luminite: 100,
		therium: 50,
		buildtime: 50,
		building_requirement: ["Central Command"],
		health: 800,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor:15,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Command Post": {
		name: "Command Post",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "6x6",
		luminite: 400,
		buildtime: 90,
		supply_gained: 15,
		upgrades_to: ["Central Command"],
		health: 1500,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor:15,
	},
	"Central Command": {
		name: "Central Command",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "6x6",
		luminite: 150,
		therium: 100,
		buildtime: 30,
		upgrades_to: ["High Command"],
		building_requirement: ["Barracks"],
		health: 2500,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor:15,
	},
	"High Command": {
		name: "High Command",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "6x6",
		luminite: 200,
		therium: 150,
		buildtime: 70,
		building_requirement: ["Hangar Bay", "Machine Lab"],
		health: 3500,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor:15,
	},
	"Habitat": {
		name: "Habitat",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "3x3",
		luminite: 100,
		buildtime: 20,
		supply_gained: 15,
		upgrades_to: ["Solar Habitat", "Rampart"],
		building_requirement: ["Command Post"],
		health: 400,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor: 5,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Scrapyard": {
		name: "Scrapyard",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "4x4",
		luminite: 100,
		buildtime: 35,
		building_requirement: ["Central Command"],
		health: 800,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor: 15,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Solar Habitat": {
		name: "Solar Habitat",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "3x3",
		luminite: 100,
		buildtime: 1,
		supply_gained: 5,
		building_requirement: ["Central Command"],
		health: 600,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor: 5,
		abilities: [{
			name: "Solar Charge",
			desc: "Increase various aspects of a nearby structure by 25%: Attack Speed, Production Speed, Heal Rate, Energy Regeneration, Vision Range",
		}, {
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Rampart": {
		name: "Rampart",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "3x3",
		luminite: 100,
		buildtime: 1,
		supply_gained: 5,
		building_requirement: ["Scrapyard"],
		health: 800,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor: 15,
		energy: 50,
		max_energy: 100,
		energy_rate: 0.5,
		abilities: [{
			name: "Reinforce",
			energy: 50,
			cooldown: 1,
			duration: 20,
			desc: "Increases the armor of a nearby friendly structure by 200 for 20 seconds."
		}, {
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Sentry Post": {
		name: "Sentry Post",
		faction: "v",
		subfaction: ["1v1", "Blockade", "Amara"],
		size: "3x3",
		luminite: 100,
		buildtime: 45,
		building_requirement: ["Barracks"],
		health: 330,
		armor_type: ["Heavy", "Mechanical", "Structure"],
		armor: 10,
		attacks: [{
			name: "Gauss Autocannon",
			target: ["Air", "Ground"],
			damage: 22,
			speed: 1.6,
			range: 10,
		}],
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
	},
	"Repair-O-Matic": {
		name: "Repair-O-Matic",
		health: 450,
		armor: 10,
		abilities: [{
			name: "Repair Beam",
			range: 8,
			desc: "Repairs a nearby target friendly mechanical unit or structure for 30 health per second. Right-click to enable/disable autocasting."
		}, {
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
		extra_info: [{
			desc: "Created by loading a BOB into a Sentry Post"
		}],
	},
	"Buzzsaw Cannon": {
		name: "Buzzsaw Cannon",
		health: 570,
		armor: 20,
		attacks: [{
			name: "S.A.W. Laucher",
			target: ["Ground"],
			damage: 18,
			bonus: [ {bonus: "Light", bonus_damage: 8 }],
			speed: 1.5,
			range: 7,
		}],
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
		traits: [{
			name: "Bouncing Blades",
			desc: "On-Hit: Attack bounces twice to nearby enemies."
		}],
		extra_info: [{
			desc: "Created by loading a Lancer into a Sentry Post"
		}],
	},
	"Sensor Array": {
		name: "Sensor Array",
		health: 450,
		armor: 10,
		abilities: [{
			name: "Vision Surge",
			cooldown: 60,
			duration: 10,
			desc: "Greatly incrases the Sensor Array's vision radius for 10 seconds."
		}, {
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
		traits: [{
			name: "Enhanced Pupper Radar",
			desc: "This structure can sense nearby enemies under the fog of war."
		}, {
			name: "Detector",
			desc: "Detects stealthed enemies."
		}],
		extra_info: [{
			desc: "Created by loading a SCOUT into a Sentry Post"
		}],
	},
	"Flak Cannon": {
		name: "Flak Cannon",
		health: 450,
		armor: 10,
		attacks: [{
			name: "GTA Flak 99 Battery",
			target: ["Air", "Ground"],
			damage: 22,
			speed: 0.8,
			range: 12,
		}],
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
		traits: [{
			name: "Fragmented Shrapnel",
			desc: "This structure's attacks deal area damage in a circle."
		}],
		extra_info: [{
			desc: "Created by loading an Exo into a Sentry Post"
		}],
	},
	"Med Station": {
		name: "Med Station",
		health: 450,
		armor: 20,
		abilities: [{
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
		traits: [{
			name: "Rapid Regen Aura",
			desc: "Nearby friendly biological units are healed for 4 health per second. Out-of-combat units are healed for a bonus 4 health per second."
		}],
		extra_info: [{
			desc: "Created by loading a MedTech into a Sentry Post"
		}],
	},
	"Ambush Post": {
		name: "Ambush Post",
		health: 450,
		armor: 10,
		abilities: [{
			name: "Quickstick Bomb",
			cooldown: 8,
			desc: "Throws a bomb at a target ground unit or location. The bomb instantly explodes, dealing 50 damage to and leaving behind goop that slows all ground units in an area. Right-click to enable/disable autocasting.",
		}, {
			name: "Salvage",
			desc: "Recovers 100% of this structure's resource cost.",
		}],
		traits: [{
			name: "Stealthed",
			desc: "Enemy players may only see this unit from afar if they have a Detector ability."
		}],
		extra_info: [{
			desc: "Created by loading a Graven into a Sentry Post"
		}],
	},
};