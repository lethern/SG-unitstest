
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