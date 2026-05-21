import React, { useState } from 'react'

// Components
function SearchBar({onSearch}) {
  return(
    <div className="searchDiv">
      <input type="searchField" id="profileSearch" name="profileSearch" placeholder="Search GitHub users..."></input>
      <button id="searchSubmit" onClick={onSearch}>Search</button>
    </div>
  );
}

function ProfileHeader({user}) {
  return(

    <div className="profileHeader">
      <div id="userInfo">
        <img id="profileImage" src={user?.avatar_url} alt="profile image"></img>
        <h1>{user?.login}</h1>
        <p>{user?.location}</p>
      </div>
      <div id="accountInfo">
        <p><b>{user?.followers}</b> followers</p>
        <p><b>{user?.following}</b> following</p>
      </div>
    </div>

  );
}

function InfoCard({title, desc}) {
  return(

    <div className="infoCard">
      <h4>{title}</h4>
      <h6>{desc}</h6>
    </div>

  );
}


export default function App() {

  const [userData, setUserData] = useState(null);

  async function getUserData() {
    // const searchedUsername = document.querySelector('#profileSearch').value;
    const searchedUsername = "octocat";
    try {
      const response = await fetch("https://api.github.com/users/" + searchedUsername);

      if(!response.ok) { throw new Error("Response status: " + response.status); }

      const data = await response.json();
      setUserData(data);
      console.log(data);
    } catch(error) {
      console.error("Here is the error: " + error);
    }
  }


  return(
    <>
    <div className="header">
      <img id="githubLogo" src="../media/github-logo.svg"></img>
      <SearchBar id="searchBar" onSearch={getUserData}/>
    </div>
    <div className="main">
      <ProfileHeader user={userData} />
      <div className="infoCardSection">
        <InfoCard title={"Title 1"} desc={"Description 1 Description 1 Description 1"} />
        <InfoCard title={"Title 2"} desc={"Description 2 Description 2 Description 2"} />
        <InfoCard title={"Title 3"} desc={"Description 3 Description 3 Description 3"} />
       </div>
    </div>
    </>
  );
}
