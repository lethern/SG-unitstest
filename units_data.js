const gUnits = {
	"Argent": {
		built: ["Creation Chamber"],
		faction: "c",
		type: "Ground",
		luminite: 100,
		therium: 0,
		supply: 2,
		buildtime: 26,
		speed: 4.5,
		health: 180,
		armor_type: ['Biological', 'Heavy', 'Mechanical'],
		armor: 5,
		energy: 30,
		attacks: [{
			name: 'Oscillamata',
			target: ['Air', 'Ground'],
			damage: 8,
			speed: 1.5,
			bonus: [ { bonus: 'Heavy', bonus_damage: 4 }],
			range: 6,
		}],
		abilities: [{
			name: 'High Energy',
			energy: 10,
			desc: "Imbues this unit's weapon, allowing it to deal 100% increased damage. Right-click to enable/disable autocasting.",
		}],
		traits: [{
			name: 'Photo-Restoration',
			desc: "When this unit is out of combat, it regenerates 2 energy per second.",
		}, {
			name: 'Longshot Module',
			req: ['Research Photo-Capacitors', 'Research Longshot Module'],
			desc: "Increases the range of this unit's charged weapon by +3.",
		}, {
			name: 'Photo-Capacitors',
			req: ['Research Photo-Capacitors'],
			desc: "+20 starting and maximum energy.",
		}],
	},
	"Gaunt": {
		built: ["Conclave"],
		faction: "i",
		type: "Ground",
		luminite: 50,
		therium: 12.5,
		supply: 1,
		buildtime: 0.5,
		charge_time: 35,
		speed: 4,
		health: 80,
		extra_health: 20,
		armor_type: ['Biological', 'Light'],
		armor: 0,
		energy: 0,
		attacks: [{
			name: 'Flying Bone Axes',
			target: ['Air'],
			damage: 8,
			speed: 1.3,
			bonus: [ { bonus: 'Light', bonus_damage: 4 }],
			range: 6,
		}, {
			name: 'Bone Axes',
			target: ['Ground'],
			damage: 8,
			speed: 1.3,
			bonus: [ { bonus: 'Light', bonus_damage: 4 }],
			range: 5,
		}],
		extra_info: [{
			name: 'Spawns in pair',
			desc: "Charge makes 2 gaunts",
		}, {
			name: 'Bounces',
			desc: "Attacks bounce to two nearby targets, dealing 2 (+1 vs Light) damage.",
		}],
		abilities: [],
		traits: [{
			name: "Bouncing Bone Axes",
			range: 3.5,
			desc: "On-Hit: Attacks bounce twice to nearby enemies, dealing 25% of primary damage.",
		}, {
			name: 'Plague Axe',
			req: ['Research Plague Axe'],
			desc: "On-Hit: Attacked units within Shroud are infected with Infest.",
		}, {
			name: "Reaper's Rush",
			req: ["Research Reaper's Rush"],
			desc: "30% increased movement speed.",
		}],
	},
	"Atlas": {
		name: 'Atlas',
		built: ['Mech Bay'],
		faction: 'v',
		subfaction: ['1v1', 'Blockade', 'Amara'],
		type: 'Ground',
		building_requirement: ['Machine Lab'],
		luminite: 250,
		therium: 125,
		supply: 6,
		buildtime:48,
		speed:3,
		health:300,
		armor_type: ['Heavy', 'Mechanical'],
		armor:10,
		veterancybonushealth: [60, 60, 60],
		veterancybonusdamage: ['10%', '10%', '10%'],
		veterancyspecialbonus: ['1 (Deployed) Range', '1 (Deployed) Range', '1 (Deployed) Range'],
		veterancyxp: [1200, 3000, 5400],
		attacks: [{
			name: 'L.I.G.H.T. Guns',
			target: ['Ground'],
			damage: 15,
			speed: 0.5,
			range: 4,
		}, {
			name: 'BFG',
			target: ['Ground'],
			damage: 80,
			speed: 5,
			bonus: [ { bonus: 'Heavy', bonus_damage: 35 }, { bonus: 'Structure', bonus_damage: 35 }],
			range: 16,
		}],
		abilities: [{
			name: 'Deploy BFG',
			cooldown: 1.5,
			desc: "Deploy: Greatly increases the range of the Atlas' attack. Attacks Ground",
		}, {
			name: 'Pack It Up',
			cooldown: 1.167,
			desc: "Mobilize: Greatly reduce the range of the Atlas' attack. Attacks Ground",
		}],
		traits: [{
			name: 'Purification Ordnance',
			req: ['Deploy BFG'],
			desc: "This unit's attacks deal area damage in a circle.",
		}, {
			name: 'Plasma Arc Infusion',
			duration: 5,
			req: ['Research Plasma Arc Infusion'],
			desc: "On-Hit: Lights the ground on fire, dealing 20 damage per second to all units standing in the fire for 5 seconds.",
		}],
	},
	"BOB": {
		name: 'B.O.B.',
		built: ['Command Post', 'Central Command', 'High Command'],
		faction: 'v',
		subfaction: ['1v1', 'Blockade', 'Amara'],
		type: 'Ground',
		luminite: 50,
		therium: 0,
		supply: 1,
		buildtime: 17,
		speed: 3.5,
		health: 130,
		armor_type: ['Light', 'Mechanical'],
		armor: 0,
		veterancybonushealth: [26, 26, 26],
		veterancybonusdamage: ['10%', '10%', '10%'],
		veterancyspecialbonus: ['20% Construction Speed', '20% Construction Speed', '20% Construction Speed'],
		veterancyxp: [200, 500, 900],
		attacks: [{
			name: 'Servo-Fists',
			target: ['Ground'],
			damage: 8,
			speed: 1.5,
			range: 0.1,
		}],
		abilities: [{
			name: 'Repair',
			desc: "Restores health to mechanical units and structures.",
		}],
	},
	"Lancer": {
		name: 'Lancer',
		built: ['Barracks'],
		faction: 'v',
		subfaction: ['1v1'],
		type: 'Ground',
		luminite: 100,
		therium: 0,
		supply: 2,
		buildtime: 24,
		speed: 4.5,
		health: 260,
		armor_type: ['Biological', 'Heavy'],
		armor: 15,
		veterancybonushealth: [48, 48, 48],
		veterancybonusdamage: ['10%', '10%', '10%'],
		veterancyspecialbonus: ['5 Armor', '5 Armor', '5 Armor'],
		veterancyxp: [400, 1000, 1800],
		attacks: [{
			name: 'Foe Splitter Blade',
			target: ['Ground'],
			damage: 10,
			speed: 1.5,
			bonus: [ {bonus: 'Structure', bonus_damage:5 }, {bonus: 'Light', bonus_damage:5 }],
			range: 1.5,
		}],
		traits: [{
			name: 'Vanguard Fortified Impaler',
			desc: "This units attacks deal area damage in a line.",
		},{
			name: 'Vanguard Kinetic Redirection',
			duration: 5,
			req: ['Research Kinetic Redirection'],
			desc: "On-Damaged: Increases this unit's attack and movement speed by 5% for 5 seconds. Max 50%.",
		},{
			name: 'Vanguard Mitigative Guard',
			req: ['Research Mitigative Guard'],
			desc: "On-Damaged: Damage reduced by 2.",
		}],
}
	/*
	"": {
		built: "",
		faction: "",
		type: "",
		luminite: ,
		therium: ,
		supply: ,
		buildtime: ,
		speed: ,
		health: ,
		extra_health: ,
		armor_type: [],
		armor: ,
		energy: ,
		attacks: [{
			target: '',
			damage: ,
			speed: ,
			bonus: [ { bonus: '', bonus_damage:  }],
			range: ,
		}],
		abilities: [{
			name: '',
			energy: ,
			desc: "",
		}],
		traits: [{
			name: '',
			desc: "",
		}],
	}
	*/
};
