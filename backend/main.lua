local logger = require("logger")
local millennium = require("millennium")
local json = require("json")

local function read_json_file(path)
    local file = io.open(path, "r")
    if not file then
        return nil
    end
    local content = file:read("*a")
    file:close()
    if not content or content == "" then
        return nil
    end
    local ok, parsed = pcall(json.decode, content)
    if not ok or type(parsed) ~= "table" then
        return nil
    end
    return parsed
end

local function round_tenths(num)
    return math.floor(num * 10 + 0.5) / 10
end

function GetHltbMap()
    local ok, result = pcall(function()
        local base_dir = millennium.get_install_path()
        local map = {}
        local has_cache = false

        local main_cache = read_json_file(base_dir .. "/cache.json")
        if main_cache then
            has_cache = true
            for app_id, entry in pairs(main_cache) do
                if type(entry) == "table" and type(entry.data) == "table" and not entry.notFound then
                    local m = tonumber(entry.data.comp_main) or 0
                    local c = tonumber(entry.data.comp_100) or 0
                    if m > 0 or c > 0 then
                        map[tostring(app_id)] = {
                            main = m > 0 and round_tenths(m) or 0,
                            comp100 = c > 0 and round_tenths(c) or 0
                        }
                    end
                end
            end
        end

        for i = 0, 99 do
            local chunk_path = string.format("%s/cache_hltb_chunk_%02d.json", base_dir, i)
            local chunk = read_json_file(chunk_path)
            if chunk then
                has_cache = true
                for app_id, entry in pairs(chunk) do
                    local key = tostring(app_id)
                    if not map[key] and type(entry) == "table" and type(entry.data) == "table" and not entry.error then
                        local story_min = tonumber(entry.data.story) or 0
                        local comp_min = tonumber(entry.data.complete) or 0
                        local m = story_min > 0 and round_tenths(story_min / 60) or 0
                        local c = comp_min > 0 and round_tenths(comp_min / 60) or 0
                        if m > 0 or c > 0 then
                            map[key] = {
                                main = m,
                                comp100 = c
                            }
                        end
                    end
                end
            end
        end

        return json.encode({
            hasPluginCache = has_cache,
            map = map
        })
    end)

    if not ok then
        logger:error("[SteamRoulette] GetHltbMap error: " .. tostring(result))
        return json.encode({
            hasPluginCache = false,
            map = {}
        })
    end

    return result
end

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
    on_unload = on_unload,
    GetHltbMap = GetHltbMap
}
