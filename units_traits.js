class UnitsTraits {
	static onDpsCalc(unit, calc_dmg) {
		switch (unit.blueprint.displayName) {
			case 'Argent':
				if (unit.unitConfig["High Energy"]) {
					if (unit.energy >= 10) {
						unit.changeEnergy(-10);
						calc_dmg *= 2;
					}
				}
				break;
		}
		return calc_dmg;
	}

	static onAttackDealt(unit, target, calc_dmg) {
		switch (unit.blueprint.displayName) {
			case 'Gaunt':
				let close = findClosestUnitsInRange(target.posX, target.posY, target.player, 3.5, ["Ground"], [target]);
				let found = null;
				if (close.length > 0) {
					found = close[0];
					found.changeHp(-calc_dmg * 0.25);

					close = findClosestUnitsInRange(found.posX, found.posY, target.player, 3.5, ["Ground"], [target, found]);

					if (close.length > 0) {
						close[0].changeHp(-calc_dmg * 0.25);
					}
				}
				break;
		}
		
	}

	static onRangeCalc(unit, attack) {
		let range = attack.range;
		switch (unit.blueprint.displayName) {
			case 'Argent':
				if (unit.unitConfig["Research Longshot Module"]) {
					if (unit.energy >= 10) {
						range += 3;
					}
				}
				break;
		}
		return range;
	}

	static onConstructor(unit) {
		switch (unit.blueprint.displayName) {
			case 'Argent':
				if (unit.unitConfig["Research Photo-Capacitors"]) {
					unit.energy += 20;
					unit.max_energy += 20;
				}
				break;
		}
	}
}