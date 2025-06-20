import os
import time
import subprocess
import sys
from datetime import datetime

def print_step(message):
    """打印带时间戳的步骤信息"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"\n[{timestamp}] {message}")
    print("-" * 80)

def run_command(command):
    """执行命令并返回结果"""
    try:
        print_step(f"執行命令: {command}")
        # 使用 Windows 預設編碼（mbcs）
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            capture_output=True, 
            text=True,
            encoding='utf-8'  # 改用 Windows 預設編碼
        )
        print("命令輸出:")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f" 命令執行失敗: {command}")
        print(f"錯誤信息: {e.stderr}")
        return False
    except UnicodeDecodeError as e:
        print(f" 編碼錯誤: {str(e)}")
        return False

def sync_orders(order_id=None):
    """同步订单数据的主函数"""
    print_step("開始同步訂單數據")
    
    # 获取脚本所在目录
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"腳本目錄: {base_dir}")
    
    # 1. 执行 fetch_order.py
    print_step("步驟 1: 從 Firestore 獲取訂單數據")
    fetch_order_path = os.path.join(base_dir, 'fetch_order.py')
    python_exec = sys.executable  # 取得目前執行的 Python 路徑
    # 無論有沒有 order_id，這裡都不帶 order_id，強制全量同步
    command = f'"{python_exec}" "{fetch_order_path}"'
    if not run_command(command):
        print(" 獲取訂單數據失敗，同步終止")
        return False
    
    # 检查 order.json 是否生成
    order_json_path = os.path.join(base_dir, 'order.json')
    if not os.path.exists(order_json_path):
        print(" order.json 文件未生成，同步終止")
        return False
    
    print_step("order.json 文件已生成，等待文件寫入完成...")
    time.sleep(1)
    
    # 2. 执行 import_orders.py
    print_step("步驟 2: 導入訂單數據到數據庫")
    import_orders_path = os.path.join(base_dir, 'import_orders.py')
    if not run_command(f'"{python_exec}" "{import_orders_path}"'):
        print(" 導入訂單數據失敗，同步終止")
        return False
    
    print_step("[SUCCESS] 所有訂單數據導入完成")
    return True

if __name__ == "__main__":
    try:
        # 設置控制台編碼
        if sys.platform == 'win32':
            import ctypes
            kernel32 = ctypes.windll.kernel32
            kernel32.SetConsoleOutputCP(65001)  # 設置為 UTF-8 編碼
        
        # 获取命令行参数
        order_id = sys.argv[1] if len(sys.argv) > 1 else None
        
        # 強制 Python 輸出為 UTF-8
        if sys.stdout.encoding.lower() != 'utf-8':
            sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
        
        sync_orders(order_id)
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        print(f" 同步過程發生錯誤: {str(e)}")
        sys.exit(1) 