local logger = require("logger")
local millennium = require("millennium")

local function on_frontend_loaded()
    logger:info("[SteamRoulette] Frontend loaded successfully")
end

local function on_load()
    logger:info("[SteamRoulette] Backend initialized")
    millennium.ready()
end

local function on_unload()
    logger:info("[SteamRoulette] Backend unloaded")
end

return {
    on_frontend_loaded = on_frontend_loaded,
    on_load = on_load,
    on_unload = on_unload
}
