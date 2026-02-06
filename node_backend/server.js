// Load dependencies
require('dotenv').config({path: './envs/.env.local'}); //Loads environment variables from a .env file
const express = require('express'); //Imports Express.js
const helmet = require('helmet'); //sets various HTTP headers for app security
const cors = require('cors'); //enables Cross-Origin Resource Sharing
//const morgan = require('morgan'); //HTTP request logger middleware - we can add if we feel we need it

const app = express(); //Creates an Express application

const pgdb = require('./database/index.js') //Import Postgres connection



// todo: Should I be assigning types to my parameters? I feel like the answer is 'yes'....



// Middleware recommended by Copilot, let's see if we need these
app.use(express.json());
/*
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
*/



//  Routes

//very basic example:
/*
router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [id])
  res.send(rows[0])
})*/



// Root/home page - now that I am using Node, this can be removed, I think
/*
app.get('/', (req, res) => {
    res.send('<h1>NC Voter Search</h1>');
});
*/

app.get('/api/health', (req, res) => {
    res.json({ uptime: process.uptime(), message: 'OK', timestamp: Date.now() });
});

app.get('/api/countylist', async (req, res) => {
    let query = "SELECT DISTINCT county_desc AS county FROM public.nc_vreg_latest";
    const { rows } = await pgdb.query(query);
    res.json(rows);
});

app.get('/api/citylist', (req, res) => {
    const { county } = req.query || undefined;

    //optionally, use the county parameter to filter cities by county
    if(county != undefined){

    }
    else {

    }    
});

