document.addEventListener("DOMContentLoaded", () => {
  fetchToys();

  const toyForm = document.querySelector(".add-toy-form");
  toyForm.addEventListener("submit", handleNewToy);
});

function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(res => res.json())
    .then(toys => {
      toys.forEach(renderToy);
    });
}

function renderToy(toy) {
  const toyCard = document.createElement("div");
  toyCard.className = "card";
  toyCard.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  const likeButton = toyCard.querySelector("button");
  likeButton.addEventListener("click", () => handleLike(toy, toyCard));

  document.getElementById("toy-collection").appendChild(toyCard);
}

function handleNewToy(e) {
  e.preventDefault();
  const name = e.target.name.value;
  const image = e.target.image.value;

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ name, image, likes: 0 })
  })
    .then(res => res.json())
    .then(renderToy);
}

function handleLike(toy, toyCard) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes;
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
}
