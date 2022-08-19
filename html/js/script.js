const GTAcontrolKeys = {
    "0": "t_0",
    "1": "t_1",
    "2": "t_2",
    "3": "t_3",
    "4": "t_4",
    "5": "t_5",
    "6": "t_6",
    "7": "t_7",
    "8": "t_8",
    "9": "t_9",
    "Escape": "b_199",
    "F1": "b_170",
    "F2": "b_171",
    "F3": "b_172",
    "F4": "b_173",
    "F5": "b_174",
    "F6": "b_175",
    "F7": "b_176",
    "F9": "b_178",
    "F10": "b_179",
    "F11": "b_180",
    "F12": "b_181",
    "Insert": "b_200",
    "Delete": "b_198",
    "Home": "b_1008",
    "End": "b_201",
    "PageUp": "b_1009",
    "PageDown": "b_1010",
    "Num1": "b_137",
    "Num2": "b_138",
    "Num3": "b_139",
    "Num4": "b_140",
    "Num5": "b_141",
    "Num6": "b_142",
    "Num7": "b_143",
    "Num8": "b_144",
    "Num9": "b_145",
    "Num0": "b_136",
    "Enter": "b_135",
    "Num.": "b_132",
    "Num+": "b_131",
    "Num-": "b_130",
    "NumLock": "b_1011",
    "*": "b_134",
    "NumEnter": "b_1003",
    "RightShift": "b_1001",
    "Tab": "b_1002",
    "CapsLock": "b_1012",
    "LeftShift": "b_1000",
    "Meta": "b_995",
    "LeftCtrl": "b_1013",
    "LeftAlt": "b_1015",
    "Space": "b_2000",
    "RightAlt": "b_1016",
    "RightCtrl": "b_1014",
    "ArrowUp": "b_194",
    "ArrowDown": "b_195",
    "ArrowLeft": "b_196",
    "ArrowRight": "b_197",
    "BackSpace": "b_1004",
    "`": "t_`",
    "-": "t_-",
    "=": "t_=",
    "Q": "t_Q",
    "W": "t_W",
    "E": "t_E",
    "R": "t_T",
    "Y": "t_Y",
    "U": "t_U",
    "I": "t_I",
    "O": "t_O",
    "P": "t_P",
    "\\": "t_\\",
    "A": "t_A",
    "S": "t_S",
    "D": "t_D",
    "F": "t_F",
    "G": "t_G",
    "H": "t_H",
    "J": "t_J",
    "K": "t_K",
    "L": "t_L",
    ";": "t_;",
    "'": "t_'",
    "Z": "t_Z",
    "X": "t_X",
    "C": "t_C",
    "V": "t_V",
    "B": "t_B",
    "N": "t_N",
    "M": "t_M",
    ",": "t_,",
    ".": "t_.",
    "/": "t_/"
}

var GTAkeyBind = "t_`"

var config = {}
var onlinePlayers = 0
var isScoreboardOpen = false

