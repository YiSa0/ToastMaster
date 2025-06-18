import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    console.log(`[${new Date().toISOString()}] API 路由被調用`);
    
    const body = await request.json();
    console.log(`[${new Date().toISOString()}] 請求內容:`, body);
    
    const { orderId } = body;
    
    if (!orderId) {
      console.log(`[${new Date().toISOString()}] 錯誤：缺少訂單ID`);
      return NextResponse.json({ error: '缺少訂單ID' }, { status: 400 });
    }

    console.log(`[${new Date().toISOString()}] 開始同步訂單 ${orderId}`);

    // 获取同步脚本的路径
    const scriptPath = path.join(process.cwd(), 'src', 'lib', 'firebase-sync', 'sync_orders.py');
    console.log(`[${new Date().toISOString()}] 同步腳本路徑: ${scriptPath}`);
    
    // 检查脚本是否存在
    if (!fs.existsSync(scriptPath)) {
      console.error(`[${new Date().toISOString()}] 錯誤：找不到同步腳本: ${scriptPath}`);
      return NextResponse.json({ error: '找不到同步腳本' }, { status: 500 });
    }
    
    // 在 Windows 上使用 python 命令
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    console.log(`[${new Date().toISOString()}] 使用 Python 命令: ${pythonCommand}`);
    
    // 执行同步脚本
    const pythonProcess = spawn(pythonCommand, [scriptPath], {
      shell: true,
      windowsHide: false, // 在 Windows 上顯示命令窗口
      stdio: 'pipe',
      env: {
        ...process.env,
        PYTHONIOENCODING: 'utf-8'  // 設置 Python 的 I/O 編碼
      }
    });
    
    let output = '';
    let error = '';

    // 收集标准输出
    pythonProcess.stdout.on('data', (data) => {
      const message = data.toString('utf-8');
      output += message;
      console.log(`[${new Date().toISOString()}] 同步進度:`, message);
    });

    // 收集错误输出
    pythonProcess.stderr.on('data', (data) => {
      const message = data.toString('utf-8');
      error += message;
      console.error(`[${new Date().toISOString()}] 同步錯誤:`, message);
    });

    // 等待进程完成
    await new Promise((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`[${new Date().toISOString()}] 同步完成，退出碼: ${code}`);
          resolve(true);
        } else {
          console.error(`[${new Date().toISOString()}] 同步失敗，退出碼: ${code}`);
          reject(new Error(`同步腳本執行失敗，退出碼: ${code}`));
        }
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: '訂單同步成功',
      output,
      error,
      orderId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] 同步訂單時出錯:`, error);
    return NextResponse.json({ 
      error: '同步訂單失敗', 
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 