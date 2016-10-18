/* ╔══════════════════════════════╗
   ║ background_main              ║
   ╟──────────────────────────────╢
   ║                              ║
   ╚══════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */

chrome.runtime.onMessage.addListener(function(incoming_message, sender_frame, responseFN) {
  if(!sender_frame || !sender_frame.tab || !sender_frame.tab.id) return;

  chrome.browserAction.setBadgeBackgroundColor({
      color: [33, 106, 18, 255] /* dark-green */
    , tabId: sender_frame.tab.id
  });

  chrome.browserAction.setBadgeText({
      text:  String( incoming_message.badge_data )
    , tabId: sender_frame.tab.id
  });

  
//  console.log(arguments);
});