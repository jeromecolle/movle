var films = [];
var guesses = 0;
var answer;
var actor_colors = ["#FF8989", "#FFB3A5", "#7ABD91", "#5FA777"]
var color_correct = "#76A08A"
var color_wrong = "#B62A3D"

var finished = false;

$(document).ready(function(){
    var films_temp = [];
    $.getJSON("db/films-60-actors-update.json", function(data){
        films = data;
        // for(i=0;i<data.length;i++){
        //     films_temp[i]=[
        //         // String(data[i].tconst),
        //         String(data[i].primaryTitle),
        //         data[i].startYear,
        //         data[i].runtimeMinutes,
        //         String(data[i].genres),
        //         data[i].averageRating,
        //         String(data[i].actorList),
        //         // String(data[i].directors),
        //         // String(data[i].writers),
        //     ];
        // }
                 // The data in films is available here becuase
                 //    this alert() doesn't run until the response is received.

        var today = new Date();
        var date = String(today.getFullYear()+'-'+String((today.getMonth()+1)).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0'));

        for (var i = 0; i<films.length;i++){
            if (date === films[i].date){
                answer = films[i];
                console.log("Film found on " + i)
            }
        }

        // shuffle(films)
    });

         // Here the data in films is NOT available because this line
         //     of code will run ***before*** the response from the AJAX
         //     request from above is received.
         // In other words, this alert() executes **immediately** without
         //     waiting for the $.getJSON() to receive its response.
});


function populate(string){
    // window.alert(string);
    list = document.getElementById("drop-menu");
    list.replaceChildren()
    if (string){
        var selection = [];
        var divs = [];
    
        for(var i = 0; i<films.length;i++){
            if (films[i].primaryTitle.toLowerCase().includes(string.toLowerCase())){
                selection.push(i);
                var div = document.createElement('div');
                div.innerHTML = getFilmString(films[i]);
                div.className = 'drop-item';
                // div.setAttribute("href","javascript:void(0)");
                div.onclick = function(string){
                    film_guess = string.path[0].innerHTML.split('(')[0].trim();
                    guess(film_guess);
                };
                divs.push(div);
                list.appendChild(div);
            }
        }
    
    }
}

function guess(g){
    guesses++;
    guessed_film =  getFilmByName(g)[0];
    inp = document.getElementById("guess-input");
    inp.value = getFilmString(guessed_film);
    
    
    if (guesses <= 7 && !finished){

        if (guessed_film.primaryTitle == answer.primaryTitle || guesses == 7){
            finished = true;
            inp.disabled = true;
            msg = document.getElementById("finish-message")
            if (guessed_film.primaryTitle == answer.primaryTitle){
                msg.innerHTML = "(｡◕‿◕｡)";
            }
            else{
                msg.innerHTML = "į̶̨̥̥̠͓̃̌͐̅̚ɒ̶̯̖̞͍̍̈́͂̎͜͝m̵̫̗̻̼͇̊̓̾͆̓m̶̡̞̺͙̙͐̀̿͝͝ɘ̸̟͓̺͇̞͒͂̓̌͊ɿ̷̨̨̡͖̬͗͋̊̿͝"
            }

            $('.hover_bkgr_fricc').show();
        }
        populate("")

        var gr = document.getElementById("guess-row " + String(guesses));
        var cols = gr.children;
        console.log(cols)
        for (var i=0;i<cols.length;i++){
            cols[i].style.backgroundColor = "#C4CFD0";
        }
            
        // Assess year
        var year = document.getElementById("year " + String(guesses))
        var year_result = String(guessed_film.startYear);
        
        year_sp = document.createElement("SPAN");
        year_sp.style.color = color_wrong;

        if (guessed_film.startYear < answer.startYear){
            year_result += " &#8593";
        }
        else if (guessed_film.startYear > answer.startYear){
            year_result += " &#8595"
        }
        else {
            year_sp.style.color = color_correct;
        }
        year_sp.innerHTML = year_result;
        year.appendChild(year_sp)

        // Assess duration
        var duration = document.getElementById("duration " + String(guesses))
        var duration_result = String(guessed_film.runtimeMinutes);

        duration_sp = document.createElement("SPAN");
        duration_sp.style.color = color_wrong;

        if (guessed_film.runtimeMinutes < answer.runtimeMinutes){
            duration_result += " &#8593";
        }
        else if (guessed_film.runtimeMinutes > answer.runtimeMinutes){
            duration_result += " &#8595"
        }
        else {
            duration_sp.style.color = color_correct;
        }
        duration_sp.innerHTML = duration_result;
        duration.appendChild(duration_sp)

        // Assess genres
        var genres = document.getElementById("genres " + String(guesses))
        var genres_arr = guessed_film.genres.split(",");
        var correct_genres = 0;


        for (var i=0;i<genres_arr.length;i++){
            sp = document.createElement("SPAN");
            if (answer.genres.toLowerCase().includes(genres_arr[i].toLowerCase())){
                sp.className = "genre-true";
                correct_genres++;
            }
            else {
                sp.className = "genre-false";
            }
            sp.innerHTML = genres_arr[i] + " ";
            genres.appendChild(sp);
        }

        if (correct_genres == answer.genres.split("(").length){
        }

        // Assess rating
        var rating = document.getElementById("rating " + String(guesses))
        var rating_result = String(guessed_film.averageRating);

        rating_sp = document.createElement("SPAN");
        rating_sp.style.color = color_wrong;

        if (guessed_film.averageRating < answer.averageRating){
            rating_result += " &#8593";
        }
        else if (guessed_film.averageRating > answer.averageRating){
            rating_result += " &#8595"
        }
        else {
            rating_sp.style.color = color_correct;
        }

        rating_sp.innerHTML = rating_result;
        rating.appendChild(rating_sp)

        // Assess actors
        var actors = document.getElementById("actors " + String(guesses))
        var actors_count = 0;
        var actors_arr = guessed_film.actorList.split(",");


        for (var i=0;i<actors_arr.length;i++){
            if (answer.actorList.toLowerCase().includes(actors_arr[i].toLowerCase())){
                actors_count++;
                actors.style.color = actor_colors[i];
            }
        }

        if (actors_count == 4){
        }

        actors.innerHTML = actors_count;

        // Set guess
        g_name = document.getElementById("guess " + String(guesses));
        g_name.innerHTML = getFilmString(guessed_film) + ": "

        $('gere').FluidFontType({ phraseMode: true});
    }

}

function getFilmString(film){
    return film.primaryTitle +  " ("  + film.startYear + ")";
}

function getFilmByName(name) {
    return films.filter(
        function(films){ return films.primaryTitle == name }
    );
  }

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function readCSV(string){
    var file = "db/films-60-unix.csv";

    var rawFile = new XMLHttpRequest()
    rawFile.open("GET", file, false);

    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                var data = CSVtoJSON(allText)
                var selection = [];
                
                for(var i = 0; i<data.length;i++){
                    if (data.includes(string)){
                        selection.push(i);
                    }
                }

                console.log(selection);
                
            }
        }
    }

    rawFile.send(null);
}

function CSVtoJSON(csv){
    arr = csv.split('\n'); 
    var jsonObj = [];
    var headers = csv.split(',');
    for(var i = 1; i < arr.length; i++) {
        var data = arr[i].split(',');
        var obj = {};
        for(var j = 0; j < data.length; j++) {
            obj[headers[j].trim()] = data[j].trim();
        }
        jsonObj.push(obj);
    }
    return JSON.stringify(jsonObj);
}

function close_popup(){
    $('.hover_bkgr_fricc').hide();
}