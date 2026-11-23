
const MILLENNIUM_IS_CLIENT_MODULE = true;
const pluginName = "steam-roulette";

function InitializePlugins() {
    window.PLUGIN_LIST = window.PLUGIN_LIST || {};
    window.PLUGIN_LIST[pluginName] = window.PLUGIN_LIST[pluginName] || {};
    window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS = window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS || {};
}
InitializePlugins();

let PluginEntryPointMain = function() {
    return function(exports, MILLENNIUM_API, SP_REACTDOM, SP_REACT) {
        "use strict";

        const h = SP_REACT.createElement;
        const { useState, useEffect, useRef, useCallback, useMemo } = SP_REACT;

        function safeRender(element, container) {
            try {
                if (SP_REACTDOM && typeof SP_REACTDOM.createRoot === "function") {
                    const root = SP_REACTDOM.createRoot(container);
                    root.render(element);
                    return root;
                } else if (SP_REACTDOM && typeof SP_REACTDOM.render === "function") {
                    SP_REACTDOM.render(element, container);
                }
            } catch (err) {
                console.error("[SteamRoulette] safeRender error:", err);
            }
        }

        function playCardFlourishAudio(type) {
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (!AudioCtx) return;
                const ctx = new AudioCtx();
                if (ctx.state === "suspended") ctx.resume();

                if (type === "gather") {
                    
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(140, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.16);
                    gain.gain.setValueAtTime(0.22, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.16);

                    const bufLen = Math.floor(ctx.sampleRate * 0.12);
                    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
                    const channel = buffer.getChannelData(0);
                    for (let j = 0; j < bufLen; j++) {
                        channel[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufLen * 0.35));
                    }
                    const noise = ctx.createBufferSource();
                    noise.buffer = buffer;
                    const filter = ctx.createBiquadFilter();
                    filter.type = "bandpass";
                    filter.frequency.setValueAtTime(800, ctx.currentTime);
                    filter.Q.value = 1.5;
                    const noiseGain = ctx.createGain();
                    noiseGain.gain.setValueAtTime(0.18, ctx.currentTime);
                    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
                    noise.connect(filter);
                    filter.connect(noiseGain);
                    noiseGain.connect(ctx.destination);
                    noise.start(ctx.currentTime);
                } else if (type === "riffle") {
                    
                    const count = 30;
                    const startTime = ctx.currentTime;
                    for (let i = 0; i < count; i++) {
                        const time = startTime + (i * 0.038);
                        const bufLen = Math.floor(ctx.sampleRate * 0.022);
                        const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
                        const channel = buffer.getChannelData(0);
                        for (let j = 0; j < bufLen; j++) {
                            channel[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufLen * 0.28));
                        }
                        const noise = ctx.createBufferSource();
                        noise.buffer = buffer;
                        const filter = ctx.createBiquadFilter();
                        filter.type = "bandpass";
                        filter.frequency.setValueAtTime(1100 + (i * 45) + (Math.random() * 180 - 90), time);
                        filter.Q.value = 2.0;
                        const gain = ctx.createGain();
                        
                        gain.gain.setValueAtTime(0.28, time);
                        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.024);
                        noise.connect(filter);
                        filter.connect(gain);
                        gain.connect(ctx.destination);
                        noise.start(time);
                    }
                } else if (type === "snap") {
                    
                    const bufLen = Math.floor(ctx.sampleRate * 0.045);
                    const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
                    const channel = buffer.getChannelData(0);
                    for (let j = 0; j < bufLen; j++) {
                        channel[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufLen * 0.22));
                    }
                    const noise = ctx.createBufferSource();
                    noise.buffer = buffer;
                    const filter = ctx.createBiquadFilter();
                    filter.type = "bandpass";
                    filter.frequency.setValueAtTime(2200, ctx.currentTime);
                    filter.Q.value = 2.2;
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.32, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
                    noise.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);
                    noise.start(ctx.currentTime);

                    const osc = ctx.createOscillator();
                    const oscGain = ctx.createGain();
                    osc.type = "sine";
                    osc.frequency.setValueAtTime(160, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.06);
                    oscGain.gain.setValueAtTime(0.25, ctx.currentTime);
                    oscGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
                    osc.connect(oscGain);
                    oscGain.connect(ctx.destination);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.06);
                } else if (type === "reveal") {
                    
                    const bass = ctx.createOscillator();
                    const bassGain = ctx.createGain();
                    bass.type = "triangle";
                    bass.frequency.setValueAtTime(95, ctx.currentTime);
                    bass.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.25);
                    bassGain.gain.setValueAtTime(0.18, ctx.currentTime);
                    bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
                    bass.connect(bassGain);
                    bassGain.connect(ctx.destination);
                    bass.start(ctx.currentTime);
                    bass.stop(ctx.currentTime + 0.25);

                    const notes = [783.99, 987.77, 1174.66, 1567.98];
                    notes.forEach((freq, idx) => {
                        const time = ctx.currentTime + (idx * 0.065);
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = "sine";
                        osc.frequency.setValueAtTime(freq, time);
                        gain.gain.setValueAtTime(0.12, time);
                        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(time);
                        osc.stop(time + 0.45);
                    });
                }
            } catch (e) {}
        }

        function getHeroUrls(appid) {
            if (!appid) return [];
            return [
                `/assets/${appid}/library_hero.jpg`,
                `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appid}/library_hero.jpg`,
                `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_hero.jpg`,
                `https://cdn.cloudflare.steamstatic.com/steam/apps/${appid}/library_hero.jpg`,
                `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`
            ];
        }

        function getPosterUrls(appid) {
            if (!appid) return [];
            return [
                `/assets/${appid}/library_600x900.jpg`,
                `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_600x900_2x.jpg`,
                `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_600x900.jpg`,
                `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`
            ];
        }

        const CONFIG_KEY = "steam_random_picker_config";
        function loadConfig() {
            try {
                const s = localStorage.getItem(CONFIG_KEY);
                return s ? JSON.parse(s) : { installedOnly: false, unplayedOnly: false, selectedCollection: "all", soundEnabled: true };
            } catch (e) {
                return { installedOnly: false, unplayedOnly: false, selectedCollection: "all", soundEnabled: true };
            }
        }
        function saveConfig(cfg) {
            try {
                localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
            } catch (e) {}
        }

        function formatPlaytime(minutes, lastPlayed) {
            if ((!minutes || minutes <= 0) && (!lastPlayed || lastPlayed <= 0)) {
                return "Unplayed";
            }
            
            const rawHours = (minutes || 0) / 60;
            const hours = Math.max(0.1, rawHours).toFixed(1);
            return `${hours} hrs`;
        }

        function formatLastPlayed(timestamp) {
            if (!timestamp || timestamp <= 0) return "";
            const date = new Date(timestamp * 1000);
            const now = new Date();
            const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
            if (diffDays === 0) return "Today";
            if (diffDays === 1) return "Yesterday";
            if (diffDays < 30) return `${diffDays} days ago`;
            if (diffDays < 365) return `${Math.floor(diffDays / 30)} mos ago`;
            return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        }

        function fetchSteamApps() {
            const appStore = window.appStore || Reflect.get(globalThis, "appStore");
            const colStore = window.collectionStore || Reflect.get(globalThis, "collectionStore");

            const hiddenAppIdSet = new Set();
            if (colStore) {
                try {
                    const hidCol = colStore.hiddenCollection || (typeof colStore.GetHiddenCollection === "function" && colStore.GetHiddenCollection());
                    if (hidCol) {
                        const hidList = hidCol.allApps || hidCol.apps || hidCol.m_rgApps || [];
                        for (const ha of hidList) {
                            const hid = typeof ha === "number" ? ha : (ha?.appid || ha?.nAppId || ha?.m_unAppId);
                            if (hid) hiddenAppIdSet.add(hid);
                        }
                    }
                } catch (e) {}
            }

            let rawApps = [];
            if (appStore && Array.isArray(appStore.allApps)) {
                rawApps = appStore.allApps;
            } else if (colStore && colStore.allGamesCollection && Array.isArray(colStore.allGamesCollection.allApps)) {
                rawApps = colStore.allGamesCollection.allApps;
            }

            const apps = [];
            for (const a of rawApps) {
                if (!a) continue;
                const appid = a.appid || a.nAppId || a.m_unAppId;
                if (!appid || typeof appid !== "number") continue;

                let isHidden = false;
                try {
                    if (typeof a.BIsHidden === "function" && a.BIsHidden()) {
                        isHidden = true;
                    } else if (a.visible_in_game_list === false || a.hidden === true || a.is_hidden === true || a.bIsHidden === true) {
                        isHidden = true;
                    } else if (colStore && typeof colStore.BIsHidden === "function" && colStore.BIsHidden(appid)) {
                        isHidden = true;
                    } else if (hiddenAppIdSet.has(appid)) {
                        isHidden = true;
                    } else if (a.per_client_data && a.per_client_data[0] && (a.per_client_data[0].hidden === true || a.per_client_data[0].is_hidden === true)) {
                        isHidden = true;
                    }
                } catch (e) {}
                if (isHidden) continue;

                const isShortcut = typeof a.BIsShortcut === "function" ? a.BIsShortcut() : false;
                const isGame = typeof a.BIsGame === "function" ? a.BIsGame() : (a.app_type === 1 || a.app_type === undefined || isShortcut);

                let isInstalled = false;
                if (typeof a.BIsInstalled === "function") {
                    try { isInstalled = a.BIsInstalled(); } catch (e) {}
                } else if (a.installed !== undefined) {
                    isInstalled = !!a.installed;
                } else if (a.per_client_data && a.per_client_data[0]) {
                    isInstalled = !!a.per_client_data[0].installed;
                }

                const displayName = a.display_name || a.name || a.strDisplayName || `Game ${appid}`;
                const playtime = a.minutes_playtime_forever
                    || a.playtime_forever
                    || (a.per_client_data && a.per_client_data[0]?.minutes_playtime_forever)
                    || (a.per_client_data && a.per_client_data[0]?.playtime_forever)
                    || a.nPlaytimeForever
                    || a.m_nPlaytimeForever
                    || 0;
                const lastPlayed = a.rt_last_time_played
                    || a.rtime_last_played
                    || (a.per_client_data && a.per_client_data[0]?.rt_last_time_played)
                    || (a.per_client_data && a.per_client_data[0]?.rtime_last_played)
                    || 0;

                apps.push({
                    appid,
                    name: displayName,
                    isInstalled,
                    isShortcut,
                    isGame,
                    playtime,
                    lastPlayed,
                    raw: a
                });
            }
            return apps;
        }

        function fetchSteamCollections(apps) {
            const colStore = window.collectionStore || Reflect.get(globalThis, "collectionStore");
            const collections = [];

            const validAppIdSet = new Set(apps.map(a => a.appid));

            collections.push({
                id: "all",
                name: `All Games (${apps.length})`,
                appIds: null
            });

            if (colStore) {
                
                if (colStore.favoritesCollection) {
                    const fav = colStore.favoritesCollection;
                    const favApps = (fav.allApps || fav.apps || fav.m_rgApps || []).map(a => (typeof a === "number" ? a : (a?.appid || a?.nAppId || a?.m_unAppId))).filter(Boolean);
                    const matchedFav = favApps.filter(id => validAppIdSet.has(id));
                    if (matchedFav.length > 0) {
                        collections.push({
                            id: "favorites",
                            name: `Favorites (${matchedFav.length})`,
                            appIds: matchedFav
                        });
                    }
                }

                const userCols = colStore.userCollections;
                if (userCols) {
                    const list = Array.isArray(userCols)
                        ? userCols
                        : (typeof userCols.values === "function" ? Array.from(userCols.values()) : Object.values(userCols));

                    for (const col of list) {
                        if (!col) continue;
                        const id = col.id || col.strId || col.m_strId || col.collectionId;
                        const name = col.displayName || col.name || col.strName || (typeof col.GetDisplayName === "function" ? col.GetDisplayName() : null) || id;
                        if (!name) continue;

                        if (String(id).toLowerCase() === "hidden" || name.toLowerCase() === "hidden") continue;

                        let colApps = [];
                        if (Array.isArray(col.allApps)) colApps = col.allApps;
                        else if (Array.isArray(col.apps)) colApps = col.apps;
                        else if (Array.isArray(col.m_rgApps)) colApps = col.m_rgApps;
                        else if (Array.isArray(col.visibleApps)) colApps = col.visibleApps;
                        else if (typeof col.GetApps === "function") {
                            try { colApps = col.GetApps() || []; } catch (e) {}
                        }

                        const appIds = colApps.map(a => (typeof a === "number" ? a : (a?.appid || a?.nAppId || a?.m_unAppId))).filter(Boolean);
                        
                        const matchedAppIds = appIds.filter(id => validAppIdSet.has(id));

                        if (matchedAppIds.length > 0) {
                            collections.push({
                                id: String(id),
                                name: `${name} (${matchedAppIds.length})`,
                                appIds: matchedAppIds,
                                rawCollection: col
                            });
                        }
                    }
                }
            }

            return collections;
        }

        function navigateToGame(appid) {
            try {
                if (window.SteamUIStore && typeof window.SteamUIStore.Navigate === "function") {
                    window.SteamUIStore.Navigate(`/library/app/${appid}`);
                } else {
                    window.location.hash = `#/library/app/${appid}`;
                }
            } catch (e) {
                console.error("[SteamRoulette] Navigate error:", e);
            }
        }

        function launchGame(appid) {
            try {
                if (window.SteamClient && window.SteamClient.Apps && typeof window.SteamClient.Apps.RunGame === "function") {
                    window.SteamClient.Apps.RunGame(appid, "", -1, 100);
                } else {
                    const a = document.createElement("a");
                    a.href = `steam://run/${appid}`;
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(() => a.remove(), 100);
                }
            } catch (e) {
                console.error("[SteamRoulette] Launch error:", e);
            }
        }

        function installGame(appid) {
            try {
                const numId = Number(appid);
                console.log("[SteamRoulette] Installing game via SteamClient.Installs.OpenInstallWizard:", numId);

                if (window.SteamClient && window.SteamClient.Installs && typeof window.SteamClient.Installs.OpenInstallWizard === "function") {
                    window.SteamClient.Installs.OpenInstallWizard([numId], "0");
                } else {
                    navigateToGame(numId);
                }
            } catch (e) {
                console.error("[SteamRoulette] Install error:", e);
                navigateToGame(appid);
            }
        }

        function ensureCustomStyles() {
            let style = document.getElementById("steam-roulette-fan-styles");
            if (!style) {
                style = document.createElement("style");
                style.id = "steam-roulette-fan-styles";
                document.head.appendChild(style);
            }
            style.textContent = `
                
                .srp-stage {
                    perspective: 1200px;
                    perspective-origin: 50% 50%;
                    transform-style: preserve-3d;
                }

                
                @keyframes srp-anim-riffle-left {
                    0%   { transform: translate3d(-75px, 0px, -10px) rotateZ(-7deg); }
                    50%  { transform: translate3d(-92px, -16px, 15px) rotateZ(-12deg); }
                    100% { transform: translate3d(-75px, 0px, -10px) rotateZ(-7deg); }
                }

                
                @keyframes srp-anim-riffle-right {
                    0%   { transform: translate3d(75px, 0px, -10px) rotateZ(7deg); }
                    50%  { transform: translate3d(92px, -16px, 15px) rotateZ(12deg); }
                    100% { transform: translate3d(75px, 0px, -10px) rotateZ(7deg); }
                }

                
                @keyframes srp-anim-fly-ltr {
                    0%   { transform: translate3d(-85px, -10px, 20px) rotateZ(-11deg) scale(0.96); z-index: 35; }
                    40%  { transform: translate3d(0px, -48px, 60px) rotateZ(0deg) scale(1.06); z-index: 45; }
                    85%  { transform: translate3d(85px, 5px, 10px) rotateZ(9deg) scale(0.96); z-index: 25; }
                    100% { transform: translate3d(-85px, -10px, 20px) rotateZ(-11deg) scale(0.96); z-index: 35; }
                }

                
                @keyframes srp-anim-fly-rtl {
                    0%   { transform: translate3d(85px, -10px, 20px) rotateZ(11deg) scale(0.96); z-index: 35; }
                    40%  { transform: translate3d(0px, -48px, 60px) rotateZ(0deg) scale(1.06); z-index: 45; }
                    85%  { transform: translate3d(-85px, 5px, 10px) rotateZ(-9deg) scale(0.96); z-index: 25; }
                    100% { transform: translate3d(85px, -10px, 20px) rotateZ(11deg) scale(0.96); z-index: 35; }
                }

                
                @keyframes srp-anim-bridge {
                    0%   { transform: translate3d(0, 0, 0) scale(1); }
                    45%  { transform: translate3d(0, -38px, 45px) scale(1.05) rotateX(20deg); }
                    100% { transform: translate3d(0, 0, 15px) scale(1) rotateX(0deg); }
                }

                
                @keyframes srp-winner-pop {
                    0% {
                        transform: translate3d(0, 18px, -20px) scale(0.94);
                        opacity: 1;
                    }
                    60% {
                        transform: translate3d(0, -10px, 35px) scale(1.05);
                        opacity: 1;
                    }
                    100% {
                        transform: translate3d(0, 0px, 25px) scale(1.02);
                        opacity: 1;
                    }
                }

                
                @keyframes srp-glow-aura {
                    0%, 100% {
                        box-shadow: 0 0 18px rgba(6, 191, 255, 0.45), 0 6px 18px rgba(0, 0, 0, 0.35);
                    }
                    50% {
                        box-shadow: 0 0 28px rgba(6, 191, 255, 0.75), 0 8px 22px rgba(0, 0, 0, 0.4);
                    }
                }

                .srp-card-base {
                    transform-origin: 50% 85%;
                    backface-visibility: hidden;
                    will-change: transform, opacity;
                }
            `;
        }

        function PosterCardItem(props) {
            const { game, isWinner, shufflePhase, index, totalCards } = props;
            const [urlIdx, setUrlIdx] = useState(0);

            const urls = useMemo(() => getPosterUrls(game ? game.appid : null), [game]);
            const currentSrc = urls[urlIdx] || urls[urls.length - 1] || "";

            useEffect(() => {
                setUrlIdx(0);
            }, [game?.appid]);

            const handleError = useCallback(() => {
                setUrlIdx(i => (i + 1 < urls.length ? i + 1 : i));
            }, [urls]);

            const offset = index - 2;
            const idleRot = offset * 8.5;       
            const idleX = offset * 68;          
            const idleY = Math.abs(offset) * 8; 
            const idleZ = 20 - Math.abs(offset) * 6; 
            const idleScale = 1 - Math.abs(offset) * 0.035;

            let cardTransform = "";
            let cardTransition = "none";
            let animStyle = {};
            let zIndexVal = 10 + idleZ;
            let cardOpacity = 1;

            if (shufflePhase === "idle") {
                cardTransform = `translate3d(${idleX}px, ${idleY}px, ${idleZ}px) rotateZ(${idleRot}deg) scale(${idleScale})`;
                cardTransition = "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.3s ease";
                cardOpacity = 1;
            } else if (shufflePhase === "gather") {
                
                cardTransform = `translate3d(0px, ${offset * 2}px, ${index * 3}px) rotateZ(0deg) scale(0.96)`;
                cardTransition = "transform 0.24s cubic-bezier(0.25, 1, 0.5, 1)";
                zIndexVal = 20 + index;
            } else if (shufflePhase === "riffle") {
                
                if (index === 0) {
                    animStyle = { animation: "srp-anim-riffle-left 0.32s ease-in-out infinite", zIndex: 18 };
                } else if (index === 1) {
                    animStyle = { animation: "srp-anim-fly-ltr 0.38s ease-in-out infinite", zIndex: 35 };
                } else if (index === 2) {
                    animStyle = { animation: "srp-anim-fly-rtl 0.35s ease-in-out infinite", zIndex: 40 };
                } else if (index === 3) {
                    animStyle = { animation: "srp-anim-riffle-right 0.32s ease-in-out infinite", zIndex: 18 };
                } else if (index === 4) {
                    animStyle = { animation: "srp-anim-fly-ltr 0.42s ease-in-out infinite reverse", zIndex: 30 };
                }
            } else if (shufflePhase === "bridge") {
                
                animStyle = { animation: "srp-anim-bridge 0.28s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards", zIndex: 25 };
            } else if (shufflePhase === "reveal") {
                
                if (isWinner) {
                    
                    animStyle = {
                        animation: "srp-winner-pop 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, srp-glow-aura 2.2s ease-in-out infinite 0.5s",
                        zIndex: 60
                    };
                    cardOpacity = 1;
                } else {
                    
                    cardTransform = `translate3d(${idleX}px, ${idleY}px, ${idleZ}px) rotateZ(${idleRot}deg) scale(${idleScale})`;
                    cardTransition = "transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease";
                    cardOpacity = 0.85;
                    zIndexVal = 10 + idleZ;
                }
            }

            return h("div", {
                className: "srp-card-base",
                style: {
                    position: "absolute",
                    top: "0px",
                    width: "185px",
                    height: "278px",
                    borderRadius: "14px",
                    overflow: "hidden",
                    backgroundColor: "#141c26",
                    isolation: "isolate",
                    border: isWinner && shufflePhase === "reveal"
                        ? "2px solid #06BFFF"
                        : "1px solid rgba(255,255,255,0.14)",
                    
                    boxShadow: isWinner && shufflePhase === "reveal"
                        ? "0 0 22px rgba(6, 191, 255, 0.55), 0 6px 18px rgba(0, 0, 0, 0.35)"
                        : "0 4px 14px rgba(0, 0, 0, 0.28)",
                    boxSizing: "border-box",
                    transform: cardTransform || undefined,
                    transition: cardTransition,
                    zIndex: zIndexVal,
                    opacity: cardOpacity,
                    ...animStyle
                }
            },
                
                h("img", {
                    src: currentSrc,
                    onError: handleError,
                    alt: game?.name || "Game",
                    style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block"
                    }
                }),

                

                h("div", {
                    style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: isWinner && shufflePhase === "reveal"
                            ? "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.2) 40%, rgba(13,20,27,0.95) 82%, rgba(13,20,27,1) 100%)"
                            : "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%)",
                        pointerEvents: "none"
                    }
                }),

                isWinner && shufflePhase === "reveal" && h("div", {
                    style: {
                        position: "absolute",
                        top: "8px",
                        left: "8px",
                        right: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        zIndex: 4,
                        pointerEvents: "none"
                    }
                },
                    h("span", {
                        style: {
                            padding: "3px 8px",
                            borderRadius: "8px",
                            fontSize: "9px",
                            fontWeight: "800",
                            backgroundColor: "rgba(0,0,0,0.85)",
                            border: "1px solid #06BFFF",
                            color: "#06BFFF",
                            boxShadow: "0 0 8px rgba(6,191,255,0.4)"
                        }
                    }, "★ SELECTED"),
                    h("span", {
                        style: {
                            padding: "3px 8px",
                            borderRadius: "8px",
                            fontSize: "9px",
                            fontWeight: "800",
                            backgroundColor: game?.isInstalled ? "rgba(92,126,16,0.95)" : "rgba(40,40,40,0.88)",
                            color: "#ffffff"
                        }
                    }, game?.isInstalled ? "✓ Installed" : "Not Installed")
                ),

                isWinner && shufflePhase === "reveal" && h("div", {
                    style: {
                        position: "absolute",
                        bottom: "8px",
                        left: "10px",
                        right: "10px",
                        zIndex: 4,
                        pointerEvents: "none"
                    }
                },
                    h("div", {
                        style: {
                            fontSize: "13px",
                            fontWeight: "800",
                            color: "#ffffff",
                            textShadow: "0 2px 5px rgba(0,0,0,0.95)",
                            lineHeight: "1.2",
                            maxHeight: "32px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            marginBottom: "3px"
                        }
                    }, game?.name),
                    h("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "10px",
                            color: "#8f98a0"
                        }
                    },
                        h("span", null, h("strong", { style: { color: "#66c0f4" } }, formatPlaytime(game?.playtime, game?.lastPlayed))),
                        formatLastPlayed(game?.lastPlayed)
                            ? h("span", null, h("strong", { style: { color: "#66c0f4" } }, formatLastPlayed(game?.lastPlayed)))
                            : null
                    )
                )
            );
        }

        function RandomPickerUI(props) {
            const [cfg, setCfg] = useState(loadConfig);
            const [apps, setApps] = useState([]);
            const [collections, setCollections] = useState([]);
            const [selectedCollection, setSelectedCollection] = useState(cfg.selectedCollection || "");
            const [installedOnly, setInstalledOnly] = useState(cfg.installedOnly || false);
            const [unplayedOnly, setUnplayedOnly] = useState(cfg.unplayedOnly || false);
            const [onlyGames, setOnlyGames] = useState(true);
            const [soundEnabled, setSoundEnabled] = useState(cfg.soundEnabled !== false);

            useEffect(() => {
                if (collections.length > 0) {
                    if (!selectedCollection || !collections.some(c => c.id === selectedCollection)) {
                        setSelectedCollection(collections[0].id);
                    }
                }
            }, [collections, selectedCollection]);

            const [shufflePhase, setShufflePhase] = useState("idle");
            const [winnerGame, setWinnerGame] = useState(null);
            const [heroBackground, setHeroBackground] = useState("");

            useEffect(() => {
                if (shufflePhase === "reveal" && winnerGame?.appid) {
                    const urls = getHeroUrls(winnerGame.appid);
                    let idx = 0;
                    const img = new Image();
                    img.onload = () => {
                        const chosen = urls[idx];
                        setHeroBackground(chosen);
                        if (typeof props?.onHeroChange === "function") {
                            props.onHeroChange(chosen);
                        }
                    };
                    img.onerror = () => {
                        idx++;
                        if (idx < urls.length) {
                            img.src = urls[idx];
                        }
                    };
                    img.src = urls[0];
                } else if (shufflePhase === "gather" || shufflePhase === "riffle") {
                    setHeroBackground("");
                    if (typeof props?.onHeroChange === "function") {
                        props.onHeroChange("");
                    }
                }
            }, [shufflePhase, winnerGame?.appid]);

            const [fanDeckGames, setFanDeckGames] = useState([]);

            useEffect(() => {
                ensureCustomStyles();
            }, []);

            const refreshData = useCallback(() => {
                try {
                    const loadedApps = fetchSteamApps();
                    setApps(loadedApps);
                    const loadedCols = fetchSteamCollections(loadedApps);
                    setCollections(loadedCols);
                } catch (e) {
                    console.error("[SteamRoulette] refreshData error:", e);
                }
            }, []);

            useEffect(() => {
                refreshData();
                const timer = setTimeout(refreshData, 1000);
                return () => clearTimeout(timer);
            }, [refreshData]);

            useEffect(() => {
                const newCfg = { ...cfg, selectedCollection, installedOnly, unplayedOnly, soundEnabled };
                setCfg(newCfg);
                saveConfig(newCfg);
            }, [selectedCollection, installedOnly, unplayedOnly, soundEnabled]);

            const candidates = useMemo(() => {
                if (!apps.length || !collections.length) return [];
                let filtered = [...apps];

                if (onlyGames) {
                    filtered = filtered.filter(a => a.isGame);
                }

                const col = collections.find(c => c.id === selectedCollection) || collections[0];
                if (col && Array.isArray(col.appIds)) {
                    filtered = filtered.filter(a => col.appIds.includes(a.appid));
                }

                if (installedOnly) {
                    filtered = filtered.filter(a => a.isInstalled);
                }
                if (unplayedOnly) {
                    filtered = filtered.filter(a => a.playtime === 0);
                }

                return filtered;
            }, [apps, collections, selectedCollection, installedOnly, unplayedOnly, onlyGames]);

            useEffect(() => {
                if (!candidates || candidates.length === 0) {
                    setFanDeckGames([]);
                    return;
                }
                if (shufflePhase !== "idle") return;

                const shuffled = [...candidates].sort(() => 0.5 - Math.random());
                const five = [];
                for (let i = 0; i < 5; i++) {
                    five.push(shuffled[i % shuffled.length]);
                }
                setFanDeckGames(five);
                setWinnerGame(null);
            }, [candidates, shufflePhase]);

            const timersRef = useRef([]);
            const clearAllTimers = () => {
                timersRef.current.forEach(t => clearTimeout(t));
                timersRef.current = [];
            };

            const isShuffling = shufflePhase !== "idle" && shufflePhase !== "reveal";

            const handleShuffleDeck = useCallback(() => {
                if (candidates.length === 0 || isShuffling) return;

                clearAllTimers();
                ensureCustomStyles();

                const chosen = candidates[Math.floor(Math.random() * candidates.length)];

                const samplePool = [...candidates].sort(() => 0.5 - Math.random()).slice(0, 14);
                samplePool.forEach(g => {
                    const img = new Image();
                    img.src = getPosterUrls(g.appid)[0];
                });

                setShufflePhase("gather");
                setWinnerGame(null);
                if (soundEnabled) playCardFlourishAudio("gather");

                const t1 = setTimeout(() => {
                    setShufflePhase("riffle");
                    if (soundEnabled) playCardFlourishAudio("riffle");

                    let cycleCount = 0;
                    const cycleInterval = setInterval(() => {
                        cycleCount++;
                        if (cycleCount > 16) {
                            clearInterval(cycleInterval);
                            return;
                        }
                        const r1 = samplePool[Math.floor(Math.random() * samplePool.length)];
                        const r2 = samplePool[Math.floor(Math.random() * samplePool.length)];
                        const r3 = samplePool[Math.floor(Math.random() * samplePool.length)];
                        const r4 = samplePool[Math.floor(Math.random() * samplePool.length)];
                        const r5 = samplePool[Math.floor(Math.random() * samplePool.length)];
                        setFanDeckGames([r1, r2, r3, r4, r5]);
                    }, 75);

                    timersRef.current.push(cycleInterval);
                }, 220);
                timersRef.current.push(t1);

                const t2 = setTimeout(() => {
                    setShufflePhase("bridge");
                    if (soundEnabled) playCardFlourishAudio("snap");

                    const others = candidates.filter(c => c.appid !== chosen.appid).sort(() => 0.5 - Math.random());
                    setFanDeckGames([
                        others[0] || chosen,
                        others[1] || chosen,
                        chosen, 
                        others[2] || chosen,
                        others[3] || chosen
                    ]);
                }, 1500);
                timersRef.current.push(t2);

                const t3 = setTimeout(() => {
                    setWinnerGame(chosen);
                    setShufflePhase("reveal");
                    if (soundEnabled) playCardFlourishAudio("reveal");
                }, 1780);
                timersRef.current.push(t3);

            }, [candidates, isShuffling, soundEnabled]);

            useEffect(() => {
                return () => clearAllTimers();
            }, []);

            const styles = {
                wrapper: {
                    padding: "20px 24px",
                    color: "#c7d5e0",
                    fontFamily: '"Motiva Sans", "Segoe UI", Arial, sans-serif',
                    backgroundColor: "#161d26",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "16px",
                    maxWidth: "540px",
                    margin: "0 auto",
                    boxShadow: "0 16px 50px rgba(0,0,0,0.75)",
                    border: "1px solid #233143",
                    boxSizing: "border-box"
                },
                header: {
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                    borderBottom: "1px solid rgba(102,192,244,0.15)",
                    paddingBottom: "10px",
                    paddingRight: "46px"
                },
                titleGroup: {
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                },
                titleText: {
                    fontSize: "18px",
                    fontWeight: "800",
                    color: "#ffffff",
                    letterSpacing: "0.5px",
                    margin: 0
                },
                subtitleText: {
                    fontSize: "11px",
                    color: "#8f98a0",
                    margin: 0
                },
                soundToggle: {
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid #3d4450",
                    borderRadius: "20px",
                    padding: "4px 9px",
                    color: soundEnabled ? "#66c0f4" : "#8f98a0",
                    fontSize: "11px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    userSelect: "none"
                },
                formRow: {
                    position: "relative",
                    zIndex: 1,
                    marginBottom: "10px"
                },
                label: {
                    display: "block",
                    fontSize: "10px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    color: "#66c0f4",
                    marginBottom: "4px"
                },
                select: {
                    width: "100%",
                    padding: "9px 12px",
                    backgroundColor: "#0f161e",
                    color: "#ffffff",
                    border: "1px solid #283747",
                    borderRadius: "6px",
                    fontSize: "12px",
                    outline: "none",
                    cursor: "pointer",
                    boxSizing: "border-box"
                },
                filterBar: {
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    marginBottom: "0px",
                    backgroundColor: "rgba(0,0,0,0.25)",
                    padding: "6px 12px",
                    borderRadius: "6px"
                },
                checkboxLabel: {
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: "11px",
                    color: "#c7d5e0",
                    cursor: "pointer",
                    userSelect: "none"
                },
                checkbox: {
                    marginRight: "5px",
                    accentColor: "#66c0f4",
                    cursor: "pointer"
                },
                
                stageContainer: {
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    height: "320px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "31px 0 9px 0",
                    overflow: "visible"
                },
                shuffleButton: {
                    position: "relative",
                    zIndex: 1,
                    width: "100%",
                    padding: "14px",
                    fontSize: "15px",
                    fontWeight: "800",
                    color: "#ffffff",
                    letterSpacing: "0.5px",
                    background: isShuffling
                        ? "linear-gradient(90deg, #3d4f63, #222d38)"
                        : "linear-gradient(90deg, #06BFFF 0%, #2D73FF 100%)",
                    border: "none",
                    borderRadius: "8px",
                    cursor: candidates.length === 0 || isShuffling ? "not-allowed" : "pointer",
                    boxShadow: isShuffling ? "none" : "0 4px 20px rgba(45, 115, 255, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "all 0.2s ease"
                },
                actionButtonsRow: {
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    gap: "8px",
                    marginTop: "12px"
                },
                btnPlay: {
                    flex: 1.2,
                    padding: "11px",
                    fontSize: "12px",
                    fontWeight: "800",
                    color: "#ffffff",
                    backgroundColor: "#5c7e10",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    boxShadow: "0 3px 12px rgba(92,126,16,0.35)"
                },
                btnSecondary: {
                    flex: 1,
                    padding: "11px",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#c7d5e0",
                    backgroundColor: "#223142",
                    border: "1px solid #32475e",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "4px"
                }
            };

            const buttonLabel = useMemo(() => {
                if (candidates.length === 0) return "Deck is Empty";
                if (isShuffling) return "Shuffling...";
                return "SHUFFLE DECK NOW";
            }, [isShuffling, candidates.length]);

            return h("div", { style: styles.wrapper },
                h("div", {
                    style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: heroBackground ? `url("${heroBackground}")` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center 20%",
                        filter: "blur(1.5px)",
                        transform: "scale(1.05)",
                        opacity: heroBackground && shufflePhase === "reveal" ? 0.42 : 0,
                        transition: "opacity 0.65s cubic-bezier(0.2, 0.8, 0.2, 1), background-image 0.4s ease",
                        zIndex: 0,
                        pointerEvents: "none"
                    }
                }),
                h("div", {
                    style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: heroBackground && shufflePhase === "reveal"
                            ? "linear-gradient(to bottom, rgba(16, 23, 32, 0.62) 0%, rgba(13, 19, 27, 0.82) 40%, rgba(10, 15, 22, 0.95) 100%)"
                            : "none",
                        transition: "background 0.65s ease",
                        zIndex: 0,
                        pointerEvents: "none"
                    }
                }),
                
                h("div", { style: styles.header },
                    h("div", { style: styles.titleGroup },
                        h("span", { style: { fontSize: "24px" } }, "🎰"),
                        h("div", null,
                            h("h3", { style: styles.titleText }, "Steam Roulette"),
                            h("p", { style: styles.subtitleText }, "Random game picker for your Steam library")
                        )
                    ),
                    h("button", {
                        style: styles.soundToggle,
                        title: soundEnabled ? "Sound Enabled" : "Sound Muted",
                        onClick: () => setSoundEnabled(!soundEnabled)
                    }, soundEnabled ? "Sound ON" : "Sound OFF")
                ),

                h("div", { style: styles.formRow },
                    h("label", { style: styles.label }, "SELECT SOURCE DECK:"),
                    h("select", {
                        style: styles.select,
                        value: selectedCollection,
                        onChange: e => setSelectedCollection(e.target.value)
                    },
                        collections.length === 0
                            ? h("option", { value: "" }, "No Steam Collections Found")
                            : collections.map(c => h("option", { key: c.id, value: c.id }, c.name))
                    )
                ),

                h("div", { style: styles.filterBar },
                    h("label", { style: styles.checkboxLabel },
                        h("input", {
                            type: "checkbox",
                            style: styles.checkbox,
                            checked: installedOnly,
                            onChange: e => setInstalledOnly(e.target.checked)
                        }),
                        "Installed"
                    ),
                    h("label", { style: styles.checkboxLabel },
                        h("input", {
                            type: "checkbox",
                            style: styles.checkbox,
                            checked: unplayedOnly,
                            onChange: e => setUnplayedOnly(e.target.checked)
                        }),
                        "Unplayed"
                    ),
                    h("span", { style: { fontSize: "11px", color: "#66c0f4", fontWeight: "700" } },
                        `${candidates.length} Cards in Deck`
                    )
                ),

                h("div", { style: styles.stageContainer, className: "srp-stage" },
                    fanDeckGames.map((game, idx) => {
                        const isCenter = idx === 2;
                        const isWinner = winnerGame ? (winnerGame.appid === game?.appid && isCenter) : false;

                        return h(PosterCardItem, {
                            key: `card-${idx}`,
                            game: game,
                            index: idx,
                            totalCards: fanDeckGames.length,
                            shufflePhase: shufflePhase,
                            isWinner: isWinner
                        });
                    })
                ),

                h("button", {
                    style: styles.shuffleButton,
                    disabled: candidates.length === 0 || isShuffling,
                    onClick: handleShuffleDeck
                },
                    buttonLabel
                ),

                shufflePhase === "reveal" && winnerGame && h("div", { style: styles.actionButtonsRow },
                    winnerGame.isInstalled
                        ? h("button", {
                            style: styles.btnPlay,
                            onClick: () => launchGame(winnerGame.appid)
                        }, "Play Now")
                        : h("button", {
                            style: styles.btnPlay,
                            onClick: () => installGame(winnerGame.appid)
                        }, "Install Game"),
                    h("button", {
                        style: styles.btnSecondary,
                        onClick: () => navigateToGame(winnerGame.appid)
                    }, "View in Library")
                )
            );
        }

        function injectFloatingQuickButton(doc) {
            try {
                if (!doc || !doc.body || doc.getElementById("steam-roulette-fab-root")) return;

                const root = doc.createElement("div");
                root.id = "steam-roulette-fab-root";
                doc.body.appendChild(root);

                function ModalWrapper() {
                    const [isOpen, setIsOpen] = useState(false);
                    const [currentHero, setCurrentHero] = useState("");
                    const [pos, setPos] = useState({ bottom: 35, right: 25 });

                    useEffect(() => {
                        const handleKey = (e) => {
                            if (e.key === "Escape" && isOpen) setIsOpen(false);
                        };
                        window.addEventListener("keydown", handleKey);
                        return () => window.removeEventListener("keydown", handleKey);
                    }, [isOpen]);

                    useEffect(() => {
                        const updatePos = () => {
                            try {
                                const gh = doc.querySelector(".gh-home");
                                let target = null;
                                if (gh && gh.parentElement) {
                                    target = gh.closest(".MainPanel") || gh.closest('[class*="MainPanel"]') || gh.parentElement;
                                }
                                if (!target) {
                                    const selectors = [
                                        ".MainPanel > .AppDetailsTransitionGroup",
                                        ".AppDetailsTransitionGroup",
                                        ".MainPanel",
                                        ".LibraryHome",
                                        ".AppDetailsMain",
                                        '[class*="AppDetailsTransitionGroup"]',
                                        '[class*="MainPanel"]',
                                        '[class*="LibraryHome"]',
                                        '[class*="LocalContentContainer"]'
                                    ];
                                    for (const sel of selectors) {
                                        const el = doc.querySelector(sel);
                                        if (el) {
                                            const r = el.getBoundingClientRect();
                                            if (r.width > 250 && r.height > 250) {
                                                target = el;
                                                break;
                                            }
                                        }
                                    }
                                }

                                if (target) {
                                    const rect = target.getBoundingClientRect();
                                    const winW = doc.defaultView?.innerWidth || window.innerWidth || 1920;
                                    const winH = doc.defaultView?.innerHeight || window.innerHeight || 1080;

                                    const rightDist = Math.max(16, Math.round(winW - rect.right + 24));
                                    const bottomDist = Math.max(16, Math.round(winH - rect.bottom + 22));

                                    setPos(prev => {
                                        if (Math.abs(prev.right - rightDist) > 1 || Math.abs(prev.bottom - bottomDist) > 1) {
                                            return { right: rightDist, bottom: bottomDist };
                                        }
                                        return prev;
                                    });
                                }
                            } catch (e) {}
                        };

                        updatePos();

                        const win = doc.defaultView || window;
                        win.addEventListener("resize", updatePos);

                        let ro = null;
                        try {
                            if (typeof win.ResizeObserver === "function") {
                                ro = new win.ResizeObserver(updatePos);
                                ro.observe(doc.body);
                                const p = doc.querySelector('[class*="MainPanel"]') || doc.querySelector(".MainPanel");
                                if (p) ro.observe(p);
                            }
                        } catch (e) {}

                        const timer = setInterval(updatePos, 250);

                        return () => {
                            clearInterval(timer);
                            win.removeEventListener("resize", updatePos);
                            if (ro) ro.disconnect();
                        };
                    }, []);

                    const fabStyle = {
                        position: "fixed",
                        bottom: `${pos.bottom}px`,
                        right: `${pos.right}px`,
                        zIndex: 99999,
                        background: "linear-gradient(135deg, #1b2838 0%, #171a21 100%)",
                        color: "#66c0f4",
                        border: "2px solid #66c0f4",
                        borderRadius: "24px",
                        padding: "9px 16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: "bold",
                        fontSize: "13px",
                        cursor: "pointer",
                        boxShadow: "0 4px 18px rgba(0,0,0,0.6), 0 0 12px rgba(102,192,244,0.3)",
                        transition: "right 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), bottom 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.2s ease"
                    };

                    const backdropStyle = {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0, 0, 0, 0.82)",
                        backgroundImage: currentHero ? `radial-gradient(ellipse at center, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.92) 100%), url("${currentHero}")` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                        backdropFilter: "blur(8px)",
                        transition: "background-image 0.6s ease",
                        zIndex: 100000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        boxSizing: "border-box"
                    };

                    const modalStyle = {
                        position: "relative",
                        maxHeight: "95vh",
                        overflowY: "auto",
                        width: "100%",
                        maxWidth: "540px"
                    };

                    const closeBtnStyle = {
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        background: "rgba(0,0,0,0.65)",
                        border: "1px solid #3d4450",
                        color: "#ffffff",
                        fontSize: "16px",
                        cursor: "pointer",
                        width: "32px",
                        height: "32px",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10
                    };

                    return h("div", null,
                        h("button", {
                            style: fabStyle,
                            title: "Steam Roulette",
                            onClick: () => setIsOpen(true)
                        },
                            h("span", { style: { fontSize: "16px" } }, "🎰"),
                            "Steam Roulette"
                        ),

                        isOpen && h("div", {
                            style: backdropStyle,
                            onClick: (e) => {
                                if (e.target === e.currentTarget) setIsOpen(false);
                            }
                        },
                            h("div", { style: modalStyle },
                                h("button", {
                                    style: closeBtnStyle,
                                    onClick: () => setIsOpen(false)
                                }, "✕"),
                                h(RandomPickerUI, { onHeroChange: setCurrentHero })
                            )
                        )
                    );
                }

                safeRender(h(ModalWrapper, null), root);
            } catch (err) {
                console.error("[SteamRoulette] injectFloatingQuickButton error:", err);
            }
        }

        const definePlugin = MILLENNIUM_API.definePlugin(async () => {
            console.log("[SteamRoulette] Initializing 3D Card Fan Magician Shuffler...");

            try {
                if (typeof document !== "undefined" && document.body) {
                    injectFloatingQuickButton(document);
                }

                if (MILLENNIUM_API.Millennium && typeof MILLENNIUM_API.Millennium.AddWindowCreateHook === "function") {
                    MILLENNIUM_API.Millennium.AddWindowCreateHook(async (e) => {
                        try {
                            if (e && e.m_strName === "SP Desktop_uid0") {
                                const checkDoc = () => {
                                    if (e.m_popup && e.m_popup.document && e.m_popup.document.body) {
                                        injectFloatingQuickButton(e.m_popup.document);
                                    } else {
                                        setTimeout(checkDoc, 300);
                                    }
                                };
                                checkDoc();
                            }
                        } catch (err) {
                            console.error("[SteamRoulette] Window hook error:", err);
                        }
                    });
                }
            } catch (err) {
                console.error("[SteamRoulette] definePlugin setup error:", err);
            }

            const iconElement = (MILLENNIUM_API.IconsModule && MILLENNIUM_API.IconsModule.Settings)
                ? h(MILLENNIUM_API.IconsModule.Settings, null)
                : h("span", { style: { fontSize: "16px" } }, "🎰");

            return {
                title: "Steam Roulette",
                icon: iconElement,
                content: h(RandomPickerUI, null)
            };
        });

        exports.default = definePlugin;
        Object.defineProperty(exports, "__esModule", { value: true });
        return exports;
    }({}, window.MILLENNIUM_API, window.SP_REACTDOM, window.SP_REACT);
};

async function ExecutePluginModule() {
    try {
        let entry = PluginEntryPointMain();
        Object.assign(window.PLUGIN_LIST[pluginName], {
            ...entry,
            __millennium_internal_plugin_name_do_not_use_or_change__: pluginName
        });
        let panel = await entry.default();
        if (panel && panel.title && panel.content) {
            window.MILLENNIUM_SIDEBAR_NAVIGATION_PANELS[pluginName] = panel;
        }
        if (typeof MILLENNIUM_BACKEND_IPC !== "undefined" && MILLENNIUM_BACKEND_IPC.postMessage) {
            MILLENNIUM_BACKEND_IPC.postMessage(1, { pluginName: pluginName });
        }
    } catch (err) {
        console.error("[SteamRoulette] ExecutePluginModule error:", err);
    }
}
ExecutePluginModule();
