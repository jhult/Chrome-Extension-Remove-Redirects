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