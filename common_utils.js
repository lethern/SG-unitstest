function createBtn(parent, text, css, callback){
	let elem = document.createElement('span');
	if(parent) parent.appendChild(elem);
	elem.textContent = text;
	if(css) elem.classList.add(css);
	if(callback) elem.addEventListener('click', callback);
	return elem;
}

function createDiv(parent, text, css){
	let elem = document.createElement('div');
	if(parent) parent.appendChild(elem);
	elem.textContent = text;
	if(css) elem.classList.add(css);
	return elem;
}

function createSpan(parent, text, css){
	let elem = document.createElement('span');
	if(parent) parent.appendChild(elem);
	elem.textContent = text;
	if(css) elem.classList.add(css);
	return elem;
}

function createInput(parent, text, css){
	let elem = document.createElement('input');
	if(parent) parent.appendChild(elem);
	if(text!==null && text!==undefined) elem.value = text;
	if(css) elem.classList.add(css);
	return elem;
}

function createCheckbox(parent, bool, css){
	let elem = document.createElement('input');
	elem.type = 'checkbox';
	if(parent) parent.appendChild(elem);
	if(bool!==null && bool!==undefined) elem.checked = bool;
	if(css) elem.classList.add(css);
	return elem;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}