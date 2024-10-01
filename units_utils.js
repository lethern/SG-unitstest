
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