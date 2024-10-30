const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gConfig = {
	canMove: true,
	unitConfigPlayer0: null,
	unitConfigPlayer1: null,
};

let gUnitSizeScaling = 45;
let gDrawError = false;

let lastTime = 0;
let gCurrentTime = 0;
let gMapUnits = [];

let gImages = {};
let gImagesCount = 0;
let gReady = false;
function loadImgs(){
	gImages['projectile'] = { img: new Image() };
	gImages['projectile'].img.onload = () => {
		loadSignal('projectile');
		loadUnitImgs();
	}
	gImages['projectile'].img.src = 'img/projectile.png'
	++gImagesCount;
}

function loadUnitImgs() {
	for (let id in gUnits) {
		gImages[id] = { img: new Image() };
		gImages[id].img.onload = () => loadSignal(id);
		gImages[id].img.onerror = () => { gImages[id].img.onerror = null; gImages[id].img.src = 'img/i_' + id + '.png'; };
		if (['Atlas', 'Hedgehog'].includes(id))
			gImages[id].img.src = 'img/' + id + '.png';
		else
			gImages[id].img.src = 'img/' + id + '.webp';
		++gImagesCount;
	}
}
/**
 * @param {string} id
 */
function loadSignal(id) {
	gImages[id].width = gImages[id].img.width;
	gImages[id].height = gImages[id].img.height;
	--gImagesCount;
	if (gImagesCount <= 0 && id !='projectile') {
		gReady = true;
	}
}

/**
 * @param {HTMLDivElement} parentDiv
 * @param {string} where
 * @param {HTMLDivElement} [wrap]
 */
function addSelectionRow(parentDiv, where, wrap) {
	let container;
	let faction;
	if (where == 'top') {
		container = gSetupSelects.top;
		faction = gSetupSelects.factionTop;
	} else {
		container = gSetupSelects.bottom;
		faction = gSetupSelects.factionBottom;
	}

	if (wrap) {
		wrap.innerHTML = '';
	} else {
		wrap = createDiv(parentDiv);
	}

	let newGroup = createDiv(parentDiv, '')

	container.push({
		count: renderCount(wrap),
		select: renderUnitsDropdown(wrap, faction),
		remove: function() {
			wrap.remove();
			this.plus.remove();
		},
		plus: createBtn(newGroup, '+', 'btn', () => addSelectionRow(parentDiv, where, newGroup))
	})
}
/**
 * @param {any} div
 */
function renderCount(div) {
	let count = createInput(div)
	count.type = "number";
	count.min = "1";
	count.max = "10";
	count.value = "5";
	return count;
}

let gSetupSelects = { top: [], bottom: []};
function setup() {
	let setupDiv = document.getElementById('setupDiv');

	createDiv(setupDiv, 'Top army', 'configHead');
	let factionTop = gSetupSelects.factionTop = renderSelectionDropdown(setupDiv, ['Vanguard', 'Infernal', 'Celestial', 'Other'])
	let topWrap = createDiv(setupDiv);
	factionTop.addEventListener('change', () => { gSetupSelects.top.forEach(s => s.remove()); gSetupSelects.top = []; addSelectionRow(topWrap, 'top'); checkUnitAbilities(); })
	addSelectionRow(topWrap, 'top')

	gSetupSelects.configTopDiv = createDiv(setupDiv);
	createDiv(gSetupSelects.configTopDiv, 'Config top', 'configHead')

	createDiv(setupDiv, 'Bottom army', 'configHead');
	let factionBottom = gSetupSelects.factionBottom = renderSelectionDropdown(setupDiv, ['Vanguard', 'Infernal', 'Celestial', 'Other'])
	let bottomWrap = createDiv(setupDiv);
	factionBottom.addEventListener('change', () => { gSetupSelects.bottom.forEach(s => s.remove()); gSetupSelects.bottom = []; addSelectionRow(bottomWrap, 'bottom'); checkUnitAbilities(); })
	addSelectionRow(bottomWrap, 'bottom')

	gSetupSelects.configBottomDiv = createDiv(setupDiv);
	createDiv(gSetupSelects.configBottomDiv, 'Config bottom', 'configHead')

	gSetupSelects.btnGo = createBtn(createDiv(setupDiv, '', 'spaced'), 'Go', 'btn')
	gSetupSelects.btnGo.onclick = setupComplete;
}

