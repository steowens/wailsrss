# wailsrss

## About

This project implements a simple RSS reader to demo using wails to implement a 
straight stick framework free modular ES6 project.

## How we started off

We started off by running this command:

    $ wails init -n wailsrss -t svelte
    $cd wailsrss
    $ notepad wails.json

Then edit the file to turn off all the npm stuff because we don't need it.

    {
      "$schema": "https://wails.io/schemas/config.v2.json",
      "name": "wailsrss",
      "outputfilename": "wailsrss",
      "frontend:install": "",
      "frontend:build": "",
      "frontend:dev:watcher": "",
      "frontend:dev:serverUrl": "auto",
      "author": {
        "name": "Steve Owens",
         "email": "steve@doitnext.com"
      }
    }

Now just go in and delete everything from the frontend directory

    $ cd frontend
    $ delete *

Now we have an empty frontend directory we can get started.

The rest of the story is in the source code of this project.  Take a gander and see how 
things are put together.

The front end structure I like to use is as follows:

frontend/ 
    index.html
    otherstuff.html
    js/
       index.js
       otherstuff.js
       libs/
          template-resolver.js
    css/
       site.css
    images/
        bannerLogo.png
    templates/
        top-banner.html
        avatar.html



# Copyright 2022 Stephen Owens

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