function capitalizeFirstChar(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function sortTableLetters(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("usersTable");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function sortTableNumbers(n) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("usersTable");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 0; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[0];
            y = rows[i + 1].getElementsByTagName("TD")[0];
            if (Number(x.innerHTML) > Number(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}

function msToTime(duration) {
  var seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  if (minutes == 0 && hours == 0){
    return seconds + " Seconds ";
  }
  if (hours == 0) {
    return minutes + " Minutes " + seconds + " Seconds ";
  }
  return hours + " Hours " + minutes + " Minutes " + seconds + " Seconds ";
}

$(document).ready(function() {
    window.addEventListener('message', (event) => {
        let data = event.data
        if(data.action == "getConfig") {
            config = data.config
            toggleKeyBinds()
            togglePlayerInfo()
            toggleIllegalActivitesInfo()
        }
        if (data.action == 'show' && !isScoreboardOpen) {
            GTAkeyBind = data.keyBindValue
            isScoreboardOpen = true
            $("#main").fadeIn(500);
            loadKeyBinds()
        }
        if (data.action == 'hide' && isScoreboardOpen) {
            GTAkeyBind = data.keyBindValue
            isScoreboardOpen = false
            $("#main").fadeOut(500);
        }
        if (data.action == "updateScoreboard") {
            onlinePlayers = data.onlinePlayers
            $('#onlinePlayers').html(data.onlinePlayers + ' <i class="fa-solid fa-circle-dot  noSelect" style="color: #7CFC00;"></i>')
            $('#onlineStaff').html(data.onlineStaff + ' <i class="fa-solid fa-clipboard-user noSelect" style="color: #5c5c5c;"></i>')
            $('#onlinePolice').html(data.onlinePolice + ' <i class="fa-solid fa-handcuffs noSelect" style="color: #3B9AE1;"></i>')
            $('#onlineEMS').html(data.onlineEMS + ' <i class="fa-solid fa-truck-medical noSelect" style="color: white;"></i>')
            $('#onlineTaxi').html(data.onlineTaxi + ' <i class="fa-solid fa-taxi noSelect" style="color: #fdb813;"></i>')
            $('onlineMechanics').html(data.onlineMechanics + ' <i class="fa-solid fa-toolbox noSelect" style="color: #cd8e52;"></i')
        }
        if (data.action == "addUserToScoreboard") {
            const trElement = document.createElement('tr')
            const td1Element = document.createElement('td')
            const td2Element = document.createElement('td')
            const td3Element = document.createElement('td')
            const td4Element = document.createElement('td')

            trElement.id = "tr-source-"+data.playerID
            td1Element.textContent = data.playerID.toString()
            td1Element.id = "td1"
            td2Element.textContent = data.playerName
            td2Element.id = "td2"
            td2Element.onclick = function(event){clickedPlayerName(data.source,data.playerID,data.playerName)}
            td3Element.textContent = data.playerJob
            td3Element.id = "td3"
            td4Element.textContent = capitalizeFirstChar(data.playerGroup);
            td4Element.id = "td4"

            trElement.appendChild(td1Element)
            trElement.appendChild(td2Element)
            trElement.appendChild(td3Element)
            trElement.appendChild(td4Element)

            document.getElementById("usersTable").appendChild(trElement)
        }
        if (data.action == "refreshScoreboard") {
            $("#usersTable").empty()
            $("#illegalActivites").empty()
        }
        if (data.action == "playerInfoUpdate") {
            $("#playerName").html(data.playerName+' <i class="fa-solid fa-user-tag"></i>')
            $("#roleplayName").html(data.roleplayName+' <i class="fa-solid fa-id-card"></i>')
            $("#playTime").html(msToTime(data.timePlayed)+' <i class="fa-solid fa-clock"></i>')
            $("#playerID").html(data.playerID+' <i class="fa-solid fa-server"></i>')
        }
        if (data.action == "addActivity") {
            loadIllegalActivy(data.activity)
        }
    })

    document.onkeyup = function(data) {
        var keyPressed = capitalizeFirstChar(data.key)
        if (data.location == 3) keyPressed = "Num"+keyPressed
        if ((GTAkeyBind == GTAcontrolKeys[keyPressed]) && isScoreboardOpen) {
            $.post(`https://${GetParentResourceName()}/closeScoreboard`, JSON.stringify({}))
            $("#main").stop();
            $("#main").stop();
        }
    };

    function loadKeyBinds(){
        $("#keyboardKeybinds").empty()
        var jsonData = JSON.parse(config)
        for (let i = 0; i < jsonData["keyBinds"].length; i++) {
            let key = JSON.stringify(jsonData["keyBinds"][i]["key"])
            let description = JSON.stringify(jsonData["keyBinds"][i]["description"])
            const keyBind = document.createElement('span')
            keyBind.id = key+"-"+i.toString()
            keyBind.className = "keyboardKeybind"
            keyBind.innerHTML = (description + " <div class='keyButton'>"+key.toUpperCase()+"</div><br>").replaceAll('"',"")
            document.getElementById("keyboardKeybinds").appendChild(keyBind)
        }
    }

    function loadIllegalActivy(data){
        let id = data.id
        let title = data.title
        let description = data.description
        let minimumPlayersOnline = data.minimumPlayersOnline
        let minimumGroupOnline = data.minimumGroupOnline
        let onlinePlayers = data.onlinePlayers
        let onlineGroup = data.onlineGroup
        let illegalActivity = document.createElement('span')
        let noIcon = ' <i class="fa-solid fa-circle-xmark" style="color: #f34943;"></i>'
        let yesIcon = ' <i class="fa-solid fa-circle-check" style="color: #4ff343;"></i>'
        illegalActivity.id = id+"-"+parseInt(Math.random()*10000).toString()
        illegalActivity.className = "illegalActivity"
        illegalActivity.setAttribute("data-tooltip",description)
        illegalActivity.setAttribute("data-tooltip-position","left")
        if (parseInt(onlineGroup) >= parseInt(minimumGroupOnline) && parseInt(onlinePlayers) >= parseInt(minimumPlayersOnline)) {
            illegalActivity.innerHTML = title+yesIcon
        }
        else{
            illegalActivity.innerHTML = title+noIcon
        }
        document.getElementById("illegalActivites").appendChild(illegalActivity)
        document.getElementById("illegalActivites").appendChild(document.createElement('br'))
    }

    function toggleKeyBinds(){
        var jsonConfig = JSON.parse(config)
        var toggleKeyBinds = JSON.stringify(jsonConfig["showKeyBinds"])
        if (toggleKeyBinds == "false") $(".keybindContainer").hide()
    }

    function togglePlayerInfo(){
        var jsonConfig = JSON.parse(config)
        var togglePlayerInfo = JSON.stringify(jsonConfig["showPlayerInfo"])
        if (togglePlayerInfo == "false") $(".playerInfoContainer").hide()
    }

    function toggleIllegalActivitesInfo(){
        var jsonConfig = JSON.parse(config)
        var toggleIllegalActivitesInfo = JSON.stringify(jsonConfig["showIllegalActivites"])
        if (toggleIllegalActivitesInfo == "false") $(".illegalActivitesContainer").hide()
    }

    function clickedPlayerName(source,user_id,name) {
        fetch(`https://${GetParentResourceName()}/showPlayerPed`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                source: source,
                playerID: user_id,
                playerName: name
            })
        });
    }

    function updateTableDimensions() {
        try {
              document.getElementById("th1").style.width = "45px"
              document.getElementById("th2").style.width = document.getElementById("td2").clientWidth.toString() + "px"
              document.getElementById("th3").style.width = document.getElementById("td3").clientWidth.toString() + "px"
              document.getElementById("th4").style.width = document.getElementById("td4").clientWidth.toString() + "px"
        } 
        catch (error) {}
    }

    setInterval(updateTableDimensions, 50)

});