class Unit {
	/**
     * @param {number} player
     * @param {string | number} unitName
     * @param {number} posX
     * @param {number} posY
     */
	constructor(player, unitName, posX, posY, unitConfig) {
		this.player = player;
		this.unitName = unitName;
		this.posX = posX + (Math.random() * 0.2) - 0.1;
		this.posY = posY + (Math.random() * 0.2) - 0.1;
		this.blueprint = gUnits[unitName];
		this.unitConfig = unitConfig;
		//
		this.alive = true;
		this.attackTarget = null;
		this.attackWaitingMs = null;
		this.valSelectedAttack = null;

		// current stats
		this.hp = this.blueprint.health;
		this.extra_health = this.blueprint.extra_health;
		this.armor = this.blueprint.armor;
		this.type = this.blueprint.type;
		this.energy = this.blueprint.energy;
		this.max_energy = this.blueprint.energy;
		UnitsTraits.onConstructor(this);
	}

	changeEnergy(change) {
		this.energy += change;
		if (this.energy < 0) this.energy = 0;
		if (this.energy > this.max_energy) this.energy = this.max_energy;
		//UnitsTraits.onChangeEnergy(this);
	}

	changeHp(change) {
		this.hp += change;
		if (this.hp <= 0) {
			this.alive = false;
		}
	}

	update(deltaTimeMs) {
		if (!this.alive) return;

		this.work(deltaTimeMs);
		this.draw();
	}

	aquireTarget(deltaTimeMs) {
		let possibleTargetTypes = this.possibleTargetTypes();

		let { target, distance } = findClosestUnit(this.posX, this.posY, (1 - this.player), possibleTargetTypes)
		if (target && distance < 25) {
			this.attackTarget = target;
			this.valSelectedAttack = this.selectAttackByType(target);
		}

		//let selectedAttack = this.selectedAttack();
		//if (selectedAttack.minimumRange) {
		//	let { target, distance } = findClosestUnitWithMinimum(this.posX, this.posY, (1 - this.player), possibleTargetTypes, selectedAttack.minimumRange)
		//	if (target && distance < 25) {
		//		this.attackTarget = target;
		//		this.valSelectedAttack = this.selectAttackByType();
		//	}
		//}
	}

	possibleTargetTypes() {
		let ground = false;
		let air = false;
		for (let att of this.blueprint.attacks) {
			if (att.target.includes('Ground')) ground = true;
			if (att.target.includes('Air')) air = true;
		}
		let targets = [];
		if (ground) targets.push('Ground');
		if (air) targets.push('Air');
		return targets;
	}

	selectedAttack() {
		//return this.blueprint.attacks[0];
		return this.valSelectedAttack;
	}

	/**
     * @param {{ blueprint: { type: any; }; }} unit
     */
	selectAttackByType(unit) {
		for (let att of this.blueprint.attacks) {
			if (att.target.includes(unit.blueprint.type)) return att;
		}
	}

	attack(deltaTimeMs) {
		let selectedAttack = this.selectedAttack();

		let distance = distanceBetween(this, this.attackTarget);
		if (!this.attackTarget.alive) {
			this.attackTarget = null;
			return;
		}
		let range = UnitsTraits.onRangeCalc(this, selectedAttack);
		range += (this.blueprint.size || 1.5)/2
		range += (this.attackTarget.blueprint.size || 1.5)/2
		if (distance > range) {
			this.moveTowards(deltaTimeMs, this.attackTarget.posX, this.attackTarget.posY)
			// remake target
			this.attackTarget = null;
			return;
		}

		if (selectedAttack.minimumRange && selectedAttack.minimumRange > distance) {
			this.attackTarget = null;
			return;
		}

		//this.attackTarget.alive = false;
		if (this.attackWaitingMs) {
			this.attackWaitingMs -= deltaTimeMs;
		}
		if (this.attackWaitingMs <= 0) {
			this.performAttack(selectedAttack);
		}
		var i = 0;
		i === -0;
	}

	/**
     * @param {{ speed: number; damage: number; damage_percentage: number; bonus: {bonus: string; bonus_damage: number;}; }} selectedAttack
     */
	performAttack(selectedAttack){
		this.attackWaitingMs = selectedAttack.speed * 1000;

		let calc_dmg = 0;
		if (selectedAttack.damage) {
			calc_dmg = selectedAttack.damage;
		}
		if (selectedAttack.damage_percentage) {
			calc_dmg = this.attackTarget.blueprint.health * selectedAttack.damage_percentage / 100;
		}

		let matchingBonus = matchingBonusType(selectedAttack, this.attackTarget);
		for (let bonus of matchingBonus) {
			calc_dmg += bonus;
		}

		calc_dmg = UnitsTraits.onDpsCalc(this, calc_dmg);

		let reduction = damageReductionArmor(this.attackTarget.armor)
		calc_dmg /= reduction;

		UnitsTraits.onAttackDealt(this, this.attackTarget, calc_dmg);

		this.attackTarget.changeHp(-calc_dmg)
	}

