
import os
import re

assessments_dir = "/workspace/src/data/assessments"
entertainment_dir = "/workspace/src/data/entertainment"

def count_questions_in_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        count = 0
        
        # 方法1：找 questions 数组内的 id
        questions_match = re.search(r'questions:\s*\[([\s\S]*?)\]', content)
        if questions_match:
            q_content = questions_match.group(1)
            ids = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', q_content)
            count = len(ids)
        
        if count == 0:
            # 方法2：找 normal 数组
            normal_match = re.search(r'normal:\s*\[([\s\S]*?)\]', content)
            if normal_match:
                ids = re.findall(r'id:\s*[\'"]([^\'"]+)[\'"]', normal_match.group(1))
                count = len(ids)
        
        return count
    except Exception as e:
        return 0

def scan_dir(directory):
    results = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts') and 'index' not in file and 'calculator' not in file and 'common' not in file:
                file_path = os.path.join(root, file)
                count = count_questions_in_file(file_path)
                if count > 0:
                    rel_path = os.path.relpath(file_path, directory)
                    results.append((rel_path, count))
    
    return sorted(results, key=lambda x: -x[1])

print("=" * 60)
print("📊 题库题目统计")
print("=" * 60)

standard = scan_dir(assessments_dir)
entertainment = scan_dir(entertainment_dir)

print("\n📚 标准心理测评 (按题量排序):")
for path, count in standard:
    print(f"  {path:40s} {count:3d}题")

print(f"\n🎮 娱乐趣味测评:")
for path, count in entertainment:
    print(f"  {path:40s} {count:3d}题")

total_standard = sum(c for _, c in standard)
total_entertainment = sum(c for _, c in entertainment)

print("\n" + "=" * 60)
print(f"标准心理测评: {len(standard)}个, {total_standard}题")
print(f"娱乐趣味测评: {len(entertainment)}个, {total_entertainment}题")
print(f"\n💎 总计: {len(standard)+len(entertainment)}个测评, {total_standard+total_entertainment}题")
