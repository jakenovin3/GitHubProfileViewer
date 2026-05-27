import React, { useState } from 'react'
import githubLogo from "./assets/github-logo.svg";
import githubLogoWhite from "./assets/github-logo-white.svg";


function WelcomePage({selectUser}) {
  return(
    <div id="welcomePageContainer">
      <div id="welcomePageSection">
        <img src={githubLogoWhite}></img>
        <h1>Search for a GitHub user</h1>
        <h4>Enter a username above to view their profile and repositories</h4>
        <h4>Or start with one of these</h4>
        <ul id="suggestedUsersList">
          <li className="suggestedUser" onClick={() => selectUser("jakenovin3")}><b>jakenovin3</b></li>
          <li className="suggestedUser" onClick={() => selectUser("octocat")}><b>octocat</b></li>
          <li className="suggestedUser" onClick={() => selectUser("n0an")}><b>n0an</b></li>
          <li className="suggestedUser" onClick={() => selectUser("theovilardo")}><b>theovilardo</b></li>
        </ul>
      </div>
    </div>
  );
}


function SearchBar({onSearch, resetUser}) {

  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return(
    <>
      <img id="githubLogo" src={githubLogo} onClick={resetUser}></img>
      <div className="searchDiv">
        <form onSubmit={handleSubmit}>
          <input type="text" id="profileSearch" name="profileSearch" placeholder="Enter GitHub username"></input>
          <button id="searchSubmit" onClick={onSearch}>Search</button>
        </form>
      </div>
    </>
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
      <div id="repoList">
        {repoData?.map((repo) => (
          <Repository key={repo.id} repo={repo} />
        ))}
      </div>
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

  async function getUserData(selectedUsername) {

    //const searchedUsername = document.querySelector('#profileSearch').value;
    const searchedUsername = selectedUsername || "octocat";

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

  function resetUser() {
    setUserData(null);
    setRepoData(null);
  }


  return(
    <>
      <div className="header">
        <SearchBar id="searchBar" onSearch={getUserData} resetUser={resetUser}/>
      </div>
      {!userData ?
        <WelcomePage selectUser={getUserData}/> : 
        (
          <div className="main">
            <div className="profileHeaderSection">
              <ProfileHeader user={userData} />
            </div>
            <div className="profileBody">
              <RepoSection repoData={repoData} />
              <LanguageBreakdown repoData={repoData} />
            </div>
          </div>
        )
      }
      
    </>
  );
}