	/**
     * @param {any} deltaTimeMs
     */
	move(deltaTimeMs) {
		if (this.player == 0) {
			this.moveTowards(deltaTimeMs, this.posX, 12);
		} else {
			this.moveTowards(deltaTimeMs, this.posX, 2);
		}
	}

	/**
     * @param {number} deltaTimeMs
     * @param {number} posX
     * @param {number} posY
     */
	moveTowards(deltaTimeMs, posX, posY) {
		if (!gConfig.canMove) return;

		const directionX = posX - this.posX;
		const directionY = posY - this.posY;
		const speedScaling = 0.5;

		const distance = Math.sqrt(directionX * directionX + directionY * directionY);

		if (distance > 0.05) {
			let moveX = (directionX / distance) * this.blueprint.speed * deltaTimeMs / 1000 * speedScaling;
			let moveY = (directionY / distance) * this.blueprint.speed * deltaTimeMs / 1000 * speedScaling;

			const dx = moveX - posX;
			const dy = moveY - posY;
			const orig_distance = Math.sqrt(dx * dx + dy * dy);

			const newX = this.posX + moveX;
			const newY = this.posY + moveY;

			for (let otherUnit of gMapUnits) {
				if (otherUnit !== this && otherUnit.alive && this.checkCollision({ posX: newX, posY: newY, blueprint: this.blueprint }, otherUnit)) {
					const repelX = newX - otherUnit.posX;
					const repelY = newY - otherUnit.posY;
					const repelDistance = Math.sqrt(repelX * repelX + repelY * repelY);

					if (repelDistance > 0) {
						let repulsionStrengthX = 0.02;
						let repulsionStrengthY = 0.02;
						if (directionX > directionY) repulsionStrengthY = 0.05; else repulsionStrengthX = 0.05;
						moveX += (repelX / repelDistance) * repulsionStrengthX;
						moveY += (repelY / repelDistance) * repulsionStrengthY;
					}
				}
			}

			// after modifying moveX moveY, normalize to be still within distance
			const newDirectionX = moveX - posX;
			const newDirectionY = moveY - posY;

			const newDirectionMagnitude = Math.sqrt(newDirectionX * newDirectionX + newDirectionY * newDirectionY);
			if (newDirectionMagnitude > 0) {
				moveX = posX + (newDirectionX / newDirectionMagnitude) * orig_distance;
				moveY = posY + (newDirectionY / newDirectionMagnitude) * orig_distance;
			}

			this.posX += moveX;
			this.posY += moveY;
		} else {
			this.posX = posX;
			this.posY = posY;
		}
	}

	/**
     * @param {{ posX: any; posY: any; blueprint: any; }} unit1
     * @param {{ posX: number; posY: number; blueprint: { size: any; }; }} unit2
     */
	checkCollision(unit1, unit2) {
		const dx = unit2.posX - unit1.posX;
		const dy = unit2.posY - unit1.posY;
		const distance = Math.sqrt(dx * dx + dy * dy);
		const combinedSize = (unit1.blueprint.size + unit2.blueprint.size) / 2;
		return distance < combinedSize;
	}

	/**
     * @param {any} deltaTimeMs
     */
	work(deltaTimeMs) {
		if (!this.attackTarget) {
			this.aquireTarget(deltaTimeMs);
		}

		if (this.attackTarget) {
			this.attack(deltaTimeMs);
		}
		else {
			this.move(deltaTimeMs);
		}
	}

	draw() {
		if (gDrawError) return;
		try {
			const xPos = this.posX * gUnitSizeScaling;
			const yPos = this.posY * gUnitSizeScaling;
			const image = gImages[this.unitName].img;

			const unitSize = (this.blueprint.size || 1.5);
			let size = unitSize * gUnitSizeScaling;

			this.drawCircle(xPos, yPos, size);

			let renderYPos = yPos - (size / 5);
			if (this.blueprint.type == 'Air') renderYPos -= size / 1;
			ctx.drawImage(image, xPos, renderYPos, size, size);

			this.drawWhiteHp(xPos, renderYPos, size);
			this.drawHp(xPos, renderYPos, size);
			this.drawEnergy(xPos, renderYPos, size);
		} catch (e) {
			gDrawError = true;
			console.log(e);
		}
	}

