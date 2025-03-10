let mainDiv = document.getElementById("main");
let gUnits = [];
let gTechs = [];

let gVisualsEnabled = 1;
let gPaused = false;

/*
1. zmieniamy klasy zeby rozdzielic logike od visual
 logike musimy miec w jednym miejscu, latwe do edycji, wszystkie tech i mnozniki itd.
2. okreslamy liste "nastepnych celi" (przy czym na samym poczatku moze byc ciezej, bo trzeba
 manualnie wpisac np. 20 lvl #1 i 20 lvl #2
 dalsze cele okreslamy jako np. "kupic tech1"
 cele mają też whitelist innych units ktore mozna kupowac w trakcie czekania
3. jesli aktualny cel nie mozemy zrobic, to algorytm oblicza co jest potrzebne (np. tech1 -> X animus)
 robimy petle, w ktorej kazdy krok to 1 sekunda
  - dodajemy zasoby za te sekunde
  - sprawdzamy czy mozemy kupic cel
  - sprawdzamy czy mozemy kupic inne rzeczy (uwaga: cel powinien miec liste rzeczy, ktore mozemy
	 kupowac. inaczej kupujac losowo, mozemy tracic zasoby ktore probujemy zbierać)
na kazdy cel zapisujemy czas uzyskania i zrzut memory (resources i units)
->
dodajemy nowe elementy
 -sacrifice (poswiecanie units zeby zwiekszyc ich wydajnosc)
 -noble felhog (ale nie robiony z animus, tylko)
 pozniej:
 -impy (resources)
 -jednostki (za resources)
 -expansje (uzywamy jednostek zeby rozszerzac itd.)
->
testujemy timingi:
odpalamy i zmieniamy, az timingi beda pasować
* */

class Resources{
	static resourceNames = {};
	constructor(){
		this.storage = { "animus": 0 };
	}

	add(resource, mult = 1){
		for(let name in resource){
			let amount = resource[name] * mult;
			if(this.storage[name] === undefined){
				if(amount > 0){
					gFirstBuilt(name);
				}
				this.storage[name] = 0;
			}
			this.storage[name] += amount;
		}
	}
	canAfford(resource){
		let result = true;
		for(let name in resource){
			let amount = resource[name];
			if((this.storage[name] || 0) < amount) result = false;
		}
		return result;
	}
	sub(resource){
		for(let name in resource){
			let amount = resource[name];
			this.storage[name] -= amount;
		}
	}
	get(resourceName){
		return this.storage[resourceName] || 0;
	}

	static printResource(resource, mult = 1){
		if(!resource) return '';
		let string = '';
		for(let name in resource){
			let amount = resource[name] * mult;
			if(string) string += ", ";
			let amountStr = amount.toFixed(0);
			if(amount < 1 && amount > 0) amountStr = amount.toFixed(1);

			let name_output = Resources.resourceNames[name] || name;
			string += `${amountStr} ${name_output}`;
		}
		return string;
	}
}

let gResources = new Resources();

function calculateCostResources(cost, level){
	let result = {};
	for(let name in cost.resources){
		let amount = cost.resources[name];
		if(level && cost.multiplier) amount *= Math.pow(cost.multiplier, level);
		result[name] = amount;
	}
	return result;
}





function gUpdate(){
	gUnits.forEach(unit => unit.updateUI());
	gTechs.forEach(tech => tech.updateUI());
}

function gProduce(){
	gUnits.forEach(unit => unit.produce());
}

//function gExtraStuff() {
//	if(!gExtras.tech && gResources.canAfford({"animus": 75})){
//		addTech()
//	}
//}

function gShowMessage(message){
	let wrapper = addDiv(gMsgsDiv)
	let div = addDiv(wrapper, "message")
	let content = addSpan(div, "messageContent", message)
	addBtn(div, ()=>{ gMsgsDiv.removeChild(wrapper); }, "X", "messageClose")
	setTimeout(() => {
		div.style.opacity = "1";
		div.style.transform = "translateY(0)";
	}, 10);
}

let gLastTime = undefined;
let timeFormatter = new Intl.DateTimeFormat('pl-PL', {
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit'
})
function gFirstBuilt(unitName){
	let time = Date.now();
	let dt = 0;
	if(gLastTime){
		dt = time- gLastTime;
	}
	gLastTime = time;
	console.log("first " + unitName + " on " + (timeFormatter.format(time)) + ", "+ (dt/1000));
}



