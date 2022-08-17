local Tunnel = module("vrp", "lib/Tunnel")
local Proxy = module("vrp", "lib/Proxy")
vRP = Proxy.getInterface("vRP")
vRPclient = Tunnel.getInterface("vRP","vRP")

function Sanitize(str)
    local replacements = {
        ['&' ] = '&amp;',
        ['<' ] = '&lt;',
        ['>' ] = '&gt;',
        ['\n'] = '<br/>'
    }
    return str
        :gsub('[&<>\n]', replacements)
        :gsub(' +', function(s)
            return ' '..('&nbsp;'):rep(#s-1)
        end)
end

function getFactionName(faction)
    if faction == "user" then
        return "No Faction"
    else
        return faction
    end
end

function getJobName(job)
    if job == "" then
        return "Unemployed"
    else
        return job
    end
end

function RefreshScoreboard()
    local players = vRP.getUsers({})
    TriggerClientEvent("gs-scoreboard:refrehScoreboard", -1)
    for user_id,source in pairs(players) do
        local playerID = user_id
        vRP.getUserIdentity({user_id, function(identity)
            if identity then
                local playerName = Sanitize(identity.firstname.." "..identity.name)
                local playerJob = getJobName(vRP.getUserGroupByType({user_id,'job'}))
                local playerFaction = getFactionName(vRP.getUserFaction({user_id}))
                TriggerClientEvent("gs-scoreboard:addUserToScoreboard", -1, source ,playerID, playerName, playerJob, playerFaction)
                TriggerClientEvent("gs-scoreboard:sendConfigToNUI", -1)
                getIllegalActivitesData()
            end
        end})
    end
end

AddEventHandler('onResourceStart', function(resource)
    if resource == GetCurrentResourceName() then
        Citizen.Wait(1000)
        RefreshScoreboard()
    end
    TriggerClientEvent("gs-scoreboard:sendConfigToNUI", -1)
end)

RegisterCommand("refreshscoreboard", function()
    RefreshScoreboard()
end, false)

RegisterServerEvent("gs-scoreboard:updateValues")
AddEventHandler(
    "gs-scoreboard:updateValues",
    function()
        local onlinePlayers = getOnlinePlayers()
        local onlineStaff = getOnlineStaff()
        local onlinePolice = getOnlineByFaction(Config.policeFactionName)
        local onlineEMS = getOnlineByFaction(Config.emsFactionName)
        local onlineTaxi = getOnlineByFaction(Config.taxiFactionName)
        local onlineMechanics = getOnlineByFaction(Config.mechanicFactionName)
        TriggerClientEvent("gs-scoreboard:setValues", -1, onlinePlayers, onlineStaff, onlinePolice, onlineEMS, onlineTaxi, onlineMechanics)
    end
)

RegisterNetEvent('gs-scoreboard:requestUserData')
AddEventHandler(
    'gs-scoreboard:requestUserData',  
    function(target)
        TriggerClientEvent("gs-scoreboard:retrieveUserData", tonumber(target), source, tonumber(target))
    end
)

RegisterNetEvent('gs-scoreboard:sendRequestedData')
AddEventHandler(
    'gs-scoreboard:sendRequestedData',  
    function(to, data)
        local user_id = vRP.getUserId({source})
        if user_id ~= nil then
            vRP.getUserIdentity({user_id, function(identity)
                if identity then
                    data.playerID = user_id
                    data.roleplayName = Sanitize(identity.firstname.." "..identity.name)
                    TriggerClientEvent("gs-scoreboard:receiveRequestedData", to, source, data)
                end
            end})
        end
    end
)

AddEventHandler(
    "vRP:playerSpawn",
    function()
        print("player join")
        Citizen.Wait(500)
        RefreshScoreboard()
    end
)

AddEventHandler(
    "vRP:playerLeave",
    function ()
        print("player leave")
        Citizen.Wait(500)
        RefreshScoreboard()
    end
)

function getOnlinePlayers()
    local players = vRP.getUsers({})
    local playersCount = 0
    for _ in pairs(players) do
        playersCount = playersCount + 1
    end
    return playersCount
end

function getOnlineStaff()
    local players = vRP.getUsers({})
    local staffCount = 0
    for user_id, source in pairs(players) do
        if vRP.isAdmin({user_id}) then
            staffCount = staffCount + 1
        end
    end
    return staffCount
end

function getOnlineGroup(groupName)
    local usersGroup = vRP.getUsersByGroup({groupName})
    return #usersGroup
end

function getOnlineByFaction(factionName)
    local players = vRP.getUsers({})
    local factionCount = 0
    for user_id, source in pairs(players) do
        if vRP.isUserInFaction({user_id,factionName}) then
            factionCount = factionCount + 1
        end
    end
    return factionCount
end

function getIllegalActivitesData()
    local data = Config.illegalActivites
    for i = 1,#data do
        data[i]["onlinePlayers"] = getOnlinePlayers()
        data[i]["onlineGroup"] = getOnlineByFaction(data[i]["group_name"])
        TriggerClientEvent("gs-scoreboard:sendIllegalActivity",-1,data[i])
    end
    return data
end
