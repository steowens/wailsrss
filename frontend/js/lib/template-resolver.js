async function resolveTemplate(node) {
	let src = node.dataset.src;
	let url = `templates/${src}.html`;
	let stream = await fetch(url);
	let html = await stream.text();
	node.innerHTML = html;
	await _resolveTemplates(node);
}

async function _resolveTemplates(node) {
	let matches = node.querySelectorAll(".templated");
	let promises = [];
	matches.forEach(match => {
		promises.push(resolveTemplate(match));
	});
	return await Promise.all(promises);
}

async function resolveTemplates(node){
	await _resolveTemplates(node);
}

export async function loadTemplates(onTemplatesLoaded) {
	// Load templates
	let data = await resolveTemplates(document.body);
	onTemplatesLoaded()
}