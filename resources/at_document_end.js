/* ╔════════════════════════════════════════════════════════════════════╗
   ║ at_document_end                                                    ║
   ╟────────────────────────────────────────────────────────────────────╢
   ║ File's content is injected immediately after the DOM is complete,  ║
   ║ - but before subresources like images and frames have loaded.      ║
   ║ - Like DOMContentLoaded                                            ║
   ╚════════════════════════════════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

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
