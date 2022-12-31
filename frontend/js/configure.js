import { commonInit, addTemplateLoadedListener } from "./lib/common.js";


async function onAddFeed(e) {
    let input = document.querySelector("#config-form #input-name");
    let name = input.value;
    input = document.querySelector("#config-form #input-url");
    let url = input.value;

    let result = await go.main.App.AppendFeed(name, url);
    let feeds = await go.main.App.GetFeeds()
    refreshFeedsTable(JSON.parse(feeds));
}

async function onClickedDeleteFeed(e) {
    let a = e.currentTarget;
    let feedId = a.dataset.feedid;
    await go.main.App.DeleteFeed(feedId)
    let feeds = await go.main.App.GetFeeds()
    refreshFeedsTable(JSON.parse(feeds));
}

function refreshFeedsTable(feeds){
    let tbody = document.querySelector("#feeds-table tbody");
    tbody.innerHTML = "";
    if (feeds.length < 1) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.setAttribute("colspan", "3");
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    feeds.forEach(feed => {
        let tr = document.createElement("tr");
        tr.setAttribute("data-feedId", feed.feedId);
        let td = document.createElement("td");
        td.innerText = feed.name;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerText = feed.url;
        tr.appendChild(td);

        td = document.createElement("td");
        let a = document.createElement("a");
        a.setAttribute("data-feedId", feed.feedId);
        a.setAttribute("href", "javascript:void(0)");
        a.innerText = "delete";
        a.addEventListener("click", onClickedDeleteFeed);
        td.appendChild(a);
        tr.appendChild(td);

        tbody.appendChild(tr);
    });
}

async function onTemplatesLoaded(){
    let button = document.querySelector("#config-form #add-button");
    button.addEventListener('click', onAddFeed);
    let feeds = await go.main.App.GetFeeds()
    refreshFeedsTable(JSON.parse(feeds));
}

document.addEventListener("DOMContentLoaded",function(){
	addTemplateLoadedListener(onTemplatesLoaded);
    commonInit();	
});