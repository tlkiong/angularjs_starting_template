# AngularJS (1.x) Starting Template #

TODO: Convert `www` folder to `app` folder

## Introduction ##

This repository contains a scaffold for an AngularJS (1.x) app. This **CAN** be used within Ionic framework mobile apps. However, there are a few things that need to be modified. There are a lot more other than what is written below. Will update when there is time.

**Note:** This starting template follows heavily John Papa's style guide to make it extremely modular.

## What else are there in this repo? ##

1. AngularJS specific:
    
    - In **modules/core/components/common.service.js**
        - resetForm() - This will reset the form object (set $pristine to true & make the objects within the form be empty -> {})
        - goToPage(stateName, hasRoot, toReload, stateParam) - This will go to the state based on the statename. If you want to just reload the current page, only **toReload** has to be true. The rest of the input params can be undefined
        - getCurrentState() - This will return the current state's object
        - getStateParam() - This will return the current state's parameters (if any)
    - In **modules/core/components/events.service.js**
        - Here is where all broadcast events executor & listener are placed
    - In **modules/core/components/httpRequests.service.js**
        - http(...) - This will handle all HTTP calls for you. Refer to the source code for more information
2. Non AngularJS Specific (vanilla JS stuffs):
    
    - In **modules/core/components/common.service.js**
        - getDateInDDMMMMYYYY(dateTimeInEpoch) - This will return the date in string with the format: (dd MMMM yyyy). Eg: (02 January 2016)
        - isObjPresent(obj) - This is the equivalent of Rail's .present? method. For more info, check out the source code. The doc is there on what is supported and what isn't
        - getObjType(obj) - This will return the type of object in string (eg: 'function'). For more info, check out the source code. The doc is there on what is supported and what isn't
        - getUUID() - This will return a UUID. The algo is a fast UUID generator, RFC4122 version 4 compliant. For more info, check out the source code.
        - isEpochTimeInMs(epochTime) - Will return **true** if its in milliseconds & **false** if its in seconds. Will throw error if the input is neither milliseconds or seconds

3. Whenever you do any development, run `gulp dev`. This will do:
    - generate `index.html` from `/www/modules/main-view/pre-index.html` and put the file at `/www/index.html`
    - compile all `.scss` file into `.css` files
    - insert all CSS & JS file as import (eg: `<link...>` and `<script...`) into `/www/index.html`. This means all CSS & JS file under `/www/modules/**/*` and also all CSS & JS for `/www/lib` based on what is specified in their bower.json file

4. `npm start` will run a simple HTTP server just to serve the `/www/index.html` file. It isn't a live reload server thus any changes that happen to the files, you would have to refresh the browser

5. `gulp watch` will watch all `.scss` files for changes then compile them to `.css` files
