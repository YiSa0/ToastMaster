import os
import json
import pyodbc
from datetime import datetime, date
import sys

def print_step(message):
    """打印带时间戳的步骤信息"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"\n[{timestamp}] {message}")
    print("-" * 80)

def parse_datetime(dt_str):
    """解析日期時間字符串為 datetime 對象"""
    if not dt_str:
        return None
    try:
        # 處理只有時間的格式 (HH:MM)
        if ':' in dt_str and len(dt_str.split(':')) == 2:
            hour, minute = map(int, dt_str.split(':'))
            today = date.today()
            return datetime.combine(today, datetime.min.time().replace(hour=hour, minute=minute))
        
        # 處理 ISO 格式的日期時間字符串
        if 'T' in dt_str:
            dt_str = dt_str.replace('T', ' ').replace('Z', '')
        return datetime.fromisoformat(dt_str)
    except Exception as e:
        print(f"警告：無法解析日期時間 {dt_str}: {str(e)}")
        return None

def import_orders():
    print_step("開始導入訂單數據...")
    
    # 获取脚本所在目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    order_json_path = os.path.join(base_dir, 'order.json')
    
    print(f"正在讀取文件: {order_json_path}")
    
    if not os.path.exists(order_json_path):
        print(f"錯誤：找不到文件 {order_json_path}")
        return False
    
    try:
        # 讀取 JSON 文件
        with open(order_json_path, 'r', encoding='utf-8') as f:
            orders = json.load(f)
        
        if not orders:
            print("沒有找到訂單數據，程序退出")
            return False
        
        # 連接數據庫
        conn = pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=YUNNN\\SQLEXPRESS;'
            'DATABASE=project;'
            'UID=Ziyi;'
            'PWD=Zi2005yi;'
            'AUTOCOMMIT=OFF'
        )
        cursor = conn.cursor()
        
        # 處理每個訂單
        for order in orders:
            # 檢查訂單是否已存在
            cursor.execute("SELECT id FROM Orders WHERE id = ?", (order['id'],))
            if cursor.fetchone():
                print(f"訂單 {order['id']} 已存在，跳過")
                continue
            
            # 解析日期時間
            created_at = parse_datetime(order['createdAt'])
            pickup_time = parse_datetime(order.get('pickupTime'))
            
            # 插入訂單
            cursor.execute("""
                INSERT INTO Orders (
                    id, userId, totalAmount, createdAt, status, note, pickupTime
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                order['id'],
                order.get('userId'),
                order['totalPrice'],
                created_at,
                order['status'],
                order.get('notes', ''),
                pickup_time
            ))
            
            # 插入訂單項目
            for item in order['items']:
                cursor.execute("""
                    INSERT INTO OrderItems (
                        orderId, itemType, itemId, itemName, 
                        quantity, price, subTotal
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (
                    order['id'],
                    item['type'],
                    item['id'],
                    item['name'],
                    item['quantity'],
                    item['itemPrice'],
                    item['itemPrice'] * item['quantity']
                ))
            
            print(f"成功導入訂單: {order['id']}")
        
        # 提交事務
        conn.commit()
        print_step("✅ 所有訂單數據導入完成")
        return True
        
    except Exception as e:
        print(f"❌ 導入過程中發生錯誤: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    try:
        # 設置控制台編碼
        if sys.platform == 'win32':
            import ctypes
            kernel32 = ctypes.windll.kernel32
            kernel32.SetConsoleOutputCP(65001)  # 設置為 UTF-8 編碼
        
        import_orders()
    except Exception as e:
        print(f"❌ 程序執行出錯: {str(e)}")
        sys.exit(1)

