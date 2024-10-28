const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gConfig = {
	canMove: true,
};

let gUnitSizeScaling = 45;
let gDrawError = false;

let lastTime = 0;
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
function loadSignal(id) {
	gImages[id].width = gImages[id].img.width;
	gImages[id].height = gImages[id].img.height;
	--gImagesCount;
	if (gImagesCount <= 0 && id !='projectile') {
		gReady = true;
	}
}

function addSelectionRow(parentDiv, where, wrap) {
	let containre;
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

	createDiv(setupDiv, 'Top army');
	let factionTop = gSetupSelects.factionTop = renderSelectionDropdown(setupDiv, ['Vanguard', 'Infernal', 'Celestial'])
	let topWrap = createDiv(setupDiv);
	factionTop.addEventListener('change', () => { gSetupSelects.top.forEach(s => s.remove()); gSetupSelects.top = []; addSelectionRow(topWrap, 'top') })
	addSelectionRow(topWrap, 'top')

	createDiv(setupDiv, 'Bottom army', 'spaced');
	let factionBottom = gSetupSelects.factionBottom = renderSelectionDropdown(setupDiv, ['Vanguard', 'Infernal', 'Celestial'])
	let bottomWrap = createDiv(setupDiv);
	factionBottom.addEventListener('change', () => { gSetupSelects.bottom.forEach(s => s.remove()); gSetupSelects.bottom = []; addSelectionRow(bottomWrap, 'bottom') })
	addSelectionRow(bottomWrap, 'bottom')


	gSetupSelects.btnGo = createBtn(createDiv(setupDiv, '', 'spaced'), 'Go', 'btn')
	gSetupSelects.btnGo.onclick = setupComplete;

	//let wrapTop = createDiv(setupDiv);
	//gSetupSelects.selectTop = renderUnitsDropdown(wrapTop, factionTop)
	//factionTop.addEventListener('change', () => { gSetupSelects.selectTop.remove(); gSetupSelects.selectTop = renderUnitsDropdown(wrapTop, factionTop) })
	//
	//
	//
	//
	//

	//
	

	/*
	createDiv(setupDiv, 'Bottom army', 'spaced');
	let factionBottom = gSetupSelects.factionBottom = renderSelectionDropdown(setupDiv, ['Vanguard', 'Infernal', 'Celestial'])

	let wrapBottom = createDiv(setupDiv);
	gSetupSelects.selectBottom = renderUnitsDropdown(wrapBottom, factionBottom)
	factionBottom.addEventListener('change', () => { gSetupSelects.selectBottom.remove(); gSetupSelects.selectBottom = renderUnitsDropdown(wrapBottom, factionBottom) })
	gSetupSelects.countBottom = createInput(setupDiv)
	gSetupSelects.countBottom.type = "number";
	gSetupSelects.countBottom.min = "1";
	gSetupSelects.countBottom.max = "10";
	gSetupSelects.countBottom.value = "5";

	gSetupSelects.btnGo = createBtn(createDiv(setupDiv, '', 'spaced'), 'Go', 'btn')
	gSetupSelects.btnGo.onclick = setupComplete;
	gSetupSelects.countBottom.value
	*/
}

function setupComplete(){
	if (!gReady) return alert('Not ready or error');

	gMapUnits = [];

	let startingX = 3;
	let posX = startingX;
	let posY = 1;
	for (let {count, select} of gSetupSelects.top) {
		let _count = +count.value;

		let name = select.value;
		let unit = gUnits[name];
		let s = unit.size || 1.5;

		for (let i = 0; i < _count; ++i) {
			gMapUnits.push(new Unit(0, name, posX, posY));
			posX += s * 1.05;
			if (posX > 15) {
				posX = startingX;
				posY += unit.size * 1.1;
			}
		}
	}
	
	/////////

	posX = startingX;
	posY = 11;

	for (let { count, select } of gSetupSelects.bottom) {
		let _count = +count.value;

		let name = select.value;
		let unit = gUnits[name];
		let s = unit.size || 1.5;

		for (let i = 0; i < _count; ++i) {
			gMapUnits.push(new Unit(1, name, posX, posY));
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

function renderSelectionDropdown(parent, choices) {
	let select = document.createElement('select')
	parent.appendChild(select);

	choices.forEach(choice => {
		const option = document.createElement("option");
		option.text = choice;
		option.value = choice;
		select.add(option);
	});
	return select;
}

function renderUnitsDropdown(parent, factionSelect) {
	if (factionSelect && !factionSelect.value) return;
	let choices = [];
	switch(factionSelect.value) {
		case 'Vanguard': choices = getFactionUnits('v'); break;
		case 'Infernal': choices = getFactionUnits('i'); break;
		case 'Celestial': choices = getFactionUnits('c'); break;
	}
	
	return renderSelectionDropdown(parent, choices);
}

function gameLoop(timestamp) {
	let deltaTimeMs = (timestamp - lastTime);
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
