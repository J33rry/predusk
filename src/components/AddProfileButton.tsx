import Link from "next/link";

export default function AddProfileButton() {
    return (
        <Link href="/profile/new" className="button-primary">
            + Add Profile
        </Link>
    );
}
