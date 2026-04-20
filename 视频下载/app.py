from flask import Flask, request, jsonify, send_file, render_template, Response, stream_with_context
from flask_cors import CORS
import yt_dlp
import os
import json
import re
import uuid
from urllib.parse import urlparse
from werkzeug.utils import secure_filename
import threading
import requests

app = Flask(__name__)
CORS(app)

DOWNLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'downloads')
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

download_tasks = {}

def is_valid_url(url):
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def get_video_info(url):
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
        'cookiesfrombrowser': None,
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
        }
    }
    
    # 针对腾讯视频的特殊处理
    if 'v.qq.com' in url:
        ydl_opts.update({
            'referer': 'https://v.qq.com',
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://v.qq.com',
                'Origin': 'https://v.qq.com',
            }
        })
    
    # 针对优酷的特殊处理
    if 'youku.com' in url or 'v.youku.com' in url:
        ydl_opts.update({
            'referer': 'https://www.youku.com',
            'headers': {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.youku.com',
                'Origin': 'https://www.youku.com',
            }
        })
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return info
    except Exception as e:
        print(f"Error extracting info: {e}")
        return None

def filter_video_formats(formats):
    video_formats = []
    for fmt in formats:
        if fmt.get('vcodec') != 'none' and fmt.get('acodec') != 'none':
            ext = fmt.get('ext', '')
            if ext in ['mp4', 'webm', 'mkv', 'avi', 'mov', 'flv']:
                video_formats.append(fmt)
        elif fmt.get('vcodec') != 'none':
            ext = fmt.get('ext', '')
            if ext in ['mp4', 'webm', 'mkv', 'avi', 'mov', 'flv']:
                video_formats.append(fmt)
    
    seen = {}
    unique_formats = []
    for fmt in video_formats:
        key = f"{fmt.get('format_id')}"
        if key not in seen:
            seen[key] = True
            unique_formats.append(fmt)
    
    return sorted(unique_formats, key=lambda x: x.get('height', 0) or 0, reverse=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/parse', methods=['POST'])
def parse_video():
    data = request.get_json()
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'success': False, 'error': '请输入视频链接'})
    
    if not is_valid_url(url):
        return jsonify({'success': False, 'error': '无效的URL格式'})
    
    info = get_video_info(url)
    if not info:
        return jsonify({'success': False, 'error': '无法解析该链接，请检查链接是否有效'})
    
    formats = info.get('formats', [])
    video_formats = filter_video_formats(formats)
    
    if not video_formats:
        return jsonify({'success': False, 'error': '未找到可用的视频格式'})
    
    format_list = []
    for fmt in video_formats:
        # 获取文件大小，尝试多个字段
        filesize = fmt.get('filesize') or fmt.get('filesize_approx')
        if not filesize:
            # 尝试从format_note或其他字段提取
            filesize = fmt.get('filesize_approx')
        
        # 计算预估大小（如果知道时长和码率）
        if not filesize and info.get('duration'):
            duration = info.get('duration', 0)
            # 根据分辨率估算码率
            height = fmt.get('height', 0) or 0
            if height >= 1080:
                bitrate = 5000000  # 5 Mbps for 1080p
            elif height >= 720:
                bitrate = 2500000  # 2.5 Mbps for 720p
            elif height >= 480:
                bitrate = 1000000  # 1 Mbps for 480p
            else:
                bitrate = 500000   # 0.5 Mbps for lower
            filesize = int(duration * bitrate / 8)
        
        format_info = {
            'format_id': fmt.get('format_id'),
            'ext': fmt.get('ext'),
            'quality': fmt.get('quality', 0),
            'height': fmt.get('height', 0),
            'width': fmt.get('width', 0),
            'filesize': filesize or 0,
            'format_note': fmt.get('format_note', ''),
            'vcodec': fmt.get('vcodec', ''),
            'acodec': fmt.get('acodec', ''),
            'url': fmt.get('url', '')
        }
        format_list.append(format_info)
    
    thumbnails = info.get('thumbnails', [])
    thumbnail_url = thumbnails[-1].get('url') if thumbnails else ''
    
    response_data = {
        'success': True,
        'data': {
            'title': info.get('title', '未知标题'),
            'description': info.get('description', ''),
            'duration': info.get('duration', 0),
            'uploader': info.get('uploader', '未知上传者'),
            'thumbnail': thumbnail_url,
            'webpage_url': info.get('webpage_url', url),
            'formats': format_list
        }
    }
    
    return jsonify(response_data)

