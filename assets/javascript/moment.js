$(document).ready(function() {  
    var counter=[];  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAcsFiCMd_OTJmvHDrkWYZZbTd8npeMgyU",
    authDomain: "week7hw-114b0.firebaseapp.com",
    databaseURL: "https://week7hw-114b0.firebaseio.com",
    projectId: "week7hw-114b0",
    storageBucket: "",
    messagingSenderId: "411765187108"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  
  // Capture train values
    $("#add-train").on("click", function(event) {
        var train=$("#name-input").val().trim();
        var dest=$("#destination-input").val().trim();
        var frq=$("#frequency-input").val().trim();
        var time=$("#time-input").val().trim();
        // Save new value to Firebase
        database.ref().push({
            train: train,
            destination: dest,
            frequency: frq,  
            time: time
        });
    });
    
    function countdown(sv){
        //create table element for display
        var tbody = $("#trains tbody");
        var row = $("<tr id='rowid"+rowid+"'>");
        var tr = $("<td>").text(sv.train);
        var de = $("<td>").text(sv.destination);
        var fq = $("<td>").text(sv.frequency);
        var tm = $("<td>").text(sv.time);

        var train=sv.train;
        var destination=sv.destination;
        var frequency=sv.frequency;
        var time=sv.time;

        //calculate minaway and next arrival time
        var t = moment(sv.time, 'HH:mm');
        var minAway=t.diff(moment(),"m");

        interval=(Math.floor(parseInt(minAway)/parseInt(sv.frequency))) * parseInt(sv.frequency);
        var timeElapsedHour=moment().hour(Math.abs(interval)/60).format("HH");
        var timeElapsedMinutes=moment().minute(Math.abs(interval)%60).format("mm");
        var timeElapsed=moment({hour: timeElapsedHour, minute: timeElapsedMinutes}).format("HH:mm");
        var timeElapsedArr=timeElapsed.split(":");
        var nextArrival=timeElapsedArr[0]*60*60*1000+ timeElapsedArr[1]*60*1000;
        
        var nextArrivalTime=t+nextArrival;
        var next=moment(nextArrivalTime);
        console.log("nextArrivalTime "+next.format("HH:mm"));
        var ma = $("<td>").text(minAway);     
        
        var tme=moment(next);
        console.log(tme.format("MM/DD/YYYY HH:mm"));
        var elapsedMinAway=tme.diff(moment(),"m");
        console.log('elapsedMinAway '+elapsedMinAway);
        if(minAway<=0){
            tm = $("<td>").text(next.format("HH:mm"));
            ma = $("<td>").text(elapsedMinAway);
        }
        row.append(tr, de, fq, tm,ma);
        tbody.append(row);
    }
    var rowid=0;
    
   
    function addRows(){
        $("#trains tbody").empty();
        console.log("hello");
        // add rows .on("child_added"
        database.ref().on("child_added", function(snapshot) {
            rowid++;
            // storing the snapshot.val() in a variable for convenience
            var sv = snapshot.val();
           
            //calculate next arrival
            countdown(sv);

            // Handle the errors
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    }

    addRows();

    setInterval(addRows, 60000);
    
});
  