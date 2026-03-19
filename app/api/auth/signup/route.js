import { hash } from "bcryptjs";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    const name = (body?.name || "").trim();
    const email = (body?.email || "").trim().toLowerCase();
    const password = body?.password || "";

    if (!name || !email || !password) {
      return Response.json({ error: "All fields are required." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: "Invalid email format." }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    await connectDB();
    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "Email already in use." }, { status: 409 });
    }

    const passwordHash = await hash(password, 10);
    await User.create({ name, email, passwordHash });

    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Signup failed. Try again." }, { status: 500 });
  }
}
