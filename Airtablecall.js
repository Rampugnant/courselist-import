const Airtable = require('airtable');
const {apiKey} = require('./config');
const main = require('./main');
const filters = require('./filters');

// Define Airtable Base specifics
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: apiKey
});

const base = Airtable.base('appgoaq9qwhJDXgtb');
const source = 'courselist';
const view = 'Grid view';


// This is the first function called
function getATRecords() {
    
    let sourceRecordsMatch = [];

    // using Airtable's API, get records
    base(source).select({
        view: view
    }).eachPage(function page(records, fetchNextPage) {
        for (let i = 0; i < records.length; i++){
            // casts types and marks recs based on filters
            filters.testandcleanAT(records[i]._rawJson.fields);
            
            // removes rejected records
            if (records[i]._rawJson.fields.reject){
                records.splice(i, 1);
            } else {
                sourceRecordsMatch.push(records[i]._rawJson);
            }
        }

        fetchNextPage();
    }, function done(err) {
        if (err) {console.log(err); return}

        
        // Once everything above is done, parse the collocated data file
        main.parseFile()
        .then(function(data){
        // Once parsed, compare both sets of records

            return main.comparison(data, sourceRecordsMatch);
        })
        
        .then(function(arrs){
            // the comparison above results in an array of 2 arrays
            // [0] is the records to create array 
            // [1] is the records to update array
            if (arrs[0].length !== 0) {
                // send create array to be paced and passed to create method.
                console.log("Create this many records: " + arrs[0].length);
                
                main.buildByTen(arrs[0], source, createAllRecords);
                
            }
            if (arrs[1].length !== 0) {
                // send update array to be paced and passed to update method.
                console.log("Update this many records: " + arrs[1].length);
                main.buildByTen(arrs[1], source, updateAllRecords);
        
            }
        })
        

        .catch(function(err){ console.log(err);})
        

    })
    
}


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
} 

async function updateAllRecords (update, table) {
    await sleep(500);
    base(table).update(update, 
        {typecast: true}, function(err, records) {
        if (err) {
            console.error(err);
            return;
        }
    });
}

async function createAllRecords (create, table) {
    await sleep(500);
    base(table).create(create,
        {typecast: true}, function(err, records) {
        if (err) {
          console.error(err);
          return;
        }
    });
}

getATRecords();
