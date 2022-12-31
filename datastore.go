package main

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/mmcdole/gofeed"
	db "github.com/sonyarouje/simdb"
)

var driver *db.Driver

type FeedCfg struct {
	FeedID string `json:"feedId"`
	Name   string `json:"name"`
	Url    string `json:"url"`
}

func InitDb(dataDir string) (err error) {
	driver, err = db.New("dbs")
	feeds, err := ListFeeds()
	if len(feeds) < 1 {
		feedCfg := NewFeed("Apology Line", "https://rss.art19.com/apology-line")
		feedCfg.Save()
		feedCfg = NewFeed("The Daily", "https://feeds.simplecast.com/54nAGcIl")
		feedCfg.Save()
	}

	return
}

func NewFeed(name string, url string) *FeedCfg {
	return &FeedCfg{
		FeedID: uuid.New().String(),
		Name:   name,
		Url:    url,
	}
}

func RemoveFeed(feedId string) (err error) {
	// Delete
	toDel := FeedCfg{
		FeedID: feedId,
	}
	err = driver.Delete(toDel)
	if err != nil {
		logger.Error("Remove feed error %s", err.Error())
	}
	return
}

func ListFeeds() (feedConfigs []FeedCfg, err error) {
	err = driver.Open(FeedCfg{}).Get().AsEntity(&feedConfigs)
	if err != nil {
		logger.Error("List feeds error %s", err.Error())
		feedConfigs = make([]FeedCfg, 0)
	}
	return
}

func (cfg FeedCfg) ID() (jsonField string, value interface{}) {
	value = cfg.FeedID
	jsonField = "feedId"
	return
}

func (cfg *FeedCfg) Save() (err error) {
	err = driver.Insert(cfg)
	if err != nil {
		logger.Error("Save error %s", err.Error())
	}
	return
}

func FetchFeedCfgById(id string) (cfg *FeedCfg, err error) {
	var target FeedCfg
	err = driver.Open(FeedCfg{}).Where("feedId", "=", id).First().AsEntity(&target)
	if err != nil {
		logger.Error("Fetch by ID Error: FeedCfg.feedid = " + id + "; " + err.Error())
	}
	cfg = &target
	return
}

func (cfg *FeedCfg) Fetch() (jsonVal string, err error) {
	fp := gofeed.NewParser()
	feed, err := fp.ParseURL(cfg.Url)
	if err != nil {
		logger.Error(err)
		return
	}
	bytes, err := json.Marshal(feed)
	if err != nil {
		logger.Error(err)
		return
	}
	jsonVal = string(bytes)
	return
}
