const canvas = document.getElementById('gameCanvas');
// @ts-ignore
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
 * @param {boolean} [dont_add_plus]
 */
function addSelectionRow(parentDiv, where, wrap, dont_add_plus) {
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

	let newGroup = dont_add_plus ? null : createDiv(parentDiv, '')

	let item = {
		count: renderCount(wrap),
		select: renderUnitsDropdown(wrap, faction),
		remove: function () {
			wrap.remove();
			this.plus.remove();
		},
		plus: dont_add_plus ? null : createBtn(newGroup, '+', 'btn', () => addSelectionRow(parentDiv, where, newGroup))
	}
	container.push(item)
	return item;
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
	let topWrap = gSetupSelects.topWrap = createDiv(setupDiv);
	factionTop.addEventListener('change', () => { gSetupSelects.top.forEach(s => s.remove()); gSetupSelects.top = []; addSelectionRow(topWrap, 'top'); checkUnitAbilities(); })
	addSelectionRow(topWrap, 'top')

	gSetupSelects.configTopDiv = createDiv(setupDiv);
	createDiv(gSetupSelects.configTopDiv, 'Config top', 'configHead')

	createDiv(setupDiv, 'Bottom army', 'configHead');
	let factionBottom = gSetupSelects.factionBottom = renderSelectionDropdown(setupDiv, ['Vanguard', 'Infernal', 'Celestial', 'Other'])
	let bottomWrap = gSetupSelects.bottomWrap =createDiv(setupDiv);
	factionBottom.addEventListener('change', () => { gSetupSelects.bottom.forEach(s => s.remove()); gSetupSelects.bottom = []; addSelectionRow(bottomWrap, 'bottom'); checkUnitAbilities(); })
	addSelectionRow(bottomWrap, 'bottom')

	gSetupSelects.configBottomDiv = createDiv(setupDiv);
	createDiv(gSetupSelects.configBottomDiv, 'Config bottom', 'configHead')

	gSetupSelects.btnGo = createBtn(createDiv(setupDiv, '', 'spaced'), 'Go', 'btn')
	gSetupSelects.btnGo.onclick = setupComplete;

	let downBtns = createDiv(setupDiv, '', 'spaced')
	gSetupSelects.btnGo = createBtn(downBtns, 'Share-link', 'btn')
	gSetupSelects.btnGo.onclick = Serialization.doShareLink;
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

class Serialization {

	static doShareLink() {
		let state = JSON.stringify(Serialization.serialize());
		let encoded = Serialization.encode(state);
		console.log('serialize: ' + state + ', encoded: ' + encoded)
		const url = new URL(window.location.href);
		url.searchParams.set('q', encoded);
		window.history.replaceState({}, '', url);

		navigator.clipboard.writeText(window.location.href);
	}

	static parseShareLink() {
		const url = new URL(window.location.href);
		const param = url.searchParams.get('q');
		if (!param) return;
		let decoded = Serialization.decode(decodeURIComponent(param));
		try {
			let state = JSON.parse(decoded);
			console.log('deserialize: ', state, ', decode: ' + decoded + ', url: ' + param);
			Serialization.deserialize(state)
		} catch (e) {
		}
	}

	static encode(str) {
		return btoa(str);
	}

	static decode(str) {
		return atob(str);
	}

	static serialize() {
		return {
			...Serialization.serializeConfig(),
			...Serialization.serializeUnits(),
		};
	}

	static deserialize(save) {
		Serialization.deserializeFaction(save);
		Serialization.deserializeUnits(save);
		checkUnitAbilities();
		Serialization.deserializeConfig(save);
	}

	static serializeUnits() {
		let units_t = [];
		for (let { count, select } of gSetupSelects.top) {
			let _count = +count.value;
			let name = select.value;
			units_t.push([_count, gUnitsSpecials[name].compressionSymbol]);
		}

		let units_b = [];
		for (let { count, select } of gSetupSelects.bottom) {
			let _count = +count.value;
			let name = select.value;
			units_b.push([_count, gUnitsSpecials[name].compressionSymbol]);
		}
		return { ut: units_t, ub: units_b };
	}

	static deserializeUnits(save) {
		gSetupSelects.topWrap.innerHTML = '';
		gSetupSelects.bottomWrap.innerHTML = '';
		gSetupSelects.top = [];
		Serialization.deserializeUnitsImpl(save.ut, 'top', gSetupSelects.topWrap)
		gSetupSelects.bottom = [];
		Serialization.deserializeUnitsImpl(save.ub, 'bottom', gSetupSelects.bottomWrap)
	}

	static decodeCompressionSymbol_unit(symbol) {
		for (let it in gUnitsSpecials) {
			let elem = gUnitsSpecials[it];
			if (elem.compressionSymbol == symbol) return it;
		}
	}

	static deserializeUnitsImpl(save, where, wrap) {
		for (let i = 0; i < save.length; ++i) {

			let [_count, compressionSymbol] = save[i];
			let row = addSelectionRow(wrap, where, null, (i != save.length - 1 ? true : false));
			row.count.value = _count;
			row.select.value = Serialization.decodeCompressionSymbol_unit(compressionSymbol);
		}
	}

	static serializeConfig() {
		return {
			ct: Serialization.serializeConfigImpl(gSetupSelects.configArrayTop),
			cb: Serialization.serializeConfigImpl(gSetupSelects.configArrayBottom),
			ft: Serialization.serializeFactionStr(gSetupSelects.factionTop.value),
			fb: Serialization.serializeFactionStr(gSetupSelects.factionBottom.value),
		}
	}

	static serializeConfigImpl(configArray) {
		let save = [];
		for (let conf of configArray) {
			if (conf.checkbox.checked && conf.data.implemented !== false) {
				save.push(conf.data.compressionSymbol);
			}
		}
		return save;
	}
	static serializeFactionStr(faction) {
		switch (faction) {
			case 'Vanguard': return 'v';
			case 'Infernal': return 'i';
			case 'Celestial': return 'c';
			case 'Other': return 'o';
		}
	}
	static deserializeFactionStr(faction) {
		switch (faction) {
			case 'v': return 'Vanguard';
			case 'i': return 'Infernal';
			case 'c': return 'Celestial';
			case 'o': return 'Other';
		}
	}
	static deserializeFaction(save) {
		gSetupSelects.factionTop.value = Serialization.deserializeFactionStr(save.ft);
		gSetupSelects.factionBottom.value = Serialization.deserializeFactionStr(save.fb);
	}
	static deserializeConfig(save) {
		if (!save) return;
		Serialization.deserializeConfigImpl(save.ct, gSetupSelects.configArrayTop);
		Serialization.deserializeConfigImpl(save.cb, gSetupSelects.configArrayBottom);
	}
	static deserializeConfigImpl(save, configArray) {
		if (!save) return;
		for (let conf of configArray) {
			conf.checkbox.checked = save.includes(conf.data.compressionSymbol)
		}
	}
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
		case 'Other': choices = ['Weak dummy','Tough dummy','Smudge'];
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
		if (gUnitsSpecials[name] && gUnitsSpecials[name].configOptions) {
			configs.push(...gUnitsSpecials[name].configOptions);
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
		if (gUnitsSpecials[name] && gUnitsSpecials[name].configOptions) {
			configs.push(...gUnitsSpecials[name].configOptions);
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

	// @ts-ignore
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
Serialization.parseShareLink();