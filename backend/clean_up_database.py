import sqlite3
import datetime

connection = sqlite3.connect('database.db')
connection.row_factory = sqlite3.Row
cursor = connection.cursor()

current_day = datetime.date.isoformat(datetime.datetime.now())
print('Today: ', current_day)

with connection:
    cursor.execute("""
        DELETE FROM Sessions WHERE Date_created < :day;
    """, {'day':current_day})