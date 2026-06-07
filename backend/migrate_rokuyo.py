import psycopg2
from lunardate import LunarDate

conn = psycopg2.connect(dbname="shin_chan_tracker_db", user="koseiokabe")
cur = conn.cursor()

# get all anime
cur.execute("SELECT anime_id, anime_date FROM anime")
rows = cur.fetchall()

rokuyo_list = ["大安", "赤口", "先勝", "友引", "先負", "仏滅"]

for anime_id, anime_date in rows:
    lunar = LunarDate.fromSolarDate(anime_date.year, anime_date.month, anime_date.day)
    rokuyo = rokuyo_list[(lunar.month + lunar.day) % 6]
    cur.execute("UPDATE anime SET rokuyo = %s WHERE anime_id = %s", (rokuyo, anime_id))

conn.commit()
cur.close()
conn.close()
print("Done!")