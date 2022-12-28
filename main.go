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
	"embed"
	"errors"
	"fmt"
	"io/fs"
	"log"
	"os"
	"path"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"go.uber.org/zap"
)

//go:embed all:frontend
var assets embed.FS
var logger *zap.SugaredLogger

func main() {
	lgr, err := zap.NewDevelopment()
	if err != nil {
		log.Panic(err)
	}
	logger = lgr.Sugar()
	homeDir, err := os.UserHomeDir()
	if err != nil {
		logger.Error("ERROR: Unable to locate current logged in user home directory.")
		os.Exit(1)
	}

	dataDir := path.Join(homeDir, ".wailsrss")
	fileInfo, err := os.Stat(dataDir)
	if errors.Is(err, fs.ErrNotExist) {
		os.Mkdir(dataDir, 0700)
	} else if !fileInfo.IsDir() {
		err = fmt.Errorf("%s is not a directory.", dataDir)
		logger.Error(err)
		os.Exit(1)
	}
	err = InitDb(dataDir)
	if err != nil {
		logger.Error(err)
	}

	// Create an instance of the app structure
	app := NewApp(dataDir)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "wailsrss",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		logger.Error("Error: %s", err.Error())
	}
}
