title @a subtitle §l§o§cＧＡＭＥ ＯＶＥＲ
title @a title §l§4時間切れ
scoreboard players reset @a number
scoreboard players reset @a teleport_r
scoreboard players reset @a teleport_point
execute as @a at @s run playsound random.explode @s ~ ~ ~ 0.5 0.5
tag @a remove NowGame
tag @a remove GameOver
tag @a remove spectator
clear @a
camera @a clear
gamemode a @a
scoreboard players set timer minutes 30
scoreboard players set timer seconds 0
fog @a remove fog1
tag @a[tag=InGame] add TeleportHub
tag @a remove InGame
gamerule dodaylightcycle false
time set 0
weather clear
tag @a[tag=spectator] add TeleportHub
function misson/ClearButtons
