/* 
    This file allows you to set up the filters and to edit the 
    parsed data to result in a ready to go record.

*/


function testandcleanfile(obj) {

    let reject = 0

    // cleans - does required data conversions - this will be custom to each data
    if(obj.articleNum || obj.articleNum >= 0){ obj.articleNum += ""; }
    if(obj.birthDate){ obj.birthDate = new Date(obj.birthDate); }
    
    // Working on a way to clean html tags out of text ----
        // if(obj.notes){ obj.notes = removeTags(obj.notes); }

    // filters - tests records to make sure we want them  - again, custom to each data
    if(!obj.birthDate){ reject++; }
    if(obj.lastname === null){ reject++; }

    // if a rec failed, mark as rejected
    if(reject >= 1) {obj.reject = true;}
    
}

function testandcleanAT (obj) {
    let reject = 0;

    // cleans - does required data conversions - this will be custom to each data
    if(obj.birthDate){ obj.birthDate = new Date(obj.birthDate); }

    // filters - tests records to make sure we want them  - again, custom to each data
    if(!obj.id){ reject++; }
    if(!obj.birthDate){ reject++; }
    if(obj.lastname === null){ reject++; }

    // if a rec failed, mark as rejected
    if(reject >= 1) {obj.reject = true;}

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