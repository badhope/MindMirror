import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

def test_api():
    # 1. 测试获取测评列表
    print("=== Testing get assessments ===")
    resp = requests.get(f"{BASE_URL}/assessments/")
    print(f"Status: {resp.status_code}")
    if resp.ok:
        data = resp.json()
        print(f"Total assessments: {data['total']}")
        for a in data['assessments']:
            print(f" - {a['title']} ({a['total_questions']} questions)")
    else:
        print(f"Error: {resp.text}")
    print()
    
    # 2. 测试登录
    print("=== Testing login ===")
    resp = requests.post(f"{BASE_URL}/auth/login", data={"username": "demo@example.com", "password": "demo123"})
    print(f"Status: {resp.status_code}")
    if resp.ok:
        token_data = resp.json()
        token = token_data['access_token']
        print(f"Got token: {token[:50]}...")
        headers = {"Authorization": f"Bearer {token}"}
    else:
        print(f"Error: {resp.text}")
        return
    print()
    
    # 3. 获取当前用户信息
    print("=== Testing get current user ===")
    resp = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {resp.status_code}")
    if resp.ok:
        user_data = resp.json()
        print(f"User: {user_data['name']} ({user_data['email']})")
    else:
        print(f"Error: {resp.text}")
        return
    print()
    
    # 4. 获取第一个测评的问题
    print("=== Testing get assessment questions ===")
    assessment_data = requests.get(f"{BASE_URL}/assessments/").json()
    if not assessment_data['assessments']:
        print("No assessments available")
        return
    
    assessment_id = assessment_data['assessments'][0]['id']
    resp = requests.get(f"{BASE_URL}/assessments/{assessment_id}/questions", headers=headers)
    print(f"Status: {resp.status_code}")
    if resp.ok:
        questions = resp.json()
        print(f"Got {len(questions)} questions")
        print(f"First question: {questions[0]['question_text'][:80]}...")
        print(f"Number of options for first question: {len(questions[0]['options'])}")
    else:
        print(f"Error: {resp.text}")
        return

if __name__ == "__main__":
    test_api()
