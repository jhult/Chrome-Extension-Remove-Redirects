/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_end                                                    ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected immediately after the DOM is complete,  ║
   ║ - but before subresources like images and frames have loaded.      ║
   ║ - Like DOMContentLoaded                                            ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

(function(setInterval){
  "use strict";
  
  setInterval(function(){


    (function(elements){
      if(null === elements || 0 === elements.length) return;

      /* notify chrome-extension, so the number will be shown as a "badge" */
      chrome.runtime.sendMessage({number_of_elements_with_redirects: elements.length});

      /* remove redirects in favor of real-link */
      Array.prototype.forEach.call(elements, function(element){
        var tmp;

        /* remove non-attribute hooks by reparsing original node's-state from HTML source. */
        if(null !== element.parentNode){
          tmp = element.cloneNode(true);
          element.parentNode.replaceChild(tmp, element);
          element = tmp; 
        }

        /* remove attribute hooks, must be second to "cloneNode" above, since if the attribute was originated from the HTML the cloneNode will restore it.. */ 
        element.removeAttribute("onmousedown");
        element.removeAttribute("jsaction");
        element.removeAttribute("onclick"); /* dangerous (but required for quora and other sites..). */
                                            /* TODO: check before each removeAttribute, if it is needed. */
        
      });
    }(
      document.querySelectorAll(
        [
        /* Google (generic/images search + new HTML5 hooks flag) */
           '[href]:not([href=""]):not([href^="#"])[onmousedown*="rwt("]'
        ,  '[href]:not([href=""]):not([href^="#"])[jsaction*="mousedown"][jsaction*="keydown"]'

        /* main issue: [Google|Outbrain|Taboola] uses it (last two Co. had copied it from Google..) */
        ,  '[href]:not([href=""]):not([href^="#"])[onmousedown*="window.open("]' 
        ,  '[href]:not([href=""]):not([href^="#"])[onmousedown*="parent.open("]' 
        ,  '[href]:not([href=""]):not([href^="#"])[onmousedown*="self.open("]' 
        ,  '[href]:not([href=""]):not([href^="#"])[onmousedown*="top.open("]' 

        /* generic and common way to do the same thing */
        ,  '[href]:not([href=""]):not([href^="#"])[onmousedown*=".href="]'
        ,  '[href]:not([href=""]):not([href^="#"])[onmousedown*="location.replace("]'
        ,  '[href]:not([href=""]):not([href^="#"])[onmousedown*="location="]'

        /* used on quora.com */
        ,  '[href]:not([href=""]):not([href^="#"])[onclick*="openUrl("]'

        /* uncommon but in use.*/
        ,  '[href]:not([href=""]):not([href^="#"])[onclick*="window.open("]' 
        ,  '[href]:not([href=""]):not([href^="#"])[onclick*="parent.open("]' 
        ,  '[href]:not([href=""]):not([href^="#"])[onclick*="self.open("]' 
        ,  '[href]:not([href=""]):not([href^="#"])[onclick*="top.open("]' 

        ].join(', ')
      )
    ));


  }, 7000);
}(self.setInterval));