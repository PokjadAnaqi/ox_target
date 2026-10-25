from pathlib import Path
from lupa.lua54 import LuaRuntime
root=Path(__file__).resolve().parents[1]
if not (root/'fxmanifest.lua').exists(): root=root/'ox_target_review/ox_target'
source=(root/'client/main.lua').read_text()
# Only Cfx syntax extensions already present in the supplied original are lowered.
source=source.replace('totalOptions += optionCount','totalOptions = totalOptions + optionCount').replace('hidden += 1','hidden = hidden + 1')
source=source.replace('options.__global[1]?.name','(options.__global[1] or {}).name').replace('zone?.id','(zone or {}).id').replace('option?.openMenu','(option or {}).openMenu')
lua=LuaRuntime()
lua.execute('''
 callbacks={};threads={};messages={};keys={};ticks=1000;hits=0;allowed=true;playerX=0;foreignFocus=false;focusWrites=0
 local mt={};mt.__sub=function(a,b) return vec3(a.x-b.x,a.y-b.y,a.z-b.z) end;mt.__len=function(a) return math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z) end
 function vec3(x,y,z) return setmetatable({x=x,y=y,z=z},mt) end
 cache={ped=1,playerId=1};LocalPlayer={state={}}
 state={active=false,focus=false,disabled=false}
 function state.isActive() return state.active end
 function state.setActive(v) state.active=v end
 function state.isDisabled() return state.disabled end
 function state.isNuiFocused() return state.focus end
 function state.setNuiFocus(v) focusWrites=focusWrites+1;state.focus=v end
 opts=setmetatable({__global={},global={{label='Use',name='use',groups='police',onSelect=function(data) hits=hits+1 end}}},{__index={size=1,set=function() end,wipe=function() end}})
 utils={getNearbyZones=function() return {},false end,hasPlayerGotGroup=function() return allowed end,hasPlayerGotItems=function() return allowed end}
 function require(name) if name=='client.state' then return state elseif name=='client.api' then return {getTargetOptions=function() return opts end} else return utils end end
 debugMode=0
 function GetConvarInt(name,v) if name=='ox_target:debug' then return debugMode end;return v end;function GetConvar(_,v) return v end
 function GetResourceState() return 'missing' end
 function IsPauseMenuActive() return false end;function IsEntityDead() return false end
 function IsNuiFocused() return state.focus or foreignFocus end
 function GetEntityCoords() return vec3(playerX,0,0) end
 function GetEntityType() return 2 end;function GetEntityModel() return 42 end
 function DoesEntityExist() return true end;function GetGameTimer() return ticks end
 function RegisterNUICallback(name,fn) callbacks[name]=fn end
 function CreateThread(fn) threads[#threads+1]=fn end
 function SendNuiMessage(v) messages[#messages+1]=v end
 function Wait() error('test yield') end
 function locale(key) return key end
 lib={checkDependency=function() return true end,locale=function() end,progressActive=function() return false end,addKeybind=function(k) keys[#keys+1]=k end,raycast={fromCamera=function() return true,2,vec3(1,0,0) end}}
 json={encode=function() return '{}' end};table.wipe=function(t) for k in pairs(t) do t[k]=nil end end;table.clone=function(t) local out={};for k,v in pairs(t) do out[k]=v end;return out end
''')
lua.execute(source)
lua.execute('''
 assert(keys[1].defaultKey=='E' and keys[1].name=='ox_target_interact')
 local ok,err=pcall(threads[1]);assert(not ok and tostring(err):find('test yield'),err)
 assert(state.active)
 keys[1].onPressed();assert(hits==0 and state.focus)
 callbacks.select({'global',1},function() end);assert(hits==1 and not state.focus)
 keys[1].onPressed();callbacks.select({'global',1},function() end);assert(hits==1)
 ticks=2000;allowed=false;callbacks.select({'global',1},function() end);assert(hits==1)
 allowed=true;playerX=30;callbacks.select({'global',1},function() end);assert(hits==1)
 playerX=0;opts.global[1].hide=false
 callbacks.select({'global',-1},function() end);assert(hits==1)
 callbacks.select({'invalid',1},function() end);assert(hits==1)
 callbacks.interactionClose({},function() end)
 opts.global[2]={label='Other',onSelect=function() end};ticks=3000
 keys[1].onPressed();assert(state.focus and hits==1)
 callbacks.interactionClose({},function() end);assert(not state.focus)
 local writes=focusWrites
 foreignFocus=true;state.active=false
 pcall(threads[1]);assert(focusWrites==writes)
''')
lua.execute('debugMode=1;keys={};threads={};state.active=false;foreignFocus=false')
lua.execute(source)
lua.execute("assert(keys[1].defaultKey=='LMENU' and keys[1].name=='ox_target_debug' and type(keys[1].onReleased)=='function');pcall(threads[1]);assert(not state.active)")
print('Debug 0 E-only prompt/open/select, debug 1 Alt-only, cooldown, gates/distance, malformed selection and foreign focus PASS')