app.get('/api/search', async (req, res) => {
    
    const { firstname, firstnameExact, middlename, middlenameExact, lastname, lastnameExact, address, phone, city, county, zip } = req.query;

    /*
        There are several requirements for the data to be valid to use for searching. This protects against people bypassing the front end and trying to use the
        API calls to give more than we want to. We are interested in protecting privacy of people in the database in regards to things other than their voting history;
        eg, we want to make it hard for people to use the app for stalking and doxxing.

        Therefore, the results only show an incomplete phone number, very redacted address, and only the most recent name that the voter has registered (even if they
        previously voted under a previous name). This helps to reduce the doxxing that could occur of, for example, divorced women and transgender people. The idea is
        to provide just enough information in the result that the user is confident that they have identified the correct person, without providing personal information
        not relevant to the vioting history.

        If someone has an exact phone number or exact address, they can find out a name.
        If someone has an exact name, they can see all matches for that name, and the partial phone and address should help identify the correct one.
        We won't allow a search of an entire county, city, or zip code, as that would put undue stress on the system and provide an unhelpfully large number of results.
        Since we aren't returning full addresses and phone numbers, this also means that people can't search by a region to return, essentially, a "phone book".

        Here are the requirements that the data must meet, or else it will be identified as invalid, and an error should be returned:

        If city, county, and/or zip are provided without any personally identifying information, the search is too broad and won't be performed.
        If firstname, middlename, or lastname are less than 3 characters, they are too short - unless the "exact" checkbox has been checked for the short string.        
    */

    console.log(`Search parameters received:
            First Name: ${firstname}
            Exact? ${firstnameExact}
            Middle Name: ${middlename}
            Exact? ${middlenameExact}
            Last Name: ${lastname}
            Exact? ${lastnameExact}
            Address: ${address}
            Phone: ${phone}
            City: ${city}
            County: ${county}
            Zip: ${zip}
    `);


    let error = false;
    let errorMsg = "There was an error with the search terms.";

    // Check 0: If no search terms, we can't do a search, so immediately return an error! The "exact" checkboxes don't count on their own

    if((city == undefined || city == "") && (county == undefined || county == "") && (zip == undefined || zip == "") && (firstname == undefined || firstname == "") && (middlename == undefined || middlename == "") && (lastname == undefined || lastname == "") && (phone == undefined || phone == "") && (address == undefined || address == "")) {
        console.log("Error: no search terms were provided!");

        error = true;
        errorMsg = "No search terms were provided.";
    }

    
    // Check 1: If city, county, and/or zip are provided without any personally identifying information, the search is too broad and won't be performed.

    //check whether a 'region' filter has been used
    if(!error && !(city == undefined) || !(county == undefined) || !(zip == undefined)) {
        // region filter in use, check whether a personally identifying field has been used
        if(!(firstname == undefined) || !(middlename == undefined) || !(lastname == undefined) || !(phone == undefined) || !(address == undefined)) {
            // good to go
        }
        else {
            // We have an error, search is too broad
            error = true;
            errorMsg = "You must include a name, phone number, and/or address with your search.";
        }
    }
    
    
    // Check 2: If firstname, middlename, or lastname are less than 3 characters, they are too short - unless the "exact" checkbox has been checked for the short string.
    // I intend to enforce this in the UI already, but it's good to also make the API enforce it.

    if(!error && ((firstname != undefined && firstname.length < 3 && !(firstnameExact == "true")) || (middlename != undefined && middlename.length < 3 && !(middlenameExact == "true")) || (lastname != undefined && lastname.length < 3 && !(lastnameExact == "true")))){
        
        error = true;
        errorMsg = "Name fields must contain at least 3 characters, unless 'exact' is selected for that field.";
    }

    if(error){
        let errorJson = {
            error: error,
            errorMsg: errorMsg
        };

        res.json(errorJson);
    }
    else {
        try{
            
            let queryParts = {};
            let queryValues = [];
            let i = 0;

            if(!(firstname == undefined || firstname == "")){
                i++;
                if(firstnameExact=="true"){
                    queryParts.firstnameQuery = "first_name = $"+i;
                    queryValues.push(firstname.toUpperCase());
                }
                else {
                    queryParts.firstnameQuery = "first_name LIKE $"+i;
                    queryValues.push('%'+firstname.toUpperCase()+'%');
                }
            }
            
            if(!(middlename == undefined || middlename == "")){
                i++;
                if(middlenameExact=="true"){
                    queryParts.middlenameQuery = "middle_name = $"+i;
                    queryValues.push(middlename.toUpperCase());
                }
                else {
                    queryParts.middlenameQuery = "middle_name LIKE $"+i;
                    queryValues.push('%'+middlename.toUpperCase()+'%');
                }                
            }
                
            if(!(lastname == undefined || lastname == "")){
                i++;
                if(lastnameExact=="true"){
                    queryParts.lastnameQuery = "last_name = $"+i;
                    queryValues.push(lastname.toUpperCase());
                }
                else {
                    queryParts.lastnameQuery = "last_name LIKE $"+i;
                    queryValues.push('%'+lastname.toUpperCase()+'%');
                }  
            }
            
            if(!(phone == undefined || phone == "")){
                i++;
                queryParts.phoneQuery = "full_phone_number = $"+i;
                queryValues.push(phone);
            }
            
            if(!(address == undefined || address == "")){
                i++;
                queryParts.addressQuery = "res_street_address = $"+i;
                queryValues.push(address);
            }

            if(!(city == undefined || city == "")){
                i++;
                queryParts.cityQuery = "res_city_desc = $"+i;
                queryValues.push(city);
            }
        
            if(!(county == undefined || county == "")){
                i++;
                queryParts.countyQuery = "county_desc = $"+i;
                queryValues.push(county);
            }
                
            if(!(zip == undefined || zip == "")){
                i++;
                queryParts.zipQuery = "zip_code = $"+i;
                queryValues.push(zip);
            }

            //public.nc_vreg_history has every single record for every time a voter has registered anything with the state's voter registry
            //let query = "SELECT DISTINCT on (ncid) ncid, first_name, middle_name, last_name, full_phone_number AS phone, res_street_address AS address, res_city_desc AS city, county_desc AS county, zip_code FROM public.nc_vreg_history WHERE ";

            //public.nc_vreg_history is a veiw showing only the lastest information from a voter's most recent registration (ie, latest name, addresss, etc)
            //let query = "SELECT * FROM public.nc_vreg_latest WHERE ";        
            //let query = "SELECT DISTINCT on (ncid) ncid, first_name, middle_name, last_name, full_phone_number AS phone, res_street_address AS address, res_city_desc AS city, county_desc AS county, zip_code FROM public.nc_vreg_latest WHERE ";
            
            //don't need to use distinct with _latest view because there should only be one record per NCID:
            let query = "SELECT ncid, first_name, middle_name, last_name, full_phone_number AS phone, res_street_address AS address, res_city_desc AS city, county_desc AS county, zip_code, data_date FROM public.nc_vreg_latest WHERE ";
            
         
            let first = true;
            for(key in queryParts){

                console.log("Adding query part for "+key);

                if(key != undefined){
                    if(first){
                        query+=queryParts[key];
                        first = false;
                    }
                    else {
                        query += " AND "+queryParts[key];
                    }
                }
            }

            //don't need to Order By when not using Distinct part of the query; will order via js on the front end later
            //query += " ORDER BY ncid, data_date desc";
            
            console.log("Executing query: "+query);
            console.log("values:");
            console.log(queryValues);

            const { rows } = await pgdb.query(query,queryValues);

            res.json(rows);

            console.log("query done");
        }
        catch (err) {
            console.error(err)
            res.status(500).json({ error: "Internal server error" })
        }
    }
});

app.get('/api/voterhistory', async (req, res) => {
    const { ncid } = req.query;

    let query = "SELECT * FROM public.nc_vhis_history WHERE ncid = $1";

    const { rows } = await pgdb.query(query,[ncid]);

    res.json(rows);
});

app.get('/api/voterregistration', async (req, res) => {
    const { ncid } = req.query;

    let query = "SELECT * FROM public.nc_vreg_history WHERE ncid = $1";

    const { rows } = await pgdb.query(query,[ncid]);

    res.json(rows);
});


/*
app.get("/test", async (req, res) => {
  try {
    const query = "SELECT COUNT(*) as nc_vreg_history_count FROM public.nc_vreg_history";

    console.log("Executing query:", query);

    const { rows } = await pgdb.query(query);
    res.json(rows)
  }
  catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" })
  } 
});
*/


// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});


// set CORS permissions wide open for now since proxy didn't work for react
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});



// Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);

    //console.log('PG Connection String:', process.env.PG_CONNECTION_STRING); // Log the connection string for debugging
    //console.log("pgdb");
    //console.log(pgdb);

    //test connection
    pgdb.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to PostgreSQL database!');
    }
    });
});

// Graceful shutdown
const shutdown = () => {
    console.log('Shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Forcing shutdown');
        process.exit(1);
    }, 10000);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

//module.exports = app; //if we need to export for testing