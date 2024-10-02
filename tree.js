class Tree{
	constructor(){
	}
	render(div, data){
		this.mainDiv = createDiv(div);
		this.nodes = [];
		for(let row of data){
			this.createNode(row);
		}
	}
	
	createNode(data){
		let node = { };
		node.rowDiv = createDiv(this.mainDiv);
		node.data = data;
		node.btn = createBtn(node.rowDiv, Tree.printNodeName(data.name), 'nodeBtn', nodeBtnClick);
		if(data.enabled === false) this.setNodeEnabled(node, false)
		node.btn._node = node;
		node.content = createDiv(node.rowDiv);
		node.content.style.display = 'none';
		this.renderListContent(node, data.list);
		this.nodes.push(node);
		return node;
	}
	
	setNodeEnabled(node, bool){
		if(bool)
			node.btn.classList.remove('disabled');
		else
			node.btn.classList.add('disabled');
	}
	
	renderListContent(node, list){
		node.nodes = [];
		for(let elem of list){
			this.createSiblingNode(elem, node)
		}
	}
	
	createSiblingNode(data, node){
		let sibling = { };
		node.nodes.push(sibling);
		sibling.rowDiv = createDiv(node.content);
		sibling.data = data;
		sibling.btn = createBtn(sibling.rowDiv, data.name, 'nodeSibling', nodeSiblingClick);
		if(data.enabled === false) sibling.btn.classList.add('disabled');
		sibling.btn._node = sibling;
	}
	
	static printNodeName(name, open){
		if(!open) return '[ + '+name+' + ]'
		else return '[ - '+name+' - ]'
	}
}

function nodeBtnClick(event){
	let node = event.currentTarget._node;
	if(node.content.style.display == 'none'){
		node.btn.textContent = Tree.printNodeName(node.data.name, true);
		node.btn.classList.add('expanded');
		node.content.style.display = 'block';
	}else{
		node.btn.textContent = Tree.printNodeName(node.data.name, false);
		node.btn.classList.remove('expanded');
		node.content.style.display = 'none';
	}
}
function nodeSiblingClick(event){
	let node = event.currentTarget._node;
	if(node.data.onclick)
		node.data.onclick(node.data);
}

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
