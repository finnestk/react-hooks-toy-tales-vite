import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

function App() {
  const [toys, setToys] = useState([]);
  const [showForm, setShowForm] = useState(false);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  useEffect(() => {
    fetch("http://localhost:3001/toys")
      .then((response) => response.json())
      .then((toyData) => {
        setToys(toyData);
      })
      .catch((error) => console.error("Error fetching toys:", error));
  }, []);

  function handleAddToy(newToyData) {
    fetch("http://localhost:3001/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newToyData,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((savedToy) => {
        setToys([...toys, savedToy]);
      })
      .catch((error) => console.error("Error creating toy:", error));
  }

  function handleLikeToy(toyToUpdate) {
    fetch(`http://localhost:3001/toys/${toyToUpdate.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likes: toyToUpdate.likes + 1,
      }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        const updatedToys = toys.map((toy) =>
          toy.id === updatedToy.id ? updatedToy : toy
        );
        setToys(updatedToys);
      })
      .catch((error) => console.error("Error updating likes:", error));
  }

  function handleDeleteToy(id) {
    fetch(`http://localhost:3001/toys/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        const remainingToys = toys.filter((toy) => toy.id !== id);
        setToys(remainingToys);
      })
      .catch((error) => console.error("Error deleting toy:", error));
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer 
        toys={toys} 
        onLikeToy={handleLikeToy} 
        onDeleteToy={handleDeleteToy}
      />
    </>
  );
}

export default App;