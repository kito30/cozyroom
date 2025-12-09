import Link from "next/link";

const Nav = () => {
    return (
        <div className="border-b border-gray-200">
            <div className="flex justify-between items-center m-4 ">
                <div>
                    <Link href="/">Home</Link>
                </div>
                <div className="flex gap-4">
                    <Link href="/account">Account</Link>
                </div>
            </div>
        </div>
       
    )
}
export default Nav;