import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()

def test_connection():
    try:
        # 连接数据库
        conn = pyodbc.connect(
            f"DRIVER={{SQL Server}};"
            f"SERVER={os.getenv('DB_SERVER')};"
            f"DATABASE={os.getenv('DB_NAME')};"
            f"UID={os.getenv('DB_USER')};"
            f"PWD={os.getenv('DB_PASSWORD')}"
        )
        print("数据库连接成功！")
        
        cursor = conn.cursor()
        
        # 测试查询
        print("\n测试查询结果：")
        
        # 1. 查看当前数据库
        cursor.execute("SELECT DB_NAME() as CurrentDatabase")
        print(f"当前数据库: {cursor.fetchone().CurrentDatabase}")
        
        # 2. 查看当前用户
        cursor.execute("SELECT SYSTEM_USER as CurrentUser")
        print(f"当前用户: {cursor.fetchone().CurrentUser}")
        
        # 3. 查看服务器名称
        cursor.execute("SELECT @@SERVERNAME as ServerName")
        print(f"服务器名称: {cursor.fetchone().ServerName}")
        
        # 4. 查看表数据
        print("\nOrders 表数据：")
        cursor.execute("SELECT * FROM Orders")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"订单ID: {row.id}")
                print(f"用户ID: {row.userId}")
                print(f"总金额: {row.totalAmount}")
                print(f"创建时间: {row.createdAt}")
                print(f"状态: {row.status}")
                print("---")
        else:
            print("Orders 表中没有数据")
            
        print("\nOrderItems 表数据：")
        cursor.execute("SELECT * FROM OrderItems")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"项目ID: {row.id}")
                print(f"订单ID: {row.orderId}")
                print(f"项目名称: {row.itemName}")
                print(f"数量: {row.quantity}")
                print(f"价格: {row.price}")
                print("---")
        else:
            print("OrderItems 表中没有数据")
            
        print("\nUsers 表数据：")
        cursor.execute("SELECT * FROM Users")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"用户ID: {row.uid}")
                print(f"邮箱: {row.email}")
                print(f"显示名称: {row.displayName}")
                print(f"创建时间: {row.createdAt}")
                print("---")
        else:
            print("Users 表中没有数据")

        print("\nMenuItems 表数据：")
        cursor.execute("SELECT * FROM MenuItems")
        rows = cursor.fetchall()
        if rows:
            for row in rows:
                print(f"项目ID: {row.id}")
                print(f"名称: {row.name}")
                print(f"描述: {row.description}")
                print(f"价格: {row.price}")
                print(f"图片: {row.image}")
                print(f"类别: {row.category}")
                print(f"AI提示: {row.dataAiHint}")
                print("---")
        else:
            print("MenuItems 表中没有数据")
            
    except Exception as e:
        print(f"发生错误: {str(e)}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    test_connection() 