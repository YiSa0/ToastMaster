import os
import json
import pyodbc
from datetime import datetime, date
import sys
from dotenv import load_dotenv

load_dotenv()

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
        
        # 除錯：印出連線參數（隱藏密碼）
        db_server = os.getenv('DB_SERVER')
        db_name = os.getenv('DB_NAME')
        db_user = os.getenv('DB_USER')
        db_password = os.getenv('DB_PASSWORD')
        print(f"[DEBUG] DB_SERVER: {db_server}")
        print(f"[DEBUG] DB_NAME: {db_name}")
        print(f"[DEBUG] DB_USER: {db_user}")
        print(f"[DEBUG] DB_PASSWORD: {'*' * len(db_password) if db_password else None}")
        conn_str = (
            "DRIVER={ODBC Driver 17 for SQL Server};"
            "SERVER=localhost\\SQLEXPRESS;"
            f"DATABASE={db_name};"
            f"UID={db_user};"
            f"PWD={db_password};"
            "TrustServerCertificate=yes;"
            "AUTOCOMMIT=OFF"
        )
        print(f"[DEBUG] 連線字串: {conn_str}")
        # 連接數據庫
        try:
            conn = pyodbc.connect(conn_str)
        except Exception as conn_exc:
            print(f"[ERROR] 資料庫連線失敗: {str(conn_exc)}")
            print("[ERROR] 請檢查 SQL Server 是否啟動、連線參數是否正確、網路是否暢通。")
            return False
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
                # 立刻查詢剛剛插入的那一筆 id
                cursor.execute("""
                    SELECT id FROM OrderItems
                    WHERE orderId = ? AND itemId = ? AND itemName = ? AND quantity = ?
                    ORDER BY id DESC
                """, (
                    order['id'],
                    item['id'],
                    item['name'],
                    item['quantity']
                ))
                order_item_id_row = cursor.fetchone()
                order_item_id = order_item_id_row[0] if order_item_id_row else None

                if order_item_id is None:
                    print("警告：order_item_id 為 None，跳過 CustomToastIngredients 寫入")
                    continue

                # 如果是 custom toast，處理材料明細
                if item['type'] == 'custom' and 'details' in item:
                    ingredient_names = [n.strip() for n in item['details'].split('、') if n.strip()]
                    for ing_name in ingredient_names:
                        cursor.execute("SELECT id FROM Ingredients WHERE name = ?", (ing_name,))
                        result = cursor.fetchone()
                        ingredient_id = result[0] if result else None
                        print(f"處理材料: {ing_name}，OrderItemId: {order_item_id}")
                        print(f"Ingredients 查詢結果: {result}")
                        if ingredient_id is None:
                            print(f"警告：找不到材料 {ing_name}，將 ingredientId 設為 NULL")
                        cursor.execute("""
                            INSERT INTO CustomToastIngredients (
                                orderItemId, ingredientId, ingredientName
                            ) VALUES (?, ?, ?)
                        """, (
                            order_item_id,
                            ingredient_id,
                            ing_name
                        ))
            
            print(f"成功導入訂單: {order['id']}")
        
        # 提交事務
        conn.commit()
        print_step(" 所有訂單數據導入完成")
        return True
        
    except Exception as e:
        print(f"[ERROR] 導入過程中發生錯誤: {str(e)}")
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
        print(f"[ERROR] 程序執行出錯: {str(e)}")
        sys.exit(1)