function setupComplete(){
	if (!gReady) return alert('Not ready or error');

	checkConfig();

	gMapUnits = [];

	let startingX = 3;
	let posX = startingX;
	let posY = 3;
	for (let {count, select} of gSetupSelects.top) {
		let _count = +count.value;

		let name = select.value;
		let unit = gUnits[name];
		let s = unit.size || 1.5;

		for (let i = 0; i < _count; ++i) {
			gMapUnits.push(new Unit(0, name, posX, posY, gConfig.unitConfigPlayer0));
			posX += s * 1.05;
			if (posX > 15) {
				posX = startingX;
				posY += unit.size * 1.1;
			}
		}
	}
	
	/////////

	posX = startingX;
	posY = 13;

	for (let { count, select } of gSetupSelects.bottom) {
		let _count = +count.value;

		let name = select.value;
		let unit = gUnits[name];
		let s = unit.size || 1.5;

		for (let i = 0; i < _count; ++i) {
			gMapUnits.push(new Unit(1, name, posX, posY, gConfig.unitConfigPlayer1));
			posX += s * 1.05;
			if (posX > 15) {
				posX = startingX;
				posY -= unit.size * 1.1;
			}
		}
	}

	lastTime = 0;
	gameLoop(0);
}

function checkConfig() {
	gConfig.unitConfigPlayer0 = getConfigData(gSetupSelects.configArrayTop)
	gConfig.unitConfigPlayer1 = getConfigData(gSetupSelects.configArrayBottom)
	/**
     * @param {{ div: HTMLDivElement; checkbox: HTMLInputElement; data: { name: string, desc: string, value: any, implemented: boolean };  }[]} configArray
     */
	function getConfigData(configArray) {
		let config = {};
		for (let conf of configArray) {
			if (conf.checkbox.checked && conf.data.implemented !== false) {
				config[conf.data.name] = { desc: conf.data.desc };
			}
		}
		return config;
	}
}

/*
//gMapUnits.push(new Unit(0, 'Lancer', 2, 2));
	//gMapUnits.push(new Unit(0, 'Lancer', 4, 2));
	//gMapUnits.push(new Unit(0, 'Lancer', 6, 2));
	////
	//gMapUnits.push(new Unit(1, 'Seraphim', 2, 12));
	//gMapUnits.push(new Unit(1, 'Seraphim', 4.5, 12));
	//gMapUnits.push(new Unit(1, 'Seraphim', 7, 12));
	/*
	let posX = 1;
	let posY = 1;
	for (let it in gUnits) {
		let unit = gUnits[it];
		let s = unit.size || 1.5;
		if (unit.faction != 'c') continue;

		gMapUnits.push(new Unit(0, it, posX, posY));
		posX += s;
		if (posX > 15) {
			posX = 1;
			posY += 3.5;
		}
	}
 */

/**
 * @param {HTMLElement} parent
 * @param {any[]} choices
 */
function renderSelectionDropdown(parent, choices) {
	let select = document.createElement('select')
	parent.appendChild(select);

	choices.forEach((/** @type {string} */ choice) => {
		const option = document.createElement("option");
		option.text = choice;
		option.value = choice;
		select.add(option);
	});
	return select;
}

/**
 * @param {any} parent
 * @param {{ value: any; }} factionSelect
 */
function renderUnitsDropdown(parent, factionSelect) {
	if (factionSelect && !factionSelect.value) return;
	let choices = [];
	switch(factionSelect.value) {
		case 'Vanguard': choices = getFactionUnits('v'); break;
		case 'Infernal': choices = getFactionUnits('i'); break;
		case 'Celestial': choices = getFactionUnits('c'); break;
		case 'Other': choices = ['Weak dummy','Tough dummy'];
			break;
	}
	
	let result = renderSelectionDropdown(parent, choices);
	result.addEventListener('change', checkUnitAbilities);
	return result
}

