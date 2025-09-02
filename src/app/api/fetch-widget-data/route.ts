import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { success: false, error: 'URL parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Validate URL format
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return NextResponse.json(
        { success: false, error: 'Only HTTP and HTTPS URLs are allowed' },
        { status: 400 }
      );
    }

    // Make the API request with CORS headers
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Finance-Dashboard/1.0',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      // Add timeout
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `API returned ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract available fields from the response
    const fields = extractFields(data);
    
    return NextResponse.json({
      success: true,
      data,
      fields,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'Request timeout - API took too long to respond' },
          { status: 408 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
}

function extractFields(obj: unknown, prefix = '', maxDepth = 3, currentDepth = 0): string[] {
  if (currentDepth >= maxDepth || typeof obj !== 'object' || obj === null) {
    return [];
  }

  const fields: string[] = [];
  
  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      // For arrays, extract fields from the first element
      const firstElement = obj[0];
      if (typeof firstElement === 'object' && firstElement !== null) {
        fields.push(...extractFields(firstElement, prefix, maxDepth, currentDepth + 1));
      }
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = prefix ? `${prefix}.${key}` : key;
      fields.push(fieldPath);
      
      // Recursively extract nested fields
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        fields.push(...extractFields(value, fieldPath, maxDepth, currentDepth + 1));
      }
    }
  }
  
  return [...new Set(fields)].sort(); // Remove duplicates and sort
}
