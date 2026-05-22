import React, { useState } from 'react'


// Components
function SearchBar({onSearch}) {
  return(
    <div className="searchDiv">
      <input type="searchField" id="profileSearch" name="profileSearch" placeholder="Enter GitHub username"></input>
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

function RepoSection({repos}) {

  

  return(

    <div className="userRepositories">
      <Repository repoNumber={{}}/>
    </div>

  );
}

function Repository({repoNumber}) {



  return(
    <>
    </>
  );
}


export default function App() {

  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState(null);

  async function githubFetch(endpoint) {
    const response = await fetch("https://api.github.com/" + endpoint);
    if(!response.ok) { throw new Error("Response status: " + response.status); }
    const data = await response.json();

    return data;
  }

  async function getUserData() {
    
    const searchedUsername = "octocat"; // document.querySelector('#profileSearch').value;

    try {
      const [userData, repoData] = await Promise.all([
        githubFetch("users/" + searchedUsername),
        githubFetch("users/" + searchedUsername + "/repos")
      ]);

      setUserData(userData);
      setRepoData(repoData)

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
      <div className="profileBody">
        <RepoSection user={repoData}/>
      </div>
    </div>
    </>
  );
}