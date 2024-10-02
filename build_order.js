

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
		this.chooseListColumnDiv = null;
		this.chooseListDiv = null;
		this.chooseDetailsDiv = null;
		this.selectedListColumnDiv = null;
		this.selectedListDiv = null;
		this.selectedListDetailsDiv = null;
		this.detailsDiv = null;
		this.tree = null;
		
		this.recentTreeNode = null;
		this.unitsTreeNode = null;
		this.buildingsTreeNode = null;
		
		this.currentNodeDetails;
	}
	/*
	Tree Node data:
		name
		type: "node" | special
		unit: true|false
		building: true|false
		enabled: true|false
		onclick
	*/
	
	renderSelectedList(div){
		let wrap = this.selectedListColumnDiv = createDiv(div, '', 'selectedListColumn');
		this.selectedListDetailsDiv = createDiv(wrap, '', 'selectedListDetails');
		this.selectedListDiv = createDiv(wrap, '', 'selectedList');
		this.selectedListDragAndDrop();
		this.selectedListDiv.addEventListener('click', (e)=>{
			if(e.target.draggable) return;
			let node = e.target.closest('.selectedListElem, .selectedListSpecial');
			this.renderSelectedOnClick(node);
		});
	}
	
	renderSelectedOnClick(node){
		if(node._BO){
			this.selectedListDetailsDiv.innerHTML = '';
			createDiv(this.selectedListDetailsDiv, node._BO.name, 'bold');
			
			if(node._BO.data.building) this.renderSelectedOnClick_Building(node, this.selectedListDetailsDiv);
			
		}else{
			// special
			this.selectedListDetailsDiv.textContent = node.textContent;
		}
	}
	
	renderSelectedOnClick_Building(node, div){
		let faction = this.parent.mechanics.faction;
		switch(faction){
			case 'v':
				if(!node._BO.build_with_n_workers) node._BO.build_with_n_workers = 1;
				let row = createDiv(this.selectedListDetailsDiv);
				createSpan(row, "Build with N workers:");
				let inp = createInput(row, node._BO.build_with_n_workers, 'detailsSmallInput');
				inp.addEventListener('input', (e)=>{ let input = e.target; if(isNaN(input.value)) input.value=1; else node._BO.build_with_n_workers = input.value});
				
				if(!node._BO.build_distance) node._BO.build_distance = 1;
				row = createDiv(this.selectedListDetailsDiv);
				createSpan(row, "Build distance:");
				inp = createInput(row, node._BO.build_distance, 'detailsSmallInput');
				inp.addEventListener('input', (e)=>{ let input = e.target; if(isNaN(input.value)) input.value=1; else node._BO.build_distance = input.value});
				
				if(node._BO.use_overcharged === undefined) node._BO.use_overcharged = false;
				row = createDiv(this.selectedListDetailsDiv);
				createSpan(row, "Use Overcharged BOBs:");
				inp = createCheckbox(row, node._BO.use_overcharged, 'detailsSmallInput');
				inp.addEventListener('change', (e)=>{ node._BO.use_overcharged = e.target.checked; });
				
				if(node._BO.use_veterancy === undefined) node._BO.use_overcharged = false;
				row = createDiv(this.selectedListDetailsDiv);
				createSpan(row, "Use Veterancy BOBs:");
				inp = createCheckbox(row, node._BO.use_veterancy, 'detailsSmallInput');
				inp.addEventListener('change', (e)=>{ node._BO.use_veterancy = e.target.checked; });
				
			break;
		}
	}
	
	selectedListDragAndDrop(){
		let container = this.selectedListDiv;
		let buildOrder = this.parent.buildOrder;
		let draggingClone = null;
		let originalElement = null;
		
		this.selectedListDiv.addEventListener('dragstart', (e) => {
			e.preventDefault();

			let elem = e.target.parentElement;
			if(!elem._BO) return;
			originalElement = elem;
			
			const rect = elem.getBoundingClientRect();

			draggingClone = elem.cloneNode(true);
			draggingClone.classList.add('dragging-clone');
			document.body.appendChild(draggingClone);

			draggingClone.style.width = `${rect.width}px`;
			
			draggingClone.style.left = `${e.pageX-30}px`;
			draggingClone.style.top = `${e.pageY - draggingClone.offsetHeight / 2}px`;

			elem.style.opacity = "0";

			document.addEventListener('mousemove', onMouseMove);
			document.addEventListener('mouseup', onMouseUp);
		});

		function getDragAfterElement(container, y) {
			const draggableElements = [...container.childNodes];

			return draggableElements.reduce((closest, child) => {
				const box = child.getBoundingClientRect();
				const offset = y - box.top - box.height / 2;
				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			}, { offset: Number.NEGATIVE_INFINITY }).element;
		}
		function onMouseMove(e) {
			if (draggingClone) {
				draggingClone.style.left = `${e.pageX - 30}px`;
				draggingClone.style.top = `${e.pageY - draggingClone.offsetHeight / 2}px`;
			}
		}
		function onMouseUp(e) {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);

			if (draggingClone) {
				const afterElement = getDragAfterElement(container, e.clientY);

				if (afterElement == null) {
					container.appendChild(originalElement);
				} else {
					container.insertBefore(originalElement, afterElement);
				}
				
				if(originalElement != afterElement)
					moveBOElem(originalElement._BO, afterElement? afterElement._BO:null);
				
				draggingClone.remove();
				draggingClone = null;
				originalElement.style.opacity = "1";
				originalElement = null;
			}
		}
		function moveBOElem(moved, where){
			const elementIndex = buildOrder.indexOf(moved);

			buildOrder.splice(elementIndex, 1);

			if (where === null) {
				buildOrder.push(moved);
			} else {
				const whereIndex = buildOrder.indexOf(where);
				buildOrder.splice(whereIndex, 0, moved);
			}
		}
	}
	
	render(div, recent){
		this.chooseListColumnDiv = createDiv(div, '', 'chooseListColumn');
		this.chooseDetailsDiv = createDiv(this.chooseListColumnDiv, '', 'chooseDetails');
		let chooseList = this.chooseListDiv = createDiv(this.chooseListColumnDiv, '', 'chooseList');
		this.renderSelectedList(div);
		this.detailsDiv = createDiv(div, '', 'detailsDiv');
		
		let M = this.parent.mechanics;
		let units = M.units;
		let buildings = M.buildings;
		let specials = this.getSpecialNodes();
		
		units = [...units].sort();
		buildings = [...buildings].sort();
		
		this.tree = new Tree();
		let data = [{name:'recent', list: recent},
			{name: 'special', list: specials.map(u => ({name: u, type: "special", onclick: (e) => this.treeSpecialClick(e)}))}];
		this.addFactionBtn(data);
		data.push(
			{name: 'units', list: units.map(u => ({name: u, type: "node", unit: true, enabled: M.checkRequirement(u), onclick: (e) => this.treeClick(e)}))},
			{name: 'buildings', list: buildings.map(u => ({name: u, type: "node", building: true, enabled: M.checkRequirement(u), onclick: (e) => this.treeClick(e)}))},
			);
		
		this.tree.render(chooseList, data);
		
		this.addHoverDetails(chooseList);
		
		//this.recentTreeNode = this.tree.nodes[0];
		this.recentTreeNode = this.tree.nodes.find(e => e.data.name == 'recent');
		this.unitsTreeNode = this.tree.nodes.find(e => e.data.name == 'units');
		this.buildingsTreeNode = this.tree.nodes.find(e => e.data.name == 'buildings');
		//this.buildingsTreeNode = this.tree.nodes[4];
	}
	
	addFactionBtn(data){
		let faction = this.parent.mechanics.faction;
		switch(faction){
			case 'v':
				data.push({ name: 'vanguard', list: [
					{name: "Salvage", type: "node", onclick: (e) => this.treeClick(e) },
					{name: "B.O.B Overcharge", type: "node", onclick: (e) => this.treeClick(e) },
					{name: "Sensor Drone", type: "node", onclick: (e) => this.treeClick(e) },
					{name: "Shields Up!", type: "node", onclick: (e) => this.treeClick(e) },
					{name: "Promote", type: "node", onclick: (e) => this.treeClick(e) },
				]});
			break;
		}
	}
	
	addHoverDetails(div){
		div.addEventListener('mouseover', (e)=>this.onHoverDetails(e));
	}
	
	onHoverDetails(event){
		let node = null;
		let domElem = event.target;
		while(!node && domElem){
			node = domElem._node;
			domElem = domElem.parentElement;
		}
		if(!node || !node.data || node.data.type != "node") return;
		if(node != this.currentNodeDetails){
			this.currentNodeDetails = node;
			if(!node.data.name) return;
			this.printChooseDetails(node);
		}
	}
	
	printChooseDetails(node){
		let printString = '';
		let name = node.data.name;
		
		let unit = gUnits[name];
		if(!unit) unit = gBuildings[name];
		if(unit){
			this.chooseDetailsDiv.innerHTML = '';
			createDiv(this.chooseDetailsDiv, name, 'detailsName');
			let cost = createDiv(this.chooseDetailsDiv);
			cost.innerHTML = `Lu: <span class='highlight'>${unit.luminite || 0}</span>&nbsp;  Th: <span class='highlight'>${unit.therium || 0}</span>`;
			if(unit.supply) cost.innerHTML += `&nbsp; Supp: <span class='highlight'>${unit.supply}</span>`;
			//, 
			if(unit.built){
				let buildin = createDiv(this.chooseDetailsDiv);
				buildin.innerHTML = "Built in: <span class='buildingName'>"+ unit.built.join('</span>, <span class="buildingName">') 
					+ "</span>";
					+ (unit.buildtime ? `  Time: <span class='highlight'>${unit.buildtime}</span>` : '');
			}
			else if(unit.buildtime){
				cost.innerHTML += `&nbsp; Time: <span class='highlight'>${unit.buildtime}</span>`;
			}
			if(unit.building_requirement){
				let req = createDiv(this.chooseDetailsDiv, '', 'requiredDetails');
				req.innerHTML = "Required: <span class='buildingName'>" 
					+ unit.building_requirement.join("</span>, <span class='buildingName'>")
					+ "</span>";
			}
			if(unit.building_requirement_from){
				let req = createDiv(this.chooseDetailsDiv, '', 'requiredDetails');
				req.innerHTML = "Built from: <span class='buildingName'>" 
					+ unit.building_requirement_from.join("</span>, <span class='buildingName'>")
					+ "</span>";
			}
			
		}
		/*
		let building = gBuildings[name];
		if(building){
			this.chooseDetailsDiv.innerHTML = '';
			createDiv(this.chooseDetailsDiv, name, 'detailsName');
			let cost = createDiv(this.chooseDetailsDiv);
			cost.innerHTML = `Lu: <span class='highlight'>${unit.luminite || 0}</span>&nbsp;  Th: <span class='highlight'>${unit.therium || 0}</span>`;
			if(unit.supply) cost.innerHTML += `&nbsp; Supp: <span class='highlight'>${unit.supply}</span>`;
			//, 
			if(unit.building_requirement){
				let req = createDiv(this.chooseDetailsDiv, '', 'requiredDetails');
				req.innerHTML = "Required: <span class='buildingName'>" 
					+ unit.building_requirement.join("</span>, <span class='buildingName'>")
					+ "</span>";
			}			
		}
		*/
		
	}
	
	getSpecialNodes(){
		return ['label', 'transfer worker'];
	}
	
	treeClick(elem){
		if(!this.parent.mechanics.unlockedList.includes(elem.name)){
			this.parent.mechanics.unlockedList.push(elem.name);
			this.checkUnlocked();
		}
		
		let newBOElem = {name: elem.name, data: elem};
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
			case 'transfer': {
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
			let div = createDiv(this.selectedListDiv, '', 'selectedListElem');
			elem.div = div;
			div._BO = elem;
			
			let time = createSpan(div, '00:00', 'timeInfo');
			
			let drag = createSpan(div, '☰', 'dragHandle');
			drag.draggable= true;
			createSpan(div, elem.name, 'name');
			createSpan(div, '', 'info');
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
		this.faction = faction;
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
