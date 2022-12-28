import { commonInit, addTemplateLoadedListener } from "./lib/common.js";


function onTemplatesLoaded(){

}

document.addEventListener("DOMContentLoaded",function(){
	addTemplateLoadedListener(onTemplatesLoaded);
    commonInit();	
});