let app = {
    apiRootUrl: "http://localhost:8080",
    
    init: function() {
        console.log('app.init()');

        // On appelle la méthode s'occupant d'ajouter les EventListener sur les éléments déjà dans le DOM
        app.addAllEventListeners();

        // On appelle la méthode s'occupant de charger tous les jeux vidéo
        app.loadVideoGames();
    },
    addAllEventListeners: function() {
        // On récupère l'élément <select> des jeux vidéo
        
        // On ajoute l'écouteur pour l'event "change", et on l'attache à la méthode app.handleVideogameSelected
        let videoGameSelectElement = document.querySelector("#videogameId");
        videoGameSelectElement.addEventListener('change', app.handleVideogameSelected)

        // On récupère le bouton pour ajouter un jeu vidéo
        let addVideogameButtonElement = document.getElementById('btnAddVideogame');
        // On ajoute l'écouteur pour l'event "click"
        addVideogameButtonElement.addEventListener('click', app.handleClickToAddVideogame);
        
        // TODO
    },
    handleVideogameSelected: function(evt) {
        // Récupérer la valeur du <select> (id du videogame)
        videoGameId = evt.currentTarget.value;
        console.log(videoGameId);

        // Vider le contenu de div#review
        
        // const reviewContainer = document.querySelector('#review');
        // reviewContainer.removeChild();


        // charger les données pour ce videogame
        let config = {
            method : 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        fetch(app.apiRootUrl + "/videogames/"+videoGameId+"/reviews/", config)
        .then(function(response){
          return response.json();
        })
        .then(function(reviews){
                console.log(reviews);


                for(const review of reviews){
                    // Dupliquer la template #reviewTemplate et personnaliser son contenu avec les données
                    const templateElement = document.querySelector('#reviewTemplate');
                    const templateClonedElement = templateElement.content.cloneNode(true);

                    const reviewElement = templateClonedElement.querySelector('.reviewContainer');
                    const reviewContainer = document.querySelector('#review');

                    // Supprimer les reviews
                        
                    // reviewContainer.removeChild(reviewContainer);
                    
                    // AUTHOR
                    reviewAuthorElement = reviewElement.querySelector('.reviewAuthor');
                    reviewAuthorElement.textContent = review.author;
                    
                    // TEXT 
                    reviewTextElement = reviewElement.querySelector('.reviewText');
                    reviewTextElement.textContent = review.text;
                    
                    // TITLE 
                    reviewTitleElement = reviewElement.querySelector('.reviewTitle');
                    reviewTitleElement.textContent = review.title;
                    
                    // PUBLICATION
                    reviewPublicationElement = reviewElement.querySelector('.reviewPublication');
                    reviewPublicationElement.textContent = review.publication_date;
                    
                    // REVIEW NOTES
                    reviewDisplayNoteElement = reviewElement.querySelector('.reviewDisplay');
                    reviewDisplayNoteElement.textContent = review.display_note;

                    reviewGameplayNoteElement = reviewElement.querySelector('.reviewGameplay');
                    reviewGameplayNoteElement.textContent = review.gameplay_note;

                    reviewScenarioNoteElement = reviewElement.querySelector('.reviewScenario');
                    reviewScenarioNoteElement.textContent = review.scenario_note;

                    reviewLifetimeNoteElement = reviewElement.querySelector('.reviewLifetime');
                    reviewLifetimeNoteElement.textContent = review.lifetime_note;

                    // Ajouter dans le DOM
                    reviewContainer.prepend(reviewElement);
                };

            
        });

        
    },
    handleClickToAddVideogame: function(evt) {
        // https://getbootstrap.com/docs/4.4/components/modal/#modalshow
        // jQuery obligatoire ici
        $('#addVideogameModal').modal('show');

        const formElement = document.querySelector('#addVideogameForm');
        formElement.addEventListener("submit", app.handleNewTaskFormSubmit);
    },
    
    handleNewTaskFormSubmit:function(evt){
        evt.preventDefault();
        formElement = evt.currentTarget;
        console.log(formElement);

        const inputNameElement = formElement.querySelector('#inputName');
        const videogameName = inputNameElement.value;
        
        const inputEditorElement = formElement.querySelector('#inputEditor');
        const videogameEditor = inputEditorElement.value;

        const data = {
            name : videogameName,
            editor : videogameEditor
        };

        const httpHeaders = new Headers();
        httpHeaders.append("Content-Type", "application/json");

        let config = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: httpHeaders,
            body: JSON.stringify(data),
        };

        fetch(app.apiRootUrl+"/videogames", config)
        .then(function(response){
            if(response.status==201){
                alert('Félicitations !!!!!!!!!!!! Votre jeu vidéo a bien été créé!!!!!!!')
            }else if(response.status==400){
                alert('Bouuuuuh !!!! Il manque des informations !!!!');
                window.stop();
            }else if(response.status==500){
                alert('Internal Servor Error');
                window.stop();
            }
            
        });




    },
    loadVideoGames: function() {
        // Charger toutes les données des videogames
        let config = {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        };

        fetch(app.apiRootUrl+"/videogames",config)
        .then(function(response){
            return response.json();        
        })
        .then(function(videogames){
            let selectElement = document.querySelector('#videogameId')
            
            for(let videogame of videogames){
                let optionElement = document.createElement("option");
                optionElement.value = videogame.id;
                optionElement.textContent = videogame.name;

                selectElement.append(optionElement);

            };
        }
        );

            // Ajouter une balise <option> par videogame
    }
};

document.addEventListener('DOMContentLoaded', app.init);