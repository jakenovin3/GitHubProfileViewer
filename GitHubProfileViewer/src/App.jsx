import React, { useState } from 'react'
import gihubLogo from "./assets/github-logo.svg";


// Components
function SearchBar({onSearch}) {

  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return(
    <div className="searchDiv">
      <form onSubmit={handleSubmit}>
        <input type="text" id="profileSearch" name="profileSearch" placeholder="Enter GitHub username"></input>
        <button id="searchSubmit" onClick={onSearch}>Search</button>
      </form>
    </div>
  );
}

function ProfileHeader({user}) {
  return(
    <div className="profileHeader">
      <div id="userInfo">
        <img id="profileImage" src={user?.avatar_url} alt="profile image" />
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

function RepoSection({repoData}) {
  return(
    <div className="repoSection">
      <h2>Repositories</h2>
      {repoData?.map((repo) => (
        <Repository key={repo.id} repo={repo} />
      ))}
    </div>
  );
}

function Repository({repo}) {
  return(
    <a href={repo?.html_url} className="repoLink" target="_blank" rel="noopener noreferrer">
      <div className="repository">
          <h3>{repo?.name}</h3>
          <h5>{repo?.description}</h5>
      </div>
    </a>
  );
}

function LanguageBreakdown({repoData}) {
  return(
    <div className="languageBreakdown">

    </div>
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

    const searchedUsername = document.querySelector('#profileSearch').value;
    //const searchedUsername = "octocat";

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
        <img id="githubLogo" src={gihubLogo}></img>
        <SearchBar id="searchBar" onSearch={getUserData}/>
      </div>
      <div className="main">
        <div className="profileHeaderSection">
          <ProfileHeader user={userData} />
        </div>
        <div className="profileBody">
          <RepoSection repoData={repoData} />
          <LanguageBreakdown repoData={repoData} />
        </div>
      </div>
    </>
  );
}