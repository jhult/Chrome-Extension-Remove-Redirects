/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_idle                                                   ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ The browser chooses a time to inject scripts between               ║
   ║  "document_end" and immediately after the                          ║
   ║  window.onload event fires.                                        ║
   ║                                                                    ║
   ║ The exact moment of injection depends on                           ║
   ║  how complex the document is and how long it is taking to load,    ║
   ║  and is optimized for page load speed.                             ║
   ║                                                                    ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ Note:                                                              ║
   ║    With "document_idle", content scripts may not                   ║
   ║    necessarily receive the window.onload event,                    ║
   ║    because they may run after it has already fired.                ║
   ║                                                                    ║
   ║    In most cases, listening for the onload event is unnecessary    ║
   ║    for content scripts running at "document_idle"                  ║
   ║    because they are guaranteed to run after the DOM is complete.   ║
   ║                                                                    ║
   ║    If your script definitely needs to run after window.onload,     ║
   ║    you can check if onload has already fired                       ║
   ║    by using the document.readyState property.                      ║
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
        element.removeAttribute("onmousedown");
        element.removeAttribute("jsaction");
        
        if(null === element.parentNode) return;
        element.parentNode.replaceChild(element.cloneNode(true), element);
      });
    }(
      document.querySelectorAll(
        [  '[href][onmousedown*="rwt("]'
        ,  '[href][onmousedown*=".href="]'
        ,  '[href][onmousedown*="window.open("]' 
        ,  '[href][onmousedown*="location.replace("]'
        ,  '[href][onmousedown*="location="]'
        ,  '[href][jsaction*="mousedown"][jsaction*="keydown"]'
        ].join(', ')
      )
    ));


  }, 3000);
}(self.setInterval));