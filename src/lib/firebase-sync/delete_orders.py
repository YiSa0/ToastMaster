import pyodbc

def connect_db():
    try:
        conn = pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=YUNNN\\SQLEXPRESS;'
            'DATABASE=project;'
            'UID=Ziyi;'
            'PWD=Zi2005yi;'
            'AUTOCOMMIT=OFF'
        )
        print("数据库连接成功！")
        return conn
    except Exception as e:
        print(f"数据库连接失败: {str(e)}")
        raise e

def delete_orders():
    try:
        # 连接数据库
        conn = connect_db()
        cursor = conn.cursor()
        
        try:
            # 首先删除 OrderItems 表中的数据（因为有外键约束）
            cursor.execute("DELETE FROM OrderItems")
            print("已删除 OrderItems 表中的所有数据")
            
            # 然后删除 Orders 表中的数据
            cursor.execute("DELETE FROM Orders")
            print("已删除 Orders 表中的所有数据")
            
            # 提交更改
            conn.commit()
            print("所有订单数据已成功删除！")
            
        except Exception as e:
            conn.rollback()
            print(f"删除数据时出错: {str(e)}")
            raise e
            
        finally:
            cursor.close()
            conn.close()
            
    except Exception as e:
        print(f"程序执行出错: {str(e)}")

if __name__ == "__main__":
    delete_orders() 