/* 
    This file allows you to set up the filters and to edit the 
    parsed data to result in a ready to go record.

*/


function testandcleanfile(obj) {
    let reject = 0
    //console.log(obj.CRN);

    // filters - tests records to make sure we want them  - again, custom to each data
    if(obj.Title === null || obj.Title === undefined){ reject++; }
    if(obj['Term Code'] === null){ reject++; }
    if(obj.CRN === null){ reject++; }

    // if a rec failed, mark as rejected
    if(reject >= 1) {
        obj.reject = true;
    } else {

        // cleans - does required data conversions - this will be custom to each data
        if(obj['Start Date']) {
            obj['Start Date'] = new Date(obj['Start Date']); 
            obj['End Date'] = new Date(obj['End Date']); 
        }
        if(obj.Credits && isNaN(obj.Credits)) {
            obj.Credits = 99;
            obj.Notes += " - Variable Credit";
        }
        if(obj.Room && !isNaN(obj.Room)) {
            obj.Room += "";
        }
        if(obj.Section && !isNaN(obj.Section)) {
            obj.Section += "";
        }
        if(!isNaN(obj.Session)) {
            obj.Session += "";
        }
        if(obj.Campus){
            obj.Campus += "";
        }
        
        // clean html tags out of text ----
        if(obj.Notes !== null && obj.Notes.indexOf("href")){ 
            obj.Notes = removeTags(obj.Notes);
        }
    }
    
    
}

function testandcleanAT (obj) {
    let reject = 0;

    // filters - tests records to make sure we want them  - again, custom to each data
    if(obj.Title === undefined){ reject++; }
    if(obj['Term Code'] === undefined){ reject++; }
    if(obj.CRN === undefined){ reject++; }

    // if a rec failed, mark as rejected
    if(reject >= 1) {
        obj.reject = true;
    } else {
        // cleans - does required data conversions - this will be custom to each data
        if(obj['Start Date']) {
            obj['Start Date'] = new Date(obj['Start Date']); 
            obj['End Date'] = new Date(obj['End Date']); 
        }
    }
    
}

// used to set index points in html string for function removeTags
function logMatches(match) {

    if (match.indexOf("href")){
        let URLIndex = match.indexOf("href") + 5;
        let URL = match.slice(URLIndex, match.indexOf(' ', URLIndex));
        let linkText = match.slice(match.indexOf(">", URLIndex + URL.length+1)+1, match.indexOf("<", URLIndex + URL.length))
        return "\n" + "[" + linkText + "]" + "(" + URL + ")" + "\n";
    }
    // if match has href, pull the url link after = and up to ' '.
    // ... also pull all text between next > and following <.
    
    return '';
}

// cleans html string of markers and preps for mark down.
function removeTags (str) {
    if (str != null || str !='') {
        return str.replace( /(<([^]+)>)/ig, logMatches);
    } else {
        return false;
    }
}



module.exports = { testandcleanfile, testandcleanAT };