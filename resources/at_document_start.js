/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_start                                                  ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected after any files from CSS,               ║
   ║ - but before any other DOM is constructed,                         ║
   ║ - or any other script is run.                                      ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */


query = [
  '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="rwt("]'                        /* Google              */
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[jsaction*="mousedown"][jsaction*="keydown"]'
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="window.open("]'                /* other (very common) */
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
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="window.open("]'                         /* other (uncommon)                      */
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
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="openUrl("]'                                          /* quora.com                             */
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("]):not([onclick]):not([onmousedown]):not([jsaction])[href^="/url?q="]:not([done])'     /* Google with no JavaScript URL - must be verified to be Google, using '.href'  --  this is special case, and a little bit wastefull, since I KNOW there is NO onclick,onmousedown(etc..) handles due to it is being in no javascript page, but to make the entire code at here more unified- I WILL STILL include this specific case as if it is still required to be handled-cleaned.. */
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[data-url]:not([data-url=""]):not([done])'                      /* twitter/instagram links ("t.co"/) links   */
, '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[data-expanded-url]:not([data-expanded-url=""]):not([done])'   
].join(', ');


function for_twitter(element){
  tmp = element.getAttribute("data-url") || element.getAttribute("data-expanded-url");      /* twitter instagram pages*/
  if(null === tmp) return;
  tmp = (-1 === tmp.indexOf(":") ? "http://" : "") + tmp;                                 /* fix missing protocol */
  element.setAttribute("href", tmp);                                                      /* hard overwrite       */
  element.setAttribute("done", "");                                                       /* flag to make sure to avoid infinate loop in-case the real-url also includes "/url?q=" in it.  */
}


function for_google_nojs(element){
  tmp = element.href.match(/\/\/www\.google\.[^\/]+\/url\?q\=([^\&]+)/i);                   /* Google page (redirects with no javascript)*/
  if(null === tmp || "string" !== typeof tmp[1]) return;
  tmp = tmp[1];
  tmp = decodeURIComponent(tmp);
  element.setAttribute("href", tmp); /* hard overwrite */
  element.setAttribute("done", "");  /* flag to make sure to avoid infinate loop in-case the real-url also includes "/url?q=" in it.  */
}


function action(){
  var elements = document.querySelectorAll(query);
  if(null === elements || 0 === elements.length) return;
  try{chrome.runtime.sendMessage({badge_data: elements.length});}catch(err){} /* update extension's badge. */

  elements.forEach(function(element){
    element.removeAttribute("onmousedown");
    element.removeAttribute("jsaction");
    element.removeAttribute("onclick");
    for_twitter(element);
    for_google_nojs(element);

    setTimeout(function(){    /*setTimeout run only if there is a JS support on the page. cloneNode trick will break the "for_twitter" and "for_google_nojs", there-for it is only in the setTimeout block which will be executed on a JS-supported page, since with JS-support it will not break the "for_twitter" and "for_google_nojs". */
      tmp = element.cloneNode(true);
      element.parentNode.replaceChild(tmp, element);
      element.removeAttribute("onmousedown");                                                 /* must be redo */
      element.removeAttribute("jsaction");
      element.removeAttribute("onclick");
      for_twitter(element);
      for_google_nojs(element);
    }, 50);
  });
}


action();
setInterval(action, 500); /*only available in pages having JavaScript support*/