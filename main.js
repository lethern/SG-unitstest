const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gUnitSizeScaling = 45;
let gDrawError = false;

let lastTime = 0;
let gMapUnits = [];

let gImages = {};
function loadImgs(){
	for(let id in gUnits){
		gImages[id] = { img: new Image() };
		gImages[id].img.onload = () => loadSignal(id);
		gImages[id].img.onerror = () => { gImages[id].img.onerror = null; gImages[id].img.src = 'img/i_' + id + '.png'; };
		if (['Atlas', 'Hedgehog'].includes(id))
			gImages[id].img.src = 'img/' + id + '.png';
		else
			gImages[id].img.src = 'img/'+id+'.webp';
	}
	
	gImages['projectile'] = { img: new Image() };
	gImages['projectile'].img.onload = () => loadSignal('projectile');
	gImages['projectile'].img.src = 'img/projectile.png'
	
	function loadSignal(id){
		gImages[id].width = gImages[id].img.width;
		gImages[id].height = gImages[id].img.height;
	}
}

function setup() {
	gMapUnits.push(new Unit(0, 'Lancer', 2, 2));
	gMapUnits.push(new Unit(0, 'Lancer', 4, 2));
	gMapUnits.push(new Unit(0, 'Lancer', 6, 2));

	gMapUnits.push(new Unit(1, 'Brute', 2, 12));
	gMapUnits.push(new Unit(1, 'Brute', 4.5, 12));
	gMapUnits.push(new Unit(1, 'Brute', 7, 12));
	/*
	let posX = 1;
	let posY = 1;
	for (let it in gUnits) {
		let unit = gUnits[it];
		let s = unit.size;

		gMapUnits.push(new Unit(0, it, posX, posY));
		posX += s;
		if (posX > 15) {
			posX = 1;
			posY += 3.5;
		}
	}
	*/
}

function gameLoop(timestamp) {
	let deltaTimeMs = (timestamp - lastTime);
	lastTime = timestamp;
	if (deltaTimeMs > 125) deltaTimeMs = 125;

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	gMapUnits.forEach(u => u.update(deltaTimeMs));
	//let to = [{x:200, y:100}, {x:300, y:100}, {x:400, y:300}];
		
	//gMapUnits.forEach( (unit, i)=> {
	//	drawUnit(unit, gImages[(i%2?'Argent':'Gaunt')].img);
	//	if(unit.x != to[i].x && unit.y != to[i].y)
	//		moveUnit(unit, to[i], deltaTime);
	//})
		
//	if(gImages['projectile']){
//	let projectile = gImages['projectile'].img;
//	//console.log(100+10*deltaTime, 100-20*deltaTime);
////		ctx.drawImage(projectile, 100+10*timestamp/1000, 100-20*timestamp/1000, projectile.width, projectile.height);
//	}
	requestAnimationFrame(gameLoop);
}

loadImgs();
setup();
gameLoop(0);