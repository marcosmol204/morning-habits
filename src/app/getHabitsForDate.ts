import { cookies } from "next/headers";

export async function getHabitsForDate(date: string) {
    // Forward the session cookie for authentication
    const cookie = cookies().toString();
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/habits?date=${date}`,
        { headers: { Cookie: cookie } }
    );
    if (!res.ok) return { habits: {}, habitInputs: {} };
    return res.json();
}
