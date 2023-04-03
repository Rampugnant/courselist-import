# AT-CSV-import

Current workflow requires colocated files on a server. Files are updated external of script. Script is called external of script. 

Script calls Airtable API for a current working view of records in specified table and ingests records, then ingests colocated file, parses and cleans it, then compares file records with Airtable records, creates update array of records to update and create array of records to create, passes arrays to API calls through pacing functions to not overcall within AT specifications.

Scripts are divided by functions that require Airtable API access being in Airtablecall.js and all other functions added to main.js. filters.js is set apart because it contains code that will need to be customized to a data set and so is setup to be more user friendly.

## Filters.js

After the file is read in it is parsed by papaparser. The results aren't always great depending on how the data was formatted in the first place. Also, based on the data types needed in Airtable, sometimes things need to be cast into a different type in order to work with the field type. This all happens in the function testandclean in this file. 

Cleans happen first. Always test to make sure there is a value currently there with an if statement. Then update the value to the necessary type. Then the filters go through and check to see if the record fits the data structure. They mark the record as a reject if it fails. Customize the function testandclean to suit your data.


