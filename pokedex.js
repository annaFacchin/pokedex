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

        for (var pokemon of pokedex) {

            dexHTML += "<p><b>name: </b>"
                + pokemon.name +
                "</p><button onclick='getDetails(\""
                + pokemon.url + "\")'>DETAILS</button><br><br><hr>";
        }
        document.getElementById("pokemon-list").innerHTML = dexHTML;
    })
}

// function getPics(url) {
//     fetch(url).then(
//         function (response) {
//             console.log(response);
//             var body = response.json();
//             body.then(function (data) {
//                 console.log(data);

//                 pic = data["sprites"]["front_default"];
//                 picsHTML = "";

//                 picsHTML += "<div><img src='" + pic + "'></div><br>";

//                 document.getElementById("pokemon-pic").innerHTML += picsHTML;
//             })
//         })
// }

function getDetails(url) {
    fetch(url).then(
        function (response) {
            console.log(response);
            var body = response.json();
            body.then(function (data) {
                console.log(data);

                var detailsHTML = "";
                detail = data;
                types = data["types"];
                firstType = data["types"]["0"]["type"]["name"];
                pic = data["sprites"];

                if (types.length > 1) {
                    secondType = data["types"]["1"]["type"]["name"];
                    detailsHTML += "<div><img src='" + pic.front_default + "'><ul>"
                    + "<li><b>Pokedex no</b>: " + detail.id + "</li>"
                        + "<li><b>Height </b>: " + detail.height + "</li>"
                        + "<li><b>Weight </b>: " + detail.weight + "</li>"
                        + "<li><b>Type/s </b>: " + secondType + " / " + firstType + "</li>"
                        + "</ul></div>";
                    console.log(firstType);
                    console.log(secondType);
                } else {
                    detailsHTML += "<ul>"
                        + "<li><b>Height </b>: " + detail.height + "</li>"
                        + "<li><b>Weight </b>: " + detail.weight + "</li>"
                        + "<li><b>Type/s </b>: " + firstType + "</li>"
                        + "</ul>";
                    console.log(firstType);
                }
                document.getElementById("pokemon-details").innerHTML = detailsHTML;
            })
        })
}
