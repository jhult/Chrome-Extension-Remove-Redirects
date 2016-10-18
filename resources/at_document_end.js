/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_end                                                    ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected immediately after the DOM is complete,  ║
   ║ - but before subresources like images and frames have loaded.      ║
   ║ - Like DOMContentLoaded                                            ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

(function(window, document, action, query){
  "use strict";

  NodeList.prototype.forEach = Array.prototype.forEach;

  action = function action(elements){
    if(null === elements || 0 === elements.length) return;

    chrome.runtime.sendMessage({badge_data: elements.length});  /* Chrome API: badge over extension's icon. */

    elements.forEach(function(element){
      setTimeout(function(){
        /* quick fix */
        element.removeAttribute("onmousedown");
        element.removeAttribute("jsaction");
        element.removeAttribute("onclick");

        /* slow fix (event-unhook) (DOM heavy)*/
          setTimeout(function(){
            var tmp;
            
            if(null === element.parentNode) return;
            
            tmp = element.cloneNode(true);  /* restores original ("from HTML") state. */
            element.parentNode.replaceChild(tmp, element);
            element = tmp; 

            /* run again (the node had restored due to the clone trick..) */
            element.removeAttribute("onmousedown");
            element.removeAttribute("jsaction");
            element.removeAttribute("onclick");
          }, 50);
      }, 10);
    });
  }
  
  query = [ '[href]:not([href=""]):not([href^="#"])[onmousedown*="rwt("]'                        /* Google              */
          , '[href]:not([href=""]):not([href^="#"])[jsaction*="mousedown"][jsaction*="keydown"]'

          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="window.open("]'                /* other (very common) */
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="self.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="top.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="parent.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="frames.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*=".href="]'
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="location="]'
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="location.replace("]'
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="location.reload("]'
          , '[href]:not([href=""]):not([href^="#"])[onmousedown*="location.assign("]'

          , '[href]:not([href=""]):not([href^="#"])[onclick*="window.open("]'                    /* other (uncommon)    */
          , '[href]:not([href=""]):not([href^="#"])[onclick*="self.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onclick*="top.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onclick*="parent.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onclick*="frames.open("]' 
          , '[href]:not([href=""]):not([href^="#"])[onclick*=".href="]'
          , '[href]:not([href=""]):not([href^="#"])[onclick*="location="]'
          , '[href]:not([href=""]):not([href^="#"])[onclick*="location.replace("]'
          , '[href]:not([href=""]):not([href^="#"])[onclick*="location.reload("]'
          , '[href]:not([href=""]):not([href^="#"])[onclick*="location.assign("]'

          , '[href]:not([href=""]):not([href^="#"])[onclick*="openUrl("]'                        /* quora.com           */
          ].join(', ');

  
  /* run */
  
  action(document.querySelectorAll(query));            /* run asap       */

  setInterval(function(){   /* repeat task */
    action(document.querySelectorAll(query));          /* repeating task */
  }, 5000);

}(
  self              /* window    */
, self.document     /* document  */
, null              /* action    */
, null              /* query     */
));