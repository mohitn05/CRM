// Simulate form submission to test the integration
async function simulateFormSubmission() {
    console.log('Starting form submission simulation...');

    // Create a simple text file for testing
    const fileContent = 'This is a test resume file for simulation.';
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const file = new File([blob], 'test_resume.txt', { type: 'text/plain' });

    // Create FormData object
    const formData = new FormData();
    formData.append('name', 'Simulation Test User');
    formData.append('email', 'simulation@test.com');
    formData.append('phone', '7777777777');
    formData.append('domain', 'Simulation Testing');
    formData.append('password', 'simulation123');
    formData.append('resume', file);

    console.log('FormData created with test data');

    try {
        console.log('Attempting to submit to backend API...');
        const response = await fetch('http://localhost:5000/api/apply', {
            method: 'POST',
            body: formData
        });

        console.log(`Response status: ${response.status}`);

        if (response.ok) {
            const result = await response.json();
            console.log('Success:', result);
        } else {
            const errorResult = await response.json().catch(() => ({}));
            console.log('Error response:', errorResult);
        }
    } catch (error) {
        console.log('Network error:', error.message);
    }
}

// Run the simulation
simulateFormSubmission();