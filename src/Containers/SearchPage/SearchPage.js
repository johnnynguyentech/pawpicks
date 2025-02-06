import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Logout from "../../Components/Logout/Logout";
import "./SearchPage.css";

const API_BASE_URL = "https://frontend-take-home-service.fetch.com";

function SearchPage() {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState("");
  const [dogs, setDogs] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [favorites, setFavorites] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [matchedDog, setMatchedDog] = useState(null);
  const pageSize = 25; 

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchBreeds();
      fetchDogs();
    }
  }, [authToken, selectedBreed, sortOrder, page]);

  const fetchBreeds = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dogs/breeds`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setBreeds(data);
      }
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  const fetchDogs = async () => {
    try {
      const queryParams = new URLSearchParams({
        size: pageSize,
        from: page * pageSize,
        sort: `breed:${sortOrder}`,
      });

      if (selectedBreed) {
        queryParams.append("breeds", selectedBreed);
      }

      const searchResponse = await fetch(`${API_BASE_URL}/dogs/search?${queryParams.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      if (!searchResponse.ok) throw new Error("Failed to fetch dog IDs");

      const searchData = await searchResponse.json();
      const dogIds = searchData.resultIds;
      setTotalResults(searchData.total);

      if (dogIds.length === 0) {
        setDogs([]);
        return;
      }

      const detailsResponse = await fetch(`${API_BASE_URL}/dogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(dogIds),
      });

      if (!detailsResponse.ok) throw new Error("Failed to fetch dog details");

      const dogDetails = await detailsResponse.json();
      setDogs(dogDetails);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const nextPage = () => {
    if ((page + 1) * pageSize < totalResults) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const toggleFavorite = (dogId) => {
    setFavorites((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  };

  const generateMatch = async () => {
    if (favorites.length === 0) {
      alert("Please select at least one favorite dog to generate a match.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/dogs/match`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(favorites),
      });

      if (response.ok) {
        const matchedDogId = await response.json();
        console.log("Matched Dog ID:", matchedDogId);

        
        const matchedDog = dogs.find((dog) => dog.id === matchedDogId.match);

        if (matchedDog) {
          setMatchedDog(matchedDog);
          setShowModal(true);
        } else {
          alert("Match found, but details are unavailable.");
        }
      } else {
        console.error("Failed to generate match:", response.status, response.statusText);
        alert("Error generating match. Please try again.");
      }
    } catch (error) {
      console.error("Error generating match:", error);
      alert("Error generating match. Please try again.");
    }
  };

  return (
    <div className="SearchPage">
      <div className="top-bar">
        <h1>PawPicks</h1>
        <Logout />
      </div>
      <div className="filter-sort-container">
        <div className="filter-container">
          <label>Filter by Breed:</label>
          <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>
        <div className="sort-button-container">
          <label>Sort by Breed: </label>
          <button className="sort-button" onClick={toggleSortOrder}>
            {sortOrder === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>
      </div>
      
      <button className="match-button" onClick={generateMatch}>
        Find Your Match
      </button>

      
      <div className="dog-list">
        {dogs.map((dog) => (
          <div key={dog.id} className="dog-card">
            {dog.img && <img src={dog.img} alt={dog.name} className="dog-image" />}
            <h2>{dog.name}</h2>
            <p>Breed: {dog.breed}</p>
            <p>Age: {dog.age} years</p>
            <p>Zip Code: {dog.zip_code}</p>
            <button
              className={favorites.includes(dog.id) ? "favorited" : ""}
              onClick={() => toggleFavorite(dog.id)}
            >
              {favorites.includes(dog.id) ? "★ Favorited" : "☆ Favorite"}
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 0}>
          Previous
        </button>
        <span>
          Page {page + 1} of {Math.ceil(totalResults / pageSize)}
        </span>
        <button onClick={nextPage} disabled={(page + 1) * pageSize >= totalResults}>
          Next
        </button>
      </div>

      {showModal && matchedDog && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">We have a match!</h5>
              </div>
              <div className="modal-body">
                <img src={matchedDog.img} alt={matchedDog.name} className="dog-image" />
                <h3>{matchedDog.name}</h3>
                <p>Breed: {matchedDog.breed}</p>
                <p>Age: {matchedDog.age} years</p>
                <p>Zip Code: {matchedDog.zip_code}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-btn" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
