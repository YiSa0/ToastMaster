import os
import json
import sys
from datetime import datetime, timezone, timedelta
from firebase_admin import credentials, firestore, initialize_app

# 設置控制台編碼
if os.name == 'nt':  # Windows
    import ctypes
    kernel32 = ctypes.windll.kernel32
    kernel32.SetConsoleOutputCP(65001)  # 設置為 UTF-8 編碼

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(BASE_DIR, 'serviceAccountKey.json')

print("Credential path:", cred_path)
print("Exists?", os.path.exists(cred_path))

cred = credentials.Certificate(cred_path)
initialize_app(cred)

db = firestore.client()

# 自定义 JSON 编码器
class FirebaseEncoder(json.JSONEncoder):
    def default(self, obj):
        # 处理 DatetimeWithNanoseconds 类型
        if hasattr(obj, 'timestamp'):
            # 转换为 UTC+8
            utc_time = obj.replace(tzinfo=timezone.utc)
            taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
            return taipei_time.isoformat()
        # 处理其他不可序列化的类型
        return str(obj)

# 你的資料擷取函式
def get_firestore_data(collection_name, order_id=None):
    if order_id:
        # 如果提供了訂單 ID，只獲取該訂單
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
        # 否則獲取所有訂單
        docs = db.collection(collection_name).get()
        print(f"[DEBUG] 共抓到 {len(docs)} 筆訂單")
        data = []
        for doc in docs:
            print(f"[DEBUG] 訂單ID: {doc.id}")
            item = doc.to_dict()
            if 'createdAt' in item and hasattr(item['createdAt'], 'timestamp'):
                utc_time = item['createdAt'].replace(tzinfo=timezone.utc)
                taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
                item['createdAt'] = taipei_time.isoformat()
            item['id'] = doc.id
            data.append(item)
        return data

# 获取命令行参数
order_id = sys.argv[1] if len(sys.argv) > 1 else None

# 获取数据
data = get_firestore_data('orders', order_id)

# 将数据写入 order.json
output_path = os.path.join(BASE_DIR, 'order.json')

# 每次執行前先刪除舊的 order.json
if os.path.exists(output_path):
    os.remove(output_path)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2, cls=FirebaseEncoder)

print(f"數據已成功寫入到: {output_path}")
