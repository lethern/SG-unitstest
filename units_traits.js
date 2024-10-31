class UnitsTraits {
	static onDpsCalc(unit, calc_dmg) {
		// after bonus, before armor
		switch (unit.blueprint.name) {
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
		// ATTACKER
		switch (unit.blueprint.name) {
			case 'Gaunt':
				if (unit.unitConfig["Bouncing Bone Axes"]) {
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
				}
				break;
			case 'Vector':
				if (unit.unitConfig["Trichotomic Barrage"]) {
					// 2 additional attacks
					target.changeHp(-calc_dmg);
					target.changeHp(-calc_dmg);
					console.log('Vector deals 3 attacks (two times extra ' + (calc_dmg).toFixed(2)+')')
				}
				break;
		}

		// TARGET
		switch (target.blueprint.name) {
			case 'Lancer':
				if (target.unitConfig["Mitigative Guard"]) {
					calc_dmg -= 2;
					if (calc_dmg < 0) calc_dmg = 0;
				}
				break;
		}
		
	}

	static onRangeCalc(unit, attack) {
		let range = attack.range;
		switch (unit.blueprint.name) {
			case 'Argent':
				if (unit.unitConfig["Longshot Module"]) {
					if (unit.energy >= 10) {
						range += 3;
					}
				}
				break;
		}
		return range;
	}

	static onConstructor(unit) {
		switch (unit.blueprint.name) {
			case 'Argent':
				if (unit.unitConfig["Photo-Capacitors"]) {
					unit.energy += 20;
					unit.max_energy += 20;
				}
				break;
			case 'Gaunt':
				if (unit.unitConfig["Reaper's Rush"]) {
					unit.speed *= 1.3;
				}
				break;
		}
	}

	static onChangeHp(unit, hp_change) {
		switch (unit.blueprint.name) {
			case 'Exo':
				if (hp_change < 0 &&
						(unit.hp + hp_change) < 0 &&
						unit.unitConfig["Survival Protocol"] &&
						unit.isCooldownReady("Survival Protocol"))
				{
					hp_change = 0;
					unit.setCooldown("Survival Protocol", 120)
				}
				break;
		}
		return hp_change;
	}

	static onGetAttackDmg(unit, attack) {
		let dmg = attack.damage;
		switch (unit.blueprint.name) {
			case 'Vulcan':
				if (unit.unitConfig["Attack winding up"]) {
					if (unit.isCooldownReady("Attack winding up_0")) {
						unit.setCooldown("Attack winding up_0", 999)
						unit.setCooldown("Attack winding up_1", 0.25 * 6 * 0.9); // wait for 6 attacks. due to timing inaccuracy, reduce by 10%
						unit.setCooldown("Attack winding up_2", 999);
					}
					if (unit.isCooldownReady("Attack winding up_1")) {
						unit.setCooldown("Attack winding up_1", 999)
						unit.setCooldown("Attack winding up_2", 0.25 * 6 * 0.9); // wait for 6 attacks
						unit.setFlag("bonus", 1)
					}
					if (unit.isCooldownReady("Attack winding up_2")) {
						unit.setCooldown("Attack winding up_2", 999)
						unit.setFlag("bonus", 3)
					}
					let bonus = unit.getFlag("bonus")
					if (bonus) {
						dmg += (+bonus);
					}
				}
				break;
		}
		return dmg;
	}

	static onGetAttackBonusDmg(unit, attack, bonus_damage, bonus) {
		switch (unit.blueprint.name) {
			case 'Vulcan':
				let b = unit.getFlag("bonus")
				if (b && bonus_damage=="Light") {
					bonus_damage += (+b);
				}
				break;
		}
		return bonus_damage;
	}
}