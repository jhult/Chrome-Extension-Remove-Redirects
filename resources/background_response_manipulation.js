/* ╔════════════════════════════════════════╗
   ║ background_response_manipulation       ║
   ╟────────────────────────────────────────╢
   ║                                        ║
   ╚════════════════════════════════════════╝
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */


var   headers_to_remove = [   "content-security-policy"
                            , "content-security-policy-report-only"
                            , "strict-transport-security"
                            , "x-content-security-policy"
                            , "x-content-type-options"
                            , "x-webkit-csp"
                          ]
    , headers_to_add    = [
                          ]
    , urls_to_match     = [ "*://*/*"]
    ;

chrome.webRequest.onHeadersReceived.addListener(function(response){
  response = response.responseHeaders;
  
  response = response.filter(function(header){ return -1 === headers_to_remove.indexOf(header.name.toLowerCase()) }); /* remove headers (not case-sensitive) */
  response = response.concat(headers_to_add); /* add headers */
  response = {"responseHeaders": response}; /* constant result format */
  
  return response;
}, {"urls": urls_to_match}, ["blocking", "responseHeaders"]);

