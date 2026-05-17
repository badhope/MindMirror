
import os
import re

def count_questions_generic(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 找到 questions 数组或者 normal/advanced/professional
        patterns = [
            r'questions:\s*\[',
            r'normal:\s*\[',
            r'advanced:\s*\[',
            r'professional:\s*\[',
            r':\s*\[',  # 通用的数组开始
        ]
        
        found = False
        for pattern in patterns:
            match = re.search(pattern, content)
            if match:
                found = True
                break
        
        if not found:
            return 0
        
        # 统计有多少个题目：寻找 id: 'xxx', type: 'xxx' 模式
        # 或者统计有多少个 { id: '...' 并且id不是数字
        q_matches = re.findall(r'\{[^}]*id:\s*[\'"]([^\'"]+)[\'"]', content)
        
        q_count = 0
        for qid in q_matches:
            if not qid.isdigit():  # 数字id是选项的，过滤掉
                q_count += 1
        
        # 另一种方法：数有多少个 text: '...'
        text_count = len(re.findall(r'text:\s*[\'"][^\'"]+[\'"]', content))
        
        # 取较大值
        if text_count > q_count:
            return text_count
        
        return q_count
    except Exception as e:
        return 0

def scan_all(base_dir):
    all_data = {}
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.ts') and 'index' not in file:
                file_path = os.path.join(root, file)
                count = count_questions_generic(file_path)
                if count > 0:
                    all_data[file_path] = count
    return all_data

def print_detailed(name, data):
    sorted_items = sorted(data.items(), key=lambda x: -x[1])
    print(f"\n{name}:")
    for path, count in sorted_items:
        rel_path = os.path.relpath(path, '/workspace/src/data')
        print(f"  {rel_path:50s} {count:3d}题")
    total = sum(data.values())
    print(f"{' ' * 52} {'----'}")
    print(f"  {'小计':45s} {total:3d}题 ({len(data)}个文件)")
    return total

print("=" * 60)
print("📊 MindMirror 题库完整统计 (最终版)")
print("=" * 60)

standard_data = scan_all("/workspace/src/data/assessments")
entertainment_data = scan_all("/workspace/src/data/entertainment")

total_std = print_detailed("📚 标准心理测评", standard_data)
total_ent = print_detailed("🎮 娱乐趣味测评", entertainment_data)

print("\n" + "=" * 60)
print(f"💎 最终统计汇总:")
print(f"   标准心理测评: {len(standard_data)}个文件, {total_std}题")
print(f"   娱乐趣味测评: {len(entertainment_data)}个文件, {total_ent}题")
print(f"\n🎉 总体统计: {len(standard_data)+len(entertainment_data)}个文件, {total_std + total_ent}题")
