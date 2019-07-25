"use strict";

void (() => {
    const api = typeof browser === "object" ? browser : chrome;

    api.browserAction.onClicked.addListener(() => {
        api.tabs.executeScript(null, { file: "/src/inject/inject.js" });
    });
})();
