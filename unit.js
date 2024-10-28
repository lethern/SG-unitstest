class Unit {
	constructor(player, unitName, posX, posY) {
		this.player = player;
		this.unitName = unitName;
		this.posX = posX + (Math.random() * 0.2) - 0.1;
		this.posY = posY + (Math.random() * 0.2) - 0.1;
		this.blueprint = gUnits[unitName];
		//
		this.alive = true;
		this.attackTarget = null;
		this.attackWaitingMs = null;
		this.valSelectedAttack = null;

		// current stats
		this.hp = this.blueprint.health;
		this.armor = this.blueprint.armor;
		this.type = this.blueprint.type;
	}

	update(deltaTimeMs) {
		if (!this.alive) return;

		this.work(deltaTimeMs);
		this.draw(deltaTimeMs);
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
		let range = selectedAttack.range;
		range += (this.blueprint.size || 1.5)/2
		range += (this.attackTarget.blueprint.size || 1.5)/2
		if (distance > range) {
			this.moveTowards(deltaTimeMs, this.attackTarget.posX, this.attackTarget.posY)
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
	}

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

		let reduction = damageReductionArmor(this.attackTarget.armor)
		calc_dmg /= reduction;

		this.attackTarget.hp -= calc_dmg;
		if (this.attackTarget.hp <= 0) {
			this.attackTarget.alive = false;
		}
	}

	move(deltaTimeMs) {
		if (this.player == 0) {
			this.moveTowards(deltaTimeMs, this.posX, 12);
		} else {
			this.moveTowards(deltaTimeMs, this.posX, 2);
		}
	}

	moveTowards(deltaTimeMs, posX, posY) {
		if (!gConfig.canMove) return;

		const directionX = posX - this.posX;
		const directionY = posY - this.posY;
		const speedScaling = 0.5;

		const distance = Math.sqrt(directionX * directionX + directionY * directionY);

		if (distance > 0.05) {
			const moveX = (directionX / distance) * this.blueprint.speed * deltaTimeMs / 1000 * speedScaling;
			const moveY = (directionY / distance) * this.blueprint.speed * deltaTimeMs / 1000 * speedScaling;
			//console.log(`${moveY} = (${directionY} / ${distance}) * ${this.blueprint.speed} * ${deltaTimeMs / 1000} * ${speedScaling}`)
			this.posX += moveX;
			this.posY += moveY;
		} else {
			this.posX = posX;
			this.posY = posY;
		}
	}

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

			this.drawHp(xPos, renderYPos, size);
		} catch (e) {
			gDrawError = true;
			console.log(e);
		}
	}

	drawHp(xPos, yPos, size) {
		const hpBarWidth = 0.9*size;// 1.5 * gUnitSizeScaling;
		const hpBarHeight = gUnitSizeScaling/8;
		const hpBarX = xPos + size / 2 - hpBarWidth/2;
		const hpBarY = yPos - hpBarHeight - 2;

		const healthRatio = this.hp / this.blueprint.health;

		ctx.fillStyle = 'red';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

		ctx.fillStyle = 'green';
		ctx.fillRect(hpBarX, hpBarY, hpBarWidth * healthRatio, hpBarHeight);
	}

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

function distanceBetween(unitA, unitB) {
	let diffX = unitA.posX - unitB.posX;
	let diffY = unitA.posY - unitB.posY;
	const distance = diffX * diffX + diffY * diffY;
	return Math.sqrt(distance);
}

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

function damageReductionArmor(armor) {
	return 1 + armor / 100;
	//return (armor * 0.01) / (1 + Math.abs(armor) * 0.01);
}
