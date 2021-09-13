const regexes = {
    en: /coronavirus|virus|covid|covid[ |-]?[1-9]{2}|virus|pandemic|epidemic|quarantine/,
    ru: /коронавирус|пандеми|эпидеми|вирус|карантин|ковид|заболевани*/,
    ua: /коронавірус|пандемія|епідемія|вірус/,
    tr: /coronavirüs|yaygın|salgın|virüs|karantina/,
    de: /pandemie|epidemie|quarantäne/,
    it: /pandemia|epidemia|quarantena/,
    az: /koronavirus|pandemiya|epidemiya|virus|karantin/,
    by: /коронавирус|пандэміі|эпідэмія|вірус|каранцін/,
    cn: /冠状病毒|大流行|流行|病毒|检疫/,
    in: /कोरोनावायरस|महामारी|महामारी|वायरस|संगरोध/,
    sp: /cuarentena/,
    arab: /الفيروس التاجي|الوباء|الوباء|الفيروس|الحجرالصحي/,
    beng: /করোনভাইরাস|মহামারী|মহামারী|ভাইরাস|পৃথকীকরণ/,
    pt: /coronavírus|pandemia|epidemia|vírus|quarentena/,
    fr: /pandémie|épidémie|virus|quarantaine/,
    gr: /πανδημία|επιδημία|ιός|καραντίνα/,
    ge: /პანდემიის|ეპიდემიის|ვირუსი|საკარანტინო/,
    jp: /コロナウイルス|パンデミック|流行|ウイルス|検疫/,
};

const url = window.location.toString();
const blockTags = "h1, h2, h3, h4, a, p, span";
let scrollTimer,
    lastScrollFireTime = 0;

const combinedRegexp = new RegExp(Object.keys(regexes).reduce((combined, lang, idx) => {
    if(idx === Object.keys(regexes).length - 1)
        return combined + regexes[lang].source;
    return combined + regexes[lang].source + "|";
}, ''), 'gi');

const removeWords = (tags, regexp) => {
    let counter = 0;
    const elements = document.querySelectorAll(tags);
    for (element of elements) {
        if (element.textContent.match(regexp)) {
            counter++;
            element.remove();
        }
    }
};

const removeYouTube = (regexp) => {
    let counter = 0;
    const elements = document.querySelectorAll("yt-formatted-string");
    for (element of elements) {
        if (element.textContent.match(regexp)) {
            counter++;
            if (element.closest("ytd-video-renderer"))
                element.closest("ytd-video-renderer").remove();
        }
    }
};

const interval = (func, wait, times) => {
    var interv = (function (w, t) {
        return () => {
            if (typeof t === "undefined" || t-- > 0) {
                setTimeout(interv, w);
                try {
                    func.call(null);
                } catch (e) {
                    t = 0;
                    throw e.toString();
                }
            }
        };
    })(wait, times);

    setTimeout(interv, wait);
};

if (url.match(/youtube/g)) {
    interval(() => removeYouTube(combinedRegexp), 1000, 5);
} else {
    interval(() => removeWords(blockTags, combinedRegexp), 1000, 5);
}

window.onscroll = function (e) {
    var minScrollTime = 500;
    var now = new Date().getTime();

    if (!scrollTimer) {
        if (now - lastScrollFireTime > 3 * minScrollTime) {
            if (url.match(/youtube/g)) {
                removeYouTube(combinedRegexp);
            } else {
                removeWords(blockTags, combinedRegexp);
            }
            lastScrollFireTime = now;
        }
        scrollTimer = setTimeout(function () {
            scrollTimer = null;
            lastScrollFireTime = new Date().getTime();
            if (url.match(/youtube/g)) {
                removeYouTube(combinedRegexp);
            } else {
                removeWords(blockTags, combinedRegexp);
            }
        }, minScrollTime);
    }
};
