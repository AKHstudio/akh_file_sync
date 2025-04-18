title @a reset
title @a clear
clearspawnpoint @a
setworldspawn 20 -55 179
scoreboard players reset @a number
scoreboard players reset @a teleport_r
scoreboard players reset @a teleport_point
execute as @a at @s if block ~ ~-3 ~ informant:spectator run tag @s add spectator
execute as @a at @s if block ~ ~-4 ~ informant:spectator run tag @s add spectator
execute as @a at @s if block ~ ~-3 ~ informant:spectator run gamemode spectator @s
execute as @a at @s if block ~ ~-4 ~ informant:spectator run gamemode spectator @s
execute as @a at @s if block ~ ~-3 ~ informant:spectator run tag @s add InGame
execute as @a at @s if block ~ ~-4 ~ informant:spectator run tag @s add InGame
execute as @a at @s if block ~ ~-3 ~ informant:start run tag @s add InGame
execute as @a at @s if block ~ ~-4 ~ informant:start run tag @s add InGame
execute as @a at @s if block ~ ~-3 ~ honey_block run tag @s add InGame
execute as @a at @s if block ~ ~-4 ~ honey_block run tag @s add InGame
execute as @a at @s if block ~ ~-3 ~ diamond_ore run tag @s add InGame
execute as @a at @s if block ~ ~-4 ~ diamond_ore run tag @s add InGame
execute as @a at @s if block ~ ~-3 ~ fletching_table run tag @s add InGame
execute as @a at @s if block ~ ~-4 ~ fletching_table run tag @s add InGame
execute as @a at @s if block ~ ~-3 ~ dried_kelp_block run tag @s add InGame
execute as @a at @s if block ~ ~-4 ~ dried_kelp_block run tag @s add InGame
execute as @a at @s if block ~ ~-3 ~ honey_block if block ~ ~-1 ~ red_concrete run tag @s add red_team
execute as @a at @s if block ~ ~-4 ~ honey_block if block ~ ~-2 ~ red_concrete run tag @s add red_team
execute as @a at @s if block ~ ~-3 ~ honey_block if block ~ ~-1 ~ blue_concrete run tag @s add blue_team
execute as @a at @s if block ~ ~-4 ~ honey_block if block ~ ~-2 ~ blue_concrete run tag @s add blue_team
execute as @a at @s if block ~ ~-3 ~ dried_kelp_block if block ~ ~-1 ~ red_concrete run tag @s add red_team
execute as @a at @s if block ~ ~-4 ~ dried_kelp_block if block ~ ~-2 ~ red_concrete run tag @s add red_team
execute as @a at @s if block ~ ~-3 ~ dried_kelp_block if block ~ ~-1 ~ blue_concrete run tag @s add blue_team
execute as @a at @s if block ~ ~-4 ~ dried_kelp_block if block ~ ~-2 ~ blue_concrete run tag @s add blue_team
execute as @a at @s if block ~ ~-3 ~ dried_kelp_block if block ~ ~-1 ~ green_concrete run tag @s add green_team
execute as @a at @s if block ~ ~-4 ~ dried_kelp_block if block ~ ~-2 ~ green_concrete run tag @s add green_team
execute as @a at @s if block ~ ~-3 ~ dried_kelp_block if block ~ ~-1 ~ yellow_concrete run tag @s add yellow_team
execute as @a at @s if block ~ ~-4 ~ dried_kelp_block if block ~ ~-2 ~ yellow_concrete run tag @s add yellow_team
scoreboard players random @a design 1 3
scoreboard players random player1 teleport_r 1 10000000
scoreboard players random player2 teleport_r 1 10000000
scoreboard players random player3 teleport_r 1 10000000
scoreboard players random player4 teleport_r 1 10000000
scoreboard players random player5 teleport_r 1 10000000
scoreboard players random player6 teleport_r 1 10000000
scoreboard players random player7 teleport_r 1 10000000
scoreboard players random player8 teleport_r 1 10000000
scoreboard players random player9 teleport_r 1 10000000
scoreboard players random player10 teleport_r 1 10000000
scoreboard players random player11 teleport_r 1 10000000
scoreboard players random player12 teleport_r 1 10000000
scoreboard players random player13 teleport_r 1 10000000
scoreboard players random player14 teleport_r 1 10000000
scoreboard players random player15 teleport_r 1 10000000
scoreboard players set player1 teleport_point 1
scoreboard players set player2 teleport_point 1
scoreboard players set player3 teleport_point 1
scoreboard players set player4 teleport_point 1
scoreboard players set player5 teleport_point 1
scoreboard players set player6 teleport_point 1
scoreboard players set player7 teleport_point 1
scoreboard players set player8 teleport_point 1
scoreboard players set player9 teleport_point 1
scoreboard players set player10 teleport_point 1
scoreboard players set player11 teleport_point 1
scoreboard players set player12 teleport_point 1
scoreboard players set player13 teleport_point 1
scoreboard players set player14 teleport_point 1
scoreboard players set player15 teleport_point 1
scoreboard players random team2 teleport_point 1 4
scoreboard players random team2_2 teleport_point 1 2
scoreboard players random team4 teleport_point 1 3
scoreboard players random team4_4 teleport_point 1 24
effect @a instant_health 1 255 true
time set 0
gamerule dodaylightcycle true
setblock -16 -54 179 air
execute if score gamemode config matches 21 if score random2team joincount matches 1..2 run tag @r[tag=random2join,c=1] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 3..4 run tag @r[tag=random2join,c=2] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 5..6 run tag @r[tag=random2join,c=3] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 7..8 run tag @r[tag=random2join,c=4] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 9..10 run tag @r[tag=random2join,c=5] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 11..12 run tag @r[tag=random2join,c=6] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 13..14 run tag @r[tag=random2join,c=7] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 15..16 run tag @r[tag=random2join,c=8] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 17..18 run tag @r[tag=random2join,c=9] add red_team
execute if score gamemode config matches 21 if score random2team joincount matches 19..20 run tag @r[tag=random2join,c=10] add red_team
execute if score gamemode config matches 21 run tag @a[tag=random2join,tag=!red_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 20 run tag @r[tag=random4join,c=5] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 20 run tag @r[tag=random4join,c=5,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 20 run tag @r[tag=random4join,c=5,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 19 run tag @r[tag=random4join,c=5] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 19 run tag @r[tag=random4join,c=5,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 19 run tag @r[tag=random4join,c=4,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 18 run tag @r[tag=random4join,c=5] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 18 run tag @r[tag=random4join,c=4,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 18 run tag @r[tag=random4join,c=4,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 17 run tag @r[tag=random4join,c=4] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 17 run tag @r[tag=random4join,c=4,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 17 run tag @r[tag=random4join,c=4,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 16 run tag @r[tag=random4join,c=4] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 16 run tag @r[tag=random4join,c=4,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 16 run tag @r[tag=random4join,c=4,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 15 run tag @r[tag=random4join,c=4] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 15 run tag @r[tag=random4join,c=4,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 15 run tag @r[tag=random4join,c=3,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 14 run tag @r[tag=random4join,c=4] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 14 run tag @r[tag=random4join,c=3,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 14 run tag @r[tag=random4join,c=3,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 13 run tag @r[tag=random4join,c=3] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 13 run tag @r[tag=random4join,c=3,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 13 run tag @r[tag=random4join,c=3,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 12 run tag @r[tag=random4join,c=3] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 12 run tag @r[tag=random4join,c=3,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 12 run tag @r[tag=random4join,c=3,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 11 run tag @r[tag=random4join,c=3] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 11 run tag @r[tag=random4join,c=3,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 11 run tag @r[tag=random4join,c=2,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 10 run tag @r[tag=random4join,c=3] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 10 run tag @r[tag=random4join,c=2,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 10 run tag @r[tag=random4join,c=2,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 9 run tag @r[tag=random4join,c=2] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 9 run tag @r[tag=random4join,c=2,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 9 run tag @r[tag=random4join,c=2,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 8 run tag @r[tag=random4join,c=2] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 8 run tag @r[tag=random4join,c=2,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 8 run tag @r[tag=random4join,c=2,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 7 run tag @r[tag=random4join,c=2] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 7 run tag @r[tag=random4join,c=2,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 7 run tag @r[tag=random4join,c=1,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 6 run tag @r[tag=random4join,c=2] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 6 run tag @r[tag=random4join,c=1,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 6 run tag @r[tag=random4join,c=1,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 5 run tag @r[tag=random4join,c=1] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 5 run tag @r[tag=random4join,c=1,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 5 run tag @r[tag=random4join,c=1,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 4 run tag @r[tag=random4join,c=1] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 4 run tag @r[tag=random4join,c=1,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 4 run tag @r[tag=random4join,c=1,tag=!red_team,tag=!yellow_team] add blue_team
execute if score gamemode config matches 41 if score random4team joincount matches 3 run tag @r[tag=random4join,c=1] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 3 run tag @r[tag=random4join,c=1,tag=!red_team] add yellow_team
execute if score gamemode config matches 41 if score random4team joincount matches 2 run tag @r[tag=random4join,c=1] add red_team
execute if score gamemode config matches 41 if score random4team joincount matches 2..20 run tag @a[tag=random4join,tag=!red_team,tag=!yellow_team,tag=!blue_team] add green_team
function start2