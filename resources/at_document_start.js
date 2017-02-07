/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_start                                                  ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected after any files from CSS,               ║
   ║ - but before any other DOM is constructed,                         ║
   ║ - or any other script is run.                                      ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

NodeList.prototype.forEach = Array.prototype.forEach;

counter_total = 0;

query = [
  '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="rc("]' // Yandex
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="rwt("]' // Google
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[jsaction*="mousedown"][jsaction*="keydown"]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="window.open("]' // other (very common)
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="self.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="top.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="parent.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="frames.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*=".href="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="location="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="location.href="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="location.pathname="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="location.replace("]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="location.reload("]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="location.assign("]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="window.open("]' // other (uncommon)
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="self.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="top.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="parent.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="frames.open("]' 
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*=".href="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="location="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="location.href="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="location.pathname="]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="location.replace("]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="location.reload("]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="location.assign("]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="openUrl("]' // quora.com
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("]):not([onclick]):not([onmousedown]):not([jsaction])[href^="/url?q="]:not([done-remove-redirects])' // Google with no JS URL - must be verified to be Google, using '.href'; this is special case, and a little bit wasteful, since I KNOW there is NO onclick,onmousedown(etc..) handles due to it is being in no JS page, but to make the entire code at here more unified- I WILL STILL include this specific case as if it is still required to be handled-cleaned
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[data-url]:not([data-url=""]):not(.aui-button):not([done-remove-redirects])' // ignore Atlassian products (.aui-button)
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[data-expanded-url]:not([data-expanded-url=""]):not([done-remove-redirects])' // twitter/instagram links ("t.co"/) links
].join(', ');

function for_twitter(element) {
  var tmp = element.getAttribute("data-url") || element.getAttribute("data-expanded-url"); // twitter/instagram pages
  if (tmp) {
    tmp = new URL(tmp, location); // fix missing protocol
    element.setAttribute("href", tmp); // hard overwrite
    element.setAttribute("done-remove-redirects", ""); // flag to make sure to avoid infinate loop in-case the real-url also includes "/url?q=" in it
  }
}

function for_google_nojs(element) {
  var tmp = element.href.match(/\/\/www\.google\.[^\/]+\/url\?q\=([^\&]+)/i); // Google page (redirects with no JS)
  if(tmp && typeof tmp[1] === "string") {
    tmp = tmp[1];
    tmp = decodeURIComponent(tmp);
    element.setAttribute("href", tmp); // hard overwrite
    element.setAttribute("done-remove-redirects", ""); // flag to make sure to avoid infinate loop in-case the real-url also includes "/url?q=" in it
  }
}

function action(){
  var elements = document.querySelectorAll(query);
  if (elements && elements.length > 0) {
    counter_total += elements.length;
    try { chrome.runtime.sendMessage( {badge_data: counter_total} ); } catch(err){} // update extension's badge

    elements.forEach(function(element){
      element.removeAttribute("onmousedown");
      element.removeAttribute("jsaction");
      element.removeAttribute("onclick");
      for_twitter(element);
      for_google_nojs(element);

      setTimeout(function(){ // will only run if there is a JS-support on the page
        var tmp = element.cloneNode(true); // will break the "for_twitter" and "for_google_nojs"; therefore, it is only in the setTimeout block which will be executed on a JS-supported page, since with JS-support it will not break the "for_twitter" and "for_google_nojs"
        element.parentNode.replaceChild(tmp, element);
        element.removeAttribute("onmousedown"); // must be redo
        element.removeAttribute("jsaction");
        element.removeAttribute("onclick");
        for_twitter(element);
        for_google_nojs(element);
      }, 50);
    });
  }
}

try { action(); } catch(err){}
try { interval_id = setInterval(action, 500); } catch(err) { clearInterval(interval_id); } // only available in pages having JS-support
