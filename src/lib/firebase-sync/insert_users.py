import json
import pyodbc
from datetime import datetime

# 读取JSON文件
def read_users_json():
    with open('src/lib/firebase-sync/users_merged.json', 'r', encoding='utf-8') as file:
        return json.load(file)

# 数据库连接
def get_db_connection():
    return pyodbc.connect(
        'DRIVER={SQL Server};'
        'SERVER=YUNNN\\SQLEXPRESS;'
        'DATABASE=project;'
        'UID=Ziyi;'
        'PWD=Zi2005yi;'
        'AUTOCOMMIT=OFF'
    )

def format_datetime(dt_str):
    if not dt_str:
        return None
    try:
        # 移除时区信息并解析日期时间
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
        # 读取用户数据
        users_data = read_users_json()
        
        # 建立数据库连接
        conn = get_db_connection()
        cursor = conn.cursor()
        
        for user in users_data:
            # 检查用户是否已存在
            if check_user_exists(cursor, user['uid']):
                print(f"用户 {user['uid']} 已存在，跳过插入")
                continue
                
            # 格式化日期时间
            created_at = format_datetime(user.get('createdAt'))
            updated_at = format_datetime(user.get('updatedAt'))
            birthday = format_date(user.get('birthday'))
            
            # 插入 Users 表
            cursor.execute("""
                INSERT INTO Users (uid, email, displayName, createdAt)
                VALUES (?, ?, ?, ?)
            """, (
                user['uid'],
                user.get('email'),
                user.get('displayName'),
                created_at
            ))
            
            # 插入 UserProfiles 表
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
            
            print(f"成功插入用户: {user['uid']}")
        
        # 提交事务
        conn.commit()
        print("所有数据插入成功！")
        
    except Exception as e:
        print(f"发生错误: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    insert_users_data() 