/*
	class TechUnit{

		updateUI(){
			if(!this.enabled){
				if(this.canEnable()) this.enable();
				else return;
			}

			if(this.btn.disabled) return;

			let customLabel = this.getCustomLabel();
			if(customLabel){
				this.label.textContent = customLabel;
			}else{
				this.label.textContent = `${this.userName}: ${this.amount.toFixed(0)}`;
            }

			let btnText = this.config.btnLabel || "Buy ";//+this.userName;

			let cost = '';
			let has = [];
			if(this.config.clickCost){
				let resources = calculateCostResources(this.config.clickCost, this.amount);
				cost = Resources.printResource(resources);

				for(let name in this.config.clickCost.resources){
					let name_output = Resources.resourceNames[name] || name;
					has.push(name_output+' '+gResources.get(name));
				}
			}

			if(this.btn){
				let string = btnText;
				if(cost) string += ` (${cost})`;
				this.btn.innerText = string;

				let resources = calculateCostResources(this.config.clickCost, this.amount);
				if(!this.btn.disabled && gResources.canAfford(resources)) {
					this.btn.classList.add("afordable")
				}else{
					this.btn.classList.remove("afordable")
                }

				this.info.innerText = `Got: ${has.join(', ')}`;
			}
		}

		getCustomLabel() {
			switch(this.resourceName){
				case "t_felages":{
					if(this.amount == 1){
                        return "Middle FelAges: done"
                    }else{
						return "Middle FelAges: "
                    }
				}break;
			}
		}
	}
*/
/** @interface */
class IClickerMechanic {
	onClick() {}
	produce() {}
	/** @type {Function | undefined} */
	canEnable() {}
}

/**
 * @implements {IClickerMechanic}
 */
class ClickerTechMechanic{

	constructor(parent){
		this.parent = parent;
		this.config = this.parent.config;
	}

	onClick() {
		let works = true;
		if(this.config.clickCost){
			let resources = calculateCostResources(this.config.clickCost, gResources.get(this.parent.resourceName));

			if(gResources.canAfford(resources)) {
				gResources.sub(resources)
			}else{
				works = false;
			}
		}
		if(works){
			this.onClickPerTech();
		}
	}

	onClickPerTech() {
		switch(this.parent.resourceName){
			case "t_felages":{
				gResources.add(this.parent.resourceName, 1)
				this.amount += 1;
				let visual = this.parent.visual;
				visual.btn.disabled = true;
				visual.btn.classList.remove("afordable")
				visual.info.innerText = '';
				visual.label.textContent = "Middle FelAges: done";

				gResources.add({"tech": 1});
				document.body.classList.add("felages");
			}break;
		}
	}

	produce(){
		if(!this.config.addPerSecond || !gResources.get(this.parent.resourceName)) return;
		gResources.add(this.config.addPerSecond, gResources.get(this.parent.resourceName))
	}
}


/**
 * @implements {IClickerMechanic}
 */
class ClickerUnitMechanic{

	constructor(parent){
		this.parent = parent;
		this.config = this.parent.config;
	}

	onClick() {
		let works = true;
		if(this.config.clickCost){
			let resources = calculateCostResources(this.config.clickCost, gResources.get(this.parent.resourceName));

			if(gResources.canAfford(resources)) {
				gResources.sub(resources)
			}else{
				works = false;
			}
		}
		if(works){
			gResources.add(this.config.addPerClick, 1)
			//gUpdate();
		}
	}

	produce(){
		if(!this.config.addPerSecond || !gResources.get(this.parent.resourceName)) return;
		gResources.add(this.config.addPerSecond, gResources.get(this.parent.resourceName))
	}
}

class ClickerUnit {
	constructor(config, enabled = false){
		this.userName = config.userName;
		this.resourceName = config.resourceName;
		Resources.resourceNames[this.resourceName] = this.userName;

		this.config = config;
		this.enabled = enabled;

		if(gVisualsEnabled)
			this.visual = new ClickerUnitVisual(this);

		/** @type {IClickerMechanic} */this.mechanic = undefined;
		if(config.tech)
			this.mechanic = new ClickerTechMechanic(this);
		else
			this.mechanic = new ClickerUnitMechanic(this);
	}

	enable(){
		if(this.enabled) return;
		if(gVisualsEnabled)
			this.visual.show();
		this.enabled = true;
		if(this.config.unlockCondition && this.config.unlockCondition.message){
			gShowMessage(this.config.unlockCondition.message);
		}
	}

	onClick() {
		this.mechanic.onClick();
	}
	canEnable(){
		if(this.mechanic.canEnable) return this.mechanic.canEnable();
		else return this.canEnableImpl();
	}

