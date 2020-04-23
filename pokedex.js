function getPokedex(limit) {
    var promise = fetch('https://pokeapi.co/api/v2/pokemon/?limit=' + limit);
    promise.then(onPokedexSuccess, onError);
}

var onError = function (error) {
    console.log("Server error!");
    console.log(error);
}

var onPokedexSuccess = function (response) {
    console.log(response);
    var body = response.json();
    body.then(function (data) {
        console.log(data);

        var pokedex = data["results"];
        var dexHTML = "";
        var picHTML = "";
        var picId = 0;

        for (var pokemon of pokedex) {
            dexHTML +=

                "<div class='col-md-4'>"
                + "<div class='card mb-4 shadow-sm'>"
                + "<div id='"+picId+"'></div>"
                + "<div class='card-body'>"
                + "<h5>" + pokemon.name + "</h5>"
                + "<div class='d-flex justify-content-between align-items-center'>"
                + "<div class='btn-group'>"
                + "<button onclick='getDetails(\""
                + pokemon.url + "\")' data-toggle='modal' data-target='#exampleModalCenter'>DETAILS</button>"
                + "</div></div></div></div></div>"

                fetch(pokemon.url).then(
                    function (response) {
                        console.log(response);
                        var body = response.json();
                        body.then(function (data) {
                            console.log(data);
            
                            var pic = data["sprites"]["front_default"];
                            picHTML = "<img class='card-img-top' src='" + pic + "'>";
                            document.getElementById(picId).innerHTML = picHTML;
                        })
                    })
                    picId += 1;
        }
        document.getElementById("pokemon-list").innerHTML = dexHTML;
        console.log(navigation(pokedex, 1, 10));
    })
}

// get pokemon details on button click
function getDetails(url) {
    fetch(url).then(
        function (response) {
            console.log(response);
            var body = response.json();
            body.then(function (data) {
                console.log(data);

                var detailsHTML = "";
                var strTypes = "";

                var pokemon = {
                    id: data["id"],
                    name: data["name"],
                    height: data["height"],
                    weight: data["weight"],
                    picFront: data["sprites"]["front_default"],
                    picBack: data["sprites"]["back_default"],
                    picShiny: data["sprites"]["front_shiny"],
                    types: data["types"],
                }

                for (var t of pokemon.types) {
                    strTypes += t["type"]["name"] + " ";
                }

                detailsHTML += "<div><img src='" + pokemon.picFront + "'>"
                    + "<div><img src='" + pokemon.picBack + "'><img src='" + pokemon.picShiny + "'></div><ul>"
                    + "<li><b>Pokedex no</b>: " + pokemon.id + "</li>"
                    + "<li><b>Height </b>: " + pokemon.height + "</li>"
                    + "<li><b>Weight </b>: " + pokemon.weight + "</li>"
                    + "<li><b>Type/s </b>: " + strTypes + "</li>"
                    + "</ul></div>";

                document.getElementById("pokemon-details").innerHTML = detailsHTML;
            })
        })
}

// Pages navigation
function navigation(itemsList, page, itemsPerPage) {

    var pagesHTML = "";
    var currentPage = page || 1;
    var prevPage = page - 1 ? page - 1 : null;
    var nextPage = page + 1 ? page + 1 : null;
    var itemsPerPage = itemsPerPage || 100;
    var offset = (page - 1) * itemsPerPage;

    displayedItems = itemsList.slice(offset).slice(0, itemsPerPage);
    var totalPages = Math.ceil(itemsList.length / itemsPerPage);

    pagesHTML +=
        "<nav aria-label='navigator'>"
        + "<ul class='pagination'>"
        + "<li class='page-item'>"
        + "<a class='page-link' tabindex='-1' onclick='getPokedex(100)'>Previous</a>"
        + "</li>"
        + "<li class='page-item'><a class='page-link'>" + prevPage + "</a></li>"
        + "<li class='page-item active'>"
        + "<a class='page-link'>" + currentPage + "<span class='sr-only'>(current)</span></a>"
        + "</li>"
        + "<li class='page-item'><a class='page-link'>" + nextPage + "</a></li>"
        + "<li class='page-item disabled'><a class='page-link'> ... </a></li>"
        + "<li class='page-item'><a class='page-link'>" + totalPages + "</a></li>"
        + "<li class='page-item'>"
        + "<a class='page-link' onclick='getPokedex(100)'>Next</a>"
        + "</li>"
        + "</ul>"
        + "</nav>"

    document.getElementById("pages").innerHTML = pagesHTML;
}