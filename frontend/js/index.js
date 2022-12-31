import { commonInit, addTemplateLoadedListener } from "./lib/common.js";

var loading = false;
var currentPage = 0;
var currentRss = null;

function populateFeedSummary(feedData){
    let summary = document.getElementById("feed-summary");
    let title = summary.querySelector(".title");
    title.innerText = feedData.title;
    let author = summary.querySelector(".author");
    author.innerText = feedData.author.name;
    let description = summary.querySelector(".description");
    description.innerText = feedData.description;
    let copyright = summary.querySelector(".copyright");
    copyright.innerText = feedData.copyright;
}

function populatePageLinks(feedData) {
    let count = feedData.items.length;
    let pageLengthsDiv = document.querySelector("#feed-items .page-links");
    let d1 = document.createElement("div");
    d1.classList.add("label");
    d1.innerText = "Pages:";
    pageLengthsDiv.appendChild(d1);
    
    let d2 = document.createElement("div");
    pageLengthsDiv.appendChild(d2);
    let pgNum = 1;
    for(let x = 1; x <= feedData.items.length; x += 10){
        let span = document.createElement("span");
        span.classList.add("link");
        span.innerText = pgNum.toString();
        span.pageNumber = pgNum++;
        span.addEventListener("click", populatePage);
        d2.appendChild(span);
    }
}

function createItemHtml(item) {
    let template = document.querySelector("#rss-item-template");
    let clone =  template.content.cloneNode(true);
    let rssItem = clone.querySelector(".rss-item");
    let nameDiv  = rssItem.querySelector(".author .name");
    nameDiv.innerText = item.author.name;
    let emailDiv = rssItem.querySelector(".author .email");
    emailDiv.innerText = item.author.email;
    let contentDiv = rssItem.querySelector(".item-content");
    contentDiv.innerHTML = item.content;
    let enclosuresDiv = rssItem.querySelector(".enclosures");
    let titleSpan = rssItem.querySelector(".rss-item-heading .rss-title");
    titleSpan.innerText = item.title;
    let publishedSpan = rssItem.querySelector(".rss-item-heading .rss-published");
    publishedSpan.innerText = item.published;
    item.enclosures.forEach(enclosure =>{
        if(enclosure.type && enclosure.url) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.href = enclosure.url;
            a.innerText = enclosure.type;
            a.target = "view-frame";
            li.appendChild(a);
            enclosuresDiv.appendChild(li);
        }
    });
    return rssItem;
}

function setPageActive(number) {
    currentPage = number;
    let links = document.querySelectorAll("#feed-items .page-links .link");
    links.forEach(link => {
        if(link.pageNumber == number) {
            link.classList.add("current");
        } else {
            link.classList.remove("current");
        }
    });
    displayPageContent(number)
}

function displayPageContent(pageNumber) {
    let content = document.querySelector("#feed-items .page-content");
    content.innerHTML = "";
    let first = (pageNumber - 1) * 10;
    for(let x = first; x < first+10 && x < currentRss.items.length; x++) {
        let item = currentRss.items[x];
        let div = createItemHtml(item);
        content.appendChild(div);
    }
}

function populatePage(e) {
    let link = e.currentTarget;
    let pageNumber = link.pageNumber;
    setPageActive(pageNumber);
}

async function onClickFeedNavItem(e){
    if(loading)
        return;
    loading = true;
    let hourglass = document.getElementById("lds-hourglass");
    hourglass.classList.remove("hidden");
    let li = e.currentTarget;
    let feedid = li.dataset.feedid;
    let json = await  go.main.App.FetchFeedData(feedid);
    let response = JSON.parse(json);
    if(response.code != 200) {
        console.error(response.message);
        return;
    }
    let feedData = response.data;
    console.log(feedData);
    currentRss = feedData;

    populateFeedSummary(feedData);
    populatePageLinks(feedData);
    if(feedData.items.length > 0)
        setPageActive(1);
    loading = false;
    hourglass.classList.add("hidden");
}

async function loadLeftNav() {
    let json = await go.main.App.GetFeeds();
    let feeds = JSON.parse(json);
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