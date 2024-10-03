const ACTIONS = {
	GO_MINING_LUMI: 1,
	MINE_LUMI: 2,
	RETURN_LUMI: 3,
	WAIT: 4,
};

const MINING_TIME = {
	//TRAVEL_OUTER: 1745,
	//TRAVEL_INNER: 960,
	TRAVEL_OUTER: 1750,
	TRAVEL_INNER: 980,
};


const RESOURCES = {
	LUMINITE: 0,
	THERIUM: 1
};

const MINE_STATUS = {
	FREE: 0,
	USED: 1,
};


		
class Player{
	constructor(sim, playerId, faction) {
		this.sim = sim;
		this.id = playerId;
		this.faction = faction;
		this.lumi = 0;
		this.ther = 0;
		this.workers = null;
		this.builtBuildings = [];
		this.tmpBobBuildQueue = null;
		this.stats = { totalLumi: 0 };
	}
	
	startupInit(mineId, init_time){
		this.lumi = 150;
		this.stats.totalLumi= 150;
		this.addWorkers(mineId, 8, init_time);
		
		this.builtBuildings = [BuildOrderMechanics.getFactionBasicBuilding(this.faction)];
	}
	
	modifyResource(type, amount){
		switch(type){
			case RESOURCES.LUMINITE: 
				this.lumi += amount;
				if(amount>0) this.stats.totalLumi+= amount;
			break;
			case RESOURCES.THERIUM: this.ther += amount; break;
		}
	}
	
	update(time){
		this.macro(time);
		if(this.workers) this.workers.forEach(w => w.update(time));
	}
	
	setBuildOrder(buildOrder) {
		this.buildOrder = buildOrder;
		this.buildOrderIndex = 0;
	}
	
	macro(time){
		if(this.buildOrder) this.macroBuildOrder(time);
		else this.macroTrivial(time);
	}
	
	macroBuildOrder(time){
		if(this.buildOrderIndex >= this.buildOrder.length){
			this.finishedBuildOrder = true;
			return;
		}
		let item = this.buildOrder[this.buildOrderIndex];
		let success = this.tryToBuild(time, item);
		if(success){
			this.buildOrderIndex++;
		}
	}
	
	tryToBuild(time, BOItem){
		if(BOItem.data.unit) return this.tryToBuildUnit(time, BOItem);
		if(BOItem.data.building) return this.tryToBuildBuilding(time, BOItem);
		return this.doBuildOrderSpecial(time, BOItem);
	}
	
	tryToBuildUnit(time, BOItem){
		let canBuild = true;
		let data = gUnits[BOItem.name];
		if(data.built) {
			let hasOne = false;
			for(let b of data.built)
				if(this.builtBuildings.includes(b)) hasOne = true;
			if(!hasOne) canBuild = false;
		}
		if(data.building_requirement){
			for(let b of data.building_requirement)
				if(!this.builtBuildings.includes(b)) canBuild = false;
		}
		
		console.log('try '+BOItem.name + ': '+canBuild);
		
		if(!canBuild)
			throw { time, BOItem };
		
		// success
		BOItem.time = time;
		return true;
	}
	
	tryToBuildBuilding(time, BOItem){
		let canBuild = true;
		let data = gBuildings[BOItem.name];
		if(data.building_requirement_from) {
			let hasOne = false;
			for(let b of data.building_requirement_from)
				if(this.builtBuildings.includes(b)) hasOne = true;
			if(!hasOne) canBuild = false;
		}
		if(data.building_requirement){
			for(let b of data.building_requirement)
				if(!this.builtBuildings.includes(b)) canBuild = false;
		}
		
		console.log('try '+BOItem.name + ': '+canBuild);
		
		if(!canBuild)
			throw { time, BOItem };
		
		// success
		BOItem.time = time;
		this.scheduleBuilding(time, BOItem);
		return true;
	}
	
	scheduleBuilding(time, BOItem){
		this.builtBuildings.push(BOItem.name);
	}
	
	doBuildOrderSpecial(time, BOItem){
		return true;
	}
	
	macroTrivial(time){
		if(time < this.sim.initialDelayPlayer) return;
		if(!this.tmpBobBuildQueue && this.lumi >= 50 && this.workers.length < 12){
//			console.log('recruit bob '+`${this.id}, ${time}, ${this.tmpBobBuildQueue} && ${this.lumi} && ${this.workers.length}`);
			this.modifyResource(RESOURCES.LUMINITE, -50);
			this.tmpBobBuildQueue = time;
		}
		if(this.tmpBobBuildQueue){
			let timePassed = time - this.tmpBobBuildQueue;
			if(timePassed >= 1000* gUnits["BOB"].buildtime){
//				console.log('bob finished, '+timePassed);
				this.workers.push(new Worker(this.sim, this.id, this.workers[0].mineId, (this.workers.length+1)%4, time));
				this.tmpBobBuildQueue = null;
			}
		}
	}
	
