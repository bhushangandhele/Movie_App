
const parentElement=document.querySelector(".main");
const searchInput= document.querySelector(".input");
const movieRatings=document.querySelector("#rating-select");
const movieGenres = document.querySelector("#genre-select");

let searchValue = "";
let ratings = 0;
let genre = 0;
let filteredArrOfMovies = [];

const URL = "https://gist.githubusercontent.com/saniyusuf/406b843afdfb9c6a86e25753fe2761f4/raw/523c324c7fcc36efab8224f9ebb7556c09b69a14/Film.JSON";

const getMovies = async()=>{
    try{
        const {data} = await axios.get(URL);
        return data;
    }catch(err){

    }
} 
let movies= await getMovies(URL);
console.log(movies);

const createElement = (element)=> document.createElement(element);


/* Function to create movie cards................*/

function getFilterdData(){
    filteredArrOfMovies = searchValue?.length > 0 ? 
    movies.filter(movie => searchValue === movie.Title.toLowerCase() || searchValue===movie.Director.toLowerCase()) : movies;
    
    if(ratings >0){
        filteredArrOfMovies = searchValue?.length>0 ? filteredArrOfMovies : movies;
        filteredArrOfMovies =filteredArrOfMovies.filter(movie => movie.imdbRating > ratings);
    }

    if(genre?.length >0){
      //  filteredArrOfMovies = searchValue?.length > 0 && ratings > 7 ? filteredArrOfMovies : movies;
        filteredArrOfMovies =filteredArrOfMovies.filter(movie => movie.Genre.includes(genre));
    }

    return filteredArrOfMovies;
}

const createMovieCard= (movies)=>{
    for(let movie of movies){
        //Creating parent container

        const cardContainer=createElement("div");
        cardContainer.classList.add("card","shadow");

        //Creating image container
        const imageContainer = createElement("div");
        imageContainer.classList.add("card-image-container");

        //Creating card image
        const imageEle = createElement("img");
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src",movie.Images[0]);
        imageEle.setAttribute("alt", movie.Title);

        imageContainer.appendChild(imageEle);
        cardContainer.appendChild(imageContainer);

        //creating card details container
        const cardDetails=createElement("div");
        cardDetails.classList.add("movie-details");

        //card Title
        const titleEle=createElement("p");
        titleEle.classList.add("title");
        titleEle.innerText=movie.Title;
        
        cardDetails.appendChild(titleEle);

        //card Genre
        const genreEle=createElement("p");
        genreEle.classList.add("genre");
        genreEle.innerText=`Genre : ${movie.Genre}`;

        cardDetails.appendChild(genreEle);
        
        //ratings and length
        const movieRating=createElement("div");
        movieRating.classList.add("ratings");

        //star / rating container
        const ratings = createElement("div");
        ratings.classList.add("star-rating");

        
        //star icon
        const starIcon=createElement("span");
        starIcon.classList.add("material-symbols-outlined");
        starIcon.innerText="star";
        ratings.appendChild(starIcon);

        //ratings
        const ratingValue=createElement("span");
        ratingValue.innerText=movie.imdbRating;

        ratings.appendChild(ratingValue);

        movieRating.appendChild(ratings);
        
        //length
        const length=createElement("p");
        length.innerText=movie.Runtime;
        movieRating.appendChild(length);

        
        cardDetails.appendChild(movieRating);
        cardContainer.appendChild(cardDetails);

        parentElement.appendChild(cardContainer);   
    }
};


function handleSearch(event){
    searchValue = event.target.value.toLowerCase();
    
    let filterdBySearch = getFilterdData();
    parentElement.innerHTML ="";
    createMovieCard(filterdBySearch);   
}

//function for delay the search...........
function debounce(callback, delay) {
    let timerId;

    return (...args)=>{
        clearTimeout(timerId);
        timerId=setTimeout(() => {
        callback(...args);
        }, delay);
    };
}

function handleRatingSelector(event){
    ratings=event.target.value;
    let filterByRating = getFilterdData();
    parentElement.innerHTML="";
    createMovieCard(ratings ? filterByRating : movies);
}

const debounceInput=debounce(handleSearch,500);

searchInput.addEventListener("keyup",debounceInput);

movieRatings.addEventListener("change",handleRatingSelector);


//Filter By Genre;

const genres = movies.reduce((acc, cur) => {
    let genresArr = [];
    let tempGenresArr =cur.Genre.split(",");
    acc = [...acc, ...tempGenresArr];
    for(let genre of acc){
        if(!genresArr.includes(genre))
            genresArr = [...genresArr,genre];
    }
    return genresArr;
},[]);

for(let genre of genres){
    const option=createElement("option");
    option.classList.add("option");
    option.setAttribute("value",genre);
    option.innerText = genre;
    movieGenres.appendChild(option);
}
function handleGenreSelect(event){
    genre = event.target.value;
    if(genre==="Genre")
        genre="";
    const filteredMoviesByGenre = getFilterdData();
    console.log(filteredMoviesByGenre);
    parentElement.innerHTML = "";
    createMovieCard(genre ? filteredMoviesByGenre : movies);
}

movieGenres.addEventListener("change",handleGenreSelect);
 
createMovieCard(movies);