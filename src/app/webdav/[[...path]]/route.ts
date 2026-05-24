import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { r2 } from "@/lib/r2";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

// CORS headers helper
function corsHeaders(origin: string | null) {
    const allowedOrigin = origin || '*';
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PROPFIND, MKCOL, MOVE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Depth, Destination, Overwrite',
        'Access-Control-Allow-Credentials': 'true',
        'DAV': '1, 2',
    };
}

// Authentication check mapping Basic and Bearer auth to User ID
async function getUserIdFromAuth(request: Request): Promise<string | null> {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return null;

    let token = "";
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    } else if (authHeader.startsWith("Basic ")) {
        try {
            const credentials = Buffer.from(authHeader.substring(6), 'base64').toString('utf-8');
            const parts = credentials.split(':');
            token = parts[1] || parts[0];
        } catch (e) {
            console.error("Failed to decode Basic auth header:", e);
        }
    }

    if (!token) return null;
    const keyData = await redis.hgetall(`apikey:${token}`);
    if (!keyData) return null;
    return keyData.userId as string;
}

// Helper to get active namespace files
async function getNamespaceFiles(userId: string, namespace: string): Promise<any[]> {
    const fileIds = await redis.smembers(`namespace:${userId}:${namespace}:files`);
    if (!fileIds.length) return [];

    const filesData = await Promise.all(
        fileIds.map(async (id) => {
            const data: any = await redis.get(`file:${id}`);
            if (!data) {
                // Self-clean expired file from set
                await redis.srem(`namespace:${userId}:${namespace}:files`, id);
                return null;
            }
            return data;
        })
    );

    return filesData.filter(Boolean);
}

// OPTIONS Handler
export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin');
    return new Response(null, {
        status: 200,
        headers: corsHeaders(origin),
    });
}

// PROPFIND Handler
export async function PROPFIND(
    request: Request,
    props: { params: Promise<{ path?: string[] }> }
) {
    const params = await props.params;
    const origin = request.headers.get('origin');
    const headers: Record<string, string> = {
        ...corsHeaders(origin),
        "Content-Type": "application/xml; charset=utf-8",
    };

    const userId = await getUserIdFromAuth(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    const path = params.path || [];
    const depth = request.headers.get("Depth") || "1";

    let xml = '<?xml version="1.0" encoding="utf-8" ?>\n<D:multistatus xmlns:D="DAV:">';

    if (path.length === 0) {
        // --- 1. Root Directory Listing (Lists user namespaces) ---
        xml += `
  <D:response>
    <D:href>/webdav/</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>webdav</D:displayname>
        <D:resourcetype><D:collection/></D:resourcetype>
        <D:getlastmodified>Sun, 24 May 2026 12:00:00 GMT</D:getlastmodified>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>`;

        if (depth !== "0") {
            const namespaces = await redis.smembers(`user:${userId}:namespaces`);
            for (const ns of namespaces) {
                xml += `
  <D:response>
    <D:href>/webdav/${ns}/</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>${ns}</D:displayname>
        <D:resourcetype><D:collection/></D:resourcetype>
        <D:getlastmodified>Sun, 24 May 2026 12:00:00 GMT</D:getlastmodified>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>`;
            }
        }
    } else if (path.length === 1) {
        // --- 2. Namespace Directory Listing (Lists files inside the namespace) ---
        const namespace = path[0];
        const isNamespaceExist = await redis.sismember(`user:${userId}:namespaces`, namespace);

        if (!isNamespaceExist) {
            return new Response("Namespace not found", { status: 404, headers: corsHeaders(origin) });
        }

        xml += `
  <D:response>
    <D:href>/webdav/${namespace}/</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>${namespace}</D:displayname>
        <D:resourcetype><D:collection/></D:resourcetype>
        <D:getlastmodified>Sun, 24 May 2026 12:00:00 GMT</D:getlastmodified>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>`;

        if (depth !== "0") {
            const files = await getNamespaceFiles(userId, namespace);
            for (const file of files) {
                const dateStr = new Date(file.uploadedAt).toUTCString();
                xml += `
  <D:response>
    <D:href>/webdav/${namespace}/${encodeURIComponent(file.filename)}</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>${file.filename}</D:displayname>
        <D:getcontentlength>${file.size}</D:getcontentlength>
        <D:getcontenttype>${file.contentType || "application/octet-stream"}</D:getcontenttype>
        <D:getlastmodified>${dateStr}</D:getlastmodified>
        <D:resourcetype/>
        <D:getetag>"${file.id}"</D:getetag>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>`;
            }
        }
    } else {
        // --- 3. Individual File Property Listing ---
        const namespace = path[0];
        const filename = path.slice(1).join('/');
        const files = await getNamespaceFiles(userId, namespace);
        const file = files.find(f => f.filename === filename);

        if (!file) {
            return new Response("File not found", { status: 404, headers: corsHeaders(origin) });
        }

        const dateStr = new Date(file.uploadedAt).toUTCString();
        xml += `
  <D:response>
    <D:href>/webdav/${namespace}/${encodeURIComponent(file.filename)}</D:href>
    <D:propstat>
      <D:prop>
        <D:displayname>${file.filename}</D:displayname>
        <D:getcontentlength>${file.size}</D:getcontentlength>
        <D:getcontenttype>${file.contentType || "application/octet-stream"}</D:getcontenttype>
        <D:getlastmodified>${dateStr}</D:getlastmodified>
        <D:resourcetype/>
        <D:getetag>"${file.id}"</D:getetag>
      </D:prop>
      <D:status>HTTP/1.1 200 OK</D:status>
    </D:propstat>
  </D:response>`;
    }

    xml += "\n</D:multistatus>";
    return new Response(xml, { status: 207, headers });
}

// GET Handler
export async function GET(
    request: Request,
    props: { params: Promise<{ path?: string[] }> }
) {
    const params = await props.params;
    const origin = request.headers.get('origin');
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    const path = params.path || [];
    if (path.length < 2) {
        return new Response("Not a file path", { status: 400, headers: corsHeaders(origin) });
    }

    const namespace = path[0];
    const filename = path.slice(1).join('/');
    const files = await getNamespaceFiles(userId, namespace);
    const file = files.find(f => f.filename === filename);

    if (!file) {
        return new Response("File not found", { status: 404, headers: corsHeaders(origin) });
    }

    try {
        const getObjectParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: file.key,
        };
        const s3Response = await r2.send(new GetObjectCommand(getObjectParams));
        
        return new Response(s3Response.Body as any, {
            status: 200,
            headers: {
                ...corsHeaders(origin),
                "Content-Type": file.contentType || "application/octet-stream",
                "Content-Length": file.size.toString(),
                "Content-Disposition": `inline; filename="${file.filename}"`
            }
        });
    } catch (e: any) {
        console.error("WebDAV GET download error:", e);
        return new Response(e.message || "Download failed", { status: 500, headers: corsHeaders(origin) });
    }
}

