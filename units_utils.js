
let gFactionUnitsCache;
function getFactionUnits(faction){
	if(!gFactionUnitsCache) {
		gFactionUnitsCache = {'v':[], 'i':[], 'c':[]};
		for(let unit in gUnits){
			let faction = gUnits[unit].faction;
			gFactionUnitsCache[faction].push(unit);
		}
	}
	return gFactionUnitsCache[faction];
}

let gFactionBuildingsCache;
function getFactionBuildings(faction){
	if(!gFactionBuildingsCache) {
		gFactionBuildingsCache = {'v':[], 'i':[], 'c':[]};
		for(let it in gBuildings){
			let faction = gBuildings[it].faction;
			if(faction){
				gFactionBuildingsCache[faction].push(it);
			}
		}
	}
	return gFactionBuildingsCache[faction];
}

initBuildings();
function initBuildings() {
	if (!window.gBuildings) return;
	for(let it in gBuildings){
		let b = gBuildings[it];
		if(b.upgrades_to){
			for(let up_to of b.upgrades_to){
				let _b = gBuildings[up_to];
				if(!_b.building_requirement_from) _b.building_requirement_from = [];
				_b.building_requirement_from.push(it);
			}
		}
	}
}