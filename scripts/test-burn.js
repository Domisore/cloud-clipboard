const crypto = require('crypto');

const BASE_URL = 'http://localhost:3000';

async function testBurnAfterReading() {
    console.log('🔥 Starting Burn After Reading Test...');

    // 1. Simulate Upload Completion (Metadata Creation)
    // We skip the actual R2 upload because the GET /api/file/[id] endpoint
    // mainly checks Redis metadata first, then generates a presigned URL.
    // If we only care about the "Burn" logic which wipes metadata, this is sufficient.
    // However, if the GET verifies R2 existence, this might fail.
    // Looking at the code: it gets metadata, then generates signed URL. It checks R2 existence implicitly 
    // only if the user tries to download from that URL.
    // BUT, the API itself (GET /api/file/...) returns the JSON metadata + download URL.
    // It does NOT download the file content itself.
    // So simulating metadata creation is enough to test the API logic.

    const fileId = crypto.randomUUID();
    const fileKey = `test-burn-${fileId}.txt`;

    console.log(`1. Creating Mock File Metadata: ${fileId}`);

    const completeRes = await fetch(`${BASE_URL}/api/complete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Default headers might be needed if there's auth, but let's try without first.
            // The API uses cookies for session, but maybe it allows unauthenticated uploads?
            // Checking: /api/complete doesn't seem to enforce auth in the snippets I saw, 
            // but let's check if it does.
        },
        body: JSON.stringify({
            id: fileId,
            key: fileKey,
            filename: 'test-burn.txt',
            size: 1234,
            contentType: 'text/plain',
            burnAfterReading: true,
            uploadedAt: Date.now(),
        }),
    });

    if (!completeRes.ok) {
        console.error('❌ Failed to create metadata:', await completeRes.text());
        process.exit(1);
    }
    console.log('✅ Metadata created.');

    // 2. First Retrieval (Should succeed)
    console.log('2. Attempting First Retrieval (Should succeed)...');
    const firstGet = await fetch(`${BASE_URL}/api/file/${fileId}`);

    if (firstGet.status === 200) {
        console.log('✅ First retrieval successful.');
        const data = await firstGet.json();
        if (data.url) {
            console.log('   - Got Download URL');
        } else {
            console.warn('   - No URL returned?');
        }
    } else {
        console.error(`❌ First retrieval failed: Status ${firstGet.status}`);
        console.error(await firstGet.text());
        process.exit(1);
    }

    // 3. Second Retrieval (Should fail)
    console.log('3. Attempting Second Retrieval (Should fail 404)...');
    const secondGet = await fetch(`${BASE_URL}/api/file/${fileId}`);

    if (secondGet.status === 404) {
        console.log('✅ Second retrieval returned 404 as expected.');
        console.log('🎉 TEST PASSED: Burn After Reading is working.');
    } else {
        console.error(`❌ Test Failed: Second retrieval returned status ${secondGet.status}`);
        console.log('Response:', await secondGet.text());
        process.exit(1);
    }
}

testBurnAfterReading().catch(e => {
    console.error('Unexpected error:', e);
    process.exit(1);
});
