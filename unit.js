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
		// current stats
		this.hp = this.blueprint.health;
		this.armor = this.blueprint.armor;
	}

	update(deltaTimeMs) {
		if (!this.alive) return;

		this.work(deltaTimeMs);
		this.draw(deltaTimeMs);
	}

	aquireTarget(deltaTimeMs) {
		let selectedAttack = this.selectedAttack();
		if (selectedAttack.minimumRange) {
			let { target, distance } = findClosestUnitWithMinimum(this.posX, this.posY, (1 - this.player), selectedAttack.minimumRange)
			if (target && distance < 25) {
				this.attackTarget = target;
			}
		} else {
			let { target, distance } = findClosestUnit(this.posX, this.posY, (1 - this.player))
			if (target && distance < 25) {
				this.attackTarget = target;
			}
		}
		
	}

	selectedAttack() {
		return this.blueprint.attacks[0];
	}

	attack(deltaTimeMs) {
		let selectedAttack = this.selectedAttack();

		let distance = distanceBetween(this, this.attackTarget);
		if (!this.attackTarget.alive) {
			this.attackTarget = null;
			return;
		}
		if (distance > selectedAttack.range) {
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

			const unitSize = this.blueprint.size;
			let size = unitSize * gUnitSizeScaling;

			this.drawCircle(xPos, yPos, size);

			ctx.drawImage(image, xPos, yPos - (size / 5), size, size);

			this.drawHp(xPos, yPos, size);
		} catch (e) {
			gDrawError = true;
			console.log(e);
		}
	}

	drawHp(xPos, yPos, size) {
		const hpBarWidth = 1.5 * gUnitSizeScaling;
		const hpBarHeight = gUnitSizeScaling/8;
		const hpBarX = xPos;
		const hpBarY = yPos - (size / 5) - hpBarHeight - 2; // Position above the sprite

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
		ctx.strokeStyle = 'green';
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();
	}
}

function findClosestUnit(posX, posY, player) {
	let min_distance = 10000000;
	let result = null;
	for (let unit of gMapUnits) {
		if (unit.player != player) continue;
		if (!unit.alive) continue;

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

function findClosestUnitWithMinimum(posX, posY, player, minAllowedDistance) {
	let min_distance = 10000000;
	let result = null;
	for (let unit of gMapUnits) {
		if (unit.player != player) continue;
		if (!unit.alive) continue;

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
	const diffX = unitA.posX - unitB.posX;
	const diffY = unitA.posY - unitB.posY;
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
