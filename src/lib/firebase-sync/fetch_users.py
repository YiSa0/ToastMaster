import os
import json
from datetime import datetime, timezone, timedelta
from firebase_admin import auth, credentials, firestore, initialize_app

# 初始化 Firebase
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
cred_path = os.path.join(BASE_DIR, 'serviceAccountKey.json')

print("憑證路徑:", cred_path)
print("檔案是否存在？", os.path.exists(cred_path))

cred = credentials.Certificate(cred_path)
initialize_app(cred)

# 初始化 Firestore
db = firestore.client()

# 自訂 JSON 編碼器
class FirebaseEncoder(json.JSONEncoder):
    def default(self, obj):
        # 處理 DatetimeWithNanoseconds 類型
        if hasattr(obj, 'timestamp'):
            # 轉換為 UTC+8（台北時間）
            utc_time = obj.replace(tzinfo=timezone.utc)
            taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
            return taipei_time.isoformat()
        # 處理其他不可序列化的類型
        return str(obj)

def ts_to_iso(ts):
    if ts:
        # 將時間戳轉換為 UTC+8 時區時間
        utc_time = datetime.fromtimestamp(ts / 1000, timezone.utc)
        taipei_time = utc_time.astimezone(timezone(timedelta(hours=8)))
        return taipei_time.isoformat()
    return None

def get_all_users():
    users = []
    page = auth.list_users()
    while page:
        for user in page.users:
            user_data = {
                'uid': user.uid,
                'email': user.email,
                'displayName': user.display_name,
                'createdAt': ts_to_iso(getattr(user.user_metadata, 'creation_timestamp', None)),
                'lastSignIn': ts_to_iso(getattr(user.user_metadata, 'last_sign_in_timestamp', None)),
                'phoneNumber': user.phone_number,
                'emailVerified': user.email_verified,
                'disabled': user.disabled
            }
            users.append(user_data)
        page = page.get_next_page()
    return users

def get_firestore_data(collection_name):
    docs = db.collection(collection_name).get()
    data = []
    for doc in docs:
        item = doc.to_dict()
        # 顯示每筆文件的原始資料以供除錯
        print(f"文件 ID: {doc.id}")
        print(f"原始資料: {item}")
        
        # 確保所有欄位皆正確擷取
        profile_data = {
            'id': doc.id,
            'displayName': item.get('name'),  # 使用 name 作為 displayName
            'phoneNumber': item.get('phone'),
            'birthday': item.get('birthday'),
            'gender': item.get('gender'),
            'updatedAt': item.get('updatedAt')
        }
        data.append(profile_data)
    return data

def merge_user_data(users, profiles):
    # 建立一個以 uid 為鍵的用戶資料字典
    profiles_dict = {profile['id']: profile for profile in profiles}
    
    # 合併資料
    merged_data = []
    for user in users:
        user_id = user['uid']
        profile = profiles_dict.get(user_id, {})
        
        merged_user = {
            'uid': user_id,
            'email': user.get('email'),
            'displayName': user.get('displayName'),
            'createdAt': user.get('createdAt'),
            'lastSignIn': user.get('lastSignIn'),
            'phoneNumber': profile.get('phoneNumber') or user.get('phoneNumber'),
            'emailVerified': user.get('emailVerified'),
            'disabled': user.get('disabled'),
            'birthday': profile.get('birthday'),
            'gender': profile.get('gender'),
            'updatedAt': profile.get('updatedAt')
        }
        merged_data.append(merged_user)
    
    return merged_data

def main():
    try:
        # 取得用戶認證資料
        print("正在取得用戶認證資料...")
        users = get_all_users()
        print(f"成功取得 {len(users)} 筆用戶認證資料")

        # 取得用戶個人檔案資料
        print("正在取得用戶個人資料...")
        profiles = get_firestore_data('userProfiles')
        print(f"成功取得 {len(profiles)} 筆用戶個人資料")

        # 合併資料
        merged_data = merge_user_data(users, profiles)
        print(f"成功合併 {len(merged_data)} 筆用戶資料")

        # 儲存為 JSON 檔案
        output_path = os.path.join(BASE_DIR, 'users_merged.json')
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(merged_data, f, ensure_ascii=False, indent=2, cls=FirebaseEncoder)
        print(f"資料已成功寫入至：{output_path}")

    except Exception as e:
        print(f"程式執行錯誤: {str(e)}")

if __name__ == "__main__":
    main()
