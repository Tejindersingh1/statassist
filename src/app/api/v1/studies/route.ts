import { NextRequest, NextResponse } from 'next/server';

// In-memory store for studies
let studies: any[] = [];
let nextId = 1;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, design_type } = body;
    if (!title || !description || !design_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newStudy = {
      id: nextId++,
      title,
      description,
      design_type,
      created_at: new Date().toISOString(),
    };
    studies.push(newStudy);
    return NextResponse.json(newStudy, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
} 