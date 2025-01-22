class Player{
	//let lumi;
	//let ther;
	constructor(playerId) {
		this.id = playerId;
		this.lumi = 0;
		this.ther = 0;
		this.workers = null;
		this.tmpBobBuildQueue = null;
		this.stats = { totalLumi: 0 };
	}
	startupInit(mineId, init_time){
		this.lumi = 150;
		this.stats.totalLumi= 150;
		this.addWorkers(mineId, 8, init_time);
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
	macro(time){
		if(time < gInitialDelayPlayer) return;
		if(!this.tmpBobBuildQueue && this.lumi >= 50 && this.workers.length < 12){
			console.log('recruit bob '+`${this.id}, ${time}, ${this.tmpBobBuildQueue} && ${this.lumi} && ${this.workers.length}`);
			this.modifyResource(RESOURCES.LUMINITE, -50);
			this.tmpBobBuildQueue = time;
		}
		if(this.tmpBobBuildQueue){
			let timePassed = time - this.tmpBobBuildQueue;
			if(timePassed >= 1000*UNITS.BOB.buildtime){
				console.log('bob finished, '+timePassed);
				this.workers.push(new Worker(this.id, this.workers[0].mineId, (this.workers.length+1)%4, time));
				this.tmpBobBuildQueue = null;
			}
		}
	}
	printDebug(){
		console.log('player +'+this.id+', lumi: '+this.lumi+', total: '+this.stats.totalLumi)
		this.workers.forEach(w => console.log(' worker '+ w.mineSpot + ', mined '+w.lumiHistory + ', MV '+w.time_moving + ', MI '+w.time_mining + ', W '+w.time_waiting ));
	}
	
	addWorkers(mineId, number, init_time){
		this.workers =  Array(number).fill(null).map((_,i) => new Worker(this.id, mineId, (i+1)%4, init_time));
	}
}