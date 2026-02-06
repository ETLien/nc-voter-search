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
        return (<tr key={voter.ncid}><td>{voter.firstname}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
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
    newFormData[id]=value;
    
    setFormData(newFormData);
  };


  /* Filter the available list of cities by the selected county */
  let handleCountySelect = (e) => {
    let county = e.target.value;
    if(county == undefined || county===""){
        setCityData(cityDataAll);
    }
    else {
        let tempCityArray = cityDataAll.filter((city) => city.county === county);
        setCityData(tempCityArray);
    }


    //todo: handle if selected city is no longer in the dropdown list after filtering by county
  }


  let handleSearch = async (e) => {
    e.preventDefault(); // Prevents page reload

    //show loading indicator

    //get values from form
    let terms = [];


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
                <input id="firstname"></input>
                <label htmlFor="firstnameExact"><input type="checkbox" id="firstnameExact" defaultChecked></input>Exact</label>
            </div>

            <div>
                <label htmlFor ="middlename">Middle Name</label>
                <input id="middlename"></input>
                <label htmlFor="middlenameExact"><input type="checkbox" id="middlenameExact" defaultChecked></input>Exact</label>
            </div>

            <div>
                <label htmlFor ="lastname">Last Name</label>
                <input id="lastname"></input>
                <label htmlFor="lastnameExact"><input type="checkbox" id="lastnameExact" defaultChecked></input>Exact</label>
            </div>
          </div>

          <div id="exact-warning">When searching for a partial name, the search may take many times longer than an exact search, up to several minutes. Please search for the most complete name that you can.</div>
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
            <select id="county" onChange={handleCountySelect}>
                <option key="0" value=""></option>
                {countyData.map((county) => {
                    return (<option key={county.county} value={county.county}>{county.county.toLowerCase()}</option>)
                })}
            </select>

            <label htmlFor ="city">City</label>
            <select id="city">
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