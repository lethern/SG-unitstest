// let gUnitsDiv = document.getElementById("units");
// let gMsgsDiv = document.getElementById("msgs");
// let gTabsContainerDiv = document.getElementById("tabs_container");
// let gTabsDiv = document.getElementById("tabs");
// let gTechDiv = document.getElementById("tech");


class ClickerUnitVisual{
	/** @param {ClickerUnit} parent */
	constructor(parent){
		this.parent = parent;
		this.config = this.parent.config;

		/*
		this.div = addDiv(gUnitsDiv, 'unitRow');
		this.label = addSpan(this.div, 'unitLabel')
		if(this.config.addPerClick)
			this.btn = addBtn(this.div, ()=>this.parent.onClick());

		this.infoPerSecond = addSpan(this.div, 'unitInfo')
		this.infoPerSecond.style.display = "none";
		if(!this.parent.enabled){
			this.div.style.display = "none";
		}
		 */
	}

	show() {
		this.div.style.display = "block";
	}

	updateUI(){
		/*
		this.label.textContent = `${this.parent.userName}: ${gResources.get(this.parent.resourceName).toFixed(0)}`;
		let btnText = this.config.btnLabel || "Buy 1 ";//+this.userName;

		let cost = '';
		if(this.config.clickCost){
			let resources = calculateCostResources(this.config.clickCost, gResources.get(this.parent.resourceName));
			cost = Resources.printResource(resources);
		}

		if(this.btn){
			let string = btnText;
			if(cost) string += ` (${cost})`;
			this.btn.innerText = string;

			if(this.config.clickCost){
				let resources = calculateCostResources(this.config.clickCost, gResources.get(this.parent.resourceName));
				if(gResources.canAfford(resources)) {
					this.btn.classList.add("afordable")
				}else{
					this.btn.classList.remove("afordable")
				}
			}
		}
		if(this.config.addPerSecond && gResources.get(this.parent.resourceName) > 0){
			this.infoPerSecond.innerText = ` + ${Resources.printResource(this.config.addPerSecond, gResources.get(this.parent.resourceName))}`;
			this.infoPerSecond.style.display = "inline-block";
		}

		 */
	}
}

let AlpineObjectMap = {};
function AlpineObject(name){
	if(!AlpineObjectMap[name]){
		let elem = document.getElementById(name);
		if(!elem) throw new Error("AlpineObject: can't find by Id '"+name+"'");
		AlpineObjectMap[name] = Alpine.$data(elem);
	}
	return AlpineObjectMap[name];
}


document.addEventListener('alpine:init', () => {
	Alpine.store('testState', {
		testVariable: 123,
	});

	Alpine.data('mainApp', () => ({

	}))

	Alpine.data('tabs', () => ({
		tabsVisible: true,
		activeTab: 'Main',
		toggleTabsVisible() {
			this.tabsVisible = !this.tabsVisible;
		},
		setActiveTab(tabName) {
			this.activeTab = tabName;
		},
		enableTab(tabName) {
			this.tabs[tabName].enabled = true;
		},
		tabs: {
			"Main": { enabled: true },
			"Tech": { enabled: true },
			"Test": { enabled: false },
		},
	}))

	Alpine.data('clickerUnits', () => ({
		units: [],
		init: function() {
			this.units = gUnits.map(u => u.visual)
		}
	}))

});
