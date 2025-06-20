import os
import pyodbc
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

# SQL Server 連線字串
conn = pyodbc.connect(
    f"DRIVER={{ODBC Driver 16 for SQL Server}};"
    f"SERVER={os.getenv('DB_SERVER')};"
    f"DATABASE={os.getenv('DB_NAME')};"
    f"UID={os.getenv('DB_USER')};"
    f"PWD={os.getenv('DB_PASSWORD')}"
)

cursor = conn.cursor()



cursor.close()
conn.close()
