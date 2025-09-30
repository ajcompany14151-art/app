#!/usr/bin/env python3

import requests
import sys
import json
import time
from datetime import datetime
from typing import Dict, List, Optional

class AJStudiozAPITester:
    def __init__(self, base_url="https://agentic-aj-studioz.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        
    def log_test(self, name: str, success: bool, details: str = "", response_data: Dict = None):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            
        result = {
            "test_name": name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    Details: {details}")
        if not success and response_data:
            print(f"    Response: {response_data}")
        print()

    def test_health_check(self):
        """Test API health endpoint"""
        try:
            response = requests.get(f"{self.api_url}/health", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Status: {data.get('status')}, Platform: {data.get('platform')}, Version: {data.get('version')}"
            else:
                details = f"HTTP {response.status_code}"
                data = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("Health Check", success, details, data if not success else None)
            return success
            
        except Exception as e:
            self.log_test("Health Check", False, f"Exception: {str(e)}")
            return False

    def test_root_endpoint(self):
        """Test root API endpoint"""
        try:
            response = requests.get(f"{self.api_url}/", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                details = f"Message: {data.get('message', 'No message')}"
            else:
                details = f"HTTP {response.status_code}"
                data = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("Root Endpoint", success, details, data if not success else None)
            return success
            
        except Exception as e:
            self.log_test("Root Endpoint", False, f"Exception: {str(e)}")
            return False

    def test_get_models(self):
        """Test models endpoint"""
        try:
            response = requests.get(f"{self.api_url}/models", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                providers = list(data.get('providers', {}).keys())
                details = f"Available providers: {', '.join(providers)}"
            else:
                details = f"HTTP {response.status_code}"
                data = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("Get Models", success, details, data if not success else None)
            return success
            
        except Exception as e:
            self.log_test("Get Models", False, f"Exception: {str(e)}")
            return False

    def test_chat_functionality(self):
        """Test chat API with AI integration"""
        try:
            chat_data = {
                "message": "Hello, this is a test message. Please respond briefly.",
                "model_provider": "anthropic",
                "model_name": "claude-sonnet-4-20250514"
            }
            
            print("    Sending chat request (this may take a few seconds)...")
            response = requests.post(
                f"{self.api_url}/chat", 
                json=chat_data, 
                timeout=30,
                headers={'Content-Type': 'application/json'}
            )
            
            success = response.status_code == 200
            
            if success:
                data = response.json()
                self.session_id = data.get('session_id')
                ai_response = data.get('response', '')
                details = f"Session ID: {self.session_id}, Response length: {len(ai_response)} chars"
                
                # Verify response contains expected fields
                if not ai_response or len(ai_response) < 10:
                    success = False
                    details += " - AI response too short or empty"
                    
            else:
                details = f"HTTP {response.status_code}"
                try:
                    data = response.json()
                except:
                    data = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("Chat Functionality", success, details, data if not success else None)
            return success
            
        except Exception as e:
            self.log_test("Chat Functionality", False, f"Exception: {str(e)}")
            return False

    def test_get_sessions(self):
        """Test getting chat sessions"""
        try:
            response = requests.get(f"{self.api_url}/chat/sessions", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                session_count = len(data) if isinstance(data, list) else 0
                details = f"Found {session_count} sessions"
                
                # If we created a session in chat test, it should be here
                if self.session_id and session_count > 0:
                    session_ids = [s.get('id') for s in data if isinstance(s, dict)]
                    if self.session_id in session_ids:
                        details += f" (including test session {self.session_id})"
                    else:
                        details += f" (test session {self.session_id} not found)"
            else:
                details = f"HTTP {response.status_code}"
                try:
                    data = response.json()
                except:
                    data = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("Get Sessions", success, details, data if not success else None)
            return success
            
        except Exception as e:
            self.log_test("Get Sessions", False, f"Exception: {str(e)}")
            return False

    def test_get_session_messages(self):
        """Test getting messages for a session"""
        if not self.session_id:
            self.log_test("Get Session Messages", False, "No session ID available from previous tests")
            return False
            
        try:
            response = requests.get(f"{self.api_url}/chat/sessions/{self.session_id}/messages", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                message_count = len(data) if isinstance(data, list) else 0
                details = f"Found {message_count} messages in session {self.session_id}"
                
                # Should have at least 2 messages (user + assistant)
                if message_count >= 2:
                    user_msgs = [m for m in data if m.get('role') == 'user']
                    ai_msgs = [m for m in data if m.get('role') == 'assistant']
                    details += f" ({len(user_msgs)} user, {len(ai_msgs)} assistant)"
                else:
                    details += " - Expected at least 2 messages"
            else:
                details = f"HTTP {response.status_code}"
                try:
                    data = response.json()
                except:
                    data = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("Get Session Messages", success, details, data if not success else None)
            return success
            
        except Exception as e:
            self.log_test("Get Session Messages", False, f"Exception: {str(e)}")
            return False

    def test_analytics(self):
        """Test analytics endpoint"""
        try:
            response = requests.get(f"{self.api_url}/analytics/stats", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                total_sessions = data.get('total_sessions', 0)
                total_messages = data.get('total_messages', 0)
                details = f"Sessions: {total_sessions}, Messages: {total_messages}, Platform: {data.get('platform')}"
            else:
                details = f"HTTP {response.status_code}"
                try:
                    data = response.json()
                except:
                    data = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("Analytics", success, details, data if not success else None)
            return success
            
        except Exception as e:
            self.log_test("Analytics", False, f"Exception: {str(e)}")
            return False

    def test_file_upload(self):
        """Test file upload and analysis"""
        try:
            # Create a simple test file
            test_content = "This is a test document for AJ STUDIOZ analysis.\n\nIt contains some sample text to analyze."
            
            files = {
                'file': ('test_document.txt', test_content, 'text/plain')
            }
            data = {
                'session_id': self.session_id or 'test_session'
            }
            
            print("    Uploading test file for analysis (this may take a few seconds)...")
            response = requests.post(
                f"{self.api_url}/upload/analyze", 
                files=files, 
                data=data,
                timeout=30
            )
            
            success = response.status_code == 200
            
            if success:
                result = response.json()
                analysis = result.get('analysis', '')
                filename = result.get('filename', '')
                details = f"File: {filename}, Analysis length: {len(analysis)} chars"
                
                if not analysis or len(analysis) < 20:
                    success = False
                    details += " - Analysis too short or empty"
            else:
                details = f"HTTP {response.status_code}"
                try:
                    result = response.json()
                except:
                    result = {"status_code": response.status_code, "text": response.text}
                
            self.log_test("File Upload & Analysis", success, details, result if not success else None)
            return success
            
        except Exception as e:
            self.log_test("File Upload & Analysis", False, f"Exception: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting AJ STUDIOZ API Testing")
        print(f"Testing against: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity tests
        health_ok = self.test_health_check()
        root_ok = self.test_root_endpoint()
        models_ok = self.test_get_models()
        
        # Core functionality tests
        chat_ok = self.test_chat_functionality()
        sessions_ok = self.test_get_sessions()
        messages_ok = self.test_get_session_messages()
        
        # Additional features
        analytics_ok = self.test_analytics()
        upload_ok = self.test_file_upload()
        
        # Summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! AJ STUDIOZ API is working correctly.")
            return True
        else:
            failed_tests = [r for r in self.test_results if not r['success']]
            print(f"❌ {len(failed_tests)} tests failed:")
            for test in failed_tests:
                print(f"   - {test['test_name']}: {test['details']}")
            return False

def main():
    tester = AJStudiozAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    with open('/app/test_reports/backend_api_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total_tests': tester.tests_run,
                'passed_tests': tester.tests_passed,
                'success_rate': f"{(tester.tests_passed/tester.tests_run*100):.1f}%" if tester.tests_run > 0 else "0%",
                'timestamp': datetime.now().isoformat()
            },
            'test_results': tester.test_results
        }, f, indent=2)
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())