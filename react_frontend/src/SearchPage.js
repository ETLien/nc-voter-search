import './SearchPage.css';

function SearchPage() {

  let handleSearch = (e) => {
    e.preventDefault(); // Prevents page reload
    alert("Search triggered");

    //get values from form

    //check for any issues before sending

    //send search query to back end

    //load results

  };

  return (
    <div>
        <h1 class="center">NC Voter Search</h1>
        <form className="searchform" onSubmit={handleSearch}>
          <div>
            <div>
                <label for="firstname">First Name</label>      
                <input id="firstname"></input>
                <label for="firstnameExact"><input type="checkbox" id="firstnameExact" selected></input>Exact</label>
            </div>

            <label for="middlename">Middle Name</label>
            <input id="middlename"></input>
            <label for="middlenameExact"><input type="checkbox" id="middlenameExact" selected></input>Exact</label>

            <label for="lastname">Last Name</label>
            <input id="lastname"></input>
            <label for="lastnameExact"><input type="checkbox" id="lastnameExact" selected></input>Exact</label>
          </div>
          <br />
          <div>
            <label for="phone">Phone Number</label>
            <input id="phone"></input>

            <label for="address">Street Address</label>
            <input id="address"></input>

            <label for="zip">Zip Code</label>
            <input id="zip"></input>

            <label for="county">County</label>
            <select id="county"></select>

            <label for="city">City</label>
            <select id="city"></select>

            <button type="submit" >Search</button>
          </div>
        </form>
    </div>
  );
}

export default SearchPage;