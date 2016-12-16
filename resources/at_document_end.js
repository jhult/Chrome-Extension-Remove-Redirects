/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_end                                                    ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected immediately after the DOM is complete,  ║
   ║ - but before subresources like images and frames have loaded.      ║
   ║ - Like DOMContentLoaded                                            ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */


(function(window, document){
  "use strict";

  window.NodeList.prototype.forEach = window.Array.prototype.forEach;

  function remove_attributes(element){
    element.removeAttribute("onmousedown");
    element.removeAttribute("jsaction");
    element.removeAttribute("onclick");
    return element;
  }
  
  function clone_clean(element){
    var cloned;
    if(null === element.parentNode) return;
    cloned = element.cloneNode(true);  /* restores original ("from HTML") state. */
    element.parentNode.replaceChild(cloned, element);
    element = cloned;
    return element;
  }

  /* action #1 - common cases.   unhook inline-events (removeAttribute), de-attached events (cloneNode and removeAttribute) */
  (function(query, elements){
    elements = document.querySelectorAll(query);

    if(null === elements || 0 === elements.length) return;
    try{chrome.runtime.sendMessage({badge_data: elements.length});}catch(err){}  /* Chrome API: badge over extension's icon. */
    
    elements.forEach(function(element){
      element = remove_attributes(element);      /* quick results */
      setTimeout(function(){
        element = clone_clean(element);          /* event unhook by clone clean (DOM heavy)*/
        element = remove_attributes(element);    /* run (again) since clone also restore inline-event hooks (onmousedown="javascript:....") */
        
        setTimeout(function(){                   /* DATA-URL to HREF (twitter and instagram) */
          if(null !== element.getAttribute("data-url"))
            element.href = element.getAttribute("data-url");
            
          if(null !== element.getAttribute("data-expanded-url"))
            element.href = element.getAttribute("data-expanded-url");
        }, 20);

      }, 20);
    });

  }(
  [ '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onmousedown*="rwt("]'                        /* Google              */
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

  , '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="window.open("]'                    /* other (uncommon)                      */
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

  , '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[onclick*="openUrl("]'                        /* quora.com                             */

  , '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[data-url^="http"]'                           /* instagram / twitter ("t.co"/) links   */
  , '[href]:not([href=""]):not([href^="#"]):not([href*="void("])[data-expanded-url^="http"]'
  ].join(', ')
  , null
  ));

  /* action #2 - specific cases - each one gets a block ;) */

  /* Google redirect-url (static pages with no inline-events)     "https://www.google.co.il/url?q=https://support.mozilla.org/questions/978886&sa=U&ved=0ahUKEwiLiveZgoXQAhUFCsAKHf4kDeQQFggdMAE&sig2=GcPs4SqEJTmn18OIlciYVg&usg=AFQjCNGUPwIxjjHdBySbZj83lFbSEGdJlw"  ->  "https://support.mozilla.org/questions/978886"  */
  (function(query, elements){
    elements = document.querySelectorAll(query);
    if(null === elements || 0 === elements.length) return;
    try{chrome.runtime.sendMessage({badge_data: elements.length});}catch(err){}  /* Chrome API: badge over extension's icon. */

    elements.forEach(function(element){
      var match;
      match = element.href.match(/\/\/www\.google\.[^\/]+\/url\?q\=([^\&]+)/i);
      if(null === match || 2 !== match.length) return;
      
      match = match[1];                             
      match = decodeURIComponent(match);
      
      element.setAttribute("href", match); /* hard overwrite */
    });
  }(
    '[href]:not([href=""]):not([href^="#"]):not([onclick]):not([onmousedown]):not([jsaction])[href^="/url?q="]'
  , null
  ));

  /* done */

}(
  self              /* window    */
, self.document     /* document  */
));
