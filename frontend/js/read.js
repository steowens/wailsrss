import { commonInit, addTemplateLoadedListener } from "./lib/common.js";

async function onClickFeedNavItem(e){

}

async function loadLeftNav() {
    let feeds = await go.main.App.GetFeeds();
    let feedsUl = document.getElementById("feeds");
    feeds.forEach(feed => {
        let li = document.createElement("li");
        li.setAttribute("data-feedid", feed.feedId);
        li.addEventListener("click", onClickFeedNavItem);
        li.innerText = feed.name;
        li.title = feed.url
        feedsUl.appendChild(li);
    });
}

function onTemplatesLoaded(){
    loadLeftNav();
}

document.addEventListener("DOMContentLoaded",function(){
	addTemplateLoadedListener(onTemplatesLoaded);
    commonInit();	
});