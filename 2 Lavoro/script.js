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

    $(document).on("click", ".open-modal", async function (e) {
      const id = Number($(this).data("id"));

      if (id === 0) {
        // MODALITA' INSERIMENTO
        $("#modal-title").text("Inserisci Nuovo Pokémon");
        $("#pokemon-id").val("0");
        $("#nome").val("");
        $("#attacco").val("");
        $("#difesa").val("");
        $("#pokemon-modal").show();
      } else {
        // MODALITA' MODIFICA
        $("#modal-title").text("Modifica Dettagli Pokémon");
        try {
          const res = await fetch(`${url}/${id}`);
          if (!res.ok) throw new Error("Errore nel recupero dati");
          const pokemon = await res.json();

          $("#pokemon-id").val(pokemon.id);
          $("#nome").val(pokemon.nome);
          $("#attacco").val(pokemon.attacco);
          $("#difesa").val(pokemon.difesa);
          $("#pokemon-modal").show();
        } catch (err) {
          console.error("Errore nel caricamento del Pokémon:", err);
          alert("Errore nel recupero dei dati.");
        }
      }
    });

    $(document).on("click", ".close-modal, .modal-overlay", function () {
      $("#pokemon-modal").hide();
    });

    $("#editForm").submit(async function (e) {
      e.preventDefault();
      // ID MODULO NON PRESENTE O NON INIZIA CON editForm-
      var id = parseInt($("#pokemon-id").val());
      var nome = $("#nome").val();
      var attacco = parseInt($("#attacco").val());
      var difesa = parseInt($("#difesa").val());

      if (!nome || isNaN(attacco) || isNaN(difesa)) {
        return alert("Per favore, inserisci valori validi!");
      }

      try {
        let response;
        if (id == 0) {
          // INSERIMENTO (POST)
          response = await fetch(`${url}/insert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              Nome: nome,
              Attacco: attacco,
              Difesa: difesa,
            }),
          });
        } else {
          // AGGIORNAMENTO (PUT)
          response = await fetch(
            `${url}/update?id=${id}&nome=${nome}&attacco=${attacco}&difesa=${difesa}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            }
          );
        }

        if (!response.ok) throw new Error(await response.text());

        alert(
          id == 0 ? "Pokémon inserito con successo!" : "Pokémon aggiornato!"
        );
        $("#pokemon-modal").hide();
        getUsers();
      } catch (error) {
        console.error("Errore nel salvataggio:", error);
        alert("Errore durante il salvataggio del Pokémon.");
      }
    });
  } catch (error) {
    console.error("Errore durante il fetch dei dati:", error);
  }
}

// --------------------------------------------------------

// function deletePokemon(id) {
//   fetch(`${url}/delete?id=${id}`, {
//     method: "DELETE",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => {
//       if (response.ok) {
//         console.log("Pokemon eliminato con successo");
//         getUsers();
//       } else {
//         console.error("Errore durante l'eliminazione");
//       }
//     })
//     .catch((error) => console.error("Unable to delete pokemon.", error));
// }

// --------------------------------------------------------

function deletePokemon(id) {
  $.ajax({
    url: `${url}/delete?id=${id}`,
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    success: function (response) {
      console.log("Pokémon eliminato con successo");
      getUsers();
    },
    error: function (xhr, status, error) {
      console.error("Errore durante l'eliminazione", error);
    },
  });
}

// --------------------------------------------------------

// QUANDO APRI MODALE FAI GET BY ID, SE ID = 0, O RITORNI NULLA O NON FAI GET,
// 1 STEP, 2 STEP IL LAVATAGGIO SE ID LETTO = 0 DEVO FARE UNA POST, ALTRIMENTI
// FACCIO UNA PUT E GLI PASSO I CAMPI (FETCH DELLA GET)

// --------------------------------------------------------

getUsers();
