import './SearchPage.css';
import React from 'react';
import {default as placeholderData} from './test-search.js';
import {default as countyData} from './countyData.js';
import {default as cityDataAll} from './cityData.js';

function SearchResultsTable({searchData}) {

    console.log("the search data used in table:");
    console.log(searchData);


    return(
    <table>
        <thead>
        <tr>
            <th>First Name</th>
            <th>Middle Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>City</th>
            <th>County</th>
            <th>ZIP</th>
        </tr>
        </thead>
        <tbody>
        {searchData.map((voter) => {
        return (<tr key={voter.ncid}><td>{voter.first_name}</td>
            <td>{voter.middle_name}</td>
            <td>{voter.last_name}</td>
            <td>{voter.phone}</td>
            <td>{voter.address}</td>
            <td>{voter.city}</td>
            <td>{voter.county}</td>
            <td>{voter.zip_code}</td>
        </tr>)
        })}
        </tbody>
    </table>
    );
}


function SearchPage() {

  const [cityData, setCityData] = React.useState(cityDataAll); //todo: allow filter by county
  const [searchResultData, setSearchResultData] = React.useState([]);
  const [showResults, setshowResults] = React.useState(false);
  const [showExactWarning, setShowExactWarning] = React.useState(false);
  

  const initialFormData = {
    firstname: "",
    firstnameExact: true,
    middlename: "",
    middlenameExact: true,
    lastname: "",
    lastnameExact: true,
    phone: "",
    address: "",
    city: "",
    county: "",
    zip: ""
  };

  const [formData, setFormData] = React.useState(initialFormData);

  const handleChange = (e) => {
    let id = e.target.id;
    let value = e.target.value;
    let newFormData ={...formData};

    console.log(`setting ${id} to ${value}`);

    if(id === "firstnameExact" || id === "middlenameExact" || id === "lastnameExact"){   
        newFormData[id]=e.target.checked;

        console.log("new data:");
        console.log(newFormData);

        //if any 'exact' checkboxes are unchecked, show the warning:
        if(!newFormData.firstnameExact || !newFormData.middlenameExact || !newFormData.lastnameExact){
            setShowExactWarning(true);
        }
        else {
            setShowExactWarning(false);
        }
    }
    else {
        newFormData[id]=value;
    }

    setFormData(newFormData);

    if(id === "county"){
        handleCountySelect(e);
    }
  };


  /* Filter the available list of cities by the selected county */
  let handleCountySelect = (e) => {
    let county = e.target.value;
    if(county === undefined || county===""){
        setCityData(cityDataAll);
    }
    else {
        let tempCityArray = cityDataAll.filter((city) => city.county === county);
        setCityData(tempCityArray);
    }

    //handle if selected city is no longer in the dropdown list after filtering by county
    if(!cityDataAll.filter((city) => city.county === county).includes((city) => city.city === formData.city)){
        console.log("City was not included in this county, reset city value");
        let newFormData ={...formData};
        newFormData.city="";
        setFormData(newFormData);
    }
  }


  let handleSearch = async (e) => {
    e.preventDefault(); // Prevents page reload

    //show loading indicator

    //get values from form
    let terms = [];

    console.log(formData);


    //check for any issues before sending


    //query database    
    let result = await queryDBForSearchResults(terms);
    setSearchResultData(result);


    //remove loading indicator

    //display data table
    setshowResults(true);
  };


  let queryDBForSearchResults = async (terms) => {

    //send search query to back end

    //return results
    return placeholderData;
  }


  return (
    <div>
        <h1 className="center">NC Voter Search</h1>
        <form className="searchform" onSubmit={handleSearch}>
          <div>
            <div>
                <label htmlFor ="firstname">First Name</label>      
                <input
                    name="firstname"
                    id="firstname"
                    type="text"
                    placeholder="first name"
                    value={formData.firstname}
                    onChange={handleChange}
                />
                <label htmlFor="firstnameExact"><input type="checkbox" id="firstnameExact" defaultChecked  onChange={handleChange}></input>Exact</label>
            </div>

            <div>
                <label htmlFor ="middlename">Middle Name</label>
                <input
                    name="middlename"
                    id="middlename"
                    type="text"
                    placeholder="middle name"
                    value={formData.middlename}
                    onChange={handleChange}
                />
                <label htmlFor="middlenameExact"><input type="checkbox" id="middlenameExact" defaultChecked  onChange={handleChange}></input>Exact</label>
            </div>

            <div>
                <label htmlFor ="lastname">Last Name</label>
                <input
                    name="lastname"
                    id="lastname"
                    type="text"
                    placeholder="last name"
                    value={formData.lastname}
                    onChange={handleChange}
                />
                <label htmlFor="lastnameExact"><input type="checkbox" id="lastnameExact" defaultChecked onChange={handleChange}></input>Exact</label>
            </div>
          </div>
          
          {showExactWarning && <div id="exact-warning">When searching for a partial name, the search may take many times longer than an exact search, up to several minutes. Please search for the most complete names that you can, at least 3 letters long.</div>}
          <br />

          <div>
            <label htmlFor ="phone">Phone Number</label>
            <input
                name="phone"
                id="phone"
                type="tel"
                placeholder="phone number"
                value={formData.phone}
                onChange={handleChange}
            />

            <label htmlFor ="address">Street Address</label>
            <input
                name="address"
                id="address"
                type="text"
                placeholder="street address"
                value={formData.address}
                onChange={handleChange}
            />

            <label htmlFor ="zip">Zip Code</label>
            <input
                name="zip"
                id="zip"
                type="number"
                placeholder="zip code"
                value={formData.zip}
                onChange={handleChange}
            />

            <label htmlFor ="county">County</label>
            <select id="county" onChange={handleChange}>
                <option key="0" value=""></option>
                {countyData.map((county) => {
                    return (<option key={county.county} value={county.county}>{county.county.toLowerCase()}</option>)
                })}
            </select>

            <label htmlFor ="city">City</label>
            <select id="city" onChange={handleChange}>
                <option key="0" value=""></option>
                {cityData.map((city) => {
                    return (<option key={city.city} value={city.city}>{city.city.toLowerCase()}</option>)
                })}
            </select>

            <button type="submit" >Search</button>
          </div>
        </form>

        {showResults && <SearchResultsTable searchData={searchResultData}></SearchResultsTable>}
    </div>
  );
}

export default SearchPage;