
const url = 'http://localhost:3000/api/v1/clips';
const payload = {
    content: 'Hello from verification script',
    title: 'Automated Test',
    isPrivate: true
};

console.log(`Testing POST ${url}...`);

try {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok) {
        console.log('✅ Success:', data);
    } else {
        console.error('❌ Failed:', response.status, data);
    }
} catch (error) {
    console.error('❌ Error:', error.message);
    console.log('Ensure the Next.js server is running on port 3000 (npm run dev).');
}
