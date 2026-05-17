
import os
import re

def count_questions(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 方法1：找到 questions 数组
        total = 0
        for m in re.finditer(r'questions:\s*\[([\s\S]*?)\]', content, re.DOTALL):
            q_part = m.group(1)
            # 数里面的 id
            ids = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', q_part)
            total += len(ids)
        
        if total > 0:
            return total
        
        # 方法2：找 normal/advanced/professional 模式
        total = 0
        for m in re.finditer(r'(normal|advanced|professional):\s*\[([\s\S]*?)\]', content, re.DOTALL):
            q_part = m.group(2)
            ids = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', q_part)
            total += len(ids)
        
        return total
    except Exception as e:
        return 0

def scan_and_count(base_dir):
    all_questions = {}
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.ts') and 'index' not in file and 'calculator' not in file and 'common' not in file:
                file_path = os.path.join(root, file)
                count = count_questions(file_path)
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
