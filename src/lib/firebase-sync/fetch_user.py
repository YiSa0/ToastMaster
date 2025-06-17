from firebase_admin import auth, credentials, initialize_app
import json
from datetime import datetime

# 初始化 Firebase
cred = credentials.Certificate('src/lib/firebase-sync/serviceAccountKey.json')
initialize_app(cred)

def get_all_users():
    users = []
    page = auth.list_users()
    while page:
        for user in page.users:
            # 轉換 timestamp 為 ISO 格式字串
            def ts_to_iso(ts):
                if ts:
                    return datetime.fromtimestamp(ts / 1000).isoformat()
                return None

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

def save_users_to_json(users, filename='src/lib/firebase-sync/users.json'):
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(users, f, ensure_ascii=False, indent=2)
        print(f"成功保存 {len(users)} 個用戶數據到 {filename}")
    except Exception as e:
        print(f"保存文件時出錯: {str(e)}")

def main():
    try:
        # 獲取所有用戶
        print("正在獲取用戶數據...")
        users = get_all_users()
        print(f"成功獲取 {len(users)} 個用戶")
        
        # 保存到 JSON 文件
        save_users_to_json(users)
        
    except Exception as e:
        print(f"程序執行出錯: {str(e)}")

if __name__ == "__main__":
    main()
