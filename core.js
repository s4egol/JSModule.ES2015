//var http = require("http");
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const apiKey = "ff4e5fedad734d3ca5503f69725ea2ca";

function sendRequest(method, urlRequest){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();

        xhr.open(method, urlRequest);
        xhr.onload = function(){
            resolve(xhr.responseText);
        }
        xhr.onerror = function(){
            reject(new Error('Request failed'));
        }
        xhr.send(null);
    });
}

function getAllSources(){
    var promiseRequest = sendRequest("GET", "https://newsapi.org/v1/sources");
    
    var sources = [];
    promiseRequest.then(function(response){
        response = JSON.parse(response);
        response.sources.forEach(source => {
            sources.push({id: source.id, name: source.name, url: source.url});
        });
        sources.forEach(source => {
            var divElement = "<div id=\"" + source.id + "\" class=\"news-container\"><img class=\"preview\" src=\"https://besticon-demo.herokuapp.com/icon?url="+ source.url + 
            "&amp;size=70..120..200\"><div class=\"title\"><a href=\"#\" onclick='getContentSource(\""+ source.id +"\");'><strong>" + source.name + "</strong></a></div>";
            document.getElementById("source-container").innerHTML += divElement;
        });
    }).catch(function(error){
        console.log(error);
    });
}

(function loadWebElement(){
    window.onload = getAllSources;
})();


function getContentSource(source){
    var urlRequest = "https://newsapi.org/v1/articles?source=" + source + "&apiKey=" + apiKey;
    var promiseRequest = sendRequest("GET", urlRequest);
    
    var articles = [];
    promiseRequest.then(function(response){
        response = JSON.parse(response);
        response.articles.forEach(article => {
            articles.push({image: article.urlToImage, title: article.title, description: article.description, url: article.url});
        });
        var articlesHTML = getContentSourceHTML(articles);
        document.getElementById("source-container").innerHTML = null;
        articlesHTML.forEach(articleHTML => {
            document.getElementById("source-container").innerHTML += articleHTML;
        });
    });
}

function getContentSourceHTML(articles){
    var articlesHTML = [];
    if (articles != null){
        articles.forEach(article => {
            var articleHTML = "<div class=\"article\"><div class=\"article-image-div\"><img src=\"" + article.image + "\" class=\"article-image\"></div><div class=\"article-content\"><div class=\"article-title\">" +
                              "<h2 class=\"title-style\">" + article.title + "</h2></div><div class=\"article-description description-style\">" + article.description + "</div>" + 
                              "<div class=\"article-reference\"><a href=\""+ article.url +"\" class=\"reference-style\">Redirect to article >></a></div></div></div>";
            articlesHTML.push(articleHTML);
        });
    }

    return articlesHTML;
}