function checkUnitAbilities() {
	if (!gSetupSelects.configArrayTop) gSetupSelects.configArrayTop = [];
	if (!gSetupSelects.configArrayBottom) gSetupSelects.configArrayBottom = [];
	let unitsMap = {};
	for (let { select } of gSetupSelects.top) {
		let name = select.value;
		unitsMap[name] = 1;
	}
	let configs = [];
	for (let name in unitsMap) {
		if (gUnitsSpecialsImpl[name] && gUnitsSpecialsImpl[name].configOptions) {
			configs.push(...gUnitsSpecialsImpl[name].configOptions);
		}
	}
	renderUnitAbilitiesConfigs(configs, gSetupSelects.configTopDiv, gSetupSelects.configArrayTop);

	// bottom
	unitsMap = {};
	for (let { select } of gSetupSelects.bottom) {
		let name = select.value;
		unitsMap[name] = 1;
	}
	configs = [];
	for (let name in unitsMap) {
		if (gUnitsSpecialsImpl[name] && gUnitsSpecialsImpl[name].configOptions) {
			configs.push(...gUnitsSpecialsImpl[name].configOptions);
		}
	}
	renderUnitAbilitiesConfigs(configs, gSetupSelects.configBottomDiv, gSetupSelects.configArrayBottom);
}

/**
 * @param {string | any[]} configs
 * @param {any} configDiv
 * @param {{ div: HTMLDivElement; checkbox: HTMLInputElement; data: any; }[]} configArray
 */
function renderUnitAbilitiesConfigs(configs, configDiv, configArray) {
	// configs is new list, check against old list
	let remove = [];
	for (let conf of configArray) {
		if (configs.includes(conf.data)) {
			arrayRemoveObj(configs, conf.data);
			continue;
		}
		// remove if doesn't appear on new list
		conf.div.remove();
		remove.push(conf);
	}
	for (let c of remove) {
		arrayRemoveObj(configArray, c);
	}
	// add missing
	for (let conf of configs) {
		let row = createDiv(configDiv);
		let checkbox = createCheckbox(row, conf.value, '');
		let configName = createDiv(row, conf.name, 'unitConfig');
		
		configArray.push({ div: row, checkbox, data: conf })
		if (conf.implemented === false) {
			configName.classList.add("disabledConfig")
			checkbox.disabled = true;
			createSpan(configName, "not implemented", 'unitConfigTooltip');
		} else {
			createSpan(configName, conf.desc, 'unitConfigTooltip');
		}
	}
}

/**
 * @param {number} timestamp
 */
function gameLoop(timestamp) {
	let deltaTimeMs = (timestamp - lastTime);
	gCurrentTime = Date.now();
	lastTime = timestamp;
	if (deltaTimeMs > 125) deltaTimeMs = 125;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	gMapUnits.forEach(u => u.update(deltaTimeMs));
	//let to = [{x:200, y:100}, {x:300, y:100}, {x:400, y:300}];
		
	//gMapUnits.forEach( (unit, i)=> {
	//	drawUnit(unit, gImages[(i%2?'Argent':'Gaunt')].img);
	//	if(unit.x != to[i].x && unit.y != to[i].y)
	//		moveUnit(unit, to[i], deltaTime);
	//})
		
//	if(gImages['projectile']){
//	let projectile = gImages['projectile'].img;
//	//console.log(100+10*deltaTime, 100-20*deltaTime);
////		ctx.drawImage(projectile, 100+10*timestamp/1000, 100-20*timestamp/1000, projectile.width, projectile.height);
//	}
	requestAnimationFrame(gameLoop);
}

loadImgs();
setup();

