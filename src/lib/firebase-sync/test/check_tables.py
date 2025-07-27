import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()

def check_tables():
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
        
        # 檢查資料表結構
        print("\n檢查資料表結構：")
        
        # 檢查 Orders 資料表
        print("\nOrders 資料表結構：")
        cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Orders'
            ORDER BY ORDINAL_POSITION
        """)
        for row in cursor.fetchall():
            print(f"欄位名稱: {row.COLUMN_NAME}")
            print(f"資料型別: {row.DATA_TYPE}")
            print(f"最大長度: {row.CHARACTER_MAXIMUM_LENGTH}")
            print(f"允許空值: {row.IS_NULLABLE}")
            print("---")
            
        # 檢查 OrderItems 資料表
        print("\nOrderItems 資料表結構：")
        cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'OrderItems'
            ORDER BY ORDINAL_POSITION
        """)
        for row in cursor.fetchall():
            print(f"欄位名稱: {row.COLUMN_NAME}")
            print(f"資料型別: {row.DATA_TYPE}")
            print(f"最大長度: {row.CHARACTER_MAXIMUM_LENGTH}")
            print(f"允許空值: {row.IS_NULLABLE}")
            print("---")
            
        # 檢查 Users 資料表
        print("\nUsers 資料表結構：")
        cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Users'
            ORDER BY ORDINAL_POSITION
        """)
        for row in cursor.fetchall():
            print(f"欄位名稱: {row.COLUMN_NAME}")
            print(f"資料型別: {row.DATA_TYPE}")
            print(f"最大長度: {row.CHARACTER_MAXIMUM_LENGTH}")
            print(f"允許空值: {row.IS_NULLABLE}")
            print("---")
            
        # 檢查外鍵約束
        print("\n外鍵約束：")
        cursor.execute("""
            SELECT 
                OBJECT_NAME(f.parent_object_id) AS TableName,
                COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
                OBJECT_NAME(f.referenced_object_id) AS ReferencedTableName,
                COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferencedColumnName
            FROM sys.foreign_keys AS f
            INNER JOIN sys.foreign_key_columns AS fc
                ON f.object_id = fc.constraint_object_id
        """)
        for row in cursor.fetchall():
            print(f"資料表: {row.TableName}")
            print(f"欄位: {row.ColumnName}")
            print(f"參考資料表: {row.ReferencedTableName}")
            print(f"參考欄位: {row.ReferencedColumnName}")
            print("---")
            
    except Exception as e:
        print(f"發生錯誤: {str(e)}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    check_tables()