// PUT Handler
export async function PUT(
    request: Request,
    props: { params: Promise<{ path?: string[] }> }
) {
    const params = await props.params;
    const origin = request.headers.get('origin');
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    const path = params.path || [];
    if (path.length < 2) {
        return new Response("Cannot write directly to root or namespace directory", { status: 400, headers: corsHeaders(origin) });
    }

    const namespace = path[0];
    const filename = path.slice(1).join('/');

    // Check if namespace exists, if not create it
    await redis.sadd(`user:${userId}:namespaces`, namespace);

    try {
        const arrayBuffer = await request.arrayBuffer();
        const size = arrayBuffer.byteLength;
        const contentType = request.headers.get("Content-Type") || "application/octet-stream";

        const id = nanoid(6);
        const key = `${id}-${filename.split('/').pop()}`;

        // Upload directly to R2 bucket
        const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
            Body: Buffer.from(arrayBuffer),
            ContentType: contentType,
            ContentLength: size,
        });
        await r2.send(command);

        // Store metadata
        const metadata = {
            id,
            key,
            filename,
            size,
            contentType,
            uploadedAt: Date.now(),
            namespace
        };
        await redis.set(`file:${id}`, metadata, { ex: 86400 }); // Ephemeral 24h

        // Add to namespace files list & user files history list
        await redis.sadd(`namespace:${userId}:${namespace}:files`, id);
        await redis.lpush(`user:${userId}:files`, id);

        return new Response("Created", {
            status: 201,
            headers: {
                ...corsHeaders(origin),
                "Location": `/webdav/${namespace}/${encodeURIComponent(filename)}`
            }
        });
    } catch (e: any) {
        console.error("WebDAV PUT upload error:", e);
        return new Response(e.message || "Upload failed", { status: 500, headers: corsHeaders(origin) });
    }
}