	canEnableImpl(){
		let result = false;
		if(this.config.clickCost){
			let resources = calculateCostResources(this.config.clickCost, gResources.get(this.resourceName));
			if(gResources.canAfford(resources)) result = true;
		}
		if(this.config.unlockCondition && this.config.unlockCondition.resources) result = gResources.canAfford(this.config.unlockCondition.resources);
		return result;
	}

	updateUI(){
		if(!this.enabled){
			if(this.canEnable()) this.enable();
			else return;
		}
		if(gVisualsEnabled)
			this.visual.updateUI();
	}

	produce(){
		this.mechanic.produce();
	}
}



function addTech(){
	let div = addDiv(gUnitsDiv, 'unitRow');
	let btn = addBtn(div, ()=>advance(), "Build FelHall (Animus: 100)");
	gExtras.tech = { div, btn };
	function advance(){
		gResources.add({"tech": 1});
		Tabs.addTab('tech');
		gResources.sub({"animus": 100});
		div.style.display = "none";
	}
}


const shroudConfig = {
	userName: "Shroud",
	resourceName: "shroud",
	btnLabel: "Spread Shroud",
	addPerClick: {"shroud": 1}
}
gUnits.push(new ClickerUnit(shroudConfig, true));

const ShroudstoneConfig = {
	userName: "Shroudstone",
	resourceName: "shroudstone",
	addPerSecond: {"shroud": 1},
	clickCost: { resources: {"shroud": 10}, multiplier: 1.1 },
	addPerClick: {"shroudstone": 1},
	unlockCondition: { resources: { "shroud": 5 }}
}
gUnits.push(new ClickerUnit(ShroudstoneConfig));

const meatFarmConfig = {
	userName: "Meat Farm",
	resourceName: "meatfarm",
	clickCost: { resources: {"shroud": 20}, multiplier: 1.1 },
	addPerClick: {"meatfarm": 1},
	addPerSecond: {"felhog": 0.1},
	unlockCondition: { resources: { "shroud": 20 }, message: "Boss! Shroud is works! We seeing meat farm next hill!"}
}
gUnits.push(new ClickerUnit(meatFarmConfig));



const FelhogConfig = {
	userName: "Felhog",
	resourceName: "felhog",
	addPerSecond: {"animus": 0.1},
	unlockCondition: { resources: { "felhog": 1 }}
}
gUnits.push(new ClickerUnit(FelhogConfig));

const AnimusConfig = {
	userName: "Animus",
	resourceName: "animus",
	//clickCost: { resources: {"felhog": 1} },
	//addPerClick: {"fiend": 1},
	unlockCondition: { resources: { "animus": 10 }, message: "This energy gives us lots of strong!"}
}
gUnits.push(new ClickerUnit(AnimusConfig));

const NobleFelhogConfig = {
	userName: "Noble Felhog",
	resourceName: "noblefelhog",
	clickCost: { resources: {"felhog": 10} },
	addPerClick: {"noblefelhog": 1},
	unlockCondition: { resources: { "tech": 2 }, message: "We be advanced now!"}
}
gUnits.push(new ClickerUnit(NobleFelhogConfig));


const FelhogqueenConfig = {
	userName: "Felhog Queen",
	resourceName: "felhogqueen",
	clickCost: { resources: {"noblefelhog": 20}, multiplier: 1.2 },
	addPerClick: {"felhogqueen": 1},
	addPerSecond: {"noblefelhog": 1},
	unlockCondition: { resources: { "tech": 2, "noblefelhog": 10 }}
}
gUnits.push(new ClickerUnit(FelhogqueenConfig));


gTechs.push(new ClickerUnit({
	tech: true,
	userName: "Advance to Middle FelAges",//  (Animus: 100
	resourceName: "t_felages",
	clickCost: { resources: {"animus": 200}, multiplier: 1 },
	addPerClick: {},
	unlockCondition: { resources: { "tech": 1 }}
}))


gUpdate();


function addDiv(parent, _class){
	let div = document.createElement("div");
	parent.appendChild(div);
	if(_class) div.classList.add(_class);
	return div;
}
function addSpan(parent, _class, text){
	let span = document.createElement("span");
	parent.appendChild(span);
	if(_class) span.classList.add(_class);
	if(text) span.textContent = text;
	return span;
}
function addBtn(parent, onClick, text, _class){
	let btn = document.createElement('button');
	parent.appendChild(btn);
	btn.addEventListener('click', onClick);
	if(_class) btn.classList.add(_class);
	if(text) btn.innerText = text;
	return btn;
}

setInterval(() => {
	if(!gPaused){
		gProduce();
		gUpdate();
		//gExtraStuff();
	}
}, 1000);