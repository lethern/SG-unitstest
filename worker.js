class Worker{
	constructor(_player, _mineId, _mineSpot, _time){
		this.player = _player;
		this.mineId = _mineId; // 0 left outer, 1 inner, 2 inner, 3 right outer
		this.mineSpot = _mineSpot;
		getMine(this.mineId).addWorker(this.mineSpot);
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
		getMine(this.mineId).changeSlot(this.mineSpot, MINE_STATUS.USED)
		this.startAction(ACTIONS.MINE_LUMI, time)
	}
	
	update(time){
		let timePassed = time - this.actionStartTime;
		let mine = getMine(this.mineId);
		switch(this.action){
			case ACTIONS.GO_MINING_LUMI: {
				let timeNeeded = (this.mineSpot == 0 || this.mineSpot == 3) ? MINING_TIME.TRAVEL_OUTER : MINING_TIME.TRAVEL_INNER;
//						console.log(`${timePassed} vs ${timeNeeded}`);
				if(timePassed >= timeNeeded) {
					/**///console.log(`start at ${time}`);
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
					/**///console.log(`returned at ${time}`);
					this.time_moving += timePassed;
					getPlayer(this.player).modifyResource(RESOURCES.LUMINITE, 4);
					this.lumiHistory += 4;
					this.startAction(ACTIONS.GO_MINING_LUMI, time)
				}
			}break;
			case ACTIONS.MINE_LUMI:{
				if(timePassed >= mine.miningTime(this.mineSpot)) {
					/**///console.log(`mined at ${time}`);
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