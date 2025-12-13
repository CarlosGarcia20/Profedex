import { useState, useEffect } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            if (localStorage.getItem("theme") === "dark" ||
                (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                return "dark";
            }
        }
        return "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const changeTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    };

    return (
        <button
            onClick={changeTheme}
            className={`
                relative p-2 rounded-full transition-all duration-300 
                hover:scale-110 active:scale-95 overflow-hidden
                bg-gray-200 text-yellow-600 
                dark:bg-gray-700 dark:text-yellow-400
                shadow-inner
            `}
            title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                    <motion.div
                        key="sun"
                        initial={{ rotate: -180, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 180, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                    >
                        <IoSunny className="w-5 h-5" />
                    </motion.div>
                ) : (
                        <motion.div
                            key="moon"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <IoMoon className="w-5 h-5" />
                        </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}