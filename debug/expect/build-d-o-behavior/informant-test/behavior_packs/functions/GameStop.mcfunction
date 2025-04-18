tag @a remove NowGame
replaceitem entity @a[tag=InGame,tag=!GameOver,tag=!spectator,scores={design=1}] slot.armor.chest 0 informant:akisan_armor 1 0 {"item_lock":{"mode": "lock_in_slot"}}
replaceitem entity @a[tag=InGame,tag=!GameOver,tag=!spectator,scores={design=2}] slot.armor.chest 0 informant:takodayo_armor 1 0 {"item_lock":{"mode": "lock_in_slot"}}
replaceitem entity @a[tag=InGame,tag=!GameOver,tag=!spectator,scores={design=3}] slot.armor.chest 0 informant:harupon_armor 1 0 {"item_lock":{"mode": "lock_in_slot"}}
inputpermission set @a[tag=InGame] camera disabled
inputpermission set @a[tag=InGame] movement disabled
gamerule dodaylightcycle false
effect @a[tag=InGame,tag=!GameOver,tag=!spectator] instant_health 100000 255 true
effect @e[type=informant:snail] slowness 10000 255 true
effect @e[type=informant:snail] weakness 10000 255 true