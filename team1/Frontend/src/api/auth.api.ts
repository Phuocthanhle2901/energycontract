export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  await delay(500);
  // Mock validation
  if (!email || !password) {
    throw new Error("Email and password are required");
  }
  return {
    user: {
      id: 1,
      email,
      name: email.split("@")[0],
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    token: "mock-token-" + Date.now(),
  };
}

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  await delay(500);
  if (!email || !password || !name) {
    throw new Error("All fields are required");
  }
  return {
    user: {
      id: Math.random(),
      email,
      name,
      avatar: "https://i.pravatar.cc/150?img=" + Math.floor(Math.random() * 70),
    },
    token: "mock-token-" + Date.now(),
  };
}

export async function signOut(): Promise<void> {
  await delay(300);
}
