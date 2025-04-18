title @s clear
title @s reset
title @s subtitle しました
title @s title ゲームを§g降参
gamemode a @s
tp @s 20 -59 179 90 0
fog @s remove fog1
clear @s
inputpermission set @s camera enabled
inputpermission set @s movement enabled
camera @s clear
kill @e[type=informant:timebar,r=1,c=1]
tellraw @a {"rawtext":[{"selector":"@s"},{"text":"§fはゲームを§g降参§fしました"}]}
execute as @s at @s run playsound random.fizz @s
