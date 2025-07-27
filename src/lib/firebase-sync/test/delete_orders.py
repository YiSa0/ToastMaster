import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()

def connect_db():
    try:
        conn = pyodbc.connect(
            f"DRIVER={{SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER')};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')};"
            "AUTOCOMMIT=OFF"
        )
        print("資料庫連線成功！")
        return conn
    except Exception as e:
        print(f"資料庫連線失敗: {str(e)}")
        raise e

def delete_orders():
    try:
        # 連接資料庫
        conn = connect_db()
        cursor = conn.cursor()
        
        try:
            # 首先刪除 OrderItems 資料表中的資料（因為有外鍵約束）
            cursor.execute("DELETE FROM OrderItems")
            print("已刪除 OrderItems 資料表中的所有資料")
            
            # 然後刪除 Orders 資料表中的資料
            cursor.execute("DELETE FROM Orders")
            print("已刪除 Orders 資料表中的所有資料")
            
            # 提交變更
            conn.commit()
            print("所有訂單資料已成功刪除！")
            
        except Exception as e:
            conn.rollback()
            print(f"刪除資料時發生錯誤: {str(e)}")
            raise e
            
        finally:
            cursor.close()
            conn.close()
            
    except Exception as e:
        print(f"程式執行錯誤: {str(e)}")

if __name__ == "__main__":
    delete_orders()
