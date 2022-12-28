import { loadTemplates } from './template-resolver.js'

const templateLoadedHandlers = [];

function updateBannerMenu(){
    let elt = document.getElementById(activeMenuItem);
    if (elt) {
        elt.classList.add("active");
    }
}

async function onTemplatesLoaded(){
    updateBannerMenu();
    templateLoadedHandlers.forEach(listener => listener());
}

export function addTemplateLoadedListener(listener) {
    templateLoadedHandlers.push(listener);
}

export function commonInit(){
    loadTemplates(onTemplatesLoaded);
}

