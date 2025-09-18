// This script tests if the frontend can successfully call the backend API
async function testFrontendBackendIntegration() {
    console.log('=== Frontend-Backend Integration Test ===');

    // Create test file
    const fileContent = 'This is a test resume for frontend debugging.';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const file = new File([blob], 'frontend_debug.txt', { type: 'text/plain' });

    // Create FormData
    const formData = new FormData();
    formData.append('name', 'Frontend Debug User');
    formData.append('email', 'frontend.debug@test.com');
    formData.append('phone', '1112223333');
    formData.append('domain', 'Frontend Debugging');
    formData.append('password', 'debug123');
    formData.append('resume', file);

    console.log('FormData created with test data');

    try {
        console.log('Making request to http://localhost:5000/api/apply');
        const response = await fetch('http://localhost:5000/api/apply', {
            method: 'POST',
            body: formData
        });

        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, [...response.headers.entries()]);

        if (response.ok) {
            const result = await response.json();
            console.log('Success:', result);
            return true;
        } else {
            const errorResult = await response.json().catch(() => ({}));
            console.log('Error response:', errorResult);
            return false;
        }
    } catch (error) {
        console.log('Network error:', error);
        console.log('Error name:', error.name);
        console.log('Error message:', error.message);
        return false;
    }
}

// Run the test
testFrontendBackendIntegration().then(success => {
    console.log('=== Test Complete ===');
    console.log('Result:', success ? 'PASSED' : 'FAILED');
});