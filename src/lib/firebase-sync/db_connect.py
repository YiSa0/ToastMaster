import pyodbc
import pandas as pd

# SQL Server 連線字串
conn = pyodbc.connect(
    'DRIVER={ODBC Driver 16 for SQL Server};'
    'SERVER=YUNNN\\SQLEXPRESS;'  # 使用您的 SQL Server 实例名称
    'DATABASE=project;'
    'UID=Ziyi;'
    'PWD=Zi2005yi'
)

cursor = conn.cursor()



cursor.close()
conn.close()
