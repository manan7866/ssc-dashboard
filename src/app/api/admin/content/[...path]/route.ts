import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define allowed file extensions for security
const ALLOWED_EXTENSIONS = ['.json', '.txt', '.html', '.md', '.csv'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Get the requested path and normalize it
    let filePath = params.path.join('/');

    // Sanitize the path to prevent directory traversal
    filePath = filePath.replace(/(\.\.\/|\.\.\\)/g, '');

    // Construct the full path to the content file
    const basePath = path.join(process.cwd(), 'content', 'prod');
    const fullPath = path.resolve(basePath, filePath);

    // Security check: Ensure the resolved path is within the allowed directory
    if (!fullPath.startsWith(path.resolve(basePath))) {
      // Determine origin based on environment and request
      const requestOrigin = request.headers.get('origin');
      const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

      // Since we removed credentials, we can use specific origins
      // Check against allowed origins
      const allowedOrigins = [
        'https://ssc-web-pearl.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:6020',
        process.env.NEXT_PUBLIC_WEBSITE_URL
      ].filter(Boolean); // Remove undefined/null values

      let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        origin = requestOrigin;
      } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
        origin = envOrigin;
      }

      return new Response(JSON.stringify({
        success: false,
        status: 400,
        message: 'Invalid path',
        data: null
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
          'Vary': 'Origin',
        },
      });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      // Determine origin based on environment and request
      const requestOrigin = request.headers.get('origin');
      const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

      // Since we removed credentials, we can use specific origins
      // Check against allowed origins
      const allowedOrigins = [
        'https://ssc-web-pearl.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:6020',
        process.env.NEXT_PUBLIC_WEBSITE_URL
      ].filter(Boolean); // Remove undefined/null values

      let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        origin = requestOrigin;
      } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
        origin = envOrigin;
      }

      return new Response(JSON.stringify({
        success: false,
        status: 404,
        message: 'File not found',
        data: null
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
          'Vary': 'Origin',
        },
      });
    }

    // Check if it's a directory
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      // List directory contents with security filtering
      const files = fs.readdirSync(fullPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext) || fs.statSync(path.join(fullPath, file)).isDirectory();
      });

      // Determine origin based on environment and request
      const requestOrigin = request.headers.get('origin');
      const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

      // Since we removed credentials, we can use specific origins
      // Check against allowed origins
      const allowedOrigins = [
        'https://ssc-web-pearl.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:6020',
        process.env.NEXT_PUBLIC_WEBSITE_URL
      ].filter(Boolean); // Remove undefined/null values

      let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        origin = requestOrigin;
      } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
        origin = envOrigin;
      }

      return new Response(JSON.stringify({
        success: true,
        status: 200,
        message: 'Directory listing retrieved successfully',
        data: { files }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
          'Vary': 'Origin',
        },
      });
    }

    // Validate file extension
    const fileExtension = path.extname(fullPath).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      // Determine origin based on environment and request
      const requestOrigin = request.headers.get('origin');
      const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

      // Since we removed credentials, we can use specific origins
      // Check against allowed origins
      const allowedOrigins = [
        'https://ssc-web-pearl.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:6020',
        process.env.NEXT_PUBLIC_WEBSITE_URL
      ].filter(Boolean); // Remove undefined/null values

      let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        origin = requestOrigin;
      } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
        origin = envOrigin;
      }

      return new Response(JSON.stringify({
        success: false,
        status: 403,
        message: 'File type not allowed',
        data: null
      }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
          'Vary': 'Origin',
        },
      });
    }

    // Check file size to prevent large file reads
    if (stats.size > MAX_FILE_SIZE) {
      // Determine origin based on environment and request
      const requestOrigin = request.headers.get('origin');
      const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

      // Since we removed credentials, we can use specific origins
      // Check against allowed origins
      const allowedOrigins = [
        'https://ssc-web-pearl.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:6020',
        process.env.NEXT_PUBLIC_WEBSITE_URL
      ].filter(Boolean); // Remove undefined/null values

      let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

      if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        origin = requestOrigin;
      } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
        origin = envOrigin;
      }

      return new Response(JSON.stringify({
        success: false,
        status: 413,
        message: 'File too large',
        data: null
      }), {
        status: 413,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
          'Vary': 'Origin',
        },
      });
    }

    // Read the file
    const fileContent = fs.readFileSync(fullPath, 'utf8');

    // Determine content type based on file extension
    let contentType = 'application/json';
    if (fullPath.endsWith('.json')) {
      contentType = 'application/json';
    } else if (fullPath.endsWith('.txt')) {
      contentType = 'text/plain';
    } else if (fullPath.endsWith('.html')) {
      contentType = 'text/html';
    } else if (fullPath.endsWith('.md')) {
      contentType = 'text/markdown';
    } else if (fullPath.endsWith('.csv')) {
      contentType = 'text/csv';
    }

    // Determine origin based on environment and request
    const requestOrigin = request.headers.get('origin');
    const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

    // Since we removed credentials, we can use specific origins
    // Check against allowed origins
    const allowedOrigins = [
      'https://ssc-web-pearl.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:6020',
      process.env.NEXT_PUBLIC_WEBSITE_URL
    ].filter(Boolean); // Remove undefined/null values

    let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      origin = requestOrigin;
    } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
      origin = envOrigin;
    }

    // Parse the file content if it's JSON to wrap it in the expected response format
    let responseData;
    if (contentType === 'application/json') {
      try {
        const parsedData = JSON.parse(fileContent);
        responseData = JSON.stringify({
          success: true,
          status: 200,
          message: 'Success',
          data: parsedData
        });
      } catch (parseError) {
        // If JSON parsing fails, return as-is but wrapped
        responseData = JSON.stringify({
          success: true,
          status: 200,
          message: 'Success',
          data: { content: fileContent }
        });
      }
    } else {
      // For non-JSON files, wrap the content appropriately
      responseData = JSON.stringify({
        success: true,
        status: 200,
        message: 'Success',
        data: {
          content: fileContent,
          type: contentType
        }
      });
    }

    // Return the wrapped response with comprehensive CORS headers
    return new Response(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json', // Always return JSON for consistency
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Vary': 'Origin',
        'Content-Length': Buffer.byteLength(responseData).toString(),
      },
    });
  } catch (error) {
    console.error('Error serving content:', error);
    // Determine origin based on environment and request
    const requestOrigin = request.headers.get('origin');
    const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

    // Since we removed credentials, we can use specific origins
    // Check against allowed origins
    const allowedOrigins = [
      'https://ssc-web-pearl.vercel.app',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:6020',
      process.env.NEXT_PUBLIC_WEBSITE_URL
    ].filter(Boolean); // Remove undefined/null values

    let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

    if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
      origin = requestOrigin;
    } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
      origin = envOrigin;
    }

    return new Response(JSON.stringify({
      success: false,
      status: 500,
      message: 'Internal server error',
      data: null
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
        'Vary': 'Origin',
      },
    });
  }
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(request: NextRequest) {
  // Determine origin based on environment and request
  const requestOrigin = request.headers.get('origin');
  const envOrigin = process.env.NEXT_PUBLIC_WEBSITE_URL;

  // Since we removed credentials, we can use specific origins
  // Check against allowed origins
  const allowedOrigins = [
    'https://ssc-web-pearl.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:6020',
    process.env.NEXT_PUBLIC_WEBSITE_URL
  ].filter(Boolean); // Remove undefined/null values

  let origin = allowedOrigins[0] || 'https://ssc-web-pearl.vercel.app'; // Default to frontend URL

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    origin = requestOrigin;
  } else if (envOrigin && allowedOrigins.includes(envOrigin)) {
    origin = envOrigin;
  }

  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Accept, Authorization, Range',
      'Vary': 'Origin',
    },
  });
}