@app.route('/api/download', methods=['POST'])
def download_video():
    data = request.get_json()
    url = data.get('url', '').strip()
    format_id = data.get('format_id', '')
    filename = data.get('filename', '')
    
    if not url:
        return jsonify({'success': False, 'error': '缺少视频链接'})
    
    task_id = str(uuid.uuid4())
    
    def download_progress_hook(d):
        if d['status'] == 'downloading':
            downloaded = d.get('downloaded_bytes', 0)
            total = d.get('total_bytes') or d.get('total_bytes_estimate', 0)
            if total > 0:
                progress = (downloaded / total) * 100
                download_tasks[task_id]['progress'] = round(progress, 2)
                download_tasks[task_id]['downloaded'] = downloaded
                download_tasks[task_id]['total'] = total
        elif d['status'] == 'finished':
            download_tasks[task_id]['progress'] = 100
            download_tasks[task_id]['status'] = 'finished'
    
    def do_download():
        try:
            download_tasks[task_id] = {
                'status': 'downloading',
                'progress': 0,
                'filename': filename,
                'error': None
            }
            
            output_path = os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s')
            
            ydl_opts = {
                'format': format_id,
                'outtmpl': output_path,
                'progress_hooks': [download_progress_hook],
                'merge_output_format': 'mp4',
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=True)
                downloaded_file = ydl.prepare_filename(info)
                
                if os.path.exists(downloaded_file):
                    final_filename = secure_filename(filename) if filename else os.path.basename(downloaded_file)
                    final_path = os.path.join(DOWNLOAD_DIR, final_filename)
                    if final_path != downloaded_file:
                        os.rename(downloaded_file, final_path)
                    download_tasks[task_id]['file_path'] = final_path
                    download_tasks[task_id]['filename'] = final_filename
            
            download_tasks[task_id]['status'] = 'completed'
            
        except Exception as e:
            download_tasks[task_id]['status'] = 'error'
            download_tasks[task_id]['error'] = str(e)
    
    thread = threading.Thread(target=do_download)
    thread.start()
    
    return jsonify({
        'success': True,
        'task_id': task_id,
        'message': '下载任务已启动'
    })

@app.route('/api/progress/<task_id>', methods=['GET'])
def get_progress(task_id):
    task = download_tasks.get(task_id)
    if not task:
        return jsonify({'success': False, 'error': '任务不存在'})
    
    return jsonify({
        'success': True,
        'data': task
    })

@app.route('/api/file/<task_id>', methods=['GET'])
def download_file(task_id):
    task = download_tasks.get(task_id)
    if not task or 'file_path' not in task:
        return jsonify({'success': False, 'error': '文件不存在'})
    
    file_path = task['file_path']
    if not os.path.exists(file_path):
        return jsonify({'success': False, 'error': '文件已被删除'})
    
    return send_file(file_path, as_attachment=True, download_name=task['filename'])

# 存储预览URL信息
preview_cache = {}

@app.route('/api/preview', methods=['POST'])
def get_preview_url():
    data = request.get_json()
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'success': False, 'error': '缺少视频链接'})
    
    info = get_video_info(url)
    if not info:
        return jsonify({'success': False, 'error': '无法获取预览信息'})
    
    formats = info.get('formats', [])
    best_format = None
    
    for fmt in formats:
        if fmt.get('vcodec') != 'none' and fmt.get('acodec') != 'none':
            if not best_format or (fmt.get('height', 0) or 0) > (best_format.get('height', 0) or 0):
                best_format = fmt
    
    if not best_format:
        for fmt in formats:
            if fmt.get('vcodec') != 'none':
                if not best_format or (fmt.get('height', 0) or 0) > (best_format.get('height', 0) or 0):
                    best_format = fmt
    
    if best_format and best_format.get('url'):
        preview_id = str(uuid.uuid4())
        preview_cache[preview_id] = {
            'url': best_format['url'],
            'referer': info.get('webpage_url', url),
            'title': info.get('title', ''),
            'duration': info.get('duration', 0)
        }
        
        return jsonify({
            'success': True,
            'data': {
                'preview_url': f'/api/stream/{preview_id}',
                'title': info.get('title', ''),
                'duration': info.get('duration', 0)
            }
        })
    
    return jsonify({'success': False, 'error': '无法获取预览链接'})

@app.route('/api/stream/<preview_id>')
def stream_video(preview_id):
    if preview_id not in preview_cache:
        return jsonify({'success': False, 'error': '预览链接已过期'}), 404
    
    preview_info = preview_cache[preview_id]
    video_url = preview_info['url']
    referer = preview_info['referer']
    
    # 获取请求头中的Range
    range_header = request.headers.get('Range', 'bytes=0-')
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': referer,
        'Accept': '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'identity;q=1, *;q=0',
        'Range': range_header,
        'Connection': 'keep-alive',
    }
    
    try:
        # 发送请求到视频服务器
        req = requests.get(video_url, headers=headers, stream=True, allow_redirects=True, timeout=30)
        
        # 准备响应头
        response_headers = {}
        
        # 设置Content-Type (根据视频格式)
        content_type = req.headers.get('Content-Type', '')
        if not content_type or content_type == 'application/octet-stream':
            # 根据URL推断视频类型
            if '.mp4' in video_url.lower():
                content_type = 'video/mp4'
            elif '.webm' in video_url.lower():
                content_type = 'video/webm'
            elif '.m3u8' in video_url.lower():
                content_type = 'application/vnd.apple.mpegurl'
            else:
                content_type = 'video/mp4'
        response_headers['Content-Type'] = content_type
        
        # 传递其他重要头信息
        for key in ['Content-Length', 'Content-Range', 'Accept-Ranges', 'Cache-Control']:
            if key in req.headers:
                response_headers[key] = req.headers[key]
        
        # 设置CORS头，允许跨域播放
        response_headers['Access-Control-Allow-Origin'] = '*'
        response_headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response_headers['Access-Control-Allow-Headers'] = 'Range, Accept'
        response_headers['Access-Control-Expose-Headers'] = 'Content-Length, Content-Range'
        
        def generate():
            try:
                for chunk in req.iter_content(chunk_size=65536):  # 增大块大小
                    if chunk:
                        yield chunk
            except Exception as e:
                print(f"Stream generation error: {e}")
                return
        
        return Response(
            stream_with_context(generate()),
            status=req.status_code,
            headers=response_headers,
            mimetype=content_type
        )
    except Exception as e:
        print(f"Stream error: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': f'视频流获取失败: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)