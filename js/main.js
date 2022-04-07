var films = [];
var guesses = 0;
var answer;
var actor_colors = ["#FF8989", "#FFB3A5", "#7ABD91", "#5FA777"]
var color_correct = "#456355"
var color_close = "#FCD16B"
var color_wrong = "#AEA8A8"

var finished = false;

$(document).ready(function(){
    var films_temp = [];
    $.getJSON("db/titles-60-final.json", function(data){
        films = data;

        var today = new Date();
        var date = String(today.getFullYear()+'-'+String((today.getMonth()+1)).padStart(2, '0')+'-'+String(today.getDate()).padStart(2, '0'));

        for (var i = 0; i<films.length;i++){
            if (date === films[i].date){
                answer = films[i];
                var quote = answer.quotes[Math.floor(Math.random() * answer.quotes.length)];
                qt_field = document.getElementById('quote-tag');
                qt_field.innerHTML = quote;
                
                console.log("Film found on " + i)
            }
        }

        shuffle(films);

        // Uncomment for quick random
        // answer = films[0];
        // console.log(answer);
        // var quote = answer.quotes[Math.floor(Math.random() * answer.quotes.length)];
        // qt_field = document.getElementById('quote-tag');
        // qt_field.innerHTML = quote;
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
    shuffle(films)
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
                let touchEvent = 'ontouchstart' in window ? 'touchstart' : 'click';
                div.addEventListener(touchEvent, function(string){
                    film_guess = string.path[0].innerHTML.split('(')[0].trim();
                    guess(film_guess);
                });
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
                var jammer = document.createTextNode("į̶̨̥̥̠͓̃̌͐̅̚ɒ̶̯̖̞͍̍̈́͂̎͜͝m̵̫̗̻̼͇̊̓̾͆̓m̶̡̞̺͙̙͐̀̿͝͝ɘ̸̟͓̺͇̞͒͂̓̌͊ɿ̷̨̨̡͖̬͗͋̊̿͝ ");
                var br = document.createElement('br');
                var corr = document.createTextNode("Correct answer: " + getFilmString(answer));
                msg.appendChild(jammer);
                msg.appendChild(br);
                msg.appendChild(br);
                msg.appendChild(br);
                msg.appendChild(corr);
            }

            $('.hover_bkgr_fricc').show();
        }
        populate("")

        // Assess year
        var year = document.getElementById("year " + String(guesses))
        var year_result = String(guessed_film.startYear);
        var col = year.parentElement;
        
        year_sp = document.createElement("SPAN");
        year.style.backgroundColor = color_wrong;

        if (Math.abs(guessed_film.startYear - answer.startYear) <= 2){
            year.style.backgroundColor = color_close;
        }

        if (guessed_film.startYear < answer.startYear){
            year_result += " &#8593";
        }
        else if (guessed_film.startYear > answer.startYear){
            year_result += " &#8595"
        }
        else {
            year.style.backgroundColor = color_correct;
        }
        year_sp.innerHTML = year_result;
        year.appendChild(year_sp)
        
        col.style.transform = "rotateY(180deg)";

        // Assess directors
        var directors = document.getElementById("directors " + String(guesses))
        var directors_result = String(guessed_film.runtimeMinutes);
        var directors_arr = guessed_film.directors.split(",")
        var correct_directors = 0

        directors.style.backgroundColor = color_wrong;

        for (var i=0;i<directors_arr.length;i++){
            sp = document.createElement("SPAN");
            if (answer.directors.toLowerCase().includes(directors_arr[i].toLowerCase())){
                correct_directors++;
                directors.style.backgroundColor = color_close;
            }
            var end = (i==directors_arr.length-1) ? " " : ", ";
            sp.innerHTML = directors_arr[i] + end;
            directors.appendChild(sp);
        }
        console.log(answer.directors.split(",").length)
        console.log(correct_directors)
        if (correct_directors == answer.directors.split(",").length){
            directors.style.backgroundColor = color_correct;
        }
        var col = directors.parentElement;
        col.style.transform = "rotateY(180deg)";

        // Assess genres
        var genres = document.getElementById("genres " + String(guesses))
        var genres_arr = guessed_film.genres.split(",");
        var correct_genres = 0;
        var col = genres.parentElement;

        genres.style.backgroundColor = color_wrong;


        for (var i=0;i<genres_arr.length;i++){
            sp = document.createElement("SPAN");
            if (answer.genres.toLowerCase().includes(genres_arr[i].toLowerCase())){
                sp.className = "genre-true";
                correct_genres++;
                genres.style.backgroundColor = color_close;
            }
            else {
                sp.className = "genre-false";
            }
            var end = (i==genres_arr.length-1) ? " " : ", ";
            sp.innerHTML = genres_arr[i] + end;
            genres.appendChild(sp);
        }
        
        if (correct_genres == answer.genres.split(",").length){
            genres.style.backgroundColor = color_correct;
        }

        col.style.transform = "rotateY(180deg)";

        // Assess rating
        var rating = document.getElementById("rating " + String(guesses))
        var rating_result = String(guessed_film.averageRating);

        rating_sp = document.createElement("SPAN");
        rating.style.backgroundColor = color_wrong;

        if (Math.abs(guessed_film.averageRating - answer.averageRating) <= .3){
            rating.style.backgroundColor = color_close;
        }

        if (guessed_film.averageRating < answer.averageRating){
            rating_result += " &#8593";
        }
        else if (guessed_film.averageRating > answer.averageRating){
            rating_result += " &#8595"
        }
        else {
            rating.style.backgroundColor = color_correct;
        }

        rating_sp.innerHTML = rating_result;
        rating.appendChild(rating_sp)

        var col = rating.parentElement;
        col.style.transform = "rotateY(180deg)";

        // Assess actors
        var actors = document.getElementById("actors " + String(guesses))
        var actors_count = 0;
        var actors_arr = guessed_film.actorList.split(",");
        actors.style.backgroundColor = color_wrong

        for (var i=0;i<actors_arr.length;i++){
            sp = document.createElement("SPAN");
            if (answer.actorList.toLowerCase().includes(actors_arr[i].toLowerCase())){
                actors_count++;
                sp.className = "genre-true";
                actors.style.backgroundColor = color_close;
            }
            else {
                sp.className = "genre-false"; //new
            }
            var end = (i==actors_arr.length-1) ? " " : ", ";
            sp.innerHTML = actors_arr[i] + end;
            actors.appendChild(sp);
        }

        if (actors_count == actors_arr.length){
            actors.style.backgroundColor = color_correct
        }

        var col = actors.parentElement;
        col.style.transform = "rotateY(180deg)";

        // Assess company
        var company = document.getElementById("company " + String(guesses))
        var company_result = String(guessed_film.productionCompany);

        company_sp = document.createElement('SPAN');
        company.style.backgroundColor = color_wrong;

        if (company_result == answer.productionCompany){
            company.style.backgroundColor = color_correct;
        }

        company_sp.innerHTML = company_result;
        company.appendChild(company_sp)

        var col = company.parentElement;
        col.style.transform = "rotateY(180deg)";


        // Set guess
        g_name = document.getElementById("guess " + String(guesses));
        g_name.innerHTML = getFilmString(guessed_film) + ": "

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

function toggle_qt(btn){
    qt_field = document.getElementById('quote-tag');
    qt_field.replaceChildren()
    if (btn.innerHTML == "Click for tagline"){
        var tl = answer.tagline;
        console.log(tl.toLowerCase());
        console.log(answer.primaryTitle.toLowerCase());
        if (tl.toLowerCase().includes(answer.primaryTitle.toLowerCase())){
            console.log("oi");
            var t = answer.primaryTitle;
            var sRegExInput = new RegExp(t, "gi");
            tl = tl.replace(sRegExInput, '*'.repeat(answer.primaryTitle.length));
        }

        qt_field.innerHTML = tl;
        btn.innerHTML = "Click for random quote";
    }
    else if (btn.innerHTML == "Click for random quote"){
        var quote = answer.quotes[Math.floor(Math.random() * answer.quotes.length)];
        // console.log(quote)
        // for (var i=0;i<quote.length;i++){
        //     sp = document.createElement('SPAN');
        //     sp.innerHTML=quote[i];
        //     qt_field.appendChild(sp);
        //     br = document.createElement('br');
        //     qt_field.appendChild(br);
        // }

        qt_field.innerHTML = quote;
        btn.innerHTML = "Click for tagline";
    }
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