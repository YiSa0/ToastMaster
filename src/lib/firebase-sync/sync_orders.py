import os
import time
import subprocess
import sys
from datetime import datetime

def print_step(message):
    """列印帶時間戳的步驟資訊"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    print(f"\n[{timestamp}] {message}")
    print("-" * 80)

def run_command(command):
    """執行命令並返回執行結果"""
    try:
        print_step(f"執行指令：{command}")
        result = subprocess.run(
            command, 
            shell=True, 
            check=True, 
            capture_output=True, 
            text=True,
            encoding='utf-8'
        )
        print("指令輸出：")
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 指令執行失敗：{command}")
        print(f"錯誤訊息：{e.stderr}")
        return False
    except UnicodeDecodeError as e:
        print(f"❌ 編碼錯誤：{str(e)}")
        return False

def sync_orders(order_id=None):
    """同步訂單資料的主流程"""
    print_step("開始同步訂單資料")
    
    # 取得腳本所在目錄
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"腳本目錄：{base_dir}")
    
    # 步驟 1：執行 fetch_order.py
    print_step("步驟 1：從 Firestore 擷取訂單資料")
    fetch_order_path = os.path.join(base_dir, 'fetch_order.py')
    python_exec = sys.executable  # 當前 Python 執行檔路徑
    command = f'"{python_exec}" "{fetch_order_path}"'  # 強制全量同步
    if not run_command(command):
        print("❌ 擷取訂單資料失敗，終止同步流程")
        return False
    
    # 檢查 order.json 是否產生
    order_json_path = os.path.join(base_dir, 'order.json')
    if not os.path.exists(order_json_path):
        print("❌ order.json 檔案未產生，終止同步流程")
        return False
    
    print_step("✅ order.json 已產生，等待寫入完成...")
    time.sleep(1)
    
    # 步驟 2：執行 import_orders.py
    print_step("步驟 2：將訂單資料匯入資料庫")
    import_orders_path = os.path.join(base_dir, 'import_orders.py')
    if not run_command(f'"{python_exec}" "{import_orders_path}"'):
        print("❌ 匯入訂單資料失敗，終止同步流程")
        return False
    
    print_step("🎉 [SUCCESS] 所有訂單資料已成功匯入")
    return True

if __name__ == "__main__":
    try:
        # 設定終端編碼為 UTF-8（僅適用於 Windows）
        if sys.platform == 'win32':
            import ctypes
            kernel32 = ctypes.windll.kernel32
            kernel32.SetConsoleOutputCP(65001)
        
        # 取得命令列參數（目前未使用，但保留擴充彈性）
        order_id = sys.argv[1] if len(sys.argv) > 1 else None
        
        # 強制標準輸出為 UTF-8
        if sys.stdout.encoding.lower() != 'utf-8':
            sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
        
        sync_orders(order_id)
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        print(f"❌ 同步過程發生錯誤：{str(e)}")
        sys.exit(1)
