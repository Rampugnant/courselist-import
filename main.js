const fs = require ('fs');
const util = require ('util');
const papa = require ('papaparse');
const filter = require ('./filters');

function parseFile(){
    // Read in file and parse in the call back
    const readFile = util.promisify(fs.readFile);

    const customPromise = new Promise(function(resolve, reject){
        readFile('./ssr2cdi3.csv', 'utf-8')
            .then(function(data){
                let res;
                papa.parse(data, {
                    header: true,
                    dynamicTyping: true,
                    complete: function(results) {
                        for (let i = 0; i < results.data.length; i++){
                            // casts types and marks recs based on filters
                            filter.testandcleanfile(results.data[i]);
                            
                            // removes rejected records
                            if (results.data[i].reject){
                                results.data.splice(i, 1);
                            }
                        }
                        res = results.data;
                    }
                })
                return  res  
            })
            
            .then(function (recs){
                // once everything above is complete, return the clean records
                resolve(recs);
            })
            
                
            .catch(function (err){ 
                reject(new Error, err);
            })
        ;
    })

    return customPromise;
    
}

function comparison (fileRecs, atRecs) {
    
    let updateArray = [];
    let createArray = [];

    for (rec of fileRecs) {
        let updateCheck = 0;

        // create computed unique id that will match atrec computed unique id
        let recid = rec['Term Code'] +  " - " + rec.CRN;
        
        for (atrec of atRecs) {

            // Check if rec from file matches airtable rec (atrec)
            if(recid === atrec.fields.id){
                // increase updateCheck to show that this record does not
                // need to be created.
                updateCheck++;
                
                // iterate through fields and compare
                for (field of Object.keys(rec)){
                    
                    // account for Dates, which can't be compared as easily
                    if (rec[field] instanceof Date){
                        if (!rec[field].getTime() === atrec.fields[field].getTime()){
                            updateArray.push({
                            "id" : atrec.id,
                            "fields" : rec
                        });
                        break;
                        }
                    // compare everything else, skipping fields that are null and dropped by AT
                    } else if (rec[field] !== null && atrec.fields[field] !== undefined && !(rec[field] === atrec.fields[field])){
                        //console.log(field);
                        updateArray.push({
                            "id" : atrec.id,
                            "fields" : rec
                        });
                        break;
                    }
                }
                break;
            }
            
        }

        // check to see if rec was matched with existing atrec - if not, add to create array
        if (updateCheck === 0) {
            createArray.push({fields : {...rec}});
        }
        
    }

    return ([createArray, updateArray])
    // return both arrays

}

function buildByTen (array, table, func) {
    let decimate = Math.floor(array.length/10);
    if (decimate && func){
        for(let i = 1; i <= decimate; i++){
            //console.log(array.splice(0,9));    
            func(array.splice(0,9),table);
        }
    } else if (func) {
        //console.log(array.splice(0, array.length-1));
        func(array.splice(0, array.length), table);
    }
}

module.exports = { comparison, parseFile, buildByTen };


