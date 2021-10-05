var counter = 0;
// toggle for chat icon and chat window
function showChat() 
{
  var chatbox = document.getElementById("chatbox");
  var activate = document.getElementById("activate");
  if (chatbox.style.display === "block")
  {
    chatbox.style.display = "none";
    activate.style.display = "block";
  }
  else
  {
    chatbox.style.display = "block";
    activate.style.display = "none";
    // key down event to let enter submit messages when window is active
    window.onkeydown = (event) => {if(event.keyCode === 13){document.getElementById("submit").click(); event.preventDefault();}}
    if(counter == 0)
    {
      var element = document.createElement("div");
      var text = document.getElementById("message");
      element.appendChild(document.createTextNode("Andy: Hello! Please let me know what I can do to help you." ));
      document.getElementById('chatarea').appendChild(element);
    }
      counter = counter + 1;
    }
}
// variables for search method
var bestMatch = "";
var word = "";
var count = 0;
var highCount = 0;
// list of urls to search from, just add new pages as needed
var urls = ["http://127.0.0.1:5500/PlanToPart2/homePage.html","http://127.0.0.1:5500/PlanToPart2/helpPage/help.html","http://127.0.0.1:5500/PlanToPart2/contactHtml/contactUs.html","http://127.0.0.1:5500/PlanToPart2/SecurityPage/security.html","http://127.0.0.1:5500/PlanToPart2/Financial_Personal_Sections/Financial.html","http://127.0.0.1:5500/PlanToPart2/Financial_Personal_Sections/personalInfo.html","http://127.0.0.1:5500/PlanToPart2/socialNetwork_section/socialnetwork.html#","http://127.0.0.1:5500/PlanToPart2/loginPage/Loginpage.html"];
// list of most common english words that we don't want to be detected in searches
var blacklist = ["that","have","with","this","from","they","would","there","their","what","which","when","make","like","time","just","know","take","people","into","year","good","some","could","them","other","than","then","only","look","come","over","think","also","back","after","work","first","well","even","want","because","these","give","most"];
    
function submit() 
{
  //this is where we get the user input text
  var element = document.createElement("div");
  var text = document.getElementById("message");
  element.appendChild(document.createTextNode("You: " + text.value));
  document.getElementById('chatarea').appendChild(element);
  var search = text.value;
  word, bestMatch, highCount = searchContent(search);
    
  //this is the logic for response
  var helpPage = "http://127.0.0.1:5500/PlanToPart2/helpPage/help.html"
  if(highCount < 1)
  {
    var response = "Sorry, I don't quite understand your question please try asking something else or click here for the help page";
    var element = document.createElement("div");
    var a = document.createElement("a");
    a.setAttribute("id", "chatlink");
    a.setAttribute('href', helpPage);
    a.innerHTML = response;
    element.appendChild(document.createTextNode("Andy: "));
    element.appendChild(a);
    document.getElementById('chatarea').appendChild(element);
  }
  else
  {
    var response = "Is this what you're looking for? ";
    var element = document.createElement("div");
    var a = document.createElement("a");
    a.setAttribute("id", "chatlink")
    a.setAttribute('href', bestMatch);
    a.innerHTML = response;
    element.appendChild(document.createTextNode("Andy: "));
    element.appendChild(a);
    document.getElementById('chatarea').appendChild(element);
  }
  //this is the finishing touches, wipe the text field and scroll to the bottom automatically
  text.value = '';
  highCount = 0;
  bestMatch = '';
  count = 0;
  var elem = document.getElementById('chatarea');
  elem.scrollTop = elem.scrollHeight;
}
  
function searchContent(search)
{
  search = search.trim();
  search = search.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
  search = search.replace("?","");
  search = search.toLowerCase();
  
  //seperating search into an array of words
  var arr = search.split(" ");
  arr = arr.filter(Boolean);
  var i;
  for (i = 0; i< urls.length; i++)
  {
    $.ajax({
      url: urls[i],
      type: 'get',
      dataType: 'html',
      async: false,
      success: function(data){
     //this if checks for specified word, going to want to pull from text area for this part.
     //list is an array of all the words, this is good for counting occurances
     var list = data.split(" ")
     var j;
     //console.log(list);
     for(j = 0; j<list.length; j++)
     {
         var compare = list[j];
         compare = compare.replace("↵", "");
         compare = compare.trim();
         compare = compare.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
         compare = compare.toLowerCase();
         //compares the search parameter, coverted into an array arr with compare which is current word in html doc
         for(k = 0; k<arr.length;k++)
         {
          if(arr[k].length <= 3)
          {
            continue;
          }
          else if(blacklist.includes(arr[k]))
          {
            continue;
          }
          if (arr[k] == "contact")
          {
            bestMatch = "http://127.0.0.1:5500/PlanToPart2/contactHtml/contactUs.html";
            count = 2;
            break;
          }
         if(compare == arr[k])
         {
             count = count+1;
             word = arr[k]
         }
         }
         if (count > highCount)
         {
          highCount = count;
          bestMatch = urls[i];
         }
     }
    }
  });
  count = 0;
    }
    console.log(word);
    console.log(bestMatch);
    console.log(highCount);
    return word, bestMatch, highCount;
}
  
  
function searchBar() 
{
  send = document.getElementById('search-btn');
  text = document.getElementById('search-txt');
  word, bestMatch, highCount = searchContent(text.value);
  if(highCount < 1)
    {
      bestMatch = "http://127.0.0.1:5500/PlanToPart2/helpPage/help.html"
    }
  window.open(bestMatch,"_self");
}