import pyodbc

def check_tables():
    try:
        # 连接数据库
        conn = pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=YUNNN\\SQLEXPRESS;'
            'DATABASE=project;'
            'UID=Ziyi;'
            'PWD=Zi2005yi'
        )
        print("数据库连接成功！")
        
        cursor = conn.cursor()
        
        # 检查表结构
        print("\n检查表结构：")
        
        # 检查 Orders 表
        print("\nOrders 表结构：")
        cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Orders'
            ORDER BY ORDINAL_POSITION
        """)
        for row in cursor.fetchall():
            print(f"列名: {row.COLUMN_NAME}")
            print(f"数据类型: {row.DATA_TYPE}")
            print(f"最大长度: {row.CHARACTER_MAXIMUM_LENGTH}")
            print(f"允许空值: {row.IS_NULLABLE}")
            print("---")
            
        # 检查 OrderItems 表
        print("\nOrderItems 表结构：")
        cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'OrderItems'
            ORDER BY ORDINAL_POSITION
        """)
        for row in cursor.fetchall():
            print(f"列名: {row.COLUMN_NAME}")
            print(f"数据类型: {row.DATA_TYPE}")
            print(f"最大长度: {row.CHARACTER_MAXIMUM_LENGTH}")
            print(f"允许空值: {row.IS_NULLABLE}")
            print("---")
            
        # 检查 Users 表
        print("\nUsers 表结构：")
        cursor.execute("""
            SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'Users'
            ORDER BY ORDINAL_POSITION
        """)
        for row in cursor.fetchall():
            print(f"列名: {row.COLUMN_NAME}")
            print(f"数据类型: {row.DATA_TYPE}")
            print(f"最大长度: {row.CHARACTER_MAXIMUM_LENGTH}")
            print(f"允许空值: {row.IS_NULLABLE}")
            print("---")
            
        # 检查外键约束
        print("\n外键约束：")
        cursor.execute("""
            SELECT 
                OBJECT_NAME(f.parent_object_id) AS TableName,
                COL_NAME(fc.parent_object_id, fc.parent_column_id) AS ColumnName,
                OBJECT_NAME(f.referenced_object_id) AS ReferencedTableName,
                COL_NAME(fc.referenced_object_id, fc.referenced_column_id) AS ReferencedColumnName
            FROM sys.foreign_keys AS f
            INNER JOIN sys.foreign_key_columns AS fc
                ON f.object_id = fc.constraint_object_id
        """)
        for row in cursor.fetchall():
            print(f"表: {row.TableName}")
            print(f"列: {row.ColumnName}")
            print(f"引用表: {row.ReferencedTableName}")
            print(f"引用列: {row.ReferencedColumnName}")
            print("---")
            
    except Exception as e:
        print(f"发生错误: {str(e)}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    check_tables() 