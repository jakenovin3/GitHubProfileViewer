import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// Functions



// Components
function SearchBar() {
  return(
    <div className="searchDiv">
      <input type="search" id="profileSearch" name="profileSearch"></input>
      <button>Search</button>
    </div>
  );
}

function ProfileHeader() {
  return(

    <div className="profileHeader">
      <h1>GitHubUser123</h1>
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
  return(
    <div className="main">
      <SearchBar />
      <ProfileHeader />
      <div className="infoCardSection">
        <InfoCard title={"Title 1"} desc={"Description 1 Description 1 Description 1"}/>
        <InfoCard title={"Title 2"} desc={"Description 2 Description 2 Description 2"}/>
        <InfoCard title={"Title 3"} desc={"Description 3 Description 3 Description 3"}/>
       </div>
    </div>
  );
}