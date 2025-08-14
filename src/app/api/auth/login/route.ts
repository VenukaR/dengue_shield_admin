import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in a real app, this would be a proper database
const users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@health.gov',
    phone: '+1-555-0123',
    password: 'hashedPassword123', // In real app, this would be properly hashed
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (in real app, compare hashed passwords)
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token (in real app, use proper JWT with expiration)
    const token = `token_${user.id}_${Date.now()}`;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
