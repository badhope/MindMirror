
import os
import re

def is_likely_question(line):
    # 判断一行是否是题目开始
    patterns = [
        r'id:\s*[\'"][a-z]+[-_]',
        r'type:\s*[\'"]',
        r'text:\s*[\'"]',
    ]
    for p in patterns:
        if re.search(p, line):
            return True
    return False

def count_questions_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 找到 questions 数组的开始和结束位置
        match = re.search(r'questions:\s*\[', content)
        if not match:
            match = re.search(r'normal:\s*\[', content)
        
        if not match:
            return 0
        
        start_pos = match.end()
        # 向前找到对应的 ]
        bracket_count = 1
        pos = start_pos
        while bracket_count > 0 and pos < len(content):
            if content[pos] == '[':
                bracket_count += 1
            elif content[pos] == ']':
                bracket_count -= 1
            pos += 1
        
        questions_content = content[start_pos:pos]
        
        # 现在统计里面的题目数量：每个 { id: 'xxx' 但排除options的
        # 简单方式：数有多少个 { id: 且不在options数组里的
        # 或者直接数有多少个 id: '... 前面有 { 的
        q_matches = re.findall(r'\{[^}]*id:\s*[\'"]([^\'"]+)[\'"]', questions_content)
        
        # 过滤掉那些id是数字的（那是options的id）
        q_count = 0
        for qid in q_matches:
            if not qid.isdigit():  # 数字id可能是选项的id
                q_count += 1
        
        # 如果这样还是不对，直接统计文件中包含 id: 且前有type:的数量
        type_count = len(re.findall(r'id:\s*[\'"][^\'"]+[\'"],\s*type:\s*', questions_content))
        
        if type_count > 0:
            return type_count
        
        return q_count
    except Exception as e:
        return 0

def scan_and_count(base_dir):
    all_questions = {}
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.ts') and 'index' not in file and 'calculator' not in file and 'common' not in file:
                file_path = os.path.join(root, file)
                count = count_questions_file(file_path)
                if count > 0:
                    all_questions[file_path] = count
    
    return all_questions

def print_stats(name, data):
    sorted_data = sorted(data.items(), key=lambda x: -x[1])
    print(f"\n{name} (按题量排序):")
    for path, count in sorted_data:
        rel_path = os.path.basename(path)
        print(f"  {rel_path:45s} {count:3d}题")
    total = sum(data.values())
    print(f"{' ' * 46}  ----")
    print(f"  {'总计':40s} {total:3d}题 ({len(data)}个测评)")
    return total

print("=" * 60)
print("📊 MindMirror 题库完整统计")
print("=" * 60)

standard_dir = "/workspace/src/data/assessments"
entertainment_dir = "/workspace/src/data/entertainment"

standard = scan_and_count(standard_dir)
entertainment = scan_and_count(entertainment_dir)

total_standard = print_stats("📚 标准心理测评", standard)
total_entertainment = print_stats("🎮 娱乐趣味测评", entertainment)

print("\n" + "=" * 60)
print(f"💎 题库统计汇总:")
print(f"   标准心理测评: {len(standard)}个, {total_standard}题")
print(f"   娱乐趣味测评: {len(entertainment)}个, {total_entertainment}题")
print(f"\n🎉 总计: {len(standard)+len(entertainment)}个测评, {total_standard+total_entertainment}题")
