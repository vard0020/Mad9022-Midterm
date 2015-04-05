var loadCount=0;
var gmap;
var vard0020_app = {
    
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
       document.addEventListener('DOMContentLoaded', this.onDeviceReady, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        loadCount++;
        if(loadCount === 2)
        {
        vard0020_app.receivedEvent('deviceready');
        }
    },
    
    receivedEvent: function() {
        vard0020_app.showDynamicMap();
        vard0020_app.setPhoneContacts();
        vard0020_app.hammerListener();
    },
    
    hammerListener: function(){
      var app = {
      ul: document.querySelector("[data-role=listview]"),
      mc: null,
      modal:null,
      overlay:null,
      addListeners: function(){
        app.mc = new Hammer(app.ul, {});
        var singleTap = new Hammer.Tap({ event: 'tap' });
        var doubleTap = new Hammer.Tap({event: 'doubletap', taps: 2 });
        app.mc.add([doubleTap, singleTap]);
        doubleTap.requireFailure(singleTap);

            app.mc.on("tap", function(ev){
          //single tap
          app.modal = document.getElementById("modal1");
          app.overlay = document.getElementById("overlay");
          app.modal.style.display = "block";
          app.overlay.style.display = "block";
          resizeMap(gmap);  
                
          setTimeout(function(){
            app.modal.style.display = "none";
            app.overlay.style.display = "none";
          }, 2000);
        });
        app.mc.on("doubletap", function(ev){
          //double tap
          app.modal = document.getElementById("modal2");
          app.overlay = document.getElementById("overlay");
          app.modal.style.display = "block";
          app.overlay.style.display = "block";
          setTimeout(function(){
            app.modal.style.display = "none";
            app.overlay.style.display = "none";
          }, 2000);
        }); 
      }}
          app.addListeners();
   },
    
    
    setPhoneContacts: function(){
        var options = new ContactFindOptions();
        options.filter = "";  //leaving this empty will find return all contacts
        options.multiple = true;  //return multiple results
        var filter = ["displayName"];   //an array of fields to compare against the options.filter 
        navigator.contacts.find(filter, vard0020_app.successFunc, vard0020_app.errFunc, options);
    },
        
    successFunc: function(contacts){
        var array1 = [];
        var obj;
        for(var i = 0; i <12; i++)
        {
         var array2=[];
         for(var j=0;j<contacts[i].phoneNumbers.length;j++)
         { 
          array2.push(contacts[i].phoneNumbers[j].value);
            obj={
            "id":i,
            "name":contacts[i].displayName,
            "number":array2,
            "lat":null,
            "lng":null
                }
            }
            array1.push(obj);
        }
        //stringify the object and putting it in localstorage
        var myJson = JSON.stringify(array1);
        localStorage.setItem("myJson", myJson);
        
        //parsing it back
        var parsedContacts = JSON.parse(myJson);
        //console.log(parsedContacts);
        
        //displaying the contacts in the listview
        var ul = document.getElementById("contact");
        for(var i = 0; i < 12; i++)
        {
            var li = document.createElement("li"); 
            li.innerHTML = parsedContacts[i].name;
            ul.appendChild(li);
        }
    },
    
    errFunc: function(){
        document.getElementById("contact").innerHTML = "Sorry no contacts found..";
    },
    
    //Finding and displaying geolocation
    showDynamicMap: function(){
            var map;//this will be the global reference to your map object
            map = new google.maps.Map(document.getElementById("mymap"), myOptions);
            var myLatlng = new google.maps.LatLng(45.349356,-75.753222);
            var myOptions = {
                zoom: 14,
                center: myLatlng,
            }
            gmap= map;
	   
    
	   map.setOptions( {
		zoomControl: true,
		maxZoom: 17,
		minZoom: 12,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER	
		},
		streetViewControl: false
	    } );
    }
        
};

vard0020_app.initialize();

function resizeMap(m) {
        x = m.getZoom();
        c = m.getCenter();
        google.maps.event.trigger(m, 'resize');
        m.setZoom(x);
        m.setCenter(c);
    };