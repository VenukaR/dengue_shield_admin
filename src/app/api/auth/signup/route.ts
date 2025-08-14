import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in a real app, this would be a proper database
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@health.gov',
    phone: '+1-555-0123',
    password: 'hashedPassword123',
  },
];

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    // Validate input
    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate government email
    const isGovEmail = email.toLowerCase().includes('.gov') || 
                     email.toLowerCase().includes('government') ||
                     email.toLowerCase().includes('dept') ||
                     email.toLowerCase().includes('ministry');
    
    if (!isGovEmail) {
      return NextResponse.json(
        { message: 'Please use a government email address' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user (in real app, hash the password)
    const newUser = {
      id: (users.length + 1).toString(),
      name,
      email,
      phone,
      password, // In real app, hash this password
    };

    users.push(newUser);

    return NextResponse.json({
      message: 'Account created successfully',
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