// MKCOL Handler (Create Directory / Namespace)
export async function MKCOL(
    request: Request,
    props: { params: Promise<{ path?: string[] }> }
) {
    const params = await props.params;
    const origin = request.headers.get('origin');
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    const path = params.path || [];
    if (path.length !== 1) {
        return new Response("MKCOL only supported for top-level namespace directories", { status: 400, headers: corsHeaders(origin) });
    }

    const namespace = path[0];
    await redis.sadd(`user:${userId}:namespaces`, namespace);

    return new Response("Created", { status: 201, headers: corsHeaders(origin) });
}

// DELETE Handler
export async function DELETE(
    request: Request,
    props: { params: Promise<{ path?: string[] }> }
) {
    const params = await props.params;
    const origin = request.headers.get('origin');
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    const path = params.path || [];
    if (path.length === 0) {
        return new Response("Cannot delete root directory", { status: 400, headers: corsHeaders(origin) });
    }

    if (path.length === 1) {
        // --- Delete entire namespace ---
        const namespace = path[0];
        const files = await getNamespaceFiles(userId, namespace);

        for (const file of files) {
            try {
                await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: file.key }));
                await redis.del(`file:${file.id}`);
            } catch (e) {
                console.error("Failed to delete object from R2:", file.key, e);
            }
        }

        await redis.del(`namespace:${userId}:${namespace}:files`);
        await redis.srem(`user:${userId}:namespaces`, namespace);

        return new Response("No Content", { status: 204, headers: corsHeaders(origin) });
    } else {
        // --- Delete single file ---
        const namespace = path[0];
        const filename = path.slice(1).join('/');
        const files = await getNamespaceFiles(userId, namespace);
        const file = files.find(f => f.filename === filename);

        if (!file) {
            return new Response("File not found", { status: 404, headers: corsHeaders(origin) });
        }

        try {
            await r2.send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: file.key }));
        } catch (e) {
            console.error("Failed to delete object from R2:", file.key, e);
        }

        await redis.del(`file:${file.id}`);
        await redis.srem(`namespace:${userId}:${namespace}:files`, file.id);

        return new Response("No Content", { status: 204, headers: corsHeaders(origin) });
    }
}

// MOVE Handler (Rename / Move File)
export async function MOVE(
    request: Request,
    props: { params: Promise<{ path?: string[] }> }
) {
    const params = await props.params;
    const origin = request.headers.get('origin');
    const userId = await getUserIdFromAuth(request);
    if (!userId) {
        return new Response("Unauthorized", { status: 401, headers: corsHeaders(origin) });
    }

    const path = params.path || [];
    if (path.length < 2) {
        return new Response("MOVE only supported on file paths", { status: 400, headers: corsHeaders(origin) });
    }

    const destHeader = request.headers.get("Destination");
    if (!destHeader) {
        return new Response("Missing Destination header", { status: 400, headers: corsHeaders(origin) });
    }

    try {
        // Parse Destination (e.g. http://domain.com/webdav/namespace/newfile.txt)
        const destUrl = new URL(destHeader);
        const destPathParts = destUrl.pathname.split("/").filter(Boolean);
        // Exclude the 'webdav' prefix part if exists
        const startIndex = destPathParts.indexOf("webdav");
        const cleanDestParts = startIndex !== -1 ? destPathParts.slice(startIndex + 1) : destPathParts;

        if (cleanDestParts.length < 2) {
            return new Response("Invalid Destination path", { status: 400, headers: corsHeaders(origin) });
        }

        const srcNamespace = path[0];
        const srcFilename = path.slice(1).join('/');
        const destNamespace = cleanDestParts[0];
        const destFilename = cleanDestParts.slice(1).join('/');

        const srcFiles = await getNamespaceFiles(userId, srcNamespace);
        const file = srcFiles.find(f => f.filename === srcFilename);

        if (!file) {
            return new Response("Source file not found", { status: 404, headers: corsHeaders(origin) });
        }

        // Update file metadata with new namespace and name
        const updatedMetadata = {
            ...file,
            filename: destFilename,
            namespace: destNamespace
        };
        await redis.set(`file:${file.id}`, updatedMetadata, { keepTtl: true });

        // If namespace changed, relocate inside Redis sets
        if (srcNamespace !== destNamespace) {
            await redis.srem(`namespace:${userId}:${srcNamespace}:files`, file.id);
            await redis.sadd(`namespace:${userId}:${destNamespace}:files`, file.id);
            await redis.sadd(`user:${userId}:namespaces`, destNamespace);
        }

        return new Response("Created", { status: 201, headers: corsHeaders(origin) });
    } catch (e: any) {
        console.error("MOVE error:", e);
        return new Response(e.message || "MOVE failed", { status: 500, headers: corsHeaders(origin) });
    }
}
