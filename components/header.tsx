import {FaGithub} from "react-icons/fa";

export default function Header() {
    return (
        <header className="flex w-full items-center justify-center">
            <a href="https://github.com/CanKorkmazim/anon-chat" target="_blank" className="flex items-center justify-center p-2 rounded text-3xl bg-zinc-300 text-gray-900 hover:bg-gray-900 hover:text-gray-300 shadow outline-none">
                <FaGithub/>
            </a>
        </header>
    )
}