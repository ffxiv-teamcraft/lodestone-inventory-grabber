"use strict";

void (async () => {
    const api = typeof browser === "object" ? browser : chrome;

    try {
        const allItemNames = Array.from(
            document.getElementsByClassName("item-list__list sys_item_row"),
            el => {
                return {
                    name: el.querySelector(".item-list__name--inline > a")
                        .textContent,
                    amount: parseInt(el.dataset.stack, 10)
                };
            }
        );

        const langFromUrl = /(fr|na|de|jp|eu).finalfantasyxiv.com/.exec(
            location.href
        )[1];

        const lang = {
            fr: "fr",
            na: "en",
            eu: "en",
            jp: "ja",
            de: "de"
        }[langFromUrl];

        const items = await (await fetch(
            api.runtime.getURL("/data/items.json")
        )).json();
        const nameMap = new Map(
            Object.entries(items).map(([id, { [lang]: name }]) => [
                name.trim(),
                id
            ])
        );
        const nameList = Array.from(nameMap.keys());
        const collator = new Intl.Collator(lang, { usage: "search" });
        const allIds = allItemNames.map(item => {
            const id = nameMap.get(
                nameList.find(
                    name => collator.compare(name, item.name.trim()) === 0
                )
            );
            return {
                ...item,
                id: id !== undefined ? parseInt(id, 10) : -1
            };
        });
        await copyToClipboard(JSON.stringify(allIds));

        alert("Inventory copied inside your clipboard");
    } catch (_) {
        // it is possible to enable/disable the button
        // depending on the current page's url, but that
        // requires "tabs" instead of just "activeTab" privileges
        alert(
            "Please click this extension only when you're inside retainer's inventory page (https://finalfantasyxiv.com/lodestone/character/.../retainer/.../baggage)"
        );
    }

    async function copyToClipboard(text) {
        if (
            typeof navigator.clipboard === "object" &&
            navigator.clipboard.writeText
        ) {
            return navigator.clipboard.writeText(text);
        }

        const input = document.createElement("input");
        input.style.position = "fixed";
        input.style.opacity = 0;
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
    }
})();