	drawWhiteHp(xPos, yPos, size) {
		if (!this.blueprint.extra_health) return;
		const hpBarWidth = 0.9*size;
		const hpBarHeight = gUnitSizeScaling/8;
		const hpBarX = xPos + size / 2 - hpBarWidth/2;
		const hpBarY = yPos - hpBarHeight - 2 - gUnitSizeScaling / 8;

		const healthRatio = this.extra_health / this.blueprint.extra_health;

		ctx.fillStyle = 'black';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

		ctx.fillStyle = 'white';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth * healthRatio, hpBarHeight);
	}

	drawHp(xPos, yPos, size) {
		const hpBarWidth = 0.9 * size;
		const hpBarHeight = gUnitSizeScaling / 8;
		const hpBarX = xPos + size / 2 - hpBarWidth / 2;
		const hpBarY = yPos - hpBarHeight - 2 ;

		const healthRatio = this.hp / this.blueprint.health;

		ctx.fillStyle = 'red';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

		ctx.fillStyle = 'green';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth * healthRatio, hpBarHeight);
	}

	drawEnergy(xPos, yPos, size) {
		if (!this.max_energy) return;
		const hpBarWidth = 0.9 * size;
		const hpBarHeight = gUnitSizeScaling / 8;
		const hpBarX = xPos + size / 2 - hpBarWidth / 2;
		const hpBarY = yPos - hpBarHeight - 2 + gUnitSizeScaling / 8;

		const healthRatio = this.energy / this.max_energy;

		ctx.fillStyle = 'black';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

		ctx.fillStyle = 'blue';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth * healthRatio, hpBarHeight);
	}

	/**
     * @param {number} xPos
     * @param {number} yPos
     * @param {number} size
     */
	drawCircle(xPos, yPos, size) {
		ctx.beginPath();
		//ctx.arc(xPos + gridSize / 2, yPos + gridSize / 2, unitRadius, 0, Math.PI * 2);
		ctx.ellipse(xPos + size / 2, yPos + size / 2, size / 2, size / 2 * 0.7, 0, 0, Math.PI * 2);
		ctx.strokeStyle = this.player ? 'red' : '#0000AA';
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
	}
}

/**
 * @param {number} posX
 * @param {number} posY
 * @param {number} player
 * @param {string | any[]} targetTypes
 */
function findClosestUnit(posX, posY, player, targetTypes) {
	let min_distance = 10000000;
	let result = null;
	for (let unit of gMapUnits) {
		if (unit.player != player) continue;
		if (!unit.alive) continue;
		if (!targetTypes.includes(unit.type)) continue;

		const diffX = unit.posX - posX;
		const diffY = unit.posY - posY;
		const distance = diffX * diffX + diffY * diffY;
		if (distance < min_distance) {
			min_distance = distance;
			result = unit;
		}
	}
	return { target: result, distance: Math.sqrt(min_distance) };
}

function findClosestUnitsInRange(posX, posY, player, range, targetTypes, excluded) {
	let result = [];
	for (let unit of gMapUnits) {
		if (unit.player != player) continue;
		if (!unit.alive) continue;
		if (!targetTypes.includes(unit.type)) continue;
		if (excluded.includes(unit)) continue;

		const diffX = unit.posX - posX;
		const diffY = unit.posY - posY;
		const distance = Math.sqrt( diffX * diffX + diffY * diffY);
		if (distance < range) {
			result.push(unit);
		}
	}
	return result;
}

/**
 * @param {number} posX
 * @param {number} posY
 * @param {any} player
 * @param {string | any[]} targetTypes
 * @param {number} minAllowedDistance
 */
function findClosestUnitWithMinimum(posX, posY, player, targetTypes, minAllowedDistance) {
	let min_distance = 10000000;
	let result = null;
	for (let unit of gMapUnits) {
		if (unit.player != player) continue;
		if (!unit.alive) continue;
		if (!targetTypes.includes(unit.type)) continue;

		const diffX = unit.posX - posX;
		const diffY = unit.posY - posY;
		const distance = Math.sqrt(diffX * diffX + diffY * diffY);
		if (distance < min_distance && distance > minAllowedDistance ) {
			min_distance = distance;
			result = unit;
		}
	}
	return { target: result, distance: min_distance };
}

/**
 * @param {{ posX: number; posY: number; }} unitA
 * @param {{ posX: number; posY: number; }} unitB
 */
function distanceBetween(unitA, unitB) {
	let diffX = unitA.posX - unitB.posX;
	let diffY = unitA.posY - unitB.posY;
	const distance = diffX * diffX + diffY * diffY;
	return Math.sqrt(distance);
}

/**
 * @param {{ bonus: any; }} attack
 * @param {{ blueprint: { armor_type: string | any[]; }; }} unit
 */
function matchingBonusType(attack, unit) {
	let matching = [];
	if (attack.bonus) {
		for (let b of attack.bonus) {
			if (unit.blueprint.armor_type.includes[b.bonus])
				matching.push(b.bonus_damage);
		}
	}
	return matching;
}

/**
 * @param {number} armor
 */
function damageReductionArmor(armor) {
	return 1 + (armor || 0) / 100;
	//return (armor * 0.01) / (1 + Math.abs(armor) * 0.01);
}
