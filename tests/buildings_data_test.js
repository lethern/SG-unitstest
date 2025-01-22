test();

function test(){
	for(let id in gBuildings){
		let errors = [];
		let unit = gBuildings[id];
		//if(!unit.faction) errors.push('no faction');
		if(unit.subfaction && !Array.isArray(unit.subfaction)) errors.push('incorrect subfaction, expecting array');
		//if(!unit.size) errors.push('no size');
		if(unit.building_requirement && !Array.isArray(unit.building_requirement)) errors.push('incorrect building_requirement, expecting array');
		if(unit.armor_type && !Array.isArray(unit.armor_type)) errors.push('incorrect armor_type, expecting array');
		
		for(let it in unit){
			if(!['name', 'faction', 'subfaction', 'size', 'luminite', 'therium', 'supply', "supply_gained",
					'buildtime', 'upgrades_to', 'building_requirement', 'health', 'extra_health', 'armor_type', 'armor',
					'abilities', 'energy', 'max_energy', 'energy_rate',
					'attacks', 'traits', 'extra_info',
					].includes(it)){
				errors.push('unknown entry: '+it);
			}
		}
		if(errors.length){
			console.log(id);
			errors.forEach(e => console.log(e));
		}
		
	}
}