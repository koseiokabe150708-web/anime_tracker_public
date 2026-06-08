from lunardate import LunarDate

lunar = LunarDate.fromSolarDate(2026, 6, 1)

rokuyo_list = ["大安", "赤口", "先勝", "友引", "先負", "仏滅"]
rokuyo = rokuyo_list[(lunar.month + lunar.day) % 6]

print(lunar.month, lunar.day)
print(rokuyo)