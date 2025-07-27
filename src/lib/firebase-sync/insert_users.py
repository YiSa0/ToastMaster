import os
import json
import pyodbc
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# 讀取 JSON 檔案
def read_users_json():
    with open('src/lib/firebase-sync/users_merged.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# 資料庫連線
def get_db_connection():
    return pyodbc.connect(
        f"DRIVER={{SQL Server}};"
        f"SERVER={os.getenv('DB_SERVER')};"
        f"DATABASE={os.getenv('DB_NAME')};"
        f"UID={os.getenv('DB_USER')};"
        f"PWD={os.getenv('DB_PASSWORD')};"
        "AUTOCOMMIT=OFF"
    )

def format_datetime(dt_str):
    if not dt_str:
        return None
    try:
        # 移除時區資訊並解析日期時間
        dt_str = dt_str.split('+')[0] if '+' in dt_str else dt_str
        dt = datetime.fromisoformat(dt_str)
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return None

def format_date(date_str):
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').strftime('%Y-%m-%d')
    except:
        return None

def check_user_exists(cursor, uid):
    cursor.execute("SELECT COUNT(*) FROM Users WHERE uid = ?", (uid,))
    return cursor.fetchone()[0] > 0

def insert_users_data():
    try:
        # 讀取使用者資料
        users_data = read_users_json()
        
        # 建立資料庫連線
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for user in users_data:
            # 檢查使用者是否已存在
            if check_user_exists(cursor, user['uid']):
                print(f"使用者 {user['uid']} 已存在，跳過插入")
                continue
                
            # 格式化日期時間
            created_at = format_datetime(user.get('createdAt'))
            updated_at = format_datetime(user.get('updatedAt'))
            birthday = format_date(user.get('birthday'))
            
            # 插入 Users 資料表
            cursor.execute("""
                INSERT INTO Users (uid, email, displayName, createdAt)
                VALUES (?, ?, ?, ?)
            """, (
                user['uid'],
                user.get('email'),
                user.get('displayName'),
                created_at
            ))
            
            # 插入 UserProfiles 資料表
            cursor.execute("""
                INSERT INTO UserProfiles (uid, displayName, phoneNumber, birthday, gender, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                user['uid'],
                user.get('displayName'),
                user.get('phoneNumber'),
                birthday,
                user.get('gender'),
                updated_at
            ))
            
            print(f"成功插入使用者: {user['uid']}")
        
        # 提交交易
        conn.commit()
        print("所有資料插入成功！")
        
    except Exception as e:
        print(f"發生錯誤: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    insert_users_data()
