import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    try:
        # 連接資料庫
        conn = pyodbc.connect(
            f"DRIVER={{SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER')};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')}"
        )
        print("資料庫連線成功！")
        
        cursor = conn.cursor()
        
        # 測試查詢
        print("\n測試查詢結果：")
        
        # 1. 查看當前資料庫
        cursor.execute("SELECT DB_NAME() as CurrentDatabase")
        print(f"當前資料庫: {cursor.fetchone().CurrentDatabase}")
        
        # 2. 查看當前使用者
        cursor.execute("SELECT SYSTEM_USER as CurrentUser")
        print(f"當前使用者: {cursor.fetchone().CurrentUser}")
        
        # 3. 查看伺服器名稱
        cursor.execute("SELECT @@SERVERNAME as ServerName")
        print(f"伺服器名稱: {cursor.fetchone().ServerName}")
        
        # 4. 查看 Orders 表資料
        print("\nOrders 表資料：")
        cursor.execute("SELECT * FROM Orders")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"訂單 ID: {row.id}")  
                print(f"使用者 ID: {row.userId}")
                print(f"總金額: {row.totalAmount}")
                print(f"建立時間: {row.createdAt}")
                print(f"狀態: {row.status}")    
                print("---")
        else:
            print("Orders 表中沒有資料")
            
        # 查看 OrderItems 表資料
        print("\nOrderItems 表資料：")
        cursor.execute("SELECT * FROM OrderItems")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"項目 ID: {row.id}")
                print(f"訂單 ID: {row.orderId}")
                print(f"項目名稱: {row.itemName}")
                print(f"數量: {row.quantity}")
                print(f"價格: {row.price}")
                print("---")
        else:
            print("OrderItems 表中沒有資料")
            
        # 查看 Users 表資料
        print("\nUsers 表資料：")
        cursor.execute("SELECT * FROM Users")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"使用者 ID: {row.uid}")
                print(f"電子郵件: {row.email}")
                print(f"顯示名稱: {row.displayName}")
                print(f"建立時間: {row.createdAt}")
                print("---")
        else:
            print("Users 表中沒有資料")

        # 查看 MenuItems 表資料
        print("\nMenuItems 表資料：")
        cursor.execute("SELECT * FROM MenuItems")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"項目 ID: {row.id}")
                print(f"名稱: {row.name}")
                print(f"描述: {row.description}")
                print(f"價格: {row.price}")
                print(f"圖片: {row.image}")
                print(f"類別: {row.category}")
                print(f"AI 提示: {row.dataAiHint}")
                print("---")
        else:
            print("MenuItems 表中沒有資料")
            
    except Exception as e:
        print(f"發生錯誤: {str(e)}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    test_connection()
