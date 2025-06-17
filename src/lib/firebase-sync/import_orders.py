import json
import pyodbc
from datetime import datetime

# 读取 order.json 文件
def read_order_json():
    try:
        with open('src/lib/firebase-sync/order.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"成功读取 order.json，包含 {len(data)} 个订单")
            return data
    except Exception as e:
        print(f"读取 order.json 失败: {str(e)}")
        raise e

# 连接数据库
def connect_db():
    try:
        conn = pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=YUNNN\\SQLEXPRESS;'
            'DATABASE=project;'
            'UID=Ziyi;'
            'PWD=Zi2005yi;'
            'AUTOCOMMIT=OFF'  # 禁用自动提交
        )
        print("数据库连接成功！")
        return conn
    except Exception as e:
        print(f"数据库连接失败: {str(e)}")
        raise e

# 验证数据是否成功插入
def verify_data(cursor):
    print("\n验证数据插入结果：")
    
    # 验证订单
    cursor.execute("SELECT COUNT(*) as count FROM Orders")
    order_count = cursor.fetchone().count
    print(f"Orders 表中的记录数: {order_count}")
    
    # 验证订单项目
    cursor.execute("SELECT COUNT(*) as count FROM OrderItems")
    item_count = cursor.fetchone().count
    print(f"OrderItems 表中的记录数: {item_count}")
    
    # 验证用户
    cursor.execute("SELECT COUNT(*) as count FROM Users")
    user_count = cursor.fetchone().count
    print(f"Users 表中的记录数: {user_count}")
    
    # 显示最近的订单
    print("\n最近的订单：")
    cursor.execute("""
        SELECT TOP 5 o.id, o.userId, o.totalAmount, o.createdAt, o.status,
               COUNT(oi.id) as item_count
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.id = oi.orderId
        GROUP BY o.id, o.userId, o.totalAmount, o.createdAt, o.status
        ORDER BY o.createdAt DESC
    """)
    for row in cursor.fetchall():
        print(f"订单ID: {row.id}")
        print(f"用户ID: {row.userId}")
        print(f"总金额: {row.totalAmount}")
        print(f"创建时间: {row.createdAt}")
        print(f"状态: {row.status}")
        print(f"项目数量: {row.item_count}")
        print("---")

# 检查用户是否存在，如果不存在则创建
def ensure_user_exists(cursor, user_id):
    try:
        # 检查用户是否存在
        cursor.execute("SELECT COUNT(*) FROM Users WHERE uid = ?", (user_id,))
        if cursor.fetchone()[0] == 0:
            # 如果用户不存在，创建一个新用户
            cursor.execute("""
                INSERT INTO Users (uid, email, displayName, createdAt)
                VALUES (?, ?, ?, ?)
            """, (
                user_id,
                f"{user_id}@example.com",  # 临时邮箱
                f"User_{user_id[:8]}",     # 临时用户名
                datetime.now()             # 当前时间
            ))
            print(f"创建新用户: {user_id}")
    except Exception as e:
        print(f"创建用户失败: {str(e)}")
        raise e

# 插入订单数据
def insert_order(cursor, order):
    try:
        # 确保用户存在
        ensure_user_exists(cursor, order['userId'])
        
        # 转换日期时间格式
        created_at = datetime.fromisoformat(order['createdAt'].replace('Z', '+00:00'))
        
        # 插入 Orders 表
        cursor.execute("""
            INSERT INTO Orders (id, userId, totalAmount, createdAt, status, note)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            order['id'],
            order['userId'],
            order['totalPrice'],
            created_at,
            order['status'],
            order.get('specialRequests', '')
        ))
        print(f"插入订单: {order['id']}")
    except Exception as e:
        print(f"插入订单失败: {str(e)}")
        raise e

# 插入订单项目数据
def insert_order_items(cursor, order):
    try:
        for item in order['items']:
            cursor.execute("""
                INSERT INTO OrderItems (
                    orderId, itemType, itemId, itemName, 
                    quantity, price, subTotal
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                order['id'],
                item['type'],
                item['id'],
                item['name'],
                item['quantity'],
                item['itemPrice'],
                item['itemPrice'] * item['quantity']
            ))
            print(f"插入订单项目: {item['name']} (订单ID: {order['id']})")
    except Exception as e:
        print(f"插入订单项目失败: {str(e)}")
        raise e

def main():
    try:
        # 读取订单数据
        orders = read_order_json()
        
        # 连接数据库
        conn = connect_db()
        cursor = conn.cursor()
        
        try:
            # 首先创建所有用户
            print("\n创建用户...")
            for order in orders:
                ensure_user_exists(cursor, order['userId'])
            
            # 然后处理每个订单
            print("\n处理订单...")
            for order in orders:
                print(f"\n开始处理订单: {order['id']}")
                try:
                    # 插入订单
                    insert_order(cursor, order)
                    # 插入订单项目
                    insert_order_items(cursor, order)
                    print(f"订单 {order['id']} 导入成功")
                except Exception as e:
                    print(f"订单 {order['id']} 导入失败: {str(e)}")
                    raise e
            
            # 提交所有更改
            conn.commit()
            print("\n所有数据导入完成！")
            
            # 验证数据
            verify_data(cursor)
            
        except Exception as e:
            # 如果出错，回滚所有更改
            conn.rollback()
            print(f"导入过程中出错: {str(e)}")
            raise e
            
        finally:
            # 关闭连接
            cursor.close()
            conn.close()
            
    except Exception as e:
        print(f"程序执行出错: {str(e)}")

if __name__ == "__main__":
    main() 