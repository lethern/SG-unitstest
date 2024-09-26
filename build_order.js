

class BuildOrder {
	constructor(){
		this.UI = new BuildOrderUI(this);
		this.mechanics = new BuildOrderMechanics(this);
		
		this.recent = [];
		this.buildOrder = [];
	}
	
	initTest(){
		this.mechanics.initFaction('v');
		
		let main = document.getElementById('main');
		
		this.UI.render(main, this.recent);
	}
	
	addBuildOrder(elem){
		this.buildOrder.push(elem);
	}
}

class BuildOrderUI {
	constructor(parent){
		this.parent = parent;
		this.chooseListDiv = null;
		this.selectedListDiv = null;
		this.detailsDiv = null;
		this.tree = null;
		
		this.recentTreeNode = null;
		this.unitsTreeNode = null;
		this.buildingsTreeNode = null;
	}
	
	render(div, recent){
		let chooseList = this.chooseListDiv = createDiv(div, '', 'chooseList');
		this.selectedListDiv = createDiv(div, '', 'selectedList');
		this.detailsDiv = createDiv(div, '', 'detailsDiv');
		
		let M = this.parent.mechanics;
		let units = M.units;
		let buildings = M.buildings;
		
		units = [...units].sort();
		buildings = [...buildings].sort();
		
		this.tree = new Tree();
		let data = [{name:'recent', list: recent},
			{name: 'special', list: [{name: 'label', onclick: (e) => this.treeSpecialClick(e)}]},
			{name: 'units', list: units.map(u => ({name: u, enabled: M.checkRequirement(u), onclick: (e) => this.treeClick(e)}))},
			{name: 'buildings', list: buildings.map(u => ({name: u, enabled: M.checkRequirement(u), onclick: (e) => this.treeClick(e)}))},
			];
		
		this.tree.render(chooseList, data);
		
		this.recentTreeNode = this.tree.nodes[0];
		this.unitsTreeNode = this.tree.nodes[2];
		this.buildingsTreeNode = this.tree.nodes[3];
	}
	
	treeClick(elem){
		if(!this.parent.mechanics.unlockedList.includes(elem.name)){
			this.parent.mechanics.unlockedList.push(elem.name);
			this.checkUnlocked();
		}
		
		let newBOElem = {name: elem.name};
		this.parent.addBuildOrder(newBOElem);
		this.renderBuildOrderElem(newBOElem);
		
		// add recent
		if(!this.parent.recent.includes(elem.name)){
			this.parent.recent.push(elem.name);
			this.tree.createSiblingNode({name: elem.name, onclick: (e)=>this.treeClick(e)}, this.recentTreeNode);
		}
	}
	
	treeSpecialClick(elem){
		switch(elem.name){
			case 'label': {
				let newBOElem = {name: 'x', special: 'label'};
				this.parent.addBuildOrder(newBOElem);
				this.renderBuildOrderElem(newBOElem);
			}break;
		}
	}
	
	checkUnlocked(){
		this.checkUnlockedFrom(this.unitsTreeNode);
		this.checkUnlockedFrom(this.buildingsTreeNode);
	}
	
	checkUnlockedFrom(treeNode){
		for(let elem of treeNode.nodes){
			if(!elem.data.enabled && this.parent.mechanics.checkRequirement(elem.data.name)){
				elem.data.enabled = true;
				this.tree.setNodeEnabled(elem, true);
			}
		}
	}

	renderBuildOrderElem(elem){
		if(!elem.special){
			createDiv(this.selectedListDiv, elem.name, 'selectedListElem');
		}else{
			createDiv(this.selectedListDiv, elem.name, 'selectedListSpecial');
		}
	}

}

class BuildOrderMechanics {
	constructor(){
		this.parent = parent;
		this.units = null; // list of all units to display
		this.buildings = null; // list of all buildings to display
		this.unlockedList = [];
	}
	
	initFaction(faction){
		this.units = getFactionUnits(faction);
		this.buildings = getFactionBuildings(faction);
		this.initBasicUnlock(faction);
	}
	
	initBasicUnlock(faction){
		switch(faction){
			case 'v': this.unlockedList.push('Command Post'); break;
			case 'i': this.unlockedList.push('Shrine'); break;
			case 'c': this.unlockedList.push('Arcship'); break;
		}
	}
	
	checkRequirement(name){
		let elem = gUnits[name];
		if(!elem) elem = gBuildings[name];
		if(!elem) return;
		
		let enabled = true;
		if(elem.building_requirement){
			for(let b of elem.building_requirement)
				if(!this.listContainsName(this.unlockedList, b))
					enabled = false;
		}
		if(elem.built){
			let has_any = false;
			for(let b of elem.built)
				if(this.listContainsName(this.unlockedList, b))
					has_any = true;
			if(!has_any)
				enabled = false;
		}
		console.log(name, enabled);
		return enabled;
	}

	listContainsName(list, elem){
		return list && list.includes(elem);
	}
}


let BO = new BuildOrder();
BO.initTest();
