
// TODO: 
// - fix prev/next page (function doesn't read the closing parenthesis after the url)

var currPage = 1;

function getPokedex(limit, offset) {
    if (offset == undefined) {
        offset = 0;
        currPage = 1;
    } else {
        currPage = (offset / 100) + 1;
    }
    document.getElementById("pokemon-list").innerHTML =
    "<div class='center-on-page'>"
                +"<div class='pokeball'>"
                  +"<div class='pokeball__button'></div>"
               +"</div></div>";

    var promise = fetch('https://pokeapi.co/api/v2/pokemon/?limit=' + limit + '&offset=' + offset);
    promise.then(onPokedexSuccess, onError);
}

function getPokedexByUrl(url, newCurrPage) {
    currPage = newCurrPage;
    var promise = fetch(url);
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

        var pages = Math.floor(data["count"] / 100) + 1;
        console.log("pages: " + pages);
        generateNavigator(pages, data["previous"], data["next"]);

        var pokedex = data["results"];
        var dexHTML = "";
        var picId = "";
        var positionId = "";
        pkmPromises = [];
        classHTML = "";

        for (var pokemon of pokedex) {
            picId = pokemon.name + "-pic";
            positionId = pokemon.name + "-position";
            pkmnCardId = pokemon.name + "-card";
            detailsBtnId = pokemon.name + "-detailsButton";

            modalId = pokemon.name + "-modal";
            modalBtnId = pokemon.name + "-modalButton";

            dexHTML +=
                "<div class='col-md-2'>"
                + "<div id='" + pkmnCardId + "' class='card mb-4 shadow-sm pkmn-card' style='text-align: center;'><br>"
                + "<div id='" + picId + "' class='pkmn-pic'></div>"
                + "<div class='card-body'>"
                + "<button id='" + positionId + "' class='positionCircle' disabled></button><br><br>"
                + "<div><h5><b>" + pokemon.name + " " + "</b></h5></div>"
                + "<br>"
                + "<div style='text-align:center'>"
                + "<button id='" + detailsBtnId + "' class='btn custom-button' onclick='getDetails(\""
                + pokemon.url + "\")' data-toggle='modal' data-target='#modal'>DETAILS</button><br>"
                + "</div></div></div></div>"

                // modal
                + "<div class='modal fade' id='modal' tabindex='-1' role='dialog'"
                + "aria-labelledby='modalTitle' aria-hidden='true'>"
                + "<div class='modal-dialog modal-dialog-centered' role='document'>"
                + "<div id='modalId' class='modal-content custom-modal'>"
                + "<div style='text-align: center;'><br>"
                + "<div class='modal-title' id='exampleModalLongTitle'><b>DETAILS</b></div>"
                + "<div  id='pokemon-details'></div>"
                + "<div><button id='modalBtnId' type='button' class='btn custom-button' data-dismiss='modal' aria-label='Close'>CLOSE</button>"
                + "</div><br>"
                + "</div>"
                + "</div>"
                + "</div>"
                + "</div>";

            document.getElementById("pokemon-list").innerHTML = dexHTML;
            var promise = fetch(pokemon.url);
            pkmPromises.push(promise);
        }

        // customize cards colors based on types and fetch sprites
        Promise.all(pkmPromises).then(
            function (responses) {
                console.log(responses);
                var resPromises = [];
                for (var res of responses) {
                    var body = res.json();
                    resPromises.push(body);
                }
                document.getElementById("pokemon-list").innerHTML = dexHTML;
                Promise.all(resPromises).then(
                    function (data) {

                        for (var oneData of data) {
                            var pic = oneData["sprites"]["front_default"];
                            var position = oneData["id"];
                            var classType = oneData["types"];
                            var strClass = "";

                            for (var t of classType) {
                                strClass = t["type"]["name"];
                            }

                            positionHTML = "<b>" + position + "</b>";
                            picHTML = "<img clas='card-img-top' src='" + pic + "'>";
                            classHTML = "card mb-4 shadow-sm pkmn-card custom-border " + strClass;
                            classPicHTML = "pkmn-pic light-" + strClass;
                            positionClassHTML = "positionCircle " + strClass + " light-" + strClass;
                            detailsClassHTML = "btn custom-button " + strClass + " light-" + strClass;

                            var onePicId = oneData["name"] + "-pic";
                            var onePositionId = oneData["name"] + "-position";
                            var onePkmnCardId = oneData["name"] + "-card";
                            var oneDetailsBtnId = oneData["name"] + "-detailsButton";

                            document.getElementById(onePicId).innerHTML = picHTML;
                            document.getElementById(onePositionId).innerHTML = positionHTML;
                            document.getElementById(onePkmnCardId).setAttribute("class", classHTML);
                            document.getElementById(onePicId).setAttribute("class", classPicHTML);
                            document.getElementById(onePositionId).setAttribute("class", positionClassHTML);
                            document.getElementById(oneDetailsBtnId).setAttribute("class", detailsClassHTML);
                        }
                    });
            });
    });
};

// get pokemon details on button click and customize modal
function getDetails(url) {
    fetch(url).then(
        function (response) {
            console.log(response);
            var body = response.json();
            body.then(function (data) {
                console.log(data);

                var detailsHTML = "";
                var strTypes = "";
                var classType = data["types"];
                var strClass = "";

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

                for (var c of classType) {
                    strClass = c["type"]["name"];
                }

                modalClassHTML = "modal-content custom-modal light-" + strClass;
                modalBtnClassHTML = "btn custom-button " + strClass;

                detailsHTML += "<div><img src='" + pokemon.picFront + "'>"
                    + "<div><img src='" + pokemon.picBack + "'><img src='" + pokemon.picShiny + "'></div>"
                    + "<b>Pokedex no</b>: " + pokemon.id + "<br>"
                    + "<b>Height </b>: " + pokemon.height + "<br>"
                    + "<b>Weight </b>: " + pokemon.weight + "<br>"
                    + "<b>Type/s </b>: " + strTypes + "<br><br>"
                    + "</div>";

                document.getElementById("pokemon-details").innerHTML = detailsHTML;
                document.getElementById("modalId").setAttribute("class", modalClassHTML);
                document.getElementById("modalBtnId").setAttribute("class", modalBtnClassHTML);
            })
        })
}

// Pages navigation
function generateNavigator(pages, previousPage, nextPage) {
    var pagesHTML =
        "<nav aria-label='navigator'><ul class='pagination justify-content-center'>";

    if (previousPage != null) {
        pagesHTML +=
            "<li class='page-item'><button class='btn custom-button grass light-grass' tabindex='-1' onclick='getPokedexByUrl(\"" + previousPage + "\")'>Previous</button></li>&nbsp;&nbsp;";
    }

    for (var i = 1; i <= pages; i++) {
        var offset = (i - 1) * 100;
        if (currPage == i) {
            pagesHTML +=
                "<li><button class='btn custom-button grass light-grass' onclick='getPokedex(100, " + offset + ")'>" + i + "</button></li>&nbsp;&nbsp;";
        } else {
            pagesHTML +=
                "<li><button class='btn custom-button poison light-poison' onclick='getPokedex(100, " + offset + ")'>" + i + "</button></li>&nbsp;&nbsp;";
        }
    }

    if (nextPage != null) {
        pagesHTML +=
            "<li class='page-item'><button class='btn custom-button grass light-grass' tabindex='+1' onclick='getPokedexByUrl(\"" + nextPage + "\")'>Next</button></li>";
        }
    pagesHTML += "</ul></nav>";
    
    document.getElementById("pages").innerHTML = pagesHTML;
}