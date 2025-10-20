const url = "http://localhost/be/Test/api/PokemonApi";

function getUsers() {
  fetch(url)
    .then((response) => response.json())
    .then(async (data) => {
      console.log(data);
      var hbs = await fetch("template.hbs").then((res) => res.text());
      var template = Handlebars.compile(hbs);
      var html = template(data);
      document.getElementById("output").innerHTML = html;
      // renderUsers(data);
    });
}

// --------------------------------------------------------

function deletePokemon(id) {
  fetch(`${url}/delete?id=${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        console.log("Pokemon eliminato con successo");
        getUsers();
      } else {
        console.error("Errore durante l'eliminazione");
      }
    })
    .catch((error) => console.error("Unable to delete pokemon.", error));
}

// --------------------------------------------------------

function updatePokemon(id) {
  fetch(`${url}/${id}`)
    .then((res) => res.json())
    .then((pokemon) => {
      const nome = prompt("Modifica il nome:", pokemon.nome);
      const attacco = prompt("Modifica l'attacco:", pokemon.attacco);
      const difesa = prompt("Modifica la difesa:", pokemon.difesa);

      fetch(
        `${url}/update?id=${id}&nome=${nome}&attacco=${attacco}&difesa=${difesa}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) getUsers();
          else console.error("Errore durante l'aggiornamento");
        })
        .catch((err) => console.error("Errore PUT:", err));
    })
    .catch((err) => console.error("Errore GET:", err));
}

// --------------------------------------------------------

async function insertPokemon() {
  const nome = prompt("Inserisci il nome:");
  const attacco = Number(prompt("Inserisci l'attacco:"));
  const difesa = Number(prompt("Inserisci la difesa:"));

  if (!nome || isNaN(attacco) || isNaN(difesa)) {
    alert("Inserisci un nome valido e numeri per attacco e difesa!");
    return;
  }

  try {
    const response = await fetch(`${url}/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ Nome: nome, Attacco: attacco, Difesa: difesa }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();
    console.log("Inserimento avvenuto con successo:", result);
    getUsers();
  } catch (error) {
    console.error("Errore durante l'inserimento:", error);
    alert("Errore durante l'inserimento. Controlla la console.");
  }
}
getUsers();

// --------------------------------------------------------

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("open-modal")) {
    const id = e.target.dataset.id;
    const modal = document.getElementById(`modal-${id}`);
    if (modal) modal.style.display = "flex";
  }

  if (e.target.classList.contains("close-modal")) {
    const modal = e.target.closest(".modal");
    modal.style.display = "none";
  }

  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});

getUsers();
