const url = window.location.toString();
const blockTags = "h1, h2, h3, h4, a, p, span";
let scrollTimer, lastScrollFireTime = 0;

const regexpEn = new RegExp('coronavirus|virus|covid\-19|covid19|covid 19|virus|pandemic|epidemic');
const regexpRu = new RegExp('коронавирус|пандеми|эпидеми|вирус|карантин');
const regexpTurk = new RegExp('coronavirüs|yaygın|salgın|virüs');

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
    console.log(counter);
}

const removeYouTube = (regexp) => {
    let counter = 0;
    const elements = document.querySelectorAll("yt-formatted-string");
    for(element of elements) {
        if(element.textContent.match(regexp)) {
            console.log(element);
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

