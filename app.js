const url = window.location.toString();
const blockTags = "h1, h2, h3, h4, a, p, span";
let scrollTimer, lastScrollFireTime = 0;

const regexpEn = new RegExp('coronavirus|virus|covid\-19|covid19|covid 19|virus|pandemic|epidemic|quarantine');
const regexpRu = new RegExp('коронавирус|пандеми|эпидеми|вирус|карантин');
const regexpTurk = new RegExp('coronavirüs|yaygın|salgın|virüs|karantina');
const regexpGerman = new RegExp('coronavirus|pandemie|epidemie|virus|quarantäne');
const regexpItalian = new RegExp('coronavirus|pandemia|epidemia|virus|quarantena');
const regexpAzer = new RegExp('koronavirus|pandemiya|epidemiya|virus|karantin');
const regexpBelorus = new RegEdp('коронавирус|пандэміі|эпідэмія|вірус|каранцін');

var combinedRegexp = new RegExp(regexpEn.source + "|" + regexpRu.source + "|" + regexpTurk.source, 'gi');

const removeWords = (tags, regexp) => {
    let counter = 0;
    const elements = document.querySelectorAll(tags);
    for(element of elements) {
        if(element.textContent.match(regexp)) {
            counter++;
            element.remove();
        }
    }
}

const removeYouTube = (regexp) => {
    let counter = 0;
    const elements = document.querySelectorAll("yt-formatted-string");
    for(element of elements) {
        if(element.textContent.match(regexp)) {
            counter++;
            if(element.closest('ytd-video-renderer')) element.closest('ytd-video-renderer').remove();
        }
    }
}


const interval = (func, wait, times) => {
    var interv = function(w, t){
        return () => {
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
};


if(url.match(/youtube/g)) {
    interval(() => removeYouTube(combinedRegexp), 1000, 5);
} else {
    interval(() => removeWords(blockTags, combinedRegexp), 1000, 5);
}

window.onscroll = function (e) { 
    var minScrollTime = 500;
    var now = new Date().getTime();

    if (!scrollTimer) {
        if (now - lastScrollFireTime > (3 * minScrollTime)) {
            if(url.match(/youtube/g)) {
                removeYouTube(combinedRegexp);
            } else {
                removeWords(blockTags, combinedRegexp);
            }
            lastScrollFireTime = now;
        }
        scrollTimer = setTimeout(function() {
            scrollTimer = null;
            lastScrollFireTime = new Date().getTime();
            if(url.match(/youtube/g)) {
                removeYouTube(combinedRegexp);
            } else {
                removeWords(blockTags, combinedRegexp);
            }
        }, minScrollTime);
    }
} 

