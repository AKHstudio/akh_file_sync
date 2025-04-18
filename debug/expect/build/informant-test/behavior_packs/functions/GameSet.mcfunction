execute if score gamemode config matches 1 run title @a subtitle §l§o§cＹＯＵ ＬＯＳＥ
execute if score gamemode config matches 20..41 run title @a subtitle §l§o§cＹＯＵ ＬＯＳＥ
execute if score gamemode config matches 1 run title @a[tag=InGame,tag=!GameOver,tag=!spectator] subtitle §l§o§aＹＯＵ ＷＩＮ
execute if score gamemode config matches 20..41 run title @a[tag=InGame,tag=winner] subtitle §l§o§aＹＯＵ ＷＩＮ
scoreboard players reset @a number
scoreboard players reset @a teleport_r
scoreboard players reset @a teleport_point
execute if score gamemode config matches 1 run titleraw @a title {"rawtext":[{"text":"§2§l"},{"selector":"@a[tag=InGame,tag=!GameOver,tag=!spectator]"},{"text":"の勝利"}]}
execute if score gamemode config matches 20..41 if entity @a[tag=winner,tag=blue_team] run title @a title §l§1青チームの勝利
execute if score gamemode config matches 20..41 if entity @a[tag=winner,tag=red_team] run title @a title §l§4赤チームの勝利
execute if score gamemode config matches 20..41 if entity @a[tag=winner,tag=green_team] run title @a title §l§2緑チームの勝利
execute if score gamemode config matches 20..41 if entity @a[tag=winner,tag=yellow_team] run title @a title §l§g黄チームの勝利
execute as @a[tag=InGame,tag=!GameOver,tag=!spectator] at @s run playsound random.levelup @s ~ ~ ~ 1 0.5
execute as @a[tag=InGame,tag=GameOver] at @s run playsound mob.villager.no @s ~ ~ ~
execute as @a[tag=InGame,tag=!GameOver,tag=spectator] at @s run playsound random.fizz @s ~ ~ ~
tag @a remove NowGame
tag @a remove GameOver
tag @a remove spectator
clear @a[tag=InGame]
camera @a clear
gamemode a @a[tag=InGame]
scoreboard players set timer minutes 30
fog @a remove fog1
scoreboard players set timer seconds 0
tag @a[tag=InGame] add TeleportHub
tag @a remove InGame
gamerule dodaylightcycle false
time set 0
weather clear
tag @a[tag=spectator] add TeleportHub
function misson/ClearButtons
function resetbeacon1
function resetbeacon2