/*
*
Copyright 2022 Stephen Owens

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*
*/
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/mmcdole/gofeed"
)

type InvokeResult struct {
	Code     int
	Error    string
	Response string
}

// App struct
type App struct {
	ctx     context.Context
	dataDir string
}

// NewApp creates a new App application struct
func NewApp(dataDir string) *App {
	return &App{
		dataDir: dataDir,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func marshalErrorResult(err error, code int) (response string) {
	result := InvokeResult{
		Code:     code,
		Error:    err.Error(),
		Response: "",
	}
	b, err := json.Marshal(result)
	if err != nil {
		logger.Error(err)
		return err.Error()
	}
	response = string(b)
	return
}

// Greet returns a greeting for the given name
func (a *App) GetFeeds() (response string) {
	feedCfgs, err := ListFeeds()
	if err != nil {
		logger.Error(err)
	}
	bVal, err := json.Marshal(feedCfgs)
	if err != nil {
		logger.Error(err)
	}
	response = string(bVal)
	return
}

// Adds a new feed configuration to the feed configuration database.
func (a *App) AppendFeed(name string, url string) (response string) {
	feed := NewFeed(name, url)
	err := feed.Save()
	if err != nil {
		logger.Error(err)
	} else {
		bytes, err := json.Marshal(feed)
		if err == nil {
			response = string(bytes)
		}
	}
	return
}

// Removes a feed configuration from the feed configuration database.
// Errors return a 500 code with a message, success returns a 200 code and the message is "OK"
func (a *App) DeleteFeed(feedId string) (response string) {
	err := RemoveFeed(feedId)
	if err != nil {
		response = fmt.Sprintf("{\"code\": 500, \"message\":\"%s\"}", err.Error())
	} else {
		response = "{\"code\": 200, \"message\": \"OK\"}"
	}

	return
}

// Resolves an actual feed given a feed configuration.
func fetchFeedInfo(cfg *FeedCfg) (result string, err error) {
	fp := gofeed.NewParser()
	feed, err := fp.ParseURL(cfg.Url)
	if err != nil {
		logger.Error(err)
		return
	}
	bytes, err := json.Marshal(feed)
	if err == nil {
		result = string(bytes)
	}
	return
}

// Looks up a feed configuration and returns the feed associated
// with that config in a structured json response.
// Errors have a non 200 code, and success is 200 code.
// Errors return a message, success returns a data structure in json
func (a *App) FetchFeedData(feedId string) (response string) {
	feedCfg, err := FetchFeedCfgById(feedId)
	if err != nil {
		response = fmt.Sprintf("{\"code\": 500, \"message\":\"%s\"}", err.Error())
	} else {
		json, err := fetchFeedInfo(feedCfg)
		if err != nil {
			response = fmt.Sprintf("{\"code\": 500, \"message\":\"%s\"}", err.Error())
			return
		}
		response = fmt.Sprintf("{\"code\": 200, \"data\": %s}", json)
	}
	return
}