	printDebug(){
		console.log('player +'+this.id+', lumi: '+this.lumi+', total: '+this.stats.totalLumi)
		this.workers.forEach(w => console.log(' worker '+ w.mineSpot + ', mined '+w.lumiHistory + ', MV '+w.time_moving + ', MI '+w.time_mining + ', W '+w.time_waiting ));
	}
	
	addWorkers(mineId, number, init_time){
		this.workers =  Array(number).fill(null).map((_,i) => new Worker(this.sim, this.id, mineId, (i+1)%4, init_time));
	}
}


class Worker{
	constructor(sim, _player, _mineId, _mineSpot, _time){
		this.sim = sim;
		this.player = _player;
		this.mineId = _mineId; // 0 left outer, 1 inner, 2 inner, 3 right outer
		this.mineSpot = _mineSpot;
		this.sim.getMine(this.mineId).addWorker(this.mineSpot);
		this.action = ACTIONS.GO_MINING_LUMI;
		this.actionStartTime = _time;
		this.lumiHistory = 0;
		
		this.time_moving = 0;
		this.time_mining = 0;
		this.time_waiting = 0;
	}
	
	startAction(action, time){
		this.action = action;
		this.actionStartTime = time;
	}
	
	signalMineReady(time){
		let timePassed = time - this.actionStartTime;
		this.time_waiting += timePassed;
		this.sim.getMine(this.mineId).changeSlot(this.mineSpot, MINE_STATUS.USED)
		this.startAction(ACTIONS.MINE_LUMI, time)
	}
	
	update(time){
		let timePassed = time - this.actionStartTime;
		let mine = this.sim.getMine(this.mineId);
		switch(this.action){
			case ACTIONS.GO_MINING_LUMI: {
				let timeNeeded = (this.mineSpot == 0 || this.mineSpot == 3) ? MINING_TIME.TRAVEL_OUTER : MINING_TIME.TRAVEL_INNER;
				if(timePassed >= timeNeeded) {
					if(mine.getSlotState(this.mineSpot) == MINE_STATUS.FREE){
						mine.changeSlot(this.mineSpot, MINE_STATUS.USED)
						this.startAction(ACTIONS.MINE_LUMI, time)
					}else{
						mine.addWaiting(this.mineSpot, (t) => this.signalMineReady(t));
						this.startAction(ACTIONS.WAIT, time)
					}
					this.time_moving += timePassed;
				}
			}break;
			case ACTIONS.RETURN_LUMI:{
				let timeNeeded = (this.mineSpot == 0 || this.mineSpot == 3) ? MINING_TIME.TRAVEL_OUTER : MINING_TIME.TRAVEL_INNER;
				if(timePassed >= timeNeeded) {
					this.time_moving += timePassed;
					this.sim.getPlayer(this.player).modifyResource(RESOURCES.LUMINITE, 4);
					this.lumiHistory += 4;
					this.startAction(ACTIONS.GO_MINING_LUMI, time)
				}
			}break;
			case ACTIONS.MINE_LUMI:{
				if(timePassed >= mine.miningTime(this.mineSpot)) {
					this.time_mining += timePassed;
					this.startAction(ACTIONS.RETURN_LUMI, time)
					mine.changeSlot(this.mineSpot, MINE_STATUS.FREE, time)
				}
			}break;
			case ACTIONS.WAIT:{
			}break;
		}
	}
}

class Luminite {
	constructor(sim, _id){
		this.sim = sim;
		this.id = _id;
		this.slotsState = new Array(4).fill(MINE_STATUS.FREE);
		this.slotsWorkers = [];
		this.waiting = [[], [], [], []];
		this.signals = 0;
	}
	
	getSlotState(mineSpot) {
		return this.slotsState[mineSpot];
	}
	
	changeSlot(mineSpot, status, opt_time) {
		this.slotsState[mineSpot] = status;
		if(status == MINE_STATUS.FREE && this.waiting[mineSpot].length){
			let callback = this.waiting[mineSpot].shift();
			callback(opt_time);
			this.signals ++;
		}
	}
	
	addWaiting(mineSpot, callback){
		this.waiting[mineSpot].push(callback);
	}
	
	addWorker(mineSpot){
		if(!this.slotsWorkers[mineSpot]) this.slotsWorkers[mineSpot] = 0;
		this.slotsWorkers[mineSpot] ++;
	}
	
	miningTime(mineSpot){
		switch(this.slotsWorkers[mineSpot]){
			case 1: return 1500;
			case 2: return 2000;
			case 3: return 1500;
			case 4: return 1500;
		}
	}
	
}