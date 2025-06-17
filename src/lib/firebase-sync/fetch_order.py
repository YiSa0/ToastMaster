import os
import json
from datetime import datetime, timezone, timedelta
from firebase_admin import credentials, firestore, initialize_app

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
def get_firestore_data(collection_name):
    docs = db.collection(collection_name).get()
    data = []
    for doc in docs:
        item = doc.to_dict()
        # 转换 createdAt 字段为 UTC+8
        if 'createdAt' in item and hasattr(item['createdAt'], 'timestamp'):
            utc_time = item['createdAt'].replace(tzinfo=timezone.utc)
            taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
            item['createdAt'] = taipei_time.isoformat()
        item['id'] = doc.id
        data.append(item)
    return data

# 获取数据
data = get_firestore_data('orders')

# 将数据写入 order.json
output_path = os.path.join(BASE_DIR, 'order.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2, cls=FirebaseEncoder)

print(f"数据已成功写入到: {output_path}")
