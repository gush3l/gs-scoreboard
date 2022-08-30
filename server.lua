if Config.OldESX then
    ESX = nil
    TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)
end

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

function RefreshScoreboard()
    local xPlayers = ESX.GetExtendedPlayers()
    TriggerClientEvent("gs-scoreboard:refrehScoreboard", -1)
    getIllegalActivitesData()
    for _, xPlayer in pairs(xPlayers) do
        local playerID = xPlayer.source
        local playerName = Sanitize(xPlayer.getName())
        local playerJob = xPlayer.job.label
        local playerGroup = xPlayer.group
        TriggerClientEvent("gs-scoreboard:addUserToScoreboard", -1, playerID, playerName, playerJob, playerGroup)
        TriggerClientEvent("gs-scoreboard:sendConfigToNUI", -1)
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
end, true)

CreateThread(function()
    while true do
        local onlinePlayers = getOnlinePlayers()
        local onlineStaff = getOnlineStaff()
        local onlinePolice = #ESX.GetExtendedPlayers(Config.policeCounterType,Config.policeCounterIdentifier)
        local onlineEMS = #ESX.GetExtendedPlayers(Config.emsCounterType,Config.emsCounterIdentifier)
        local onlineTaxi = #ESX.GetExtendedPlayers(Config.taxiCounterType,Config.taxiCounterIdentifier)
        local onlineMechanics = #ESX.GetExtendedPlayers(Config.mechanicCounterType,Config.mechanicCounterIdentifier)
        local illegalActivites = getIllegalActivitesData()
        TriggerClientEvent("gs-scoreboard:setValues", -1, onlinePlayers, onlineStaff, onlinePolice, onlineEMS, onlineTaxi, onlineMechanics, illegalActivites)
        Wait(Config.updateScoreboardInterval)
    end
end)

RegisterNetEvent('gs-scoreboard:requestUserData',
    function(target)
        local target = target or source
        TriggerClientEvent("gs-scoreboard:retrieveUserData", tonumber(target), source, tonumber(target))
    end)

RegisterNetEvent('gs-scoreboard:sendRequestedData', 
    function(to, data)
        local xPlayer = ESX.GetPlayerFromId(source)
        if xPlayer ~= nil then
            data.roleplayName = xPlayer.getName()
            TriggerClientEvent("gs-scoreboard:receiveRequestedData", to, source, data)
        end
    end)

AddEventHandler(
    'esx:playerLoaded',  
    function()
        Citizen.Wait(500)
        RefreshScoreboard()
    end
)

AddEventHandler(
    'playerDropped', 
    function()
        Citizen.Wait(500)
        RefreshScoreboard()
    end
)
  

function getOnlinePlayers()
    local xPlayers = ESX.GetExtendedPlayers()
    return #xPlayers
end

function getOnlineStaff()
    local xPlayersTotal = ESX.GetExtendedPlayers()
    local xPlayersUsers = ESX.GetExtendedPlayers('group','user')
    return (#xPlayersTotal - #xPlayersUsers)
end

function getIllegalActivitesData()
    local data = Config.illegalActivites
    for i = 1,#data do
        data[i]["onlinePlayers"] = getOnlinePlayers()
        data[i]["onlineGroup"] = #ESX.GetExtendedPlayers(data[i]["groupType"],data[i]["groupName"])
        TriggerClientEvent("gs-scoreboard:sendIllegalActivity",-1,data[i])
    end
    return data
end

ESX.RegisterServerCallback('gs-scoreboard:Close', function(src, cb)
   SetPlayerCullingRadius(src, 0.0)
   cb()
end)

ESX.RegisterServerCallback('gs-scoreboard:Open', function(src, cb)
    SetPlayerCullingRadius(src, 50000.0)
    cb()
 end)
 