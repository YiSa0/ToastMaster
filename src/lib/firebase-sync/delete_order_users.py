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

def delete_order_users():
    try:
        # 连接数据库
        conn = connect_db()
        cursor = conn.cursor()
        
        try:
            # 首先获取所有订单相关的用户ID
            cursor.execute("""
                SELECT DISTINCT userId 
                FROM Orders 
                WHERE userId LIKE '%@example.com'
            """)
            user_ids = [row.userId for row in cursor.fetchall()]
            
            if user_ids:
                print(f"找到 {len(user_ids)} 个订单相关用户")
                
                # 删除这些用户的订单项目
                cursor.execute("""
                    DELETE FROM OrderItems 
                    WHERE orderId IN (
                        SELECT id FROM Orders 
                        WHERE userId IN ({})
                    )
                """.format(','.join(['?'] * len(user_ids))), user_ids)
                print("已删除相关订单项目")
                
                # 删除这些用户的订单
                cursor.execute("""
                    DELETE FROM Orders 
                    WHERE userId IN ({})
                """.format(','.join(['?'] * len(user_ids))), user_ids)
                print("已删除相关订单")
                
                # 删除这些用户
                cursor.execute("""
                    DELETE FROM Users 
                    WHERE uid IN ({})
                """.format(','.join(['?'] * len(user_ids))), user_ids)
                print("已删除相关用户")
            else:
                print("没有找到需要删除的订单相关用户")
            
            # 提交更改
            conn.commit()
            print("所有订单相关用户数据已成功删除！")
            
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
    delete_order_users() 