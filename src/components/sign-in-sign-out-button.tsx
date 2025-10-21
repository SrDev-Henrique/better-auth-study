import Link from "next/link";
import { Button } from "./ui/button";

export default function SignInSignOutButton() {
    return (
        <Button asChild>
            <Link href="/auth/login">Entrar / Criar conta</Link>
        </Button>
    )
}