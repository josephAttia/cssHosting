var socket;
var users = 0;
var globalX;
var globalY;


socket = io.connect("http://127.0.0.1:3000/")
// socket = io.connect("https://bustracker-me.herokuapp.com/")


// Loading Screen
jQuery(document).ready(function() {
    jQuery('#loading').fadeOut(500);
    jQuery('#main_content').fadeIn(5000);
});

// Not working but it is meant to open the menu
$('.menu-toggle').click(function() {
    $('.site-nav').toggleClass('site-nav--open', 500);
    $(this).toggleClass('open');
});



function createBusses(){
    for(var i = 1; i < 31; ++i){
      busNumber = "bus" + i.toString();
      $('<img>').attr("id", busNumber).attr("src", "/static/images/" + i.toString() + ".jpg").attr("draggable" , "true").attr("ondragstart", "drag_start(event, this.id)").attr("width", "80px").attr("height", "80px").appendTo('.row')
    }
}


var elementId;
function drag_start(event, id) {
    var style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"),10) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top"),10) - event.clientY));
    elementId = id;
    id = "#" + id;
    $(id).appendTo('#draggedBusses');
} 

function changePostion(id){
    id = "#" + id;
    $(id).appendTo('#draggedBusses');
}

function drag_over(event) { 
    event.preventDefault(); 
    return false; 
}


function drop(event) { 
    var offset = event.dataTransfer.getData("text/plain").split(',');
    var dm = document.getElementById(elementId);

    dm.style.left = (event.clientX + parseInt(offset[0],10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1],10)) + 'px';
    event.preventDefault();

    var x = dm.style.left
    x = x.slice(0, -2)
    globalX = x
    
    var y = dm.style.top
    y = y.slice(0, -2)
    y = parseInt(y)
    y = y + 400

    var precentValueX = (((x / window.screen.availWidth) * 100)) + '%'
    var precentValueY = (((y / window.screen.availWidth) * 100)) + '%'
    socket.emit('setLocation', precentValueX, precentValueY, dm, elementId)
    return false;
} 

function showMenu(){
    $(".offCanvasMenu").toggleClass("open");
    console.log("test?")
}


// Socket stuff below this point 
// Imbrace yourselfs 

function getLocations() {
    socket.emit("updateLocations")
}

var myInterval = setInterval(getLocations, 5000);

socket.on('userConnectedResponse', function() {
    users = users + 1
    console.log("User " + users)
})

socket.on('locationSet', function(data){
    changePostion(data.id)
    var dm = document.getElementById(data.id);
    data.x = data.x.toString()
    dm.style.left = data.x
    dm.style.top = data.x
})

socket.on('updatedLocations', function(data){
    
    changePostion(data.id)
    for (const [key, value] of Object.entries(data.locations)) {
        var dm = document.getElementById(key)
        dm.style.left = value['x']
        dm.style.top = value['y']
    }
})
