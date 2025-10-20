const url = "http://localhost/be/Test/api/PokemonApi";

async function getUsers() {
  try {
    var response = await fetch(url);
    var data = await response.json();
    console.log(data);
    var hbs = await fetch("template.hbs").then((res) => res.text());
    var template = Handlebars.compile(hbs);
    var html = template(data);
    document.getElementById("output").innerHTML = html;

    // $("#pokemonTable").DataTable({
    //   destroy: true,
    //   pageLength: 5,
    //   language: {
    //     search: "Cerca Pokémon:",
    //     lengthMenu: "Mostra _MENU_ Pokémon per pagina",
    //     zeroRecords: "Nessun Pokémon trovato",
    //     info: "Mostrando _START_ - _END_ di _TOTAL_ Pokémon",
    //     infoEmpty: "Nessun Pokémon disponibile",
    //     paginate: { previous: "Precedente", next: "Successivo" },
    //   },
    // });
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
  }
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
        loadPokemonDropdown();
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

// --------------------------------------------------------

// async function loadPokemonDropdown() {
// try {
// const response = await fetch(url);
// const pokemons = await response.json();

// const select = document.getElementById("pokemonSelect");
// const detailsDiv = document.getElementById("pokemonDetails");

// select.innerHTML = '<option value="">Scegli un Pokémon</option>';
// pokemons.forEach((p) => {
// const option = document.createElement("option");
// option.value = p.id;
// option.textContent = p.nome;
// select.appendChild(option);
// });

// select.addEventListener("change", async function () {
// const id = this.value;
// if (!id) {
// detailsDiv.innerHTML = "";
// return;
// }

// const res = await fetch(`${url}/${id}`);
// if (!res.ok) {
// detailsDiv.innerHTML =
// '<div class="alert alert-danger">Errore nel caricamento dei dettagli.</div>';
// return;
// }

// const pokemon = await res.json();
// detailsDiv.innerHTML = `//         <div class="card mt-3 w-50">
//           <div class="card-body">
//             <h5 class="card-title">${pokemon.nome}</h5>
//             <p class="card-text">Attacco: <strong>${pokemon.attacco}</strong></p>
//             <p class="card-text">Difesa: <strong>${pokemon.difesa}</strong></p>
//           </div>
//         </div>
//      `;
// });
// } catch (error) {
// console.error("Errore caricando la lista Pokémon:", error);
// }
// }

// getUsers();
// loadPokemonDropdown();

getUsers();