let gUnitsSpecialsImpl = {
	"Argent": {
		configOptions: [
			{ name: "High Energy", desc: "Allows Argents to use High Energy, to deal 100% increased damage for 10 energy.", value: true },
			{ name: "Longshot Module", desc: "Gives Argents +3 range", value: false },
			{ name: "Photo-Capacitors", desc: "Argents +20 energy", value: false }],
	},
	"Gaunt": {
		configOptions: [
			{ name: "Bouncing Bone Axes", desc: "Attacks bounce twice, dealing 25% damage", value: true },
			{ name: "Plague Axe", desc: "Attacked units within Shroud are infected with Infest.", value: false, implemented: false },
			{ name: "Reaper's Rush", desc: "30% increased movement speed", value: false }
		]
	},
	"Atlas": {
		configOptions: [
			{ name: "Deploy BFG", desc: "", value: false, implemented: false },
			{ name: "Purification Ordnance", desc: "This unit's attacks deal area damage in a circle.", value: true, implemented: false },
			{ name: "Plasma Arc Infusion", desc: "On-Hit: Lights the ground on fire, dealing 20 damage per second to all units standing in the fire for 5 seconds.", value: false, implemented: false },
		]
	},
	"BOB": {
		configOptions: [
			{ name: "Repair", desc: "Restores health to mechanical units and structures.", value: true, implemented: false },
		]
	},
	"Lancer": {
		configOptions: [
			{ name: "Fortified Impaler", desc: "This units attacks deal area damage in a line.", value: true, implemented: false },
			{ name: "Kinetic Redirection", desc: "On-Damaged: Increases this unit's attack and movement speed by 5% for 5 seconds. Max 50%.", value: false, implemented: false },
			{ name: "Mitigative Guard", desc: "On-Damaged: Damage reduced by 2.", value: false, implemented: false },
		]
	},
	"SCOUT": {
		configOptions: [
			{ name: "Pounce", desc: "Intercepts a nearby enemy unit, increasing this unit's movement speed by 25% and dealing 15 (+15 vs Light) bonus damage on impact.", value: true, implemented: false },
			{ name: "Vorillium Claws", desc: "Increased damage against Light units by +8.", value: false, implemented: false },

		]
	},
	"Exo": {
		configOptions: [
			{ name: "Quickdraw Hustle", desc: "On-Attack: Gains 25% bonus movement speed for 2 seconds.", value: false, implemented: false },
			{ name: "Survival Protocol", desc: "This unit can negate fatal damage once every 120 seconds.", value: false },
		]
	},
	"MedTech": {
		configOptions: [
			{ name: "Med Patch", desc: "", value: true, implemented: false },
			{ name: "Nanoswarm", desc: "", value: false, implemented: false },
			{ name: "System Shock", desc: "", value: false, implemented: false },
		]
	},
	"Hedgehog": {
		configOptions: [
			{ name: "Hunker Down", desc: "", value: true, implemented: false },
			{ name: "Spine Up", desc: "", value: true, implemented: false },
			{ name: "Transonic Boosters", desc: "+2/+4 weapon range.", value: false, implemented: false },
			{ name: "Rocket Ammo", desc: "This unit uses ammo to attack and slowly recharges its ammo over time.", value: false, implemented: false },
		]
	},
	"Vulcan": {
		configOptions: [
			{ name: "Jump Jets", desc: "", value: true, implemented: false },
			{ name: "Vulcan Barrage", desc: "", value: false, implemented: false },
			{ name: "Peak Performance", desc: "", value: false, implemented: false },
			{ name: "Attack winding up", desc: "Phase 1 damage: 3 (+3 vs Light), Phase 2 damage: 4 (+4 vs Light), Phase 3 damage: 6 (+6 vs Light). Loses windup after 1 second of not attacking.", value: true},
		]
	},
	"Brute": {
		configOptions: [
			{ name: "Sunder Soul", desc: "", value: true, implemented: false },
			{ name: "Soulforge Ascendance", desc: "", value: false, implemented: false },
			{ name: "Sundering Soul Craze", desc: "", value: false, implemented: false },
		]
	},
	"Magmadon": {
		configOptions: [
			{ name: "Trample", desc: "Goes into a rampage, pushing nearby units out of the Magmadon's path and dealing 100 (+80 vs Heavy) damage over 6 seconds to nearby enemy ground units.", value: true, implemented: false },
			{ name: "Consume", desc: "Sacrifice a nearby Felhog or Fiend, recovering 100% of max White Health instantly.", value: true, implemented: false },
			{ name: "Demonhoof Tremors", desc: "Allows Trample to periodically stun nearby enemy ground units.", value: false, implemented: false },
			{ name: "Raging Tendons", desc: "25% increased movement speed.", value: false, implemented: false },
		]
	},
	"Hellborne": {
		configOptions: [
			{ name: "Shatter", desc: "This unit's attack shatter on impact, dealing 25% of its primary damage to units behind the target.", value: true, implemented: false },
			{ name: "Molten Touch", desc: "On-Hit: Lights target on fire, dealing 8 damage per second for 3 seconds.", value: false, implemented: false },
		]
	},
	"Hexen": {
		configOptions: [
			{ name: "Skull of Shedda", desc: "", value: true, implemented: false },
			{ name: "Venom Trap", desc: "", value: true, implemented: false },
			{ name: "Miasma", desc: "Covers a target area in bubbling ash and tar. Enemy ground units in the area will be Infested and take 700% bonus damage from Infest. This unit must channel this ability draining 4 energy per second.", value: false, implemented: false },
			{ name: "Shroudweave", desc: "", value: false, implemented: false },
		]
	},
	"Weaver": {
		configOptions: [
			{ name: "Lash", desc: "", value: true, implemented: false },
			{ name: "Consume", desc: "", value: false, implemented: false },
			{ name: "Shroudweave", desc: "", value: false, implemented: false },
			{ name: "Shroudwalk", desc: "", value: false, implemented: false },
		]
	},
	"Imp": {
		configOptions: [
			{ name: "Flame On", desc: "", value: true, implemented: false },
		]
	},
	"Kri": {
		configOptions: [
			{ name: "Roll Out", desc: "", value: false, implemented: false },
			{ name: "Blaze of Light", desc: "", value: true, implemented: false },
			{ name: "Radiant Fury", desc: "", value: false, implemented: false },
		]
	},
	"Cabal": {
		configOptions: [
			{ name: "Debilitate", desc: "", value: true, implemented: false },
			{ name: "Gravity Flux", desc: "", value: false, implemented: false },
			{ name: "Mind Shackle", desc: "", value: false, implemented: false },
		]
	},
	"Seraphim": {
		configOptions: [
			{ name: "Condemnation", desc: "", value: true, implemented: false },
			{ name: "Resolute Seal", desc: "", value: false, implemented: false },
			{ name: "Winged Dash", desc: "", value: true, implemented: false },
			{ name: "Creepbane Guard", desc: "", value: true, implemented: false },
		]
	},
	"Animancer": {
		configOptions: [
			{ name: "Animus Redistribution", desc: "", value: true, implemented: false },
			{ name: "Unseen Veil", desc: "", value: false, implemented: false },
			{ name: "Dark Prophecy", desc: "", value: false, implemented: false },
		]
	},
	"Archangel": {
		configOptions: [
			{ name: "Angelic Descent", desc: "", value: true, implemented: false },
			{ name: "Angelic Ascent", desc: "", value: true, implemented: false },
			{ name: "Meteor Strike", desc: "", value: true, implemented: false },
			{ name: "Avatar", desc: "", value: true, implemented: false },
			{ name: "Scorched Earth", desc: "", value: false, implemented: false },
		]
	},
	"Saber": {
		configOptions: [
			{ name: "Dark Matter Distortion", desc: "This unit's attack deals 50% of its damage to adjacent enemies.", value: true, implemented: false },
		]
	},
	"Vector": {
		configOptions: [
			{ name: "Delta Jump", desc: "", value: true, implemented: false },
			{ name: "Recall", desc: "", value: false, implemented: false },
			{ name: "Trichotomic Barrage", desc: "This unit fires three missles with each attack.", value: true },
			{ name: "Recall Potential", desc: "", value: false, implemented: false },
		]
	},
	"Graven": {
		configOptions: [
			{ name: "Sticky Bomb", desc: "", value: true, implemented: false },
			{ name: "Infiltrate", desc: "", value: true, implemented: false },
			{ name: "Mass Infiltration", desc: "", value: false, implemented: false },
		]
	}
	/*
		configOptions: [
			{ name: "", desc: "", value: false, implemented: false },
		]
		
	*/
}
