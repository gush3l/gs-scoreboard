Config = {}

Config.updateScoreboardInterval = 2500
Config.screenBlur = true
Config.screenBlurAnimationDuration = 500
Config.showKeyBinds = true
Config.showPlayerInfo = true
Config.showPlayerPed = true
Config.showIllegalActivites = true

Config.policeFactionName = "Politie"
Config.emsFactionName = "SMURD"
Config.taxiFactionName = "Taxi"
Config.mechanicFactionName = "Mecanic"

Config.keyBinds = {
    {
        key = "F1",
        description = "Open Inventory"
    },
    {
        key = "F3",
        description = "Open Animation Menu"
    },
    {
        key = "T",
        description = "Open Chat"
    },
    {
        key = "Y",
        description = "Clothing Whell"
    },
    {
        key = "X",
        description = "Raise Hands"
    }
}

Config.illegalActivites = {
    {
        id = "robseveneleven",
        title = "Rob 7/11 Stores",
        description = "You can rob 7/11 Stores only if there are a minimum of 10 players online and 2 Police Officers on duty!",
        groupName = "police",
        minimumPlayersOnline = 10,
        minimumGroupOnline = 2,
    },
    {
        id = "robsmallbanks",
        title = "Rob Small Banks",
        description = "You can rob Small Banks only if there are a minimum of 30 players online and 4 Police Officers on duty!",
        group_name = "police",
        minimumPlayersOnline = 30,
        minimumGroupOnline = 4,
    },
    {
        id = "robbigbanks",
        title = "Rob Big Bank",
        description = "You can rob Big Bank only if there are a minimum of 60 players online and 10 Police Officers on duty!",
        group_name = "police",
        minimumPlayersOnline = 60,
        minimumGroupOnline = 10,
    },
}