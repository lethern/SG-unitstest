test();

function test(){
	for(let id in gUnits){
		let errors = [];
		let unit = gUnits[id];
		if(!unit.built || !Array.isArray(unit.built)) errors.push('incorrect built, expecting array');
		if(!unit.faction) errors.push('no faction');
		if(!unit.type) errors.push('no type');
		if(!unit.armor_type || !Array.isArray(unit.armor_type)) errors.push('incorrect armor_type, expecting array');
		if(unit.building_requirement && !Array.isArray(unit.building_requirement)) errors.push('incorrect building_requirement, expecting array');
		if(unit.attacks && !Array.isArray(unit.attacks)) errors.push('incorrect attacks, expecting array');
		if(unit.attacks){
			for(let attack of unit.attacks){
				if(!attack.target || !Array.isArray(attack.target)) errors.push('missing target (array) - attack '+attack.name);
				if(attack.bonus && !Array.isArray(attack.bonus)) errors.push('incorrect bonus (array) - attack '+attack.name);
				if(attack.bonus && Array.isArray(attack.bonus)){
					for(let row of attack.bonus){
						for(let it in row){
							if(!['bonus', 'bonus_damage'].includes(it))
								errors.push('unknown entry: '+it+' - bonus '+it+' - attack '+attack.name);
						}
					}
				}
						
				for(let it in attack){
					if(!['name', 'target', 'damage', 'speed', 'bonus', 'range', 'damage_percentage', 'minimumRange'].includes(it))
						errors.push('unknown entry: '+it+' - attack '+attack.name);
				}
			}
		}
		for(let it in unit){
			if(!['displayName', 'built', 'faction', 'subfaction', 'type', 'luminite', 'therium', 'supply',
					'buildtime', 'charge_time', 'speed', 'size', 'health', 'extra_health', 'armor_type', 'armor',
					'energy', 'max_energy', 'energy_rate', 'attacks', 'abilities', 'traits', 'extra_info', 'building_requirement',
					'veterancybonushealth', 'veterancybonusdamage', 'veterancyspecialbonus', 'veterancyxp'].includes(it)){
				errors.push('unknown entry: '+it);
			}
		}
		if(errors.length){
			console.log(id);
			errors.forEach(e => console.log(e));
		}
		
	}
}