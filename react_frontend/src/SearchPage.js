import './SearchPage.css';
import React from 'react';
import {default as placeholderData} from './test-search.js';

function SearchResultsTable({searchData}) {
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
    </table>
    );
}


function SearchPage() {

  const [searchResultData, setSearchResultData] = React.useState([]);
  const [showResults, setshowResults] = React.useState(false);

  let handleSearch = async (e) => {
    e.preventDefault(); // Prevents page reload
    alert("Search triggered");


    console.log("showResults at the beginning of the event handler: "+showResults);

    //show loading indicator

    //get values from form

    //check for any issues before sending

    //query database
    let terms = [];
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
            <input id="phone"></input>

            <label htmlFor ="address">Street Address</label>
            <input id="address"></input>

            <label htmlFor ="zip">Zip Code</label>
            <input id="zip"></input>

            <label htmlFor ="county">County</label>
            <select id="county"></select>

            <label htmlFor ="city">City</label>
            <select id="city"></select>

            <button type="submit" >Search</button>
          </div>
        </form>

        {showResults && <SearchResultsTable searchData={searchResultData}></SearchResultsTable>}
    </div>
  );
}

export default SearchPage;