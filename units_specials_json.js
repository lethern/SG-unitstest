
// compression Symbol: two characters of following table, first character from
//	ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvw
// second character from
//	0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
// Units: starts from a0, last used: "aN"
// Config options: starts from A0
let gUnitsSpecials = {
	"Argent": {
		configOptions: [
			{ name: "High Energy", desc: "Allows Argents to use High Energy, to deal 100% increased damage for 10 energy.", value: true, compressionSymbol: 'A0' },
			{ name: "Longshot Module", desc: "Gives Argents +3 range", value: false, compressionSymbol: 'A1' },
			{ name: "Photo-Capacitors", desc: "Argents +20 energy", value: false, compressionSymbol: 'A2' }
		],
		compressionSymbol: 'a0',
	},
	"Gaunt": {
		configOptions: [
			{ name: "Bouncing Bone Axes", desc: "Attacks bounce twice, dealing 25% damage", value: true, compressionSymbol: 'A3' },
			{ name: "Plague Axe", desc: "Attacked units within Shroud are infected with Infest.", value: false, implemented: false, compressionSymbol: 'A4' },
			{ name: "Reaper's Rush", desc: "30% increased movement speed", value: false, compressionSymbol: 'A5' }
		],
		compressionSymbol: 'a1',
	},
	"Atlas": {
		configOptions: [
			{ name: "Deploy BFG", desc: "", value: false, implemented: false, compressionSymbol: 'A6' },
			{ name: "Purification Ordnance", desc: "This unit's attacks deal area damage in a circle.", value: true, implemented: false, compressionSymbol: 'A7' },
			{ name: "Plasma Arc Infusion", desc: "On-Hit: Lights the ground on fire, dealing 20 damage per second to all units standing in the fire for 5 seconds.", value: false, implemented: false, compressionSymbol: 'A8' },
		],
		compressionSymbol: 'a2',
	},
	"BOB": {
		configOptions: [
			{ name: "Repair", desc: "Restores health to mechanical units and structures.", value: true, implemented: false, compressionSymbol: 'A9' },
		],
		compressionSymbol: 'a3',
	},
	"Lancer": {
		configOptions: [
			{ name: "Fortified Impaler", desc: "This units attacks deal area damage in a line.", value: true, implemented: false, compressionSymbol: 'AA' },
			{ name: "Kinetic Redirection", desc: "On-Damaged: Increases this unit's attack and movement speed by 5% for 5 seconds. Max 50%.", value: false, implemented: false, compressionSymbol: 'AB' },
			{ name: "Mitigative Guard", desc: "On-Damaged: Damage reduced by 2.", value: false, implemented: false, compressionSymbol: 'AC' },
		],
		compressionSymbol: 'a4',
	},
	"SCOUT": {
		configOptions: [
			{ name: "Pounce", desc: "Intercepts a nearby enemy unit, increasing this unit's movement speed by 25% and dealing 15 (+15 vs Light) bonus damage on impact.", value: true, implemented: false, compressionSymbol: 'AD' },
			{ name: "Vorillium Claws", desc: "Increased damage against Light units by +8.", value: false, implemented: false, compressionSymbol: 'AE' },
		],
		compressionSymbol: 'a5',
	},
	"Exo": {
		configOptions: [
			{ name: "Quickdraw Hustle", desc: "On-Attack: Gains 25% bonus movement speed for 2 seconds.", value: false, implemented: false, compressionSymbol: 'AF' },
			{ name: "Survival Protocol", desc: "This unit can negate fatal damage once every 120 seconds.", value: false, compressionSymbol: 'AG' },
		],
		compressionSymbol: 'a6',
	},
	"MedTech": {
		configOptions: [
			{ name: "Med Patch", desc: "", value: true, implemented: false, compressionSymbol: 'AH' },
			{ name: "Nanoswarm", desc: "", value: false, implemented: false, compressionSymbol: 'AI' },
			{ name: "System Shock", desc: "", value: false, implemented: false, compressionSymbol: 'AJ' },
		],
		compressionSymbol: 'a7',
	},
	"Hedgehog": {
		configOptions: [
			{ name: "Hunker Down", desc: "", value: true, implemented: false, compressionSymbol: 'AK' },
			{ name: "Spine Up", desc: "", value: true, implemented: false, compressionSymbol: 'AL' },
			{ name: "Transonic Boosters", desc: "+2/+4 weapon range.", value: false, implemented: false, compressionSymbol: 'AM' },
			{ name: "Rocket Ammo", desc: "This unit uses ammo to attack and slowly recharges its ammo over time.", value: false, implemented: false, compressionSymbol: 'AN' },
		],
		compressionSymbol: 'a8',
	},
	"Vulcan": {
		configOptions: [
			{ name: "Jump Jets", desc: "", value: true, implemented: false, compressionSymbol: 'AO' },
			{ name: "Vulcan Barrage", desc: "", value: false, implemented: false, compressionSymbol: 'AP' },
			{ name: "Peak Performance", desc: "", value: false, implemented: false, compressionSymbol: 'AQ' },
			{ name: "Attack winding up", desc: "Phase 1 damage: 3 (+3 vs Light), Phase 2 damage: 4 (+4 vs Light), Phase 3 damage: 6 (+6 vs Light). Loses windup after 1 second of not attacking.", value: true, compressionSymbol: 'AR' },
		],
		compressionSymbol: 'a9',
	},
	"Brute": {
		configOptions: [
			{ name: "Sunder Soul", desc: "", value: true, implemented: false, compressionSymbol: 'AS' },
			{ name: "Soulforge Ascendance", desc: "", value: false, implemented: false, compressionSymbol: 'AT' },
			{ name: "Sundering Soul Craze", desc: "", value: false, implemented: false, compressionSymbol: 'AU' },
		],
		compressionSymbol: 'aA',
	},
	"Magmadon": {
		configOptions: [
			{ name: "Trample", desc: "Goes into a rampage, pushing nearby units out of the Magmadon's path and dealing 100 (+80 vs Heavy) damage over 6 seconds to nearby enemy ground units.", value: true, implemented: false, compressionSymbol: 'AV' },
			{ name: "Consume", desc: "Sacrifice a nearby Felhog or Fiend, recovering 100% of max White Health instantly.", value: true, implemented: false, compressionSymbol: 'AW' },
			{ name: "Demonhoof Tremors", desc: "Allows Trample to periodically stun nearby enemy ground units.", value: false, implemented: false, compressionSymbol: 'AX' },
			{ name: "Raging Tendons", desc: "25% increased movement speed.", value: false, implemented: false, compressionSymbol: 'AY' },
		],
		compressionSymbol: 'aB',
	},
	"Hellborne": {
		configOptions: [
			{ name: "Shatter", desc: "This unit's attack shatter on impact, dealing 25% of its primary damage to units behind the target.", value: true, implemented: false, compressionSymbol: 'AZ' },
			{ name: "Molten Touch", desc: "On-Hit: Lights target on fire, dealing 8 damage per second for 3 seconds.", value: false, implemented: false, compressionSymbol: 'Aa' },
		],
		compressionSymbol: 'aC',
	},
	"Hexen": {
		configOptions: [
			{ name: "Skull of Shedda", desc: "", value: true, implemented: false, compressionSymbol: 'Ab' },
			{ name: "Venom Trap", desc: "", value: true, implemented: false, compressionSymbol: 'Ac' },
			{ name: "Miasma", desc: "Covers a target area in bubbling ash and tar. Enemy ground units in the area will be Infested and take 700% bonus damage from Infest. This unit must channel this ability draining 4 energy per second.", value: false, implemented: false, compressionSymbol: 'Ad' },
			{ name: "Shroudweave", desc: "", value: false, implemented: false, compressionSymbol: 'Ae' },
		],
		compressionSymbol: 'aD',
	},
	"Weaver": {
		configOptions: [
			{ name: "Lash", desc: "", value: true, implemented: false, compressionSymbol: 'Af' },
			{ name: "Consume", desc: "", value: false, implemented: false, compressionSymbol: 'Ag' },
			{ name: "Shroudweave", desc: "", value: false, implemented: false, compressionSymbol: 'Ah' },
			{ name: "Shroudwalk", desc: "", value: false, implemented: false, compressionSymbol: 'Ai' },
		],
		compressionSymbol: 'aE',
	},
	"Imp": {
		configOptions: [
			{ name: "Flame On", desc: "", value: true, implemented: false, compressionSymbol: 'Aj' },
		],
		compressionSymbol: 'aF',
	},
	"Kri": {
		configOptions: [
			{ name: "Roll Out", desc: "", value: false, implemented: false, compressionSymbol: 'Ak' },
			{ name: "Blaze of Light", desc: "", value: true, implemented: false, compressionSymbol: 'Al' },
			{ name: "Radiant Fury", desc: "", value: false, implemented: false, compressionSymbol: 'Am' },
		],
		compressionSymbol: 'aG',
	},
	"Cabal": {
		configOptions: [
			{ name: "Debilitate", desc: "", value: true, implemented: false, compressionSymbol: 'An' },
			{ name: "Gravity Flux", desc: "", value: false, implemented: false, compressionSymbol: 'Ao' },
			{ name: "Mind Shackle", desc: "", value: false, implemented: false, compressionSymbol: 'Ap' },
		],
		compressionSymbol: 'aH',
	},
	"Seraphim": {
		configOptions: [
			{ name: "Condemnation", desc: "", value: true, implemented: false, compressionSymbol: 'Aq' },
			{ name: "Resolute Seal", desc: "", value: false, implemented: false, compressionSymbol: 'Ar' },
			{ name: "Winged Dash", desc: "", value: true, implemented: false, compressionSymbol: 'As' },
			{ name: "Creepbane Guard", desc: "", value: true, implemented: false, compressionSymbol: 'At' },
		],
		compressionSymbol: 'aI',
	},
	"Animancer": {
		configOptions: [
			{ name: "Animus Redistribution", desc: "", value: true, implemented: false, compressionSymbol: 'Au' },
			{ name: "Unseen Veil", desc: "", value: false, implemented: false, compressionSymbol: 'Av' },
			{ name: "Dark Prophecy", desc: "", value: false, implemented: false, compressionSymbol: 'Aw' },
		],
		compressionSymbol: 'aJ',
	},
	"Archangel": {
		configOptions: [
			{ name: "Angelic Descent", desc: "", value: true, implemented: false, compressionSymbol: 'Ax' },
			{ name: "Angelic Ascent", desc: "", value: true, implemented: false, compressionSymbol: 'Ay' },
			{ name: "Meteor Strike", desc: "", value: true, implemented: false, compressionSymbol: 'Az' },
			{ name: "Avatar", desc: "", value: true, implemented: false, compressionSymbol: 'B0' },
			{ name: "Scorched Earth", desc: "", value: false, implemented: false, compressionSymbol: 'B1' },
		],
		compressionSymbol: 'aK',
	},
	"Saber": {
		configOptions: [
			{ name: "Dark Matter Distortion", desc: "This unit's attack deals 50% of its damage to adjacent enemies.", value: true, implemented: false, compressionSymbol: 'B2' },
		],
		compressionSymbol: 'aL',
	},
	"Vector": {
		configOptions: [
			{ name: "Delta Jump", desc: "", value: true, implemented: false, compressionSymbol: 'B3' },
			{ name: "Recall", desc: "", value: false, implemented: false, compressionSymbol: 'B4' },
			{ name: "Trichotomic Barrage", desc: "This unit fires three missles with each attack.", value: true, compressionSymbol: 'B5' },
			{ name: "Recall Potential", desc: "", value: false, implemented: false, compressionSymbol: 'B6' },
		],
		compressionSymbol: 'aM',
	},
	"Graven": {
		configOptions: [
			{ name: "Sticky Bomb", desc: "", value: true, implemented: false, compressionSymbol: 'B7' },
			{ name: "Infiltrate", desc: "", value: true, implemented: false, compressionSymbol: 'B8' },
			{ name: "Mass Infiltration", desc: "", value: false, implemented: false, compressionSymbol: 'B9' },
		],
		compressionSymbol: 'aN',
	}
	/*
		configOptions: [
			{ name: "", desc: "", value: false, implemented: false, compressionSymbol: '' },
		],
		compressionSymbol: '',
	*/
}
