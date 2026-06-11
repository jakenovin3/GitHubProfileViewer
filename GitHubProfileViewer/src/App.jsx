import React, { useState } from "react";
import githubLogo from "./assets/github-logo.svg";
import githubLogoWhite from "./assets/github-logo-white.svg";
//import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

async function getLanguageData(userData, repoData) {
  const langPromises = repoData.map(async (repo) => {
    const endpoint = "repos/" + userData.login + "/" + repo.name + "/languages";
    const response = await fetch("https://api.github.com/" + endpoint);
    const langResolve = await response.json();

    return { repoName: repo.name, repoLanguages: langResolve };
  });

  //const langPromises = [];
  const languageData = await Promise.all(langPromises);

  return languageData;
}

function WelcomePage({ selectUser }) {
  return (
    <div id="welcomePageContainer">
      <div id="welcomePageSection">
        <img src={githubLogoWhite}></img>
        <h1>Search for a GitHub user</h1>
        <h4>Enter a username above to view their profile and repositories</h4>
        <h4>Or start with one of these</h4>
        <ul id="suggestedUsersList">
          <li className="suggestedUser" onClick={() => selectUser("jakenovin3")}>
            <b>jakenovin3</b>
          </li>
          <li className="suggestedUser" onClick={() => selectUser("octocat")}>
            <b>octocat</b>
          </li>
          <li className="suggestedUser" onClick={() => selectUser("n0an")}>
            <b>n0an</b>
          </li>
          <li className="suggestedUser" onClick={() => selectUser("theovilardo")}>
            <b>theovilardo</b>
          </li>
        </ul>
      </div>
    </div>
  );
}

function SearchBar({ onSearch, resetUser }) {
  function handleSubmit(e) {
    e.preventDefault();
    onSearch();
  }

  return (
    <>
      <img id="githubLogo" src={githubLogo} onClick={resetUser}></img>
      <div className="searchDiv">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="profileSearch"
            name="profileSearch"
            placeholder="Enter GitHub username"
          ></input>
          <button id="searchSubmit" onClick={onSearch}>
            Search
          </button>
        </form>
      </div>
    </>
  );
}

function ProfileHeader({ user }) {
  return (
    <div className="profileHeader">
      <div id="userInfo">
        <img id="profileImage" src={user?.avatar_url} alt="profile image" />
        <h1 id="userLocation">{user?.login}</h1>
        <p id="userL">{user?.location}</p>
      </div>
      <div id="accountInfo">
        <p>
          <b>{user?.followers}</b> followers
        </p>
        <p>
          <b>{user?.following}</b> following
        </p>
      </div>
    </div>
  );
}

function RepoSection({ repoData, languages }) {
  return (
    <div className="repoSection">
      <h2>Repositories</h2>
      <div id="repoList">
        {repoData?.map((repo) => (
          <Repository key={repo.id} repo={repo} languages={languages} />
        ))}
      </div>
    </div>
  );
}

function Repository({ repo, languages }) {
  //console.log("repo languages: ", languages);
  const lastUpdatedDate = new Date(repo?.updated_at);
  const dateFormatting = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = lastUpdatedDate.toLocaleDateString("en-US", dateFormatting);

  const repoPrimaryLanguage = () => {
    for (const currentRepo of languages) {
      if (
        Object.entries(currentRepo.repoLanguages).length > 0 &&
        currentRepo.repoName === repo.name
      ) {
        return Object.entries(currentRepo.repoLanguages).reduce((max, current) => {
          return current[1] > max[1] ? current : max;
        });
      }
    }
  };

  let primaryLanguage = "";
  if (repoPrimaryLanguage() !== undefined) {
    primaryLanguage = repoPrimaryLanguage()[0];
  }

  return (
    <a href={repo?.html_url} className="repoLink" target="_blank" rel="noopener noreferrer">
      <div className="repository">
        <div className="mainRepoContent">
          <div className="repoInfo">
            <div className="repoHeader">
              <h3>{repo?.name}</h3>
              {primaryLanguage !== "" ? (
                <span id="repoTopLanguage">{primaryLanguage}</span>
              ) : (
                <span></span>
              )}
            </div>
            <h4>{repo?.description}</h4>
          </div>
          <div className="repoData">
            <p>
              <b>{repo?.stargazers_count}</b> stars
            </p>
            <p>
              <b>{repo?.forks_count}</b> forks
            </p>
          </div>
        </div>
        <div className="updatedAt">
          <p>
            <i>Last updated on {formattedDate}</i>
          </p>
        </div>
      </div>
    </a>
  );
}

function LanguageBreakdown({ languageData }) {
  const languages = languageData.map(({ repoLanguages }) => repoLanguages);

  const languageSums = languages.reduce((acc, repoLangs) => {
    for (const [lang, bytes] of Object.entries(repoLangs)) {
      acc[lang] = (acc[lang] || 0) + bytes;
    }
    return acc;
  }, {});

  console.log("Sums: ", languageSums);
  return <div className="languageBreakdown"></div>;
}

export default function App() {
  const [userData, setUserData] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [langData, setLangData] = useState(null);

  async function githubFetch(endpoint) {
    const response = await fetch("https://api.github.com/" + endpoint);
    if (!response.ok) {
      throw new Error("Response status: " + response.status);
    }
    const data = await response.json();

    return data;
  }

  async function getUserData(selectedUsername) {
    const searchedUsername = selectedUsername;

    try {
      const [userData, repoData] = await Promise.all([
        githubFetch("users/" + searchedUsername),
        githubFetch("users/" + searchedUsername + "/repos"),
      ]);

      const languageData = await getLanguageData(userData, repoData);

      setUserData(userData);
      setRepoData(repoData);
      setLangData(languageData);
    } catch (error) {
      console.error("Here is the error: " + error);
    }
  }

  function resetUser() {
    setUserData(null);
    setRepoData(null);
    setLangData(null);
  }

  return (
    <>
      <div className="header">
        <SearchBar id="searchBar" onSearch={getUserData} resetUser={resetUser} />
      </div>
      {!userData ? (
        <WelcomePage selectUser={getUserData} />
      ) : (
        <div className="main">
          <div className="profileHeaderSection">
            <ProfileHeader user={userData} />
          </div>
          <div className="profileBody">
            <RepoSection repoData={repoData} languages={langData} />
            <LanguageBreakdown languageData={langData} />
          </div>
        </div>
      )}
    </>
  );
}
