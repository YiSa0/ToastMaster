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

def delete_order_users():
    try:
        # 連接資料庫
        conn = connect_db()
        cursor = conn.cursor()
        try:
            # 首先取得所有訂單相關的使用者 ID
            cursor.execute("""
                SELECT DISTINCT userId 
                FROM Orders 
                WHERE userId LIKE ?
            """, ('%@example.com',))
            user_ids = [row.userId for row in cursor.fetchall()]
            if user_ids:
                print(f"找到 {len(user_ids)} 個訂單相關使用者")
                # 參數化 IN 查詢
                qmarks = ','.join(['?'] * len(user_ids))
                # 刪除這些使用者的訂單項目
                cursor.execute(f"""
                    DELETE FROM OrderItems 
                    WHERE orderId IN (
                        SELECT id FROM Orders 
                        WHERE userId IN ({qmarks})
                    )
                """, user_ids)
                print("已刪除相關訂單項目")
                # 刪除這些使用者的訂單
                cursor.execute(f"""
                    DELETE FROM Orders 
                    WHERE userId IN ({qmarks})
                """, user_ids)
                print("已刪除相關訂單")
                # 刪除這些使用者
                cursor.execute(f"""
                    DELETE FROM Users 
                    WHERE uid IN ({qmarks})
                """, user_ids)
                print("已刪除相關使用者")
            else:
                print("沒有找到需要刪除的訂單相關使用者")
            # 提交變更
            conn.commit()
            print("所有訂單相關使用者資料已成功刪除！")
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
    delete_order_users()
