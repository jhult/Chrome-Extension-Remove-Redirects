/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_end                                                    ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected immediately after the DOM is complete,  ║
   ║ - but before subresources like images and frames have loaded.      ║
   ║ - Like DOMContentLoaded                                            ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

NodeList.prototype.forEach = Array.prototype.forEach;
(function(window, document, tmp, elements){

  if(null === elements || 0 === elements.length) return;

  /* notify chrome-extension, so the number will be shown as a "badge" */
  chrome.runtime.sendMessage({number_of_elements_with_redirects: elements.length});

  /* remove redirects in favor of real-link */
  elements.forEach(function(element){
    element.removeAttribute("onmousedown");
    
    if(null === element.parentNode) return;
    tmp = element.cloneNode(true); /* remove events */
    element.parentNode.replaceChild(tmp, element);
  });
}(
  window
, document
, null
, document.querySelectorAll('[onmousedown*="rwt("], [onmousedown*=".href="]')
));
