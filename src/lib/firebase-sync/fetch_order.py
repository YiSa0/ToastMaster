import os
import json
import sys
from datetime import datetime, timezone, timedelta
from firebase_admin import credentials, firestore, initialize_app

# 設定終端機編碼
if os.name == 'nt':  # Windows
    import ctypes
    kernel32 = ctypes.windll.kernel32
    kernel32.SetConsoleOutputCP(65001)  # 設為 UTF-8 編碼

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(BASE_DIR, 'serviceAccountKey.json')

print("憑證路徑:", cred_path)
print("檔案是否存在？", os.path.exists(cred_path))

cred = credentials.Certificate(cred_path)
initialize_app(cred)

db = firestore.client()

# 自訂 JSON 編碼器
class FirebaseEncoder(json.JSONEncoder):
    def default(self, obj):
        # 處理 DatetimeWithNanoseconds 類型
        if hasattr(obj, 'timestamp'):
            # 轉為 UTC+8（台北時間）
            utc_time = obj.replace(tzinfo=timezone.utc)
            taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
            return taipei_time.isoformat()
        # 處理其他不可序列化的類型
        return str(obj)

# 資料擷取函式
def get_firestore_data(collection_name, order_id=None):
    if order_id:
        # 若提供了訂單 ID，僅擷取該筆訂單
        doc = db.collection(collection_name).document(order_id).get()
        if doc.exists:
            item = doc.to_dict()
            if 'createdAt' in item and hasattr(item['createdAt'], 'timestamp'):
                utc_time = item['createdAt'].replace(tzinfo=timezone.utc)
                taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
                item['createdAt'] = taipei_time.isoformat()
            item['id'] = doc.id
            return [item]
        return []
    else:
        # 否則擷取所有訂單
        docs = db.collection(collection_name).get()
        print(f"[除錯] 共取得 {len(docs)} 筆訂單")
        data = []
        for doc in docs:
            print(f"[除錯] 訂單 ID: {doc.id}")
            item = doc.to_dict()
            if 'createdAt' in item and hasattr(item['createdAt'], 'timestamp'):
                utc_time = item['createdAt'].replace(tzinfo=timezone.utc)
                taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
                item['createdAt'] = taipei_time.isoformat()
            item['id'] = doc.id
            data.append(item)
        return data

# 取得命令列參數
order_id = sys.argv[1] if len(sys.argv) > 1 else None

# 擷取資料
data = get_firestore_data('orders', order_id)

# 將資料寫入 order.json
output_path = os.path.join(BASE_DIR, 'order.json')

# 每次執行前刪除舊的 order.json
#如果檔案存在就刪除
if os.path.exists(output_path):
    os.remove(output_path)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2, cls=FirebaseEncoder)

print(f"資料已成功寫入至：{output_path}")
